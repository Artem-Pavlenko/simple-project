import React, { useEffect, useState } from "react";
import type { IntermediateNode } from "../../utils/types/node.types";
import { GeneralTab } from "./GeneralTab";
import { TriggersTab } from "./TriggersTab";
import * as S from "./styles";

interface NodeEditorProps {
  selectedNode: IntermediateNode;
  onSave: (updatedNode: IntermediateNode) => void;
  onClose: () => void;
}

export const NodeEditor: React.FC<NodeEditorProps> = ({
  selectedNode,
  onSave,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "triggers">("general");
  const [editedNode, setEditedNode] = useState<IntermediateNode>(selectedNode);

  useEffect(() => {
    setEditedNode(selectedNode);
  }, [selectedNode]);

  const handleNodeChange = (field: keyof IntermediateNode, value: unknown) => {
    setEditedNode((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => onSave(editedNode);

  return (
    <S.EditorContainer>
      <S.Header>
        <S.Title>Edit Node</S.Title>
        <S.CloseButton onClick={onClose}>×</S.CloseButton>
      </S.Header>

      <S.TabsContainer>
        <S.Tab
          $isActive={activeTab === "general"}
          onClick={() => setActiveTab("general")}
        >
          GENERAL
        </S.Tab>
        <S.Tab
          $isActive={activeTab === "triggers"}
          onClick={() => setActiveTab("triggers")}
        >
          TRIGGERS
        </S.Tab>
      </S.TabsContainer>

      {activeTab === "general" && (
        <GeneralTab
          editedNode={editedNode}
          onNodeChange={handleNodeChange}
          onSave={handleSave}
          onClose={onClose}
        />
      )}

      {activeTab === "triggers" && (
        <TriggersTab
          editedNode={editedNode}
          onNodeChange={handleNodeChange}
          onSave={handleSave}
          onClose={onClose}
        />
      )}
    </S.EditorContainer>
  );
};
