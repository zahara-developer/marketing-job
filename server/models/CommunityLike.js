import mongoose from 'mongoose';

const communityLikeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommunityPost',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

communityLikeSchema.index({ post: 1, user: 1 }, { unique: true });

const CommunityLike = mongoose.model('CommunityLike', communityLikeSchema);

export default CommunityLike;
