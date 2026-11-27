import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import './marketing-pages.css';

function MarketingPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="marketing-page">
      <Navbar />
      <main className="marketing-page-content">{children}</main>
    </div>
  );
}

export function PricingPage() {
  return (
    <MarketingPageLayout>
      <section className="marketing-info-card" aria-labelledby="pricing-title">
        <p className="marketing-eyebrow">Digital Love Experience</p>
        <h1 id="pricing-title">Pricing page under maintenance</h1>
        <p>We’re updating our pricing information. Please check back soon.</p>
        <Link className="marketing-home-link" to="/">Back to Home</Link>
      </section>
    </MarketingPageLayout>
  );
}

export function ContactPage() {
  return (
    <MarketingPageLayout>
      <section className="marketing-info-card" aria-labelledby="contact-title">
        <p className="marketing-eyebrow">We’re here to help</p>
        <h1 id="contact-title">Contact Us</h1>
        <p>Choose the contact option that works best for you.</p>
        <div className="marketing-contact-options">
          <a href="mailto:richmondnyamedor830@gmail.com">
            Email Richmond
            <span>richmondnyamedor830@gmail.com</span>
          </a>
          <a href="https://wa.me/233202614368">
            Message on WhatsApp
            <span>+233 20 261 4368</span>
          </a>
        </div>
        <Link className="marketing-home-link" to="/">Back to Home</Link>
      </section>
    </MarketingPageLayout>
  );
}
