const defaultCommunities = [
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    shortDescription: 'Discuss campaigns, channels, analytics, and growth experiments that move the needle.',
    description: 'Join discussions around paid media, SEO, lifecycle campaigns, content performance, and practical growth marketing lessons.',
    iconKey: 'trending-up',
    bannerText: 'Campaign learning, analytics thinking, and channel strategy for modern marketers.'
  },
  {
    slug: 'sales-strategies',
    title: 'Sales Strategies',
    shortDescription: 'Share ideas for outreach, discovery, objection handling, and closing with confidence.',
    description: 'A focused space for pipeline building, prospecting frameworks, demos, client conversations, and practical sales execution.',
    iconKey: 'compass',
    bannerText: 'Smarter selling, stronger outreach, and better conversations with buyers.'
  },
  {
    slug: 'interview-preparation',
    title: 'Interview Preparation',
    shortDescription: 'Prepare for marketing and sales interviews with shared questions, frameworks, and examples.',
    description: 'Use this community to improve story-based interview answers, hiring prep, mock questions, and recruiter-facing confidence.',
    iconKey: 'message-square',
    bannerText: 'Real interview prep support for candidates aiming at marketing and sales roles.'
  },
  {
    slug: 'resume-tips',
    title: 'Resume Tips',
    shortDescription: 'Improve your resume with stronger positioning, better proof points, and cleaner storytelling.',
    description: 'Talk through resume structure, achievement bullets, keyword alignment, and how to present results more clearly.',
    iconKey: 'sparkles',
    bannerText: 'Sharper resumes, better role fit, and more confident applications.'
  },
  {
    slug: 'linkedin-profile-building',
    title: 'LinkedIn/Profile Building',
    shortDescription: 'Build a stronger professional presence that recruiters and hiring teams notice faster.',
    description: 'Share ways to improve profile headlines, summaries, visibility, content, networking, and recruiter discoverability.',
    iconKey: 'users',
    bannerText: 'Turn your profile into a stronger career asset with practical visibility tips.'
  },
  {
    slug: 'career-growth-marketing-sales',
    title: 'Career Growth',
    shortDescription: 'Explore next-step paths, specialization choices, and growth opportunities across the field.',
    description: 'Discuss role transitions, upskilling, leadership readiness, and how to grow from entry-level to specialist and management tracks.',
    iconKey: 'lightbulb',
    bannerText: 'Career direction, role progression, and growth thinking for ambitious professionals.'
  },
  {
    slug: 'content-marketing',
    title: 'Content Marketing',
    shortDescription: 'Talk through content plans, editorial systems, storytelling, and campaign alignment.',
    description: 'A space for blogs, landing pages, content calendars, SEO content, and storytelling that drives demand.',
    iconKey: 'sparkles',
    bannerText: 'Content ideas, performance lessons, and practical storytelling systems.'
  },
  {
    slug: 'social-media-marketing',
    title: 'Social Media Marketing',
    shortDescription: 'Discuss channel growth, social planning, engagement trends, and creator collaboration.',
    description: 'Explore content pillars, platform strategy, campaign performance, and audience-building for modern social teams.',
    iconKey: 'users',
    bannerText: 'Platform-specific ideas, content cadence, and engagement-focused execution.'
  },
  {
    slug: 'seo-analytics',
    title: 'SEO & Analytics',
    shortDescription: 'Learn through search insights, reporting habits, audits, and organic growth thinking.',
    description: 'Share keyword research, technical SEO, dashboards, search trends, and practical analysis for stronger decisions.',
    iconKey: 'trending-up',
    bannerText: 'Search visibility, measurement discipline, and analytics-first marketing conversations.'
  },
  {
    slug: 'email-marketing',
    title: 'Email Marketing',
    shortDescription: 'Discuss lifecycle journeys, campaign sends, deliverability, and better retention ideas.',
    description: 'Focused on automation, segmentation, open rate quality, conversion journeys, and lifecycle communication.',
    iconKey: 'message-square',
    bannerText: 'Lifecycle thinking, smarter sends, and stronger customer retention moments.'
  },
  {
    slug: 'branding-advertising',
    title: 'Branding & Advertising',
    shortDescription: 'Share ideas around campaign identity, positioning, ad thinking, and message consistency.',
    description: 'Explore briefs, brand voice, campaign concepts, audience perception, and creative execution across channels.',
    iconKey: 'lightbulb',
    bannerText: 'Brand building, ad concepts, and more intentional message design.'
  },
  {
    slug: 'b2b-sales',
    title: 'B2B Sales',
    shortDescription: 'Exchange strategies for consultative selling, deal cycles, and account development.',
    description: 'A focused room for enterprise outreach, qualification, stakeholder management, demos, and relationship-led growth.',
    iconKey: 'compass',
    bannerText: 'Long-cycle deals, account planning, and more confident business selling.'
  },
  {
    slug: 'b2c-sales',
    title: 'B2C Sales',
    shortDescription: 'Discuss customer conversations, conversion psychology, and retail or direct sales momentum.',
    description: 'Explore lead handling, customer objections, pitch clarity, in-person selling, and experience-led conversion strategies.',
    iconKey: 'users',
    bannerText: 'High-volume selling, better conversations, and stronger customer conversion instincts.'
  },
  {
    slug: 'cold-calling-pitching',
    title: 'Cold Calling & Pitching',
    shortDescription: 'Practice stronger opening lines, call flow, pitch structure, and objection control.',
    description: 'Useful for SDRs, BDEs, and sales freshers improving call confidence, relevance, and sharper follow-through.',
    iconKey: 'message-square',
    bannerText: 'Better first calls, tighter pitch framing, and more confident delivery.'
  },
  {
    slug: 'negotiation-skills',
    title: 'Negotiation Skills',
    shortDescription: 'Discuss value framing, pushback handling, confidence, and win-win communication.',
    description: 'Explore negotiation patterns for client conversations, vendor deals, salary discussions, and account growth.',
    iconKey: 'compass',
    bannerText: 'Calmer negotiation, clearer value framing, and stronger deal conversations.'
  },
  {
    slug: 'crm-tools-automation',
    title: 'CRM Tools & Automation',
    shortDescription: 'Talk through CRM hygiene, workflows, dashboards, and automation setups that save time.',
    description: 'Useful for sales ops, lifecycle teams, and anyone using CRM systems to improve follow-ups and reporting.',
    iconKey: 'trending-up',
    bannerText: 'Automation, CRM discipline, and cleaner systems for revenue teams.'
  },
  {
    slug: 'internship-fresher-jobs',
    title: 'Internship & Fresher Jobs',
    shortDescription: 'Support one another with beginner-friendly roles, entry paths, and first-job preparation.',
    description: 'A focused space for freshers looking at internships, campus roles, early applications, and confidence-building advice.',
    iconKey: 'users',
    bannerText: 'Entry-level guidance, first-role clarity, and fresher-friendly support.'
  },
  {
    slug: 'portfolio-projects',
    title: 'Portfolio & Projects',
    shortDescription: 'Improve project storytelling, case-study structure, and practical work samples.',
    description: 'Useful for candidates turning internships, mock work, and freelance tasks into stronger portfolios and proof points.',
    iconKey: 'sparkles',
    bannerText: 'Project presentation, proof of work, and stronger case-study thinking.'
  },
  {
    slug: 'certifications-courses',
    title: 'Certifications & Courses',
    shortDescription: 'Discuss which certifications matter, how to learn efficiently, and what recruiters value.',
    description: 'Compare course quality, learning paths, platform credibility, and how to turn certificates into real skill signals.',
    iconKey: 'lightbulb',
    bannerText: 'Smarter learning choices, course prioritization, and more credible skill-building.'
  },
  {
    slug: 'freelancing-marketing',
    title: 'Freelancing in Marketing',
    shortDescription: 'Share tips for client discovery, pricing, proposals, and independent project delivery.',
    description: 'A practical space for marketers building freelance income through campaigns, content, consulting, or analytics support.',
    iconKey: 'compass',
    bannerText: 'Client work, pricing confidence, and freelancing systems that scale.'
  },
  {
    slug: 'personal-branding',
    title: 'Personal Branding',
    shortDescription: 'Build visibility through profile clarity, public work, thought-sharing, and niche credibility.',
    description: 'Discuss LinkedIn presence, creator-style learning posts, professional storytelling, and brand consistency.',
    iconKey: 'sparkles',
    bannerText: 'Visibility, reputation building, and stronger professional recall.'
  },
  {
    slug: 'lead-generation',
    title: 'Lead Generation',
    shortDescription: 'Talk through pipeline building, prospect targeting, qualification, and conversion-ready outreach.',
    description: 'Ideal for sales and growth teams discussing outbound systems, inbound capture, and prospect quality improvement.',
    iconKey: 'trending-up',
    bannerText: 'Stronger pipeline habits, lead quality, and acquisition process thinking.'
  },
  {
    slug: 'performance-marketing',
    title: 'Performance Marketing',
    shortDescription: 'Discuss paid media execution, budget allocation, testing frameworks, and ROAS improvement.',
    description: 'A focused group for Meta ads, Google ads, attribution, landing page quality, and campaign optimization.',
    iconKey: 'trending-up',
    bannerText: 'Paid growth, experimentation, and sharper performance marketing decisions.'
  },
  {
    slug: 'market-research',
    title: 'Market Research',
    shortDescription: 'Explore customer insight gathering, competitor analysis, and better market understanding.',
    description: 'Useful for brand, sales, and strategy professionals building stronger research habits and audience context.',
    iconKey: 'lightbulb',
    bannerText: 'Insight gathering, market awareness, and more evidence-led decisions.'
  },
  {
    slug: 'copywriting-ad-creatives',
    title: 'Copywriting & Ad Creatives',
    shortDescription: 'Improve ad copy, hooks, CTA language, and creative concepts that convert better.',
    description: 'Share headline ideas, creative testing insights, messaging patterns, and ad iteration lessons.',
    iconKey: 'message-square',
    bannerText: 'Sharper words, stronger hooks, and more persuasive creative execution.'
  },
  {
    slug: 'sales-leadership',
    title: 'Sales Leadership',
    shortDescription: 'Discuss coaching, team performance, reporting, and leadership habits that improve outcomes.',
    description: 'A community for senior sellers and managers thinking about culture, reviews, targets, and frontline development.',
    iconKey: 'users',
    bannerText: 'Team coaching, leadership systems, and higher-quality revenue management.'
  }
];

export default defaultCommunities;
