import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { verifyEmail } from '../../services/auth.service';

function readAndRemoveToken() {
  const token = new URLSearchParams(window.location.hash.slice(1)).get('token') || '';
  window.history.replaceState(null, document.title, `${window.location.pathname}${window.location.search}`);
  return token;
}

export default function VerifyEmail() {
  const [token] = useState(readAndRemoveToken);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(
    token ? null : { type: 'error', message: 'This verification link is invalid or has expired.' }
  );

  const handleVerify = async () => {
    setIsSubmitting(true);
    try {
      const response = await verifyEmail(token);
      setFeedback({ type: 'success', message: response.message });
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || error.message
        : 'We could not verify your email. Please try again.';
      setFeedback({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-action-page">
      <h1>Verify your email</h1>
      {feedback && <p role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.message}</p>}
      {!feedback && (
        <button type="button" className="verify-btn" onClick={handleVerify} disabled={isSubmitting}>
          {isSubmitting ? 'Verifying...' : 'Verify Email'}
        </button>
      )}
      {feedback?.type === 'success' && <Link to="/login">Sign in</Link>}
      {feedback?.type === 'error' && <Link to="/login">Return to sign in</Link>}
    </main>
  );
}
