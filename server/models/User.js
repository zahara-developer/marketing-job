import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    roleInterested: {
      type: String,
      trim: true,
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    preferredLocation: {
      type: String,
      trim: true,
      default: ''
    },
    experienceLevel: {
      type: String,
      trim: true,
      default: ''
    },
    currentCompany: {
      type: String,
      trim: true,
      default: ''
    },
    bio: {
      type: String,
      trim: true,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    education: {
      type: [
        {
          degree: {
            type: String,
            trim: true,
            default: ''
          },
          institution: {
            type: String,
            trim: true,
            default: ''
          },
          year: {
            type: String,
            trim: true,
            default: ''
          },
          field: {
            type: String,
            trim: true,
            default: ''
          },
          grade: {
            type: String,
            trim: true,
            default: ''
          }
        }
      ],
      default: []
    },
    resume: {
      filename: {
        type: String,
        trim: true,
        default: ''
      },
      originalName: {
        type: String,
        trim: true,
        default: ''
      },
      filepath: {
        type: String,
        trim: true,
        default: ''
      },
      mimetype: {
        type: String,
        trim: true,
        default: ''
      },
      size: {
        type: Number,
        default: 0
      },
      uploadDate: {
        type: Date,
        default: null
      }
    },
    loginCount: {
      type: Number,
      default: 0
    },
    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

export default User;
