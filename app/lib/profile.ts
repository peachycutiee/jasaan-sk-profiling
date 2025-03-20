import supabase from './supabaseClient';

export const updateProfile = async (name: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return console.error('No user logged in');

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
