import jwt from 'jsonwebtoken';
import Community from '../models/Community.js';
import CommunityComment from '../models/CommunityComment.js';
import CommunityLike from '../models/CommunityLike.js';
import CommunityMember from '../models/CommunityMember.js';
import CommunityPost from '../models/CommunityPost.js';
import Connection from '../models/Connection.js';
import User from '../models/User.js';
import defaultCommunities from '../data/defaultCommunities.js';

const authorSelect = '_id fullName roleInterested experienceLevel bio location currentCompany';

const getOptionalUser = async (req) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'marketing-sales-secret');

    return User.findById(decoded.id).select(authorSelect);
  } catch (_error) {
    return null;
  }
};

const buildInitials = (value = '') =>
  value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

const serializeAuthor = (author, fallbackName = 'Community member', fallbackRole = '') => ({
  _id: author?._id || '',
  fullName: author?.fullName || fallbackName,
  roleInterested: author?.roleInterested || fallbackRole || '',
  experienceLevel: author?.experienceLevel || '',
  bio: author?.bio || '',
  location: author?.location || '',
  currentCompany: author?.currentCompany || '',
  initials: buildInitials(author?.fullName || fallbackName)
});

const serializeCommunity = (community, options = {}) => ({
  _id: community._id,
  slug: community.slug,
  title: community.title,
  shortDescription: community.shortDescription,
  description: community.description,
  iconKey: community.iconKey,
  bannerText: community.bannerText,
  memberCount: options.memberCount ?? community.memberCount ?? 0,
  joined: Boolean(options.joined),
  joinedAt: options.joinedAt || null,
  discussionCount: options.discussionCount ?? 0
});

const serializeComment = (comment, currentUserId = '') => ({
  _id: comment._id,
  content: comment.content,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  author: serializeAuthor(comment.author, comment.authorName, comment.authorRole),
  canEdit: currentUserId ? comment.author?._id?.toString() === currentUserId : false
});

const serializePost = (post, options = {}) => ({
  _id: post._id,
  title: post.title,
  content: post.content,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  author: serializeAuthor(post.author, post.authorName, post.authorRole),
  likeCount: options.likeCount ?? post.likeCount ?? 0,
  commentCount: Array.isArray(options.comments) ? options.comments.length : 0,
  comments: options.comments || [],
  likedByCurrentUser: Boolean(options.likedByCurrentUser),
  canEdit: options.currentUserId
    ? post.author?._id?.toString() === options.currentUserId
    : false
});

const countMembersForCommunity = async (communityId) => CommunityMember.countDocuments({ community: communityId });

const countPostsForCommunity = async (communityId) => CommunityPost.countDocuments({ community: communityId });

const findMembership = (userId, communityId) =>
  CommunityMember.findOne({
    community: communityId,
    user: userId
  });

const ensureMembership = async (userId, communityId) => {
  const membership = await findMembership(userId, communityId);

  if (!membership) {
    throw new Error('Please join the community first to participate in discussions.');
  }

  return membership;
};

const syncCommunityMemberCount = async (community) => {
  const memberCount = await countMembersForCommunity(community._id);
  community.memberCount = memberCount;
  await community.save();
  return memberCount;
};

const ensureDefaultCommunities = async () => {
  const existingCommunities = await Community.find().select('slug');
  const existingSlugs = new Set(existingCommunities.map((community) => community.slug));
  const missingCommunities = defaultCommunities.filter((community) => !existingSlugs.has(community.slug));

  if (!missingCommunities.length) {
    return;
  }

  await Community.insertMany(
    missingCommunities.map((community) => ({
      ...community,
      memberCount: 0,
      joinedMembers: []
    }))
  );
};

export const getCommunities = async (req, res) => {
  try {
    await ensureDefaultCommunities();
    const viewer = await getOptionalUser(req);
    const communities = await Community.find().sort({ title: 1 });
    const communityIds = communities.map((community) => community._id);

    const [memberAggregation, discussionAggregation, memberships] = await Promise.all([
      CommunityMember.aggregate([
        { $match: { community: { $in: communityIds } } },
        { $group: { _id: '$community', count: { $sum: 1 } } }
      ]),
      CommunityPost.aggregate([
        { $match: { community: { $in: communityIds } } },
        { $group: { _id: '$community', count: { $sum: 1 } } }
      ]),
      viewer
        ? CommunityMember.find({
            community: { $in: communityIds },
            user: viewer._id
          }).select('community joinedAt')
        : Promise.resolve([])
    ]);

    const memberCounts = new Map(
      memberAggregation.map((entry) => [entry._id.toString(), entry.count])
    );
    const discussionCounts = new Map(
      discussionAggregation.map((entry) => [entry._id.toString(), entry.count])
    );
    const membershipMap = new Map(
      memberships.map((membership) => [membership.community.toString(), membership.joinedAt])
    );

    return res.status(200).json(
      communities.map((community) =>
        serializeCommunity(community, {
          memberCount: memberCounts.get(community._id.toString()) || 0,
          joined: membershipMap.has(community._id.toString()),
          joinedAt: membershipMap.get(community._id.toString()) || null,
          discussionCount: discussionCounts.get(community._id.toString()) || 0
        })
      )
    );
  } catch (_error) {
    return res.status(500).json({ message: 'Unable to load communities right now.' });
  }
};

export const getCommunityDetails = async (req, res) => {
  try {
    await ensureDefaultCommunities();
    const viewer = await getOptionalUser(req);
    const community = await Community.findOne({ slug: req.params.slug.toLowerCase() });

    if (!community) {
      return res.status(404).json({ message: 'Community not found.' });
    }

    const [membership, memberCount, posts, comments, connections] = await Promise.all([
      viewer ? findMembership(viewer._id, community._id) : Promise.resolve(null),
      countMembersForCommunity(community._id),
      CommunityPost.find({ community: community._id })
        .populate('author', authorSelect)
        .sort({ updatedAt: -1, createdAt: -1 }),
      CommunityComment.find({ community: community._id })
        .populate('author', authorSelect)
        .sort({ createdAt: 1 }),
      viewer
        ? Connection.find({
            $or: [{ requester: viewer._id }, { target: viewer._id }]
          }).select('requester target')
        : Promise.resolve([])
    ]);

    const postIds = posts.map((post) => post._id);
    const [likes, discussionCount] = await Promise.all([
      postIds.length
        ? CommunityLike.find({ post: { $in: postIds } }).select('post user')
        : Promise.resolve([]),
      countPostsForCommunity(community._id)
    ]);

    const commentMap = comments.reduce((accumulator, comment) => {
      const postId = comment.post.toString();

      if (!accumulator[postId]) {
        accumulator[postId] = [];
      }

      accumulator[postId].push(serializeComment(comment, viewer?._id?.toString() || ''));
      return accumulator;
    }, {});

    const likesByPost = likes.reduce((accumulator, like) => {
      const postId = like.post.toString();

      if (!accumulator[postId]) {
        accumulator[postId] = [];
      }

      accumulator[postId].push(like.user.toString());
      return accumulator;
    }, {});

    const connectedIds = new Set();
    connections.forEach((connection) => {
      if (connection.requester?.toString() === viewer?._id?.toString()) {
        connectedIds.add(connection.target.toString());
      } else if (connection.target?.toString() === viewer?._id?.toString()) {
        connectedIds.add(connection.requester.toString());
      }
    });

    return res.status(200).json({
      community: serializeCommunity(community, {
        memberCount,
        joined: Boolean(membership),
        joinedAt: membership?.joinedAt || null,
        discussionCount
      }),
      posts: posts.map((post) => {
        const likeUserIds = likesByPost[post._id.toString()] || [];

        return serializePost(post, {
          comments: commentMap[post._id.toString()] || [],
          likeCount: likeUserIds.length,
          likedByCurrentUser: viewer ? likeUserIds.includes(viewer._id.toString()) : false,
          currentUserId: viewer?._id?.toString() || ''
        });
      }),
      viewerConnections: Array.from(connectedIds)
    });
  } catch (_error) {
    return res.status(500).json({ message: 'Unable to load the community right now.' });
  }
};

export const getCommunityPosts = async (req, res) => {
  try {
    await ensureDefaultCommunities();
    const community = await Community.findOne({ slug: req.params.slug.toLowerCase() });

    if (!community) {
      return res.status(404).json({ message: 'Community not found.' });
    }

    const viewer = await getOptionalUser(req);
    const posts = await CommunityPost.find({ community: community._id })
      .populate('author', authorSelect)
      .sort({ updatedAt: -1, createdAt: -1 });

    const postIds = posts.map((post) => post._id);
    const [comments, likes] = await Promise.all([
      CommunityComment.find({ community: community._id, post: { $in: postIds } })
        .populate('author', authorSelect)
        .sort({ createdAt: 1 }),
      postIds.length
        ? CommunityLike.find({ post: { $in: postIds } }).select('post user')
        : Promise.resolve([])
    ]);

    const commentMap = comments.reduce((accumulator, comment) => {
      const postId = comment.post.toString();

      if (!accumulator[postId]) {
        accumulator[postId] = [];
      }

      accumulator[postId].push(serializeComment(comment, viewer?._id?.toString() || ''));
      return accumulator;
    }, {});

    const likesByPost = likes.reduce((accumulator, like) => {
      const postId = like.post.toString();

      if (!accumulator[postId]) {
        accumulator[postId] = [];
      }

      accumulator[postId].push(like.user.toString());
      return accumulator;
    }, {});

    return res.status(200).json({
      posts: posts.map((post) => {
        const likeUserIds = likesByPost[post._id.toString()] || [];

        return serializePost(post, {
          comments: commentMap[post._id.toString()] || [],
          likeCount: likeUserIds.length,
          likedByCurrentUser: viewer ? likeUserIds.includes(viewer._id.toString()) : false,
          currentUserId: viewer?._id?.toString() || ''
        });
      })
    });
  } catch (_error) {
    return res.status(500).json({ message: 'Unable to load discussions right now.' });
  }
};

export const joinCommunity = async (req, res) => {
  try {
    await ensureDefaultCommunities();
    const community = await Community.findOne({ slug: req.params.slug.toLowerCase() });

    if (!community) {
      return res.status(404).json({ message: 'Community not found.' });
    }

    let membership = await findMembership(req.user._id, community._id);
    const wasAlreadyJoined = Boolean(membership);

    if (!membership) {
      membership = await CommunityMember.create({
        community: community._id,
        user: req.user._id
      });
      community.joinedMembers = Array.from(
        new Set([...(community.joinedMembers || []).map(String), req.user._id.toString()])
      );
    }

    const memberCount = await syncCommunityMemberCount(community);

    return res.status(200).json({
      message: wasAlreadyJoined ? 'You are already part of this community.' : 'Joined community successfully.',
      community: serializeCommunity(community, {
        memberCount,
        joined: true,
        joinedAt: membership.joinedAt,
        discussionCount: await countPostsForCommunity(community._id)
      })
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(200).json({
        message: 'You are already part of this community.'
      });
    }

    return res.status(500).json({ message: 'Unable to join the community right now.' });
  }
};

export const leaveCommunity = async (req, res) => {
  try {
    await ensureDefaultCommunities();
    const community = await Community.findOne({ slug: req.params.slug.toLowerCase() });

    if (!community) {
      return res.status(404).json({ message: 'Community not found.' });
    }

    await CommunityMember.deleteOne({
      community: community._id,
      user: req.user._id
    });

    community.joinedMembers = (community.joinedMembers || []).filter(
      (memberId) => memberId.toString() !== req.user._id.toString()
    );

    const memberCount = await syncCommunityMemberCount(community);

    return res.status(200).json({
      message: 'You have left this community.',
      community: serializeCommunity(community, {
        memberCount,
        joined: false,
        joinedAt: null,
        discussionCount: await countPostsForCommunity(community._id)
      })
    });
  } catch (_error) {
    return res.status(500).json({ message: 'Unable to leave the community right now.' });
  }
};

export const createCommunityPost = async (req, res) => {
  try {
    const { title, content } = req.body || {};

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: 'Title and post content are required.' });
    }

    await ensureDefaultCommunities();
    const community = await Community.findOne({ slug: req.params.slug.toLowerCase() });

    if (!community) {
      return res.status(404).json({ message: 'Community not found.' });
    }

    await ensureMembership(req.user._id, community._id);

    const post = await CommunityPost.create({
      community: community._id,
      author: req.user._id,
      authorName: req.user.fullName,
      authorRole: req.user.roleInterested || req.user.experienceLevel || 'Marketing & Sales Professional',
      title: title.trim(),
      content: content.trim()
    });

    const hydratedPost = await CommunityPost.findById(post._id).populate('author', authorSelect);

    return res.status(201).json({
      message: 'Discussion created successfully.',
      post: serializePost(hydratedPost, {
        comments: [],
        likeCount: 0,
        likedByCurrentUser: false,
        currentUserId: req.user._id.toString()
      })
    });
  } catch (error) {
    if (error.message === 'Please join the community first to participate in discussions.') {
      return res.status(403).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Unable to create the discussion right now.' });
  }
};

export const updateCommunityPost = async (req, res) => {
  try {
    const { title, content } = req.body || {};
    const post = await CommunityPost.findById(req.params.postId).populate('author', authorSelect);

    if (!post) {
      return res.status(404).json({ message: 'Discussion not found.' });
    }

    if (post.author?._id?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can edit only your own discussions.' });
    }

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: 'Title and post content are required.' });
    }

    post.title = title.trim();
    post.content = content.trim();
    await post.save();

    const [comments, likes] = await Promise.all([
      CommunityComment.find({ post: post._id }).populate('author', authorSelect).sort({ createdAt: 1 }),
      CommunityLike.countDocuments({ post: post._id })
    ]);

    return res.status(200).json({
      message: 'Discussion updated successfully.',
      post: serializePost(post, {
        comments: comments.map((comment) => serializeComment(comment, req.user._id.toString())),
        likeCount: likes,
        currentUserId: req.user._id.toString()
      })
    });
  } catch (_error) {
    return res.status(500).json({ message: 'Unable to update this discussion right now.' });
  }
};

export const deleteCommunityPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Discussion not found.' });
    }

    if (post.author?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can delete only your own discussions.' });
    }

    await Promise.all([
      CommunityComment.deleteMany({ post: post._id }),
      CommunityLike.deleteMany({ post: post._id }),
      CommunityPost.deleteOne({ _id: post._id })
    ]);

    return res.status(200).json({ message: 'Discussion deleted successfully.', postId: post._id });
  } catch (_error) {
    return res.status(500).json({ message: 'Unable to delete this discussion right now.' });
  }
};

export const addCommunityComment = async (req, res) => {
  try {
    const { content } = req.body || {};

    if (!content?.trim()) {
      return res.status(400).json({ message: 'Please write a comment before replying.' });
    }

    const post = await CommunityPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Discussion not found.' });
    }

    await ensureMembership(req.user._id, post.community);

    const comment = await CommunityComment.create({
      community: post.community,
      post: post._id,
      author: req.user._id,
      authorName: req.user.fullName,
      authorRole: req.user.roleInterested || req.user.experienceLevel || 'Marketing & Sales Professional',
      content: content.trim()
    });

    const hydratedComment = await CommunityComment.findById(comment._id).populate('author', authorSelect);

    return res.status(201).json({
      message: 'Reply added successfully.',
      comment: serializeComment(hydratedComment, req.user._id.toString())
    });
  } catch (error) {
    if (error.message === 'Please join the community first to participate in discussions.') {
      return res.status(403).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Unable to add your reply right now.' });
  }
};

export const toggleCommunityPostLike = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Discussion not found.' });
    }

    await ensureMembership(req.user._id, post.community);

    const existingLike = await CommunityLike.findOne({
      post: post._id,
      user: req.user._id
    });

    if (existingLike) {
      await CommunityLike.deleteOne({ _id: existingLike._id });
    } else {
      await CommunityLike.create({
        post: post._id,
        user: req.user._id
      });
    }

    const likeCount = await CommunityLike.countDocuments({ post: post._id });

    return res.status(200).json({
      message: existingLike ? 'Like removed.' : 'Discussion liked.',
      likeCount,
      likedByCurrentUser: !existingLike
    });
  } catch (error) {
    if (error.message === 'Please join the community first to participate in discussions.') {
      return res.status(403).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Unable to update like status right now.' });
  }
};
