import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['connected'],
      default: 'connected'
    }
  },
  {
    timestamps: true
  }
);

connectionSchema.index({ requester: 1, target: 1 }, { unique: true });

const Connection = mongoose.model('Connection', connectionSchema);

export default Connection;
