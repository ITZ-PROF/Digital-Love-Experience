import {
    MAX_EXPERIENCE_IMAGE_BYTES,
    validateExperienceImage,
    validateExperienceFormStep,
    ExperienceFormValues,
} from './formValidation';

const validForm: ExperienceFormValues = {
    creatorName: 'Alex Creator',
    occasion: 'birthday',
    recipientName: 'Sam Recipient',
    recipientRelationship: '',
    heartfeltMessage: 'Happy birthday, wishing you a wonderful year!',
    quoteText: '',
    templateKey: 'birthday-template-1',
    selectedColor: 'purple',
    themeMode: 'dark',
    heroImageFile: null,
    paymentProvider: 'momo',
};

test('requires a valid creator name and the supported birthday occasion', () => {
    expect(validateExperienceFormStep(1, { ...validForm, creatorName: ' ' })).toHaveProperty('creatorName');
    expect(validateExperienceFormStep(1, { ...validForm, occasion: 'wedding' })).toHaveProperty('occasion');
    expect(validateExperienceFormStep(1, validForm)).toEqual({});
});

test('requires recipient details and a heartfelt message but allows a missing relationship', () => {
    expect(validateExperienceFormStep(2, {
        ...validForm,
        recipientName: '',
        heartfeltMessage: ' ',
    })).toMatchObject({
        recipientName: expect.any(String),
        heartfeltMessage: expect.any(String),
    });
    expect(validateExperienceFormStep(2, validForm)).toEqual({});
});

test('requires the full template selection while keeping the quote optional', () => {
    expect(validateExperienceFormStep(3, { ...validForm, templateKey: '' })).toHaveProperty('templateKey');
    expect(validateExperienceFormStep(3, { ...validForm, selectedColor: 'pink' })).toHaveProperty('selectedColor');
    expect(validateExperienceFormStep(3, { ...validForm, themeMode: 'sepia' })).toHaveProperty('themeMode');
    expect(validateExperienceFormStep(3, validForm)).toEqual({});
});

test('requires a supported payment provider and leaves mobile-money details to Paystack', () => {
    expect(validateExperienceFormStep(4, { ...validForm, paymentProvider: '' })).toHaveProperty('paymentProvider');
    expect(validateExperienceFormStep(4, { ...validForm, paymentProvider: 'card' })).toEqual({});
});

test('accepts supported image types within the upload size limit', () => {
    const image = new File(['image'], 'birthday.png', { type: 'image/png' });
    expect(validateExperienceImage(image)).toBeUndefined();
    expect(validateExperienceFormStep(3, { ...validForm, heroImageFile: image })).toEqual({});
});

test('rejects unsupported, empty, and oversized images', () => {
    const unsupported = new File(['image'], 'birthday.gif', { type: 'image/gif' });
    const empty = new File([], 'birthday.png', { type: 'image/png' });
    const oversized = new File(
        [new Uint8Array(MAX_EXPERIENCE_IMAGE_BYTES + 1)],
        'birthday.png',
        { type: 'image/png' }
    );

    expect(validateExperienceImage(unsupported)).toMatch(/JPEG, PNG, or WebP/);
    expect(validateExperienceFormStep(3, { ...validForm, heroImageFile: unsupported })).toHaveProperty('heroImageFile');
    expect(validateExperienceImage(empty)).toMatch(/not empty/);
    expect(validateExperienceImage(oversized)).toMatch(/smaller than 5 MB/);
});
