import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFlowchartValidation } from '../useFlowchartValidation';
import type { ChallengeType } from '../../../../../utils/types/challenge.types';
import type { Node } from '@xyflow/react';

const createMockChallenge = (): ChallengeType => ({
  id: 'test-challenge',
  title: 'Test Challenge',
  description: 'Test',
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
  nodes: {
    'node-1': {
      id: 'node-1',
      type: 'node',
      title: 'Node 1',
      description: '',
      x: 100,
      y: 100,
      width: 180,
      height: 80,
      entryEffects: [],
      exitEffects: [],
      timeOut: null,
      events: [],
      success: 'end-success',
      failure: 'end-failure',
    },
  },
  endNodes: [
    {
      id: 'end-success',
      type: 'end',
      x: 200,
      y: 200,
      width: 120,
      height: 60,
      outcome: 'success',
    },
    {
      id: 'end-failure',
      type: 'end',
      x: 200,
      y: 300,
      width: 120,
      height: 60,
      outcome: 'failure',
    },
  ],
});

const createMockFlowNodes = (): Node[] => [
  {
    id: 'start',
    type: 'start',
    position: { x: 0, y: 0 },
    data: { type: 'start' },
  },
  {
    id: 'node-1',
    type: 'node',
    position: { x: 100, y: 100 },
    data: { type: 'node', label: 'Node 1' },
  },
];

describe('useFlowchartValidation', () => {
  it('should initialize with null validation result and hidden validation', () => {
    const buildCurrentChallenge = vi.fn(() => createMockChallenge());

    const { result } = renderHook(() =>
      useFlowchartValidation({
        buildCurrentChallenge,
        hasUnsavedChanges: false,
        flowNodes: createMockFlowNodes(),
      })
    );

    expect(result.current.validationResult).toBeNull();
    expect(result.current.showValidation).toBe(false);
  });

  it('should validate challenge on manual validation', () => {
    const buildCurrentChallenge = vi.fn(() => createMockChallenge());

    const { result } = renderHook(() =>
      useFlowchartValidation({
        buildCurrentChallenge,
        hasUnsavedChanges: false,
        flowNodes: createMockFlowNodes(),
      })
    );

    act(() => {
      result.current.handleValidate();
    });

    expect(buildCurrentChallenge).toHaveBeenCalled();
    expect(result.current.validationResult).not.toBeNull();
    expect(result.current.showValidation).toBe(true);
  });

  it('should return null validation result when challenge is null', () => {
    const buildCurrentChallenge = vi.fn(() => null);

    const { result } = renderHook(() =>
      useFlowchartValidation({
        buildCurrentChallenge,
        hasUnsavedChanges: false,
        flowNodes: createMockFlowNodes(),
      })
    );

    act(() => {
      result.current.handleValidate();
    });

    expect(result.current.validationResult).toBeNull();
  });

  it('should validate valid challenge correctly', () => {
    const validChallenge = createMockChallenge();
    (validChallenge as ChallengeType & { _startNodeTarget?: string })._startNodeTarget = 'node-1';
    const buildCurrentChallenge = vi.fn(() => validChallenge);

    const { result } = renderHook(() =>
      useFlowchartValidation({
        buildCurrentChallenge,
        hasUnsavedChanges: false,
        flowNodes: createMockFlowNodes(),
      })
    );

    act(() => {
      result.current.handleValidate();
    });

    expect(result.current.validationResult?.isValid).toBe(true);
    expect(result.current.validationResult?.errors).toHaveLength(0);
  });

  it('should validate invalid challenge correctly', () => {
    const invalidChallenge = createMockChallenge();
    invalidChallenge.nodes = {}; // No nodes
    invalidChallenge.endNodes = []; // No end nodes

    const buildCurrentChallenge = vi.fn(() => invalidChallenge);

    const { result } = renderHook(() =>
      useFlowchartValidation({
        buildCurrentChallenge,
        hasUnsavedChanges: false,
        flowNodes: createMockFlowNodes(),
      })
    );

    act(() => {
      result.current.handleValidate();
    });

    expect(result.current.validationResult?.isValid).toBe(false);
    expect(result.current.validationResult?.errors.length).toBeGreaterThan(0);
  });

  it('should automatically validate when hasUnsavedChanges is true', () => {
    const validChallenge = createMockChallenge();
    (validChallenge as ChallengeType & { _startNodeTarget?: string })._startNodeTarget = 'node-1';
    const buildCurrentChallenge = vi.fn(() => validChallenge);

    const { result } = renderHook(() =>
      useFlowchartValidation({
        buildCurrentChallenge,
        hasUnsavedChanges: true,
        flowNodes: createMockFlowNodes(),
      })
    );

    // Auto-validation happens in useEffect
    expect(result.current.validationResult).not.toBeNull();
  });

  it('should not automatically validate when hasUnsavedChanges is false', () => {
    const buildCurrentChallenge = vi.fn(() => createMockChallenge());

    const { result } = renderHook(() =>
      useFlowchartValidation({
        buildCurrentChallenge,
        hasUnsavedChanges: false,
        flowNodes: createMockFlowNodes(),
      })
    );

    // No auto-validation
    expect(result.current.validationResult).toBeNull();
  });

  it('should update validation when challenge changes', () => {
    const challenge1 = createMockChallenge();
    (challenge1 as ChallengeType & { _startNodeTarget?: string })._startNodeTarget = 'node-1';
    const buildCurrentChallenge = vi.fn(() => challenge1);

    const { result, rerender } = renderHook(
      ({ buildFn, hasChanges }) =>
        useFlowchartValidation({
          buildCurrentChallenge: buildFn,
          hasUnsavedChanges: hasChanges,
          flowNodes: createMockFlowNodes(),
        }),
      {
        initialProps: {
          buildFn: buildCurrentChallenge,
          hasChanges: true,
        },
      }
    );

    const initialResult = result.current.validationResult;

    // Update challenge to invalid
    const challenge2 = createMockChallenge();
    challenge2.nodes = {};
    challenge2.endNodes = [];
    const buildCurrentChallenge2 = vi.fn(() => challenge2);

    rerender({
      buildFn: buildCurrentChallenge2,
      hasChanges: true,
    });

    expect(result.current.validationResult).not.toBe(initialResult);
    expect(result.current.validationResult?.isValid).toBe(false);
  });

  it('should handle validation error click', () => {
    const buildCurrentChallenge = vi.fn(() => createMockChallenge());
    const flowNodes = createMockFlowNodes();

    const { result } = renderHook(() =>
      useFlowchartValidation({
        buildCurrentChallenge,
        hasUnsavedChanges: false,
        flowNodes,
      })
    );

    const nodeId = result.current.handleValidationErrorClick('node-1');

    expect(nodeId).toBe('node-1');
  });

  it('should handle validation error click for non-existing node', () => {
    const buildCurrentChallenge = vi.fn(() => createMockChallenge());
    const flowNodes = createMockFlowNodes();

    const { result } = renderHook(() =>
      useFlowchartValidation({
        buildCurrentChallenge,
        hasUnsavedChanges: false,
        flowNodes,
      })
    );

    const nodeId = result.current.handleValidationErrorClick('non-existing');

    expect(nodeId).toBe('non-existing');
  });

  it('should allow toggling showValidation', () => {
    const buildCurrentChallenge = vi.fn(() => createMockChallenge());

    const { result } = renderHook(() =>
      useFlowchartValidation({
        buildCurrentChallenge,
        hasUnsavedChanges: false,
        flowNodes: createMockFlowNodes(),
      })
    );

    expect(result.current.showValidation).toBe(false);

    act(() => {
      result.current.setShowValidation(true);
    });

    expect(result.current.showValidation).toBe(true);

    act(() => {
      result.current.setShowValidation(false);
    });

    expect(result.current.showValidation).toBe(false);
  });

  it('should re-validate when buildCurrentChallenge changes', () => {
    const challenge1 = createMockChallenge();
    (challenge1 as ChallengeType & { _startNodeTarget?: string })._startNodeTarget = 'node-1';
    const buildCurrentChallenge1 = vi.fn(() => challenge1);

    const { result, rerender } = renderHook(
      ({ buildFn }) =>
        useFlowchartValidation({
          buildCurrentChallenge: buildFn,
          hasUnsavedChanges: true,
          flowNodes: createMockFlowNodes(),
        }),
      {
        initialProps: {
          buildFn: buildCurrentChallenge1,
        },
      }
    );

    expect(result.current.validationResult?.isValid).toBe(true);

    // Change to different build function
    const challenge2 = createMockChallenge();
    challenge2.nodes = {};
    challenge2.endNodes = [];
    const buildCurrentChallenge2 = vi.fn(() => challenge2);

    rerender({ buildFn: buildCurrentChallenge2 });

    expect(result.current.validationResult?.isValid).toBe(false);
  });

  it('should handle multiple manual validations', () => {
    let callCount = 0;
    const buildCurrentChallenge = vi.fn(() => {
      callCount++;
      const challenge = createMockChallenge();
      (challenge as ChallengeType & { _startNodeTarget?: string })._startNodeTarget = 'node-1';
      return challenge;
    });

    const { result } = renderHook(() =>
      useFlowchartValidation({
        buildCurrentChallenge,
        hasUnsavedChanges: false,
        flowNodes: createMockFlowNodes(),
      })
    );

    const initialCallCount = callCount;

    act(() => {
      result.current.handleValidate();
    });

    expect(callCount).toBeGreaterThan(initialCallCount);
    expect(result.current.validationResult?.isValid).toBe(true);

    const afterFirstValidation = callCount;

    act(() => {
      result.current.handleValidate();
    });

    expect(callCount).toBeGreaterThan(afterFirstValidation);
    expect(result.current.validationResult?.isValid).toBe(true);
  });
});
