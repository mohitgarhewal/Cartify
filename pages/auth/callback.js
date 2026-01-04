import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const finishAuth = async () => {
      // supabase-js will parse URL hash on first call and store session
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) return router.replace('/');

      if (error) {
        console.error('OAuth callback error:', error);
        return router.replace('/account/login?error=oauth');
      }

      // If still no session, redirect to login with an error
      return router.replace('/account/login?error=oauth');
    };

    finishAuth();
  }, [router]);

  return <p className="p-4 text-center">Completing sign-in…</p>;
}
