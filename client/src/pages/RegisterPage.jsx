import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { imageSources } from '../assets/images/imageSources';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  roleInterested: '',
  experienceLevel: ''
};

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', text: '' });
    setSubmitting(true);

    try {
      const user = await register(formData);
      setStatus({ type: 'success', text: `Welcome, ${user.fullName}. Your account is ready.` });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setStatus({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Register"
        title="Create your account and keep your career details ready."
        description="Save your profile so you can log in, track your information, and stay connected."
        image={imageSources.hero}
        imageAlt="Career registration and onboarding"
      />

      <section className="content-section">
        <div className="auth-shell">
          <motion.form
            className="auth-card"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
          >
            <h2>Register</h2>
            <p>Create a secure account and keep your role preferences available after login.</p>

            <label>
              Full Name
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
              />
            </label>

            <label>
              Role Interested
              <input
                type="text"
                name="roleInterested"
                value={formData.roleInterested}
                onChange={handleChange}
                placeholder="Digital Marketing Executive"
              />
            </label>

            <label>
              Experience Level
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="">Choose one</option>
                <option value="Fresher">Fresher</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </label>

            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Register'}
            </button>
            {status.text ? <p className={`form-status ${status.type}`}>{status.text}</p> : null}
            <p className="auth-link-copy">
              Already registered? <Link to="/login">Login here</Link>
            </p>
          </motion.form>
        </div>
      </section>
    </>
  );
}

export default RegisterPage;
