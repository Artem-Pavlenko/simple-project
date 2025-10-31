import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useChallengeBuilder } from '../useChallengeBuilder';
import type { ChallengeType } from '../../../../../utils/types/challenge.types';
import type { Node, Edge } from '@xyflow/react';

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

describe('useChallengeBuilder', () => {
  it('should return null when challenge is null', () => {
    const { result } = renderHook(() =>
      useChallengeBuilder(null, [], [])
    );

    const built = result.current.buildCurrentChallenge();

    expect(built).toBeNull();
  });

  it('should return null when challenge is undefined', () => {
    const { result } = renderHook(() =>
      useChallengeBuilder(undefined, [], [])
    );

    const built = result.current.buildCurrentChallenge();

    expect(built).toBeNull();
  });

  it('should build challenge from flowNodes', () => {
    const challenge = createBasicChallenge();
    const flowNodes: Node[] = [
      {
        id: 'start',
        type: 'start',
        position: { x: 10, y: 20 },
        data: { type: 'start' },
      },
      {
        id: 'node-1',
        type: 'node',
        position: { x: 150, y: 150 },
        data: {
          type: 'node',
          label: 'Updated Node 1',
          nodeData: challenge.nodes['node-1'],
        },
      },
      {
        id: 'end-success',
        type: 'end',
        position: { x: 250, y: 250 },
        data: {
          type: 'end',
          nodeData: {
            id: 'end-success',
            type: 'end',
            outcome: 'success',
            x: 250,
            y: 250,
            width: 120,
            height: 60,
          },
        },
      },
      {
        id: 'end-failure',
        type: 'end',
        position: { x: 250, y: 350 },
        data: {
          type: 'end',
          nodeData: {
            id: 'end-failure',
            type: 'end',
            outcome: 'failure',
            x: 250,
            y: 350,
            width: 120,
            height: 60,
          },
        },
      },
    ];

    const flowEdges: Edge[] = [
      {
        id: 'e-start-node-1',
        source: 'start',
        target: 'node-1',
      },
      {
        id: 'e-node-1-success',
        source: 'node-1',
        target: 'end-success',
        sourceHandle: 'success',
      },
      {
        id: 'e-node-1-failure',
        source: 'node-1',
        target: 'end-failure',
        sourceHandle: 'failure',
      },
    ];

    const { result } = renderHook(() =>
      useChallengeBuilder(challenge, flowNodes, flowEdges)
    );

    const built = result.current.buildCurrentChallenge();

    expect(built).not.toBeNull();
    expect(built?.startNode.x).toBe(10);
    expect(built?.startNode.y).toBe(20);
    expect(built?.nodes['node-1'].x).toBe(150);
    expect(built?.nodes['node-1'].y).toBe(150);
    expect(built?.nodes['node-1'].title).toBe('Updated Node 1');
    expect(built?.endNodes).toHaveLength(2);
  });

  it('should update start node coordinates', () => {
    const challenge = createBasicChallenge();
    const flowNodes: Node[] = [
      {
        id: 'start',
        type: 'start',
        position: { x: 50, y: 75 },
        data: { type: 'start' },
      },
    ];

    const { result } = renderHook(() =>
      useChallengeBuilder(challenge, flowNodes, [])
    );

    const built = result.current.buildCurrentChallenge();

    expect(built?.startNode.x).toBe(50);
    expect(built?.startNode.y).toBe(75);
  });

  it('should build intermediate nodes with updated positions', () => {
    const challenge = createBasicChallenge();
    const flowNodes: Node[] = [
      {
        id: 'node-1',
        type: 'node',
        position: { x: 300, y: 400 },
        data: {
          type: 'node',
          label: 'New Title',
          nodeData: challenge.nodes['node-1'],
        },
      },
    ];

    const flowEdges: Edge[] = [
      {
        id: 'e-node-1-success',
        source: 'node-1',
        target: 'end-success',
        sourceHandle: 'success',
      },
      {
        id: 'e-node-1-failure',
        source: 'node-1',
        target: 'end-failure',
        sourceHandle: 'failure',
      },
    ];

    const { result } = renderHook(() =>
      useChallengeBuilder(challenge, flowNodes, flowEdges)
    );

    const built = result.current.buildCurrentChallenge();

    expect(built?.nodes['node-1'].x).toBe(300);
    expect(built?.nodes['node-1'].y).toBe(400);
    expect(built?.nodes['node-1'].title).toBe('New Title');
    expect(built?.nodes['node-1'].success).toBe('end-success');
    expect(built?.nodes['node-1'].failure).toBe('end-failure');
  });

  it('should build end nodes from flowNodes', () => {
    const challenge = createBasicChallenge();
    const flowNodes: Node[] = [
      {
        id: 'end-success',
        type: 'end',
        position: { x: 400, y: 500 },
        data: {
          type: 'end',
          nodeData: {
            id: 'end-success',
            type: 'end',
            outcome: 'success',
            x: 400,
            y: 500,
            width: 120,
            height: 60,
          },
        },
        style: {
          width: 150,
          height: 80,
        },
      },
    ];

    const { result } = renderHook(() =>
      useChallengeBuilder(challenge, flowNodes, [])
    );

    const built = result.current.buildCurrentChallenge();

    expect(built?.endNodes).toHaveLength(1);
    expect(built?.endNodes[0].x).toBe(400);
    expect(built?.endNodes[0].y).toBe(500);
    expect(built?.endNodes[0].width).toBe(150);
    expect(built?.endNodes[0].height).toBe(80);
    expect(built?.endNodes[0].outcome).toBe('success');
  });

  it('should use edge targets for success and failure connections', () => {
    const challenge = createBasicChallenge();
    const flowNodes: Node[] = [
      {
        id: 'node-1',
        type: 'node',
        position: { x: 100, y: 100 },
        data: {
          type: 'node',
          label: 'Node 1',
          nodeData: challenge.nodes['node-1'],
        },
      },
    ];

    const flowEdges: Edge[] = [
      {
        id: 'e-node-1-success',
        source: 'node-1',
        target: 'new-success-target',
        sourceHandle: 'success',
      },
      {
        id: 'e-node-1-failure',
        source: 'node-1',
        target: 'new-failure-target',
        sourceHandle: 'failure',
      },
    ];

    const { result } = renderHook(() =>
      useChallengeBuilder(challenge, flowNodes, flowEdges)
    );

    const built = result.current.buildCurrentChallenge();

    expect(built?.nodes['node-1'].success).toBe('new-success-target');
    expect(built?.nodes['node-1'].failure).toBe('new-failure-target');
  });

  it('should fall back to nodeData for success/failure when no edge exists', () => {
    const challenge = createBasicChallenge();
    const flowNodes: Node[] = [
      {
        id: 'node-1',
        type: 'node',
        position: { x: 100, y: 100 },
        data: {
          type: 'node',
          label: 'Node 1',
          nodeData: challenge.nodes['node-1'],
        },
      },
    ];

    const flowEdges: Edge[] = []; // No edges

    const { result } = renderHook(() =>
      useChallengeBuilder(challenge, flowNodes, flowEdges)
    );

    const built = result.current.buildCurrentChallenge();

    // Should fall back to original nodeData values
    expect(built?.nodes['node-1'].success).toBe('end-success');
    expect(built?.nodes['node-1'].failure).toBe('end-failure');
  });

  it('should preserve _startNodeTarget metadata', () => {
    const challenge = createBasicChallenge();
    const flowNodes: Node[] = [
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
        data: {
          type: 'node',
          label: 'Node 1',
          nodeData: challenge.nodes['node-1'],
        },
      },
    ];

    const flowEdges: Edge[] = [
      {
        id: 'e-start-node-1',
        source: 'start',
        target: 'node-1',
      },
    ];

    const { result } = renderHook(() =>
      useChallengeBuilder(challenge, flowNodes, flowEdges)
    );

    const built = result.current.buildCurrentChallenge();

    expect((built as unknown as Record<string, unknown>)._startNodeTarget).toBe('node-1');
  });

  it('should reorder nodes with first node first', () => {
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

    const flowNodes: Node[] = [
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
        data: {
          type: 'node',
          label: 'Node 1',
          nodeData: challenge.nodes['node-1'],
        },
      },
      {
        id: 'node-2',
        type: 'node',
        position: { x: 200, y: 200 },
        data: {
          type: 'node',
          label: 'Node 2',
          nodeData: challenge.nodes['node-2'],
        },
      },
    ];

    const flowEdges: Edge[] = [
      {
        id: 'e-start-node-2',
        source: 'start',
        target: 'node-2', // Start connects to node-2
      },
    ];

    const { result } = renderHook(() =>
      useChallengeBuilder(challenge, flowNodes, flowEdges)
    );

    const built = result.current.buildCurrentChallenge();

    const nodeKeys = Object.keys(built?.nodes || {});
    expect(nodeKeys[0]).toBe('node-2'); // First node should be node-2
    expect(nodeKeys[1]).toBe('node-1');
  });

  it('should handle multiple end nodes', () => {
    const challenge = createBasicChallenge();
    const flowNodes: Node[] = [
      {
        id: 'end-1',
        type: 'end',
        position: { x: 100, y: 100 },
        data: {
          type: 'end',
          nodeData: {
            id: 'end-1',
            type: 'end',
            outcome: 'success',
            x: 100,
            y: 100,
            width: 120,
            height: 60,
          },
        },
      },
      {
        id: 'end-2',
        type: 'end',
        position: { x: 200, y: 200 },
        data: {
          type: 'end',
          nodeData: {
            id: 'end-2',
            type: 'end',
            outcome: 'failure',
            x: 200,
            y: 200,
            width: 120,
            height: 60,
          },
        },
      },
      {
        id: 'end-3',
        type: 'end',
        position: { x: 300, y: 300 },
        data: {
          type: 'end',
          nodeData: {
            id: 'end-3',
            type: 'end',
            outcome: 'success',
            x: 300,
            y: 300,
            width: 120,
            height: 60,
          },
        },
      },
    ];

    const { result } = renderHook(() =>
      useChallengeBuilder(challenge, flowNodes, [])
    );

    const built = result.current.buildCurrentChallenge();

    expect(built?.endNodes).toHaveLength(3);
    expect(built?.endNodes.map(n => n.id)).toEqual(['end-1', 'end-2', 'end-3']);
  });

  it('should update challenge when flowNodes change', () => {
    const challenge = createBasicChallenge();
    const initialFlowNodes: Node[] = [
      {
        id: 'start',
        type: 'start',
        position: { x: 0, y: 0 },
        data: { type: 'start' },
      },
    ];

    const { result, rerender } = renderHook(
      ({ nodes, edges }) => useChallengeBuilder(challenge, nodes, edges),
      {
        initialProps: {
          nodes: initialFlowNodes,
          edges: [] as Edge[],
        },
      }
    );

    const built1 = result.current.buildCurrentChallenge();
    expect(built1?.startNode.x).toBe(0);

    // Update flowNodes
    const updatedFlowNodes: Node[] = [
      {
        id: 'start',
        type: 'start',
        position: { x: 100, y: 200 },
        data: { type: 'start' },
      },
    ];

    rerender({ nodes: updatedFlowNodes, edges: [] });

    const built2 = result.current.buildCurrentChallenge();
    expect(built2?.startNode.x).toBe(100);
    expect(built2?.startNode.y).toBe(200);
  });

  it('should handle empty flowNodes array', () => {
    const challenge = createBasicChallenge();

    const { result } = renderHook(() =>
      useChallengeBuilder(challenge, [], [])
    );

    const built = result.current.buildCurrentChallenge();

    expect(built?.nodes).toEqual({});
    expect(built?.endNodes).toEqual([]);
    expect(built?.startNode).toEqual(challenge.startNode); // Unchanged
  });
});
