// lib/profile.ts
import supabase from './createClient';

export const updateProfile = async (name: string) => {
  // Fetch the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return console.error('No user logged in');

  // Update the user's profile in the 'profiles' table
  const { error } = await supabase
    .from('profiles')
    .update({ name })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating profile:', error.message);
  } else {
    console.log('Profile updated successfully');
  }
};