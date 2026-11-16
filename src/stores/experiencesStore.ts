import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Experience {
  id: string;
  creatorName: string;
  recipientName: string;
  occasion: string;
  heartfeltMessage: string;
  selectedColor: string;
  themeMode: string;
  shareUrl: string;
  createdAt: string;
}

interface ExperiencesState {
  experiences: Experience[];
  addExperience: (experience: Experience) => void;
}

export const useExperiences = create<ExperiencesState>()(
  persist(
    (set) => ({
      experiences: [],
      addExperience: (experience) =>
        set((state) => ({ experiences: [experience, ...state.experiences] })),
    }),
    { name: 'dle-experiences' }
  )
);
