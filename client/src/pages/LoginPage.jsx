import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { imageSources } from '../assets/images/imageSources';
import { useAuth } from '../context/AuthContext';
import { API } from '../data/siteContent';

const googleAuthUrl = import.meta.env.VITE_GOOGLE_AUTH_URL || '';

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

      const result = await response.json();

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
    <>
      <PageHero
        eyebrow="Login"
        title="Pick up your applications and career progress in one place."
        description="Log in to view your profile, saved details, and account activity."
        image={imageSources.contact}
        imageAlt="Professional login and career support"
      />

      <section className="content-section">
        <div className="auth-shell">
          <motion.form
            className="auth-card"
            onSubmit={showForgotPassword ? handleForgotPassword : handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
          >
            <h2>{showForgotPassword ? 'Forgot Password' : 'Login'}</h2>
            <p>
              {showForgotPassword
                ? 'Reset your password here, then use the same login box to sign back in.'
                : 'Access your account with the email and password you registered with.'}
            </p>

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

            <button type="submit" className="primary-button" disabled={submitting}>
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
                  <span>or</span>
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
          </motion.form>
        </div>
      </section>
    </>
  );
}

export default LoginPage;
