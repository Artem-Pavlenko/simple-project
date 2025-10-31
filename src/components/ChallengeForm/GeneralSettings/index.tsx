import { useState, useEffect, useMemo, type FC } from "react";

import type { AdventureType } from "../../../utils/types/adventure.types.ts";
import type { ChallengeType } from "../../../utils/types/challenge.types.ts";
import type { TagType } from "../../../utils/types";
import { challengeToasts } from "../../../utils/toast";
import { SelectField, type SelectOption } from "../../SelectField/index.tsx";
import { useChallengeValidation } from "./hooks/useChallengeValidation.ts";
import * as S from "./styles.ts";

interface IProps {
  adventure: AdventureType | undefined;
  challenge: ChallengeType | null;
  onUpdateAdventure: (updatedAdventure: AdventureType) => Promise<void>;
}

export const GeneralSettings: FC<IProps> = ({
  adventure,
  challenge,
  onUpdateAdventure,
}) => {
  const [title, setTitle] = useState(challenge?.title || "");
  const [description, setDescription] = useState(challenge?.description || "");
  const [tag, setTag] = useState<TagType | undefined>(challenge?.tag);
  const [version, setVersion] = useState(challenge?.version || "1.0");
  const [isSaving, setIsSaving] = useState(false);

  // Validate challenge flowchart to determine if "Final" tag can be selected
  const { isValid: isChallengeValid, validationResult } =
    useChallengeValidation(challenge);

  // Reset state when challenge changes
  useEffect(() => {
    setTitle(challenge?.title || "");
    setDescription(challenge?.description || "");
    setTag(challenge?.tag);
    setVersion(challenge?.version || "1.0");
  }, [
    challenge?.id,
    challenge?.title,
    challenge?.description,
    challenge?.tag,
    challenge?.version,
  ]);

  // Check if any field has changed
  const hasChanges = useMemo(() => {
    if (!challenge) return false;
    return (
      title !== challenge.title ||
      description !== challenge.description ||
      tag !== challenge.tag ||
      version !== challenge.version
    );
  }, [title, description, tag, version, challenge]);

  // Build tag options dynamically based on challenge validation
  const tagOptions: SelectOption<TagType | "">[] = useMemo(
    () => [
      { value: "", label: "Select tag" },
      { value: "Draft", label: "Draft" },
      {
        value: "Final",
        label: "Final",
        disabled: !isChallengeValid,
      },
      { value: "Not started", label: "Not started" },
    ],
    [isChallengeValid]
  );

  const handleSaveAll = async () => {
    if (!adventure || !challenge || !onUpdateAdventure || !hasChanges) {
      return;
    }

    setIsSaving(true);
    try {
      const updatedChallenge = {
        ...challenge,
        title,
        description,
        tag,
        version,
        updated_at: new Date().toISOString(),
      };
      const updatedAdventure = {
        ...adventure,
        challenges: {
          ...adventure.challenges,
          [challenge.id]: updatedChallenge,
        },
      };

      await onUpdateAdventure(updatedAdventure);
      challengeToasts.updateSuccess(challenge.title);
    } catch (error) {
      challengeToasts.updateError(
        error instanceof Error ? error.message : undefined
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <S.Wrapper>
      <div>
        <S.FieldGroup>
          <S.Label>Challenge Title</S.Label>
          <S.TitleInput
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter challenge title..."
          />
        </S.FieldGroup>
        <S.FieldGroup>
          <S.Label>Challenge Description</S.Label>
          <S.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter challenge description..."
          />
        </S.FieldGroup>
        <SelectField
          value={tag || ""}
          onChange={(value) =>
            setTag(value === "" ? undefined : (value as TagType))
          }
          options={tagOptions}
          label="Tags"
        />
        {!isChallengeValid && (
          <S.ValidationWarning>
            ⚠️ "Final" tag is disabled:{" "}
            {validationResult && validationResult.errors.length > 0 ? (
              <>
                Challenge flowchart has validation errors. Please fix them in
                the Flowchart tab before marking as Final.
                <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                  {validationResult.errors.slice(0, 3).map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                  {validationResult.errors.length > 3 && (
                    <li>... and {validationResult.errors.length - 3} more</li>
                  )}
                </ul>
              </>
            ) : (
              "Challenge is not ready for Final status. Please check the Flowchart tab and ensure all required nodes and connections are in place."
            )}
          </S.ValidationWarning>
        )}
        <S.Row>
          <div>
            <S.Label>Version</S.Label>
            <S.NarrowInput
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
          </div>
          <div>
            <S.Label>Challenge timeout</S.Label>
            <S.NarrowInput type="number" defaultValue={180} /> seconds
          </div>
        </S.Row>
        <S.FieldGroup>
          <S.Label>Upload music file (.wav)</S.Label>
          <S.FileInput type="file" accept=".wav" />
          <S.FileLabel>AtlantisKey.wav</S.FileLabel>
        </S.FieldGroup>
        <S.FieldGroup>
          <S.Label>Game launch sequence</S.Label>
          <S.SequenceRow>
            <S.Select>
              <option>Select pad / button</option>
            </S.Select>
            <S.AddTagButton>+ Add step</S.AddTagButton>
          </S.SequenceRow>
        </S.FieldGroup>
        <S.MetronomeRow>
          <S.Label>Metronome</S.Label>
          <S.CheckboxInput type="checkbox" defaultChecked />
          <S.NarrowInput type="number" defaultValue={60} /> bpm
        </S.MetronomeRow>
        <S.FieldGroup>
          <S.Label>Upload music file (.wav)</S.Label>
          <S.FileInput type="file" accept=".wav" />
          <S.FileLabel>AtlantisKey.wav</S.FileLabel>
        </S.FieldGroup>
        <S.ButtonRow>
          <S.SaveButton
            type="button"
            onClick={handleSaveAll}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </S.SaveButton>
          <S.ExportButton type="button">Export challenge</S.ExportButton>
          <S.DeleteButton type="button">Delete challenge</S.DeleteButton>
        </S.ButtonRow>
      </div>
    </S.Wrapper>
  );
};
