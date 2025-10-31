import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUserStore } from '../authStore';
import { SupabaseAPI } from '../../utils/service/api';
import {
  createMockAuthResponse,
  createMockUserResponse,
  createMockSessionResponse,
  createMockPostgrestResponse,
} from '../../utils/test-helpers/supabase-mocks';

// Mock SupabaseAPI
vi.mock('../../utils/service/api', () => ({
  SupabaseAPI: {
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    getSession: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

// Mock adventureStore
vi.mock('../adventureStore', () => ({
  useAdventureStore: {
    getState: () => ({
      clearAdventures: vi.fn(),
    }),
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUserStore.setState({
      user: null,
      session: null,
      loading: false,
      initializing: true,
    });
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('should sign up a new user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      const mockSession = {
        access_token: 'token-123',
        refresh_token: 'refresh-123',
      };

      vi.mocked(SupabaseAPI.signUp).mockResolvedValue(
        createMockAuthResponse(mockUser, mockSession)
      );

      const { signUp } = useUserStore.getState();
      await signUp('test@example.com', 'password123', {
        firstName: 'John',
        lastName: 'Doe',
      });

      const state = useUserStore.getState();
      expect(state.user).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(state.session).toEqual(mockSession);
      expect(state.loading).toBe(false);
    });

    it('should set loading to true during sign up', async () => {
      vi.mocked(SupabaseAPI.signUp).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve(createMockAuthResponse()),
              100
            )
          )
      );

      const { signUp } = useUserStore.getState();
      const signUpPromise = signUp('test@example.com', 'password123', {
        firstName: 'John',
        lastName: 'Doe',
      });

      // Check loading state during operation
      expect(useUserStore.getState().loading).toBe(true);

      await signUpPromise;

      // Check loading state after operation
      expect(useUserStore.getState().loading).toBe(false);
    });

    it('should handle sign up error', async () => {
      const mockError = new Error('Sign up failed');
      vi.mocked(SupabaseAPI.signUp).mockResolvedValue(
        createMockAuthResponse(null, null, mockError)
      );

      const { signUp } = useUserStore.getState();

      await expect(
        signUp('test@example.com', 'password123', {
          firstName: 'John',
          lastName: 'Doe',
        })
      ).rejects.toThrow('Sign up failed');

      expect(useUserStore.getState().loading).toBe(false);
    });

    it('should handle user without metadata', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {},
      };

      vi.mocked(SupabaseAPI.signUp).mockResolvedValue(
        createMockAuthResponse(mockUser)
      );

      const { signUp } = useUserStore.getState();
      await signUp('test@example.com', 'password123', {
        firstName: 'John',
        lastName: 'Doe',
      });

      const state = useUserStore.getState();
      expect(state.user).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        firstName: '',
        lastName: '',
      });
    });
  });

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      const mockUser = {
        id: 'user-456',
        email: 'existing@example.com',
        user_metadata: {
          firstName: 'Jane',
          lastName: 'Smith',
        },
      };

      const mockSession = {
        access_token: 'token-456',
        refresh_token: 'refresh-456',
      };

      vi.mocked(SupabaseAPI.signIn).mockResolvedValue(
        createMockAuthResponse(mockUser, mockSession)
      );

      const { signIn } = useUserStore.getState();
      await signIn('existing@example.com', 'password123');

      const state = useUserStore.getState();
      expect(state.user).toEqual({
        id: 'user-456',
        email: 'existing@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      });
      expect(state.session).toEqual(mockSession);
      expect(state.loading).toBe(false);
    });

    it('should set loading to true during sign in', async () => {
      vi.mocked(SupabaseAPI.signIn).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve(createMockAuthResponse()),
              100
            )
          )
      );

      const { signIn } = useUserStore.getState();
      const signInPromise = signIn('test@example.com', 'password123');

      expect(useUserStore.getState().loading).toBe(true);

      await signInPromise;

      expect(useUserStore.getState().loading).toBe(false);
    });

    it('should handle sign in error', async () => {
      const mockError = new Error('Invalid credentials');
      vi.mocked(SupabaseAPI.signIn).mockResolvedValue(
        createMockAuthResponse(null, null, mockError)
      );

      const { signIn } = useUserStore.getState();

      await expect(
        signIn('wrong@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');

      expect(useUserStore.getState().loading).toBe(false);
    });
  });

  describe('signOut', () => {
    it('should sign out user successfully', async () => {
      // Set initial user state
      useUserStore.setState({
        user: {
          id: 'user-123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
        session: { access_token: 'token' },
      });

      vi.mocked(SupabaseAPI.signOut).mockResolvedValue({ error: null });

      const { signOut } = useUserStore.getState();
      await signOut();

      const state = useUserStore.getState();
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.loading).toBe(false);
    });

    it('should call signOut API successfully', async () => {
      vi.mocked(SupabaseAPI.signOut).mockResolvedValue({ error: null });

      const { signOut } = useUserStore.getState();
      await signOut();

      expect(SupabaseAPI.signOut).toHaveBeenCalled();
      expect(useUserStore.getState().user).toBeNull();
    });

    it('should remove adventures from localStorage on sign out', async () => {
      vi.mocked(SupabaseAPI.signOut).mockResolvedValue({ error: null });

      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

      const { signOut } = useUserStore.getState();
      await signOut();

      expect(removeItemSpy).toHaveBeenCalledWith('adventures-storage');
    });
  });

  describe('fetchUser', () => {
    it('should fetch user and session successfully', async () => {
      const mockUser = {
        id: 'user-789',
        email: 'fetched@example.com',
        user_metadata: {
          firstName: 'Bob',
          lastName: 'Johnson',
        },
      };

      const mockSession = {
        access_token: 'token-789',
        refresh_token: 'refresh-789',
      };

      vi.mocked(SupabaseAPI.getUser).mockResolvedValue(
        createMockUserResponse(mockUser)
      );

      vi.mocked(SupabaseAPI.getSession).mockResolvedValue(
        createMockSessionResponse(mockSession)
      );

      const { fetchUser } = useUserStore.getState();
      await fetchUser();

      const state = useUserStore.getState();
      expect(state.user).toEqual({
        id: 'user-789',
        email: 'fetched@example.com',
        firstName: 'Bob',
        lastName: 'Johnson',
      });
      expect(state.session).toEqual(mockSession);
      expect(state.loading).toBe(false);
    });

    it('should handle user fetch error', async () => {
      const mockError = new Error('Failed to fetch user');
      vi.mocked(SupabaseAPI.getUser).mockResolvedValue(
        createMockUserResponse(null, mockError)
      );

      const { fetchUser } = useUserStore.getState();

      await expect(fetchUser()).rejects.toThrow('Failed to fetch user');

      expect(useUserStore.getState().loading).toBe(false);
    });

    it('should handle session fetch error', async () => {
      const mockUser = {
        id: 'user-789',
        email: 'test@example.com',
        user_metadata: {},
      };

      const mockError = new Error('Failed to fetch session');

      vi.mocked(SupabaseAPI.getUser).mockResolvedValue(
        createMockUserResponse(mockUser)
      );

      vi.mocked(SupabaseAPI.getSession).mockResolvedValue(
        createMockSessionResponse(null, mockError)
      );

      const { fetchUser } = useUserStore.getState();

      await expect(fetchUser()).rejects.toThrow('Failed to fetch session');

      expect(useUserStore.getState().loading).toBe(false);
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      vi.mocked(SupabaseAPI.resetPassword).mockResolvedValue(
        createMockPostgrestResponse({})
      );

      const { resetPassword } = useUserStore.getState();
      await resetPassword('test@example.com');

      expect(SupabaseAPI.resetPassword).toHaveBeenCalledWith(
        'test@example.com',
        undefined
      );
      expect(useUserStore.getState().loading).toBe(false);
    });

    it('should reset password with redirect URL', async () => {
      vi.mocked(SupabaseAPI.resetPassword).mockResolvedValue(
        createMockPostgrestResponse({})
      );

      const { resetPassword } = useUserStore.getState();
      await resetPassword('test@example.com', 'http://localhost:5173/reset');

      expect(SupabaseAPI.resetPassword).toHaveBeenCalledWith(
        'test@example.com',
        'http://localhost:5173/reset'
      );
      expect(useUserStore.getState().loading).toBe(false);
    });

    it('should set loading during password reset', async () => {
      vi.mocked(SupabaseAPI.resetPassword).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve(createMockPostgrestResponse({})),
              100
            )
          )
      );

      const { resetPassword } = useUserStore.getState();
      const resetPromise = resetPassword('test@example.com');

      expect(useUserStore.getState().loading).toBe(true);

      await resetPromise;

      expect(useUserStore.getState().loading).toBe(false);
    });
  });

  describe('setUser', () => {
    it('should set user', () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const { setUser } = useUserStore.getState();
      setUser(mockUser);

      expect(useUserStore.getState().user).toEqual(mockUser);
    });

    it('should set user to null', () => {
      useUserStore.setState({
        user: {
          id: 'user-123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      });

      const { setUser } = useUserStore.getState();
      setUser(null);

      expect(useUserStore.getState().user).toBeNull();
    });
  });

  describe('setInitializing', () => {
    it('should set initializing to false', () => {
      const { setInitializing } = useUserStore.getState();
      setInitializing(false);

      expect(useUserStore.getState().initializing).toBe(false);
    });

    it('should set initializing to true', () => {
      useUserStore.setState({ initializing: false });

      const { setInitializing } = useUserStore.getState();
      setInitializing(true);

      expect(useUserStore.getState().initializing).toBe(true);
    });
  });
});
