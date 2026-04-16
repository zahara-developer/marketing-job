import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Role from '../models/Role.js';
import Company from '../models/Company.js';
import Resource from '../models/Resource.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const roles = [
  {
    title: 'Digital Marketing Executive',
    category: 'Marketing',
    description: 'Handles paid campaigns, SEO coordination, and digital channel execution for brand and lead growth.',
    location: 'Bengaluru',
    salaryRange: 'INR 3 LPA - INR 6 LPA',
    skills: ['Google Ads', 'SEO', 'Campaign Reporting']
  },
  {
    title: 'Sales Executive',
    category: 'Sales',
    description: 'Drives lead conversion, client meetings, and deal closure across B2B and B2C segments.',
    location: 'Mumbai',
    salaryRange: 'INR 2.8 LPA - INR 5.5 LPA',
    skills: ['Lead Generation', 'Negotiation', 'Client Management']
  },
  {
    title: 'Business Development Executive',
    category: 'Growth',
    description: 'Builds partnerships, creates outbound pipelines, and supports expansion into new business accounts.',
    location: 'Gurgaon',
    salaryRange: 'INR 3 LPA - INR 6.5 LPA',
    skills: ['Prospecting', 'CRM', 'Sales Outreach']
  },
  {
    title: 'Marketing Analyst',
    category: 'Analytics',
    description: 'Tracks campaign performance, customer trends, and channel effectiveness to improve ROI.',
    location: 'Hyderabad',
    salaryRange: 'INR 4 LPA - INR 7 LPA',
    skills: ['Excel', 'Google Analytics', 'Dashboarding']
  },
  {
    title: 'SEO Executive',
    category: 'Marketing',
    description: 'Improves website visibility through on-page SEO, keyword research, and technical optimization.',
    location: 'Pune',
    salaryRange: 'INR 2.5 LPA - INR 5 LPA',
    skills: ['Keyword Research', 'Technical SEO', 'Content Optimization']
  },
  {
    title: 'Social Media Executive',
    category: 'Content',
    description: 'Plans social content calendars, tracks engagement, and manages brand presence across platforms.',
    location: 'Mumbai',
    salaryRange: 'INR 3 LPA - INR 5.5 LPA',
    skills: ['Content Planning', 'Instagram Marketing', 'Community Management']
  },
  {
    title: 'Inside Sales Associate',
    category: 'Sales',
    description: 'Qualifies inbound leads, handles product demos, and nurtures sales opportunities remotely.',
    location: 'Chennai',
    salaryRange: 'INR 3 LPA - INR 6 LPA',
    skills: ['Cold Calling', 'Lead Qualification', 'CRM Tools']
  },
  {
    title: 'Territory Sales Officer',
    category: 'Field Sales',
    description: 'Manages regional distributor relationships, retail expansion, and on-ground sales targets.',
    location: 'Delhi',
    salaryRange: 'INR 3.5 LPA - INR 6.5 LPA',
    skills: ['Field Sales', 'Distribution', 'Target Achievement']
  },
  {
    title: 'Brand Executive',
    category: 'Brand',
    description: 'Supports product launches, campaign execution, and brand communication across markets.',
    location: 'Mumbai',
    salaryRange: 'INR 4 LPA - INR 7 LPA',
    skills: ['Brand Communication', 'Campaign Planning', 'Consumer Insights']
  },
  {
    title: 'CRM Executive',
    category: 'Lifecycle',
    description: 'Runs retention campaigns, automation journeys, and customer data segmentation initiatives.',
    location: 'Bengaluru',
    salaryRange: 'INR 3.5 LPA - INR 6 LPA',
    skills: ['Email Automation', 'Segmentation', 'Lifecycle Marketing']
  },
  {
    title: 'Performance Marketing Specialist',
    category: 'Performance',
    description: 'Optimizes paid media campaigns across Meta, Google, and marketplaces for measurable growth.',
    location: 'Hyderabad',
    salaryRange: 'INR 5 LPA - INR 9 LPA',
    skills: ['Paid Media', 'ROAS Optimization', 'Attribution']
  },
  {
    title: 'Market Research Analyst',
    category: 'Insights',
    description: 'Studies customer behaviour, competitors, and regional demand patterns to guide business strategy.',
    location: 'Pune',
    salaryRange: 'INR 4 LPA - INR 7.5 LPA',
    skills: ['Research Design', 'Consumer Insights', 'Competitive Analysis']
  },
  {
    title: 'Account Manager',
    category: 'Client Success',
    description: 'Manages relationships, renewals, and client growth plans across key accounts.',
    location: 'Noida',
    salaryRange: 'INR 4.5 LPA - INR 8 LPA',
    skills: ['Client Management', 'Upselling', 'Reporting']
  },
  {
    title: 'Growth Marketing Associate',
    category: 'Growth',
    description: 'Supports acquisition experiments, funnel analysis, and campaign learning loops.',
    location: 'Bengaluru',
    salaryRange: 'INR 4 LPA - INR 7 LPA',
    skills: ['A/B Testing', 'Funnels', 'Analytics']
  },
  {
    title: 'Media Planning Executive',
    category: 'Media',
    description: 'Supports media plans, vendor coordination, and campaign budget tracking.',
    location: 'Mumbai',
    salaryRange: 'INR 3.5 LPA - INR 6.5 LPA',
    skills: ['Media Planning', 'Budgeting', 'Campaign Coordination']
  },
  {
    title: 'Email Marketing Specialist',
    category: 'Lifecycle',
    description: 'Builds automated journeys and campaign sends for retention and engagement.',
    location: 'Chennai',
    salaryRange: 'INR 3.8 LPA - INR 6.8 LPA',
    skills: ['Email Campaigns', 'Automation', 'Segmentation']
  },
  {
    title: 'Lead Generation Associate',
    category: 'Sales',
    description: 'Builds prospect lists, qualifies outbound targets, and supports pipeline growth.',
    location: 'Gurgaon',
    salaryRange: 'INR 2.8 LPA - INR 5 LPA',
    skills: ['Prospecting', 'CRM', 'Outbound']
  },
  {
    title: 'Retail Sales Officer',
    category: 'Retail Sales',
    description: 'Supports retail channels, merchandising execution, and local sales targets.',
    location: 'Delhi',
    salaryRange: 'INR 3 LPA - INR 5.5 LPA',
    skills: ['Retail Sales', 'Merchandising', 'Targets']
  },
  {
    title: 'Content Marketing Associate',
    category: 'Content',
    description: 'Creates campaign content, blogs, and landing page support for growth teams.',
    location: 'Pune',
    salaryRange: 'INR 3.2 LPA - INR 5.8 LPA',
    skills: ['Content Writing', 'SEO', 'Campaign Support']
  },
  {
    title: 'Sales Operations Coordinator',
    category: 'Sales Operations',
    description: 'Maintains CRM workflows, dashboards, and reporting support for sales teams.',
    location: 'Hyderabad',
    salaryRange: 'INR 4 LPA - INR 6.5 LPA',
    skills: ['CRM Hygiene', 'Reporting', 'Pipeline Support']
  },
  {
    title: 'Influencer Marketing Executive',
    category: 'Marketing',
    description: 'Manages creator partnerships, campaign briefs, and performance tracking.',
    location: 'Mumbai',
    salaryRange: 'INR 3.5 LPA - INR 6 LPA',
    skills: ['Creator Outreach', 'Campaigns', 'Negotiation']
  },
  {
    title: 'Regional Business Associate',
    category: 'Business',
    description: 'Supports territory growth, partner coordination, and regional activation plans.',
    location: 'Noida',
    salaryRange: 'INR 3.8 LPA - INR 6.2 LPA',
    skills: ['Partnerships', 'Coordination', 'Market Expansion']
  }
];

const companies = [
  {
    name: 'Google',
    industry: 'Technology',
    openRoles: 18,
    description: 'Hiring across digital marketing, growth strategy, product storytelling, and enterprise sales programs.'
  },
  {
    name: 'Microsoft',
    industry: 'Cloud and Productivity',
    openRoles: 16,
    description: 'Known for commercial sales, partner development, demand generation, and global brand campaigns.'
  },
  {
    name: 'Amazon',
    industry: 'E-commerce and Cloud',
    openRoles: 20,
    description: 'Builds large-scale marketing, marketplace growth, account management, and revenue operations teams.'
  },
  {
    name: 'HubSpot',
    industry: 'Marketing SaaS',
    openRoles: 12,
    description: 'A standout employer for inbound marketing, CRM strategy, lifecycle communication, and sales enablement roles.'
  },
  {
    name: 'Salesforce',
    industry: 'CRM and Enterprise Software',
    openRoles: 14,
    description: 'Offers strong opportunities in account growth, customer success, demand generation, and solution selling.'
  },
  {
    name: 'Adobe',
    industry: 'Creative and Experience Tech',
    openRoles: 11,
    description: 'Blends content, product marketing, creative strategy, and enterprise relationship-building roles.'
  },
  {
    name: 'Deloitte',
    industry: 'Consulting',
    openRoles: 10,
    description: 'Expands brand, consulting sales, B2B marketing, and business development talent across industries.'
  },
  {
    name: 'Accenture',
    industry: 'Consulting and Transformation',
    openRoles: 13,
    description: 'Supports growth through strategic communications, client acquisition, and industry-focused marketing programs.'
  },
  {
    name: 'Meta',
    industry: 'Media and Technology',
    openRoles: 9,
    description: 'Builds advertising partnerships, brand narratives, market insights, and sales strategy roles.'
  },
  {
    name: 'LinkedIn',
    industry: 'Professional Platform',
    openRoles: 8,
    description: 'Well suited for talent solutions sales, brand marketing, content strategy, and B2B campaign work.'
  },
  {
    name: 'Unilever',
    industry: 'Consumer Brands',
    openRoles: 7,
    description: 'A strong destination for brand management, category planning, consumer insights, and field growth roles.'
  },
  {
    name: 'Coca-Cola',
    industry: 'FMCG',
    openRoles: 6,
    description: 'Combines iconic brand storytelling with channel marketing, market expansion, and trade sales execution.'
  }
];

const resources = [
  {
    title: 'Fundamentals of Digital Marketing',
    type: 'Course',
    description: 'A strong starting point for understanding acquisition channels, campaigns, and customer journeys.',
    link: 'https://skillshop.withgoogle.com/'
  },
  {
    title: 'HubSpot Academy Sales Training',
    type: 'Training',
    description: 'Practical lessons on pipeline management, relationship building, and inbound sales fundamentals.',
    link: 'https://academy.hubspot.com/'
  },
  {
    title: 'SEO Starter Guide',
    type: 'Guide',
    description: 'Helpful reading for anyone exploring search visibility, site quality, and organic growth strategy.',
    link: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide'
  },
  {
    title: 'Think with Google',
    type: 'Insights',
    description: 'Industry case studies, consumer trends, and strategy perspectives for marketers and brand teams.',
    link: 'https://www.thinkwithgoogle.com/'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await Promise.all([
      Role.deleteMany(),
      Company.deleteMany(),
      Resource.deleteMany()
    ]);

    await Promise.all([
      Role.insertMany(roles),
      Company.insertMany(companies),
      Resource.insertMany(resources)
    ]);

    console.log('Seed data inserted successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
