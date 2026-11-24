import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import BirthdayTemplate1 from '../../components/templates/birthdaytemplate1/BirthdayTemplate1';
import LoadingPage from '../../components/loadingpage/loader';
import { getSharedExperience } from '../../services/experience.service';
import { toBirthdayTemplateData } from '../../utils/experienceTemplateData';
import '../dashboard/dashboard.css';

function getLoadError(error: unknown): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message || error.message;
    }
    return 'We could not load this experience. Please try again.';
}

export default function SharedExperiencePage() {
    const { token = '' } = useParams();
    const navigate = useNavigate();
    const { data: experience, isPending, error, refetch } = useQuery({
        queryKey: ['sharedExperience', token],
        queryFn: () => getSharedExperience(token),
        enabled: Boolean(token),
    });

    if (isPending) return <LoadingPage />;

    if (
        error
        || !experience
        || experience.occasion !== 'birthday'
        || experience.templateKey !== 'birthday-template-1'
    ) {
        return (
            <main className="dashboard-page">
                <section className="dashboard-preview-error" role="alert">
                    <h1>This experience is unavailable</h1>
                    <p>{error ? getLoadError(error) : 'This shared experience could not be found.'}</p>
                    <div className="dashboard-preview-actions">
                        {error && (
                            <button type="button" className="dashboard-create button-primary" onClick={() => refetch()}>
                                Try again
                            </button>
                        )}
                        <button type="button" className="dashboard-preview-back" onClick={() => navigate('/')}>
                            Visit Digital Love Experience
                        </button>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <BirthdayTemplate1
            className={`experience-color-${experience.selectedColor} experience-theme-${experience.themeMode}`}
            data={toBirthdayTemplateData(experience)}
            showCreateCta={false}
            onBack={() => navigate('/')}
        />
    );
}
