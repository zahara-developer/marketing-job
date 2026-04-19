import Company from '../models/Company.js';

const companyLogoDomains = {
  Google: 'google.com',
  Microsoft: 'microsoft.com',
  LinkedIn: 'linkedin.com',
  Amazon: 'amazon.com',
  HubSpot: 'hubspot.com',
  Salesforce: 'salesforce.com',
  Adobe: 'adobe.com',
  Shopify: 'shopify.com',
  Zoho: 'zoho.com'
};

const fallbackCompanies = [
  {
    name: 'Google',
    logo: 'https://logo.clearbit.com/google.com',
    industry: 'Technology',
    location: 'Mountain View, USA',
    shortDescription: 'Hiring across digital marketing, growth strategy, product storytelling, and enterprise sales.',
    description: 'Hiring across digital marketing, growth strategy, product storytelling, and enterprise sales.'
  },
  {
    name: 'Microsoft',
    logo: 'https://logo.clearbit.com/microsoft.com',
    industry: 'Cloud and Productivity',
    location: 'Redmond, USA',
    shortDescription: 'Known for commercial sales, partner development, demand generation, and global brand campaigns.',
    description: 'Known for commercial sales, partner development, demand generation, and global brand campaigns.'
  },
  {
    name: 'Amazon',
    logo: 'https://logo.clearbit.com/amazon.com',
    industry: 'E-commerce and Cloud',
    location: 'Seattle, USA',
    shortDescription: 'Builds large-scale marketing, marketplace growth, account management, and revenue operations teams.',
    description: 'Builds large-scale marketing, marketplace growth, account management, and revenue operations teams.'
  },
  {
    name: 'HubSpot',
    logo: 'https://logo.clearbit.com/hubspot.com',
    industry: 'Marketing SaaS',
    location: 'Cambridge, USA',
    shortDescription: 'A standout employer for inbound marketing, CRM strategy, lifecycle communication, and sales enablement.',
    description: 'A standout employer for inbound marketing, CRM strategy, lifecycle communication, and sales enablement.'
  },
  {
    name: 'Salesforce',
    logo: 'https://logo.clearbit.com/salesforce.com',
    industry: 'CRM and Enterprise Software',
    location: 'San Francisco, USA',
    shortDescription: 'Offers strong opportunities in account growth, customer success, demand generation, and solution selling.',
    description: 'Offers strong opportunities in account growth, customer success, demand generation, and solution selling.'
  },
  {
    name: 'Adobe',
    logo: 'https://logo.clearbit.com/adobe.com',
    industry: 'Creative and Experience Tech',
    location: 'San Jose, USA',
    shortDescription: 'Blends content, product marketing, creative strategy, and enterprise relationship-building roles.',
    description: 'Blends content, product marketing, creative strategy, and enterprise relationship-building roles.'
  },
  {
    name: 'Shopify',
    logo: 'https://logo.clearbit.com/shopify.com',
    industry: 'Commerce Platform',
    location: 'Ottawa, Canada',
    shortDescription: 'Known for growth marketing, partner success, merchant education, and revenue-driving commerce roles.',
    description: 'Known for growth marketing, partner success, merchant education, and revenue-driving commerce roles.'
  },
  {
    name: 'LinkedIn',
    logo: 'https://logo.clearbit.com/linkedin.com',
    industry: 'Professional Platform',
    location: 'Sunnyvale, USA',
    shortDescription: 'Well suited for talent solutions sales, brand marketing, content strategy, and B2B campaign work.',
    description: 'Well suited for talent solutions sales, brand marketing, content strategy, and B2B campaign work.'
  },
  {
    name: 'Zoho',
    logo: 'https://logo.clearbit.com/zoho.com',
    industry: 'Business Software',
    location: 'Chennai, India',
    shortDescription: 'Supports CRM, campaign execution, demand generation, and software-led sales growth roles.',
    description: 'Supports CRM, campaign execution, demand generation, and software-led sales growth roles.'
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
      logo: company.logo || (companyLogoDomains[company.name] ? `https://logo.clearbit.com/${companyLogoDomains[company.name]}` : ''),
      industry: company.industry,
      location: company.location || 'Global',
      shortDescription: company.shortDescription || company.description || 'Company profile available.',
      description: company.description || company.shortDescription || 'Company profile available.'
    }));

    return res.status(200).json(normalizedCompanies);
  } catch (error) {
    return res.status(200).json(fallbackCompanies);
  }
};
