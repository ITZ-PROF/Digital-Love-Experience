import { useEffect, useRef, useState } from 'react';
import './form.css';
import InputField from '../../components/inputfield/input';
import logo from '../../assets/logo_variant_2.svg'
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../../components/loadingpage/loader';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { createExperienceDraft } from '../../services/experience.service';
import { useAuth } from '../../stores/authstore';
import BirthdayTemplate1 from '../../components/templates/birthdaytemplate1/BirthdayTemplate1';
import birthdayTemplateThumbnail from '../../assets/templateimage.svg';
import {
  ExperienceFormErrors,
  ExperienceFormValues,
  validateExperienceFormStep,
} from './formValidation';

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

const TEMPLATES_BY_OCCASION = {
  birthday: [
    {
      id: 'birthday-template-1',
      name: 'Birthday Letter',
      description: 'A warm, letter-style birthday celebration.',
      thumbnail: birthdayTemplateThumbnail,
    },
  ],
};

export default function Form() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [creatorName, setCreatorName] = useState('');
  const [occasion, setOccasion] = useState<string>('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientWhatsapp, setRecipientWhatsapp] = useState('');
  const [heartfeltMessage, setHeartfeltMessage] = useState('');
  const [songLink, setSongLink] = useState('');
  const [templateKey, setTemplateKey] = useState('');
  const [senderWhatsapp, setSenderWhatsapp] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ExperienceFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [savedExperienceId, setSavedExperienceId] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();
  const templatePreviewRef = useRef<HTMLDialogElement>(null);
  const queryClient = useQueryClient();
  const creatorId = useAuth((state) => state.user?.id);
  const formValues: ExperienceFormValues = {
    creatorName,
    occasion,
    recipientName,
    recipientRelationship: recipientWhatsapp,
    heartfeltMessage,
    quoteText: songLink,
    templateKey,
    paymentPhone: senderWhatsapp,
    paymentProvider: serviceProvider,
  };
  const availableTemplates = occasion === 'birthday' ? TEMPLATES_BY_OCCASION.birthday : [];

  useEffect(() => {
    const dialog = templatePreviewRef.current;
    if (!dialog) return;

    if (showTemplatePreview && !dialog.open) {
      dialog.showModal();
    } else if (!showTemplatePreview && dialog.open) {
      dialog.close();
    }
  }, [showTemplatePreview]);

  const validateSteps = (steps: number[]) => {
    const errors: ExperienceFormErrors = {};
    let firstInvalidStep: number | null = null;

    for (const step of steps) {
      const stepErrors = validateExperienceFormStep(step, formValues);
      Object.assign(errors, stepErrors);
      if (firstInvalidStep === null && Object.keys(stepErrors).length > 0) {
        firstInvalidStep = step;
      }
    }

    setFieldErrors(errors);
    if (firstInvalidStep !== null) setActiveStep(firstInvalidStep);
    return firstInvalidStep === null;
  };

  const clearFieldError = (field: keyof ExperienceFormValues) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleNext = () => {
    if (activeStep < STEPS.length && validateSteps([activeStep])) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleStepNavigation = (targetStep: number) => {
    if (targetStep <= activeStep) {
      setActiveStep(targetStep);
      return;
    }

    if (validateSteps(Array.from({ length: targetStep - 1 }, (_, index) => index + 1))) {
      setActiveStep(targetStep);
    }
  };

  const handleBack = () => {
    if (activeStep > 1){

        setActiveStep((prev) => prev - 1)
    }else{
        navigate('/')
    }
  };

  const handleSaveDraft = async () => {
    if (isSubmitting) return;
    if (!validateSteps([1, 2, 3, 4])) return;
    if (!creatorId) {
      navigate('/login', { state: { from: { pathname: '/form' } } });
      return;
    }

    setSubmitError('');
    setCopyError('');
    setLinkCopied(false);
    setIsSubmitting(true);
    try {
      const experience = await createExperienceDraft({
        creatorName,
        recipientName,
        recipientRelationship: recipientWhatsapp,
        occasion,
        templateKey,
        heartfeltMessage,
        quoteText: songLink,
        selectedColor: 'purple',
        themeMode: 'dark',
        paymentPhone: senderWhatsapp,
        paymentProvider: serviceProvider,
      });
      const privatePreviewUrl = `${window.location.origin}/experiences/${encodeURIComponent(experience.id)}/preview`;
      setSavedExperienceId(experience.id);
      setPreviewUrl(privatePreviewUrl);
      setShowSuccessModal(true);
      await queryClient.invalidateQueries({ queryKey: ['experiences'] });
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || error.message
        : 'We could not save your draft. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(previewUrl);
      setLinkCopied(true);
      setCopyError('');
    } catch (error) {
      console.error('Unable to copy the private preview link:', error);
      setLinkCopied(false);
      setCopyError('Could not copy the link. You can select and copy it manually.');
    }
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    setActiveStep(1);
    setCreatorName('');
    setOccasion('');
    setRecipientName('');
    setRecipientWhatsapp('');
    setHeartfeltMessage('');
    setSongLink('');
    setTemplateKey('');
    setSenderWhatsapp('');
    setServiceProvider('');
    setFieldErrors({});
    setSavedExperienceId('');
    setPreviewUrl('');
    setSubmitError('');
    setCopyError('');
  };

  const selectBirthdayTemplate = () => {
    setTemplateKey('birthday-template-1');
    clearFieldError('templateKey');
    setShowTemplatePreview(false);
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
                  onClick={() => handleStepNavigation(step.id)}
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
                  <InputField
                    label="Full Name"
                    multiline={false}
                    value={creatorName}
                    required
                    maxLength={120}
                    error={fieldErrors.creatorName}
                    onChange={(event) => {
                      setCreatorName(event.target.value);
                      clearFieldError('creatorName');
                    }}
                  />
                  
                  {/* Select Occasion Input Field Dropdown */}
                  <div className="dropdown-select-container">
                    <select 
                      className={`custom-select-element ${occasion ? 'has-value' : ''}`}
                      value={occasion}
                      required
                      aria-invalid={Boolean(fieldErrors.occasion)}
                      aria-describedby={fieldErrors.occasion ? 'occasion-error' : undefined}
                      onChange={(event) => {
                        setOccasion(event.target.value);
                        setTemplateKey('');
                        clearFieldError('occasion');
                        clearFieldError('templateKey');
                      }}
                    >
                      <option value="" disabled hidden></option>
                      <option value="birthday">Birthday</option>
                    </select>
                    <label className="select-floating-label">Select Occasion</label>
                    <div className="select-arrow-icon">&#x25BC;</div>
                    {fieldErrors.occasion && <span id="occasion-error" className="form-field-error" role="alert">{fieldErrors.occasion}</span>}
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="step-form-fade-in form-fields-stack">
                  <InputField
                    label="Recipient Full Name"
                    multiline={false}
                    value={recipientName}
                    required
                    maxLength={120}
                    error={fieldErrors.recipientName}
                    onChange={(event) => {
                      setRecipientName(event.target.value);
                      clearFieldError('recipientName');
                    }}
                  />
                  <InputField
                    label="Relation With Recipient (optional)"
                    multiline={false}
                    value={recipientWhatsapp}
                    maxLength={120}
                    error={fieldErrors.recipientRelationship}
                    onChange={(event) => {
                      setRecipientWhatsapp(event.target.value);
                      clearFieldError('recipientRelationship');
                    }}
                  />
                  <InputField
                    label="Write your heartfelt message"
                    multiline={true}
                    rows={4}
                    value={heartfeltMessage}
                    required
                    maxLength={10000}
                    error={fieldErrors.heartfeltMessage}
                    onChange={(event) => {
                      setHeartfeltMessage(event.target.value);
                      clearFieldError('heartfeltMessage');
                    }}
                  />
                </div>
              )}

              {activeStep === 3 && (
                <div className="step-form-fade-in form-fields-stack">
                  <InputField
                    label="Send an inspirational quote(optional)"
                    multiline={false}
                    value={songLink}
                    maxLength={1000}
                    error={fieldErrors.quoteText}
                    onChange={(event) => {
                      setSongLink(event.target.value);
                      clearFieldError('quoteText');
                    }}
                  />

                  <fieldset className="template-picker">
                    <legend className="color-palette-label">Choose a birthday template</legend>
                    {availableTemplates.length > 0 ? availableTemplates.map((template) => (
                      <article
                        key={template.id}
                        className={`template-option ${templateKey === template.id ? 'selected' : ''}`}
                      >
                        <button
                          type="button"
                          className="template-snapshot"
                          onClick={() => setShowTemplatePreview(true)}
                          aria-label={`View the full ${template.name} template before selecting it`}
                        >
                          <img src={template.thumbnail} alt="" />
                          <span>Preview full template</span>
                        </button>
                        <div className="template-option-details">
                          <div>
                            <h3>{template.name}</h3>
                            <p>{template.description}</p>
                          </div>
                          <span className="template-selection-status" aria-live="polite">
                            {templateKey === template.id ? 'Selected' : 'Not selected'}
                          </span>
                        </div>
                      </article>
                    )) : (
                      <p className="template-empty-state">Choose an occasion to see its available templates.</p>
                    )}
                    {fieldErrors.templateKey && <p className="form-field-error" role="alert">{fieldErrors.templateKey}</p>}
                  </fieldset>
                </div>
              )}

              {activeStep === 4 && (
                <div className="step-form-fade-in form-fields-stack">
                  <InputField
                    label="Mobile Number for MoMo / Telecel"
                    multiline={false}
                    type="tel"
                    autoComplete="tel"
                    value={senderWhatsapp}
                    required={serviceProvider === 'momo' || serviceProvider === 'telecel'}
                    maxLength={32}
                    error={fieldErrors.paymentPhone}
                    onChange={(event) => {
                      setSenderWhatsapp(event.target.value);
                      clearFieldError('paymentPhone');
                    }}
                  />
                  <div className="dropdown-select-container">
                    <select
                      className={`custom-select-element ${serviceProvider ? 'has-value' : ''}`}
                      value={serviceProvider}
                      required
                      aria-invalid={Boolean(fieldErrors.paymentProvider)}
                      aria-describedby={fieldErrors.paymentProvider ? 'provider-error' : undefined}
                      onChange={(event) => {
                        setServiceProvider(event.target.value);
                        clearFieldError('paymentProvider');
                        clearFieldError('paymentPhone');
                      }}
                      aria-label="Select Service Provider"
                    >
                      <option value="" disabled>Select Service Provider</option>
                      <option value="momo">MTN Mobile Money</option>
                      <option value="telecel">Telecel Cash</option>
                      <option value="card">Credit / Debit Card</option>
                    </select>
                    <div className="select-arrow-icon" aria-hidden="true">&#x25BC;</div>
                    {fieldErrors.paymentProvider && <span id="provider-error" className="form-field-error" role="alert">{fieldErrors.paymentProvider}</span>}
                  </div>
                </div>
              )}
            </section>

            {submitError && <p className="form-submit-error" role="alert">{submitError}</p>}

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
                onClick={activeStep === STEPS.length ? handleSaveDraft : handleNext}
                disabled={isSubmitting}
              >
                <span>{activeStep === STEPS.length ? 'Save Draft' : activeStep === 3 ? 'Proceed To Preview' : 'Next'}</span>
              </button>
            </footer>

          </div>
        </main>
      </div>

      {showTemplatePreview && (
        <dialog
          ref={templatePreviewRef}
          className="template-preview-dialog"
          aria-labelledby="template-preview-title"
          onClose={() => setShowTemplatePreview(false)}
        >
          <button
            type="button"
            className="template-preview-close"
            autoFocus
            onClick={() => setShowTemplatePreview(false)}
          >
            Close preview
          </button>
          <BirthdayTemplate1
            className="template-picker-full-preview"
            showCreateCta={false}
            onBack={() => setShowTemplatePreview(false)}
          />
          <footer className="template-preview-footer">
            <div>
              <h2 id="template-preview-title">Birthday Letter</h2>
              <p>Review the complete template, then choose it for your experience.</p>
            </div>
            <button type="button" className="template-select-button" onClick={selectBirthdayTemplate}>
              Use this template
            </button>
          </footer>
        </dialog>
      )}

      <LoadingPage isModal isOpen={isSubmitting} />

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

            <div className="success-confetti-art" aria-hidden="true" />
            <h2 id="experience-success-title">Draft saved</h2>
            <p className="experience-success-copy">
              Your draft is saved privately. You can preview it now; public sharing will be available when payment is implemented.
            </p>

            <div className="experience-share-row">
              <span className="experience-share-link" title={previewUrl}>
                <span aria-hidden="true">↗</span>
                {previewUrl}
              </span>
              <button
                type="button"
                className="experience-copy-button"
                onClick={handleCopyLink}
                aria-label={linkCopied ? 'Private preview link copied' : 'Copy private preview link'}
              >
                {linkCopied ? '✓' : '▢'}
              </button>
            </div>
            <p className={`experience-copy-status ${copyError ? 'is-error' : ''}`} aria-live="polite">
              {copyError || (linkCopied ? 'Private preview link copied' : 'Only you can open this preview')}
            </p>

            <button type="button" className="experience-create-new" onClick={handleCreateAnother}>
              Create A New Experience
            </button>
            <button
              type="button"
              className="experience-view-button"
              onClick={() => navigate(`/experiences/${encodeURIComponent(savedExperienceId)}/preview`)}
              disabled={!savedExperienceId}
            >
              View Experience
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
