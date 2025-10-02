import React from "react";

interface NodeCardProps {
  label: string;
  type: string;
  onAddNode?: () => void;
  onDeleteNode?: () => void;
}

export const NodeCard: React.FC<NodeCardProps> = ({
  label,
  type,
  onAddNode,
  onDeleteNode,
}) => (
  <div style={{ width: "100%", height: "100%", padding: 8 }}>
    <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>

    {type !== "end" && onAddNode && (
      <button
        style={{
          fontSize: 12,
          padding: "2px 8px",
          marginRight: 4,
          position: "absolute",
          left: 8,
          top: 8,
        }}
        onClick={onAddNode}
      >
        + Add node
      </button>
    )}

    {type !== "start" && onDeleteNode && (
      <button
        style={{
          fontSize: 12,
          padding: "2px 8px",
          position: "absolute",
          right: 8,
          top: 8,
        }}
        onClick={onDeleteNode}
      >
        ×
      </button>
    )}
  </div>
);
