import { useState, type FC } from "react";
import * as S from "./styles";

interface IProps {
  onGoBack?: () => void;
  titleText?: string;
  labelText?: string;
  onCreate?: (title: string, description: string) => void;
}

export const CreateForm: FC<IProps> = ({
  onGoBack,
  titleText,
  labelText,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <S.Wrapper>
      <S.Title>{titleText}</S.Title>

      <S.Label>{labelText}</S.Label>
      <S.Input
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        type="text"
        placeholder="Enter adventure title"
      />

      <S.Label>Description</S.Label>
      <S.TextArea
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        placeholder="Enter adventure description"
      />

      <S.Label>Tags</S.Label>
      <S.Text>+Add tag</S.Text>

      <S.Label>Version</S.Label>
      <S.Text>1.0</S.Text>

      <S.ButtonsWrapper>
        {onGoBack && <S.BackButton onClick={onGoBack}>{"< Back"}</S.BackButton>}
        <S.Button onClick={() => onCreate?.(title, description)}>
          {"Start editing >"}
        </S.Button>
      </S.ButtonsWrapper>
    </S.Wrapper>
  );
};
