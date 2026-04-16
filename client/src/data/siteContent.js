import {
  ChartNoAxesCombined,
  Handshake,
  BriefcaseBusiness,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';

export const API = import.meta.env.VITE_API_URL;

export const metrics = [
  { icon: TrendingUp, value: '8', label: 'High-growth paths' },
  { icon: Users, value: '50+', label: 'Talent-ready skills' },
  { icon: Target, value: '100%', label: 'Career-focused content' }
];

export const staticSkills = [
  'Storytelling and persuasive communication',
  'CRM and sales pipeline management',
  'SEO, analytics, and campaign optimization',
  'Presentation, negotiation, and pitching',
  'Market research and audience segmentation',
  'Brand strategy and content planning'
];

export const aboutPoints = [
  {
    icon: ChartNoAxesCombined,
    title: 'Data-backed storytelling',
    description:
      'Great teams translate audience behavior and business goals into campaigns, conversations, and conversion paths.'
  },
  {
    icon: Handshake,
    title: 'Human-centered growth',
    description:
      'Whether you are nurturing leads or positioning a brand, success depends on empathy, timing, and trust.'
  },
  {
    icon: BriefcaseBusiness,
    title: 'Career mobility',
    description:
      'These paths open doors to strategy, performance marketing, account leadership, partnerships, and brand management.'
  }
];

export const testimonials = [
  {
    quote:
      'This field blends creativity with measurable impact, which makes every campaign feel meaningful.',
    author: 'Rhea Kapoor',
    role: 'Growth Marketing Lead'
  },
  {
    quote:
      'Sales and marketing careers reward curiosity, confidence, and the ability to turn insights into action.',
    author: 'Daniel Brooks',
    role: 'Regional Sales Manager'
  }
];

export const blogItems = [
  'How to build a marketing portfolio that recruiters remember',
  'Sales interview questions that reveal strategic thinking',
  'What high-growth brands look for in entry-level talent'
];

export const faqItems = [
  {
    question: 'Do I need an MBA to enter marketing or sales?',
    answer:
      'No. Strong communication, analytical thinking, and real project work often matter more for entry roles.'
  },
  {
    question: 'Which roles are best for freshers?',
    answer:
      'Business development, digital marketing, SEO, inside sales, and content strategy roles are common entry points.'
  },
  {
    question: 'What helps candidates stand out quickly?',
    answer:
      'Relevant certifications, campaign case studies, internship work, and confident communication make a real difference.'
  }
];

export const tips = [
  'Build one strong campaign case study instead of ten generic certificates.',
  'Track your results with numbers: leads, clicks, conversions, retention, or revenue.',
  'Practice explaining strategy clearly in two minutes for interviews and networking.'
];

export const professionalVideos = [
  {
    title: 'Leadership and Positioning',
    description:
      'A professional talk on clarity, trust, and how strong positioning helps people lead, market, and influence better.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/qp0HIF3SfI4',
    watchUrl: 'https://www.youtube.com/watch?v=qp0HIF3SfI4'
  },
  {
    title: 'Speaking So People Listen',
    description:
      'A useful communication talk for sales and marketing careers where message delivery, tone, and confidence matter.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/eIho2S0ZahI',
    watchUrl: 'https://www.youtube.com/watch?v=eIho2S0ZahI'
  },
  {
    title: 'Professional Presence and Confidence',
    description:
      'A career-focused talk on presence and confidence that helps in interviews, presentations, client meetings, and sales conversations.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Ks-_Mh1QhMc',
    watchUrl: 'https://www.youtube.com/watch?v=Ks-_Mh1QhMc'
  }
];
