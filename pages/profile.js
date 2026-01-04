import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, session, isLoading, updateProfile, updatePassword, resendConfirmation, signOut } = useAuth();
  const [profile, setProfile] = useState({ display_name: '', email: '' });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setProfile({
        display_name: user.user_metadata?.display_name || '',
        email: user.email || '',
      });
      fetchAvatar();
    }
  }, [user]);

  const fetchAvatar = async () => {
    if (!user) return;
    const { data } = supabase.storage.from('avatars').getPublicUrl(`avatars/${user.id}`);
    if (data?.publicUrl) setAvatarUrl(data.publicUrl);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await updateProfile({ data: { display_name: profile.display_name } });
      setMessage('Profile updated');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleEmailUpdate = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const { error: err } = await supabase.auth.updateUser({ email: profile.email });
      if (err) throw err;
      setMessage('Email update requested. Check your inbox to confirm.');
    } catch (err) {
      setError(err.message || 'Failed to update email');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const newPassword = form.get('newPassword');
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await updatePassword(newPassword);
      setMessage('Password updated');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    try {
      setSaving(true);
      setMessage('');
      setError('');
      const file = event.target.files?.[0];
      if (!file || !user) return;
      const ext = file.name.split('.').pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: signed } = await supabase.storage.from('avatars').createSignedUrl(path, 60 * 10);
      if (signed?.signedUrl) setAvatarUrl(signed.signedUrl);
      setMessage('Avatar updated');
    } catch (err) {
      setError(err.message || 'Failed to upload avatar');
    } finally {
      setSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResendConfirmation = async () => {
    if (!user?.email) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await resendConfirmation(user.email);
      setMessage('Confirmation email resent');
    } catch (err) {
      setError(err.message || 'Failed to resend confirmation');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOutAll = async () => {
    try {
      await signOut('global');
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Failed to sign out everywhere');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const resp = await fetch('http://localhost:4000/admin/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Delete failed');
      await signOut('global');
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Failed to delete account');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.replace('/account/login');
    }
  }, [isLoading, user]);

  return (
    <Layout>
      <Head>
        <title>Profile - Cartify</title>
      </Head>
      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            {message && <div className="p-3 bg-green-50 text-green-700 rounded mb-3">{message}</div>}
            {error && <div className="p-3 bg-red-50 text-red-700 rounded mb-3">{error}</div>}

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">{user?.email?.[0]?.toUpperCase() || '?'}</div>
                )}
              </div>
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="text-sm" />
                <p className="text-xs text-gray-500">Recommended square image. Stored in Supabase Storage.</p>
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Display Name</label>
                <input
                  type="text"
                  value={profile.display_name}
                  onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="input-field"
                />
                <button type="button" onClick={handleEmailUpdate} className="mt-2 btn-secondary">Update Email</button>
              </div>
              <div className="flex gap-2">
                <motion.button whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: saving ? 1 : 0.98 }} type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : 'Save Profile'}
                </motion.button>
                <button type="button" onClick={handleResendConfirmation} className="btn-secondary" disabled={saving}>
                  Resend Confirmation
                </button>
              </div>
            </form>
          </div>

          <div id="sessions" className="bg-white p-6 rounded-lg shadow space-y-3">
            <h2 className="text-xl font-semibold">Sessions</h2>
            <p className="text-sm text-gray-600">Sign out current or all sessions.</p>
            <div className="flex gap-2">
              <button onClick={() => signOut('local')} className="btn-secondary">Sign Out (this device)</button>
              <button onClick={handleSignOutAll} className="btn-danger">Sign Out Everywhere</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-semibold">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <input name="newPassword" type="password" placeholder="New password" className="input-field" required />
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow space-y-3">
            <h2 className="text-xl font-semibold text-red-700">Danger Zone</h2>
            <p className="text-sm text-gray-600">Delete your account permanently.</p>
            <button onClick={handleDeleteAccount} className="btn-danger" disabled={saving}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
