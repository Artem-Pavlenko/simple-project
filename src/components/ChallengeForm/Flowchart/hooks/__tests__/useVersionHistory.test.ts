import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVersionHistory } from '../useVersionHistory';
import type { ChallengeType } from '../../../../../utils/types/challenge.types';

const mockChallenge: ChallengeType = {
  id: 'test-challenge-1',
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
    x: 100,
    y: 100,
    width: 120,
    height: 60,
  },
  nodes: {
    'node-1': {
      id: 'node-1',
      type: 'node',
      title: 'Node 1',
      description: 'Test node',
      x: 200,
      y: 200,
      width: 180,
      height: 80,
      entryEffects: [],
      exitEffects: [],
      timeOut: null,
      events: [],
      success: 'end-1',
      failure: 'end-2',
    },
  },
  endNodes: [
    {
      id: 'end-1',
      type: 'end',
      x: 300,
      y: 300,
      width: 120,
      height: 60,
      outcome: 'success',
    },
  ],
};

describe('useVersionHistory', () => {
  beforeEach(() => {
    // No mocks to clear for this test
  });

  it('should initialize with empty versions array', () => {
    const { result } = renderHook(() => useVersionHistory('test-challenge-1'));

    expect(result.current.versions).toEqual([]);
  });

  it('should save a version', () => {
    const { result } = renderHook(() => useVersionHistory('test-challenge-1'));

    act(() => {
      result.current.saveVersion(mockChallenge, false);
    });

    expect(result.current.versions).toHaveLength(1);
    expect(result.current.versions[0].challengeId).toBe('test-challenge-1');
    expect(result.current.versions[0].isAutosave).toBe(false);
    expect(result.current.versions[0].challenge.id).toBe('test-challenge-1');
  });

  it('should save multiple versions', () => {
    const { result } = renderHook(() => useVersionHistory('test-challenge-1'));

    act(() => {
      result.current.saveVersion(mockChallenge, false);
    });

    act(() => {
      result.current.saveVersion(
        { ...mockChallenge, title: 'Updated Challenge' },
        true
      );
    });

    expect(result.current.versions).toHaveLength(2);
    expect(result.current.versions[0].challenge.title).toBe('Updated Challenge');
    expect(result.current.versions[0].isAutosave).toBe(true);
    expect(result.current.versions[1].challenge.title).toBe('Test Challenge');
    expect(result.current.versions[1].isAutosave).toBe(false);
  });

  it('should keep maximum 20 versions', () => {
    const { result } = renderHook(() => useVersionHistory('test-challenge-1'));

    // Add 25 versions
    act(() => {
      for (let i = 0; i < 25; i++) {
        result.current.saveVersion(
          { ...mockChallenge, title: `Challenge ${i}` },
          true
        );
      }
    });

    // Should only keep the 20 most recent
    expect(result.current.versions).toHaveLength(20);
    expect(result.current.versions[0].challenge.title).toBe('Challenge 24');
    expect(result.current.versions[19].challenge.title).toBe('Challenge 5');
  });

  it('should clear all versions', () => {
    const { result } = renderHook(() => useVersionHistory('test-challenge-1'));

    act(() => {
      result.current.saveVersion(mockChallenge, false);
      result.current.saveVersion(mockChallenge, true);
    });

    expect(result.current.versions).toHaveLength(2);

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.versions).toHaveLength(0);
  });

  it('should delete a specific version', () => {
    const { result } = renderHook(() => useVersionHistory('test-challenge-1'));

    act(() => {
      result.current.saveVersion(mockChallenge, false);
      result.current.saveVersion(
        { ...mockChallenge, title: 'Version 2' },
        false
      );
      result.current.saveVersion(
        { ...mockChallenge, title: 'Version 3' },
        false
      );
    });

    expect(result.current.versions).toHaveLength(3);

    const versionToDelete = result.current.versions[1].id;

    act(() => {
      result.current.deleteVersion(versionToDelete);
    });

    expect(result.current.versions).toHaveLength(2);
    expect(result.current.versions[0].challenge.title).toBe('Version 3');
    expect(result.current.versions[1].challenge.title).toBe('Test Challenge');
  });

  it('should create deep copies of challenges', () => {
    const { result } = renderHook(() => useVersionHistory('test-challenge-1'));

    const originalChallenge = { ...mockChallenge };

    act(() => {
      result.current.saveVersion(originalChallenge, false);
    });

    // Modify original challenge
    originalChallenge.title = 'Modified Title';
    originalChallenge.nodes['node-1'].title = 'Modified Node';

    // Saved version should not be affected
    expect(result.current.versions[0].challenge.title).toBe('Test Challenge');
    expect(result.current.versions[0].challenge.nodes['node-1'].title).toBe(
      'Node 1'
    );
  });

  it('should not save version if challengeId is undefined', () => {
    const { result } = renderHook(() => useVersionHistory(undefined));

    act(() => {
      result.current.saveVersion(mockChallenge, false);
    });

    expect(result.current.versions).toHaveLength(0);
  });
});
