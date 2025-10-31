import { describe, it, expect } from 'vitest';
import { validateFlowchart } from '../flowchartValidation';
import type { ChallengeType } from '../../types/challenge.types';

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

describe('flowchartValidation', () => {
  describe('Basic structure validation', () => {
    it('should fail validation for challenge with no nodes and no end nodes', () => {
      const challenge = createBasicChallenge();
      const result = validateFlowchart(challenge);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should fail validation for challenge with nodes but no end nodes', () => {
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
          failure: 'node-1',
        },
      };

      const result = validateFlowchart(challenge);

      expect(result.isValid).toBe(false);
      // Should have error about missing end nodes
      expect(result.errors.some(e =>
        e.message.toLowerCase().includes('end') ||
        e.message.toLowerCase().includes('success') ||
        e.message.toLowerCase().includes('fail')
      )).toBe(true);
    });

    it('should validate a valid simple flowchart', () => {
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

      // Add _startNodeTarget metadata
      (challenge as ChallengeType & { _startNodeTarget?: string })._startNodeTarget = 'node-1';

      const result = validateFlowchart(challenge);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Node connections validation', () => {
    it('should detect invalid success target', () => {
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
          success: 'invalid-node', // Invalid target
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
      (challenge as ChallengeType & { _startNodeTarget?: string })._startNodeTarget = 'node-1';

      const result = validateFlowchart(challenge);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.toLowerCase().includes('success'))).toBe(true);
    });

    it('should detect invalid failure target', () => {
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
          failure: 'invalid-node', // Invalid target
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
          outcome: 'success',
        },
      ];
      (challenge as ChallengeType & { _startNodeTarget?: string })._startNodeTarget = 'node-1';

      const result = validateFlowchart(challenge);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.toLowerCase().includes('failure'))).toBe(true);
    });

    it('should handle RESTART (self-reference) for failure', () => {
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
      (challenge as ChallengeType & { _startNodeTarget?: string })._startNodeTarget = 'node-1';

      const result = validateFlowchart(challenge);

      // RESTART (self-reference) should not cause invalid target errors
      const hasInvalidTargetError = result.errors.some((e) =>
        e.message.toLowerCase().includes('invalid') &&
        e.message.toLowerCase().includes('failure')
      );
      expect(hasInvalidTargetError).toBe(false);
    });
  });

  describe('End nodes validation', () => {
    it('should fail when there is no success end node', () => {
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
          failure: 'node-1',
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
          outcome: 'failure', // Only failure end node
        },
      ];
      (challenge as ChallengeType & { _startNodeTarget?: string })._startNodeTarget = 'node-1';

      const result = validateFlowchart(challenge);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) =>
          e.message.toLowerCase().includes('success')
        )
      ).toBe(true);
    });

    it('should pass when there are both success and failure end nodes', () => {
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
      (challenge as ChallengeType & { _startNodeTarget?: string })._startNodeTarget = 'node-1';

      const result = validateFlowchart(challenge);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
