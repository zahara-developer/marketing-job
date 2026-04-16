import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function RoleList({ roles }) {
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
          <div>
            <span className="role-category">{role.category}</span>
            <h3>{role.title}</h3>
            <div className="role-meta">
              <span>{role.location}</span>
              <span>{role.salaryRange}</span>
            </div>
          </div>
          <p className="role-card-summary">
            {Array.isArray(role.skills) && role.skills.length
              ? role.skills.slice(0, 3).join(', ')
              : role.description}
          </p>
          <div className="role-card-actions">
            <Link
              to={`/contact?role=${encodeURIComponent(role.title)}`}
              className="primary-button"
            >
              Apply Job
            </Link>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export default RoleList;
