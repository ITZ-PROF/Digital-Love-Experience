import axios from 'axios';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    clearPendingPaystackContext,
    getExperienceDraft,
    getPendingPaystackExperienceId,
    verifyPaystackCallback,
} from '../../services/experience.service';
import LoadingPage from '../../components/loadingpage/loader';
import { useAuth } from '../../stores/authstore';

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message || error.message;
    }
    return 'We could not verify this payment. Please try again.';
}

export default function PaymentCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const authStatus = useAuth((state) => state.status);
    const reference = searchParams.get('reference') || searchParams.get('trxref') || '';
    const pendingExperienceId = reference ? getPendingPaystackExperienceId(reference) : null;
    const {
        data: payment,
        error,
        isPending,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: ['paystackVerification', reference],
        queryFn: () => verifyPaystackCallback(reference),
        enabled: Boolean(reference),
        retry: false,
    });

    const {
        data: experience,
        error: experienceError,
        isPending: isExperiencePending,
    } = useQuery({
        queryKey: ['paymentReturnExperience', reference, pendingExperienceId],
        queryFn: () => {
            if (!pendingExperienceId) {
                throw new Error('No experience is linked to this payment return.');
            }
            return getExperienceDraft(pendingExperienceId);
        },
        enabled: payment?.paymentStatus === 'SUCCESS'
            && authStatus === 'authenticated'
            && Boolean(pendingExperienceId),
        retry: false,
    });

    useEffect(() => {
        if (
            payment?.paymentStatus !== 'SUCCESS'
            || !experience
            || experience.status !== 'ACTIVE'
            || !experience.shareToken
        ) return;

        clearPendingPaystackContext(reference);
        const shareUrl = `${window.location.origin}/share/${encodeURIComponent(experience.shareToken)}`;
        navigate('/form', {
            replace: true,
            state: { paymentReturn: { experience, shareUrl } },
        });
    }, [experience, navigate, payment?.paymentStatus, reference]);

    useEffect(() => {
        if (payment?.paymentStatus === 'FAILED') {
            clearPendingPaystackContext(reference);
        }
    }, [payment?.paymentStatus, reference]);

    const isWaitingForAuth = payment?.paymentStatus === 'SUCCESS' && authStatus === 'checking';
    const isWaitingForExperience = payment?.paymentStatus === 'SUCCESS'
        && Boolean(pendingExperienceId)
        && authStatus === 'authenticated'
        && isExperiencePending;
    if ((reference && isPending) || isWaitingForAuth || isWaitingForExperience) return <LoadingPage />;

    const pageError = !reference
        ? 'The payment reference is missing from the return URL.'
        : error
            ? getErrorMessage(error)
            : '';

    return (
        <main className="dashboard-page">
            <section className="dashboard-preview-error" role={pageError ? 'alert' : 'status'}>
                {pageError ? (
                    <>
                        <h1>We could not verify your payment</h1>
                        <p>{pageError}</p>
                        {reference && (
                            <button
                                type="button"
                                className="dashboard-create button-primary"
                                onClick={() => void refetch()}
                                disabled={isFetching}
                            >
                                {isFetching ? 'Checking...' : 'Try again'}
                            </button>
                        )}
                    </>
                ) : payment?.paymentStatus === 'SUCCESS' ? (
                    <>
                        <h1>Payment confirmed</h1>
                        <p>
                            {experienceError
                                ? 'Your payment succeeded, but we could not retrieve the share link. Open your dashboard to access the experience.'
                                : authStatus === 'unauthenticated' || authStatus === 'unavailable'
                                    ? 'Your payment succeeded. Sign in to your dashboard to access the experience and its share link.'
                                    : !pendingExperienceId
                                        ? 'Your payment succeeded. Open your dashboard to access the experience and its share link.'
                                        : 'Your payment succeeded, but the experience is not ready to share yet. Open your dashboard for its current status.'}
                        </p>
                        <Link
                            className="dashboard-create button-primary"
                            to={authStatus === 'authenticated' ? '/dashboard' : '/login'}
                            state={authStatus === 'authenticated' ? undefined : { from: { pathname: '/dashboard' } }}
                        >
                            {authStatus === 'authenticated' ? 'Go to your dashboard' : 'Sign in to your dashboard'}
                        </Link>
                    </>
                ) : payment?.paymentStatus === 'PENDING' ? (
                    <>
                        <h1>Payment is still processing</h1>
                        <p>We haven’t received confirmation yet. Check again in a moment; your experience remains private until payment is verified.</p>
                        <button
                            type="button"
                            className="dashboard-create button-primary"
                            onClick={() => void refetch()}
                            disabled={isFetching}
                        >
                            {isFetching ? 'Checking...' : 'Check payment status'}
                        </button>
                    </>
                ) : (
                    <>
                        <h1>Payment was not completed</h1>
                        <p>Your experience is still private. Sign in to your dashboard to retry checkout.</p>
                        <Link
                            className="dashboard-create button-primary"
                            to={authStatus === 'authenticated' ? '/dashboard' : '/login'}
                            state={authStatus === 'authenticated' ? undefined : { from: { pathname: '/dashboard' } }}
                        >
                            {authStatus === 'authenticated' ? 'Go to your dashboard' : 'Sign in to your dashboard'}
                        </Link>
                    </>
                )}
                <p>
                    <Link to="/dashboard">Back to your experiences</Link>
                </p>
            </section>
        </main>
    );
}
