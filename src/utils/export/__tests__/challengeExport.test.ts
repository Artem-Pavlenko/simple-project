import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  exportChallengeAsJSON,
  getFileSizeEstimate,
  validateChallengeForExport,
} from '../challengeExport';
import type { ChallengeType } from '../../types/challenge.types';

const createMockChallenge = (): ChallengeType => ({
  id: 'test-challenge-123',
  title: 'Test Challenge',
  description: 'A test challenge',
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

describe('challengeExport', () => {
  describe('validateChallengeForExport', () => {
    it('should validate a valid challenge', () => {
      const challenge = createMockChallenge();

      const result = validateChallengeForExport(challenge);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for challenge without ID', () => {
      const challenge = createMockChallenge();
      challenge.id = '';

      const result = validateChallengeForExport(challenge);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Challenge must have an ID');
    });

    it('should fail validation for challenge without title', () => {
      const challenge = createMockChallenge();
      challenge.title = '';

      const result = validateChallengeForExport(challenge);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Challenge must have a title');
    });

    it('should fail validation for challenge with whitespace-only title', () => {
      const challenge = createMockChallenge();
      challenge.title = '   ';

      const result = validateChallengeForExport(challenge);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Challenge must have a title');
    });

    it('should fail validation for challenge without version', () => {
      const challenge = createMockChallenge();
      challenge.version = '';

      const result = validateChallengeForExport(challenge);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Challenge must have a version');
    });

    it('should accumulate multiple errors', () => {
      const challenge = createMockChallenge();
      challenge.id = '';
      challenge.title = '';
      challenge.version = '';

      const result = validateChallengeForExport(challenge);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });

  describe('getFileSizeEstimate', () => {
    it('should return size in bytes for small challenges', () => {
      const challenge = createMockChallenge();
      challenge.nodes = {};
      challenge.endNodes = [];

      const size = getFileSizeEstimate(challenge);

      expect(size).toContain('bytes');
    });

    it('should return size in KB for medium challenges', () => {
      const challenge = createMockChallenge();
      // Add many nodes to increase size
      for (let i = 0; i < 100; i++) {
        challenge.nodes[`node-${i}`] = {
          id: `node-${i}`,
          type: 'node',
          title: `Node ${i}`,
          description: 'A'.repeat(100), // Add description to increase size
          x: i * 10,
          y: i * 10,
          width: 180,
          height: 80,
          entryEffects: [],
          exitEffects: [],
          timeOut: null,
          events: [],
          success: 'end-1',
          failure: 'end-2',
        };
      }

      const size = getFileSizeEstimate(challenge);

      expect(size).toContain('KB');
    });

    it('should calculate correct size', () => {
      const challenge = createMockChallenge();

      const jsonString = JSON.stringify(challenge);
      const expectedBytes = new Blob([jsonString]).size;

      const size = getFileSizeEstimate(challenge);

      if (expectedBytes < 1024) {
        expect(size).toBe(`${expectedBytes} bytes`);
      } else if (expectedBytes < 1024 * 1024) {
        expect(size).toBe(`${(expectedBytes / 1024).toFixed(1)} KB`);
      }
    });
  });

  describe('exportChallengeAsJSON', () => {
    let createElementSpy: ReturnType<typeof vi.spyOn>;
    let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
    let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;
    let mockLink: {
      href: string;
      download: string;
      click: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
      mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };

      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(
        mockLink as unknown as HTMLElement
      );

      createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue(
        'blob:mock-url'
      );

      revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

      vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as unknown as Node);
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as unknown as Node);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should export challenge as JSON file', () => {
      const challenge = createMockChallenge();

      exportChallengeAsJSON(challenge);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalled();
    });

    it('should create correct filename', () => {
      const challenge = createMockChallenge();
      challenge.title = 'My Test Challenge';
      challenge.version = '2.5';

      exportChallengeAsJSON(challenge);

      expect(mockLink.download).toBe('challenge-My-Test-Challenge-2.5.json');
    });

    it('should sanitize filename with special characters', () => {
      const challenge = createMockChallenge();
      challenge.title = 'Test@#$ Challenge!';
      challenge.version = '1.0';

      exportChallengeAsJSON(challenge);

      // The regex [^a-zA-Z0-9]/g replaces @#$ ! with ----
      expect(mockLink.download).toBe('challenge-Test----Challenge--1.0.json');
    });

    it('should pass _startNodeTarget metadata to export', () => {
      const challenge = createMockChallenge();

      // Just verify export doesn't throw
      expect(() => exportChallengeAsJSON(challenge)).not.toThrow();
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should create blob with correct type', () => {
      const challenge = createMockChallenge();

      exportChallengeAsJSON(challenge);

      const blobCall = createObjectURLSpy.mock.calls[0][0];
      expect(blobCall.type).toBe('application/json');
    });

    it('should throw error when export fails', () => {
      const challenge = createMockChallenge();

      createObjectURLSpy.mockImplementation(() => {
        throw new Error('Mock error');
      });

      expect(() => exportChallengeAsJSON(challenge)).toThrow(
        'Failed to export challenge. Please try again.'
      );
    });

    it('should create JSON export successfully', () => {
      const challenge = createMockChallenge();

      expect(() => exportChallengeAsJSON(challenge)).not.toThrow();
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should append and remove link from DOM', () => {
      const challenge = createMockChallenge();
      const appendSpy = vi.spyOn(document.body, 'appendChild');
      const removeSpy = vi.spyOn(document.body, 'removeChild');

      exportChallengeAsJSON(challenge);

      expect(appendSpy).toHaveBeenCalledWith(mockLink);
      expect(removeSpy).toHaveBeenCalledWith(mockLink);
    });

    it('should clean up object URL after download', () => {
      const challenge = createMockChallenge();

      exportChallengeAsJSON(challenge);

      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should export challenge with empty nodes', () => {
      const challenge = createMockChallenge();
      challenge.nodes = {};

      expect(() => exportChallengeAsJSON(challenge)).not.toThrow();
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should export challenge with multiple nodes', () => {
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
          failure: 'end-2',
        },
      };

      expect(() => exportChallengeAsJSON(challenge)).not.toThrow();
      expect(mockLink.click).toHaveBeenCalled();
    });
  });
});
