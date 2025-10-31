import React from "react";
import type {
  IntermediateNode,
  EventType,
} from "../../../utils/types/node.types";
import type { Effect } from "../../../utils/types/effects.types";
import type { Trigger } from "../../../utils/types/triggers.types";
import * as S from "../styles";

interface EffectOption {
  value: Effect["type"];
  label: string;
  icon: string;
  createDefault: () => Effect;
}

interface TriggerOption {
  value: Trigger["type"];
  label: string;
  icon: string;
  createDefault: () => Trigger;
}

const EFFECT_OPTIONS: EffectOption[] = [
  {
    value: "play-sound",
    label: "Audio",
    icon: "🔊",
    createDefault: () => ({
      type: "play-sound",
      sound: "Beep",
      pitchModifier: 0,
    }),
  },
  {
    value: "set-rod-speed",
    label: "Set Rod Speed",
    icon: "⚡",
    createDefault: () => ({ type: "set-rod-speed", speed: 0 }),
  },
  {
    value: "change-rod-speed",
    label: "Change Rod Speed",
    icon: "📈",
    createDefault: () => ({ type: "change-rod-speed", speed: 0 }),
  },
  {
    value: "blink-led",
    label: "Blink LED",
    icon: "💡",
    createDefault: () => ({
      type: "blink-led",
      led: "L1",
      seconds: 1,
      color: "#ff0000",
    }),
  },
  {
    value: "set-led",
    label: "Set LED",
    icon: "🌟",
    createDefault: () => ({
      type: "set-led",
      led: "L1",
      on: true,
      color: "#ff0000",
    }),
  },
  {
    value: "success",
    label: "Success",
    icon: "✅",
    createDefault: () => ({ type: "success" }),
  },
  {
    value: "failure",
    label: "Failure",
    icon: "❌",
    createDefault: () => ({ type: "failure" }),
  },
];

const TRIGGER_OPTIONS: TriggerOption[] = [
  {
    value: "pad-press",
    label: "Pad Press",
    icon: "👆",
    createDefault: () => ({ type: "pad-press", pad: "P1" }),
  },
  {
    value: "pad-release",
    label: "Pad Release",
    icon: "👇",
    createDefault: () => ({ type: "pad-release", pad: "P1" }),
  },
  {
    value: "rod-hit",
    label: "Rod Hit",
    icon: "🎯",
    createDefault: () => ({ type: "rod-hit" }),
  },
  {
    value: "timer-once",
    label: "Timer Once",
    icon: "⏰",
    createDefault: () => ({ type: "timer-once", seconds: 5 }),
  },
  {
    value: "timer-periodic",
    label: "Timer Periodic",
    icon: "🔄",
    createDefault: () => ({ type: "timer-periodic", seconds: 5 }),
  },
];

const PAD_OPTIONS = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"] as const;
const LED_OPTIONS = ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"] as const;
const LED_STATE_OPTIONS = [
  { value: "on", label: "On" },
  { value: "off", label: "Off" },
] as const;

interface TriggersTabProps {
  editedNode: IntermediateNode;
  onNodeChange: (field: keyof IntermediateNode, value: unknown) => void;
  onSave: () => void;
  onClose: () => void;
}

export const TriggersTab: React.FC<TriggersTabProps> = ({
  editedNode,
  onNodeChange,
  onSave,
  onClose,
}) => {
  const handleAddTrigger = () => {
    const newTrigger = TRIGGER_OPTIONS[0].createDefault();
    const newEvent: EventType = {
      trigger: newTrigger,
      effects: [],
    };
    const updatedEvents = [...editedNode.events, newEvent];
    onNodeChange("events", updatedEvents);
  };

  const handleUpdateTrigger = (
    triggerIndex: number,
    updatedTrigger: Trigger
  ) => {
    const updatedEvents = editedNode.events.map((event, i) =>
      i === triggerIndex ? { ...event, trigger: updatedTrigger } : event
    );
    onNodeChange("events", updatedEvents);
  };

  const handleRemoveTrigger = (triggerIndex: number) => {
    const updatedEvents = editedNode.events.filter(
      (_, i) => i !== triggerIndex
    );
    onNodeChange("events", updatedEvents);
  };

  const handleAddTriggerEffect = (triggerIndex: number) => {
    const newEffect = EFFECT_OPTIONS[0].createDefault();
    const updatedEvents = editedNode.events.map((event, i) =>
      i === triggerIndex
        ? { ...event, effects: [...event.effects, newEffect] }
        : event
    );
    onNodeChange("events", updatedEvents);
  };

  const handleUpdateTriggerEffect = (
    triggerIndex: number,
    effectIndex: number,
    updatedEffect: Effect
  ) => {
    const updatedEvents = editedNode.events.map((event, i) =>
      i === triggerIndex
        ? {
            ...event,
            effects: event.effects.map((effect, j) =>
              j === effectIndex ? updatedEffect : effect
            ),
          }
        : event
    );
    onNodeChange("events", updatedEvents);
  };

  const handleRemoveTriggerEffect = (
    triggerIndex: number,
    effectIndex: number
  ) => {
    const updatedEvents = editedNode.events.map((event, i) =>
      i === triggerIndex
        ? {
            ...event,
            effects: event.effects.filter((_, j) => j !== effectIndex),
          }
        : event
    );
    onNodeChange("events", updatedEvents);
  };

  const renderTriggerForm = (event: EventType, triggerIndex: number) => {
    const { trigger } = event;

    const handleTriggerTypeChange = (newType: string) => {
      const triggerOption = TRIGGER_OPTIONS.find(
        (option) => option.value === newType
      );
      if (!triggerOption) return;

      const newTrigger = triggerOption.createDefault();
      handleUpdateTrigger(triggerIndex, newTrigger);
    };

    return (
      <S.EffectRow key={triggerIndex}>
        <S.SmallLabel>When:</S.SmallLabel>
        <S.EffectHeader>
          <S.EffectTypeSelect
            value={trigger.type}
            onChange={(e) => handleTriggerTypeChange(e.target.value)}
          >
            {TRIGGER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </S.EffectTypeSelect>
          <S.RemoveEffectButton
            onClick={() => handleRemoveTrigger(triggerIndex)}
          >
            ×
          </S.RemoveEffectButton>
        </S.EffectHeader>

        <S.EffectParams>
          {(trigger.type === "pad-press" || trigger.type === "pad-release") && (
            <S.EffectSelect
              value={trigger.pad}
              onChange={(e) =>
                handleUpdateTrigger(triggerIndex, {
                  ...trigger,
                  pad: e.target.value as (typeof PAD_OPTIONS)[number],
                })
              }
            >
              {PAD_OPTIONS.map((pad) => (
                <option key={pad} value={pad}>
                  {pad}
                </option>
              ))}
            </S.EffectSelect>
          )}

          {(trigger.type === "timer-once" ||
            trigger.type === "timer-periodic") && (
            <S.EffectInput
              type="number"
              placeholder="Seconds"
              value={trigger.seconds}
              onChange={(e) =>
                handleUpdateTrigger(triggerIndex, {
                  ...trigger,
                  seconds: parseInt(e.target.value) || 0,
                })
              }
            />
          )}
        </S.EffectParams>

        {/* Trigger Effects */}
        <S.NestedContainer>
          <S.SmallLabel>Then:</S.SmallLabel>
          {event.effects.length === 0 ? (
            <S.SmallEmptyEffects>No effects</S.SmallEmptyEffects>
          ) : (
            <S.EffectsList>
              {event.effects.map((effect: Effect, effectIndex: number) =>
                renderTriggerEffectForm(effect, triggerIndex, effectIndex)
              )}
            </S.EffectsList>
          )}
          <S.SmallButton onClick={() => handleAddTriggerEffect(triggerIndex)}>
            Add Effect
          </S.SmallButton>
        </S.NestedContainer>
      </S.EffectRow>
    );
  };

  const renderTriggerEffectForm = (
    effect: Effect,
    triggerIndex: number,
    effectIndex: number
  ) => {
    const handleEffectTypeChange = (newType: string) => {
      const effectOption = EFFECT_OPTIONS.find(
        (option) => option.value === newType
      );
      if (!effectOption) return;

      const newEffect = effectOption.createDefault();
      handleUpdateTriggerEffect(triggerIndex, effectIndex, newEffect);
    };

    return (
      <S.EffectCard key={effectIndex}>
        <S.EffectHeader>
          <S.SmallEffectTypeSelect
            value={effect.type}
            onChange={(e) => handleEffectTypeChange(e.target.value)}
          >
            {EFFECT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </S.SmallEffectTypeSelect>
          <S.RemoveEffectButton
            onClick={() => handleRemoveTriggerEffect(triggerIndex, effectIndex)}
          >
            ×
          </S.RemoveEffectButton>
        </S.EffectHeader>

        <S.EffectParams>
          {effect.type === "play-sound" && (
            <>
              <S.EffectInput
                type="text"
                placeholder="Sound file"
                value={effect.sound}
                onChange={(e) =>
                  handleUpdateTriggerEffect(triggerIndex, effectIndex, {
                    ...effect,
                    sound: e.target.value,
                  })
                }
              />
              <S.EffectInput
                type="number"
                placeholder="Pitch"
                value={effect.pitchModifier}
                onChange={(e) =>
                  handleUpdateTriggerEffect(triggerIndex, effectIndex, {
                    ...effect,
                    pitchModifier: parseInt(e.target.value) || 0,
                  })
                }
              />
            </>
          )}

          {(effect.type === "set-rod-speed" ||
            effect.type === "change-rod-speed") && (
            <S.EffectInput
              type="number"
              placeholder="Speed"
              value={effect.speed}
              onChange={(e) =>
                handleUpdateTriggerEffect(triggerIndex, effectIndex, {
                  ...effect,
                  speed: parseInt(e.target.value) || 0,
                })
              }
            />
          )}

          {effect.type === "blink-led" && (
            <>
              <S.EffectSelect
                value={effect.led}
                onChange={(e) =>
                  handleUpdateTriggerEffect(triggerIndex, effectIndex, {
                    ...effect,
                    led: e.target.value as (typeof LED_OPTIONS)[number],
                  })
                }
              >
                {LED_OPTIONS.map((led) => (
                  <option key={led} value={led}>
                    {led}
                  </option>
                ))}
              </S.EffectSelect>
              <S.EffectInput
                type="number"
                placeholder="Seconds"
                value={effect.seconds}
                onChange={(e) =>
                  handleUpdateTriggerEffect(triggerIndex, effectIndex, {
                    ...effect,
                    seconds: parseInt(e.target.value) || 0,
                  })
                }
              />
              <S.EffectInput
                type="color"
                value={effect.color}
                onChange={(e) =>
                  handleUpdateTriggerEffect(triggerIndex, effectIndex, {
                    ...effect,
                    color: e.target.value as `#${string}`,
                  })
                }
              />
            </>
          )}

          {effect.type === "set-led" && (
            <>
              <S.EffectSelect
                value={effect.led}
                onChange={(e) =>
                  handleUpdateTriggerEffect(triggerIndex, effectIndex, {
                    ...effect,
                    led: e.target.value as (typeof LED_OPTIONS)[number],
                  })
                }
              >
                {LED_OPTIONS.map((led) => (
                  <option key={led} value={led}>
                    {led}
                  </option>
                ))}
              </S.EffectSelect>
              <S.EffectSelect
                value={effect.on ? "on" : "off"}
                onChange={(e) =>
                  handleUpdateTriggerEffect(triggerIndex, effectIndex, {
                    ...effect,
                    on: e.target.value === "on",
                  })
                }
              >
                {LED_STATE_OPTIONS.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </S.EffectSelect>
              {effect.on && (
                <S.EffectInput
                  type="color"
                  value={effect.color}
                  onChange={(e) =>
                    handleUpdateTriggerEffect(triggerIndex, effectIndex, {
                      ...effect,
                      color: e.target.value as `#${string}`,
                    })
                  }
                />
              )}
            </>
          )}
        </S.EffectParams>
      </S.EffectCard>
    );
  };

  return (
    <S.TabContent>
      <S.Label>Event Triggers</S.Label>
      <S.EffectsList>
        {editedNode.events.length === 0 ? (
          <S.EmptyEffects>No triggers</S.EmptyEffects>
        ) : (
          editedNode.events.map((event, index) =>
            renderTriggerForm(event, index)
          )
        )}
      </S.EffectsList>
      <S.AddEffectButton onClick={handleAddTrigger}>
        Add Trigger
      </S.AddEffectButton>

      <S.ButtonGroup>
        <S.SaveButton onClick={onSave}>Save</S.SaveButton>
        <S.CancelButton onClick={onClose}>Cancel</S.CancelButton>
      </S.ButtonGroup>
    </S.TabContent>
  );
};
