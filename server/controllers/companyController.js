import Company from '../models/Company.js';

const fallbackCompanies = [
  {
    name: 'Google',
    industry: 'Technology',
    location: 'Mountain View, USA',
    shortDescription: 'Hiring across digital marketing, growth strategy, product storytelling, and enterprise sales.'
  },
  {
    name: 'Microsoft',
    industry: 'Cloud and Productivity',
    location: 'Redmond, USA',
    shortDescription: 'Known for commercial sales, partner development, demand generation, and global brand campaigns.'
  },
  {
    name: 'Amazon',
    industry: 'E-commerce and Cloud',
    location: 'Seattle, USA',
    shortDescription: 'Builds large-scale marketing, marketplace growth, account management, and revenue operations teams.'
  },
  {
    name: 'HubSpot',
    industry: 'Marketing SaaS',
    location: 'Cambridge, USA',
    shortDescription: 'A standout employer for inbound marketing, CRM strategy, lifecycle communication, and sales enablement.'
  },
  {
    name: 'Salesforce',
    industry: 'CRM and Enterprise Software',
    location: 'San Francisco, USA',
    shortDescription: 'Offers strong opportunities in account growth, customer success, demand generation, and solution selling.'
  },
  {
    name: 'Adobe',
    industry: 'Creative and Experience Tech',
    location: 'San Jose, USA',
    shortDescription: 'Blends content, product marketing, creative strategy, and enterprise relationship-building roles.'
  },
  {
    name: 'Deloitte',
    industry: 'Consulting',
    location: 'London, UK',
    shortDescription: 'Expands brand, consulting sales, B2B marketing, and business development talent across industries.'
  },
  {
    name: 'Accenture',
    industry: 'Consulting and Transformation',
    location: 'Dublin, Ireland',
    shortDescription: 'Supports growth through strategic communications, client acquisition, and industry-focused marketing.'
  },
  {
    name: 'Meta',
    industry: 'Media and Technology',
    location: 'Menlo Park, USA',
    shortDescription: 'Builds advertising partnerships, brand narratives, market insights, and sales strategy roles.'
  },
  {
    name: 'LinkedIn',
    industry: 'Professional Platform',
    location: 'Sunnyvale, USA',
    shortDescription: 'Well suited for talent solutions sales, brand marketing, content strategy, and B2B campaign work.'
  },
  {
    name: 'Unilever',
    industry: 'Consumer Brands',
    location: 'London, UK',
    shortDescription: 'A strong destination for brand management, category planning, consumer insights, and field growth roles.'
  },
  {
    name: 'Coca-Cola',
    industry: 'FMCG',
    location: 'Atlanta, USA',
    shortDescription: 'Combines iconic brand storytelling with channel marketing, market expansion, and trade sales execution.'
  }
];

export const getCompanies = async (_req, res) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(200).json(fallbackCompanies);
    }

    const companies = await Company.find().sort({ name: 1 }).lean();

    if (!companies.length) {
      return res.status(200).json(fallbackCompanies);
    }

    const normalizedCompanies = companies.map((company) => ({
      name: company.name,
      industry: company.industry,
      location: company.location || 'Global',
      shortDescription: company.shortDescription || company.description || 'Company profile available.'
    }));

    return res.status(200).json(normalizedCompanies);
  } catch (error) {
    return res.status(200).json(fallbackCompanies);
  }
};
