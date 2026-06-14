import { supabase } from './supabase';
import type { PromptResponse, SocialLink, FavoriteCategory } from '@aura/types';

export async function updateBio(userId: string, bio: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ bio })
    .eq('id', userId);
  if (error) throw error;
}

export async function updateInterests(userId: string, interests: string[]) {
  const { error } = await supabase
    .from('profiles')
    .update({ interests })
    .eq('id', userId);
  if (error) throw error;
}

export async function updatePromptResponses(userId: string, prompt_responses: PromptResponse[]) {
  const { error } = await supabase
    .from('profiles')
    .update({ prompt_responses })
    .eq('id', userId);
  if (error) throw error;
}

export async function updateProfileSetup(
  userId: string,
  data: {
    bio?: string;
    interests?: string[];
    prompt_responses?: PromptResponse[];
    social_links?: SocialLink[];
    favorites?: FavoriteCategory[];
  }
) {
  // Strip undefined so Supabase doesn't try to null out existing fields
  const payload = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  const { error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId);
  if (error) throw error;
}
