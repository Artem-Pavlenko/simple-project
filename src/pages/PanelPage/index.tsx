import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUserStore } from "../../stores/authStore";
import { SupabaseAPI } from "../../utils/service/api";
import { RoutePathNames } from "../../utils/constants";
import {
  useAdventureStore,
  type IAdventure,
} from "../../stores/adventureStore";
import { CreateForm } from "../../components/CreateForm";
import { AddButton, AdventureTable, PageWrapper } from "../../components";
import * as S from "./styles";

export const PanelPage: React.FC = () => {
  const { user, setUser } = useUserStore();
  const { adventures, deleteAdventure, addAdventure } = useAdventureStore();
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await SupabaseAPI.signOut();
    setUser(null);
  };

  const onCreateNewAdventure = (title: string, description: string) => {
    if (title) {
      const newAdventure: IAdventure = {
        title: title,
        description: description,
        tags: [],
        version: "1.0",
        id: crypto.randomUUID(),
        challenges: {},
        type: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        input_aliasing: {
          B1: "",
          B2: "",
          B3: "",
          B4: "",
          B5: "",
          B6: "",
          B7: "",
          B8: "",
          B9: "",
          B10: "",
          B11: "",
          B12: "",
          P1: "",
          P2: "",
          P3: "",
          P4: "",
          P5: "",
          P6: "",
          P7: "",
          P8: "",
          P9: "",
          P10: "",
          P11: "",
          P12: "",
        },
        assets: {
          matImage: "",
          audioFiles: [{ name: "", s3Key: "" }],
        },
        challengeSelectionSettings: {
          startButton: "B1",
          stopButton: "B2",
        },
      };
      addAdventure(newAdventure);
      navigate(RoutePathNames.EditAdventure.replace(":id", newAdventure.id));
    }
  };

  return (
    <PageWrapper>
      <S.Container>
        <S.Title>Your adventures</S.Title>

        <AddButton onClick={() => setIsCreating(true)} marginBottom={20}>
          + New Adventure
        </AddButton>

        {isCreating ? (
          <CreateForm
            onGoBack={() => setIsCreating(false)}
            titleText="Create New Adventure"
            labelText="Adventure title"
            onCreate={onCreateNewAdventure}
          />
        ) : adventures.length ? (
          <S.Adventures>
            <AdventureTable data={adventures} onDeleteItem={deleteAdventure} />
          </S.Adventures>
        ) : (
          <S.NewAdventureBlock>
            <S.Title>New adventure</S.Title>
            <S.BigBtn onClick={() => setIsCreating(true)}>Create new</S.BigBtn>
            <S.BigBtn>Import from another project</S.BigBtn>
            <S.BigBtn>Import from file</S.BigBtn>
          </S.NewAdventureBlock>
        )}

        <S.Footer>
          <S.Email>{user?.email}</S.Email>
          <S.Button onClick={handleSignOut}>Sign Out</S.Button>
        </S.Footer>
      </S.Container>
    </PageWrapper>
  );
};
