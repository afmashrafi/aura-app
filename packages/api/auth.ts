import { supabase } from './supabase';

export async function signUp(email: string, password: string, firstName: string, dateOfBirth: string, gender: string, interestedIn: string[]) {
  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
  if (authError) throw authError;
  if (!authData.user) throw new Error('No user returned from sign up');

  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    first_name: firstName,
    date_of_birth: dateOfBirth,
    gender,
    interested_in: interestedIn,
  });
  if (profileError) throw profileError;

  return authData.user;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}
