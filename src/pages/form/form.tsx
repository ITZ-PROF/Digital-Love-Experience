import { useEffect, useRef, useState } from 'react';
import './form.css';
import InputField from '../../components/inputfield/input';
import logo from '../../assets/logo_variant_2.svg'
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../../components/loadingpage/loader';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  createExperienceDraft,
  deleteExperienceImage,
  initializeExperiencePayment,
  uploadExperienceImage,
} from '../../services/experience.service';
import { useAuth } from '../../stores/authstore';
import BirthdayTemplate1, {
  BirthdayTemplateData,
} from '../../components/templates/birthdaytemplate1/BirthdayTemplate1';
import birthdayTemplateThumbnail from '../../assets/templateimage.svg';
import {
  ExperienceFormErrors,
  ExperienceFormValues,
  validateExperienceImage,
  validateExperienceFormStep,
} from './formValidation';

interface StepConfig {
  id: number;
  title: string;
  subtitle: string;
}

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  component: typeof BirthdayTemplate1;
}

const STEPS: StepConfig[] = [
  { id: 1, title: 'Basic Info', subtitle: 'Help the recipient know the creator' },
  { id: 2, title: 'Recipient Info', subtitle: 'Information for the webpage' },
  { id: 3, title: 'Experience Info', subtitle: 'Express your emotions and affection' },
  { id: 4, title: 'Payment Details', subtitle: 'Choose your preferred payment method' }
];

const THEME_COLORS = [
  { id: 'purple', name: 'Purple', preview: 'linear-gradient(135deg, #fbf6ef 0 42%, #841d1d 42% 62%, #c5a880 62%)' },
  { id: 'green', name: 'Green', preview: 'linear-gradient(135deg, #fbf6ef 0 42%, #28623c 42% 62%, #85a98d 62%)' },
  { id: 'olive', name: 'Olive', preview: 'linear-gradient(135deg, #fbf6ef 0 42%, #666619 42% 62%, #a4a46f 62%)' },
];

const TEMPLATES_BY_OCCASION: Record<string, TemplateOption[]> = {
  birthday: [
    {
      id: 'birthday-template-1',
      name: 'Birthday Letter',
      description: 'A warm, letter-style birthday celebration.',
      thumbnail: birthdayTemplateThumbnail,
      component: BirthdayTemplate1,
    },
  ],
};

export default function Form() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [creatorName, setCreatorName] = useState('');
  const [paymentProvider, setPaymentProvider] = useState('');
  const [occasion, setOccasion] = useState<string>('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientWhatsapp, setRecipientWhatsapp] = useState('');
  const [heartfeltMessage, setHeartfeltMessage] = useState('');
  const [songLink, setSongLink] = useState('');
  const [templateKey, setTemplateKey] = useState('');
  const [templateBeingPreviewed, setTemplateBeingPreviewed] = useState('');
  const [selectedColor, setSelectedColor] = useState('purple');
  const [themeMode, setThemeMode] = useState('dark');
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreviewUrl, setHeroImagePreviewUrl] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ExperienceFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [showExperiencePreview, setShowExperiencePreview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [savedExperienceId, setSavedExperienceId] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();
  const templatePreviewRef = useRef<HTMLDialogElement>(null);
  const experiencePreviewRef = useRef<HTMLDialogElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const creatorId = useAuth((state) => state.user?.id);
  const formValues: ExperienceFormValues = {
    creatorName,
    paymentProvider,
    occasion,
    recipientName,
    recipientRelationship: recipientWhatsapp,
    heartfeltMessage,
    quoteText: songLink,
    templateKey,
    selectedColor,
    themeMode,
    heroImageFile,
  };
  const availableTemplates = occasion === 'birthday' ? TEMPLATES_BY_OCCASION.birthday : [];
  const previewedTemplate = availableTemplates.find((template) => template.id === templateBeingPreviewed);
  const PreviewTemplate = previewedTemplate?.component ?? BirthdayTemplate1;

  useEffect(() => {
    if (!heroImagePreviewUrl) return;
    return () => URL.revokeObjectURL(heroImagePreviewUrl);
  }, [heroImagePreviewUrl]);

  useEffect(() => {
    const dialog = templatePreviewRef.current;
    if (!dialog) return;

    if (showTemplatePreview && !dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [showTemplatePreview]);

  useEffect(() => {
    const dialog = experiencePreviewRef.current;
    if (!dialog) return;

    if (showExperiencePreview && !dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [showExperiencePreview]);

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

  const ensureDraftSaved = async () => {
    if (savedExperienceId) return savedExperienceId;

    let uploadedHeroImagePath: string | undefined;
    try {
      if (heroImageFile) {
        uploadedHeroImagePath = await uploadExperienceImage(heroImageFile);
      }

      const experience = await createExperienceDraft({
        creatorName,
        recipientName,
        recipientRelationship: recipientWhatsapp,
        occasion,
        templateKey,
        heartfeltMessage,
        quoteText: songLink,
        selectedColor,
        themeMode,
        paymentProvider,
        ...(uploadedHeroImagePath ? { heroImagePath: uploadedHeroImagePath } : {}),
      });
      setSavedExperienceId(experience.id);
      void queryClient.invalidateQueries({ queryKey: ['experiences'] });
      return experience.id;
    } catch (error) {
      if (uploadedHeroImagePath) {
        try {
          await deleteExperienceImage(uploadedHeroImagePath);
        } catch (cleanupError) {
          console.error('Unable to remove the unreferenced experience image:', cleanupError);
        }
      }
      throw error;
    }
  };

  const handleNext = () => {
    if (activeStep < STEPS.length && validateSteps([activeStep])) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleProceedToPreview = () => {
    if (validateSteps([1, 2, 3])) {
      setShowExperiencePreview(true);
    }
  };

  const getExperiencePreviewData = (): Partial<BirthdayTemplateData> => {
    const message = heartfeltMessage.trim();
    const previewDate = new Date();

    return {
      recipientName,
      senderName: creatorName,
      occasionLabel: 'CELEBRATING BIRTHDAY',
      title: `Happy Birthday, ${recipientName}!`,
      heroImageUrl: heroImagePreviewUrl || undefined,
      heroImageAlt: heroImageFile ? `Birthday celebration for ${recipientName}` : 'Birthday celebration illustration',
      letterDate: previewDate.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      letterDateIso: previewDate.toISOString().slice(0, 10),
      letterGreeting: `Dear ${recipientName},`,
      letterParagraphs: message.split(/\n{2,}/).filter(Boolean),
      letterSignoff: 'With love,',
      quoteNumber: '01',
      quoteText: songLink.trim(),
      quoteAuthor: '',
      closingTitle: `A special moment made for ${recipientName}.`,
      copyright: [`Made with love for ${recipientName}.`],
    };
  };

  const continueToPaymentDetails = () => {
    setShowExperiencePreview(false);
    setActiveStep(4);
  };

  const handleStepNavigation = (targetStep: number) => {
    if (targetStep === 4 && activeStep < 4) {
      handleProceedToPreview();
      return;
    }

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

  const handleCompleteExperience = async () => {
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
      const experienceId = await ensureDraftSaved();
      setPreviewUrl(`${window.location.origin}/experiences/${encodeURIComponent(experienceId)}/preview`);
      setShowSuccessModal(true);
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || error.message
        : 'We could not save this experience. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToPaystack = async () => {
    if (isSubmitting) return;
    if (!validateSteps([1, 2, 3, 4])) return;
    if (!creatorId) {
      navigate('/login', { state: { from: { pathname: '/form' } } });
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);
    try {
      const experienceId = await ensureDraftSaved();
      const checkout = await initializeExperiencePayment(experienceId);
      window.location.assign(checkout.authorizationUrl);
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || error.message
        : 'We could not start Paystack checkout. Your draft is saved; please try again.';
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
      console.error('Unable to copy the experience link:', error);
      setLinkCopied(false);
      setCopyError('Could not copy the link. You can select and copy it manually.');
    }
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    setActiveStep(1);
    setCreatorName('');
    setPaymentProvider('');
    setOccasion('');
    setRecipientName('');
    setRecipientWhatsapp('');
    setHeartfeltMessage('');
    setSongLink('');
    setTemplateKey('');
    setTemplateBeingPreviewed('');
    setSelectedColor('purple');
    setThemeMode('dark');
    setHeroImageFile(null);
    setHeroImagePreviewUrl('');
    setFieldErrors({});
    setSavedExperienceId('');
    setPreviewUrl('');
    setSubmitError('');
    setCopyError('');
  };

  const openTemplatePreview = (templateId: string) => {
    setTemplateBeingPreviewed(templateId);
    setShowTemplatePreview(true);
  };

  const selectPreviewedTemplate = () => {
    if (!previewedTemplate) return;
    setTemplateKey(previewedTemplate.id);
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
                  <fieldset className="experience-image-upload">
                    <legend className="color-palette-label">Add a photo (optional)</legend>
                    <p id="hero-image-help" className="experience-image-help">
                      This photo will appear in the birthday template. Use a JPEG, PNG, or WebP image up to 5 MB.
                    </p>
                    <input
                      ref={heroImageInputRef}
                      id="experience-hero-image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      aria-label="Upload a birthday photo"
                      aria-invalid={Boolean(fieldErrors.heroImageFile)}
                      aria-describedby={fieldErrors.heroImageFile ? 'hero-image-error' : 'hero-image-help'}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;

                        const error = validateExperienceImage(file);
                        if (error) {
                          setFieldErrors((current) => ({ ...current, heroImageFile: error }));
                          event.target.value = '';
                          return;
                        }

                        setHeroImageFile(file);
                        setHeroImagePreviewUrl(URL.createObjectURL(file));
                        clearFieldError('heroImageFile');
                      }}
                    />
                    {fieldErrors.heroImageFile && (
                      <p id="hero-image-error" className="form-field-error" role="alert">
                        {fieldErrors.heroImageFile}
                      </p>
                    )}
                    {heroImageFile && heroImagePreviewUrl && (
                      <div className="experience-image-selected">
                      <img src={heroImagePreviewUrl} alt={`Selected for ${recipientName}`} />
                        <div>
                          <span className="experience-image-filename">{heroImageFile.name}</span>
                          <button
                            type="button"
                            className="experience-image-remove"
                            onClick={() => {
                              setHeroImageFile(null);
                              setHeroImagePreviewUrl('');
                              clearFieldError('heroImageFile');
                              if (heroImageInputRef.current) heroImageInputRef.current.value = '';
                            }}
                          >
                            Remove photo
                          </button>
                        </div>
                      </div>
                    )}
                  </fieldset>

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

                  <fieldset className="color-picker-fieldset">
                    <legend className="color-palette-label">Choose a color palette</legend>
                    <div className="color-cards-grid">
                      {THEME_COLORS.map((color) => (
                        <button
                          key={color.id}
                          type="button"
                          className={`color-card color-card-${color.id} ${selectedColor === color.id ? 'selected' : ''}`}
                          style={{ background: color.preview }}
                          aria-label={`${color.name} color palette`}
                          aria-pressed={selectedColor === color.id}
                          onClick={() => {
                            setSelectedColor(color.id);
                            clearFieldError('selectedColor');
                          }}
                        >
                          <span className="radio-dot" aria-hidden="true" />
                          <span className="color-card-label">{color.name}</span>
                        </button>
                      ))}
                    </div>
                    {fieldErrors.selectedColor && <p className="form-field-error" role="alert">{fieldErrors.selectedColor}</p>}
                  </fieldset>

                  <fieldset className="theme-picker">
                    <legend className="color-palette-label">Choose a template theme</legend>
                    <div className="theme-toggle-row">
                      {(['light', 'dark'] as const).map((theme) => (
                        <label className="radio-option" key={theme}>
                          <input
                            type="radio"
                            name="themeMode"
                            value={theme}
                            checked={themeMode === theme}
                            onChange={() => {
                              setThemeMode(theme);
                              clearFieldError('themeMode');
                            }}
                          />
                          <span className="custom-radio-circle" aria-hidden="true" />
                          <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
                        </label>
                      ))}
                    </div>
                    {fieldErrors.themeMode && <p className="form-field-error" role="alert">{fieldErrors.themeMode}</p>}
                  </fieldset>

                  <fieldset className="template-picker">
                    <legend className="color-palette-label">Choose a birthday template</legend>
                    {availableTemplates.length > 0 ? (
                      <div className="template-cards-grid">
                        {availableTemplates.map((template) => (
                          <article
                            key={template.id}
                            className={`template-option ${templateKey === template.id ? 'selected' : ''}`}
                          >
                            <button
                              type="button"
                              className="template-snapshot"
                              onClick={() => openTemplatePreview(template.id)}
                              aria-label={`View the full ${template.name} template before selecting it`}
                            >
                              <img src={template.thumbnail} alt="" />
                              <span>Preview template</span>
                            </button>
                            <div className="template-option-details">
                              <h3>{template.name}</h3>
                              <p>{template.description}</p>
                              <span className="template-selection-status" aria-live="polite">
                                {templateKey === template.id ? 'Selected' : 'Preview to select'}
                              </span>
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="template-empty-state">Choose an occasion to see its available templates.</p>
                    )}
                    {fieldErrors.templateKey && <p className="form-field-error" role="alert">{fieldErrors.templateKey}</p>}
                  </fieldset>
                </div>
              )}

              {activeStep === 4 && (
                <div className="step-form-fade-in form-fields-stack">
                  <div className="payment-notice" role="status">
                    <strong>Pay securely with Paystack</strong>
                    <p>Your choice opens card or mobile-money checkout. Paystack collects the required payment details there, and only verified payment makes the experience shareable.</p>
                  </div>
                  <div className="dropdown-select-container">
                    <select
                      id="payment-provider"
                      className={`custom-select-element ${paymentProvider ? 'has-value' : ''}`}
                      value={paymentProvider}
                      required
                      aria-invalid={Boolean(fieldErrors.paymentProvider)}
                      aria-describedby={fieldErrors.paymentProvider ? 'payment-provider-error' : undefined}
                      onChange={(event) => {
                        const provider = event.target.value;
                        setPaymentProvider(provider);
                        clearFieldError('paymentProvider');
                      }}
                    >
                      <option value="" disabled hidden></option>
                      <option value="momo">Mobile Money (MTN)</option>
                      <option value="telecel">Telecel Cash</option>
                      <option value="card">Debit or credit card</option>
                    </select>
                    <label className="select-floating-label" htmlFor="payment-provider">
                      Preferred Payment Method
                    </label>
                    <div className="select-arrow-icon">&#x25BC;</div>
                    {fieldErrors.paymentProvider && (
                      <span id="payment-provider-error" className="form-field-error" role="alert">
                        {fieldErrors.paymentProvider}
                      </span>
                    )}
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
              {activeStep === STEPS.length && (
                <button
                  type="button"
                  className="action-link-btn save-draft"
                  onClick={handleCompleteExperience}
                  disabled={isSubmitting}
                >
                  <span>Save Draft</span>
                </button>
              )}
              <button
                type="button"
                className="action-link-btn next"
                onClick={
                  activeStep === STEPS.length
                    ? handleProceedToPaystack
                    : activeStep === 3
                      ? handleProceedToPreview
                      : handleNext
                }
                disabled={isSubmitting}
              >
                <span>
                  {activeStep === STEPS.length
                    ? 'Continue to Paystack'
                    : activeStep === 3 ? 'Proceed To Preview' : 'Next'}
                </span>
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
          <PreviewTemplate
            className={`template-picker-full-preview experience-color-${selectedColor} experience-theme-${themeMode}`}
            showCreateCta={false}
            onBack={() => setShowTemplatePreview(false)}
          />
          <footer className="template-preview-footer">
            <div>
              <h2 id="template-preview-title">{previewedTemplate?.name || 'Birthday template'}</h2>
              <p>Review the complete template, then choose it for your experience.</p>
            </div>
            <button type="button" className="template-select-button" onClick={selectPreviewedTemplate}>
              Use this template
            </button>
          </footer>
        </dialog>
      )}

      {showExperiencePreview && (
        <dialog
          ref={experiencePreviewRef}
          className="template-preview-dialog"
          aria-labelledby="experience-preview-title"
          onClose={() => setShowExperiencePreview(false)}
        >
          <button
            type="button"
            className="template-preview-close"
            autoFocus
            onClick={() => setShowExperiencePreview(false)}
          >
            Close preview
          </button>
          <BirthdayTemplate1
            className={`template-picker-full-preview experience-color-${selectedColor} experience-theme-${themeMode}`}
            heroImageUrl={heroImagePreviewUrl || undefined}
            data={getExperiencePreviewData()}
            showCreateCta={false}
            onBack={() => setShowExperiencePreview(false)}
          />
          <footer className="template-preview-footer">
            <div>
              <h2 id="experience-preview-title">Your birthday experience</h2>
              <p>Review your message and design before continuing to payment details.</p>
            </div>
            <button type="button" className="template-select-button" onClick={continueToPaymentDetails}>
              Continue to payment details
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
              Your draft is saved privately. You can continue to Paystack checkout from your dashboard whenever you’re ready.
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
                aria-label={linkCopied ? 'Preview link copied' : 'Copy preview link'}
              >
                {linkCopied ? '✓' : '▢'}
              </button>
            </div>
            <p className={`experience-copy-status ${copyError ? 'is-error' : ''}`} aria-live="polite">
              {copyError || (linkCopied
                ? 'Private preview link copied'
                : 'Only you can open this preview')}
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
              Preview Draft
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
