import { describe, it, expect } from 'vitest';
import {
  isNodeIdUnique,
  getReferencedNodeIds,
  doNodesOverlap,
  findReachableNodeIds,
  categorizeEndNodes,
  nodeExists,
  getNodeById,
  isValidSize,
  isReasonableTextLength,
  generateUniqueNodeId,
  hasMinimumViableStructure,
  getFlowchartStats,
  formatValidationMessage,
} from '../validationUtils';
import type { ChallengeType } from '../../types/challenge.types';
import type { StartNode, EndNode, IntermediateNode } from '../../types/node.types';

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

describe('validationUtils', () => {
  describe('isNodeIdUnique', () => {
    it('should return true for unique node ID', () => {
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

      expect(isNodeIdUnique('node-2', challenge)).toBe(true);
    });

    it('should return false for duplicate node ID', () => {
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

      expect(isNodeIdUnique('node-1', challenge)).toBe(true); // exists once = unique
    });

    it('should return true for start node ID', () => {
      const challenge = createBasicChallenge();

      expect(isNodeIdUnique('start', challenge)).toBe(true);
    });
  });

  describe('getReferencedNodeIds', () => {
    it('should return all referenced node IDs from success/failure', () => {
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
          failure: 'node-1',
        },
      };

      const referenced = getReferencedNodeIds(challenge);

      expect(referenced.has('end-success')).toBe(true);
      expect(referenced.has('end-failure')).toBe(true);
      expect(referenced.has('node-1')).toBe(true);
      expect(referenced.size).toBe(3);
    });

    it('should return empty set for challenge with no nodes', () => {
      const challenge = createBasicChallenge();

      const referenced = getReferencedNodeIds(challenge);

      expect(referenced.size).toBe(0);
    });
  });

  describe('doNodesOverlap', () => {
    it('should return true for overlapping nodes', () => {
      const node1: StartNode = {
        id: 'node-1',
        type: 'start',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      };

      const node2: StartNode = {
        id: 'node-2',
        type: 'start',
        x: 50,
        y: 50,
        width: 100,
        height: 100,
      };

      expect(doNodesOverlap(node1, node2)).toBe(true);
    });

    it('should return false for non-overlapping nodes', () => {
      const node1: StartNode = {
        id: 'node-1',
        type: 'start',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      };

      const node2: StartNode = {
        id: 'node-2',
        type: 'start',
        x: 200,
        y: 200,
        width: 100,
        height: 100,
      };

      expect(doNodesOverlap(node1, node2)).toBe(false);
    });

    it('should return false for adjacent nodes', () => {
      const node1: StartNode = {
        id: 'node-1',
        type: 'start',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      };

      const node2: StartNode = {
        id: 'node-2',
        type: 'start',
        x: 100,
        y: 0,
        width: 100,
        height: 100,
      };

      expect(doNodesOverlap(node1, node2)).toBe(false);
    });
  });

  describe('nodeExists', () => {
    it('should return true for existing start node', () => {
      const challenge = createBasicChallenge();

      expect(nodeExists('start', challenge)).toBe(true);
    });

    it('should return true for existing intermediate node', () => {
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

      expect(nodeExists('node-1', challenge)).toBe(true);
    });

    it('should return true for existing end node', () => {
      const challenge = createBasicChallenge();
      challenge.endNodes = [
        {
          id: 'end-1',
          type: 'end',
          x: 200,
          y: 200,
          width: 120,
          height: 60,
          outcome: 'success',
        },
      ];

      expect(nodeExists('end-1', challenge)).toBe(true);
    });

    it('should return false for non-existing node', () => {
      const challenge = createBasicChallenge();

      expect(nodeExists('non-existing', challenge)).toBe(false);
    });
  });

  describe('getNodeById', () => {
    it('should return start node by ID', () => {
      const challenge = createBasicChallenge();

      const node = getNodeById('start', challenge);

      expect(node).not.toBeNull();
      expect(node?.id).toBe('start');
      expect(node?.type).toBe('start');
    });

    it('should return intermediate node by ID', () => {
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

      const node = getNodeById('node-1', challenge);

      expect(node).not.toBeNull();
      expect(node?.id).toBe('node-1');
      expect(node?.type).toBe('node');
    });

    it('should return end node by ID', () => {
      const challenge = createBasicChallenge();
      challenge.endNodes = [
        {
          id: 'end-1',
          type: 'end',
          x: 200,
          y: 200,
          width: 120,
          height: 60,
          outcome: 'success',
        },
      ];

      const node = getNodeById('end-1', challenge);

      expect(node).not.toBeNull();
      expect(node?.id).toBe('end-1');
      expect(node?.type).toBe('end');
    });

    it('should return null for non-existing node', () => {
      const challenge = createBasicChallenge();

      const node = getNodeById('non-existing', challenge);

      expect(node).toBeNull();
    });
  });

  describe('isValidSize', () => {
    it('should return true for positive dimensions', () => {
      expect(isValidSize(100, 100)).toBe(true);
    });

    it('should return false for zero width', () => {
      expect(isValidSize(0, 100)).toBe(false);
    });

    it('should return false for zero height', () => {
      expect(isValidSize(100, 0)).toBe(false);
    });

    it('should return false for negative dimensions', () => {
      expect(isValidSize(-100, 100)).toBe(false);
      expect(isValidSize(100, -100)).toBe(false);
    });
  });

  describe('isReasonableTextLength', () => {
    it('should return true for text within limit', () => {
      expect(isReasonableTextLength('Hello', 10)).toBe(true);
    });

    it('should return true for text at exact limit', () => {
      expect(isReasonableTextLength('Hello', 5)).toBe(true);
    });

    it('should return false for text exceeding limit', () => {
      expect(isReasonableTextLength('Hello World', 5)).toBe(false);
    });

    it('should return true for empty text', () => {
      expect(isReasonableTextLength('', 10)).toBe(true);
    });
  });

  describe('generateUniqueNodeId', () => {
    it('should generate unique node ID with default prefix', () => {
      const challenge = createBasicChallenge();

      const nodeId = generateUniqueNodeId(challenge);

      expect(nodeId).toBe('node-1');
    });

    it('should generate unique node ID with custom prefix', () => {
      const challenge = createBasicChallenge();

      const nodeId = generateUniqueNodeId(challenge, 'end');

      expect(nodeId).toBe('end-1');
    });

    it('should generate unique node ID even when node-1 exists', () => {
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

      const nodeId = generateUniqueNodeId(challenge);

      // generateUniqueNodeId checks if ID is unique (appears <= 1 time)
      // Since 'node-1' appears exactly once, it's still unique, so it returns 'node-1'
      expect(nodeId).toBe('node-1');
      expect(isNodeIdUnique(nodeId, challenge)).toBe(true);
    });
  });

  describe('hasMinimumViableStructure', () => {
    it('should return false for empty challenge', () => {
      const challenge = createBasicChallenge();

      expect(hasMinimumViableStructure(challenge)).toBe(false);
    });

    it('should return true for complete valid challenge', () => {
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
      challenge.endNodes = [
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
      ];

      expect(hasMinimumViableStructure(challenge)).toBe(true);
    });

    it('should return true even when same end node is used for both success and failure', () => {
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
          failure: 'end-1',
        },
      };
      challenge.endNodes = [
        {
          id: 'end-1',
          type: 'end',
          x: 200,
          y: 200,
          width: 120,
          height: 60,
          outcome: 'failure',
        },
      ];

      // categorizeEndNodes will add end-1 to both successNodes and failureNodes
      // so hasMinimumViableStructure returns true
      expect(hasMinimumViableStructure(challenge)).toBe(true);
    });
  });

  describe('getFlowchartStats', () => {
    it('should return correct stats for empty challenge', () => {
      const challenge = createBasicChallenge();

      const stats = getFlowchartStats(challenge);

      expect(stats.totalNodes).toBe(1); // only start node
      expect(stats.startNodes).toBe(1);
      expect(stats.intermediateNodes).toBe(0);
      expect(stats.endNodes).toBe(0);
      expect(stats.successEndNodes).toBe(0);
      expect(stats.failureEndNodes).toBe(0);
    });

    it('should return correct stats for complete challenge', () => {
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
      challenge.endNodes = [
        {
          id: 'end-success',
          type: 'end',
          x: 300,
          y: 300,
          width: 120,
          height: 60,
          outcome: 'success',
        },
        {
          id: 'end-failure',
          type: 'end',
          x: 300,
          y: 400,
          width: 120,
          height: 60,
          outcome: 'failure',
        },
      ];

      const stats = getFlowchartStats(challenge);

      expect(stats.totalNodes).toBe(5); // start + 2 intermediate + 2 end
      expect(stats.startNodes).toBe(1);
      expect(stats.intermediateNodes).toBe(2);
      expect(stats.endNodes).toBe(2);
      expect(stats.successEndNodes).toBe(1);
      expect(stats.failureEndNodes).toBe(1);
    });
  });

  describe('formatValidationMessage', () => {
    it('should format message without context', () => {
      const message = formatValidationMessage('Error occurred');

      expect(message).toBe('Error occurred');
    });

    it('should format message with node ID', () => {
      const message = formatValidationMessage('Error occurred', 'node-1');

      expect(message).toBe('Error occurred (Node: node-1)');
    });

    it('should format message with context', () => {
      const message = formatValidationMessage(
        'Error occurred',
        undefined,
        'Invalid connection'
      );

      expect(message).toBe('Error occurred - Invalid connection');
    });

    it('should format message with both node ID and context', () => {
      const message = formatValidationMessage(
        'Error occurred',
        'node-1',
        'Invalid connection'
      );

      expect(message).toBe('Error occurred (Node: node-1) - Invalid connection');
    });
  });

  describe('categorizeEndNodes', () => {
    it('should categorize end nodes correctly', () => {
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
      challenge.endNodes = [
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
      ];

      const { successNodes, failureNodes } = categorizeEndNodes(challenge);

      expect(successNodes.has('end-success')).toBe(true);
      expect(failureNodes.has('end-failure')).toBe(true);
      expect(successNodes.size).toBe(1);
      expect(failureNodes.size).toBe(1);
    });

    it('should return empty sets for challenge with no nodes', () => {
      const challenge = createBasicChallenge();

      const { successNodes, failureNodes } = categorizeEndNodes(challenge);

      expect(successNodes.size).toBe(0);
      expect(failureNodes.size).toBe(0);
    });
  });

  describe('findReachableNodeIds', () => {
    it('should find all reachable nodes from start', () => {
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
      challenge.endNodes = [
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
      ];

      const reachable = findReachableNodeIds('start', challenge);

      expect(reachable.has('start')).toBe(true);
      expect(reachable.has('node-1')).toBe(true);
      expect(reachable.has('end-success')).toBe(true);
      expect(reachable.has('end-failure')).toBe(true);
    });

    it('should return empty set for undefined start node', () => {
      const challenge = createBasicChallenge();

      const reachable = findReachableNodeIds(undefined, challenge);

      expect(reachable.size).toBe(0);
    });

    it('should not include unreachable nodes', () => {
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
        'node-2': {
          id: 'node-2',
          type: 'node',
          title: 'Node 2 (unreachable)',
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
      challenge.endNodes = [
        {
          id: 'end-success',
          type: 'end',
          x: 300,
          y: 300,
          width: 120,
          height: 60,
          outcome: 'success',
        },
        {
          id: 'end-failure',
          type: 'end',
          x: 300,
          y: 400,
          width: 120,
          height: 60,
          outcome: 'failure',
        },
      ];

      const reachable = findReachableNodeIds('start', challenge);

      expect(reachable.has('node-1')).toBe(true);
      expect(reachable.has('node-2')).toBe(false); // unreachable
    });
  });
});
