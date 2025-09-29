// Triggers are event-driven and define the conditions under which effects are executed.
import type { InputType } from "./adventure.types";

export type Trigger =
  | RodHit
  | InputRelease
  | InputPress
  | InputsDown
  | TimerPeriodic
  | TimerOnce;

export interface ITriggerTypes {
  RodHit: "rod-hit";
  InputRelease: "pad-release";
  InputPress: "pad-press";
  InputsDown: "inputs-down";
  TimerPeriodic: "timer-periodic";
  TimerOnce: "timer-once";
}

export type RodHit = {
  type: ITriggerTypes["RodHit"];
};

export type InputRelease = {
  type: ITriggerTypes["InputRelease"];
  pad: InputType;
};

export type InputPress = {
  type: ITriggerTypes["InputPress"];
  pad: InputType;
};

type InputsDown = {
  type: ITriggerTypes["InputsDown"];
  inputs: InputType[];
};

export type TimerPeriodic = {
  type: ITriggerTypes["TimerPeriodic"];
  seconds: number;
};

export type TimerOnce = {
  type: ITriggerTypes["TimerOnce"];
  seconds: number;
};
