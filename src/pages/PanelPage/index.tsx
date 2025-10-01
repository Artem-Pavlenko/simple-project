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
        createdAt: new Date().toISOString(),
        challenges: [],
        type: "draft",
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
