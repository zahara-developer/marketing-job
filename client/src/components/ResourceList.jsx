import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

function ResourceList({ resources }) {
  return (
    <div className="resource-list">
      {resources.map((resource, index) => (
        <motion.a
          key={resource._id || resource.title}
          href={resource.link}
          target="_blank"
          rel="noreferrer"
          className="resource-item"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
        >
          <div>
            <span className="resource-type">{resource.type}</span>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
          </div>
          <ArrowUpRight size={18} />
        </motion.a>
      ))}
    </div>
  );
}

export default ResourceList;
