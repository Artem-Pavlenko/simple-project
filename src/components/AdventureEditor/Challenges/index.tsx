import type { FC } from "react";
import { useNavigate } from "react-router-dom";

import * as S from "./styles";
import { AddButton } from "../../AddButton";
import { type IAdventure } from "../../../stores/adventureStore";

interface IProps {
  adventure?: IAdventure;
}

export const Challenges: FC<IProps> = ({ adventure }) => {
  const navigate = useNavigate();

  return (
    <S.Wrapper>
      <AddButton onClick={() => navigate(`/challenge/${adventure?.id}`)}>
        + New challenge
      </AddButton>

      {adventure?.challenges &&
        Object.values(adventure.challenges).map((challenge) => (
          <S.ChallengeCard
            key={challenge.id}
            onClick={() =>
              navigate(`/challenge/${adventure?.id}/${challenge.id}`)
            }
          >
            {challenge.title}
          </S.ChallengeCard>
        ))}
    </S.Wrapper>
  );
};
