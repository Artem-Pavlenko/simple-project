/**
 * Type helpers for mocking Supabase responses in tests
 *
 * These helpers allow creating mock responses with proper typing
 * while being flexible enough for testing various scenarios.
 */

import type { PostgrestSingleResponse } from '@supabase/postgrest-js';
import type { User, Session, AuthResponse } from '@supabase/supabase-js';

// Simple utility type to allow any object shape in mocks
export type MockSupabaseResponse<T = unknown> = {
  data: T;
  error: Error | null;
};

// Helper functions to create typed mock responses
export const createMockAuthResponse = (
  user: User | null = null,
  session: Session | null = null,
  error: Error | null = null
): AuthResponse => ({
  data: { user, session },
  error,
} as AuthResponse);

export const createMockUserResponse = (
  user: User | null = null,
  error: Error | null = null
): MockSupabaseResponse<{ user: User | null }> => ({
  data: { user },
  error,
});

export const createMockSessionResponse = (
  session: Session | null = null,
  error: Error | null = null
): MockSupabaseResponse<{ session: Session | null }> => ({
  data: { session },
  error,
});

export const createMockPostgrestResponse = <T = unknown>(
  data: T | null = null,
  error: Error | null = null
): PostgrestSingleResponse<T> => ({
  data,
  error,
  count: null,
  status: 200,
  statusText: 'OK',
} as PostgrestSingleResponse<T>);

export const createMockPostgrestArrayResponse = <T = unknown>(
  data: T[] | null = null,
  error: Error | null = null
): PostgrestSingleResponse<T[]> => ({
  data,
  error,
  count: null,
  status: 200,
  statusText: 'OK',
} as PostgrestSingleResponse<T[]>);
