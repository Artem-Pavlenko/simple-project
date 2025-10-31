import type { FC } from "react";
import { useNavigate } from "react-router-dom";

import * as S from "./styles";
import type { RoutePathNameType } from "../../utils/types";

interface IProps {
  text?: string;
  route?: RoutePathNameType;
}

export const GoBack: FC<IProps> = ({ text, route }) => {
  const navigate = useNavigate();

  const onBack = () => {
    if (route) {
      navigate(route);
    } else {
      navigate(-1);
    }
  };

  return (
    <S.Wrapper onClick={onBack}>
      <S.Text>{`< ${text}`}</S.Text>
    </S.Wrapper>
  );
};
