import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useChallenges } from '../useChallenges';
import { SupabaseAPI } from '../../service/api';
import type { ChallengeType } from '../../types/challenge.types';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock adventureStore
const mockSetAdventures = vi.fn();
vi.mock('../../../stores/adventureStore', () => ({
  useAdventureStore: vi.fn(() => ({
    setAdventures: mockSetAdventures,
  })),
}));

// Mock useAdventures
const mockGetUserAdventures = vi.fn();
vi.mock('../useAdventures', () => ({
  useAdventures: vi.fn(() => ({
    getUserAdventures: mockGetUserAdventures,
  })),
}));

// Mock SupabaseAPI
vi.mock('../../service/api', () => ({
  SupabaseAPI: {
    deleteAdventureChallenge: vi.fn(),
  },
}));

// Mock export functions
vi.mock('../../export', () => ({
  exportChallengeAsJSON: vi.fn(),
  validateChallengeForExport: vi.fn(() => ({ isValid: true, errors: [] })),
}));

// Mock toast
vi.mock('../../toast', () => ({
  challengeToasts: {
    exportSuccess: vi.fn(),
    exportError: vi.fn(),
  },
}));

const createMockChallenge = (id: string = 'challenge-123'): ChallengeType => ({
  id,
  title: 'Test Challenge',
  description: 'Test description',
  version: '1.0',
  tag: 'Draft',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  challengeStart: [],
  startNode: {
    id: 'start',
    type: 'start',
    x: 0,
    y: 0,
    width: 120,
    height: 60,
  },
  nodes: {},
  endNodes: [],
});

describe('useChallenges', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('deleteChallenge', () => {
    it('should delete challenge successfully', async () => {
      vi.mocked(SupabaseAPI.deleteAdventureChallenge).mockResolvedValue(undefined);
      mockGetUserAdventures.mockResolvedValue([]);

      const { result } = renderHook(() => useChallenges());

      await result.current.deleteChallenge('adventure-123', 'challenge-456');

      expect(SupabaseAPI.deleteAdventureChallenge).toHaveBeenCalledWith(
        'adventure-123',
        'challenge-456'
      );
      expect(mockGetUserAdventures).toHaveBeenCalled();
      expect(mockSetAdventures).toHaveBeenCalledWith([]);
    });

    it('should update adventures after deletion', async () => {
      vi.mocked(SupabaseAPI.deleteAdventureChallenge).mockResolvedValue(undefined);
      const mockAdventures = [
        {
          id: 'adv-1',
          title: 'Adventure 1',
          challenges: {},
        },
      ];
      mockGetUserAdventures.mockResolvedValue(mockAdventures);

      const { result } = renderHook(() => useChallenges());

      await result.current.deleteChallenge('adventure-123', 'challenge-456');

      expect(mockSetAdventures).toHaveBeenCalledWith(mockAdventures);
    });

    it('should throw error on deletion failure', async () => {
      const error = new Error('Delete failed');
      vi.mocked(SupabaseAPI.deleteAdventureChallenge).mockRejectedValue(error);

      const { result } = renderHook(() => useChallenges());

      await expect(
        result.current.deleteChallenge('adventure-123', 'challenge-456')
      ).rejects.toThrow('Delete failed');
    });
  });

  describe('navigateToChallenge', () => {
    it('should navigate to edit challenge with challengeId', () => {
      const { result } = renderHook(() => useChallenges());

      result.current.navigateToChallenge('adventure-123', 'challenge-456');

      expect(mockNavigate).toHaveBeenCalledWith(
        '/challenge/adventure-123/challenge-456'
      );
    });

    it('should navigate to create challenge without challengeId', () => {
      const { result } = renderHook(() => useChallenges());

      result.current.navigateToChallenge('adventure-123');

      expect(mockNavigate).toHaveBeenCalledWith('/challenge/adventure-123');
    });
  });

  describe('navigateToCreateNewChallenge', () => {
    it('should navigate to create new challenge', () => {
      const { result } = renderHook(() => useChallenges());

      result.current.navigateToCreateNewChallenge('adventure-123');

      expect(mockNavigate).toHaveBeenCalledWith('/challenge/adventure-123');
    });
  });

  describe('navigateToEditChallenge', () => {
    it('should navigate to edit challenge', () => {
      const { result } = renderHook(() => useChallenges());

      result.current.navigateToEditChallenge('adventure-123', 'challenge-456');

      expect(mockNavigate).toHaveBeenCalledWith(
        '/challenge/adventure-123/challenge-456'
      );
    });
  });

  describe('exportChallenge', () => {
    it('should call export function when valid', () => {
      const challenge = createMockChallenge();

      const { result } = renderHook(() => useChallenges());

      // Just verify it doesn't throw
      expect(() => result.current.exportChallenge(challenge)).not.toThrow();
    });
  });

  describe('multiple operations', () => {
    it('should handle sequential delete and navigate operations', async () => {
      vi.mocked(SupabaseAPI.deleteAdventureChallenge).mockResolvedValue(undefined);
      mockGetUserAdventures.mockResolvedValue([]);

      const { result } = renderHook(() => useChallenges());

      await result.current.deleteChallenge('adv-1', 'ch-1');
      result.current.navigateToCreateNewChallenge('adv-1');

      expect(SupabaseAPI.deleteAdventureChallenge).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/challenge/adv-1');
    });

    it('should handle multiple navigations', () => {
      const { result } = renderHook(() => useChallenges());

      result.current.navigateToEditChallenge('adv-1', 'ch-1');
      result.current.navigateToEditChallenge('adv-2', 'ch-2');

      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenNthCalledWith(
        1,
        '/challenge/adv-1/ch-1'
      );
      expect(mockNavigate).toHaveBeenNthCalledWith(
        2,
        '/challenge/adv-2/ch-2'
      );
    });
  });

  describe('edge cases', () => {
    it('should handle empty adventure ID', () => {
      const { result } = renderHook(() => useChallenges());

      result.current.navigateToChallenge('', 'challenge-123');

      expect(mockNavigate).toHaveBeenCalledWith('/challenge//challenge-123');
    });

    it('should handle special characters in IDs', () => {
      const { result } = renderHook(() => useChallenges());

      result.current.navigateToChallenge('adv-123@#$', 'ch-456!@');

      expect(mockNavigate).toHaveBeenCalledWith(
        '/challenge/adv-123@#$/ch-456!@'
      );
    });
  });
});
