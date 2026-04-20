import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookmarkCheck, BriefcaseBusiness, Download, Eye, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import RoleList from '../components/RoleList';
import CompanySpotlight from '../components/CompanySpotlight';
import { imageSources } from '../assets/images/imageSources';
import { useAuth } from '../context/AuthContext';
import { API } from '../data/siteContent';
import RevealSection from '../components/RevealSection';
import useSavedJobs from '../hooks/useSavedJobs';
import useSiteData from '../hooks/useSiteData';
import defaultRoles from '../data/defaultRoles';

function DashboardPage() {
  const { user, token, uploadResume } = useAuth();
  const { savedJobs, savedCount } = useSavedJobs();
  const { roles, companies } = useSiteData();
  const [totalLoginActivity, setTotalLoginActivity] = useState(0);
  const [resumeStatus, setResumeStatus] = useState({ type: '', text: '' });
  const [uploadingResume, setUploadingResume] = useState(false);
  const [applications, setApplications] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!token) {
        setTotalLoginActivity(0);
        return;
      }

      try {
        const response = await fetch(`${API}/auth/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Unable to load dashboard stats.');
        }

        setTotalLoginActivity(result.stats?.totalLoginActivity ?? 0);
      } catch (_error) {
        setTotalLoginActivity(0);
      }
    };

    fetchDashboardStats();
  }, [token]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) {
        setApplications([]);
        return;
      }

      try {
        const response = await fetch(`${API}/applications/mine`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Unable to load your applications.');
        }

        setApplications(Array.isArray(result) ? result : []);
      } catch (_error) {
        setApplications([]);
      }
    };

    fetchApplications();
  }, [token]);

  const profileFields = [
    Boolean(user?.fullName),
    Boolean(user?.email),
    Boolean(user?.roleInterested),
    Boolean(user?.experienceLevel),
    Boolean(user?.resume?.filepath),
    Boolean(user?.skills?.length)
  ];
  const profileCompletion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);
  const rolePool = roles.length >= 8 ? roles : [...roles, ...defaultRoles].slice(0, 20);

  const normalize = (value) => `${value || ''}`.trim().toLowerCase();
  const tokenize = (value) =>
    normalize(value)
      .split(/[\s,/+-]+/)
      .map((item) => item.trim())
      .filter(Boolean);

  const userInterest = normalize(user?.roleInterested);
  const userLocation = normalize(user?.preferredLocation || user?.location);
  const userSkills = Array.isArray(user?.skills) ? user.skills.map((skill) => normalize(skill)) : [];
  const userExperience = normalize(user?.experienceLevel);

  const scoredRoles = rolePool.map((role) => {
    const haystack = [
      role.title,
      role.category,
      role.description,
      role.company,
      role.companyName,
      role.location,
      role.experienceLevel,
      ...(role.skills || [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    let score = 0;

    if (userInterest && haystack.includes(userInterest)) {
      score += 6;
    }

    tokenize(userInterest).forEach((token) => {
      if (haystack.includes(token)) {
        score += 3;
      }
    });

    userSkills.forEach((skill) => {
      if (haystack.includes(skill)) {
        score += 2;
      }
    });

    if (userLocation && (haystack.includes(userLocation) || haystack.includes('remote'))) {
      score += 2;
    }

    if (userExperience) {
      const fresherKeywords = ['fresher', 'intern', 'junior', 'associate', 'entry'];
      const experiencedKeywords = ['manager', 'lead', 'specialist', 'analyst', 'executive'];
      const matchingKeywords = userExperience.includes('fresher') || userExperience.includes('0')
        ? fresherKeywords
        : experiencedKeywords;

      if (matchingKeywords.some((keyword) => haystack.includes(keyword))) {
        score += 2;
      }
    }

    if (!score && (role.category?.toLowerCase().includes('marketing') || role.category?.toLowerCase().includes('sales'))) {
      score = 1;
    }

    return { ...role, matchScore: score };
  });

  const filteredRecommendedRoles = scoredRoles.filter((role) => {
    const haystack = [role.title, role.category, role.description, ...(role.skills || [])].join(' ').toLowerCase();

    if (roleFilter === 'marketing') {
      return haystack.includes('marketing') || haystack.includes('seo') || haystack.includes('content') || haystack.includes('brand');
    }

    if (roleFilter === 'sales') {
      return haystack.includes('sales') || haystack.includes('business development') || haystack.includes('lead generation') || haystack.includes('account');
    }

    if (roleFilter === 'fresher') {
      return haystack.includes('fresher') || haystack.includes('intern') || haystack.includes('junior') || haystack.includes('associate');
    }

    if (roleFilter === 'experienced') {
      return !(
        haystack.includes('fresher') || haystack.includes('intern') || haystack.includes('junior')
      );
    }

    return true;
  });

  const sortedRecommendedRoles = [...filteredRecommendedRoles].sort((a, b) => b.matchScore - a.matchScore);
  const recommendedJobs = (sortedRecommendedRoles.length ? sortedRecommendedRoles : scoredRoles).slice(0, 6);
  const recommendationNotice = filteredRecommendedRoles.length
    ? 'Showing recommended roles for you'
    : 'Showing similar opportunities';
  const recentCompanies = companies.slice(0, 3);

  const stats = [
    {
      label: 'User Sign-ins',
      value: user?.loginCount ?? 0
    },
    {
      label: 'Login Activity',
      value: totalLoginActivity
    },
    {
      label: 'Jobs Applied',
      value: user?.appliedJobsCount ?? 0
    },
    {
      label: 'Saved Jobs',
      value: savedCount
    },
    {
      label: 'Profile Completion',
      value: `${profileCompletion}%`
    }
  ];

  const resumeUrl = user?.resume?.filepath
    ? `${API.replace(/\/api$/, '')}${user.resume.filepath}`
    : '';

  const openResumeFile = async (mode = 'view') => {
    if (!resumeUrl) {
      setResumeStatus({ type: 'error', text: 'No resume uploaded yet.' });
      return;
    }

    try {
      const response = await fetch(resumeUrl, { method: 'HEAD' });

      if (!response.ok) {
        throw new Error('Resume file not found.');
      }

      if (mode === 'download') {
        const link = document.createElement('a');
        link.href = resumeUrl;
        link.download = user?.resume?.originalName || 'resume';
        document.body.appendChild(link);
        link.click();
        link.remove();
        return;
      }

      window.open(resumeUrl, '_blank', 'noopener,noreferrer');
    } catch (_error) {
      setResumeStatus({ type: 'error', text: 'Resume file not found. Please upload it again.' });
    }
  };

  const handleResumeReplace = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = new Set([
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]);

    if (!allowedTypes.has(file.type)) {
      setResumeStatus({ type: 'error', text: 'Only PDF, DOC, and DOCX files are allowed.' });
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeStatus({ type: 'error', text: 'Resume must be 5MB or smaller.' });
      event.target.value = '';
      return;
    }

    try {
      setUploadingResume(true);
      setResumeStatus({ type: '', text: '' });
      await uploadResume(file);
      setResumeStatus({ type: 'success', text: 'Resume uploaded successfully.' });
    } catch (error) {
      setResumeStatus({ type: 'error', text: error.message });
    } finally {
      setUploadingResume(false);
      event.target.value = '';
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Profile"
        title={`Welcome back, ${user?.fullName || 'Candidate'}.`}
        description="Your dashboard now keeps things simple and shows quick account stats instead of full personal details."
        image={imageSources.about}
        imageAlt="Candidate dashboard and profile overview"
      />

      <RevealSection className="content-section">
        <SectionHeader
          eyebrow="Dashboard"
          title="Your account snapshot"
          description="A quick look at your account activity in one place."
        />
        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          <div className="dashboard-grid">
            {stats.map((item) => (
              <div key={item.label}>
                <label>{item.label}</label>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
          <div className="resume-panel">
            <div className="resume-panel-copy">
              <label>Resume uploaded</label>
              <strong>{user?.resume?.originalName || 'No resume uploaded yet'}</strong>
              <span>
                {user?.resume?.uploadDate
                  ? `Uploaded on ${new Date(user.resume.uploadDate).toLocaleDateString()}`
                  : 'Upload a resume so recruiters can review your profile quickly.'}
              </span>
            </div>
            <div className="resume-panel-actions">
              {resumeUrl ? (
                <>
                  <button type="button" className="secondary-button" onClick={() => openResumeFile('view')}>
                    <Eye size={16} />
                    View Resume
                  </button>
                  <button type="button" className="secondary-button" onClick={() => openResumeFile('download')}>
                    <Download size={16} />
                    Download
                  </button>
                </>
              ) : null}
              <label className="secondary-button resume-upload-button">
                <Upload size={16} />
                {uploadingResume ? 'Uploading...' : user?.resume?.filepath ? 'Replace Resume' : 'Upload Resume'}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeReplace}
                  disabled={uploadingResume}
                />
              </label>
            </div>
            {resumeStatus.text ? <p className={`form-status ${resumeStatus.type}`}>{resumeStatus.text}</p> : null}
          </div>
        </motion.div>
      </RevealSection>

      <RevealSection className="content-section" delay={0.04}>
        <div className="dashboard-quick-grid">
          <Link to="/applications" className="dashboard-quick-card">
            <BriefcaseBusiness size={20} />
            <div>
              <strong>Application updates</strong>
              <span>{applications.length ? `${applications.length} tracked applications` : 'Track every job status in one place'}</span>
            </div>
            <ArrowRight size={18} />
          </Link>
          <Link to="/saved-jobs" className="dashboard-quick-card">
            <BookmarkCheck size={20} />
            <div>
              <strong>Saved roles</strong>
              <span>{savedCount ? `${savedCount} roles saved for later` : 'Bookmark roles you want to revisit'}</span>
            </div>
            <ArrowRight size={18} />
          </Link>
        </div>
      </RevealSection>

      <RevealSection className="content-section" delay={0.06}>
        <SectionHeader
          eyebrow="Matching Roles"
          title="Roles recommended for you based on your profile and interests"
          description="These recommendations use your role interest, experience level, skills, and preferred location when available."
        />
        <div className="dashboard-role-filter-row">
          {[
            { value: 'all', label: 'All' },
            { value: 'marketing', label: 'Marketing' },
            { value: 'sales', label: 'Sales' },
            { value: 'fresher', label: 'Fresher' },
            { value: 'experienced', label: 'Experienced' }
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              className={`dashboard-filter-chip ${roleFilter === item.value ? 'active' : ''}`}
              onClick={() => setRoleFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="roles-results-note">{recommendationNotice}</p>
        {recommendedJobs.length ? <RoleList roles={recommendedJobs} showDetails showMatchBadge /> : <RoleList roles={defaultRoles.slice(0, 6)} showDetails showMatchBadge />}
      </RevealSection>

      <RevealSection className="content-section" delay={0.08}>
        <SectionHeader
          eyebrow="Recent hiring companies"
          title="Brands currently active on the platform."
          description="A quick view of hiring companies you may want to follow next."
        />
        {recentCompanies.length ? <CompanySpotlight companies={recentCompanies} /> : <p className="status-text">Hiring company updates will appear here.</p>}
      </RevealSection>
    </>
  );
}

export default DashboardPage;
