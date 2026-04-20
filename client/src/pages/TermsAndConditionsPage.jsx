import LegalPageLayout from '../components/LegalPageLayout';

const sections = [
  {
    heading: 'Acceptance of Terms',
    paragraphs: [
      'By accessing or using Marketing & Sales Careers, users agree to follow these Terms & Conditions and any related rules or notices published on the platform.'
    ]
  },
  {
    heading: 'Platform Purpose',
    paragraphs: [
      'Marketing & Sales Careers is designed to support marketing and sales job opportunities, hiring, candidate discovery, professional visibility, and career support for job seekers and recruiters.'
    ]
  },
  {
    heading: 'User Accounts',
    paragraphs: [
      'Users must provide accurate, current, and complete information when creating and managing an account.',
      'Each user is responsible for keeping login credentials secure and for activity that takes place under their account.'
    ]
  },
  {
    heading: 'Job Seeker Responsibilities',
    paragraphs: [
      'Job seekers should provide truthful resume details, profile information, skills, experience levels, and other career-related content.',
      'Users should apply only to relevant roles and must avoid spam applications, fake submissions, misleading claims, or misuse of platform features.'
    ]
  },
  {
    heading: 'Recruiter / Company Responsibilities',
    paragraphs: [
      'Recruiters and companies must post genuine job openings, provide accurate company and role details, and treat candidate information responsibly.',
      'Fake listings, misleading hiring claims, misuse of candidate data, or dishonest activity are not permitted on the platform.'
    ]
  },
  {
    heading: 'Acceptable Use',
    paragraphs: [
      'Users must behave respectfully and may not post abusive, harmful, illegal, misleading, offensive, or spam content.',
      'Attempts to damage, disrupt, hack, scrape, misuse, or interfere with the platform or other users are not allowed.'
    ]
  },
  {
    heading: 'Content and Intellectual Property',
    paragraphs: [
      'Unless otherwise stated, the website design, branding, interface structure, and original platform content belong to Marketing & Sales Careers.',
      'Users retain ownership of resumes, profile materials, and other content they upload where applicable, while granting the platform limited use necessary to operate hiring-related features.'
    ]
  },
  {
    heading: 'Platform Availability',
    paragraphs: [
      'The platform may be updated, modified, paused, or temporarily unavailable due to maintenance, development changes, technical issues, or service interruptions.',
      'Uninterrupted access is not guaranteed.'
    ]
  },
  {
    heading: 'Limitation of Liability',
    paragraphs: [
      'Marketing & Sales Careers is provided for informational, hiring support, and professional discovery purposes.',
      'The platform is not responsible for hiring outcomes, recruiter decisions, job offer validity, employer conduct, third-party actions, or losses resulting from reliance on external users or listings.'
    ]
  },
  {
    heading: 'Account Suspension or Termination',
    paragraphs: [
      'Accounts, listings, posts, or content that appear suspicious, abusive, fake, misleading, or in violation of platform policies may be removed, restricted, or suspended at the platform’s discretion.'
    ]
  },
  {
    heading: 'Changes to Terms',
    paragraphs: [
      'These Terms & Conditions may be updated from time to time to reflect feature changes, legal needs, or improvements to the platform.',
      'Continued use of the website after such updates means users accept the revised terms.'
    ]
  },
  {
    heading: 'Contact Information',
    paragraphs: [
      'For questions about these Terms & Conditions, please contact: support@marketingsalescareers.com'
    ]
  }
];

function TermsAndConditionsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      intro="By accessing or using Marketing & Sales Careers, users agree to follow the platform rules and conditions described below."
      sections={sections}
    />
  );
}

export default TermsAndConditionsPage;
