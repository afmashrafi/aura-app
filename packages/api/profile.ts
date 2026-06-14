import { supabase } from './supabase';
import type { PromptResponse } from '@aura/types';

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
  data: { bio?: string; interests?: string[]; prompt_responses?: PromptResponse[] }
) {
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId);
  if (error) throw error;
}
