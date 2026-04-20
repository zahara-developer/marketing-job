import { motion } from 'framer-motion';
import { companyLogoMap } from '../assets/logos/companyLogos';

const companyLinks = {
  Google: 'https://about.google/',
  Microsoft: 'https://www.microsoft.com/',
  LinkedIn: 'https://www.linkedin.com/company/linkedin/',
  Amazon: 'https://www.aboutamazon.com/',
  HubSpot: 'https://www.hubspot.com/',
  Salesforce: 'https://www.salesforce.com/',
  Adobe: 'https://www.adobe.com/',
  Shopify: 'https://www.shopify.com/',
  Zoho: 'https://www.zoho.com/',
  Oracle: 'https://www.oracle.com/',
  Meta: 'https://about.meta.com/',
  IBM: 'https://www.ibm.com/',
  TCS: 'https://www.tcs.com/',
  Infosys: 'https://www.infosys.com/',
  Accenture: 'https://www.accenture.com/'
};

const companyRoleTags = {
  Google: ['Digital Marketing', 'Marketing Analyst', 'Brand Management'],
  Microsoft: ['Sales Executive', 'Business Development', 'Marketing Analyst'],
  Amazon: ['Sales Executive', 'Business Development', 'Inside Sales'],
  HubSpot: ['Digital Marketing', 'Marketing Analyst', 'Inside Sales'],
  Salesforce: ['Sales Executive', 'Business Development', 'Inside Sales'],
  Adobe: ['Brand Management', 'Digital Marketing', 'Marketing Analyst'],
  Shopify: ['Digital Marketing', 'Business Development', 'Sales Executive'],
  Zoho: ['Sales Executive', 'Inside Sales', 'Marketing Analyst'],
  LinkedIn: ['Brand Management', 'Business Development', 'Digital Marketing'],
  Oracle: ['Enterprise Sales', 'Demand Generation', 'Partner Marketing'],
  Meta: ['Growth Marketing', 'Brand Strategy', 'Account Management'],
  IBM: ['B2B Marketing', 'Solution Sales', 'Client Success'],
  TCS: ['Business Development', 'Inside Sales', 'Account Growth'],
  Infosys: ['Digital Marketing', 'Client Partnerships', 'Solution Consulting'],
  Accenture: ['Brand Marketing', 'Consultative Sales', 'Growth Strategy']
};

function CompanySpotlight({ companies }) {
  return (
    <div className="company-grid">
      {companies.map((company, index) => {
        const roleTags = company.roles?.length ? company.roles.slice(0, 4) : companyRoleTags[company.name] || [];
        const resolvedLogo = companyLogoMap[company.name] || company.logo || '';

        return (
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
                  src={resolvedLogo}
                  alt={`${company.name} logo`}
                  onLoad={(event) => {
                    event.currentTarget.parentElement.classList.add('company-logo-loaded');
                  }}
                  onError={(event) => {
                    event.currentTarget.parentElement.classList.remove('company-logo-loaded');
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
                <span>{company.industry || 'Hiring company'}</span>
                <span>{company.location || 'Global'}</span>
              </div>
              <h3>{company.name}</h3>
              <p>{company.shortDescription || company.description || 'Company profile available.'}</p>
              {roleTags.length ? (
                <div className="company-role-tags" aria-label={`${company.name} related roles`}>
                  {roleTags.map((role) => (
                    <span key={role} className="company-role-tag">
                      {role}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="company-card-footer">
                <span className="company-card-cta">Explore jobs</span>
              </div>
            </a>
          </motion.article>
        );
      })}
    </div>
  );
}

export default CompanySpotlight;
