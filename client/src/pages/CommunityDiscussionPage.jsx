import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Heart,
  MessageCircle,
  PencilLine,
  Send,
  Trash2,
  Users
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import RevealSection from '../components/RevealSection';
import CommunityMemberModal from '../components/CommunityMemberModal';
import { useAuth } from '../context/AuthContext';
import { fetchCommunityEndpoint } from '../data/communityApi';
import { communityIconMap } from '../data/communityMeta';
import { API } from '../data/siteContent';

const pollingIntervalMs = 20000;

const formatTimestamp = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString();
};

function CommunityDiscussionPage() {
  const { slug } = useParams();
  const { token, isAuthenticated } = useAuth();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [postDraft, setPostDraft] = useState({ title: '', content: '' });
  const [commentDrafts, setCommentDrafts] = useState({});
  const [editingPostId, setEditingPostId] = useState('');
  const [editingDraft, setEditingDraft] = useState({ title: '', content: '' });
  const [submittingPost, setSubmittingPost] = useState(false);
  const [joining, setJoining] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState('');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileModalLoading, setProfileModalLoading] = useState(false);
  const [profileModalData, setProfileModalData] = useState(null);
  const [connectStatus, setConnectStatus] = useState({ type: '', text: '' });
  const [connecting, setConnecting] = useState(false);

  const Icon = useMemo(() => {
    if (!community?.iconKey) {
      return Users;
    }

    return communityIconMap[community.iconKey] || Users;
  }, [community?.iconKey]);

  const fetchConnections = useCallback(async () => {
    if (!token) {
      setConnections([]);
      return;
    }

    try {
      const response = await fetch(`${API}/users/connections`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to load your connections.');
      }

      setConnections(Array.isArray(result.connections) ? result.connections : []);
    } catch (_error) {
      setConnections([]);
    }
  }, [token]);

  const loadCommunity = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (!silent) {
          setLoading(true);
        }

        const result = await fetchCommunityEndpoint(
          `/${slug}`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`
                }
              : {}
          },
          'Unable to load community right now.'
        );

        setCommunity(result.community);
        setPosts(Array.isArray(result.posts) ? result.posts : []);
        if (!silent) {
          setStatus({ type: '', text: '' });
        }
      } catch (fetchError) {
        setStatus({ type: 'error', text: 'Unable to load community right now.' });
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [slug, token]
  );

  useEffect(() => {
    loadCommunity();
  }, [loadCommunity]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConnections();
    }
  }, [fetchConnections, isAuthenticated]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadCommunity({ silent: true });
    }, pollingIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [loadCommunity]);

  const handleJoinToggle = async () => {
    if (!isAuthenticated) {
      setStatus({ type: 'error', text: 'Please log in to join the community.' });
      return;
    }

    try {
      setJoining(true);
      const action = community?.joined ? 'leave' : 'join';
      const result = await fetchCommunityEndpoint(
        `/${slug}/${action}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        'Community action failed'
      );

      setCommunity(result.community);
      setStatus({ type: 'success', text: result.message });
    } catch (_joinError) {
      setStatus({ type: 'error', text: 'Community action failed' });
    } finally {
      setJoining(false);
    }
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setStatus({ type: 'error', text: 'Please log in first to create a discussion.' });
      return;
    }

    try {
      setSubmittingPost(true);
      const result = await fetchCommunityEndpoint(
        `/${slug}/posts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(postDraft)
        },
        'Unable to create discussion right now.'
      );

      setPosts((prev) => [result.post, ...prev]);
      setPostDraft({ title: '', content: '' });
      setCommunity((prev) =>
        prev ? { ...prev, discussionCount: (prev.discussionCount || 0) + 1 } : prev
      );
      setStatus({ type: 'success', text: result.message });
    } catch (postError) {
      setStatus({ type: 'error', text: 'Unable to create discussion right now.' });
    } finally {
      setSubmittingPost(false);
    }
  };

  const startEditingPost = (post) => {
    setEditingPostId(post._id);
    setEditingDraft({
      title: post.title,
      content: post.content
    });
  };

  const cancelEditingPost = () => {
    setEditingPostId('');
    setEditingDraft({ title: '', content: '' });
  };

  const handleSavePost = async (postId) => {
    try {
      const result = await fetchCommunityEndpoint(
        `/posts/${postId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(editingDraft)
        },
        'Unable to update discussion right now.'
      );

      setPosts((prev) => prev.map((post) => (post._id === postId ? result.post : post)));
      cancelEditingPost();
      setStatus({ type: 'success', text: result.message });
    } catch (_error) {
      setStatus({ type: 'error', text: 'Unable to update discussion right now.' });
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const result = await fetchCommunityEndpoint(
        `/posts/${postId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        'Unable to delete discussion right now.'
      );

      setPosts((prev) => prev.filter((post) => post._id !== postId));
      setCommunity((prev) =>
        prev ? { ...prev, discussionCount: Math.max((prev.discussionCount || 1) - 1, 0) } : prev
      );
      setStatus({ type: 'success', text: result.message });
    } catch (_error) {
      setStatus({ type: 'error', text: 'Unable to delete discussion right now.' });
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!isAuthenticated) {
      setStatus({ type: 'error', text: 'Please log in first to reply to a discussion.' });
      return;
    }

    const content = (commentDrafts[postId] || '').trim();

    if (!content) {
      return;
    }

    try {
      const result = await fetchCommunityEndpoint(
        `/posts/${postId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ content })
        },
        'Unable to reply right now.'
      );

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [...post.comments, result.comment],
                commentCount: (post.commentCount || 0) + 1
              }
            : post
        )
      );
      setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
      setActiveCommentPostId('');
      setStatus({ type: 'success', text: result.message });
    } catch (_commentError) {
      setStatus({ type: 'error', text: 'Unable to reply right now.' });
    }
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      setStatus({ type: 'error', text: 'Please log in first to like a discussion.' });
      return;
    }

    try {
      const result = await fetchCommunityEndpoint(
        `/posts/${postId}/like`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        'Unable to update like right now.'
      );

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                likeCount: result.likeCount,
                likedByCurrentUser: result.likedByCurrentUser
              }
            : post
        )
      );
    } catch (_likeError) {
      setStatus({ type: 'error', text: 'Unable to update like right now.' });
    }
  };

  const openProfilePanel = async (memberId) => {
    if (!memberId) {
      return;
    }

    try {
      setProfileModalOpen(true);
      setProfileModalLoading(true);
      setConnectStatus({ type: '', text: '' });

      const response = await fetch(`${API}/users/${memberId}/community-profile`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`
            }
          : {}
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to load this profile right now.');
      }

      setProfileModalData(result.profile);
    } catch (error) {
      setProfileModalData(null);
      setConnectStatus({ type: 'error', text: error.message });
    } finally {
      setProfileModalLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!profileModalData?._id) {
      return;
    }

    if (!isAuthenticated) {
      setConnectStatus({ type: 'error', text: 'Please log in to connect with other members.' });
      return;
    }

    try {
      setConnecting(true);
      const response = await fetch(`${API}/users/${profileModalData._id}/connect`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to connect right now.');
      }

      setProfileModalData((prev) => (prev ? { ...prev, connected: true } : prev));
      setConnectStatus({ type: 'success', text: result.message });
      await fetchConnections();
    } catch (error) {
      setConnectStatus({ type: 'error', text: error.message });
    } finally {
      setConnecting(false);
    }
  };

  return (
    <>
      <RevealSection className="content-section">
        {loading ? <p className="status-text">Loading community...</p> : null}
        {!loading && community ? (
          <div className="community-discussion-shell community-discussion-shell-compact">
            <section className="community-discussion-topbar">
              <div className="community-discussion-topbar-main">
                <div className="community-card-icon community-discussion-icon">
                  <Icon size={20} />
                </div>
                <div className="community-discussion-topbar-copy">
                  <span className="section-eyebrow">Community discussion</span>
                  <h1>{community.title}</h1>
                  <p>{community.description}</p>
                </div>
              </div>
              <div className="community-discussion-topbar-actions">
                <div className="community-discussion-meta compact">
                  <span>
                    <Users size={14} />
                    {community.memberCount} members
                  </span>
                  <span>{community.discussionCount || posts.length} discussions</span>
                  <span>{community.joined ? 'Joined' : 'Not joined yet'}</span>
                </div>
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleJoinToggle}
                  disabled={joining}
                >
                  {joining ? 'Updating...' : community.joined ? 'Leave community' : 'Join community'}
                </button>
              </div>
            </section>

            {status.text ? <p className={`form-status ${status.type}`}>{status.text}</p> : null}

            {!isAuthenticated ? (
              <section className="community-login-note community-login-note-compact">
                <h3>Please log in to join the community.</h3>
                <p>You can read the discussion feed, but posting, replying, liking, and connecting require an account.</p>
                <Link to="/login" className="primary-button">Log in first</Link>
              </section>
            ) : null}

            <section className="community-discussion-layout">
              <div className="community-discussion-primary">
                <form className="community-create-post-card community-create-post-card-compact" onSubmit={handleCreatePost}>
                  <div className="community-card-header-row">
                    <div>
                      <span className="section-eyebrow">Create post</span>
                      <h2>Start a new discussion</h2>
                    </div>
                    {!community.joined ? <span className="community-inline-note">Join this community to post</span> : null}
                  </div>
                  <input
                    type="text"
                    value={postDraft.title}
                    onChange={(event) => setPostDraft((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder="Give your discussion a clear title"
                    disabled={!isAuthenticated || !community.joined || submittingPost}
                  />
                  <textarea
                    rows="4"
                    value={postDraft.content}
                    onChange={(event) => setPostDraft((prev) => ({ ...prev, content: event.target.value }))}
                    placeholder="Share your question, context, or practical insight."
                    disabled={!isAuthenticated || !community.joined || submittingPost}
                  />
                  <button type="submit" className="primary-button" disabled={!isAuthenticated || !community.joined || submittingPost}>
                    <Send size={16} />
                    {submittingPost ? 'Posting...' : 'Create Post'}
                  </button>
                </form>

                <div className="community-discussion-feed">
                  {posts.map((post) => (
                    <article key={post._id} className="community-discussion-card community-discussion-card-rich">
                      <div className="community-discussion-card-top">
                        <div className="community-discussion-title-block">
                          {editingPostId === post._id ? (
                            <div className="community-edit-form">
                              <input
                                type="text"
                                value={editingDraft.title}
                                onChange={(event) => setEditingDraft((prev) => ({ ...prev, title: event.target.value }))}
                              />
                              <textarea
                                rows="4"
                                value={editingDraft.content}
                                onChange={(event) => setEditingDraft((prev) => ({ ...prev, content: event.target.value }))}
                              />
                              <div className="community-inline-actions">
                                <button type="button" className="secondary-button" onClick={() => handleSavePost(post._id)}>
                                  Save
                                </button>
                                <button type="button" className="secondary-button" onClick={cancelEditingPost}>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <h3>{post.title}</h3>
                              <p>{post.content}</p>
                            </>
                          )}
                        </div>
                        <div className="community-post-meta">
                          <span>{formatTimestamp(post.updatedAt || post.createdAt)}</span>
                          {post.canEdit ? (
                            <div className="community-inline-actions">
                              <button type="button" className="community-action-button" onClick={() => startEditingPost(post)}>
                                <PencilLine size={15} />
                                Edit
                              </button>
                              <button type="button" className="community-action-button" onClick={() => handleDeletePost(post._id)}>
                                <Trash2 size={15} />
                                Delete
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="community-author-chip"
                        onClick={() => openProfilePanel(post.author?._id)}
                      >
                        <span className="community-author-avatar">{post.author?.initials || 'U'}</span>
                        <span>
                          <strong>{post.author?.fullName}</strong>
                          <small>{post.author?.roleInterested || 'Marketing & Sales Professional'}</small>
                        </span>
                      </button>

                      <div className="community-discussion-actions-row">
                        <button
                          type="button"
                          className={`community-action-button ${post.likedByCurrentUser ? 'liked' : ''}`}
                          onClick={() => handleLike(post._id)}
                        >
                          <Heart size={16} />
                          {post.likeCount}
                        </button>
                        <button
                          type="button"
                          className="community-action-button"
                          onClick={() => setActiveCommentPostId((prev) => (prev === post._id ? '' : post._id))}
                        >
                          <MessageCircle size={16} />
                          {post.commentCount || post.comments.length}
                        </button>
                      </div>

                      <div className="community-comment-list">
                        {post.comments.map((comment) => (
                          <div key={comment._id} className="community-comment-card">
                            <div className="community-comment-card-top">
                              <button
                                type="button"
                                className="community-comment-author"
                                onClick={() => openProfilePanel(comment.author?._id)}
                              >
                                <span className="community-comment-avatar">{comment.author?.initials || 'U'}</span>
                                <span>
                                  <strong>{comment.author?.fullName}</strong>
                                  <small>{comment.author?.roleInterested || 'Community member'}</small>
                                </span>
                              </button>
                              <span>{formatTimestamp(comment.createdAt)}</span>
                            </div>
                            <p>{comment.content}</p>
                          </div>
                        ))}
                      </div>

                      <div className="community-comment-form">
                        <textarea
                          rows="3"
                          value={commentDrafts[post._id] || ''}
                          onFocus={() => setActiveCommentPostId(post._id)}
                          onChange={(event) =>
                            setCommentDrafts((prev) => ({ ...prev, [post._id]: event.target.value }))
                          }
                          placeholder={
                            !isAuthenticated
                              ? 'Log in to reply to this discussion.'
                              : !community.joined
                                ? 'Join this community to reply.'
                                : 'Write a thoughtful reply...'
                          }
                          disabled={!isAuthenticated || !community.joined}
                        />
                        {activeCommentPostId === post._id ? (
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() => handleCommentSubmit(post._id)}
                            disabled={!isAuthenticated || !community.joined || !(commentDrafts[post._id] || '').trim()}
                          >
                            Reply
                          </button>
                        ) : null}
                      </div>
                    </article>
                  ))}

                  {!posts.length ? (
                    <p className="status-text">No discussions yet. Start the first one from this page.</p>
                  ) : null}
                </div>
              </div>

              <aside className="community-discussion-sidebar">
                <div className="community-side-card">
                  <span className="section-eyebrow">About this space</span>
                  <h3>{community.title}</h3>
                  <p>{community.bannerText}</p>
                  <div className="community-directory-badges community-directory-badges-stacked">
                    <span>{community.memberCount} members</span>
                    <span>{community.discussionCount || posts.length} discussions</span>
                    <span>{community.joined ? 'Joined community' : 'Open community'}</span>
                  </div>
                </div>

                <div className="community-side-card">
                  <span className="section-eyebrow">Your connections</span>
                  <h3>People you can message later</h3>
                  {connections.length ? (
                    <div className="community-connection-list">
                      {connections.map((connection) => (
                        <button
                          type="button"
                          key={connection._id}
                          className="community-connection-item"
                          onClick={() => openProfilePanel(connection._id)}
                        >
                          <span className="community-author-avatar">{connection.initials || 'U'}</span>
                          <span>
                            <strong>{connection.fullName}</strong>
                            <small>{connection.roleInterested || 'Marketing & Sales Professional'}</small>
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="community-side-empty">
                      Connect with members from the discussion feed to build your marketing and sales network.
                    </p>
                  )}
                </div>

                <div className="community-side-card">
                  <span className="section-eyebrow">Participation rules</span>
                  <ul className="community-side-list">
                    <li>Share practical advice, not spam.</li>
                    <li>Keep resume, interview, and job-search guidance respectful.</li>
                    <li>Join before posting, commenting, or liking discussions.</li>
                  </ul>
                </div>
              </aside>
            </section>
          </div>
        ) : null}
        {!loading && !community && status.text ? <p className={`form-status ${status.type}`}>{status.text}</p> : null}
      </RevealSection>

      <CommunityMemberModal
        open={profileModalOpen}
        profile={profileModalData}
        loading={profileModalLoading}
        connectStatus={connectStatus.text ? connectStatus : null}
        connecting={connecting}
        isAuthenticated={isAuthenticated}
        onClose={() => {
          setProfileModalOpen(false);
          setProfileModalData(null);
          setConnectStatus({ type: '', text: '' });
        }}
        onConnect={handleConnect}
      />
    </>
  );
}

export default CommunityDiscussionPage;
