import type { User } from "@supabase/supabase-js";
import type { AdventureType } from "./types/adventure.types";
import type { TagType } from "./types";

export const parseUserData = (user: User) => ({
  id: user.id,
  email: user.email,
  firstName: user.user_metadata?.firstName,
  lastName: user.user_metadata?.lastName,
});

export const createAdventure = (
  title: string,
  description: string,
  tag: TagType | undefined = "Draft",
  version: string = "1.0"
): AdventureType | undefined => {
  if (title && description) {
    const newAdventure: AdventureType = {
      id: crypto.randomUUID(),
      title: title,
      description: description,
      version: version,
      tag: tag,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      challenges: {},
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
        audioFiles: [{ name: "", s3Key: "" }],
      },
      challengeSelectionSettings: {
        startButton: "B1",
        stopButton: "B2",
      },
    };

    return newAdventure;
  }
};
