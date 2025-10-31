import { describe, it, expect } from 'vitest';
import {
  validateImportedChallenge,
  getChallengeImportFileSizeEstimate,
} from '../challengeImport';

describe('challengeImport', () => {
  describe('validateImportedChallenge', () => {
    it('should validate a valid challenge', () => {
      const validChallenge = {
        id: 'test-1',
        title: 'Test Challenge',
        description: 'A test challenge',
        version: '1.0',
        tag: 'Draft',
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
            success: 'end-1',
            failure: 'end-2',
          },
        },
        endNodes: [
          {
            id: 'end-1',
            type: 'end',
            x: 200,
            y: 200,
            width: 120,
            height: 60,
            outcome: 'success',
          },
        ],
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      };

      const result = validateImportedChallenge(validChallenge);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for null data', () => {
      const result = validateImportedChallenge(null);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Data must be an object');
    });

    it('should fail validation for non-object data', () => {
      const result = validateImportedChallenge('not an object');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Data must be an object');
    });

    it('should fail validation for missing id', () => {
      const invalidChallenge = {
        title: 'Test',
        description: 'Test',
        version: '1.0',
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
        endNodes: [{
          id: 'end-1',
          type: 'end',
          x: 0,
          y: 0,
          width: 120,
          height: 60,
          outcome: 'success',
        }],
      };

      const result = validateImportedChallenge(invalidChallenge);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('id'))).toBe(true);
    });

    it('should fail validation for missing title', () => {
      const invalidChallenge = {
        id: 'test-1',
        description: 'Test',
        version: '1.0',
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
        endNodes: [{
          id: 'end-1',
          type: 'end',
          x: 0,
          y: 0,
          width: 120,
          height: 60,
          outcome: 'success',
        }],
      };

      const result = validateImportedChallenge(invalidChallenge);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('title'))).toBe(true);
    });

    it('should fail validation for missing description', () => {
      const invalidChallenge = {
        id: 'test-1',
        title: 'Test',
        version: '1.0',
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
        endNodes: [{
          id: 'end-1',
          type: 'end',
          x: 0,
          y: 0,
          width: 120,
          height: 60,
          outcome: 'success',
        }],
      };

      const result = validateImportedChallenge(invalidChallenge);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('description'))).toBe(true);
    });

    it('should fail validation for missing version', () => {
      const invalidChallenge = {
        id: 'test-1',
        title: 'Test',
        description: 'Test',
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
        endNodes: [{
          id: 'end-1',
          type: 'end',
          x: 0,
          y: 0,
          width: 120,
          height: 60,
          outcome: 'success',
        }],
      };

      const result = validateImportedChallenge(invalidChallenge);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('version'))).toBe(true);
    });

    it('should fail validation for missing challengeStart', () => {
      const invalidChallenge = {
        id: 'test-1',
        title: 'Test',
        description: 'Test',
        version: '1.0',
        startNode: {
          id: 'start',
          type: 'start',
          x: 0,
          y: 0,
          width: 120,
          height: 60,
        },
        nodes: {},
        endNodes: [{
          id: 'end-1',
          type: 'end',
          x: 0,
          y: 0,
          width: 120,
          height: 60,
          outcome: 'success',
        }],
      };

      const result = validateImportedChallenge(invalidChallenge);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('challengeStart'))).toBe(true);
    });

    it('should fail validation for missing startNode', () => {
      const invalidChallenge = {
        id: 'test-1',
        title: 'Test',
        description: 'Test',
        version: '1.0',
        challengeStart: [],
        nodes: {},
        endNodes: [{
          id: 'end-1',
          type: 'end',
          x: 0,
          y: 0,
          width: 120,
          height: 60,
          outcome: 'success',
        }],
      };

      const result = validateImportedChallenge(invalidChallenge);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('startNode'))).toBe(true);
    });

    it('should fail validation for invalid startNode type', () => {
      const invalidChallenge = {
        id: 'test-1',
        title: 'Test',
        description: 'Test',
        version: '1.0',
        challengeStart: [],
        startNode: {
          id: 'start',
          type: 'invalid',
          x: 0,
          y: 0,
          width: 120,
          height: 60,
        },
        nodes: {},
        endNodes: [{
          id: 'end-1',
          type: 'end',
          x: 0,
          y: 0,
          width: 120,
          height: 60,
          outcome: 'success',
        }],
      };

      const result = validateImportedChallenge(invalidChallenge);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes("type 'start'"))).toBe(true);
    });

    it('should fail validation for missing endNodes', () => {
      const invalidChallenge = {
        id: 'test-1',
        title: 'Test',
        description: 'Test',
        version: '1.0',
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
      };

      const result = validateImportedChallenge(invalidChallenge);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('endNodes'))).toBe(true);
    });

    it('should fail validation for empty endNodes array', () => {
      const invalidChallenge = {
        id: 'test-1',
        title: 'Test',
        description: 'Test',
        version: '1.0',
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
      };

      const result = validateImportedChallenge(invalidChallenge);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('empty'))).toBe(true);
    });

    it('should fail validation for invalid end node outcome', () => {
      const invalidChallenge = {
        id: 'test-1',
        title: 'Test',
        description: 'Test',
        version: '1.0',
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
        endNodes: [{
          id: 'end-1',
          type: 'end',
          x: 0,
          y: 0,
          width: 120,
          height: 60,
          outcome: 'invalid',
        }],
      };

      const result = validateImportedChallenge(invalidChallenge);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('outcome'))).toBe(true);
    });

    it('should fail validation for node with non-string success', () => {
      const invalidChallenge = {
        id: 'test-1',
        title: 'Test',
        description: 'Test',
        version: '1.0',
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
            success: { id: 'end-1' }, // Should be string
            failure: 'end-2',
          },
        },
        endNodes: [{
          id: 'end-1',
          type: 'end',
          x: 0,
          y: 0,
          width: 120,
          height: 60,
          outcome: 'success',
        }],
      };

      const result = validateImportedChallenge(invalidChallenge);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('success') && e.includes('string'))).toBe(true);
    });

    it('should fail validation for node with non-string failure', () => {
      const invalidChallenge = {
        id: 'test-1',
        title: 'Test',
        description: 'Test',
        version: '1.0',
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
            success: 'end-1',
            failure: { id: 'end-2' }, // Should be string
          },
        },
        endNodes: [{
          id: 'end-1',
          type: 'end',
          x: 0,
          y: 0,
          width: 120,
          height: 60,
          outcome: 'success',
        }],
      };

      const result = validateImportedChallenge(invalidChallenge);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('failure') && e.includes('string'))).toBe(true);
    });

    it('should accumulate multiple errors', () => {
      const invalidChallenge = {
        // Missing id, title, description, version
        challengeStart: 'not an array',
        startNode: null,
        nodes: [],
        endNodes: 'not an array',
      };

      const result = validateImportedChallenge(invalidChallenge);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(5);
    });
  });

  describe('getChallengeImportFileSizeEstimate', () => {
    it('should return size in bytes for small files', () => {
      const file = new File(['test'], 'test.json', { type: 'application/json' });

      const size = getChallengeImportFileSizeEstimate(file);

      expect(size).toContain('bytes');
    });

    it('should return size in KB for medium files', () => {
      const content = 'a'.repeat(2048); // 2KB
      const file = new File([content], 'test.json', { type: 'application/json' });

      const size = getChallengeImportFileSizeEstimate(file);

      expect(size).toContain('KB');
    });

    it('should return size in MB for large files', () => {
      const content = 'a'.repeat(2 * 1024 * 1024); // 2MB
      const file = new File([content], 'test.json', { type: 'application/json' });

      const size = getChallengeImportFileSizeEstimate(file);

      expect(size).toContain('MB');
    });

    it('should calculate correct size', () => {
      const content = 'test content';
      const file = new File([content], 'test.json', { type: 'application/json' });
      const expectedBytes = file.size;

      const size = getChallengeImportFileSizeEstimate(file);

      if (expectedBytes < 1024) {
        expect(size).toBe(`${expectedBytes} bytes`);
      } else if (expectedBytes < 1024 * 1024) {
        expect(size).toBe(`${(expectedBytes / 1024).toFixed(1)} KB`);
      } else {
        expect(size).toBe(`${(expectedBytes / (1024 * 1024)).toFixed(1)} MB`);
      }
    });
  });
});
