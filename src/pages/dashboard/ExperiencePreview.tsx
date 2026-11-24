import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import BirthdayTemplate1, {
    BirthdayTemplateData,
} from '../../components/templates/birthdaytemplate1/BirthdayTemplate1';
import LoadingPage from '../../components/loadingpage/loader';
import { getExperienceDraft } from '../../services/experience.service';
import './dashboard.css';

function getPreviewData(experience: Awaited<ReturnType<typeof getExperienceDraft>>): Partial<BirthdayTemplateData> {
    const recipientName = experience.recipientName || 'Someone special';
    const senderName = experience.creatorName || 'Someone who cares';
    const occasion = experience.occasion || 'special occasion';
    const createdAt = new Date(experience.createdAt);
    const message = experience.heartfeltMessage.trim();

    return {
        recipientName,
        senderName,
        occasionLabel: `CELEBRATING ${occasion.toUpperCase()}`,
        title: occasion.toLowerCase() === 'birthday'
            ? `Happy Birthday, ${recipientName}!`
            : `A special ${occasion} for ${recipientName}!`,
        heroImageUrl: experience.heroImageUrl || undefined,
        heroImageAlt: experience.heroImageUrl
            ? `Uploaded birthday photo for ${recipientName}`
            : 'Birthday celebration illustration',
        letterDate: createdAt.toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }),
        letterDateIso: createdAt.toISOString().slice(0, 10),
        letterGreeting: `Dear ${recipientName},`,
        letterParagraphs: message ? message.split(/\n{2,}/).filter(Boolean) : ['A message made with love.'],
        letterSignoff: 'With love,',
        quoteNumber: '01',
        quoteText: experience.quoteText || '',
        quoteAuthor: '',
        closingTitle: `A special moment made for ${recipientName}.`,
        copyright: [`Made with love for ${recipientName}.`],
    };
}

function getLoadError(error: unknown): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message || error.message;
    }
    return 'We could not load this draft. Please try again.';
}

export default function ExperiencePreview() {
    const { id = '' } = useParams();
    const navigate = useNavigate();
    const { data: experience, isPending, error, refetch } = useQuery({
        queryKey: ['experience', id],
        queryFn: () => getExperienceDraft(id),
        enabled: Boolean(id),
    });

    if (isPending) return <LoadingPage />;

    if (error || !experience) {
        return (
            <main className="dashboard-page">
                <section className="dashboard-preview-error" role="alert">
                    <h1>We could not open this draft</h1>
                    <p>{error ? getLoadError(error) : 'This experience could not be found.'}</p>
                    <div className="dashboard-preview-actions">
                        <button type="button" className="dashboard-create button-primary" onClick={() => refetch()}>
                            Try again
                        </button>
                        <button type="button" className="dashboard-preview-back" onClick={() => navigate('/dashboard')}>
                            Back to your experiences
                        </button>
                    </div>
                </section>
            </main>
        );
    }

    if (experience.status !== 'DRAFT') {
        return (
            <main className="dashboard-page">
                <section className="dashboard-preview-error" role="status">
                    <h1>This experience is not a draft</h1>
                    <p>Only saved drafts can be previewed here.</p>
                    <button type="button" className="dashboard-preview-back" onClick={() => navigate('/dashboard')}>
                        Back to your experiences
                    </button>
                </section>
            </main>
        );
    }

    if (experience.templateKey !== 'birthday-template-1' || experience.occasion !== 'birthday') {
        return (
            <main className="dashboard-page">
                <section className="dashboard-preview-error" role="status">
                    <h1>This template is not available</h1>
                    <p>The selected template cannot be previewed. Return to your experiences and contact support if this continues.</p>
                    <button type="button" className="dashboard-preview-back" onClick={() => navigate('/dashboard')}>
                        Back to your experiences
                    </button>
                </section>
            </main>
        );
    }

    const themeClass = `experience-color-${experience.selectedColor} experience-theme-${experience.themeMode}`;

    return (
        <BirthdayTemplate1
            className={themeClass}
            data={getPreviewData(experience)}
            showCreateCta={false}
            onBack={() => navigate('/dashboard')}
        />
    );
}
