import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import { imageSources } from '../assets/images/imageSources';
import { aboutPoints, staticSkills } from '../data/siteContent';

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the field"
        title="Marketing and sales careers sit where creativity meets measurable growth."
        description="These roles shape how brands are discovered, trusted, and chosen across digital channels, partnerships, product narratives, and revenue conversations."
        image={imageSources.about}
        imageAlt="Business teamwork during a campaign planning session"
      />

      <section className="content-section">
        <SectionHeader
          eyebrow="Why it matters"
          title="This career space is dynamic, commercial, and deeply human."
          description="You can work on analytics, storytelling, outreach, retention, positioning, and customer experience, often all within the same growth ecosystem."
        />
        <div className="about-copy">
          {aboutPoints.map((point, index) => (
            <motion.div
              key={point.title}
              className="about-point"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55 }}
            >
              <point.icon size={20} />
              <div>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="content-section alt-section">
        <SectionHeader
          eyebrow="Skill blend"
          title="The strongest profiles are both persuasive and analytical."
          description="That balance is why these careers appeal to people who enjoy strategy, communication, problem-solving, and visible business impact."
        />
        <div className="skills-layout">
          {staticSkills.map((skill) => (
            <div key={skill} className="skill-pill">
              {skill}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default AboutPage;
