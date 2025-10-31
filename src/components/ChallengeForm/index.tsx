import { type FC } from "react";
import { useSearchParams } from "react-router-dom";

import type { AdventureType } from "../../utils/types/adventure.types";
import { GeneralSettings } from "./GeneralSettings";
import { Flowchart } from "./Flowchart";
import * as S from "./styles";

interface IProps {
  adventure?: AdventureType;
  onUpdateAdventure: (updatedAdventure: AdventureType) => Promise<void>;
  challengeId?: string;
}

export const ChallengeForm: FC<IProps> = ({
  adventure,
  onUpdateAdventure,
  challengeId,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const isGeneral = tabParam === "general";

  const handleTabChange = (isGeneralTab: boolean) => {
    setSearchParams({ tab: isGeneralTab ? "general" : "flowchart" });
  };

  const challengeList = Object.values(adventure?.challenges || {});

  const selectedChallenge =
    challengeList.find((c) => c.id === challengeId) || null;

  return (
    <S.Wrapper>
      <S.Header>
        <S.HeaderText>{`< Adventure: ${adventure?.title || "-"}`}</S.HeaderText>
      </S.Header>
      <S.Title>{adventure?.title}</S.Title>
      <S.Tabs>
        <S.Tab $active={isGeneral} onClick={() => handleTabChange(true)}>
          General challenge settings
        </S.Tab>
        <S.Tab $active={!isGeneral} onClick={() => handleTabChange(false)}>
          Challenge Flowchart
        </S.Tab>
      </S.Tabs>
      {isGeneral ? (
        <GeneralSettings
          adventure={adventure}
          challenge={selectedChallenge}
          onUpdateAdventure={onUpdateAdventure}
        />
      ) : (
        <Flowchart
          challenge={selectedChallenge}
          adventure={adventure}
          onUpdateAdventure={onUpdateAdventure}
        />
      )}
    </S.Wrapper>
  );
};
