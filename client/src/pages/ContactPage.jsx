import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import { imageSources } from '../assets/images/imageSources';

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Reach out if you want help, guidance, or support."
        description="Use this page to contact the team for questions about roles, guidance, or next steps."
        image={imageSources.contact}
        imageAlt="Professional contact and support"
      />

      <section className="content-section">
        <SectionHeader
          eyebrow="Get in touch"
          title="Contact the team directly"
          description="If you need support, want to ask a question, or need direction, use the details below."
        />
        <div className="auth-shell">
          <div className="contact-form">
            <div className="candidate-card-grid">
              <div>
                <label>Email</label>
                <span>contact@marketingsalesstudio.com</span>
              </div>
              <div>
                <label>Phone</label>
                <span>+91 9876543210</span>
              </div>
              <div>
                <label>Location</label>
                <span>Bengaluru, India</span>
              </div>
              <div>
                <label>Support</label>
                <span>Career guidance, role questions, and hiring support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
