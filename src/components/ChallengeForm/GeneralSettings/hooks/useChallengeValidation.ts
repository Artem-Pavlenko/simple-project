import { useMemo } from "react";
import type { ChallengeType } from "../../../../utils/types/challenge.types";
import { validateFlowchart } from "../../../../utils/validation/flowchartValidation";

/**
 * Hook for validating if a challenge is ready to be marked as "Final"
 * Uses the same validation logic as useFlowchartValidation
 * Returns true only if challenge has no validation errors
 */
export const useChallengeValidation = (
  challenge: ChallengeType | null | undefined
) => {
  const { isValid, validationResult } = useMemo(() => {
    if (!challenge) return { isValid: false, validationResult: null };

    // Use the same validation logic as in Flowchart component
    const validationResult = validateFlowchart(challenge);

    // Log validation result for debugging
    if (!validationResult.isValid) {
      console.log(
        "[useChallengeValidation] Challenge is invalid:",
        validationResult.errors
      );
    } else {
      console.log("[useChallengeValidation] Challenge is valid");
    }

    // Challenge is valid only if there are no errors (warnings are OK)
    return { isValid: validationResult.isValid, validationResult };
  }, [challenge]);

  return { isValid, validationResult };
};
