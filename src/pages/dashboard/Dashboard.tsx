import axios from 'axios';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import LoadingPage from '../../components/loadingpage/loader';
import { Experience, listExperienceDrafts } from '../../services/experience.service';
import { useAuth } from '../../stores/authstore';
import './dashboard.css';
import { useLogout } from '../../hooks/use-auth';

function ExperienceCard({ experience }: { experience: Experience }) {
  const occasion = experience.occasion
    ? experience.occasion.charAt(0).toUpperCase() + experience.occasion.slice(1)
    : 'Special moment';

  return (
    <article
      className={`experience-card experience-card-${experience.selectedColor} experience-card-${experience.themeMode}`}
    >
      <div className="experience-card-cover" aria-hidden="true">
        <span className="experience-card-heart">♥</span>
        <span className="experience-card-cover-label">{occasion}</span>
      </div>
      <div className="experience-card-content">
        <p className="experience-card-recipient">
          For {experience.recipientName || 'Someone special'}
        </p>
        <p className="experience-card-message">
          {experience.heartfeltMessage || 'A personal message, made with love.'}
        </p>
        <time className="experience-card-date" dateTime={experience.createdAt}>
          {new Date(experience.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </time>
        <Link className="experience-card-preview" to={`/experiences/${encodeURIComponent(experience.id)}/preview`}>
          Preview draft
        </Link>
      </div>
    </article>
  );
}

function getLoadError(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message;
  }
  return 'We could not load your experiences. Please try again.';
}

export default function Dashboard() {
  const user = useAuth((state) => state.user);
  const navigate = useNavigate();
  const { data: experiences = [], isPending, error, refetch } = useQuery({
    queryKey: ['experiences', user?.id],
    queryFn: listExperienceDrafts,
    enabled: Boolean(user?.id),
  });
  const [logoutError, setLogoutError] = useState('');
  const { mutateAsync, isPending: isLoggingOut } = useLogout();

  const handleLogout = async () => {
    setLogoutError('');
    try {
      await mutateAsync();
      navigate('/');
    } catch (logoutFailure) {
      console.error('Unable to log out:', logoutFailure);
      setLogoutError('We could not log you out. Please try again.');
    }
  };

  if (isPending) return <LoadingPage />;

  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-actions">
            <button
              type="button"
              className="dashboard-back"
              onClick={() => navigate('/')}
            >
              <span aria-hidden="true">←</span> Back
            </button>
            <button
              type="button"
              className="dashboard-logout button-primary"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </button>
          </div>
          <div className="dashboard-heading">
            <p className="dashboard-eyebrow">YOUR SPACE</p>
            <h1>Your experiences</h1>
            <p className="dashboard-intro">
              All the moments you’ve created, together in one place.
            </p>
          </div>
        </header>

        {logoutError && <p role="alert">{logoutError}</p>}

        {error ? (
          <section className="dashboard-error" role="alert">
            <h2>We could not load your experiences</h2>
            <p>{getLoadError(error)}</p>
            <button type="button" className="dashboard-create button-primary" onClick={() => refetch()}>
              Try again
            </button>
          </section>
        ) : experiences.length > 0 ? (
          <section aria-label="Your created experiences">
            <div className="dashboard-gallery-heading">
              <h2>Saved drafts</h2>
              <span>{experiences.length}</span>
            </div>
            <div className="dashboard-gallery">
              {experiences.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))}
            </div>
          </section>
        ) : (
          <section className="dashboard-empty" aria-labelledby="dashboard-empty-title">
            <div className="dashboard-empty-heart" aria-hidden="true">♥</div>
            <h2 id="dashboard-empty-title">Your gallery is waiting</h2>
            <p>
              Create a thoughtful experience for someone special and it’ll show up here.
            </p>
            <button
              type="button"
              className="dashboard-create button-primary"
              onClick={() => navigate('/form')}
            >
              Create an experience
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
