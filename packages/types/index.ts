export interface SocialLink {
  platform: 'spotify' | 'letterboxd' | 'myanimelist' | 'goodreads';
  username: string;
}

export interface FavoriteCategory {
  category: string;
  items: string[];
}

export interface Profile {
  id: string;
  first_name: string;
  date_of_birth: string;
  gender: string;
  interested_in: string[];
  questionnaire_completed: boolean;
  bio: string | null;
  interests: string[];
  prompt_responses: PromptResponse[];
  social_links: SocialLink[];
  favorites: FavoriteCategory[];
  created_at: string;
}

export interface PromptResponse {
  prompt: string;
  answer: string;
}

export interface Answer {
  id: string;
  user_id: string;
  question_id: number;
  category: string;
  answer_text: string;
  answer_index: 0 | 1 | 2 | 3;
  created_at: string;
}

export interface Match {
  id: string;
  user_a: string;
  user_b: string;
  compatibility_score: number;
  shared_highlights: string[];
  created_at: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  seen: boolean;
  created_at: string;
}

export interface Question {
  id: number;
  category: 'values' | 'lifestyle' | 'goals' | 'dealbreakers';
  text: string;
  options: [string, string, string, string];
}

export interface Interest {
  id: string;
  label: string;
  emoji: string;
  category: string;
}
