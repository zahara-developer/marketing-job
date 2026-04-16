import { motion } from 'framer-motion';

const companyLinks = {
  Google: 'https://about.google/',
  Microsoft: 'https://www.microsoft.com/',
  Deloitte: 'https://www.deloitte.com/',
  Accenture: 'https://www.accenture.com/',
  Meta: 'https://about.meta.com/',
  LinkedIn: 'https://www.linkedin.com/company/linkedin/',
  Amazon: 'https://www.aboutamazon.com/',
  HubSpot: 'https://www.hubspot.com/',
  Salesforce: 'https://www.salesforce.com/',
  Adobe: 'https://www.adobe.com/'
};

function CompanySpotlight({ companies }) {
  return (
    <div className="company-grid">
      {companies.map((company, index) => (
        <motion.article
          key={company._id || company.name}
          className="company-item"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -6 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
        >
          <a
            href={companyLinks[company.name] || `https://www.google.com/search?q=${encodeURIComponent(company.name)}`}
            target="_blank"
            rel="noreferrer"
            className="company-link-card"
            aria-label={`Open ${company.name}`}
          >
            <div className="company-mark">
              {company.name
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div className="company-topline">
              <span>{company.industry}</span>
              <span>{company.location}</span>
            </div>
            <h3>{company.name}</h3>
            <p>{company.shortDescription}</p>
          </a>
        </motion.article>
      ))}
    </div>
  );
}

export default CompanySpotlight;
