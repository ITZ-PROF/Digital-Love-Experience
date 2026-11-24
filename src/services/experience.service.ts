import { api } from '../utils/request';

export type ExperienceStatus = 'DRAFT' | 'PENDING_PAYMENT' | 'ACTIVE' | 'EXPIRED';

export interface Experience {
    id: string;
    creatorId: string;
    creatorName: string;
    recipientName: string;
    recipientRelationship: string | null;
    occasion: string;
    templateKey: string;
    heroImagePath: string | null;
    heroImageUrl?: string;
    heartfeltMessage: string;
    quoteText: string | null;
    selectedColor: string;
    themeMode: string;
    paymentPhone: string | null;
    paymentProvider: string | null;
    status: ExperienceStatus;
    createdAt: string;
    updatedAt: string;
}

export type ExperienceDraftInput = Pick<
    Experience,
    | 'creatorName'
    | 'recipientName'
    | 'recipientRelationship'
    | 'occasion'
    | 'templateKey'
    | 'heartfeltMessage'
    | 'quoteText'
    | 'selectedColor'
    | 'themeMode'
    | 'paymentPhone'
    | 'paymentProvider'
> & {
    heroImagePath?: string;
};

interface ExperienceResponse {
    status: string;
    data: {
        experience: Experience;
    };
}

interface ExperienceListResponse {
    status: string;
    data: {
        experiences: Experience[];
    };
}

interface ExperienceImageUploadResponse {
    status: string;
    data: {
        heroImagePath: string;
    };
}

export async function uploadExperienceImage(file: File): Promise<string> {
    const response = await api.post<ExperienceImageUploadResponse>('/experiences/images', file, {
        headers: { 'Content-Type': file.type },
    });
    return response.data.data.heroImagePath;
}

export async function deleteExperienceImage(heroImagePath: string): Promise<void> {
    await api.delete('/experiences/images', { data: { heroImagePath } });
}

export async function createExperienceDraft(draft: ExperienceDraftInput): Promise<Experience> {
    const response = await api.post<ExperienceResponse>('/experiences', draft);
    return response.data.data.experience;
}

export async function listExperienceDrafts(): Promise<Experience[]> {
    const response = await api.get<ExperienceListResponse>('/experiences');
    return response.data.data.experiences;
}

export async function getExperienceDraft(id: string): Promise<Experience> {
    const response = await api.get<ExperienceResponse>(`/experiences/${encodeURIComponent(id)}`);
    return response.data.data.experience;
}

export async function updateExperienceDraft(
    id: string,
    draft: Partial<ExperienceDraftInput>
): Promise<Experience> {
    const response = await api.patch<ExperienceResponse>(`/experiences/${encodeURIComponent(id)}`, draft);
    return response.data.data.experience;
}
