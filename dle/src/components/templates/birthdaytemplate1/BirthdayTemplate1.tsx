import './birthdayTemplate1.css';

export interface BirthdayTemplateData {
  recipientName: string;
  senderName: string;
  occasionLabel: string;
  title: string;
  summary: string;
  heroImageUrl: string;
  heroImageAlt: string;
  letterDate: string;
  letterGreeting: string;
  letterParagraphs: string[];
  letterSignoff: string;
  quoteNumber: string;
  quoteText: string;
  quoteAuthor: string;
  closingTitle: string;
  closingDescription: string;
  buttonLabel: string;
  copyright: string;
}

export interface BirthdayTemplateProps {
  className?: string;
  heroImageUrl?: string;
  onCreateExperience?: () => void;
}

function BirthdayTemplate1({
  className = '',
  heroImageUrl,
  onCreateExperience,
}: BirthdayTemplateProps) {
  const sample: BirthdayTemplateData = {
    recipientName: 'Eleanor',
    senderName: 'Thomas',
    occasionLabel: 'CELEBRATING THIRTY YEARS',
    title: 'Happy Birthday, Eleanor!',
    summary:
      'A little place on the internet for all the memories, laughter, and love you bring into our lives.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=85&w=1800&auto=format&fit=crop',
    heroImageAlt: 'A joyful birthday celebration with warm lights and decorations',
    letterDate: 'March 20th, 2026',
    letterGreeting: 'To my wonderful Eleanor,',
    letterParagraphs: [
      'Thirty years of you—and somehow the world still gets brighter every time you walk into a room. Your kindness has a way of making ordinary days feel like something worth remembering.',
      'I hope this next chapter brings you new places to explore, big reasons to laugh, and all the small, beautiful moments you give so freely to everyone around you. You deserve every bit of joy coming your way.',
      'Thank you for being exactly who you are. I feel lucky to celebrate you today, and even luckier to have you in my life.',
    ],
    letterSignoff: 'With all my love, Thomas',
    quoteNumber: '66',
    quoteText: 'The more you praise and celebrate your life, the more there is in life to celebrate.',
    quoteAuthor: 'Oprah Winfrey',
    closingTitle: 'Here’s to your next beautiful chapter.',
    closingDescription:
      'Keep this little corner of the internet close, and come back whenever you need a reminder of how loved you are.',
    buttonLabel: 'Create your own experience',
    copyright: '© 2026 Digital Love Experience · Made with love for Eleanor',
  };

  const {
    recipientName,
    senderName,
    occasionLabel,
    title,
    summary,
    heroImageAlt,
    letterDate,
    letterGreeting,
    letterParagraphs,
    letterSignoff,
    quoteNumber,
    quoteText,
    quoteAuthor,
    closingTitle,
    closingDescription,
    buttonLabel,
    copyright,
  } = sample;
  const imageUrl = heroImageUrl || sample.heroImageUrl;

  return (
    <main className={`birthday-template-container ${className}`.trim()}>
      <section className="hero-section" id="top" aria-labelledby="birthday-title">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            <span className="eyebrow-line" aria-hidden="true" />
            {occasionLabel}
          </p>
          <h1 id="birthday-title">{title}</h1>
          <p className="hero-byline">
            <span className="byline-heart" aria-hidden="true">♥</span>
            A birthday note from <strong>{senderName}</strong>
          </p>
          <p className="hero-summary">{summary}</p>
          <a className="scroll-prompt" href="#birthday-letter">
            Scroll down to read your message <span aria-hidden="true">∨</span>
          </a>
        </div>

        <div className="hero-visual">
          <div className="hero-image-frame">
            <img src={imageUrl} alt={heroImageAlt} />
            <span className="image-caption">A day all about you</span>
          </div>
          <span className="hero-sparkle sparkle-one" aria-hidden="true">✳</span>
          <span className="hero-sparkle sparkle-two" aria-hidden="true">✦</span>
          <span className="hero-stamp" aria-hidden="true">THIRTY<br />& THRIVING</span>
        </div>
      </section>

      <section className="letter-section" id="birthday-letter" aria-label={`A birthday letter for ${recipientName}`}>
        <span className="letter-decoration decoration-left" aria-hidden="true">✳</span>
        <span className="letter-decoration decoration-right" aria-hidden="true">✦</span>
        <article className="letter-card">
          <header className="letter-meta">
            <span className="recipient-label">A NOTE FOR {recipientName}</span>
            <time dateTime="2026-03-20">{letterDate}</time>
          </header>
          <div className="letter-rule" aria-hidden="true"><span>♥</span></div>
          <div className="letter-content">
            <p className="letter-greeting">{letterGreeting}</p>
            {letterParagraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
            ))}
            <p className="letter-signoff">{letterSignoff}</p>
            <span className="letter-signature" aria-hidden="true">T</span>
          </div>
        </article>
      </section>

      <section className="quote-section" aria-labelledby="birthday-quote">
        <p className="quote-index">{quoteNumber}</p>
        <span className="quote-mark" aria-hidden="true">“</span>
        <blockquote id="birthday-quote">
          <p>{quoteText}</p>
          <footer className="quote-attribution">
            <span aria-hidden="true" />
            <cite>— {quoteAuthor} —</cite>
            <span aria-hidden="true" />
          </footer>
        </blockquote>
      </section>

      <footer className="birthday-footer">
        <div className="footer-flourish" aria-hidden="true">✳ &nbsp; ♥ &nbsp; ✳</div>
        <p className="footer-kicker">A LITTLE MORE LOVE, ALWAYS</p>
        <h2>{closingTitle}</h2>
        <p className="footer-description">{closingDescription}</p>
        <button className="btn-primary" type="button" onClick={onCreateExperience}>
          {buttonLabel}<span aria-hidden="true">↗</span>
        </button>
        <p className="footer-copyright">{copyright}</p>
      </footer>
    </main>
  );
}

export default BirthdayTemplate1;
