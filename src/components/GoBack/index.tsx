import type { FC } from "react";

import * as S from "./styles";
import { useNavigate } from "react-router-dom";

interface IProps {
  text?: string;
  route?: string;
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
      <S.Text>{"< "}</S.Text>
      {text && <S.Text>{text}</S.Text>}
    </S.Wrapper>
  );
};
