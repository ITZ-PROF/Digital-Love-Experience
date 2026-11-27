import axios from 'axios';
import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './auth.css';
import InputField from '../../components/inputfield/input';
import authImg from '../../assets/authimage.svg';
import fulllogo from '../../assets/full-logo.svg';
import LoadingPage from '../../components/loadingpage/loader';
import { useLogin, useRegister } from '../../hooks/use-auth';
import { requestPasswordReset, resendVerificationEmail } from '../../services/auth.service';
import { useAuth } from '../../stores/authstore';

type Feedback = { type: 'error' | 'success'; message: string };
type LoginLocationState = { from?: { pathname?: string } };

const getApiErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message || error.message || fallback;
    }
    return fallback;
};

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const authStatus = useAuth((state) => state.status);
    const destination = (location.state as LoginLocationState | null)?.from?.pathname || '/dashboard';
    const [isExistingUser, setIsExistingUser] = useState(
        () => new URLSearchParams(location.search).get('mode') === 'login'
    );
    const [isResetting, setIsResetting] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [canResendVerification, setCanResendVerification] = useState(false);
    const [recoveryPending, setRecoveryPending] = useState(false);
    const { mutate: loginMutate, isPending: loginPending } = useLogin();
    const { mutate: registerMutate, isPending: registerPending } = useRegister();
    const isPending = loginPending || registerPending || recoveryPending || authStatus === 'checking';

    if (authStatus === 'authenticated') {
        return <Navigate to={destination} replace />;
    }

    const validate = () => {
        if (isResetting) {
            if (!email.trim()) {
                setFeedback({ type: 'error', message: 'Enter the email address for your account.' });
                return false;
            }
        } else {
            if (!isExistingUser && !fullName.trim()) {
                setFeedback({ type: 'error', message: 'Enter your full name.' });
                return false;
            }
            if (!email.trim()) {
                setFeedback({ type: 'error', message: 'Enter your email address.' });
                return false;
            }
            if (!isResetting && !password) {
                setFeedback({ type: 'error', message: 'Enter your password.' });
                return false;
            }
            if (!isExistingUser && !isResetting && [...password].length < 8) {
                setFeedback({ type: 'error', message: 'Use a password with at least 8 characters.' });
                return false;
            }
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setFeedback({ type: 'error', message: 'Enter a valid email address.' });
            return false;
        }

        setFeedback(null);
        setCanResendVerification(false);
        return true;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validate()) return;

        const normalizedEmail = email.trim().toLowerCase();
        if (isResetting) {
            setRecoveryPending(true);
            requestPasswordReset(normalizedEmail)
                .then((response) => setFeedback({ type: 'success', message: response.message }))
                .catch((error: unknown) => setFeedback({
                    type: 'error',
                    message: getApiErrorMessage(error, 'We could not request a password reset. Please try again.'),
                }))
                .finally(() => setRecoveryPending(false));
            return;
        }

        if (!isExistingUser) {
            registerMutate(
                { fullName: fullName.trim(), email: normalizedEmail, password },
                {
                    onSuccess: (response) => setFeedback({ type: 'success', message: response.message }),
                    onError: (error) => setFeedback({
                        type: 'error',
                        message: getApiErrorMessage(error, 'We could not create your account. Please try again.'),
                    }),
                }
            );
            return;
        }

        loginMutate(
            { email: normalizedEmail, password },
            {
                onSuccess: () => navigate(destination, { replace: true }),
                onError: (error) => {
                    const isUnverified = axios.isAxiosError<{ code?: string }>(error)
                        && error.response?.data?.code === 'EMAIL_NOT_VERIFIED';
                    setCanResendVerification(isUnverified);
                    setFeedback({
                        type: 'error',
                        message: getApiErrorMessage(error, 'We could not sign you in. Please try again.'),
                    });
                },
            }
        );
    };

    const handleResendVerification = async () => {
        setRecoveryPending(true);
        try {
            const response = await resendVerificationEmail(email.trim().toLowerCase());
            setFeedback({ type: 'success', message: response.message });
            setCanResendVerification(false);
        } catch (error) {
            setFeedback({
                type: 'error',
                message: getApiErrorMessage(error, 'We could not resend the verification email. Please try again.'),
            });
        } finally {
            setRecoveryPending(false);
        }
    };

    const switchMode = (existing: boolean) => {
        setIsExistingUser(existing);
        setIsResetting(false);
        setFeedback(null);
        setCanResendVerification(false);
    };

    return (
        <div className="authPage">
            <LoadingPage isModal isOpen={isPending} />

            <div className="authpage-left">
                <Link to="/" aria-label="Digital Love Experience home">
                    <img src={fulllogo} alt="Digital Love Experience" className="auth-logo" />
                </Link>

                <p className="prompt">
                    {isResetting
                        ? 'Reset Your Password'
                        : isExistingUser
                            ? 'Sign In to Your Creator Account'
                            : 'Create Your Creator Account'}
                </p>
                <p className="auth-description">A creator account is required to build and manage experiences. Recipients do not need an account.</p>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {isResetting ? (
                        <InputField
                            label="Email"
                            multiline={false}
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    ) : (
                        <>
                            {!isExistingUser && (
                                <InputField
                                    label="Full Name"
                                    multiline={false}
                                    autoComplete="name"
                                    value={fullName}
                                    onChange={(event) => setFullName(event.target.value)}
                                />
                            )}
                            <InputField
                                label="Email"
                                multiline={false}
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            <InputField
                                label="Password"
                                multiline={false}
                                type="password"
                                autoComplete={isExistingUser ? 'current-password' : 'new-password'}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </>
                    )}

                    {feedback && (
                        <p className={`auth-feedback auth-feedback--${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>
                            {feedback.message}
                        </p>
                    )}
                    {canResendVerification && (
                        <button type="button" className="login-link" onClick={handleResendVerification} disabled={recoveryPending}>
                            Resend verification email
                        </button>
                    )}

                    <button className="verify-btn" type="submit" disabled={isPending}>
                        {isResetting ? 'Send Reset Link' : isExistingUser ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                {isExistingUser && !isResetting && (
                    <button type="button" className="login-link auth-secondary-action" onClick={() => {
                        setIsResetting(true);
                        setFeedback(null);
                    }}>
                        Forgot your password?
                    </button>
                )}

                <p className="login-action">
                    {isResetting ? (
                        <button type="button" className="login-link" onClick={() => {
                            setIsResetting(false);
                            setFeedback(null);
                        }}>
                            Return to sign in
                        </button>
                    ) : isExistingUser ? (
                        <>Need a creator account?{' '}
                            <button type="button" className="login-link" onClick={() => switchMode(false)}>Create account</button>
                        </>
                    ) : (
                        <>Already have an account?{' '}
                            <button type="button" className="login-link" onClick={() => switchMode(true)}>Sign in</button>
                        </>
                    )}
                </p>
            </div>

            <div className="authpage-right">
                <img src={authImg} alt="" className="authImage" />
            </div>
        </div>
    );
}
