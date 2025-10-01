import type { FC } from "react";
import { useNavigate } from "react-router-dom";

import * as S from "./styles";
import { AddButton } from "../../AddButton";
import { RoutePathNames } from "../../../utils/constants";

export const Challenges: FC = () => {
  const navigate = useNavigate();

  return (
    <S.Wrapper>
      <AddButton
        onClick={() => navigate(RoutePathNames.Challenge.replace(":id", ""))}
      >
        + New challenge
      </AddButton>
    </S.Wrapper>
  );
};
