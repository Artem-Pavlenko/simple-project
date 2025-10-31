import React from "react";
import type { IntermediateNode } from "../../../utils/types/node.types";
import type { Effect } from "../../../utils/types/effects.types";
import * as S from "../styles";
import type { LedType } from "../../../utils/types/adventure.types";

interface EffectOption {
  value: Effect["type"];
  label: string;
  icon: string;
  createDefault: () => Effect;
}

const EFFECT_OPTIONS: EffectOption[] = [
  {
    value: "play-sound",
    label: "Audio",
    icon: "🔊",
    createDefault: () => ({
      type: "play-sound",
      sound: "Beep",
      pitchModifier: 1,
    }),
  },
  {
    value: "set-rod-speed",
    label: "Set Rod Speed",
    icon: "⚡",
    createDefault: () => ({ type: "set-rod-speed", speed: 1 }),
  },
  {
    value: "change-rod-speed",
    label: "Change Rod Speed",
    icon: "📈",
    createDefault: () => ({ type: "change-rod-speed", speed: 1 }),
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

const LED_OPTIONS: LedType[] = ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"];
const LED_STATE_OPTIONS = [
  { value: "on", label: "On" },
  { value: "off", label: "Off" },
] as const;

interface GeneralTabProps {
  editedNode: IntermediateNode;
  onNodeChange: (field: keyof IntermediateNode, value: unknown) => void;
  onSave: () => void;
  onClose: () => void;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({
  editedNode,
  onNodeChange,
  onSave,
  onClose,
}) => {
  const handleAddEffect = () => {
    const newEffect = EFFECT_OPTIONS[0].createDefault();
    const updatedEffects = [...editedNode.entryEffects, newEffect];
    onNodeChange("entryEffects", updatedEffects);
  };

  const handleUpdateEffect = (index: number, updatedEffect: Effect) => {
    const updatedEffects = editedNode.entryEffects.map((effect, i) =>
      i === index ? updatedEffect : effect
    );
    onNodeChange("entryEffects", updatedEffects);
  };

  const handleRemoveEffect = (index: number) => {
    const updatedEffects = editedNode.entryEffects.filter(
      (_, i) => i !== index
    );
    onNodeChange("entryEffects", updatedEffects);
  };

  // Timeout effects handlers
  const handleAddTimeoutEffect = () => {
    if (!editedNode.timeOut) return;

    const newEffect = EFFECT_OPTIONS[0].createDefault();
    const updatedTimeoutEffects = [
      ...(editedNode.timeOut.effects || []),
      newEffect,
    ];

    onNodeChange("timeOut", {
      ...editedNode.timeOut,
      effects: updatedTimeoutEffects,
    });
  };

  const handleUpdateTimeoutEffect = (index: number, updatedEffect: Effect) => {
    if (!editedNode.timeOut) return;

    const updatedTimeoutEffects = (editedNode.timeOut.effects || []).map(
      (effect, i) => (i === index ? updatedEffect : effect)
    );

    onNodeChange("timeOut", {
      ...editedNode.timeOut,
      effects: updatedTimeoutEffects,
    });
  };

  const handleRemoveTimeoutEffect = (index: number) => {
    if (!editedNode.timeOut) return;

    const updatedTimeoutEffects = (editedNode.timeOut.effects || []).filter(
      (_, i) => i !== index
    );

    onNodeChange("timeOut", {
      ...editedNode.timeOut,
      effects: updatedTimeoutEffects,
    });
  };

  const renderEffectForm = (effect: Effect, index: number) => {
    const handleEffectTypeChange = (newType: string) => {
      const effectOption = EFFECT_OPTIONS.find(
        (option) => option.value === newType
      );
      if (!effectOption) return;

      const newEffect = effectOption.createDefault();
      handleUpdateEffect(index, newEffect);
    };

    return (
      <S.EffectRow key={index}>
        <S.EffectHeader>
          <S.EffectTypeSelect
            value={effect.type}
            onChange={(e) => handleEffectTypeChange(e.target.value)}
          >
            {EFFECT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </S.EffectTypeSelect>
          <S.RemoveEffectButton onClick={() => handleRemoveEffect(index)}>
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
                  handleUpdateEffect(index, {
                    ...effect,
                    sound: e.target.value,
                  })
                }
              />
              <S.EffectInput
                type="number"
                min="1"
                placeholder="Pitch"
                value={effect.pitchModifier || 1}
                onChange={(e) =>
                  handleUpdateEffect(index, {
                    ...effect,
                    pitchModifier: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
              />
            </>
          )}

          {(effect.type === "set-rod-speed" ||
            effect.type === "change-rod-speed") && (
            <S.EffectInput
              type="number"
              min="1"
              placeholder="Speed"
              value={effect.speed || 1}
              onChange={(e) =>
                handleUpdateEffect(index, {
                  ...effect,
                  speed: Math.max(1, parseInt(e.target.value) || 1),
                })
              }
            />
          )}

          {effect.type === "blink-led" && (
            <>
              <S.EffectSelect
                value={effect.led}
                onChange={(e) =>
                  handleUpdateEffect(index, {
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
                min="1"
                placeholder="Seconds"
                value={effect.seconds || 1}
                onChange={(e) =>
                  handleUpdateEffect(index, {
                    ...effect,
                    seconds: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
              />
              <S.EffectInput
                type="color"
                value={effect.color}
                onChange={(e) =>
                  handleUpdateEffect(index, {
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
                  handleUpdateEffect(index, {
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
                  handleUpdateEffect(index, {
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
                    handleUpdateEffect(index, {
                      ...effect,
                      color: e.target.value as `#${string}`,
                    })
                  }
                />
              )}
            </>
          )}
        </S.EffectParams>
      </S.EffectRow>
    );
  };

  const renderTimeoutEffectForm = (effect: Effect, index: number) => {
    const handleEffectTypeChange = (newType: string) => {
      const effectOption = EFFECT_OPTIONS.find(
        (option) => option.value === newType
      );
      if (!effectOption) return;

      const newEffect = effectOption.createDefault();
      handleUpdateTimeoutEffect(index, newEffect);
    };

    return (
      <S.EffectRow key={`timeout-${index}`}>
        <S.EffectHeader>
          <S.EffectTypeSelect
            value={effect.type}
            onChange={(e) => handleEffectTypeChange(e.target.value)}
          >
            {EFFECT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </S.EffectTypeSelect>
          <S.RemoveEffectButton
            onClick={() => handleRemoveTimeoutEffect(index)}
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
                  handleUpdateTimeoutEffect(index, {
                    ...effect,
                    sound: e.target.value,
                  })
                }
              />
              <S.EffectInput
                type="number"
                min="1"
                placeholder="Pitch"
                value={effect.pitchModifier || 1}
                onChange={(e) =>
                  handleUpdateTimeoutEffect(index, {
                    ...effect,
                    pitchModifier: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
              />
            </>
          )}

          {(effect.type === "set-rod-speed" ||
            effect.type === "change-rod-speed") && (
            <S.EffectInput
              type="number"
              min="1"
              placeholder="Speed"
              value={effect.speed || 1}
              onChange={(e) =>
                handleUpdateTimeoutEffect(index, {
                  ...effect,
                  speed: Math.max(1, parseInt(e.target.value) || 1),
                })
              }
            />
          )}

          {effect.type === "blink-led" && (
            <>
              <S.EffectSelect
                value={effect.led}
                onChange={(e) =>
                  handleUpdateTimeoutEffect(index, {
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
                min="1"
                placeholder="Seconds"
                value={effect.seconds || 1}
                onChange={(e) =>
                  handleUpdateTimeoutEffect(index, {
                    ...effect,
                    seconds: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
              />
              <S.EffectInput
                type="color"
                value={effect.color}
                onChange={(e) =>
                  handleUpdateTimeoutEffect(index, {
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
                  handleUpdateTimeoutEffect(index, {
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
                  handleUpdateTimeoutEffect(index, {
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
                    handleUpdateTimeoutEffect(index, {
                      ...effect,
                      color: e.target.value as `#${string}`,
                    })
                  }
                />
              )}
            </>
          )}
        </S.EffectParams>
      </S.EffectRow>
    );
  };

  return (
    <S.TabContent>
      <S.FormGroup>
        <S.Label>Title</S.Label>
        <S.Input
          type="text"
          value={editedNode.title}
          onChange={(e) => onNodeChange("title", e.target.value)}
          placeholder="Node title"
        />
      </S.FormGroup>

      <S.FormGroup>
        <S.Label>Description</S.Label>
        <S.Textarea
          value={editedNode.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onNodeChange("description", e.target.value)
          }
          placeholder="Node description"
          rows={3}
        />
      </S.FormGroup>

      <S.FormGroup>
        <S.Label>Timeout (seconds)</S.Label>
        <S.Input
          type="number"
          min="1"
          value={editedNode.timeOut?.seconds || ""}
          onChange={(e) => {
            const seconds = parseInt(e.target.value);
            if (isNaN(seconds) || seconds <= 0) {
              onNodeChange("timeOut", null);
            } else {
              onNodeChange("timeOut", {
                type: "timer-once",
                seconds: Math.max(1, seconds),
                effects: editedNode.timeOut?.effects || [],
              });
            }
          }}
          placeholder="Leave empty for no timeout"
        />
      </S.FormGroup>

      {/* Timeout Effects Section - Only show if timeout is set */}
      {editedNode.timeOut && (
        <S.EffectsContainer>
          <S.Label>Timeout Effects</S.Label>
          <S.EffectsList>
            {!editedNode.timeOut.effects ||
            editedNode.timeOut.effects.length === 0 ? (
              <S.EmptyEffects>No timeout effects</S.EmptyEffects>
            ) : (
              editedNode.timeOut.effects.map((effect, index) =>
                renderTimeoutEffectForm(effect, index)
              )
            )}
          </S.EffectsList>
          <S.AddEffectButton onClick={handleAddTimeoutEffect}>
            Add Timeout Effect
          </S.AddEffectButton>
        </S.EffectsContainer>
      )}

      <S.EffectsContainer>
        <S.Label>Entry Effects</S.Label>
        <S.EffectsList>
          {editedNode.entryEffects.length === 0 ? (
            <S.EmptyEffects>No effects</S.EmptyEffects>
          ) : (
            editedNode.entryEffects.map((effect, index) =>
              renderEffectForm(effect, index)
            )
          )}
        </S.EffectsList>
        <S.AddEffectButton onClick={handleAddEffect}>
          Add Effect
        </S.AddEffectButton>
      </S.EffectsContainer>

      <S.ButtonGroup>
        <S.SaveButton onClick={onSave}>Save</S.SaveButton>
        <S.CancelButton onClick={onClose}>Cancel</S.CancelButton>
      </S.ButtonGroup>
    </S.TabContent>
  );
};
