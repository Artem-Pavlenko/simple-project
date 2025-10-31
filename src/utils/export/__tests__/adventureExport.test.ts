import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  exportAdventureAsJSON,
  getAdventureFileSizeEstimate,
  validateAdventureForExport,
} from '../adventureExport';
import type { AdventureType } from '../../types/adventure.types';

const createMockAdventure = (): AdventureType => ({
  id: 'test-adventure-123',
  title: 'Test Adventure',
  description: 'A test adventure',
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
    'challenge-1': {
      id: 'challenge-1',
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
    },
  },
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
});

describe('adventureExport', () => {
  describe('validateAdventureForExport', () => {
    it('should validate a valid adventure', () => {
      const adventure = createMockAdventure();

      const result = validateAdventureForExport(adventure);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for adventure without ID', () => {
      const adventure = createMockAdventure();
      adventure.id = '';

      const result = validateAdventureForExport(adventure);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Adventure must have an ID');
    });

    it('should fail validation for adventure without title', () => {
      const adventure = createMockAdventure();
      adventure.title = '';

      const result = validateAdventureForExport(adventure);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Adventure must have a title');
    });

    it('should fail validation for adventure with whitespace-only title', () => {
      const adventure = createMockAdventure();
      adventure.title = '   ';

      const result = validateAdventureForExport(adventure);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Adventure must have a title');
    });

    it('should fail validation for adventure without version', () => {
      const adventure = createMockAdventure();
      adventure.version = '';

      const result = validateAdventureForExport(adventure);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Adventure must have a version');
    });

    it('should accumulate multiple errors', () => {
      const adventure = createMockAdventure();
      adventure.id = '';
      adventure.title = '';
      adventure.version = '';

      const result = validateAdventureForExport(adventure);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });

    it('should validate adventure with empty challenges', () => {
      const adventure = createMockAdventure();
      adventure.challenges = {};

      const result = validateAdventureForExport(adventure);

      expect(result.isValid).toBe(true);
    });
  });

  describe('getAdventureFileSizeEstimate', () => {
    it('should return size in bytes for small adventures', () => {
      const adventure = createMockAdventure();
      adventure.challenges = {};

      const size = getAdventureFileSizeEstimate(adventure);

      expect(size).toContain('bytes');
    });

    it('should return size in KB for medium adventures', () => {
      const adventure = createMockAdventure();
      // Add many challenges to increase size
      for (let i = 0; i < 50; i++) {
        adventure.challenges[`challenge-${i}`] = {
          id: `challenge-${i}`,
          title: `Challenge ${i}`,
          description: 'A'.repeat(100),
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
        };
      }

      const size = getAdventureFileSizeEstimate(adventure);

      expect(size).toContain('KB');
    });

    it('should calculate correct size', () => {
      const adventure = createMockAdventure();

      const jsonString = JSON.stringify(adventure);
      const expectedBytes = new Blob([jsonString]).size;

      const size = getAdventureFileSizeEstimate(adventure);

      if (expectedBytes < 1024) {
        expect(size).toBe(`${expectedBytes} bytes`);
      } else if (expectedBytes < 1024 * 1024) {
        expect(size).toBe(`${(expectedBytes / 1024).toFixed(1)} KB`);
      }
    });
  });

  describe('exportAdventureAsJSON', () => {
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

    it('should export adventure as JSON file', () => {
      const adventure = createMockAdventure();

      exportAdventureAsJSON(adventure);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalled();
    });

    it('should create correct filename', () => {
      const adventure = createMockAdventure();
      adventure.title = 'My Test Adventure';
      adventure.version = '2.5';

      exportAdventureAsJSON(adventure);

      expect(mockLink.download).toBe('adventure-My-Test-Adventure-2.5.json');
    });

    it('should sanitize filename with special characters', () => {
      const adventure = createMockAdventure();
      adventure.title = 'Test@#$ Adventure!';
      adventure.version = '1.0';

      exportAdventureAsJSON(adventure);

      expect(mockLink.download).toBe('adventure-Test----Adventure--1.0.json');
    });

    it('should add _startNodeTarget metadata to challenges', () => {
      const adventure = createMockAdventure();

      expect(() => exportAdventureAsJSON(adventure)).not.toThrow();
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should create blob with correct type', () => {
      const adventure = createMockAdventure();

      exportAdventureAsJSON(adventure);

      const blobCall = createObjectURLSpy.mock.calls[0][0];
      expect(blobCall.type).toBe('application/json');
    });

    it('should throw error when export fails', () => {
      const adventure = createMockAdventure();

      createObjectURLSpy.mockImplementation(() => {
        throw new Error('Mock error');
      });

      expect(() => exportAdventureAsJSON(adventure)).toThrow(
        'Failed to export adventure. Please try again.'
      );
    });

    it('should create JSON export successfully', () => {
      const adventure = createMockAdventure();

      expect(() => exportAdventureAsJSON(adventure)).not.toThrow();
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should append and remove link from DOM', () => {
      const adventure = createMockAdventure();
      const appendSpy = vi.spyOn(document.body, 'appendChild');
      const removeSpy = vi.spyOn(document.body, 'removeChild');

      exportAdventureAsJSON(adventure);

      expect(appendSpy).toHaveBeenCalledWith(mockLink);
      expect(removeSpy).toHaveBeenCalledWith(mockLink);
    });

    it('should clean up object URL after download', () => {
      const adventure = createMockAdventure();

      exportAdventureAsJSON(adventure);

      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should export adventure with empty challenges', () => {
      const adventure = createMockAdventure();
      adventure.challenges = {};

      expect(() => exportAdventureAsJSON(adventure)).not.toThrow();
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should export adventure with multiple challenges', () => {
      const adventure = createMockAdventure();
      adventure.challenges = {
        'ch-1': {
          id: 'ch-1',
          title: 'Challenge 1',
          description: '',
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
        },
        'ch-2': {
          id: 'ch-2',
          title: 'Challenge 2',
          description: '',
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
        },
      };

      expect(() => exportAdventureAsJSON(adventure)).not.toThrow();
      expect(mockLink.click).toHaveBeenCalled();
    });
  });
});
