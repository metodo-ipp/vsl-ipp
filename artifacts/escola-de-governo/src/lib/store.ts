import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizAnswerInput, AreaSlug } from '@workspace/api-client-react';

interface QuizState {
  answers: QuizAnswerInput[];
  setAnswer: (answer: QuizAnswerInput) => void;
  resetAnswers: () => void;
  
  utmParams: Record<string, string>;
  setUtmParams: (params: Record<string, string>) => void;
  
  leadId: string | null;
  slug: AreaSlug | null;
  resultUrl: string | null;
  setResultData: (data: { leadId: string; slug: AreaSlug; resultUrl: string }) => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      answers: [],
      setAnswer: (answer) =>
        set((state) => {
          const existingIndex = state.answers.findIndex((a) => a.questionKey === answer.questionKey);
          if (existingIndex >= 0) {
            const newAnswers = [...state.answers];
            newAnswers[existingIndex] = answer;
            return { answers: newAnswers };
          }
          return { answers: [...state.answers, answer] };
        }),
      resetAnswers: () => set({ answers: [], leadId: null, slug: null, resultUrl: null }),
      
      utmParams: {},
      setUtmParams: (params) => set({ utmParams: params }),
      
      leadId: null,
      slug: null,
      resultUrl: null,
      setResultData: (data) => set(data),
    }),
    {
      name: 'escola-de-governo-quiz',
    }
  )
);
