import axios from 'axios';
import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import InputField from '../../components/inputfield/input';
import { resetPassword } from '../../services/auth.service';
import { useAuth } from '../../stores/authstore';

function readAndRemoveToken() {
  const token = new URLSearchParams(window.location.hash.slice(1)).get('token') || '';
  window.history.replaceState(null, document.title, `${window.location.pathname}${window.location.search}`);
  return token;
}

export default function ResetPassword() {
  const [token] = useState(readAndRemoveToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(
    token ? null : { type: 'error', message: 'This reset link is invalid or has expired.' }
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if ([...password].length < 8) {
      setFeedback({ type: 'error', message: 'Use a password with at least 8 characters.' });
      return;
    }
    if (password !== confirmPassword) {
      setFeedback({ type: 'error', message: 'The passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resetPassword(token, password);
      useAuth.getState().setUnauthenticated();
      setFeedback({ type: 'success', message: response.message });
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || error.message
        : 'We could not reset your password. Please try again.';
      setFeedback({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-action-page">
      <h1>Choose a new password</h1>
      {feedback?.type === 'success' ? (
        <>
          <p role="status">{feedback.message}</p>
          <Link to="/login">Sign in</Link>
        </>
      ) : (
        <>
          {feedback?.type === 'error' && <p role="alert">{feedback.message}</p>}
          {token && (
            <form onSubmit={handleSubmit} className="auth-action-form">
              <InputField
                label="New Password"
                multiline={false}
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <InputField
                label="Confirm Password"
                multiline={false}
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              <button type="submit" className="verify-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Reset Password'}
              </button>
            </form>
          )}
          <Link to="/login">Return to sign in</Link>
        </>
      )}
    </main>
  );
}
