import { supabase } from './supabase';
import type { Answer, Question } from '@aura/types';

export const QUESTIONS: Question[] = [
  // Values
  { id: 1, category: 'values', text: 'How important is religion or spirituality in your life?', options: ['Central to who I am', 'Somewhat important', 'Not really', 'Not at all'] },
  { id: 2, category: 'values', text: 'Do you want children in the future?', options: ['Yes, definitely', 'Open to it', 'Not sure', 'No'] },
  { id: 3, category: 'values', text: 'How do you feel about politics?', options: ['Very engaged', 'Somewhat engaged', 'I follow it but don\'t discuss', 'I avoid it'] },
  { id: 4, category: 'values', text: 'What does family mean to you?', options: ['Everything — I\'m very family-oriented', 'Important but balanced', 'I value independence', 'I\'m estranged or choose my own family'] },
  { id: 5, category: 'values', text: 'How do you approach money?', options: ['Saver — I\'m very careful', 'Balance saving and spending', 'I enjoy spending', 'I live in the moment'] },
  { id: 6, category: 'values', text: 'How important is career ambition to you?', options: ['It\'s my top priority', 'Very important', 'Balanced with other things', 'I work to live, not live to work'] },
  { id: 7, category: 'values', text: 'What\'s your stance on gender roles in a relationship?', options: ['Traditional', 'Slightly traditional', 'Flexible', 'Fully equal in all things'] },
  { id: 8, category: 'values', text: 'How do you feel about pets?', options: ['Love them — I have/want pets', 'They\'re fine', 'Allergic or prefer not', 'Strongly dislike'] },
  // Lifestyle
  { id: 9, category: 'lifestyle', text: 'How would you describe your social energy?', options: ['Very extroverted', 'Mostly extroverted', 'Mostly introverted', 'Very introverted'] },
  { id: 10, category: 'lifestyle', text: 'How often do you drink alcohol?', options: ['Never', 'Occasionally', 'Socially', 'Regularly'] },
  { id: 11, category: 'lifestyle', text: 'Do you smoke or vape?', options: ['Never', 'Socially', 'Yes, occasionally', 'Yes, regularly'] },
  { id: 12, category: 'lifestyle', text: 'How do you spend a typical weekend?', options: ['Outdoors and active', 'Socialising with friends', 'A mix of both', 'Relaxed at home'] },
  { id: 13, category: 'lifestyle', text: 'What\'s your relationship with fitness?', options: ['It\'s a core part of my life', 'I try to stay active', 'I do it sometimes', 'Not really my thing'] },
  { id: 14, category: 'lifestyle', text: 'What does your diet look like?', options: ['Vegan', 'Vegetarian', 'Flexitarian', 'No restrictions'] },
  { id: 15, category: 'lifestyle', text: 'How clean and organised is your living space?', options: ['Very tidy — a place for everything', 'Mostly tidy', 'Relaxed about it', 'Organised chaos'] },
  { id: 16, category: 'lifestyle', text: 'How do you feel about travel?', options: ['Constantly exploring', 'Love it when I can', 'Occasionally', 'I prefer staying home'] },
  // Goals
  { id: 17, category: 'goals', text: 'What are you looking for right now?', options: ['A serious long-term relationship', 'Something that could become serious', 'Open to whatever happens', 'Companionship and connection'] },
  { id: 18, category: 'goals', text: 'How soon do you see yourself settling down?', options: ['Ready now', 'In the next few years', 'No rush', 'Not sure'] },
  { id: 19, category: 'goals', text: 'How do you handle conflict in relationships?', options: ['Talk it through immediately', 'Need time to cool down then talk', 'Tend to avoid conflict', 'I\'m still figuring this out'] },
  { id: 20, category: 'goals', text: 'What\'s your love language?', options: ['Words of affirmation', 'Quality time', 'Physical touch', 'Acts of service'] },
  { id: 21, category: 'goals', text: 'How do you feel about long-distance relationships?', options: ['Fine with it', 'Depends on the situation', 'Prefer local', 'Not for me'] },
  { id: 22, category: 'goals', text: 'How important is physical intimacy in a relationship?', options: ['Very important', 'Important', 'Somewhat', 'Less important than emotional connection'] },
  { id: 23, category: 'goals', text: 'How do you feel about your partner having close friends of the gender they\'re attracted to?', options: ['Completely fine', 'Fine with trust and transparency', 'A little uncomfortable', 'Not comfortable'] },
  // Dealbreakers
  { id: 24, category: 'dealbreakers', text: 'Is smoking a dealbreaker for you?', options: ['Yes, absolutely', 'Somewhat', 'Not really', 'Not at all'] },
  { id: 25, category: 'dealbreakers', text: 'Is having / not having children a dealbreaker?', options: ['Yes — we must align on this', 'Somewhat', 'Not really', 'No dealbreaker'] },
  { id: 26, category: 'dealbreakers', text: 'Would a large age gap be a dealbreaker?', options: ['Yes (more than 5 years)', 'Somewhat', 'Not really', 'Age doesn\'t matter to me'] },
  { id: 27, category: 'dealbreakers', text: 'Is religion compatibility important to you?', options: ['Yes, we must share beliefs', 'Somewhat', 'Respect is enough', 'Not important'] },
  { id: 28, category: 'dealbreakers', text: 'Is diet/lifestyle compatibility important?', options: ['Yes — I need someone similar', 'Somewhat', 'Not really', 'No preference'] },
  { id: 29, category: 'dealbreakers', text: 'Would different political views be a dealbreaker?', options: ['Yes', 'Depends on how different', 'Can respect differences', 'Not at all'] },
  { id: 30, category: 'dealbreakers', text: 'Is financial compatibility important?', options: ['Yes, aligned spending habits matter', 'Somewhat', 'Not really', 'Money doesn\'t affect this for me'] },
];

export async function saveAnswer(userId: string, question: Question, answerIndex: 0 | 1 | 2 | 3) {
  const { error } = await supabase.from('answers').upsert({
    user_id: userId,
    question_id: question.id,
    category: question.category,
    answer_text: question.options[answerIndex],
    answer_index: answerIndex,
  }, { onConflict: 'user_id,question_id' });
  if (error) throw error;
}

export async function getUserAnswers(userId: string): Promise<Answer[]> {
  const { data, error } = await supabase.from('answers').select('*').eq('user_id', userId).order('question_id');
  if (error) throw error;
  return data ?? [];
}

export async function completeQuestionnaire(userId: string) {
  const { error } = await supabase.from('profiles').update({ questionnaire_completed: true }).eq('id', userId);
  if (error) throw error;
}
