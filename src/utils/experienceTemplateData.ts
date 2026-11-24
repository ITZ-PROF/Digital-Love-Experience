import { BirthdayTemplateData } from '../components/templates/birthdaytemplate1/BirthdayTemplate1';
import { Experience } from '../services/experience.service';

type ExperienceTemplateSource = Pick<
    Experience,
    | 'recipientName'
    | 'creatorName'
    | 'occasion'
    | 'heroImageUrl'
    | 'heartfeltMessage'
    | 'quoteText'
    | 'createdAt'
>;

export function toBirthdayTemplateData(
    experience: ExperienceTemplateSource
): Partial<BirthdayTemplateData> {
    const recipientName = experience.recipientName || 'Someone special';
    const senderName = experience.creatorName || 'Someone who cares';
    const occasion = experience.occasion || 'special occasion';
    const createdAt = new Date(experience.createdAt);
    const message = experience.heartfeltMessage.trim();

    return {
        recipientName,
        senderName,
        occasionLabel: `CELEBRATING ${occasion.toUpperCase()}`,
        title: occasion.toLowerCase() === 'birthday'
            ? `Happy Birthday, ${recipientName}!`
            : `A special ${occasion} for ${recipientName}!`,
        heroImageUrl: experience.heroImageUrl || undefined,
        heroImageAlt: experience.heroImageUrl
            ? `Uploaded birthday photo for ${recipientName}`
            : 'Birthday celebration illustration',
        letterDate: createdAt.toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }),
        letterDateIso: createdAt.toISOString().slice(0, 10),
        letterGreeting: `Dear ${recipientName},`,
        letterParagraphs: message ? message.split(/\n{2,}/).filter(Boolean) : ['A message made with love.'],
        letterSignoff: 'With love,',
        quoteNumber: '01',
        quoteText: experience.quoteText || '',
        quoteAuthor: '',
        closingTitle: `A special moment made for ${recipientName}.`,
        copyright: [`Made with love for ${recipientName}.`],
    };
}
