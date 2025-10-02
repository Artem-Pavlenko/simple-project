import { useState, type FC } from "react";

import type { IAdventure } from "../../stores/adventureStore";
import { GeneralSettings } from "./GeneralSettings";
import { Flowchart } from "../Flowchart";
import * as S from "./styles";
interface IProps {
  adventure?: IAdventure;
}

export const ChallengeForm: FC<IProps> = ({ adventure }) => {
  const [isGeneral, setIsGeneral] = useState(false);

  const challengeList = Object.values(adventure?.challenges || {});

  return (
    <S.Wrapper>
      <S.Header>
        <span
          style={{ fontWeight: 600, fontSize: 18, color: "#3a3a3a" }}
        >{`< Adventure: ${adventure?.title || "-"}`}</span>
      </S.Header>
      <S.Title>{adventure?.title}</S.Title>
      <S.Tabs>
        <S.Tab $active={isGeneral} onClick={() => setIsGeneral(true)}>
          General challenge settings
        </S.Tab>
        <S.Tab $active={!isGeneral} onClick={() => setIsGeneral(false)}>
          Challenge Flowchart
        </S.Tab>
      </S.Tabs>
      {isGeneral ? (
        <GeneralSettings adventure={adventure} />
      ) : (
        <Flowchart challenge={challengeList[0]} />
      )}
    </S.Wrapper>
  );
};
