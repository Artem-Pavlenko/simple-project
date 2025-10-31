import type { FC } from "react";

import type { ValidationResult } from "../../../../utils/validation/flowchartValidation";
import { Switch } from "../../../Switch";
import * as S from "./styles";

interface FlowchartActionButtonsProps {
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  validationResult: ValidationResult | null;
  challengeExists: boolean;
  isAutosaveEnabled: boolean;
  canRollback: boolean;
  isRestoring?: boolean;
  onSave: () => void;
  onValidate: () => void;
  onAutosaveToggle: (enabled: boolean) => void;
  onRollback: () => void;
}

export const FlowchartActionButtons: FC<FlowchartActionButtonsProps> = ({
  hasUnsavedChanges,
  isSaving,
  validationResult,
  challengeExists,
  isAutosaveEnabled,
  canRollback,
  isRestoring = false,
  onSave,
  onValidate,
  onAutosaveToggle,
  onRollback,
}) => (
  <S.ActionButtonsContainer>
    <Switch
      label="Autosave"
      disabled={isSaving}
      checked={isAutosaveEnabled}
      onChange={onAutosaveToggle}
    />

    {hasUnsavedChanges && (
      <S.SaveButton onClick={onSave} disabled={isSaving} $isSaving={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </S.SaveButton>
    )}

    <S.RollbackButton
      onClick={onRollback}
      disabled={!canRollback || isSaving || isRestoring}
      title={
        !canRollback
          ? "No previous version available"
          : "Restore to previous version"
      }
    >
      {isRestoring ? "⟳ Restoring..." : "↶ Rollback"}
    </S.RollbackButton>

    <S.ValidateButton
      onClick={onValidate}
      disabled={isSaving || !challengeExists}
      $hasErrors={validationResult ? !validationResult.isValid : false}
    >
      {validationResult?.isValid === false ? "⚠ Issues Found" : "✓ Validate"}
    </S.ValidateButton>
  </S.ActionButtonsContainer>
);
