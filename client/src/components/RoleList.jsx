import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSavedJobs from '../hooks/useSavedJobs';

function RoleList({ roles, showDetails = false, showMatchBadge = false }) {
  const { isSaved, toggleSavedJob } = useSavedJobs();

  return (
    <div className="role-list roles-grid-page">
      {roles.map((role, index) => (
        <motion.article
          key={role._id || role.title}
          className="role-row role-card-page"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
        >
          <div className="role-card-page-header">
            <div className="role-card-page-topline">
              {role.category ? <span className="role-category">{role.category}</span> : null}
              {showMatchBadge ? <span className="role-best-match-badge">Best Match</span> : null}
            </div>
            <h3>{role.title}</h3>
            {role.company || role.companyName ? <p className="role-company-name">{role.company || role.companyName}</p> : null}
            {(role.location || role.salaryRange) ? (
              <div className="role-meta role-directory-meta">
                {role.location ? <span>{role.location}</span> : null}
                {role.salaryRange ? <span>{role.salaryRange}</span> : null}
                {role.experienceLevel ? <span>{role.experienceLevel}</span> : null}
              </div>
            ) : null}
          </div>
          {role.description ? <p className="role-card-summary">{role.description}</p> : null}
          {Array.isArray(role.skills) && role.skills.length ? (
            <div className="role-directory-tags">
              {role.skills.slice(0, 4).map((skill) => (
                <span key={skill} className="role-directory-tag">
                  {skill}
                </span>
              ))}
            </div>
          ) : null}
          <div className="role-card-actions">
            <button
              type="button"
              className={`job-save-button ${isSaved(role._id || role.title) ? 'saved' : ''}`}
              onClick={() => toggleSavedJob(role._id || role.title)}
              aria-label={isSaved(role._id || role.title) ? 'Remove saved job' : 'Save job'}
            >
              {isSaved(role._id || role.title) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
            <Link
              to={`/apply?role=${encodeURIComponent(role.title)}`}
              className="primary-button"
            >
              Apply Job
            </Link>
            {showDetails ? (
              <Link
                to={`/roles?keyword=${encodeURIComponent(role.title)}`}
                className="secondary-button"
              >
                View Details
              </Link>
            ) : null}
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export default RoleList;
