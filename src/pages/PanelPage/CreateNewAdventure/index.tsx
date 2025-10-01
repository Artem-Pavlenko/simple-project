import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";

import {
  useAdventureStore,
  type IAdventure,
} from "../../../stores/adventureStore";
import { RoutePathNames } from "../../../utils/constants";
import * as S from "./styles";

interface IProps {
  onGoBack?: () => void;
}

export const CreateNewAdventure: FC<IProps> = ({ onGoBack }) => {
  const { addAdventure } = useAdventureStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onCreateNewAdventure = () => {
    if (title) {
      const newAdventure: IAdventure = {
        title: title,
        description: description,
        tags: [],
        version: "1.0",
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        challenges: [],
        type: "draft",
      };
      addAdventure(newAdventure);
      navigate(RoutePathNames.EditAdventure.replace(":id", newAdventure.id));
    }
  };

  return (
    <S.Wrapper>
      <S.Title>Create New Adventure</S.Title>

      <S.Label>Adventure title</S.Label>
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
        <S.BackButton onClick={onGoBack}>{"< Back"}</S.BackButton>
        <S.Button onClick={onCreateNewAdventure}>{"Start editing >"}</S.Button>
      </S.ButtonsWrapper>
    </S.Wrapper>
  );
};
