import {
    isValidGhanaMobileNumber,
    normalizeGhanaMobileNumber,
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
    paymentPhone: '024 123 4567',
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
    expect(validateExperienceFormStep(3, validForm)).toEqual({});
});

test('validates provider and Ghana mobile numbers for mobile money', () => {
    expect(validateExperienceFormStep(4, { ...validForm, paymentProvider: '' })).toHaveProperty('paymentProvider');
    expect(validateExperienceFormStep(4, { ...validForm, paymentPhone: '12345' })).toHaveProperty('paymentPhone');
    expect(normalizeGhanaMobileNumber('+233 24 123 4567')).toBe('0241234567');
    expect(isValidGhanaMobileNumber('024 123 4567')).toBe(true);
    expect(isValidGhanaMobileNumber('+233 24 123 4567')).toBe(true);
    expect(isValidGhanaMobileNumber('12345')).toBe(false);
    expect(validateExperienceFormStep(4, { ...validForm, paymentProvider: 'card', paymentPhone: '' })).toEqual({});
});
