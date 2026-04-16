import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    industry: {
      type: String,
      required: true,
      trim: true
    },
    openRoles: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Company = mongoose.model('Company', companySchema);

export default Company;
