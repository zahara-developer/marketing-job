import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    iconKey: {
      type: String,
      required: true,
      trim: true
    },
    bannerText: {
      type: String,
      default: '',
      trim: true
    },
    memberCount: {
      type: Number,
      default: 0
    },
    joinedMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

const Community = mongoose.model('Community', communitySchema);

export default Community;
