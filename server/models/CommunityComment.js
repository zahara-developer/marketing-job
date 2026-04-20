import mongoose from 'mongoose';

const communityCommentSchema = new mongoose.Schema(
  {
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community',
      required: true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommunityPost',
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    authorName: {
      type: String,
      required: true,
      trim: true
    },
    authorRole: {
      type: String,
      default: '',
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const CommunityComment = mongoose.model('CommunityComment', communityCommentSchema);

export default CommunityComment;
