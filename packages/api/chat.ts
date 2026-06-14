import { supabase } from './supabase';
import type { Message, Match } from '@aura/types';

export async function getMatches(userId: string): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .order('compatibility_score', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getMessages(matchId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function sendMessage(matchId: string, senderId: string, content: string) {
  const { error } = await supabase.from('messages').insert({ match_id: matchId, sender_id: senderId, content });
  if (error) throw error;
}

export async function markSeen(matchId: string, recipientId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ seen: true })
    .eq('match_id', matchId)
    .neq('sender_id', recipientId)
    .eq('seen', false);
  if (error) throw error;
}

export function subscribeToMessages(matchId: string, onMessage: (msg: Message) => void) {
  return supabase
    .channel(`match-${matchId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `match_id=eq.${matchId}`,
    }, (payload) => {
      onMessage(payload.new as Message);
    })
    .subscribe();
}
