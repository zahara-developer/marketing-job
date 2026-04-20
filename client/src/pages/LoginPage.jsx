import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, Sparkles } from 'lucide-react';
import { imageSources } from '../assets/images/imageSources';
import hireflowLogo from '../assets/logo/hireflow-logo.svg';
import { useAuth } from '../context/AuthContext';
import { API } from '../data/siteContent';

const googleAuthUrl = import.meta.env.VITE_GOOGLE_AUTH_URL || '';

const parseJsonSafely = async (response, requestLabel) => {
  const rawText = await response.text();
  const trimmedText = rawText.trim();

  console.debug(`[LoginPage] ${requestLabel} response`, {
    url: response.url,
    status: response.status,
    ok: response.ok,
    hasBody: Boolean(trimmedText),
    contentType: response.headers.get('content-type') || ''
  });

  if (!trimmedText) {
    return {};
  }

  try {
    return JSON.parse(trimmedText);
  } catch (error) {
    console.error(`[LoginPage] ${requestLabel} invalid JSON`, {
      url: response.url,
      status: response.status,
      bodyPreview: trimmedText.slice(0, 240),
      error
    });

    throw new Error('The server returned an invalid response. Please try again.');
  }
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [resetData, setResetData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetChange = (event) => {
    const { name, value } = event.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', text: '' });
    setSubmitting(true);

    try {
      const user = await login(formData);
      setStatus({ type: 'success', text: `Welcome back, ${user.fullName}.` });
      const nextPath = location.state?.from || '/dashboard';
      navigate(nextPath, { replace: true });
    } catch (error) {
      setStatus({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setStatus({ type: '', text: '' });

    if (
      !resetData.email.trim() ||
      !resetData.newPassword.trim() ||
      !resetData.confirmPassword.trim()
    ) {
      setStatus({ type: 'error', text: 'Please complete all forgot password fields.' });
      return;
    }

    if (resetData.newPassword !== resetData.confirmPassword) {
      setStatus({ type: 'error', text: 'New password and confirm password must match.' });
      return;
    }

    setSubmitting(true);

    try {
      console.debug('[LoginPage] forgot-password request', {
        url: `${API}/auth/forgot-password`,
        method: 'POST',
        hasEmail: Boolean(resetData.email),
        hasNewPassword: Boolean(resetData.newPassword)
      });

      const response = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: resetData.email,
          newPassword: resetData.newPassword
        })
      });

      const result = await parseJsonSafely(response, 'forgot-password');

      if (!response.ok) {
        throw new Error(result.message || 'Unable to reset password.');
      }

      setFormData((prev) => ({ ...prev, email: resetData.email, password: '' }));
      setResetData({ email: resetData.email, newPassword: '', confirmPassword: '' });
      setShowForgotPassword(false);
      setStatus({ type: 'success', text: result.message });
    } catch (error) {
      setStatus({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!googleAuthUrl) {
      setStatus({
        type: 'error',
        text: 'Google login is not configured yet.'
      });
      return;
    }

    window.location.href = googleAuthUrl;
  };

  return (
    <section className="content-section auth-page-section">
      <div className="auth-shell auth-shell-premium">
        <motion.div
          className="auth-visual-card"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          <img
            src={imageSources.contact}
            alt="Marketing and sales professionals collaborating"
            className="auth-visual-image"
          />
          <div className="auth-visual-overlay" />
          <div className="auth-visual-copy">
            <span className="auth-visual-badge">
              <Sparkles size={14} />
              Career access
            </span>
            <h2>Find premium marketing and sales opportunities</h2>
            <p>Stay close to recruiters, roles, and next-step opportunities with one polished login flow.</p>
            <div className="auth-visual-note">
              <BriefcaseBusiness size={16} />
              <span>Marketing &amp; Sales Career Studio</span>
            </div>
          </div>
        </motion.div>

        <motion.form
          className="auth-card auth-card-premium"
          onSubmit={showForgotPassword ? handleForgotPassword : handleSubmit}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          <div className="auth-form-intro">
            <div className="login-logo">
              <img src={hireflowLogo} alt="Hireflow logo" className="logo-img" />
            </div>
            <span className="hero-kicker auth-form-kicker">
              {showForgotPassword ? 'Password help' : 'Welcome back'}
            </span>
            <h2>{showForgotPassword ? 'Reset your password' : 'Sign in to your account'}</h2>
            <p>
              {showForgotPassword
                ? 'Update your password and return to your marketing and sales career dashboard.'
                : 'Access your marketing and sales career dashboard.'}
            </p>
          </div>

          <div className="auth-field-stack">
            {showForgotPassword ? (
              <>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={resetData.email}
                    onChange={handleResetChange}
                    placeholder="name@example.com"
                  />
                </label>

                <label>
                  New Password
                  <input
                    type="password"
                    name="newPassword"
                    value={resetData.newPassword}
                    onChange={handleResetChange}
                    placeholder="Minimum 6 characters"
                  />
                </label>

                <label>
                  Confirm Password
                  <input
                    type="password"
                    name="confirmPassword"
                    value={resetData.confirmPassword}
                    onChange={handleResetChange}
                    placeholder="Re-enter your new password"
                  />
                </label>
              </>
            ) : (
              <>
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
                    placeholder="Enter your password"
                  />
                </label>
              </>
            )}
          </div>

          <button type="submit" className="primary-button auth-submit-button" disabled={submitting}>
            {submitting
              ? showForgotPassword
                ? 'Updating password...'
                : 'Logging in...'
              : showForgotPassword
                ? 'Reset Password'
                : 'Login'}
          </button>

          {!showForgotPassword ? (
            <>
              <div className="auth-divider">
                <span>or continue with</span>
              </div>
              <button
                type="button"
                className="secondary-button auth-google-button"
                onClick={handleGoogleLogin}
              >
                Continue with Google
              </button>
            </>
          ) : null}

          {status.text ? <p className={`form-status ${status.type}`}>{status.text}</p> : null}

          <div className="auth-footer-row">
            <button
              type="button"
              className="auth-inline-button"
              onClick={() => {
                setShowForgotPassword((prev) => !prev);
                setStatus({ type: '', text: '' });
              }}
            >
              {showForgotPassword ? 'Back to login' : 'Forgot password?'}
            </button>
            <p className="auth-link-copy">
              New here? <Link to="/register">Create an account</Link>
            </p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

export default LoginPage;
