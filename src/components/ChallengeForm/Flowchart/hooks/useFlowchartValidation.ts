import { useCallback, useEffect, useState } from "react";
import type { Node } from "@xyflow/react";
import {
  validateFlowchart,
  type ValidationResult,
} from "../../../../utils/validation/flowchartValidation";
import type { ChallengeType } from "../../../../utils/types/challenge.types";

interface UseFlowchartValidationProps {
  buildCurrentChallenge: () => ChallengeType | null;
  hasUnsavedChanges: boolean;
  flowNodes: Node[];
}

/**
 * Hook for flowchart validation logic
 * Handles manual validation and automatic validation on changes
 */
export const useFlowchartValidation = ({
  buildCurrentChallenge,
  hasUnsavedChanges,
  flowNodes,
}: UseFlowchartValidationProps) => {
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  // Manual validation
  const handleValidate = useCallback(() => {
    const currentChallenge = buildCurrentChallenge();
    if (!currentChallenge) {
      setValidationResult(null);
      return;
    }

    const result = validateFlowchart(currentChallenge);
    setValidationResult(result);
    setShowValidation(true);
  }, [buildCurrentChallenge]);

  // Automatic validation when challenge or flowNodes change
  useEffect(() => {
    const currentChallenge = buildCurrentChallenge();
    if (currentChallenge && hasUnsavedChanges) {
      const result = validateFlowchart(currentChallenge);
      setValidationResult(result);
    }
  }, [buildCurrentChallenge, hasUnsavedChanges]);

  // Function to navigate to error node
  const handleValidationErrorClick = useCallback(
    (nodeId: string) => {
      // Find the node in ReactFlow and center on it
      const node = flowNodes.find((n) => n.id === nodeId);
      if (node) {
        console.log("Focus on node:", nodeId, node);
      }
      return nodeId; // Return nodeId for external usage (e.g., setSelectedNodeId)
    },
    [flowNodes]
  );

  return {
    validationResult,
    showValidation,
    setShowValidation,
    handleValidate,
    handleValidationErrorClick,
  };
};
