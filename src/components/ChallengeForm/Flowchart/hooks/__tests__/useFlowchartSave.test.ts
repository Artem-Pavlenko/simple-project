import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFlowchartSave } from '../useFlowchartSave';
import type { Node, Edge } from '@xyflow/react';
import type { ChallengeType } from '../../../../../utils/types/challenge.types';
import type { AdventureType } from '../../../../../utils/types/adventure.types';

// Mock toast
vi.mock('../../../../../utils/toast', () => ({
  challengeToasts: {
    saveSuccess: vi.fn(),
    saveError: vi.fn(),
    tagChangedToDraft: vi.fn(),
  },
}));

// Mock flowchart validation
vi.mock('../../../../../utils/validation/flowchartValidation', () => ({
  validateFlowchart: vi.fn(() => ({ isValid: true, errors: [] })),
}));

const createMockChallenge = (): ChallengeType => ({
  id: 'challenge-123',
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
  ],
});

const createMockAdventure = (): AdventureType => ({
  id: 'adventure-123',
  title: 'Test Adventure',
  description: 'Test',
  version: '1.0',
  tag: 'Draft',
  input_aliasing: {
    enabled: false,
    aliases: {},
  },
  assets: {
    matImage: '',
    audioFiles: [],
  },
  challengeSelectionSettings: {
    mode: 'sequential',
    challenges: [],
  },
  challenges: {
    'challenge-123': createMockChallenge(),
  },
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
});

const createMockFlowNodes = (): Node[] => [
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
      nodeData: {
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
    style: {
      width: 120,
      height: 60,
    },
  },
];

const createMockFlowEdges = (): Edge[] => [
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
];

describe('useFlowchartSave', () => {
  let mockOnUpdateAdventure: ReturnType<typeof vi.fn>;
  let mockSetHasUnsavedChanges: ReturnType<typeof vi.fn>;
  let mockSetSelectedNodeId: ReturnType<typeof vi.fn>;
  let mockSaveVersionToHistory: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnUpdateAdventure = vi.fn().mockResolvedValue(undefined);
    mockSetHasUnsavedChanges = vi.fn();
    mockSetSelectedNodeId = vi.fn();
    mockSaveVersionToHistory = vi.fn();
  });

  describe('initialization', () => {
    it('should initialize with isSaving as false', () => {
      const { result } = renderHook(() =>
        useFlowchartSave({
          challenge: createMockChallenge(),
          adventure: createMockAdventure(),
          onUpdateAdventure: mockOnUpdateAdventure,
          flowNodes: createMockFlowNodes(),
          flowEdges: createMockFlowEdges(),
          hasUnsavedChanges: false,
          setHasUnsavedChanges: mockSetHasUnsavedChanges,
          setSelectedNodeId: mockSetSelectedNodeId,
        })
      );

      expect(result.current.isSaving).toBe(false);
    });
  });

  describe('handleSaveChanges', () => {
    it('should save changes successfully', async () => {
      const { result } = renderHook(() =>
        useFlowchartSave({
          challenge: createMockChallenge(),
          adventure: createMockAdventure(),
          onUpdateAdventure: mockOnUpdateAdventure,
          flowNodes: createMockFlowNodes(),
          flowEdges: createMockFlowEdges(),
          hasUnsavedChanges: true,
          setHasUnsavedChanges: mockSetHasUnsavedChanges,
          setSelectedNodeId: mockSetSelectedNodeId,
        })
      );

      await act(async () => {
        await result.current.handleSaveChanges(false);
      });

      expect(mockOnUpdateAdventure).toHaveBeenCalled();
      expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(false);
    });

    it('should not save if no unsaved changes', async () => {
      const { result } = renderHook(() =>
        useFlowchartSave({
          challenge: createMockChallenge(),
          adventure: createMockAdventure(),
          onUpdateAdventure: mockOnUpdateAdventure,
          flowNodes: createMockFlowNodes(),
          flowEdges: createMockFlowEdges(),
          hasUnsavedChanges: false,
          setHasUnsavedChanges: mockSetHasUnsavedChanges,
          setSelectedNodeId: mockSetSelectedNodeId,
        })
      );

      await act(async () => {
        await result.current.handleSaveChanges(false);
      });

      expect(mockOnUpdateAdventure).not.toHaveBeenCalled();
    });

    it('should not save if adventure is null', async () => {
      const { result } = renderHook(() =>
        useFlowchartSave({
          challenge: createMockChallenge(),
          adventure: undefined,
          onUpdateAdventure: mockOnUpdateAdventure,
          flowNodes: createMockFlowNodes(),
          flowEdges: createMockFlowEdges(),
          hasUnsavedChanges: true,
          setHasUnsavedChanges: mockSetHasUnsavedChanges,
          setSelectedNodeId: mockSetSelectedNodeId,
        })
      );

      await act(async () => {
        await result.current.handleSaveChanges(false);
      });

      expect(mockOnUpdateAdventure).not.toHaveBeenCalled();
    });

    it('should not save if challenge is null', async () => {
      const { result } = renderHook(() =>
        useFlowchartSave({
          challenge: null,
          adventure: createMockAdventure(),
          onUpdateAdventure: mockOnUpdateAdventure,
          flowNodes: createMockFlowNodes(),
          flowEdges: createMockFlowEdges(),
          hasUnsavedChanges: true,
          setHasUnsavedChanges: mockSetHasUnsavedChanges,
          setSelectedNodeId: mockSetSelectedNodeId,
        })
      );

      await act(async () => {
        await result.current.handleSaveChanges(false);
      });

      expect(mockOnUpdateAdventure).not.toHaveBeenCalled();
    });

    it('should close node editor on manual save', async () => {
      const { result } = renderHook(() =>
        useFlowchartSave({
          challenge: createMockChallenge(),
          adventure: createMockAdventure(),
          onUpdateAdventure: mockOnUpdateAdventure,
          flowNodes: createMockFlowNodes(),
          flowEdges: createMockFlowEdges(),
          hasUnsavedChanges: true,
          setHasUnsavedChanges: mockSetHasUnsavedChanges,
          setSelectedNodeId: mockSetSelectedNodeId,
        })
      );

      await act(async () => {
        await result.current.handleSaveChanges(false);
      });

      expect(mockSetSelectedNodeId).toHaveBeenCalledWith(null);
    });

    it('should not close node editor on autosave', async () => {
      const { result } = renderHook(() =>
        useFlowchartSave({
          challenge: createMockChallenge(),
          adventure: createMockAdventure(),
          onUpdateAdventure: mockOnUpdateAdventure,
          flowNodes: createMockFlowNodes(),
          flowEdges: createMockFlowEdges(),
          hasUnsavedChanges: true,
          setHasUnsavedChanges: mockSetHasUnsavedChanges,
          setSelectedNodeId: mockSetSelectedNodeId,
        })
      );

      await act(async () => {
        await result.current.handleSaveChanges(true);
      });

      expect(mockSetSelectedNodeId).not.toHaveBeenCalled();
    });

    it('should update start node coordinates', async () => {
      const { result } = renderHook(() =>
        useFlowchartSave({
          challenge: createMockChallenge(),
          adventure: createMockAdventure(),
          onUpdateAdventure: mockOnUpdateAdventure,
          flowNodes: createMockFlowNodes(),
          flowEdges: createMockFlowEdges(),
          hasUnsavedChanges: true,
          setHasUnsavedChanges: mockSetHasUnsavedChanges,
          setSelectedNodeId: mockSetSelectedNodeId,
        })
      );

      await act(async () => {
        await result.current.handleSaveChanges(false);
      });

      const updatedAdventure = mockOnUpdateAdventure.mock.calls[0][0];
      const updatedChallenge = updatedAdventure.challenges['challenge-123'];

      expect(updatedChallenge.startNode.x).toBe(10);
      expect(updatedChallenge.startNode.y).toBe(20);
    });

    it('should update node positions and labels', async () => {
      const { result } = renderHook(() =>
        useFlowchartSave({
          challenge: createMockChallenge(),
          adventure: createMockAdventure(),
          onUpdateAdventure: mockOnUpdateAdventure,
          flowNodes: createMockFlowNodes(),
          flowEdges: createMockFlowEdges(),
          hasUnsavedChanges: true,
          setHasUnsavedChanges: mockSetHasUnsavedChanges,
          setSelectedNodeId: mockSetSelectedNodeId,
        })
      );

      await act(async () => {
        await result.current.handleSaveChanges(false);
      });

      const updatedAdventure = mockOnUpdateAdventure.mock.calls[0][0];
      const updatedChallenge = updatedAdventure.challenges['challenge-123'];

      expect(updatedChallenge.nodes['node-1'].x).toBe(150);
      expect(updatedChallenge.nodes['node-1'].y).toBe(150);
      expect(updatedChallenge.nodes['node-1'].title).toBe('Updated Node 1');
    });

    it('should update end node coordinates', async () => {
      const { result } = renderHook(() =>
        useFlowchartSave({
          challenge: createMockChallenge(),
          adventure: createMockAdventure(),
          onUpdateAdventure: mockOnUpdateAdventure,
          flowNodes: createMockFlowNodes(),
          flowEdges: createMockFlowEdges(),
          hasUnsavedChanges: true,
          setHasUnsavedChanges: mockSetHasUnsavedChanges,
          setSelectedNodeId: mockSetSelectedNodeId,
        })
      );

      await act(async () => {
        await result.current.handleSaveChanges(false);
      });

      const updatedAdventure = mockOnUpdateAdventure.mock.calls[0][0];
      const updatedChallenge = updatedAdventure.challenges['challenge-123'];

      expect(updatedChallenge.endNodes[0].x).toBe(250);
      expect(updatedChallenge.endNodes[0].y).toBe(250);
    });

    it('should preserve _startNodeTarget metadata', async () => {
      const { result } = renderHook(() =>
        useFlowchartSave({
          challenge: createMockChallenge(),
          adventure: createMockAdventure(),
          onUpdateAdventure: mockOnUpdateAdventure,
          flowNodes: createMockFlowNodes(),
          flowEdges: createMockFlowEdges(),
          hasUnsavedChanges: true,
          setHasUnsavedChanges: mockSetHasUnsavedChanges,
          setSelectedNodeId: mockSetSelectedNodeId,
        })
      );

      await act(async () => {
        await result.current.handleSaveChanges(false);
      });

      const updatedAdventure = mockOnUpdateAdventure.mock.calls[0][0];
      const updatedChallenge = updatedAdventure.challenges['challenge-123'];

      expect((updatedChallenge as any)._startNodeTarget).toBe('node-1');
    });

    it('should save version to history after successful save', async () => {
      const { result } = renderHook(() =>
        useFlowchartSave({
          challenge: createMockChallenge(),
          adventure: createMockAdventure(),
          onUpdateAdventure: mockOnUpdateAdventure,
          flowNodes: createMockFlowNodes(),
          flowEdges: createMockFlowEdges(),
          hasUnsavedChanges: true,
          setHasUnsavedChanges: mockSetHasUnsavedChanges,
          setSelectedNodeId: mockSetSelectedNodeId,
          saveVersionToHistory: mockSaveVersionToHistory,
        })
      );

      await act(async () => {
        await result.current.handleSaveChanges(false);
      });

      expect(mockSaveVersionToHistory).toHaveBeenCalled();
    });

    it('should save successfully on autosave', async () => {
      const { result } = renderHook(() =>
        useFlowchartSave({
          challenge: createMockChallenge(),
          adventure: createMockAdventure(),
          onUpdateAdventure: mockOnUpdateAdventure,
          flowNodes: createMockFlowNodes(),
          flowEdges: createMockFlowEdges(),
          hasUnsavedChanges: true,
          setHasUnsavedChanges: mockSetHasUnsavedChanges,
          setSelectedNodeId: mockSetSelectedNodeId,
        })
      );

      await act(async () => {
        await result.current.handleSaveChanges(true);
      });

      expect(mockOnUpdateAdventure).toHaveBeenCalled();
    });

    it('should set isSaving during save operation', async () => {
      const { result } = renderHook(() =>
        useFlowchartSave({
          challenge: createMockChallenge(),
          adventure: createMockAdventure(),
          onUpdateAdventure: mockOnUpdateAdventure,
          flowNodes: createMockFlowNodes(),
          flowEdges: createMockFlowEdges(),
          hasUnsavedChanges: true,
          setHasUnsavedChanges: mockSetHasUnsavedChanges,
          setSelectedNodeId: mockSetSelectedNodeId,
        })
      );

      const savePromise = act(async () => {
        await result.current.handleSaveChanges(false);
      });

      await savePromise;

      expect(result.current.isSaving).toBe(false);
    });
  });

  describe('node ordering', () => {
    it('should reorder nodes with first node first', async () => {
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
            nodeData: {
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
              failure: 'end-1',
            },
          },
        },
        {
          id: 'node-2',
          type: 'node',
          position: { x: 200, y: 200 },
          data: {
            type: 'node',
            label: 'Node 2',
            nodeData: {
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
              failure: 'end-1',
            },
          },
        },
      ];

      const flowEdges: Edge[] = [
        {
          id: 'e-start-node-2',
          source: 'start',
          target: 'node-2',
        },
      ];

      const challenge = createMockChallenge();
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
          failure: 'end-1',
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
          failure: 'end-1',
        },
      };

      const { result } = renderHook(() =>
        useFlowchartSave({
          challenge,
          adventure: createMockAdventure(),
          onUpdateAdventure: mockOnUpdateAdventure,
          flowNodes,
          flowEdges,
          hasUnsavedChanges: true,
          setHasUnsavedChanges: mockSetHasUnsavedChanges,
          setSelectedNodeId: mockSetSelectedNodeId,
        })
      );

      await act(async () => {
        await result.current.handleSaveChanges(false);
      });

      const updatedAdventure = mockOnUpdateAdventure.mock.calls[0][0];
      const updatedChallenge = updatedAdventure.challenges['challenge-123'];
      const nodeKeys = Object.keys(updatedChallenge.nodes);

      expect(nodeKeys[0]).toBe('node-2');
    });
  });
});
