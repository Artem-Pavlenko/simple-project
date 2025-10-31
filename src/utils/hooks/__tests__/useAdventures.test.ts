import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAdventures } from "../useAdventures";
import { SupabaseAPI } from "../../service/api";
import type { AdventureType } from "../../types/adventure.types";
import {
  createMockPostgrestResponse,
  createMockPostgrestArrayResponse,
} from "../../test-helpers/supabase-mocks";

// Mock SupabaseAPI
vi.mock("../../service/api", () => ({
  SupabaseAPI: {
    createAdventure: vi.fn(),
    getAdventureById: vi.fn(),
    updateAdventure: vi.fn(),
    deleteAdventure: vi.fn(),
    getUserAdventures: vi.fn(),
    checkAdventureExists: vi.fn(),
  },
}));

// Mock export/import functions
vi.mock("../../export", () => ({
  exportAdventureAsJSON: vi.fn(),
  validateAdventureForExport: vi.fn(() => ({ isValid: true, errors: [] })),
}));

vi.mock("../../import", () => ({
  importAdventureFromJSON: vi.fn(),
}));

const createMockAdventure = (id: string = "adv-123"): AdventureType => ({
  id,
  title: "Test Adventure",
  description: "Test description",
  version: "1.0",
  tag: "Draft",
  input_aliasing: {
    B1: "",
    B2: "",
    B3: "",
    B4: "",
    B5: "",
    B6: "",
    B7: "",
    B8: "",
    B9: "",
    B10: "",
    B11: "",
    B12: "",
    P1: "",
    P2: "",
    P3: "",
    P4: "",
    P5: "",
    P6: "",
    P7: "",
    P8: "",
    P9: "",
    P10: "",
    P11: "",
    P12: "",
  },
  assets: {
    matImage: "",
    audioFiles: [],
  },
  challengeSelectionSettings: {
    startButton: "B1",
    stopButton: "B2",
  },
  challenges: {},
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
});

const createMockDbRow = (id: string = "adv-123") => ({
  id,
  user_id: "user-123",
  title: "Test Adventure",
  description: "Test description",
  version: "1.0",
  tag: "Draft",
  input_aliasing: {
    B1: "",
    B2: "",
    B3: "",
    B4: "",
    B5: "",
    B6: "",
    B7: "",
    B8: "",
    B9: "",
    B10: "",
    B11: "",
    B12: "",
    P1: "",
    P2: "",
    P3: "",
    P4: "",
    P5: "",
    P6: "",
    P7: "",
    P8: "",
    P9: "",
    P10: "",
    P11: "",
    P12: "",
  },
  assets: {
    matImage: "",
    audioFiles: [],
  },
  challenge_selection_settings: {
    startButton: "B1",
    stopButton: "B2",
  },
  challenges: {},
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
});

describe("useAdventures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createAdventure", () => {
    it("should create adventure successfully", async () => {
      const mockDbRow = createMockDbRow();
      vi.mocked(SupabaseAPI.createAdventure).mockResolvedValue(
        createMockPostgrestResponse(mockDbRow)
      );

      const { result } = renderHook(() => useAdventures());

      const adventure = createMockAdventure();
      let created;
      await act(async () => {
        created = await result.current.createAdventure(adventure);
      });

      expect(created).not.toBeNull();
      expect(created?.id).toBe("adv-123");
      expect(created?.title).toBe("Test Adventure");
      expect(result.current.loading).toBe(false);
    });

    it("should transform db row to adventure type", async () => {
      const mockDbRow = createMockDbRow("adv-456");
      vi.mocked(SupabaseAPI.createAdventure).mockResolvedValue(
        createMockPostgrestResponse(mockDbRow)
      );

      const { result } = renderHook(() => useAdventures());

      const adventure = createMockAdventure("adv-456");
      let created;
      await act(async () => {
        created = await result.current.createAdventure(adventure);
      });

      expect(created?.challengeSelectionSettings).toEqual({
        startButton: "B1",
        stopButton: "B2",
      });
    });
  });

  describe("getAdventureById", () => {
    it("should get adventure by id successfully", async () => {
      const mockDbRow = createMockDbRow("adv-789");
      vi.mocked(SupabaseAPI.getAdventureById).mockResolvedValue(
        createMockPostgrestResponse(mockDbRow)
      );

      const { result } = renderHook(() => useAdventures());

      let adventure;
      await act(async () => {
        adventure = await result.current.getAdventureById("adv-789");
      });

      expect(adventure).not.toBeNull();
      expect(adventure?.id).toBe("adv-789");
      expect(result.current.loading).toBe(false);
    });

    it("should return null if data is null", async () => {
      vi.mocked(SupabaseAPI.getAdventureById).mockResolvedValue(
        createMockPostgrestResponse<null>(null)
      );

      const { result } = renderHook(() => useAdventures());

      let adventure;
      await act(async () => {
        adventure = await result.current.getAdventureById("adv-123");
      });

      expect(adventure).toBeNull();
    });
  });

  describe("updateAdventure", () => {
    it("should update adventure successfully", async () => {
      const mockDbRow = {
        ...createMockDbRow("adv-123"),
        title: "Updated Title",
      };
      vi.mocked(SupabaseAPI.updateAdventure).mockResolvedValue(
        createMockPostgrestResponse(mockDbRow)
      );

      const { result } = renderHook(() => useAdventures());

      let updated;
      await act(async () => {
        updated = await result.current.updateAdventure("adv-123", {
          title: "Updated Title",
        });
      });

      expect(updated?.title).toBe("Updated Title");
      expect(result.current.loading).toBe(false);
    });
  });

  describe("deleteAdventure", () => {
    it("should delete adventure successfully", async () => {
      vi.mocked(SupabaseAPI.deleteAdventure).mockResolvedValue(
        createMockPostgrestResponse<null>(null)
      );

      const { result } = renderHook(() => useAdventures());

      let deleted;
      await act(async () => {
        deleted = await result.current.deleteAdventure("adv-123");
      });

      expect(deleted).toBe(true);
      expect(result.current.loading).toBe(false);
    });
  });

  describe("getUserAdventures", () => {
    it("should get all user adventures", async () => {
      const mockDbRows = [createMockDbRow("adv-1"), createMockDbRow("adv-2")];
      vi.mocked(SupabaseAPI.getUserAdventures).mockResolvedValue(
        createMockPostgrestArrayResponse(mockDbRows)
      );

      const { result } = renderHook(() => useAdventures());

      let adventures;
      await act(async () => {
        adventures = await result.current.getUserAdventures();
      });

      expect(adventures).toHaveLength(2);
      expect(adventures?.[0]?.id).toBe("adv-1");
      expect(adventures?.[1]?.id).toBe("adv-2");
    });

    it("should return empty array if data is null", async () => {
      vi.mocked(SupabaseAPI.getUserAdventures).mockResolvedValue(
        createMockPostgrestArrayResponse<ReturnType<typeof createMockDbRow>>(
          null
        )
      );

      const { result } = renderHook(() => useAdventures());

      let adventures;
      await act(async () => {
        adventures = await result.current.getUserAdventures();
      });

      expect(adventures).toEqual([]);
    });
  });

  describe("checkAdventureExists", () => {
    it("should return true if adventure exists", async () => {
      vi.mocked(SupabaseAPI.checkAdventureExists).mockResolvedValue(
        createMockPostgrestResponse(createMockDbRow())
      );

      const { result } = renderHook(() => useAdventures());

      let exists;
      await act(async () => {
        exists = await result.current.checkAdventureExists("adv-123");
      });

      expect(exists).toBe(true);
    });

    it("should return false if adventure does not exist", async () => {
      vi.mocked(SupabaseAPI.checkAdventureExists).mockResolvedValue(
        createMockPostgrestResponse(null)
      );

      const { result } = renderHook(() => useAdventures());

      let exists;
      await act(async () => {
        exists = await result.current.checkAdventureExists("non-existent");
      });

      expect(exists).toBe(false);
    });

    it("should handle PGRST116 error (no rows) as false", async () => {
      const error = Object.assign(new Error(), { code: "PGRST116" });
      vi.mocked(SupabaseAPI.checkAdventureExists).mockResolvedValue(
        createMockPostgrestResponse(null, error)
      );

      const { result } = renderHook(() => useAdventures());

      let exists;
      await act(async () => {
        exists = await result.current.checkAdventureExists("adv-123");
      });

      expect(exists).toBe(false);
    });
  });

  describe("duplicateAdventure", () => {
    it("should duplicate adventure with new ID", async () => {
      const original = createMockAdventure("original-id");
      const mockDbRow = {
        ...createMockDbRow(),
        title: `Copy of ${original.title}`,
      };
      vi.mocked(SupabaseAPI.createAdventure).mockResolvedValue(
        createMockPostgrestResponse(mockDbRow)
      );

      const { result } = renderHook(() => useAdventures());

      let duplicated;
      await act(async () => {
        duplicated = await result.current.duplicateAdventure(original);
      });

      expect(duplicated).not.toBeNull();
      expect(duplicated?.id).not.toBe("original-id");
      expect(duplicated?.title).toBe(`Copy of ${original.title}`);
    });
  });

  describe("loading and error states", () => {
    it("should initialize with loading false and error null", () => {
      const { result } = renderHook(() => useAdventures());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
