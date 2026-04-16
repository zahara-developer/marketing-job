import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    salaryRange: {
      type: String,
      required: true,
      trim: true
    },
    skills: {
      type: [String],
      required: true,
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Role = mongoose.model('Role', roleSchema);

export default Role;
