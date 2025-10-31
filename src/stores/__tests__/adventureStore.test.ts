import { describe, it, expect, beforeEach } from 'vitest';
import { useAdventureStore } from '../adventureStore';
import type { AdventureType } from '../../utils/types/adventure.types';
import type { ChallengeType } from '../../utils/types/challenge.types';

const createMockAdventure = (id: string = 'adventure-1'): AdventureType => ({
  id,
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
  challenges: {},
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
});

const createMockChallenge = (id: string = 'challenge-1'): ChallengeType => ({
  id,
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

describe('adventureStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAdventureStore.setState({
      adventures: [],
    });
  });

  describe('addAdventure', () => {
    it('should add a new adventure', () => {
      const adventure = createMockAdventure();
      const { addAdventure } = useAdventureStore.getState();

      addAdventure(adventure);

      const state = useAdventureStore.getState();
      expect(state.adventures).toHaveLength(1);
      expect(state.adventures[0]).toEqual(adventure);
    });

    it('should add multiple adventures', () => {
      const adventure1 = createMockAdventure('adv-1');
      const adventure2 = createMockAdventure('adv-2');
      const { addAdventure } = useAdventureStore.getState();

      addAdventure(adventure1);
      addAdventure(adventure2);

      const state = useAdventureStore.getState();
      expect(state.adventures).toHaveLength(2);
      expect(state.adventures[0]).toEqual(adventure1);
      expect(state.adventures[1]).toEqual(adventure2);
    });

    it('should preserve existing adventures when adding new one', () => {
      const existing = createMockAdventure('existing');
      useAdventureStore.setState({ adventures: [existing] });

      const newAdventure = createMockAdventure('new');
      const { addAdventure } = useAdventureStore.getState();
      addAdventure(newAdventure);

      const state = useAdventureStore.getState();
      expect(state.adventures).toHaveLength(2);
      expect(state.adventures).toContainEqual(existing);
      expect(state.adventures).toContainEqual(newAdventure);
    });
  });

  describe('setAdventures', () => {
    it('should set adventures array', () => {
      const adventures = [
        createMockAdventure('adv-1'),
        createMockAdventure('adv-2'),
      ];
      const { setAdventures } = useAdventureStore.getState();

      setAdventures(adventures);

      const state = useAdventureStore.getState();
      expect(state.adventures).toEqual(adventures);
    });

    it('should replace existing adventures', () => {
      const oldAdventures = [createMockAdventure('old')];
      useAdventureStore.setState({ adventures: oldAdventures });

      const newAdventures = [
        createMockAdventure('new-1'),
        createMockAdventure('new-2'),
      ];
      const { setAdventures } = useAdventureStore.getState();
      setAdventures(newAdventures);

      const state = useAdventureStore.getState();
      expect(state.adventures).toEqual(newAdventures);
      expect(state.adventures).not.toContainEqual(oldAdventures[0]);
    });

    it('should set empty adventures array', () => {
      useAdventureStore.setState({
        adventures: [createMockAdventure()],
      });

      const { setAdventures } = useAdventureStore.getState();
      setAdventures([]);

      const state = useAdventureStore.getState();
      expect(state.adventures).toEqual([]);
    });
  });

  describe('clearAdventures', () => {
    it('should clear all adventures', () => {
      useAdventureStore.setState({
        adventures: [
          createMockAdventure('adv-1'),
          createMockAdventure('adv-2'),
        ],
      });

      const { clearAdventures } = useAdventureStore.getState();
      clearAdventures();

      const state = useAdventureStore.getState();
      expect(state.adventures).toEqual([]);
    });

    it('should handle clearing when already empty', () => {
      useAdventureStore.setState({ adventures: [] });

      const { clearAdventures } = useAdventureStore.getState();
      clearAdventures();

      const state = useAdventureStore.getState();
      expect(state.adventures).toEqual([]);
    });
  });

  describe('deleteAdventure', () => {
    it('should delete adventure by id', () => {
      const adventure1 = createMockAdventure('adv-1');
      const adventure2 = createMockAdventure('adv-2');
      useAdventureStore.setState({
        adventures: [adventure1, adventure2],
      });

      const { deleteAdventure } = useAdventureStore.getState();
      deleteAdventure('adv-1');

      const state = useAdventureStore.getState();
      expect(state.adventures).toHaveLength(1);
      expect(state.adventures[0]).toEqual(adventure2);
    });

    it('should not delete anything if id does not exist', () => {
      const adventures = [
        createMockAdventure('adv-1'),
        createMockAdventure('adv-2'),
      ];
      useAdventureStore.setState({ adventures });

      const { deleteAdventure } = useAdventureStore.getState();
      deleteAdventure('non-existent');

      const state = useAdventureStore.getState();
      expect(state.adventures).toEqual(adventures);
    });

    it('should handle deleting from empty array', () => {
      useAdventureStore.setState({ adventures: [] });

      const { deleteAdventure } = useAdventureStore.getState();
      deleteAdventure('any-id');

      const state = useAdventureStore.getState();
      expect(state.adventures).toEqual([]);
    });
  });

  describe('updAdventure', () => {
    it('should update existing adventure', () => {
      const original = createMockAdventure('adv-1');
      useAdventureStore.setState({ adventures: [original] });

      const updated = {
        ...original,
        title: 'Updated Title',
        version: '2.0',
      };

      const { updAdventure } = useAdventureStore.getState();
      updAdventure(updated);

      const state = useAdventureStore.getState();
      expect(state.adventures).toHaveLength(1);
      expect(state.adventures[0].title).toBe('Updated Title');
      expect(state.adventures[0].version).toBe('2.0');
    });

    it('should only update matching adventure', () => {
      const adv1 = createMockAdventure('adv-1');
      const adv2 = createMockAdventure('adv-2');
      useAdventureStore.setState({ adventures: [adv1, adv2] });

      const updated = {
        ...adv1,
        title: 'Updated',
      };

      const { updAdventure } = useAdventureStore.getState();
      updAdventure(updated);

      const state = useAdventureStore.getState();
      expect(state.adventures[0].title).toBe('Updated');
      expect(state.adventures[1].title).toBe(adv2.title); // Unchanged
    });

    it('should not add new adventure if id does not exist', () => {
      const existing = createMockAdventure('existing');
      useAdventureStore.setState({ adventures: [existing] });

      const newAdventure = createMockAdventure('new');

      const { updAdventure } = useAdventureStore.getState();
      updAdventure(newAdventure);

      const state = useAdventureStore.getState();
      expect(state.adventures).toHaveLength(1);
      expect(state.adventures[0]).toEqual(existing);
    });
  });

  describe('updAdventureChallenge', () => {
    it('should update challenge in adventure', () => {
      const challenge = createMockChallenge('challenge-1');
      const adventure = {
        ...createMockAdventure('adv-1'),
        challenges: {
          'challenge-1': challenge,
        },
      };
      useAdventureStore.setState({ adventures: [adventure] });

      const updatedChallenge = {
        ...challenge,
        title: 'Updated Challenge',
      };

      const { updAdventureChallenge } = useAdventureStore.getState();
      updAdventureChallenge('adv-1', updatedChallenge);

      const state = useAdventureStore.getState();
      expect(state.adventures[0].challenges['challenge-1'].title).toBe(
        'Updated Challenge'
      );
    });

    it('should add new challenge if it does not exist', () => {
      const adventure = createMockAdventure('adv-1');
      useAdventureStore.setState({ adventures: [adventure] });

      const newChallenge = createMockChallenge('new-challenge');

      const { updAdventureChallenge } = useAdventureStore.getState();
      updAdventureChallenge('adv-1', newChallenge);

      const state = useAdventureStore.getState();
      expect(state.adventures[0].challenges['new-challenge']).toEqual(
        newChallenge
      );
    });

    it('should only update challenges in matching adventure', () => {
      const challenge1 = createMockChallenge('ch-1');
      const challenge2 = createMockChallenge('ch-2');
      const adv1 = {
        ...createMockAdventure('adv-1'),
        challenges: { 'ch-1': challenge1 },
      };
      const adv2 = {
        ...createMockAdventure('adv-2'),
        challenges: { 'ch-2': challenge2 },
      };
      useAdventureStore.setState({ adventures: [adv1, adv2] });

      const updatedChallenge = {
        ...challenge1,
        title: 'Updated',
      };

      const { updAdventureChallenge } = useAdventureStore.getState();
      updAdventureChallenge('adv-1', updatedChallenge);

      const state = useAdventureStore.getState();
      expect(state.adventures[0].challenges['ch-1'].title).toBe('Updated');
      expect(state.adventures[1].challenges['ch-2'].title).toBe(
        challenge2.title
      ); // Unchanged
    });

    it('should preserve other challenges when updating one', () => {
      const challenge1 = createMockChallenge('ch-1');
      const challenge2 = createMockChallenge('ch-2');
      const adventure = {
        ...createMockAdventure('adv-1'),
        challenges: {
          'ch-1': challenge1,
          'ch-2': challenge2,
        },
      };
      useAdventureStore.setState({ adventures: [adventure] });

      const updatedChallenge = {
        ...challenge1,
        title: 'Updated',
      };

      const { updAdventureChallenge } = useAdventureStore.getState();
      updAdventureChallenge('adv-1', updatedChallenge);

      const state = useAdventureStore.getState();
      expect(state.adventures[0].challenges['ch-1'].title).toBe('Updated');
      expect(state.adventures[0].challenges['ch-2']).toEqual(challenge2);
    });

    it('should not update if adventure id does not exist', () => {
      const adventure = createMockAdventure('adv-1');
      useAdventureStore.setState({ adventures: [adventure] });

      const challenge = createMockChallenge('ch-1');

      const { updAdventureChallenge } = useAdventureStore.getState();
      updAdventureChallenge('non-existent', challenge);

      const state = useAdventureStore.getState();
      expect(state.adventures[0].challenges).toEqual({});
    });
  });

  describe('persistence', () => {
    it('should initialize with empty adventures', () => {
      const state = useAdventureStore.getState();
      expect(state.adventures).toEqual([]);
    });
  });
});
