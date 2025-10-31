import { describe, it, expect, vi } from 'vitest';
import {
  importAdventureFromJSON,
  validateImportedAdventure,
  getImportFileSizeEstimate,
} from '../adventureImport';

const createValidAdventureData = () => ({
  id: 'adventure-123',
  title: 'Test Adventure',
  description: 'Test description',
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
        id: 'start-1',
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
      _startNodeTarget: 'node-1',
    },
  },
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
});

describe('adventureImport', () => {
  describe('validateImportedAdventure', () => {
    it('should validate a valid adventure', () => {
      const data = createValidAdventureData();

      const result = validateImportedAdventure(data);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail if data is not an object', () => {
      const result = validateImportedAdventure(null);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Data must be an object');
    });

    it('should fail if data is a string', () => {
      const result = validateImportedAdventure('invalid');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Data must be an object');
    });

    it('should fail if id is missing', () => {
      const data = createValidAdventureData();
      delete (data as any).id;

      const result = validateImportedAdventure(data);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Missing or invalid 'id' field");
    });

    it('should fail if id is not a string', () => {
      const data = createValidAdventureData();
      (data as any).id = 123;

      const result = validateImportedAdventure(data);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Missing or invalid 'id' field");
    });

    it('should fail if title is missing', () => {
      const data = createValidAdventureData();
      delete (data as any).title;

      const result = validateImportedAdventure(data);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Missing or invalid 'title' field");
    });

    it('should fail if title is not a string', () => {
      const data = createValidAdventureData();
      (data as any).title = 123;

      const result = validateImportedAdventure(data);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Missing or invalid 'title' field");
    });

    it('should fail if version is missing', () => {
      const data = createValidAdventureData();
      delete (data as any).version;

      const result = validateImportedAdventure(data);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Missing or invalid 'version' field");
    });

    it('should fail if input_aliasing is missing', () => {
      const data = createValidAdventureData();
      delete (data as any).input_aliasing;

      const result = validateImportedAdventure(data);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Missing or invalid 'input_aliasing' field");
    });

    it('should fail if assets is missing', () => {
      const data = createValidAdventureData();
      delete (data as any).assets;

      const result = validateImportedAdventure(data);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Missing or invalid 'assets' field");
    });

    it('should fail if challengeSelectionSettings is missing', () => {
      const data = createValidAdventureData();
      delete (data as any).challengeSelectionSettings;

      const result = validateImportedAdventure(data);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Missing or invalid 'challengeSelectionSettings' field"
      );
    });

    it('should fail if challenge structure is invalid', () => {
      const data = createValidAdventureData();
      (data as any).challenges = {
        'invalid-challenge': {
          // Missing id and title
          description: 'Invalid',
        },
      };

      const result = validateImportedAdventure(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid challenge structure'))).toBe(
        true
      );
    });

    it('should accumulate multiple errors', () => {
      const data: any = {
        description: 'Test',
      };

      const result = validateImportedAdventure(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });

    it('should validate adventure with empty challenges', () => {
      const data = createValidAdventureData();
      data.challenges = {};

      const result = validateImportedAdventure(data);

      expect(result.isValid).toBe(true);
    });

    it('should validate adventure with multiple challenges', () => {
      const data = createValidAdventureData();
      data.challenges = {
        'ch-1': {
          id: 'ch-1',
          title: 'Challenge 1',
          description: '',
          version: '1.0',
        },
        'ch-2': {
          id: 'ch-2',
          title: 'Challenge 2',
          description: '',
          version: '1.0',
        },
      };

      const result = validateImportedAdventure(data);

      expect(result.isValid).toBe(true);
    });
  });

  describe('importAdventureFromJSON', () => {
    it('should import valid adventure from file', async () => {
      const data = createValidAdventureData();
      const file = new File([JSON.stringify(data)], 'adventure.json', {
        type: 'application/json',
      });

      const result = await importAdventureFromJSON(file);

      expect(result.id).not.toBe(data.id); // Should have new ID
      expect(result.title).toBe(`Imported ${data.title}`);
      expect(result.version).toBe(data.version);
    });

    it('should generate new IDs for adventure and challenges', async () => {
      const data = createValidAdventureData();
      const originalAdventureId = data.id;
      const originalChallengeId = data.challenges['challenge-1'].id;

      const file = new File([JSON.stringify(data)], 'adventure.json', {
        type: 'application/json',
      });

      const result = await importAdventureFromJSON(file);

      expect(result.id).not.toBe(originalAdventureId);
      const importedChallengeId = Object.keys(result.challenges)[0];
      expect(importedChallengeId).not.toBe(originalChallengeId);
    });

    it('should remap node IDs in challenges', async () => {
      const data = createValidAdventureData();
      const originalNodeId = Object.keys(
        data.challenges['challenge-1'].nodes
      )[0];

      const file = new File([JSON.stringify(data)], 'adventure.json', {
        type: 'application/json',
      });

      const result = await importAdventureFromJSON(file);

      const importedChallenge = Object.values(result.challenges)[0];
      const importedNodeId = Object.keys(importedChallenge.nodes)[0];
      expect(importedNodeId).not.toBe(originalNodeId);
    });

    it('should update node references after remapping', async () => {
      const data = createValidAdventureData();
      const file = new File([JSON.stringify(data)], 'adventure.json', {
        type: 'application/json',
      });

      const result = await importAdventureFromJSON(file);

      const importedChallenge = Object.values(result.challenges)[0];
      const importedNode = Object.values(importedChallenge.nodes)[0];

      // success and failure should reference new IDs
      expect(importedNode.success).toBeDefined();
      expect(importedNode.failure).toBeDefined();
    });

    it('should preserve _startNodeTarget metadata with new ID', async () => {
      const data = createValidAdventureData();
      const file = new File([JSON.stringify(data)], 'adventure.json', {
        type: 'application/json',
      });

      const result = await importAdventureFromJSON(file);

      const importedChallenge = Object.values(result.challenges)[0];
      const startNodeTarget = (importedChallenge as any)._startNodeTarget;

      expect(startNodeTarget).toBeDefined();
      // Should reference one of the new node IDs
      expect(Object.keys(importedChallenge.nodes)).toContain(startNodeTarget);
    });

    it('should reject invalid JSON file', async () => {
      const file = new File(['invalid json'], 'adventure.json', {
        type: 'application/json',
      });

      await expect(importAdventureFromJSON(file)).rejects.toThrow(
        'Failed to parse JSON file'
      );
    });

    it('should reject file with invalid adventure structure', async () => {
      const invalidData = {
        title: 'Missing required fields',
      };
      const file = new File([JSON.stringify(invalidData)], 'adventure.json', {
        type: 'application/json',
      });

      await expect(importAdventureFromJSON(file)).rejects.toThrow(
        'Invalid adventure file'
      );
    });

    it('should set new created_at and updated_at timestamps', async () => {
      const data = createValidAdventureData();
      const file = new File([JSON.stringify(data)], 'adventure.json', {
        type: 'application/json',
      });

      const beforeImport = new Date().toISOString();
      const result = await importAdventureFromJSON(file);
      const afterImport = new Date().toISOString();

      expect(result.created_at).not.toBe(data.created_at);
      expect(result.created_at >= beforeImport).toBe(true);
      expect(result.created_at <= afterImport).toBe(true);
    });

  });

  describe('getImportFileSizeEstimate', () => {
    it('should return size in bytes for small files', () => {
      const file = new File(['test'], 'test.json', { type: 'application/json' });

      const size = getImportFileSizeEstimate(file);

      expect(size).toBe('4 bytes');
    });

    it('should return size in KB for medium files', () => {
      const content = 'a'.repeat(2048);
      const file = new File([content], 'test.json', { type: 'application/json' });

      const size = getImportFileSizeEstimate(file);

      expect(size).toContain('KB');
    });

    it('should return size in MB for large files', () => {
      const content = 'a'.repeat(2 * 1024 * 1024);
      const file = new File([content], 'test.json', { type: 'application/json' });

      const size = getImportFileSizeEstimate(file);

      expect(size).toContain('MB');
    });

    it('should format KB size correctly', () => {
      const content = 'a'.repeat(1536); // 1.5 KB
      const file = new File([content], 'test.json', { type: 'application/json' });

      const size = getImportFileSizeEstimate(file);

      expect(size).toBe('1.5 KB');
    });
  });
});
