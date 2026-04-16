import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import ResourceList from '../components/ResourceList';
import { motion } from 'framer-motion';
import { imageSources } from '../assets/images/imageSources';
import { professionalVideos } from '../data/siteContent';
import useSiteData from '../hooks/useSiteData';

function ResourcesPage() {
  const { resources, loading, error } = useSiteData();

  return (
    <>
      <PageHero
        eyebrow="Learning resources"
        title="Build sharper instincts with resources that reflect how the industry actually works."
        description="Start with practical guides, training material, curated learning, and industry insights that support internships and job applications."
        image={imageSources.resources}
        imageAlt="Digital marketing dashboard displayed on a screen"
      />

      <section className="content-section">
        <SectionHeader
          eyebrow="Resource picks"
          title="Learn in a way that makes your portfolio and interviews stronger."
          description="Explore practical reading and learning picks that help you grow with more clarity and confidence."
        />
        {loading ? <p className="status-text">Loading resources...</p> : null}
        {error ? <p className="status-text error-text">{error}</p> : null}
        {!loading && !error ? <ResourceList resources={resources} /> : null}
      </section>

      <section className="content-section video-section">
        <SectionHeader
          eyebrow="Watch industry insights"
          title="Watch professional talks on marketing and sales careers."
          description="These YouTube videos give a more real-world feel for role expectations, growth, and career direction."
          align="center"
        />
        <div className="video-grid">
          {professionalVideos.map((video, index) => (
            <motion.article
              key={video.title}
              className="video-frame"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <div className="video-section-head">
                <div>
                  <span className="section-eyebrow">YouTube Talk</span>
                  <h3>{video.title}</h3>
                </div>
              </div>
              <iframe
                src={video.embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              <p className="video-description">{video.description}</p>
              <a
                className="video-link"
                href={video.watchUrl}
                target="_blank"
                rel="noreferrer"
              >
                Watch on YouTube
              </a>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}

export default ResourcesPage;
