export interface ExperienceFormValues {
    creatorName: string;
    occasion: string;
    recipientName: string;
    recipientRelationship: string;
    heartfeltMessage: string;
    quoteText: string;
    templateKey: string;
    selectedColor: string;
    themeMode: string;
    heroImageFile: File | null;
    paymentProvider: string;
}

export type ExperienceFormErrors = Partial<Record<keyof ExperienceFormValues, string>>;

const MAX_NAME_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 10000;
const MAX_QUOTE_LENGTH = 1000;
const MAX_RELATIONSHIP_LENGTH = 120;
export const MAX_EXPERIENCE_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXPERIENCE_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function validateExperienceImage(file: File): string | undefined {
    if (!ALLOWED_EXPERIENCE_IMAGE_TYPES.has(file.type)) {
        return 'Choose a JPEG, PNG, or WebP image.';
    }
    if (file.size === 0) {
        return 'Choose an image that is not empty.';
    }
    if (file.size > MAX_EXPERIENCE_IMAGE_BYTES) {
        return 'Choose an image smaller than 5 MB.';
    }
    return undefined;
}

export function validateExperienceFormStep(
    step: number,
    values: ExperienceFormValues
): ExperienceFormErrors {
    const errors: ExperienceFormErrors = {};

    if (step === 1) {
        const creatorName = values.creatorName.trim();
        if (!creatorName) {
            errors.creatorName = 'Enter your name.';
        } else if (creatorName.length < 2 || creatorName.length > MAX_NAME_LENGTH) {
            errors.creatorName = `Your name must be between 2 and ${MAX_NAME_LENGTH} characters.`;
        }

        if (values.occasion !== 'birthday') {
            errors.occasion = 'Select Birthday to continue.';
        }
    }

    if (step === 2) {
        const recipientName = values.recipientName.trim();
        if (!recipientName) {
            errors.recipientName = 'Enter the recipient’s name.';
        } else if (recipientName.length < 2 || recipientName.length > MAX_NAME_LENGTH) {
            errors.recipientName = `The recipient’s name must be between 2 and ${MAX_NAME_LENGTH} characters.`;
        }

        if (!values.heartfeltMessage.trim()) {
            errors.heartfeltMessage = 'Write a message for the recipient.';
        } else if (values.heartfeltMessage.length > MAX_MESSAGE_LENGTH) {
            errors.heartfeltMessage = `Your message must be no more than ${MAX_MESSAGE_LENGTH} characters.`;
        }

        if (values.recipientRelationship.length > MAX_RELATIONSHIP_LENGTH) {
            errors.recipientRelationship = `Use no more than ${MAX_RELATIONSHIP_LENGTH} characters.`;
        }
    }

    if (step === 3) {
        if (!['purple', 'green', 'olive'].includes(values.selectedColor)) {
            errors.selectedColor = 'Choose a supported color palette.';
        }
        if (!['light', 'dark'].includes(values.themeMode)) {
            errors.themeMode = 'Choose a template theme.';
        }
        if (values.quoteText.length > MAX_QUOTE_LENGTH) {
            errors.quoteText = `The quote must be no more than ${MAX_QUOTE_LENGTH} characters.`;
        }
        if (values.templateKey !== 'birthday-template-1') {
            errors.templateKey = 'Preview and select the birthday template to continue.';
        }
        if (values.heroImageFile) {
            const imageError = validateExperienceImage(values.heroImageFile);
            if (imageError) errors.heroImageFile = imageError;
        }
    }

    if (step === 4) {
        if (!['momo', 'telecel', 'card'].includes(values.paymentProvider)) {
            errors.paymentProvider = 'Select a payment provider.';
        }
    }

    return errors;
}
