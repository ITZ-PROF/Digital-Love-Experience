import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyPaystackCallback } from '../../services/experience.service';
import LoadingPage from '../../components/loadingpage/loader';

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message || error.message;
    }
    return 'We could not verify this payment. Please try again.';
}

export default function PaymentCallback() {
    const [searchParams] = useSearchParams();
    const reference = searchParams.get('reference') || searchParams.get('trxref') || '';
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

    if (isPending) return <LoadingPage />;

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
                        <p>Your experience is now active. Sign in to your dashboard to open its share link.</p>
                        <Link className="dashboard-create button-primary" to="/dashboard">
                            Go to your dashboard
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
                        <Link className="dashboard-create button-primary" to="/dashboard">
                            Go to your dashboard
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
