import LegalPageLayout from '../components/LegalPageLayout';

const sections = [
  {
    heading: 'Information We Collect',
    paragraphs: [
      'Marketing & Sales Careers may collect information such as your name, email address, phone number if provided, account login details, resume or CV uploads, profile information, and basic activity on the platform like saved jobs, job applications, or recruiter interactions.',
      'For recruiters or companies, we may collect business name, company profile details, job posting information, and other hiring-related information needed to operate the platform.'
    ]
  },
  {
    heading: 'How We Use Information',
    paragraphs: [
      'We use the information we collect to create and manage accounts, help job seekers apply for roles, support recruiters in posting jobs and reviewing candidates, improve the functionality of the platform, send important account or platform updates, and maintain security across the website.',
      'We may also review usage patterns in a limited and responsible way so we can improve navigation, content quality, and hiring-related features over time.'
    ]
  },
  {
    heading: 'Resume and Profile Data',
    paragraphs: [
      'Resume files, profile details, and application-related information may be visible to recruiters or hiring teams when a job seeker applies to a role or enables profile visibility through the platform.',
      'Users are responsible for ensuring that the details they submit are accurate, updated, and appropriate for professional hiring use.'
    ]
  },
  {
    heading: 'Cookies or Session Usage',
    paragraphs: [
      'Marketing & Sales Careers may use basic browser storage, cookies, or session-related tools to support login persistence, account access, and smoother platform functionality.',
      'These tools help keep users signed in where appropriate and support secure use of key features.'
    ]
  },
  {
    heading: 'Data Sharing',
    paragraphs: [
      'We do not sell personal information. Information may be shared only where needed to operate the platform, provide recruiter access for hiring purposes, comply with legal obligations, or support technical service operations related to the website.',
      'Any such sharing is intended to support normal platform use rather than unrelated commercial activity.'
    ]
  },
  {
    heading: 'Data Security',
    paragraphs: [
      'We take reasonable steps to protect user information through account controls, secure handling practices, and limited access to sensitive data where possible.',
      'However, no online platform can guarantee complete security, and users should also protect their own credentials and uploaded information.'
    ]
  },
  {
    heading: 'User Rights',
    paragraphs: [
      'Users can update profile details, resume information, and other account content through the platform where those features are available.',
      'If account deletion or data removal is needed, users may contact support for assistance, subject to platform capabilities and reasonable retention needs.'
    ]
  },
  {
    heading: 'Third-Party Links',
    paragraphs: [
      'The website may include links to third-party websites, company pages, external resources, or other services for user convenience.',
      'Marketing & Sales Careers is not responsible for the privacy practices, policies, or content of third-party sites.'
    ]
  },
  {
    heading: 'Changes to This Privacy Policy',
    paragraphs: [
      'This Privacy Policy may be updated from time to time to reflect platform improvements, legal requirements, or product changes.',
      'Continued use of the platform after updates are posted means users accept the revised policy.'
    ]
  },
  {
    heading: 'Contact Information',
    paragraphs: [
      'If you have questions about this Privacy Policy or how information is used on the platform, you may contact: support@marketingsalescareers.com'
    ]
  }
];

function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      intro="Marketing & Sales Careers respects user privacy and is committed to protecting the personal information collected through the platform."
      sections={sections}
    />
  );
}

export default PrivacyPolicyPage;
