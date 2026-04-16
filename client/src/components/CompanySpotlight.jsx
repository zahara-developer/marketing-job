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

const companyLogoDomains = {
  Google: 'google.com',
  Microsoft: 'microsoft.com',
  Deloitte: 'deloitte.com',
  Accenture: 'accenture.com',
  Meta: 'meta.com',
  LinkedIn: 'linkedin.com',
  Amazon: 'amazon.com',
  HubSpot: 'hubspot.com',
  Salesforce: 'salesforce.com',
  Adobe: 'adobe.com',
  Unilever: 'unilever.com',
  'Coca-Cola': 'coca-colacompany.com'
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
            <div className="company-logo-wrap">
              <img
                className="company-logo-image"
                src={`https://logo.clearbit.com/${companyLogoDomains[company.name] || 'google.com'}`}
                alt={`${company.name} logo`}
                onLoad={(event) => {
                  event.currentTarget.parentElement.classList.add('company-logo-loaded');
                }}
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
              <div className="company-mark">
                {company.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)}
              </div>
            </div>
            <div className="company-topline">
              <span>{company.industry}</span>
              <span>{company.location}</span>
            </div>
            <h3>{company.name}</h3>
            <p>{company.shortDescription}</p>
            <span className="company-connection-copy">We are connected with this company for marketing and sales opportunities.</span>
          </a>
        </motion.article>
      ))}
    </div>
  );
}

export default CompanySpotlight;
