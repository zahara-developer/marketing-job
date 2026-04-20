import RevealSection from './RevealSection';

function LegalPageLayout({ title, intro, sections }) {
  return (
    <RevealSection className="content-section">
      <div className="legal-page-shell">
        <header className="legal-page-hero">
          <span className="section-eyebrow">Legal</span>
          <h1>{title}</h1>
          <p>{intro}</p>
        </header>

        <div className="legal-sections-grid">
          {sections.map((section, index) => (
            <section key={section.heading} className="legal-section-card">
              <span className="legal-section-index">{`${index + 1}`.padStart(2, '0')}</span>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={`${section.heading}-${paragraphIndex}`}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}

export default LegalPageLayout;
