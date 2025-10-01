import type { FC } from "react";
import * as S from "./styles";
import type { IAdventure } from "../../../stores/adventureStore";

interface IProps {
  adventure?: IAdventure;
}

export const AdventureSettings: FC<IProps> = ({ adventure }) => (
  <S.SettingsTabContent>
    {adventure?.description && (
      <>
        <S.Label>Adventure Description</S.Label>
        <S.Description>{adventure?.description}</S.Description>
      </>
    )}

    <S.Label>Tags</S.Label>
    <div>
      {adventure?.tags && adventure.tags.length > 0
        ? adventure.tags.join(", ")
        : "No tags"}
    </div>

    <S.Label marginTop={15}>Version</S.Label>
    <span>{adventure?.version}</span>

    <S.BtnWrapper>
      <S.Button $color="#dc3545">Delete adventure</S.Button>
      <S.Button $color="#6c757d">Duplicate</S.Button>
      <S.Button $color="#198754">Export</S.Button>
    </S.BtnWrapper>
  </S.SettingsTabContent>
);
