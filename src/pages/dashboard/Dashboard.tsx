import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import LoadingPage from '../../components/loadingpage/loader';
import { useAuth } from '../../stores/authstore';
import { Experience, useExperiences } from '../../stores/experiencesStore';
import './dashboard.css';

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
      </div>
    </article>
  );
}

export default function Dashboard() {
  const authenticated = useAuth((state) => state.authenticated);
  const setAuthenticated = useAuth((state) => state.setAuthenticated);
  const experiences = useExperiences((state) => state.experiences);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  if (!authenticated) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    setAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="dashboard-page">
      {loading && <LoadingPage />}
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
            >
              Log out
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

        {experiences.length > 0 ? (
          <section aria-label="Your created experiences">
            <div className="dashboard-gallery-heading">
              <h2>Created by you</h2>
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
