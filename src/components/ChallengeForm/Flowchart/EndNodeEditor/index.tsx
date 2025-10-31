import type { FC } from "react";
import type { Edge } from "@xyflow/react";

import type { IEndNode } from "../../../../utils/types/node.types";
import { SelectField, type SelectOption } from "../../../SelectField";
import * as S from "./styles";

const nodeTypeOptions: SelectOption[] = [
  { value: "end", label: "End Node" },
  { value: "node", label: "Intermediate Node" },
];

interface EndNodeEditorProps {
  selectedNode: IEndNode;
  flowEdges: Edge[];
  onConvertToIntermediate: (nodeId: string) => void;
  onConvertToRestart: (nodeId: string) => void;
  onClose: () => void;
}

export const EndNodeEditor: FC<EndNodeEditorProps> = ({
  selectedNode,
  flowEdges,
  onConvertToIntermediate,
  onConvertToRestart,
  onClose,
}) => {
  // Check if this end node is connected via failure or success
  const failureEdge = flowEdges.find(
    (edge) => edge.target === selectedNode.id && edge.sourceHandle === "failure"
  );
  const successEdge = flowEdges.find(
    (edge) => edge.target === selectedNode.id && edge.sourceHandle === "success"
  );

  const handleTypeChange = (newType: string) => {
    if (newType === "node") {
      onConvertToIntermediate(selectedNode.id);
    } else if (newType === "restart") {
      onConvertToRestart(selectedNode.id);
    }
  };

  const getHelpText = () => {
    if (failureEdge && successEdge) {
      return 'Select "Intermediate Node" to convert into an intermediate node with success/failure paths, or "Restart" to restart the current node on failure.';
    } else if (failureEdge) {
      return 'Select "Intermediate Node" to convert into an intermediate node with success/failure paths, or "Restart" to restart the current node on failure.';
    } else if (successEdge) {
      return 'Select "Intermediate Node" to convert this success end node into an intermediate node with success/failure paths.';
    } else {
      return 'Select "Intermediate Node" to convert this end node into an intermediate node with success/failure paths.';
    }
  };

  if (failureEdge) {
    nodeTypeOptions.push({ value: "restart", label: "Restart" });
  }

  return (
    <S.Container>
      <S.Header>
        <S.Title>Edit End Node</S.Title>
        <S.CloseButton onClick={onClose}>×</S.CloseButton>
      </S.Header>

      <SelectField
        value="end"
        onChange={handleTypeChange}
        options={nodeTypeOptions}
        label="Node Type:"
      />

      <S.HelpText>{getHelpText()}</S.HelpText>
    </S.Container>
  );
};
