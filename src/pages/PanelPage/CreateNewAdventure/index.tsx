import { useId, type FC } from "react";
import * as S from "./styles";
import {
  useAdventureStore,
  type IAdventure,
} from "../../../stores/adventureStore";

interface IProps {
  onGoBack?: () => void;
  onCreate?: () => void;
}

export const CreateNewAdventure: FC<IProps> = ({ onGoBack, onCreate }) => {
  const id = useId();
  const { addAdventure } = useAdventureStore();

  const onCreateNewAdventure = () => {
    const newAdventure: IAdventure = {
      title: "New Adventure",
      description: "This is a new adventure.",
      tags: [],
      version: "1.0",
      id,
      createdAt: new Date().toISOString(),
      challenges: [],
      type: "draft",
    };
    addAdventure(newAdventure);
    onCreate?.();
  };

  return (
    <S.Wrapper>
      <S.Title>Create New Adventure</S.Title>

      <S.Label>Adventure title</S.Label>
      <S.Input type="text" placeholder="Enter adventure title" />

      <S.Label>Description</S.Label>
      <S.TextArea placeholder="Enter adventure description" />

      <S.Label>Tags</S.Label>
      <S.Text>+Add tag</S.Text>

      <S.Label>Version</S.Label>
      <S.Text>1.0</S.Text>

      <S.ButtonsWrapper>
        <S.BackButton onClick={onGoBack}>{"< Back"}</S.BackButton>
        <S.Button onClick={onCreateNewAdventure}>{"Start editing >"}</S.Button>
      </S.ButtonsWrapper>
    </S.Wrapper>
  );
};
