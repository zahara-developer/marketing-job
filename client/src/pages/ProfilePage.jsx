import { useEffect, useMemo, useState } from 'react';
import {
  BriefcaseBusiness,
  Download,
  Eye,
  FileText,
  MapPin,
  Mail,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Upload
} from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import RevealSection from '../components/RevealSection';
import { useAuth } from '../context/AuthContext';
import { API } from '../data/siteContent';
import useSavedJobs from '../hooks/useSavedJobs';

const createEducationEntry = () => ({
  degree: '',
  institution: '',
  year: '',
  field: '',
  grade: ''
});

function ProfilePage() {
  const { user, updateProfile, uploadResume } = useAuth();
  const { savedCount } = useSavedJobs();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    preferredLocation: '',
    roleInterested: '',
    experienceLevel: '',
    bio: '',
    skills: '',
    education: [createEducationEntry()]
  });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [resumeStatus, setResumeStatus] = useState({ type: '', text: '' });
  const [selectedResumeName, setSelectedResumeName] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    setFormData({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      location: user?.location || '',
      preferredLocation: user?.preferredLocation || '',
      roleInterested: user?.roleInterested || '',
      experienceLevel: user?.experienceLevel || '',
      bio: user?.bio || '',
      skills: Array.isArray(user?.skills) ? user.skills.join(', ') : '',
      education: Array.isArray(user?.education) && user.education.length
        ? user.education.map((item) => ({
            degree: item.degree || '',
            institution: item.institution || '',
            year: item.year || '',
            field: item.field || '',
            grade: item.grade || ''
          }))
        : [createEducationEntry()]
    });
  }, [user]);

  const profileCompletion = useMemo(() => {
    const fields = [
      Boolean(user?.fullName),
      Boolean(user?.email),
      Boolean(user?.phone),
      Boolean(user?.location),
      Boolean(user?.roleInterested),
      Boolean(user?.experienceLevel),
      Boolean(user?.bio),
      Boolean(user?.skills?.length),
      Boolean(user?.education?.length),
      Boolean(user?.resume?.filepath)
    ];

    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [user]);

  const userInitials = useMemo(
    () =>
      (user?.fullName || 'MS')
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    [user?.fullName]
  );

  const resumeUrl = useMemo(
    () => (user?.resume?.filepath ? `${API.replace(/\/api$/, '')}${user.resume.filepath}` : ''),
    [user]
  );

  const stats = useMemo(
    () => [
      {
        label: 'Jobs applied',
        value: user?.appliedJobsCount ?? 0,
        helper: 'Applications tracked from your profile'
      },
      {
        label: 'Saved jobs',
        value: savedCount,
        helper: 'Roles bookmarked for later'
      },
      {
        label: 'Resume status',
        value: user?.resume?.filepath ? 'Uploaded' : 'Missing',
        helper: user?.resume?.filepath ? 'Resume ready for recruiters' : 'Upload to complete profile'
      },
      {
        label: 'Profile completion',
        value: `${profileCompletion}%`,
        helper: 'Based on your current details'
      }
    ],
    [profileCompletion, savedCount, user?.appliedJobsCount, user?.resume?.filepath]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, createEducationEntry()]
    }));
  };

  const handleSaveProfile = async () => {
    setSubmitting(true);
    setStatus({ type: '', text: '' });

    try {
      await updateProfile(formData);
      setStatus({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error) {
      setStatus({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResumeChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedResumeName('');
      setResumeStatus({ type: '', text: '' });
      return;
    }

    const extension = `.${(file.name.split('.').pop() || '').toLowerCase()}`;
    const allowedTypes = new Set([
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]);
    const allowedExtensions = new Set(['.pdf', '.doc', '.docx']);

    setSelectedResumeName(file.name);

    if (!allowedTypes.has(file.type) && !allowedExtensions.has(extension)) {
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

  return (
    <>
      <RevealSection className="content-section">
        <SectionHeader
          eyebrow="Profile dashboard"
          title="A cleaner professional profile workspace."
          description="Everything important stays grouped: summary, details, applications, resume, and education."
        />

        <motion.div
          className="profile-dashboard-shell"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <div className="profile-dashboard-top">
            <aside className="profile-summary-card">
              <div className="profile-summary-avatar">{userInitials}</div>
              <div className="profile-summary-copy">
                <h3>{user?.fullName || 'Candidate'}</h3>
                <p>{user?.email || 'No email available'}</p>
              </div>

              <div className="profile-summary-meta">
                <div>
                  <span>Preferred Role</span>
                  <strong>{user?.roleInterested || 'Not set yet'}</strong>
                </div>
                <div>
                  <span>Experience Level</span>
                  <strong>{user?.experienceLevel || 'Not set yet'}</strong>
                </div>
              </div>

              <div className="profile-strength-card">
                <div className="profile-strength-header">
                  <ShieldCheck size={18} />
                  <span>Profile strength</span>
                </div>
                <strong>{profileCompletion}% complete</strong>
                <div className="profile-strength-track">
                  <span style={{ width: `${profileCompletion}%` }} />
                </div>
              </div>

              <button
                type="button"
                className="secondary-button profile-summary-action"
                onClick={() => document.getElementById('profile-details-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              >
                Edit
              </button>
            </aside>

            <div className="profile-details-card" id="profile-details-card">
              <div className="profile-card-heading">
                <div>
                  <span className="section-eyebrow">About</span>
                  <h3>Profile details</h3>
                </div>
                <button type="button" className="primary-button" disabled={submitting} onClick={handleSaveProfile}>
                  {submitting ? 'Saving...' : 'Edit details'}
                </button>
              </div>

              <div className="profile-form-grid">
                <label>
                  Full Name
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                </label>
                <label>
                  Email
                  <input type="email" value={user?.email || ''} disabled />
                </label>
                <label>
                  Phone Number
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                </label>
                <label>
                  Location
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Mumbai, India" />
                </label>
                <label>
                  Preferred Role
                  <input type="text" name="roleInterested" value={formData.roleInterested} onChange={handleChange} />
                </label>
                <label>
                  Experience Level
                  <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                    <option value="">Choose one</option>
                    <option value="Fresher">Fresher</option>
                    <option value="1-3 Years">1-3 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </label>
                <label>
                  Preferred Location
                  <input type="text" name="preferredLocation" value={formData.preferredLocation} onChange={handleChange} placeholder="Remote / Bengaluru" />
                </label>
                <label>
                  Skills
                  <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="SEO, CRM, lead generation" />
                </label>
                <label className="profile-field-full">
                  Short Bio
                  <textarea
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Share a short summary about your marketing and sales background."
                  />
                </label>
              </div>

              {status.text ? <p className={`form-status ${status.type}`}>{status.text}</p> : null}
            </div>
          </div>

          <section className="profile-stats-grid">
            {stats.map((item) => (
              <article key={item.label} className="profile-stat-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.helper}</p>
              </article>
            ))}
          </section>

          <section className="profile-resume-section-card">
            <div className="profile-card-heading">
              <div>
                <span className="section-eyebrow">Attachments</span>
                <h3>Resume, CV &amp; Attachments</h3>
              </div>
            </div>

            <div className="profile-resume-section-layout">
              <div className="profile-resume-file-card">
                <div className="profile-resume-file-icon">
                  <FileText size={18} />
                </div>
                <div className="profile-resume-file-copy">
                  <strong>{user?.resume?.originalName || 'No resume uploaded yet'}</strong>
                  <span>
                    {user?.resume?.uploadDate
                      ? `Uploaded on ${new Date(user.resume.uploadDate).toLocaleDateString()}`
                      : 'Upload a PDF, DOC, or DOCX resume from this section to keep your profile ready.'}
                  </span>
                </div>
              </div>

              <div className="profile-resume-upload-shell">
                <label className="profile-resume-upload-card">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="profile-resume-upload-input"
                    onChange={handleResumeChange}
                    disabled={uploadingResume}
                  />
                  <div className="profile-resume-upload-icon">
                    <Upload size={18} />
                  </div>
                  <div className="profile-resume-upload-copy">
                    <strong>{uploadingResume ? 'Uploading resume...' : user?.resume?.filepath ? 'Replace Resume' : 'Upload Resume'}</strong>
                    <span>Accepted formats: PDF, DOC, DOCX up to 5MB</span>
                  </div>
                  <div className="profile-resume-upload-file">
                    <FileText size={16} />
                    <span>{selectedResumeName || user?.resume?.originalName || 'No file selected'}</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="profile-resume-actions">
              <button type="button" className="secondary-button" onClick={() => document.querySelector('.profile-resume-upload-input')?.click()}>
                <Upload size={16} />
                {resumeUrl ? 'Replace Resume' : 'Upload Resume'}
              </button>
              <button type="button" className="secondary-button" onClick={() => openResumeFile('view')} disabled={!resumeUrl}>
                <Eye size={16} />
                View Resume
              </button>
              <button type="button" className="secondary-button" onClick={() => openResumeFile('download')} disabled={!resumeUrl}>
                <Download size={16} />
                Download Resume
              </button>
            </div>

            {resumeStatus.text ? <p className={`register-upload-status ${resumeStatus.type}`}>{resumeStatus.text}</p> : null}
          </section>

          <section className="profile-education-section-card">
            <div className="profile-card-heading">
              <div>
                <span className="section-eyebrow">Education</span>
                <h3>Education</h3>
              </div>
              <button type="button" className="secondary-button" onClick={handleAddEducation}>
                <Plus size={16} />
                Add Education
              </button>
            </div>

            <div className="profile-education-grid">
              {formData.education.map((item, index) => (
                <article key={`education-${index}`} className="profile-education-card">
                  <div className="profile-education-card-top">
                    <strong>Entry {index + 1}</strong>
                  </div>
                  <div className="profile-form-grid profile-education-form-grid">
                    <label>
                      Degree
                      <input
                        type="text"
                        value={item.degree}
                        onChange={(event) => handleEducationChange(index, 'degree', event.target.value)}
                        placeholder="BBA / MBA / BA"
                      />
                    </label>
                    <label>
                      College / Institution
                      <input
                        type="text"
                        value={item.institution}
                        onChange={(event) => handleEducationChange(index, 'institution', event.target.value)}
                        placeholder="Institution name"
                      />
                    </label>
                    <label>
                      Year
                      <input
                        type="text"
                        value={item.year}
                        onChange={(event) => handleEducationChange(index, 'year', event.target.value)}
                        placeholder="2024"
                      />
                    </label>
                    <label>
                      Specialization / Field
                      <input
                        type="text"
                        value={item.field}
                        onChange={(event) => handleEducationChange(index, 'field', event.target.value)}
                        placeholder="Marketing / Commerce"
                      />
                    </label>
                    <label>
                      Percentage / Grade
                      <input
                        type="text"
                        value={item.grade}
                        onChange={(event) => handleEducationChange(index, 'grade', event.target.value)}
                        placeholder="8.2 CGPA / 82%"
                      />
                    </label>
                  </div>
                </article>
              ))}
            </div>
            <div className="profile-education-actions">
              <button type="button" className="primary-button" disabled={submitting} onClick={handleSaveProfile}>
                {submitting ? 'Saving...' : 'Save Education'}
              </button>
            </div>
          </section>

          <div className="profile-extra-grid">
            <article className="profile-extra-card">
              <span className="section-eyebrow">Career preferences</span>
              <h3>Current focus</h3>
              <p>
                {formData.roleInterested
                  ? `${formData.roleInterested} roles${formData.preferredLocation ? ` around ${formData.preferredLocation}` : ''} at the ${formData.experienceLevel || 'preferred'} level.`
                  : 'Add your preferred role, location, and experience level to guide recruiters.'}
              </p>
            </article>
            <article className="profile-extra-card">
              <span className="section-eyebrow">Contact snapshot</span>
              <h3>Reachability</h3>
              <ul className="profile-contact-list">
                <li>
                  <Mail size={16} />
                  <span>{user?.email || 'No email added'}</span>
                </li>
                <li>
                  <Phone size={16} />
                  <span>{formData.phone || 'No phone added yet'}</span>
                </li>
                <li>
                  <MapPin size={16} />
                  <span>{formData.location || 'No location added yet'}</span>
                </li>
                <li>
                  <BriefcaseBusiness size={16} />
                  <span>{user?.appliedJobsCount ?? 0} jobs applied</span>
                </li>
              </ul>
            </article>
          </div>
        </motion.div>
      </RevealSection>
    </>
  );
}

export default ProfilePage;
