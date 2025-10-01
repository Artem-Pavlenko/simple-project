// The Adventure groups all related challenges and defines global settings that apply across them.
import type { Challenge } from "./challenge.types";

export type ButtonType =
  | "B1"
  | "B2"
  | "B3"
  | "B4"
  | "B5"
  | "B6"
  | "B7"
  | "B8"
  | "B9"
  | "B10"
  | "B11"
  | "B12";
export type PadType =
  | "P1"
  | "P2"
  | "P3"
  | "P4"
  | "P5"
  | "P6"
  | "P7"
  | "P8"
  | "P9"
  | "P10"
  | "P11"
  | "P12";
export type LedType =
  | "L1"
  | "L2"
  | "L3"
  | "L4"
  | "L5"
  | "L6"
  | "L7"
  | "L8"
  | "L9"
  | "L10"
  | "L11"
  | "L12";

export type InputType = ButtonType | PadType;

export type InputAliasingType = {
  [key in InputType]: string;
};

export type s3KeyType = string;

export type StartButtonType = InputType;

export type StopButtonType = InputType;

export type ChallengeSelectionSettingsType = {
  startButton: StartButtonType;
  stopButton: StopButtonType;
};

export type AdventureType = {
  id: string;
  title: string;
  description: string;
  version: string;
  created_at: string;
  updated_at: string;
  input_aliasing: InputAliasingType;
  assets: {
    matImage: s3KeyType;
    audioFiles: [
      {
        name: string;
        s3Key: s3KeyType;
      }
    ];
  };
  challengeSelectionSettings: ChallengeSelectionSettingsType;
  challenges: {
    [key: string]: Challenge;
  };
};
