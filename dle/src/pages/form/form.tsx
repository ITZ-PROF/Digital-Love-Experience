import React, { useState } from 'react';
import './form.css';
import InputField from '../../components/inputfield/input';
import logo from '../../assets/logo_variant_2.svg'

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

  const handleNext = () => {
    if (activeStep < STEPS.length) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 1) setActiveStep((prev) => prev - 1);
  };

  return (
    // 🌸 Main page container with floral framing styles applied
    <div className="stepper-window-frame">
      <div className="stepper-page-container">
        
        {/* 🧭 LEFT SIDEBAR */}
        <aside className="stepper-sidebar">
          <div className="sidebar-brand-wrapper">
            <button className="stepper-circle-back" onClick={handleBack} disabled={activeStep === 1} type="button">
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

              {activeStep > 1 && (
                <div className="step-form-fade-in placeholder-step-panel">
                  <p>{STEPS[activeStep - 1].title} content panel will load here.</p>
                </div>
              )}
            </section>

            <footer className="workspace-actions-footer">
              <button 
                className="action-link-btn back" 
                onClick={handleBack} 
                style={{ visibility: activeStep === 1 ? 'hidden' : 'visible' }}
              >
                Back
              </button>
              <button className="action-link-btn next" onClick={handleNext}>
                {activeStep === STEPS.length ? 'Submit' : 'Next'}
              </button>
            </footer>

          </div>
        </main>
      </div>
    </div>
  );
}
