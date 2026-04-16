import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  roleInterested: '',
  experienceLevel: '',
  message: ''
};

function ContactForm({ roles, apiBaseUrl, selectedRole = '' }) {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState(() => ({
    ...initialState,
    fullName: user?.fullName || '',
    email: user?.email || '',
    roleInterested: selectedRole || user?.roleInterested || '',
    experienceLevel: user?.experienceLevel || ''
  }));
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fullName: prev.fullName || user?.fullName || '',
      email: prev.email || user?.email || '',
      roleInterested: selectedRole || prev.roleInterested || user?.roleInterested || '',
      experienceLevel: prev.experienceLevel || user?.experienceLevel || ''
    }));
  }, [selectedRole, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', text: '' });

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.roleInterested.trim() ||
      !formData.experienceLevel.trim() ||
      !formData.message.trim()
    ) {
      setStatus({ type: 'error', text: 'Please complete every field before submitting.' });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to submit your application.');
      }

      setStatus({
        type: 'success',
        text: 'Application submitted successfully. We will be in touch soon.'
      });
      window.dispatchEvent(
        new CustomEvent('application:created', {
          detail: result.application
        })
      );
      setFormData({
        ...initialState,
        fullName: user?.fullName || '',
        email: user?.email || '',
        roleInterested: selectedRole || user?.roleInterested || '',
        experienceLevel: user?.experienceLevel || ''
      });
    } catch (error) {
      setStatus({
        type: 'error',
        text: error.message || 'Something went wrong while submitting the form.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      className="contact-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <div className="form-grid">
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
          Phone
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
          />
        </label>

        <label>
          Role Interested
          <select
            name="roleInterested"
            value={formData.roleInterested}
            onChange={handleChange}
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role._id || role.title} value={role.title}>
                {role.title}
              </option>
            ))}
          </select>
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

        <label className="message-field">
          Message
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your interests, goals, or current experience."
            rows="5"
          />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Apply Now'}
        </button>
        {status.text ? (
          <p className={`form-status ${status.type}`}>{status.text}</p>
        ) : null}
      </div>
    </motion.form>
  );
}

export default ContactForm;
