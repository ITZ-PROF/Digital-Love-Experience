import { CSSProperties, useEffect, useRef, useState } from 'react';
import './form.css';
import InputField from '../../components/inputfield/input';
import logo from '../../assets/logo_variant_2.svg'
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../../components/loadingpage/loader';

interface StepConfig {
  id: number;
  title: string;
  subtitle: string;
}

const STEPS: StepConfig[] = [
  { id: 1, title: 'Basic Info', subtitle: 'Help the recipient know the creator' },
  { id: 2, title: 'Recipient Info', subtitle: 'Information for the webpage' },
  { id: 3, title: 'Experience Info', subtitle: 'Express your emotions and affection' },
  { id: 4, title: 'Payment Info', subtitle: 'Details for payment process' }
];

export default function Form() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [occasion, setOccasion] = useState<string>('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientWhatsapp, setRecipientWhatsapp] = useState('');
  const [heartfeltMessage, setHeartfeltMessage] = useState('');
  const [songLink, setSongLink] = useState('');
  const [selectedColor, setSelectedColor] = useState('purple');
  const [themeMode, setThemeMode] = useState('dark');
  const [senderWhatsapp, setSenderWhatsapp] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingExiting, setIsLoadingExiting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showExperiencePreview, setShowExperiencePreview] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const submitTimers = useRef<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => () => {
    submitTimers.current.forEach(window.clearTimeout);
  }, []);

  const handleNext = () => {
    if (activeStep < STEPS.length) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 1){

        setActiveStep((prev) => prev - 1)
    }else{
        navigate('/')
    }
  };

  const handleSaveAndShare = () => {
    if (isSubmitting) return;

    const shareCode = Math.random().toString(36).slice(2, 8);
    setShareUrl(`${window.location.origin}/?experience=${shareCode}`);
    setLinkCopied(false);
    setShowExperiencePreview(false);
    setIsLoadingExiting(false);
    setIsSubmitting(true);

    submitTimers.current.push(window.setTimeout(() => {
      setIsLoadingExiting(true);
    }, 1700));

    submitTimers.current.push(window.setTimeout(() => {
      setIsSubmitting(false);
      setIsLoadingExiting(false);
      setShowSuccessModal(true);
    }, 2400));
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
    } catch {
      setLinkCopied(false);
    }
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    setShowExperiencePreview(false);
    setActiveStep(1);
    setOccasion('');
    setRecipientName('');
    setRecipientWhatsapp('');
    setHeartfeltMessage('');
    setSongLink('');
    setSelectedColor('purple');
    setThemeMode('dark');
    setSenderWhatsapp('');
    setServiceProvider('');
  };

  return (
    // 🌸 Main page container with floral framing styles applied
    <div className="stepper-window-frame">
      <div className="stepper-page-container">
        
        {/* 🧭 LEFT SIDEBAR */}
        <aside className="stepper-sidebar">
          <div className="sidebar-brand-wrapper">
            <button className="stepper-circle-back" onClick={handleBack} type="button">
              &larr;
            </button>
            <div className="brand-logo-placeholder">
              <img src={logo} alt="DLE" />
            </div>
          </div>

          <nav className="steps-list" aria-label="Progress tracker">
            {STEPS.map((step) => {
              const isActive = step.id === activeStep;
              const isCompleted = step.id < activeStep;
              
              return (
                <button
                  type="button"
                  key={step.id} 
                  className={`step-item-row ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''}`}
                  onClick={() => setActiveStep(step.id)}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`Go to step ${step.id}: ${step.title}`}
                >
                  <div className="step-badge-number-container">
                    {isCompleted ? '✓' : step.id}
                  </div>
                  <div className="step-text-meta">
                    <span className="step-title-text">{step.title}</span>
                    <span className="step-subtitle-text">{step.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ⬜ CENTERED WHITE WORKSPACE CARD PANEL */}
        <main className="stepper-content-workspace">
          <div className="workspace-inner-card">
            
            <header className="workspace-header-heading">
              <h1>Everything You Need for Any Special Moment</h1>
              <h2>{STEPS[activeStep - 1].title}</h2>
            </header>

            <section className="workspace-form-body-panel">
              {activeStep === 1 && (
                <div className="step-form-fade-in">
                  <InputField label="Full Name" multiline={false} />
                  
                  {/* Select Occasion Input Field Dropdown */}
                  <div className="dropdown-select-container">
                    <select 
                      className={`custom-select-element ${occasion ? 'has-value' : ''}`}
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                    >
                      <option value="" disabled hidden></option>
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="wedding">Wedding</option>
                    </select>
                    <label className="select-floating-label">Select Occasion</label>
                    <div className="select-arrow-icon">&#x25BC;</div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="step-form-fade-in form-fields-stack">
                  <InputField
                    label="Recipient Full Name"
                    multiline={false}
                    value={recipientName}
                    onChange={(event) => setRecipientName(event.target.value)}
                  />
                  <InputField
                    label="Relation With Recipient"
                    multiline={false}
                    value={recipientWhatsapp}
                    onChange={(event) => setRecipientWhatsapp(event.target.value)}
                  />
                  <InputField
                    label="Write your heartfelt message"
                    multiline={true}
                    rows={4}
                    value={heartfeltMessage}
                    onChange={(event) => setHeartfeltMessage(event.target.value)}
                  />
                </div>
              )}

              {activeStep === 3 && (
                <div className="step-form-fade-in form-fields-stack">
                  <InputField
                    label="Send an inspirational quote(optional)"
                    multiline={false}
                    value={songLink}
                    onChange={(event) => setSongLink(event.target.value)}
                  />

                  <fieldset className="color-picker-fieldset">
                    <legend className="color-palette-label">Select Background Template Color</legend>
                    <div className="color-cards-grid">
                      {[
                        { id: 'purple', label: 'Purple', color: '#4b0f91' },
                        { id: 'green', label: 'Green', color: '#087333' },
                        { id: 'olive', label: 'Olive', color: '#89891c' },
                      ].map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          className={`color-card ${selectedColor === option.id ? 'selected' : ''}`}
                          style={{ backgroundColor: option.color }}
                          aria-label={`${option.label} template color`}
                          aria-pressed={selectedColor === option.id}
                          onClick={() => setSelectedColor(option.id)}
                        >
                          <span className="radio-dot" />
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="theme-toggle-row">
                    <legend className="visually-hidden">Choose page theme</legend>
                    {['dark', 'light'].map((theme) => (
                      <label className="radio-option" key={theme}>
                        <input
                          type="radio"
                          name="theme"
                          value={theme}
                          checked={themeMode === theme}
                          onChange={() => setThemeMode(theme)}
                        />
                        <span className="custom-radio-circle" />
                        {theme[0].toUpperCase() + theme.slice(1)}
                      </label>
                    ))}
                  </fieldset>
                </div>
              )}

              {activeStep === 4 && (
                <div className="step-form-fade-in form-fields-stack">
                  <InputField
                    label="Enter Mobile Number"
                    multiline={false}
                    value={senderWhatsapp}
                    onChange={(event) => setSenderWhatsapp(event.target.value)}
                  />
                  <div className="dropdown-select-container">
                    <select
                      className={`custom-select-element ${serviceProvider ? 'has-value' : ''}`}
                      value={serviceProvider}
                      onChange={(event) => setServiceProvider(event.target.value)}
                      aria-label="Select Service Provider"
                    >
                      <option value="" disabled>Select Service Provider</option>
                      <option value="momo">MTN Mobile Money</option>
                      <option value="telecel">Telecel Cash</option>
                      <option value="card">Credit / Debit Card</option>
                    </select>
                    <div className="select-arrow-icon" aria-hidden="true">&#x25BC;</div>
                  </div>
                </div>
              )}
            </section>

            <footer className="workspace-actions-footer">
              <button 
                className="action-link-btn back" 
                onClick={handleBack} 
                style={{ visibility: activeStep === 1 ? 'hidden' : 'visible' }}
              >
                <span>Back</span>
              </button>
              <button
                type="button"
                className="action-link-btn next"
                onClick={activeStep === STEPS.length ? handleSaveAndShare : handleNext}
                disabled={isSubmitting}
              >
                <span>{activeStep === STEPS.length ? 'Save & Share' : activeStep === 3 ? 'Proceed To Preview' : 'Next'}</span>
              </button>
            </footer>

          </div>
        </main>
      </div>

      <LoadingPage isModal isOpen={isSubmitting} isExiting={isLoadingExiting} />

      {showSuccessModal && (
        <div
          className="experience-success-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowSuccessModal(false);
          }}
        >
          <section
            className="experience-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="experience-success-title"
          >
            <button
              type="button"
              className="experience-success-close"
              onClick={() => setShowSuccessModal(false)}
              aria-label="Close success message"
            >
              ×
            </button>

            {showExperiencePreview ? (
              <div className={`experience-preview-card theme-${themeMode}`} style={{ '--preview-accent': selectedColor === 'green' ? '#087333' : selectedColor === 'olive' ? '#89891c' : '#4b0f91' } as CSSProperties}>
                <span className="experience-preview-eyebrow">A special moment for</span>
                <h2>{recipientName || 'Someone special'}</h2>
                {occasion && <p className="experience-preview-occasion">{occasion}</p>}
                <p className="experience-preview-message">{heartfeltMessage || 'Your heartfelt message will appear here.'}</p>
                <button type="button" className="experience-preview-back" onClick={() => setShowExperiencePreview(false)}>
                  Back to sharing
                </button>
              </div>
            ) : (
              <>
                <div className="success-confetti-art" aria-hidden="true" />
                <h2 id="experience-success-title">Congratulations!</h2>
                <p className="experience-success-copy">
                  You have successfully created an experience. Copy and share with your loved one.
                </p>

                <div className="experience-share-row">
                  <span className="experience-share-link" title={shareUrl}>
                    <span aria-hidden="true">↗</span>
                    {shareUrl}
                  </span>
                  <button
                    type="button"
                    className="experience-copy-button"
                    onClick={handleCopyLink}
                    aria-label={linkCopied ? 'Link copied' : 'Copy experience link'}
                  >
                    {linkCopied ? '✓' : '▢'}
                  </button>
                </div>
                <p className="experience-copy-status" aria-live="polite">
                  {linkCopied ? 'Link copied to clipboard' : ''}
                </p>

                <button type="button" className="experience-create-new" onClick={handleCreateAnother}>
                  Create A New Experience
                </button>
                <button type="button" className="experience-view-button" onClick={() => setShowExperiencePreview(true)}>
                  View Experience
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
