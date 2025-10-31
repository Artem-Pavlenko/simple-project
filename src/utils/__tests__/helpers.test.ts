import { describe, it, expect } from "vitest";
import { parseUserData, createAdventure } from "../helpers";
import type { User } from "@supabase/supabase-js";

describe("helpers", () => {
  describe("parseUserData", () => {
    it("should parse user data with all fields", () => {
      const mockUser: User = {
        id: "123",
        email: "test@example.com",
        user_metadata: {
          firstName: "John",
          lastName: "Doe",
        },
        app_metadata: {},
        aud: "authenticated",
        created_at: "2025-01-01T00:00:00Z",
      };

      const parsed = parseUserData(mockUser);

      expect(parsed.id).toBe("123");
      expect(parsed.email).toBe("test@example.com");
      expect(parsed.firstName).toBe("John");
      expect(parsed.lastName).toBe("Doe");
    });

    it("should parse user data without metadata", () => {
      const mockUser: User = {
        id: "456",
        email: "user@example.com",
        user_metadata: {},
        app_metadata: {},
        aud: "authenticated",
        created_at: "2025-01-01T00:00:00Z",
      };

      const parsed = parseUserData(mockUser);

      expect(parsed.id).toBe("456");
      expect(parsed.email).toBe("user@example.com");
      expect(parsed.firstName).toBeUndefined();
      expect(parsed.lastName).toBeUndefined();
    });

    it("should handle missing user_metadata gracefully", () => {
      const mockUser: User = {
        id: "789",
        email: "another@example.com",
        app_metadata: {},
        aud: "authenticated",
        created_at: "2025-01-01T00:00:00Z",
        user_metadata: {},
      };

      const parsed = parseUserData(mockUser);

      expect(parsed.id).toBe("789");
      expect(parsed.email).toBe("another@example.com");
      expect(parsed.firstName).toBeUndefined();
      expect(parsed.lastName).toBeUndefined();
    });
  });

  describe("createAdventure", () => {
    it("should create adventure with all fields", () => {
      const adventure = createAdventure(
        "My Adventure",
        "An exciting adventure",
        "Draft",
        "1.0"
      );

      expect(adventure).toBeDefined();
      expect(adventure?.title).toBe("My Adventure");
      expect(adventure?.description).toBe("An exciting adventure");
      expect(adventure?.tag).toBe("Draft");
      expect(adventure?.version).toBe("1.0");
      expect(adventure?.challenges).toEqual({});
      expect(adventure?.id).toBeDefined();
      expect(adventure?.created_at).toBeDefined();
      expect(adventure?.updated_at).toBeDefined();
    });

    it("should create adventure with default tag", () => {
      const adventure = createAdventure("My Adventure", "Description");

      expect(adventure).toBeDefined();
      expect(adventure?.tag).toBe("Draft");
      expect(adventure?.version).toBe("1.0");
    });

    it("should create adventure with custom tag", () => {
      const adventure = createAdventure(
        "My Adventure",
        "Description",
        "Final"
      );

      expect(adventure).toBeDefined();
      expect(adventure?.tag).toBe("Final");
      expect(adventure?.version).toBe("1.0");
    });

    it("should return undefined for empty title", () => {
      const adventure = createAdventure("", "Description");

      expect(adventure).toBeUndefined();
    });

    it("should return undefined for empty description", () => {
      const adventure = createAdventure("Title", "");

      expect(adventure).toBeUndefined();
    });

    it("should return undefined for both empty title and description", () => {
      const adventure = createAdventure("", "");

      expect(adventure).toBeUndefined();
    });

    it("should create adventure with proper input_aliasing structure", () => {
      const adventure = createAdventure("Title", "Description");

      expect(adventure?.input_aliasing).toBeDefined();
      expect(adventure?.input_aliasing.B1).toBe("");
      expect(adventure?.input_aliasing.B12).toBe("");
      expect(adventure?.input_aliasing.P1).toBe("");
      expect(adventure?.input_aliasing.P12).toBe("");
    });

    it("should create adventure with proper assets structure", () => {
      const adventure = createAdventure("Title", "Description");

      expect(adventure?.assets).toBeDefined();
      expect(adventure?.assets.matImage).toBe("");
      expect(adventure?.assets.audioFiles).toEqual([{ name: "", s3Key: "" }]);
    });

    it("should create adventure with challengeSelectionSettings", () => {
      const adventure = createAdventure("Title", "Description");

      expect(adventure?.challengeSelectionSettings).toBeDefined();
      expect(adventure?.challengeSelectionSettings.startButton).toBe("B1");
      expect(adventure?.challengeSelectionSettings.stopButton).toBe("B2");
    });

    it("should create unique IDs for different adventures", () => {
      const adventure1 = createAdventure("Title 1", "Description 1");
      const adventure2 = createAdventure("Title 2", "Description 2");

      expect(adventure1?.id).toBeDefined();
      expect(adventure2?.id).toBeDefined();
      expect(adventure1?.id).not.toBe(adventure2?.id);
    });

    it("should create ISO 8601 timestamps", () => {
      const adventure = createAdventure("Title", "Description");

      expect(adventure?.created_at).toBeDefined();
      expect(adventure?.updated_at).toBeDefined();

      // Check if it's a valid ISO 8601 string
      const createdDate = new Date(adventure!.created_at);
      const updatedDate = new Date(adventure!.updated_at);

      expect(createdDate).toBeInstanceOf(Date);
      expect(updatedDate).toBeInstanceOf(Date);
      expect(createdDate.toISOString()).toBe(adventure?.created_at);
      expect(updatedDate.toISOString()).toBe(adventure?.updated_at);
    });
  });
});
