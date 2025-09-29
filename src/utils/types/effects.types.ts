// Effects define what actions occur in response to triggers or node transitions.
import type { LedType } from "./adventure.types";

export type Effect =
  | PlaySoundType
  | SetRodSpeedType
  | ChangeRodSpeedType
  | SetRodHeightType
  | SuccessType
  | FailureType
  | BlinkLedType
  | SetLedType;

export interface EffectsTypes {
  PlaySound: "play-sound";
  SetRodSpeed: "set-rod-speed";
  ChangeRodSpeed: "change-rod-speed";
  SetRodHeight: "set-rod-height";
  Success: "success";
  Failure: "failure";
  BlinkLed: "blink-led";
  SetLed: "set-led";
}

export type PlaySoundType = {
  type: EffectsTypes["PlaySound"];
  sound: string; // To check with Adventure: audioFiles
  pitchModifier: number; // integer
};

export type SetRodSpeedType = {
  type: EffectsTypes["SetRodSpeed"];
  speed: number;
};
export type ChangeRodSpeedType = {
  type: EffectsTypes["ChangeRodSpeed"];
  speed: number;
};

export type SetRodHeightType = {
  type: EffectsTypes["SetRodHeight"];
  height: number;
};

export type SuccessType = {
  type: EffectsTypes["Success"];
};

export type FailureType = {
  type: EffectsTypes["Failure"];
};

export type HexType = `#${string}`;

export type BlinkLedType = {
  type: "blink-led";
  led: LedType;
  seconds: number;
  color: HexType;
};

export type SetLedType = {
  type: "set-led";
  led: LedType;
  color: HexType;
  on: boolean;
};
