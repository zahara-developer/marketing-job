import express from 'express';

const router = express.Router();

const fallbackRoles = [
  {
    title: 'Digital Marketing Executive',
    description: 'Plans digital campaigns and growth execution.',
    category: 'Marketing',
    location: 'Bengaluru',
    salaryRange: 'INR 3 LPA - INR 6 LPA',
    skills: ['SEO', 'Google Ads', 'Reporting']
  },
  {
    title: 'Sales Executive',
    description: 'Handles client conversations and deal follow-ups.',
    category: 'Sales',
    location: 'Mumbai',
    salaryRange: 'INR 2.8 LPA - INR 5.5 LPA',
    skills: ['Lead Generation', 'Negotiation', 'Client Meetings']
  },
  {
    title: 'Business Development Executive',
    description: 'Supports outbound growth and partner acquisition.',
    category: 'Growth',
    location: 'Gurgaon',
    salaryRange: 'INR 3 LPA - INR 6.5 LPA',
    skills: ['Prospecting', 'CRM', 'Partnerships']
  },
  {
    title: 'Marketing Analyst',
    description: 'Tracks performance trends and campaign metrics.',
    category: 'Analytics',
    location: 'Hyderabad',
    salaryRange: 'INR 4 LPA - INR 7 LPA',
    skills: ['Google Analytics', 'Excel', 'Data Visualization']
  },
  {
    title: 'SEO Executive',
    description: 'Improves rankings through content and SEO fixes.',
    category: 'Marketing',
    location: 'Pune',
    salaryRange: 'INR 2.5 LPA - INR 5 LPA',
    skills: ['Keyword Research', 'Technical SEO', 'Content SEO']
  },
  {
    title: 'Social Media Executive',
    description: 'Runs social content and engagement calendars.',
    category: 'Content',
    location: 'Mumbai',
    salaryRange: 'INR 3 LPA - INR 5.5 LPA',
    skills: ['Content Planning', 'Social Media', 'Community Management']
  },
  {
    title: 'Inside Sales Associate',
    description: 'Qualifies leads and supports demo conversations.',
    category: 'Sales',
    location: 'Chennai',
    salaryRange: 'INR 3 LPA - INR 6 LPA',
    skills: ['Lead Qualification', 'CRM', 'Product Demo']
  },
  {
    title: 'Territory Sales Officer',
    description: 'Supports regional distributor and retail growth.',
    category: 'Field Sales',
    location: 'Delhi',
    salaryRange: 'INR 3.5 LPA - INR 6.5 LPA',
    skills: ['Field Sales', 'Distribution', 'Target Management']
  },
  {
    title: 'Brand Executive',
    description: 'Coordinates brand campaigns and product messaging.',
    category: 'Brand',
    location: 'Mumbai',
    salaryRange: 'INR 4 LPA - INR 7 LPA',
    skills: ['Brand Communication', 'Campaign Planning', 'Consumer Insights']
  },
  {
    title: 'CRM Executive',
    description: 'Manages retention journeys and CRM automation.',
    category: 'Lifecycle',
    location: 'Bengaluru',
    salaryRange: 'INR 3.5 LPA - INR 6 LPA',
    skills: ['Email Automation', 'Segmentation', 'Retention']
  },
  {
    title: 'Performance Marketing Specialist',
    description: 'Optimizes paid media for measurable growth.',
    category: 'Performance',
    location: 'Hyderabad',
    salaryRange: 'INR 5 LPA - INR 9 LPA',
    skills: ['Paid Media', 'ROAS', 'Attribution']
  },
  {
    title: 'Market Research Analyst',
    description: 'Studies customers, demand, and competitors.',
    category: 'Insights',
    location: 'Pune',
    salaryRange: 'INR 4 LPA - INR 7.5 LPA',
    skills: ['Consumer Research', 'Competitive Analysis', 'Reporting']
  },
  {
    title: 'Account Manager',
    description: 'Handles key client relationships and renewals.',
    category: 'Client Success',
    location: 'Noida',
    salaryRange: 'INR 4.5 LPA - INR 8 LPA',
    skills: ['Client Management', 'Upselling', 'Reporting']
  },
  {
    title: 'Growth Marketing Associate',
    description: 'Supports experiments across acquisition channels.',
    category: 'Growth',
    location: 'Bengaluru',
    salaryRange: 'INR 4 LPA - INR 7 LPA',
    skills: ['A/B Testing', 'Funnels', 'Analytics']
  },
  {
    title: 'Media Planning Executive',
    description: 'Coordinates channel planning and media budgets.',
    category: 'Media',
    location: 'Mumbai',
    salaryRange: 'INR 3.5 LPA - INR 6.5 LPA',
    skills: ['Media Planning', 'Budgeting', 'Campaign Coordination']
  },
  {
    title: 'Email Marketing Specialist',
    description: 'Builds campaign journeys and retention email flows.',
    category: 'Lifecycle',
    location: 'Chennai',
    salaryRange: 'INR 3.8 LPA - INR 6.8 LPA',
    skills: ['Email Campaigns', 'Automation', 'Segmentation']
  },
  {
    title: 'Lead Generation Associate',
    description: 'Builds prospect lists and sales-ready leads.',
    category: 'Sales',
    location: 'Gurgaon',
    salaryRange: 'INR 2.8 LPA - INR 5 LPA',
    skills: ['Prospecting', 'CRM', 'Outbound']
  },
  {
    title: 'Retail Sales Officer',
    description: 'Supports store performance and channel sales.',
    category: 'Retail Sales',
    location: 'Delhi',
    salaryRange: 'INR 3 LPA - INR 5.5 LPA',
    skills: ['Retail Sales', 'Merchandising', 'Targets']
  },
  {
    title: 'Content Marketing Associate',
    description: 'Creates campaign content for brand and demand.',
    category: 'Content',
    location: 'Pune',
    salaryRange: 'INR 3.2 LPA - INR 5.8 LPA',
    skills: ['Content Writing', 'SEO', 'Campaign Support']
  },
  {
    title: 'Sales Operations Coordinator',
    description: 'Keeps pipeline reporting and CRM workflows clean.',
    category: 'Sales Operations',
    location: 'Hyderabad',
    salaryRange: 'INR 4 LPA - INR 6.5 LPA',
    skills: ['CRM Hygiene', 'Reporting', 'Pipeline Support']
  },
  {
    title: 'Influencer Marketing Executive',
    description: 'Manages creator outreach and collaboration briefs.',
    category: 'Marketing',
    location: 'Mumbai',
    salaryRange: 'INR 3.5 LPA - INR 6 LPA',
    skills: ['Creator Outreach', 'Campaigns', 'Negotiation']
  },
  {
    title: 'Regional Business Associate',
    description: 'Supports territory expansion and partner coordination.',
    category: 'Business',
    location: 'Noida',
    salaryRange: 'INR 3.8 LPA - INR 6.2 LPA',
    skills: ['Partnerships', 'Coordination', 'Market Expansion']
  }
];

router.get('/', async (_req, res) => {
  try {
    const { default: Role } = await import('../models/Role.js');
    const roles = await Role.find().sort({ createdAt: 1 }).lean();

    if (!roles.length) {
      return res.status(200).json(fallbackRoles);
    }

    return res.status(200).json(roles);
  } catch (error) {
    return res.status(200).json(fallbackRoles);
  }
});

export default router;
