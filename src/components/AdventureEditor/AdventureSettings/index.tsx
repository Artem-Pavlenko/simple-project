import type { FC } from "react";
import * as S from "./styles";
import type { AdventureType } from "../../../utils/types/adventure.types";
import { useAdventures } from "../../../utils/hooks";
import { adventureToasts } from "../../../utils/toast";

interface IProps {
  adventure?: AdventureType;
}

export const AdventureSettings: FC<IProps> = ({ adventure }) => {
  const { exportAdventure, duplicateAdventure } = useAdventures();

  const handleExportAdventure = () => {
    if (adventure) {
      try {
        exportAdventure(adventure);
        adventureToasts.exportSuccess(adventure.title);
      } catch (error) {
        adventureToasts.exportError(
          error instanceof Error ? error.message : undefined
        );
      }
    }
  };

  const handleDuplicateAdventure = async () => {
    if (adventure) {
      try {
        const duplicatedAdventure = await duplicateAdventure(adventure);
        if (duplicatedAdventure) {
          adventureToasts.duplicateSuccess(duplicatedAdventure.title);
          // Optionally redirect to the new adventure
          // navigate(`/adventure/${duplicatedAdventure.id}`);
        }
      } catch (error) {
        adventureToasts.duplicateError(
          error instanceof Error ? error.message : undefined
        );
      }
    }
  };

  return (
    <S.SettingsTabContent>
      {adventure?.description && (
        <>
          <S.Label>Adventure Description</S.Label>
          <S.Description>{adventure?.description}</S.Description>
        </>
      )}

      <S.Label>Tags</S.Label>
      <div>{adventure?.tag || "No tags"}</div>

      <S.Label $marginTop={15}>Version</S.Label>
      <span>{adventure?.version}</span>

      <S.BtnWrapper>
        <S.Button $color="#dc3545">Delete adventure</S.Button>
        <S.Button $color="#6c757d" onClick={handleDuplicateAdventure}>
          Duplicate
        </S.Button>
        <S.Button $color="#198754" onClick={handleExportAdventure}>
          Export
        </S.Button>
      </S.BtnWrapper>
    </S.SettingsTabContent>
  );
};
