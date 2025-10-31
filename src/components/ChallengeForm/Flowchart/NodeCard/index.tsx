import React from "react";
import { Handle, Position } from "@xyflow/react";

import type {
  NodeVariants,
  IntermediateNode,
} from "../../../../utils/types/node.types";
import type { Effect } from "../../../../utils/types/effects.types";
import type { Trigger } from "../../../../utils/types/triggers.types";
import * as S from "./styles";
import { handleStyles } from "./styles";

interface NodeCardProps {
  label: string;
  type: string;
  nodeData: NodeVariants;
  isSelected?: boolean;
  onAddNode?: () => void;
  onDeleteNode?: () => void;
  onNodeClick?: () => void;
  onAddSuccessNode?: () => void;
  onAddFailureNode?: () => void;
  onCopyNode?: () => void;
  hasSuccessNode?: boolean;
  hasFailureEndNode?: boolean; // True if failure leads to an end node with outcome: "failure"
}

export const NodeCard: React.FC<NodeCardProps> = ({
  type,
  label,
  nodeData,
  onAddNode,
  onCopyNode,
  onNodeClick,
  onDeleteNode,
  onAddSuccessNode,
  onAddFailureNode,
  isSelected = false,
  hasSuccessNode = false,
  hasFailureEndNode = false,
}) => {
  const isIntermediateNode = nodeData.type === "node";
  const cursor = type !== "start" ? "pointer" : "default";

  // Check if failure is RESTART (self-reference: failure === node.id)
  const isRestartFailure =
    isIntermediateNode &&
    (nodeData as IntermediateNode).failure ===
      (nodeData as IntermediateNode).id;

  // Get timeout effects if they exist
  const timeoutEffects =
    (isIntermediateNode && (nodeData as IntermediateNode).timeOut?.effects) ||
    [];

  return (
    <S.CardContainer
      $isSelected={isSelected}
      $cursor={cursor}
      $type={type}
      onClick={type !== "start" ? onNodeClick : undefined}
    >
      {/* Input handle (top) - for incoming connections, disabled for start node */}
      {type !== "start" && (
        <Handle
          type="target"
          position={Position.Top}
          style={handleStyles.target}
        />
      )}

      <S.NodeTitle>{label}</S.NodeTitle>

      {isIntermediateNode && nodeData.description && (
        <S.NodeDescription>{nodeData.description}</S.NodeDescription>
      )}

      {/* Timeout section */}
      {isIntermediateNode && (nodeData as IntermediateNode).timeOut && (
        <S.TimeoutSection>
          <S.TimeoutIcon>⏱️</S.TimeoutIcon>
          {(nodeData as IntermediateNode).timeOut?.seconds} seconds
          {timeoutEffects.length > 0 && (
            <S.TimeoutEffectCount>
              ({timeoutEffects.length} effects)
            </S.TimeoutEffectCount>
          )}
        </S.TimeoutSection>
      )}

      {/* Timeout effects list */}
      {isIntermediateNode && timeoutEffects.length > 0 && (
        <>
          {/* Show single effect inline */}
          {timeoutEffects.length === 1 && (
            <S.EffectItem>
              <S.EffectIcon>
                {getEffectIcon(timeoutEffects[0].type)}
              </S.EffectIcon>
              {getEffectText(timeoutEffects[0])}
            </S.EffectItem>
          )}

          {/* Show expandable list for multiple effects */}
          {timeoutEffects.length > 1 && (
            <S.TimeoutEffectsList>
              {timeoutEffects.map((effect, index) => (
                <S.EffectItem key={`timeout-${index}`}>
                  <S.EffectIcon>{getEffectIcon(effect.type)}</S.EffectIcon>
                  {getEffectText(effect)}
                </S.EffectItem>
              ))}
            </S.TimeoutEffectsList>
          )}
        </>
      )}

      {/* Entry Effects */}
      {isIntermediateNode &&
        (nodeData as IntermediateNode).entryEffects?.length > 0 && (
          <>
            <S.SectionTitle>Entry effects</S.SectionTitle>
            {(nodeData as IntermediateNode).entryEffects.map(
              (effect, index) => (
                <S.EffectItem key={index}>
                  <S.EffectIcon>{getEffectIcon(effect.type)}</S.EffectIcon>
                  {getEffectText(effect)}
                </S.EffectItem>
              )
            )}
          </>
        )}

      {/* Triggers */}
      {isIntermediateNode &&
        (nodeData as IntermediateNode).events?.length > 0 && (
          <>
            <S.SectionTitle>Triggers</S.SectionTitle>
            {(nodeData as IntermediateNode).events.map((event, index) => (
              <S.TriggerItem key={index}>
                <S.TriggerCondition>
                  When {getTriggerText(event.trigger)}
                </S.TriggerCondition>
                {event.effects.map((effect, effectIndex) => (
                  <S.TriggerEffect key={effectIndex}>
                    <S.TriggerEffectIcon>
                      {getEffectIcon(effect.type)}
                    </S.TriggerEffectIcon>
                    {getEffectText(effect)}
                  </S.TriggerEffect>
                ))}
              </S.TriggerItem>
            ))}
          </>
        )}

      {/* Output handles for intermediate nodes */}
      {type === "node" && (
        <>
          {/* Success handle (right-top) - always show connection point */}
          <Handle
            type="source"
            position={Position.Right}
            id="success"
            style={handleStyles.sourceSuccess}
          />
          {/* Success add button - only show if no success node exists */}
          {!hasSuccessNode && onAddSuccessNode && (
            <S.AddSuccessButton
              style={{ right: 5, top: "28%" }}
              onClick={(e) => {
                e.stopPropagation();
                onAddSuccessNode();
              }}
              title="Add Success Node"
            >
              +
            </S.AddSuccessButton>
          )}

          {/* Failure handle (right-bottom) - always show connection point */}
          <Handle
            type="source"
            position={Position.Right}
            id="failure"
            style={handleStyles.sourceFailure}
          />

          {/* RESTART indicator - show if failure is RESTART */}
          {isRestartFailure && (
            <>
              {/* Invisible target point at bottom of card */}
              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(239, 68, 68, 0.3)",
                  border: "1px solid #ef4444",
                  pointerEvents: "none",
                  zIndex: 5,
                }}
              />

              {/* SVG Arrow connecting failure handle to bottom point */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  zIndex: 4,
                  overflow: "visible",
                }}
              >
                <svg
                  width="100%"
                  height="100%"
                  style={{ overflow: "visible" }}
                  viewBox="0 0 250 200"
                  preserveAspectRatio="none"
                >
                  <title>Failure restarts this node</title>
                  <defs>
                    <marker
                      id="restart-arrowhead"
                      markerWidth="3"
                      markerHeight="2"
                      refX="2.5"
                      refY="1"
                      orient="auto"
                    >
                      <polygon points="0 0, 3 1, 0 2" fill="#ef4444" />
                    </marker>
                  </defs>

                  {/* Curved path starting from failure handle (right edge at 75% height) */}
                  <path
                    d="M 250 150 Q 285 150 285 175 Q 285 230 190 230 Q 125 230 125 200"
                    stroke="#ef4444"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#restart-arrowhead)"
                  />
                </svg>
              </div>
            </>
          )}

          {/* Failure add button - hide only if failure leads to an end node with outcome: "failure" */}
          {!hasFailureEndNode && onAddFailureNode && (
            <S.AddFailureButton
              style={{ right: 5, top: "70%" }}
              onClick={(e) => {
                e.stopPropagation();
                onAddFailureNode();
              }}
              title={
                isRestartFailure ? "Edit Restart Action" : "Add Failure Node"
              }
            >
              +
            </S.AddFailureButton>
          )}
        </>
      )}

      {/* Output handle for start node */}
      {type === "start" && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={handleStyles.sourceDefault}
        />
      )}

      {type !== "start" && onDeleteNode && (
        <S.DeleteButton
          onClick={(e) => {
            e.stopPropagation();
            onDeleteNode();
          }}
        >
          ×
        </S.DeleteButton>
      )}

      <S.AddButtonContainer>
        {onAddNode && (
          <S.AddButton
            onClick={(e) => {
              e.stopPropagation();
              onAddNode();
            }}
          >
            +
          </S.AddButton>
        )}
        {type === "node" && onCopyNode && (
          <S.CopyButton
            style={{ right: onAddNode ? 34 : 4 }} // Position based on whether add button exists
            onClick={(e) => {
              e.stopPropagation();
              onCopyNode();
            }}
          >
            📋
          </S.CopyButton>
        )}
      </S.AddButtonContainer>
    </S.CardContainer>
  );
};

const getEffectIcon = (effectType: string) => {
  switch (effectType) {
    case "play-sound":
      return "🔊";
    case "blink-led":
      return "💡";
    case "set-led":
      return "💡";
    case "set-rod-speed":
      return "⚡";
    case "change-rod-speed":
      return "⚡";
    case "success":
      return "✅";
    case "failure":
      return "❌";
    default:
      return "🔹";
  }
};

const getEffectText = (effect: Effect) => {
  switch (effect.type) {
    case "play-sound":
      return effect.sound || "Beep";
    case "blink-led":
      return `Blink ${effect.led || "L1"} ${effect.seconds || 1}s`;
    case "set-led":
      return `${effect.led || "L1"} ${effect.on ? "ON" : "OFF"}`;
    case "set-rod-speed":
      return `Rod speed ${effect.speed || 0} rpm`;
    case "change-rod-speed":
      return `Rod speed +${effect.speed || 0} rpm`;
    case "success":
      return "Success";
    case "failure":
      return "Failure";
    default:
      return effect.type;
  }
};

const getTriggerText = (trigger: Trigger) => {
  switch (trigger.type) {
    case "pad-press":
      return `${trigger.pad || "P3"} is pressed`;
    case "pad-release":
      return `${trigger.pad || "P3"} is released`;
    case "timer-once":
      return `${trigger.seconds || 0} seconds elapsed`;
    case "timer-periodic":
      return `Every ${trigger.seconds || 0} seconds`;
    case "rod-hit":
      return "rod hit";
    default:
      return trigger.type;
  }
};
