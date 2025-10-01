import { useState } from "react";

import { AddButton, AdventureTable, PageWrapper } from "../../components";
import { useAdventureStore } from "../../stores/adventureStore";
import { useUserStore } from "../../stores/authStore";
import { SupabaseAPI } from "../../utils/service/api";
import { CreateNewAdventure } from "./CreateNewAdventure";
import * as S from "./styles";

export const PanelPage: React.FC = () => {
  const { user, setUser } = useUserStore();
  const { adventures, deleteAdventure } = useAdventureStore();
  const [isCreating, setIsCreating] = useState(false);

  const handleSignOut = async () => {
    await SupabaseAPI.signOut();
    setUser(null);
  };

  return (
    <PageWrapper>
      <S.Container>
        <S.Title>Your adventures</S.Title>

        <AddButton onClick={() => setIsCreating(true)} marginBottom={20}>
          + New Adventure
        </AddButton>

        {isCreating ? (
          <CreateNewAdventure onGoBack={() => setIsCreating(false)} />
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
