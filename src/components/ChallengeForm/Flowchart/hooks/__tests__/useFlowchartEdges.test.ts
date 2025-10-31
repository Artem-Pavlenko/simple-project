import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFlowchartEdges } from '../useFlowchartEdges';
import type { ChallengeType } from '../../../../../utils/types/challenge.types';

const createBasicChallenge = (): ChallengeType => ({
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
  nodes: {},
  endNodes: [],
});

describe('useFlowchartEdges', () => {
  it('should return empty array for null challenge', () => {
    const { result } = renderHook(() => useFlowchartEdges(null));

    expect(result.current).toEqual([]);
  });

  it('should return empty array for undefined challenge', () => {
    const { result } = renderHook(() => useFlowchartEdges(undefined));

    expect(result.current).toEqual([]);
  });

  it('should return empty array for challenge with no nodes', () => {
    const challenge = createBasicChallenge();

    const { result } = renderHook(() => useFlowchartEdges(challenge));

    expect(result.current).toEqual([]);
  });

  it('should create edge from start to first intermediate node', () => {
    const challenge = createBasicChallenge();
    challenge.nodes = {
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
        success: 'end-1',
        failure: 'end-2',
      },
    };

    const { result } = renderHook(() => useFlowchartEdges(challenge));

    expect(result.current).toHaveLength(3); // start->node-1, node-1->success, node-1->failure

    const startEdge = result.current.find((e) => e.id === 'e-start-node-1');
    expect(startEdge).toBeDefined();
    expect(startEdge?.source).toBe('start');
    expect(startEdge?.target).toBe('node-1');
  });

  it('should use _startNodeTarget if available', () => {
    const challenge = createBasicChallenge();
    challenge.nodes = {
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
        success: 'end-1',
        failure: 'end-2',
      },
      'node-2': {
        id: 'node-2',
        type: 'node',
        title: 'Node 2',
        description: '',
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
    };

    // Set _startNodeTarget to node-2
    (challenge as ChallengeType & { _startNodeTarget?: string })._startNodeTarget = 'node-2';

    const { result } = renderHook(() => useFlowchartEdges(challenge));

    const startEdge = result.current.find((e) => e.source === 'start');
    expect(startEdge).toBeDefined();
    expect(startEdge?.target).toBe('node-2');
  });

  it('should create success edges for intermediate nodes', () => {
    const challenge = createBasicChallenge();
    challenge.nodes = {
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
    };

    const { result } = renderHook(() => useFlowchartEdges(challenge));

    const successEdge = result.current.find(
      (e) => e.id === 'e-node-1-success-end-success'
    );
    expect(successEdge).toBeDefined();
    expect(successEdge?.source).toBe('node-1');
    expect(successEdge?.target).toBe('end-success');
    expect(successEdge?.sourceHandle).toBe('success');
    expect(successEdge?.label).toBe('Success');
    expect(successEdge?.style?.stroke).toBe('#22c55e');
  });

  it('should create failure edges for intermediate nodes', () => {
    const challenge = createBasicChallenge();
    challenge.nodes = {
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
    };

    const { result } = renderHook(() => useFlowchartEdges(challenge));

    const failureEdge = result.current.find(
      (e) => e.id === 'e-node-1-failure-end-failure'
    );
    expect(failureEdge).toBeDefined();
    expect(failureEdge?.source).toBe('node-1');
    expect(failureEdge?.target).toBe('end-failure');
    expect(failureEdge?.sourceHandle).toBe('failure');
    expect(failureEdge?.label).toBe('Failure');
    expect(failureEdge?.style?.stroke).toBe('#ef4444');
  });

  it('should not create edge for self-reference success (RESTART)', () => {
    const challenge = createBasicChallenge();
    challenge.nodes = {
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
        success: 'node-1', // RESTART - self reference
        failure: 'end-failure',
      },
    };

    const { result } = renderHook(() => useFlowchartEdges(challenge));

    const selfReferenceEdge = result.current.find(
      (e) => e.id === 'e-node-1-success-node-1'
    );
    expect(selfReferenceEdge).toBeUndefined();
  });

  it('should not create edge for self-reference failure (RESTART)', () => {
    const challenge = createBasicChallenge();
    challenge.nodes = {
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
        failure: 'node-1', // RESTART - self reference
      },
    };

    const { result } = renderHook(() => useFlowchartEdges(challenge));

    const selfReferenceEdge = result.current.find(
      (e) => e.id === 'e-node-1-failure-node-1'
    );
    expect(selfReferenceEdge).toBeUndefined();
  });

  it('should create edges for multiple intermediate nodes', () => {
    const challenge = createBasicChallenge();
    challenge.nodes = {
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
        success: 'node-2',
        failure: 'end-failure',
      },
      'node-2': {
        id: 'node-2',
        type: 'node',
        title: 'Node 2',
        description: '',
        x: 200,
        y: 200,
        width: 180,
        height: 80,
        entryEffects: [],
        exitEffects: [],
        timeOut: null,
        events: [],
        success: 'end-success',
        failure: 'end-failure',
      },
    };

    const { result } = renderHook(() => useFlowchartEdges(challenge));

    // Should have: start->node-1, node-1->node-2, node-1->end-failure, node-2->end-success, node-2->end-failure
    expect(result.current.length).toBeGreaterThanOrEqual(5);

    // Check node-1 -> node-2 edge
    const node1ToNode2 = result.current.find(
      (e) => e.id === 'e-node-1-success-node-2'
    );
    expect(node1ToNode2).toBeDefined();
    expect(node1ToNode2?.source).toBe('node-1');
    expect(node1ToNode2?.target).toBe('node-2');
  });

  it('should update edges when challenge changes', () => {
    const challenge1 = createBasicChallenge();
    challenge1.nodes = {
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
        success: 'end-1',
        failure: 'end-2',
      },
    };

    const { result, rerender } = renderHook(
      ({ challenge }) => useFlowchartEdges(challenge),
      { initialProps: { challenge: challenge1 } }
    );

    const initialEdgeCount = result.current.length;

    // Update challenge with more nodes
    const challenge2 = createBasicChallenge();
    challenge2.nodes = {
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
        success: 'node-2',
        failure: 'end-2',
      },
      'node-2': {
        id: 'node-2',
        type: 'node',
        title: 'Node 2',
        description: '',
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
    };

    rerender({ challenge: challenge2 });

    expect(result.current.length).toBeGreaterThan(initialEdgeCount);
  });

  it('should have correct arrow styling for start edge', () => {
    const challenge = createBasicChallenge();
    challenge.nodes = {
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
        success: 'end-1',
        failure: 'end-2',
      },
    };

    const { result } = renderHook(() => useFlowchartEdges(challenge));

    const startEdge = result.current.find((e) => e.source === 'start');
    expect(startEdge?.style?.stroke).toBe('#3b82f6');
    expect(startEdge?.style?.strokeWidth).toBe(2);
    expect(startEdge?.markerEnd).toEqual({
      type: 'arrowclosed',
      color: '#3b82f6',
    });
  });

  it('should have correct arrow styling for success edge', () => {
    const challenge = createBasicChallenge();
    challenge.nodes = {
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
    };

    const { result } = renderHook(() => useFlowchartEdges(challenge));

    const successEdge = result.current.find((e) => e.sourceHandle === 'success');
    expect(successEdge?.style?.stroke).toBe('#22c55e');
    expect(successEdge?.style?.strokeWidth).toBe(2);
    expect(successEdge?.markerEnd).toEqual({
      type: 'arrowclosed',
      color: '#22c55e',
    });
  });

  it('should have correct arrow styling for failure edge', () => {
    const challenge = createBasicChallenge();
    challenge.nodes = {
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
    };

    const { result } = renderHook(() => useFlowchartEdges(challenge));

    const failureEdge = result.current.find((e) => e.sourceHandle === 'failure');
    expect(failureEdge?.style?.stroke).toBe('#ef4444');
    expect(failureEdge?.style?.strokeWidth).toBe(2);
    expect(failureEdge?.markerEnd).toEqual({
      type: 'arrowclosed',
      color: '#ef4444',
    });
  });
});
