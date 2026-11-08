import './birthdayTemplate1.css';
import confettiArt from '../../../assets/confetti.png';
import templateImage from '../../../assets/templateimage.svg';
import {useNavigate} from 'react-router-dom';

export interface BirthdayTemplateData {
  recipientName: string;
  senderName: string;
  occasionLabel: string;
  title: string;
  summary: string;
  heroImageUrl: string;
  heroImageAlt: string;
  letterDate: string;
  letterDateIso: string;
  letterGreeting: string;
  letterParagraphs: string[];
  letterSignoff: string;
  quoteNumber: string;
  quoteText: string;
  quoteAuthor: string;
  closingTitle: string;
  buttonLabel: string;
  copyright: string[];
}

export interface BirthdayTemplateProps {
  className?: string;
  heroImageUrl?: string;
  onCreateExperience?: () => void;
}

const SAMPLE_DATA: BirthdayTemplateData = {
  recipientName: 'Eleanor',
  senderName: 'Thomas',
  occasionLabel: 'CELEBRATING THIRTY YEARS',
  title: 'Happy Birthday, Eleanor!',
  summary:
    'Today we celebrate the light you bring into our lives. This page is a small collection of thoughts, memories, and appreciation for the beautiful soul you are. May this year be your most wonderful journey yet.',
  heroImageUrl: templateImage,
  heroImageAlt: 'Colorful illustration of a birthday cake and gifts',
  letterDate: 'March 20th, 2026',
  letterDateIso: '2026-03-20',
  letterGreeting: 'My Dearest Eleanor,',
  letterParagraphs: [
    'On this special day, I want you to know how much you mean to everyone around you. Your smile lights up every room, and your kindness touches every heart. Wishing you all the joy, love, and happiness you deserve today and always.',
    'Watching you grow, achieve your dreams, and navigate the world with such grace has been the greatest privilege of my life. You inspire me to be better every single day.',
  ],
  letterSignoff: 'With all my love and admiration,',
  quoteNumber: '66',
  quoteText: 'The more you praise and celebrate your life, the more there is in life to celebrate.',
  quoteAuthor: 'Oprah Winfrey',
  closingTitle: 'Create a custom digital memory book and celebration space for the people you love.',
  buttonLabel: 'Create Experience',
  copyright: [
    'Made with love for Eleanor’s 30th Birthday.',
    '© 2026 Celebration Space. All rights reserved.',
  ],
};



function BirthdayTemplate1({
  className = '',
  heroImageUrl = SAMPLE_DATA.heroImageUrl,
  onCreateExperience,
}: BirthdayTemplateProps) {
  const {
    recipientName,
    senderName,
    occasionLabel,
    title,
    summary,
    heroImageAlt,
    letterDate,
    letterDateIso,
    letterGreeting,
    letterParagraphs,
    letterSignoff,
    quoteNumber,
    quoteText,
    quoteAuthor,
    closingTitle,
    buttonLabel,
    copyright,
  } = SAMPLE_DATA;
  const senderInitial = senderName.charAt(0);

  const navigate = useNavigate();

  return (
    <main className={`birthday-template-container ${className}`.trim()}>
      <section className="hero-section" id="top" aria-labelledby="birthday-title">
        <img className="hero-template-art" src={confettiArt} alt="" aria-hidden="true" />

        <div className="hero-copy">
          <p className="hero-eyebrow">
            <span className="eyebrow-line" aria-hidden="true" />
            {occasionLabel}
          </p>
          <h1 id="birthday-title">{title}</h1>
          <p className="hero-byline">
            <span className="byline-initial" aria-hidden="true">{senderInitial}</span>
            <span>
              With all my love, <strong>{senderName}</strong>
            </span>
          </p>
          <p className="hero-summary">{summary}</p>
          <a className="scroll-prompt" href="#birthday-letter">
            Scroll down to read your message <span aria-hidden="true">∨</span>
          </a>
        </div>

        <img
          className="hero-image-frame"
          src={heroImageUrl}
          alt={heroImageAlt}
        />
      </section>

      <section className="letter-section" id="birthday-letter" aria-label={`A birthday letter for ${recipientName}`}>
        <article className="letter-card">
          <header className="letter-meta">
            <span className="letter-greeting">
              <span className="letter-initial" aria-hidden="true">{senderInitial}</span>
              {letterGreeting}
            </span>
            <time dateTime={letterDateIso}>{letterDate}</time>
          </header>
          <div className="letter-content">
            {letterParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="letter-signoff">
              {letterSignoff}
              <strong>{senderName}</strong>
            </p>
          </div>
        </article>
      </section>

      <section className="quote-section" aria-labelledby="birthday-quote">
        <p className="quote-index">{quoteNumber}</p>
        <blockquote id="birthday-quote">
          <p>&quot;{quoteText}&quot;</p>
          <footer className="quote-attribution">
            <span aria-hidden="true" />
            <cite>{quoteAuthor}</cite>
            <span aria-hidden="true" />
          </footer>
        </blockquote>
      </section>

      <section className="birthday-footer">
        <p className="footer-kicker">Want to surprise someone special?</p>
        <h2>{closingTitle}</h2>
        <button className="btn-primary" type="button" onClick={() => {
          if (onCreateExperience) {
            onCreateExperience();
          } else {
            navigate('/form');
          }}}>
          {buttonLabel}
        </button>
      </section>

      <footer className="birthday-copyright">
        {copyright.map((line) => (
          <p key={line} className="footer-copyright">
            {line}
          </p>
        ))}
      </footer>
    </main>
  );
}

export default BirthdayTemplate1;