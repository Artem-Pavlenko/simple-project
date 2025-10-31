import styled from "styled-components";

interface CardContainerProps {
  $isSelected: boolean;
  $cursor: string;
  $type: string;
}

export const CardContainer = styled.div<CardContainerProps>`
  position: relative;
  border-radius: 8px;
  padding: 12px;
  min-width: ${(props) => (props.$type === "start" ? "10px" : "200px")};
  max-width: 250px;
  transition: all 1s ease-in-out;
  cursor: ${(props) => props.$cursor};

  ${(props) =>
    props.$isSelected &&
    `
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
      }
    }
    animation: pulse 2s infinite;
  `}

  background: ${(props) => {
    if (props.$type === "start") return "#e3f0ff";
    if (props.$type === "end") return "#6ee7b7";
    return "#f9fbe7";
  }};
`;

export const NodeTitle = styled.div`
  font-weight: bold;
  color: #333;
  font-size: 14px;
  margin-bottom: 2px;
  width: 150px;
  margin-bottom: 20px;
`;

export const NodeDescription = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
  line-height: 1.2;
`;

export const NodeType = styled.div`
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  font-weight: 500;
`;

export const ActionButton = styled.button`
  position: absolute;
  padding: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: none;
  color: #fff;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const DeleteButton = styled(ActionButton)`
  top: 4px;
  right: 4px;
  background: #dc3545;

  &:hover {
    background: #c82333;
  }
`;

export const AddButton = styled(ActionButton)`
  background: #4f46e5;

  &:hover {
    background: #3730a3;
  }
`;

export const AddSuccessButton = styled(ActionButton)`
  background: #22c55e;

  &:hover {
    background: #16a34a;
  }
`;

export const AddFailureButton = styled(ActionButton)`
  background: #ef4444;

  &:hover {
    background: #dc2626;
  }
`;

export const CopyButton = styled(ActionButton)`
  background: #8b5cf6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;

  &:hover {
    background: #7c3aed;
  }
`;

export const AddButtonContainer = styled.div`
  position: absolute;
  top: 4px;
  right: 34px;
`;

export const TimeoutSection = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
  font-size: 11px;
  color: #666;
`;

export const TimeoutIcon = styled.span`
  margin-right: 4px;
  font-size: 12px;
`;

export const TimeoutEffectCount = styled.span`
  margin-left: 4px;
  font-size: 10px;
  color: #888;
  font-style: italic;
`;

export const ExpandButton = styled.button<{ $expanded: boolean }>`
  background: none;
  border: none;
  margin-left: 4px;
  padding: 2px 4px;
  cursor: pointer;
  font-size: 10px;
  color: #666;
  transition: transform 0.3s ease, color 0.2s ease;
  transform: ${({ $expanded }) =>
    $expanded ? "rotate(90deg)" : "rotate(0deg)"};
  position: relative;
  z-index: 10;

  &:hover {
    color: #333;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 2px;
  }

  &:active {
    transform: ${({ $expanded }) =>
      $expanded ? "rotate(90deg) scale(0.9)" : "rotate(0deg) scale(0.9)"};
  }

  &:focus {
    outline: none;
  }
`;

export const TimeoutEffectsList = styled.div`
  margin-top: 4px;
  margin-left: 16px;
  border-left: 2px solid #e0e0e0;
  padding-left: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 4px 8px;
  overflow: hidden;
  will-change: height, opacity;
`;

export const SectionTitle = styled.div`
  font-size: 11px;
  font-weight: bold;
  color: #555;
  margin: 8px 0 4px 0;
`;

export const EffectItem = styled.div`
  display: flex;
  align-items: center;
  margin: 2px 0;
  font-size: 10px;
  color: #666;
`;

export const EffectIcon = styled.span`
  margin-right: 4px;
  font-size: 11px;
`;

export const TriggerItem = styled.div`
  margin: 4px 0;
`;

export const TriggerCondition = styled.div`
  font-size: 10px;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
`;

export const TriggerEffect = styled.div`
  display: flex;
  align-items: center;
  margin: 1px 0 1px 12px;
  font-size: 9px;
  color: #666;
`;

export const TriggerEffectIcon = styled.span`
  margin-right: 3px;
  font-size: 10px;
`;

// Handle styles object for ReactFlow components (cannot be styled-components)
export const handleStyles = {
  target: {
    background: "transparent",
    width: 8,
    height: 8,
    border: "none",
  },
  sourceSuccess: {
    background: "#22c55e",
    width: 8,
    height: 8,
    top: "25%",
  },
  sourceFailure: {
    background: "#ef4444",
    width: 15,
    height: 15,
    top: "75%",
  },
  sourceDefault: {
    background: "#3b82f6",
    width: 15,
    height: 15,
  },
} as const;

export const RestartIndicator = styled.div`
  position: absolute;
  background: #ff6b35;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background: #ff5722;
    transform: scale(1.1);
  }
`;
