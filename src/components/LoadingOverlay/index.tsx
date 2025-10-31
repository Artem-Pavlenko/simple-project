import type { FC } from "react";
import * as S from "./styles";

interface IProps {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
}

export const LoadingOverlay: FC<IProps> = ({
  isVisible,
  message = "Loading...",
  subMessage = "Please wait",
}) => {
  if (!isVisible) return null;

  return (
    <S.Overlay>
      <S.Container>
        <S.Spinner />
        <S.Message>{message}</S.Message>
        <S.SubMessage>{subMessage}</S.SubMessage>
      </S.Container>
    </S.Overlay>
  );
};
