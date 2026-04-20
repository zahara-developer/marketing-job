import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Role from '../models/Role.js';
import Company from '../models/Company.js';
import Resource from '../models/Resource.js';
import Community from '../models/Community.js';
import CommunityMember from '../models/CommunityMember.js';
import CommunityPost from '../models/CommunityPost.js';
import CommunityComment from '../models/CommunityComment.js';
import CommunityLike from '../models/CommunityLike.js';
import Connection from '../models/Connection.js';
import User from '../models/User.js';
import defaultCommunities from '../data/defaultCommunities.js';

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

const communities = defaultCommunities;

const communityUsers = [
  {
    fullName: 'Rhea Kapoor',
    email: 'rhea.kapoor@example.com',
    roleInterested: 'Growth Marketing Lead',
    experienceLevel: '5+ years',
    location: 'Bengaluru',
    currentCompany: 'GrowthSpark Media',
    bio: 'Performance marketer focused on paid growth, funnel efficiency, and practical mentoring for early-career marketers.'
  },
  {
    fullName: 'Daniel Brooks',
    email: 'daniel.brooks@example.com',
    roleInterested: 'Regional Sales Manager',
    experienceLevel: '6+ years',
    location: 'Mumbai',
    currentCompany: 'Northstar Solutions',
    bio: 'Sales leader helping teams improve outreach, objection handling, and deal velocity.'
  },
  {
    fullName: 'Aditi Verma',
    email: 'aditi.verma@example.com',
    roleInterested: 'Performance Marketing Associate',
    experienceLevel: '1-2 years',
    location: 'Delhi',
    currentCompany: 'AdLift Studio',
    bio: 'Associate marketer who enjoys translating campaigns into interview-ready project stories.'
  },
  {
    fullName: 'Sneha Kapoor',
    email: 'sneha.kapoor@example.com',
    roleInterested: 'Content Strategist',
    experienceLevel: '3+ years',
    location: 'Pune',
    currentCompany: 'Narrative House',
    bio: 'Content strategist exploring SEO, campaign storytelling, and stronger resume positioning.'
  },
  {
    fullName: 'Rahul Menon',
    email: 'rahul.menon@example.com',
    roleInterested: 'Business Development Executive',
    experienceLevel: '2+ years',
    location: 'Chennai',
    currentCompany: 'Vertex Growth Labs',
    bio: 'Business development professional who enjoys profile building, networking, and pipeline strategy.'
  },
  {
    fullName: 'Maya Singh',
    email: 'maya.singh@example.com',
    roleInterested: 'Marketing Analyst',
    experienceLevel: '3+ years',
    location: 'Hyderabad',
    currentCompany: 'Insightly Works',
    bio: 'Marketing analyst exploring career growth decisions between specialization and cross-functional work.'
  },
  {
    fullName: 'Neha Bhatia',
    email: 'neha.bhatia@example.com',
    roleInterested: 'Digital Marketing Specialist',
    experienceLevel: '4+ years',
    location: 'Noida',
    currentCompany: 'ClickBeacon',
    bio: 'Digital marketing specialist focused on campaign performance, analytics, and interview coaching.'
  },
  {
    fullName: 'Harsh Patel',
    email: 'harsh.patel@example.com',
    roleInterested: 'Inside Sales Lead',
    experienceLevel: '4+ years',
    location: 'Ahmedabad',
    currentCompany: 'RevenueRoot',
    bio: 'Inside sales lead helping teams improve qualification, follow-up quality, and call momentum.'
  },
  {
    fullName: 'Priya Nair',
    email: 'priya.nair@example.com',
    roleInterested: 'SEO Analyst',
    experienceLevel: '2+ years',
    location: 'Kochi',
    currentCompany: 'SearchMint',
    bio: 'SEO analyst who enjoys breaking down career stories into clear, recruiter-friendly interview answers.'
  },
  {
    fullName: 'Karan Sethi',
    email: 'karan.sethi@example.com',
    roleInterested: 'Lifecycle Marketing Manager',
    experienceLevel: '5+ years',
    location: 'Gurgaon',
    currentCompany: 'Retention Lab',
    bio: 'Lifecycle marketer with a focus on conversion storytelling, campaign reporting, and resume impact.'
  },
  {
    fullName: 'Ananya Ghosh',
    email: 'ananya.ghosh@example.com',
    roleInterested: 'Talent Branding Specialist',
    experienceLevel: '3+ years',
    location: 'Kolkata',
    currentCompany: 'TalentStory Co.',
    bio: 'Talent branding specialist helping early-career candidates improve LinkedIn presence and discoverability.'
  },
  {
    fullName: 'Vikram Joshi',
    email: 'vikram.joshi@example.com',
    roleInterested: 'Revenue Operations Consultant',
    experienceLevel: '7+ years',
    location: 'Bengaluru',
    currentCompany: 'OpsScale Partners',
    bio: 'Revenue operations consultant supporting career direction, sales systems, and long-term specialization decisions.'
  }
];

const communityPosts = [
  {
    communitySlug: 'digital-marketing',
    title: 'Which metrics matter most in your first performance marketing interview?',
    content: 'I keep seeing questions around CAC, CTR, CPL, and ROAS. For junior roles, which ones should candidates explain confidently and with examples?',
    authorEmail: 'rhea.kapoor@example.com'
  },
  {
    communitySlug: 'sales-strategies',
    title: 'What is your favorite way to handle "send me the details" objections?',
    content: 'I want to move the conversation forward instead of ending the call too early. Curious how others keep the momentum without sounding pushy.',
    authorEmail: 'daniel.brooks@example.com'
  },
  {
    communitySlug: 'interview-preparation',
    title: 'Best way to answer "Tell me about yourself" for fresher candidates',
    content: 'What structure works best when you have projects, internships, and certifications but not a full-time job yet?',
    authorEmail: 'aditi.verma@example.com'
  },
  {
    communitySlug: 'resume-tips',
    title: 'How do you write stronger resume bullets for campaign work?',
    content: 'I have handled email sends, social posts, and campaign execution. I want to make the impact feel more measurable and recruiter-friendly.',
    authorEmail: 'sneha.kapoor@example.com'
  },
  {
    communitySlug: 'linkedin-profile-building',
    title: 'What should a fresher put in the LinkedIn headline?',
    content: 'Should it be role-based, skill-based, or project-based? I want it to look targeted without feeling too generic.',
    authorEmail: 'rahul.menon@example.com'
  },
  {
    communitySlug: 'career-growth-marketing-sales',
    title: 'When is the right time to specialize instead of staying broad?',
    content: 'I have worked across content, paid ads, and CRM support. I am trying to decide whether to go deeper in one lane or stay broad for now.',
    authorEmail: 'maya.singh@example.com'
  }
];

const communityComments = [
  {
    postTitle: 'Which metrics matter most in your first performance marketing interview?',
    content: 'For fresher and associate interviews, being able to explain how metrics relate to business outcomes usually matters more than memorizing every term.',
    authorEmail: 'neha.bhatia@example.com'
  },
  {
    postTitle: 'What is your favorite way to handle "send me the details" objections?',
    content: 'I usually confirm the exact gap first, then send a short follow-up with one clear next step instead of a long brochure dump.',
    authorEmail: 'harsh.patel@example.com'
  },
  {
    postTitle: 'Best way to answer "Tell me about yourself" for fresher candidates',
    content: 'A simple past-present-future structure works well: your background, what you have already done, and the role direction you want now.',
    authorEmail: 'priya.nair@example.com'
  },
  {
    postTitle: 'How do you write stronger resume bullets for campaign work?',
    content: 'Try writing each point as action + scope + result. Even small outcomes like CTR growth or faster delivery help add credibility.',
    authorEmail: 'karan.sethi@example.com'
  },
  {
    postTitle: 'What should a fresher put in the LinkedIn headline?',
    content: 'A good format is target role plus two or three strengths. It feels clearer than a generic "open to work" headline alone.',
    authorEmail: 'ananya.ghosh@example.com'
  },
  {
    postTitle: 'When is the right time to specialize instead of staying broad?',
    content: 'If one area keeps pulling stronger interest and better outcomes from your work, that is usually a good signal to explore deeper specialization.',
    authorEmail: 'vikram.joshi@example.com'
  }
];

const sampleConnections = [
  ['rhea.kapoor@example.com', 'neha.bhatia@example.com'],
  ['daniel.brooks@example.com', 'harsh.patel@example.com'],
  ['maya.singh@example.com', 'vikram.joshi@example.com'],
  ['rahul.menon@example.com', 'ananya.ghosh@example.com']
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await Promise.all([
      Role.deleteMany(),
      Company.deleteMany(),
      Resource.deleteMany(),
      CommunityLike.deleteMany(),
      Connection.deleteMany(),
      CommunityMember.deleteMany(),
      CommunityComment.deleteMany(),
      CommunityPost.deleteMany(),
      Community.deleteMany()
    ]);

    const hashedPassword = await bcrypt.hash('Password123', 10);
    const seededUsers = [];

    for (const user of communityUsers) {
      const payload = {
        fullName: user.fullName,
        email: user.email.toLowerCase(),
        password: hashedPassword,
        roleInterested: user.roleInterested,
        experienceLevel: user.experienceLevel,
        location: user.location,
        currentCompany: user.currentCompany,
        bio: user.bio
      };

      const existing = await User.findOne({ email: payload.email });

      if (existing) {
        Object.assign(existing, payload);
        await existing.save();
        seededUsers.push(existing);
      } else {
        seededUsers.push(await User.create(payload));
      }
    }

    const [insertedRoles, insertedCompanies, insertedResources, insertedCommunities] = await Promise.all([
      Role.insertMany(roles),
      Company.insertMany(companies),
      Resource.insertMany(resources),
      Community.insertMany(communities)
    ]);

    const communityBySlug = insertedCommunities.reduce((accumulator, community) => {
      accumulator[community.slug] = community;
      return accumulator;
    }, {});

    const userByEmail = seededUsers.reduce((accumulator, user) => {
      accumulator[user.email.toLowerCase()] = user;
      return accumulator;
    }, {});

    await CommunityMember.insertMany(
      insertedCommunities.flatMap((community) =>
        communityUsers.slice(0, 8).map((user) => ({
          community: community._id,
          user: userByEmail[user.email.toLowerCase()]._id
        }))
      )
    );

    await Promise.all(
      insertedCommunities.map(async (community) => {
        const joinedMembers = await CommunityMember.find({ community: community._id }).select('user');
        community.memberCount = joinedMembers.length;
        community.joinedMembers = joinedMembers.map((member) => member.user);
        await community.save();
      })
    );

    const insertedPosts = await CommunityPost.insertMany(
      communityPosts.map((post) => {
        const author = userByEmail[post.authorEmail.toLowerCase()];

        return {
          community: communityBySlug[post.communitySlug]._id,
          author: author._id,
          authorName: author.fullName,
          authorRole: author.roleInterested,
          title: post.title,
          content: post.content
        };
      })
    );

    const postByTitle = insertedPosts.reduce((accumulator, post) => {
      accumulator[post.title] = post;
      return accumulator;
    }, {});

    await CommunityComment.insertMany(
      communityComments.map((comment) => {
        const author = userByEmail[comment.authorEmail.toLowerCase()];

        return {
          community: postByTitle[comment.postTitle].community,
          post: postByTitle[comment.postTitle]._id,
          author: author._id,
          authorName: author.fullName,
          authorRole: author.roleInterested,
          content: comment.content
        };
      })
    );

    await CommunityLike.insertMany([
      {
        post: postByTitle['Which metrics matter most in your first performance marketing interview?']._id,
        user: userByEmail['neha.bhatia@example.com']._id
      },
      {
        post: postByTitle['What should a fresher put in the LinkedIn headline?']._id,
        user: userByEmail['ananya.ghosh@example.com']._id
      },
      {
        post: postByTitle['When is the right time to specialize instead of staying broad?']._id,
        user: userByEmail['vikram.joshi@example.com']._id
      }
    ]);

    await Connection.insertMany(
      sampleConnections.map(([requesterEmail, targetEmail]) => ({
        requester: userByEmail[requesterEmail.toLowerCase()]._id,
        target: userByEmail[targetEmail.toLowerCase()]._id,
        status: 'connected'
      }))
    );

    console.log('Seed data inserted successfully.');
    console.log(`Inserted roles: ${insertedRoles.length}`);
    console.log(`Inserted companies: ${insertedCompanies.length}`);
    console.log(`Inserted resources: ${insertedResources.length}`);
    console.log(`Inserted communities: ${insertedCommunities.length}`);
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
