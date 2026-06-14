import { supabase } from './supabase';
import type { Match, Profile } from '@aura/types';

export interface MatchWithPartner {
  match: Match;
  partner: Pick<Profile, 'id' | 'first_name'>;
}

export async function getMatchesWithPartners(currentUserId: string): Promise<MatchWithPartner[]> {
  const { data: matches, error } = await supabase
    .from('matches')
    .select('*')
    .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`)
    .order('compatibility_score', { ascending: false });

  if (error || !matches) return [];

  const partnerIds = matches.map((m) =>
    m.user_a === currentUserId ? m.user_b : m.user_a
  );

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name')
    .in('id', partnerIds);

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));

  return matches.map((match) => {
    const partnerId = match.user_a === currentUserId ? match.user_b : match.user_a;
    return {
      match: match as Match,
      partner: profileMap[partnerId] ?? { id: partnerId, first_name: 'Someone' },
    };
  });
}

export async function getMatchWithPartner(
  matchId: string,
  currentUserId: string
): Promise<MatchWithPartner | null> {
  const { data: match, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`)
    .single();

  if (error || !match) return null;

  const partnerId = match.user_a === currentUserId ? match.user_b : match.user_a;

  const { data: partner } = await supabase
    .from('profiles')
    .select('id, first_name')
    .eq('id', partnerId)
    .single();

  return {
    match: match as Match,
    partner: partner ?? { id: partnerId, first_name: 'Someone' },
  };
}
