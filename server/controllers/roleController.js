import Role from '../models/Role.js';

const fallbackRoles = [
  {
    title: 'Digital Marketing Executive',
    category: 'Marketing',
    description: 'Plan and optimise campaigns across search, social, and performance channels.',
    location: 'Remote',
    salaryRange: '4-6 LPA',
    skills: ['Campaigns', 'Performance Marketing', 'Analytics']
  },
  {
    title: 'SEO Specialist',
    category: 'Marketing',
    description: 'Drive search visibility, on-page optimisation, and content-led organic growth.',
    location: 'Bengaluru',
    salaryRange: '4-7 LPA',
    skills: ['SEO', 'Content Optimisation', 'Research']
  },
  {
    title: 'Social Media Manager',
    category: 'Marketing',
    description: 'Own social strategy, publishing, brand voice, and community engagement.',
    location: 'Mumbai',
    salaryRange: '5-8 LPA',
    skills: ['Social Media', 'Content Planning', 'Brand Voice']
  },
  {
    title: 'Business Development Executive',
    category: 'Sales',
    description: 'Build pipeline, qualify leads, and turn conversations into growth opportunities.',
    location: 'Delhi',
    salaryRange: '4-6 LPA',
    skills: ['Lead Generation', 'Client Outreach', 'Pipeline']
  },
  {
    title: 'Sales Executive',
    category: 'Sales',
    description: 'Manage active prospects, support conversions, and close commercial opportunities.',
    location: 'Hyderabad',
    salaryRange: '4-7 LPA',
    skills: ['Sales', 'Negotiation', 'Client Management']
  },
  {
    title: 'Marketing Analyst',
    category: 'Analytics',
    description: 'Translate campaign data into reports, insights, and channel recommendations.',
    location: 'Pune',
    salaryRange: '5-8 LPA',
    skills: ['Reporting', 'Analytics', 'Dashboards']
  },
  {
    title: 'Brand Executive',
    category: 'Brand',
    description: 'Support positioning, launches, and brand consistency across customer touchpoints.',
    location: 'Remote',
    salaryRange: '4-6 LPA',
    skills: ['Branding', 'Campaign Planning', 'Coordination']
  },
  {
    title: 'Content Marketing Specialist',
    category: 'Content',
    description: 'Create and manage content journeys that support awareness, nurture, and conversion.',
    location: 'Chennai',
    salaryRange: '4-7 LPA',
    skills: ['Content Strategy', 'Storytelling', 'SEO']
  },
  {
    title: 'CRM Executive',
    category: 'Lifecycle',
    description: 'Manage lifecycle campaigns, customer communication, and retention workflows.',
    location: 'Remote',
    salaryRange: '4-6 LPA',
    skills: ['CRM', 'Lifecycle Marketing', 'Retention']
  },
  {
    title: 'Inside Sales Executive',
    category: 'Sales',
    description: 'Handle inbound leads, demos, and follow-ups that move prospects through the funnel.',
    location: 'Noida',
    salaryRange: '4-6 LPA',
    skills: ['Inside Sales', 'Follow-ups', 'Lead Qualification']
  }
];

export const getRoles = async (_req, res) => {
  try {
    let roles = await Role.find().sort({ createdAt: 1 });

    if (!roles.length && process.env.MONGODB_URI) {
      roles = await Role.insertMany(fallbackRoles);
    }

    res.status(200).json(roles);
  } catch (error) {
    res.status(200).json(fallbackRoles);
  }
};
