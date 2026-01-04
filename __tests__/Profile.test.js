import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../pages/profile';

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: { access_token: 'token' } } })),
      updateUser: jest.fn(() => Promise.resolve({ data: { user: { id: '123' } } })),
    },
    storage: {
      from: () => ({
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        upload: jest.fn(),
        createSignedUrl: jest.fn(),
      }),
    },
  },
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '123', email: 'test@example.com', user_metadata: {} },
    session: {},
    isLoading: false,
    updateProfile: jest.fn(() => Promise.resolve()),
    updatePassword: jest.fn(() => Promise.resolve()),
    resendConfirmation: jest.fn(() => Promise.resolve()),
    signOut: jest.fn(() => Promise.resolve()),
  }),
}));

describe('Profile page', () => {
  it('updates display name', async () => {
    render(<Profile />);
    const input = screen.getByLabelText(/Display Name/i);
    fireEvent.change(input, { target: { value: 'New Name' } });
    expect(input.value).toBe('New Name');
  });
});
