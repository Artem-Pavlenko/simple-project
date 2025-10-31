import { useState, useEffect, type FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAdventureStore } from "../../stores/adventureStore";
import { useUserStore } from "../../stores/authStore";
import { useAdventures } from "../../utils/hooks";
import { SupabaseAPI } from "../../utils/service/api";
import { RoutePathNames } from "../../utils/constants";
import { createAdventure } from "../../utils/helpers";
import type { TagType } from "../../utils/types";
import { adventureToasts } from "../../utils/toast";
import {
  AddButton,
  AdventureTable,
  CreateForm,
  PageWrapper,
  Button,
  ImportFromProjectForm,
  PageTitle,
} from "../../components";
import * as S from "./styles";

export const AdventuresPage: FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const { adventures, addAdventure, setAdventures } = useAdventureStore();
  const {
    loading: adventureLoading,
    error: adventureError,
    createAdventure: createAdventureInDB,
    getUserAdventures,
    deleteAdventure,
    duplicateAdventure,
    importAdventure,
    updateAdventure,
  } = useAdventures();

  const [isCreating, setIsCreating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isManualCreating, setIsManualCreating] = useState(false);
  const [isImportingFromProject, setIsImportingFromProject] = useState(false);
  const [showOption, setShowOption] = useState(false);

  const loadAdventures = useCallback(async () => {
    try {
      const userAdventures = await getUserAdventures();
      setAdventures(userAdventures);
    } catch (error) {
      console.error("Load adventures error:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      loadAdventures();
    }
  }, [user, loadAdventures]);

  const handleSignOut = async () => {
    await SupabaseAPI.signOut();
    setUser(null);
  };

  const onCreateNewAdventure = async (
    title: string,
    description: string,
    tag: TagType | undefined,
    version: string
  ) => {
    if (!title) return;

    setCreating(true);
    try {
      const newAdventure = createAdventure(title, description, tag, version);
      if (!newAdventure) return;
      const savedAdventure = await createAdventureInDB(newAdventure);

      if (savedAdventure) {
        addAdventure(savedAdventure);
        adventureToasts.createSuccess(savedAdventure.title);
        navigate(
          RoutePathNames.EditAdventure.replace(":id", savedAdventure.id)
        );
      }
    } catch (error) {
      console.error("Create adventure error:", error);
      adventureToasts.createError(
        error instanceof Error ? error.message : undefined
      );
    } finally {
      setCreating(false);
      setIsCreating(false);
      setIsManualCreating(false);
      setIsImportingFromProject(false);
      setShowOption(false);
    }
  };

  const onDeleteAdventure = async (id: string) => {
    try {
      // Find adventure title before deletion for toast message
      const adventureToDelete = adventures.find((adv) => adv.id === id);
      const adventureTitle = adventureToDelete?.title || "Adventure";

      await deleteAdventure(id);
      adventureToasts.deleteSuccess(adventureTitle);
      loadAdventures();
    } catch (error) {
      console.error("Delete adventure error:", error);
      adventureToasts.deleteError(
        error instanceof Error ? error.message : undefined
      );
    }
  };

  const onDuplicateAdventure = async (id: string) => {
    try {
      const adventureToDuplicate = adventures.find((adv) => adv.id === id);
      if (!adventureToDuplicate) {
        adventureToasts.duplicateError("Adventure not found");
        return;
      }

      const duplicatedAdventure = await duplicateAdventure(
        adventureToDuplicate
      );
      if (duplicatedAdventure) {
        addAdventure(duplicatedAdventure);
        adventureToasts.duplicateSuccess(duplicatedAdventure.title);
        loadAdventures(); // Reload to ensure consistency
      }
    } catch (error) {
      console.error("Duplicate adventure error:", error);
      adventureToasts.duplicateError(
        error instanceof Error ? error.message : undefined
      );
    }
  };

  const onImportAdventure = async (file: File) => {
    try {
      setCreating(true);
      const importedAdventure = await importAdventure(file);
      if (importedAdventure) {
        addAdventure(importedAdventure);
        adventureToasts.importSuccess(importedAdventure.title);
        loadAdventures(); // Reload to ensure consistency
        setShowOption(false); // Close the options panel
      }
    } catch (error) {
      console.error("Import adventure error:", error);
      adventureToasts.importError(
        error instanceof Error ? error.message : undefined
      );
    } finally {
      setCreating(false);
    }
  };

  const onImportFromProject = async (
    selectedAdventureId: string,
    newTitle: string,
    newDescription: string,
    newTag: TagType | undefined,
    newVersion: string
  ) => {
    if (!newTitle || !selectedAdventureId) return;

    const selectedAdventure = adventures.find(
      (adv) => adv.id === selectedAdventureId
    );
    if (!selectedAdventure) {
      adventureToasts.duplicateError("Selected adventure not found");
      return;
    }

    setCreating(true);
    try {
      // First duplicate the adventure to get a new copy with new ID
      const duplicatedAdventure = await duplicateAdventure(selectedAdventure);

      if (duplicatedAdventure) {
        // Now update the duplicated adventure with the new details
        const updatedAdventure = await updateAdventure(duplicatedAdventure.id, {
          title: newTitle,
          description: newDescription,
          tag: newTag,
          version: newVersion,
          updated_at: new Date().toISOString(),
        });

        if (updatedAdventure) {
          addAdventure(updatedAdventure);
          adventureToasts.createSuccess(updatedAdventure.title);
          navigate(
            RoutePathNames.EditAdventure.replace(":id", updatedAdventure.id)
          );
        }
      }
    } catch (error) {
      console.error("Import from project error:", error);
      adventureToasts.createError(
        error instanceof Error ? error.message : undefined
      );
    } finally {
      setCreating(false);
      setIsCreating(false);
      setIsManualCreating(false);
      setIsImportingFromProject(false);
      setShowOption(false);
    }
  };

  return (
    <PageWrapper>
      <S.Container>
        <PageTitle>Your adventures</PageTitle>

        {adventureError && (
          <S.ErrorMessage>Error: {adventureError}</S.ErrorMessage>
        )}

        {!isCreating && (
          <AddButton
            onClick={() => setShowOption(true)}
            $marginBottom={20}
            disabled={creating}
          >
            {creating ? "Creating..." : "+ New Adventure"}
          </AddButton>
        )}

        {showOption && !isManualCreating && (
          <S.NewAdventureBlock>
            <PageTitle>New adventure</PageTitle>
            <Button
              variant="big"
              onClick={() => setIsManualCreating(true)}
              disabled={creating}
            >
              Create new
            </Button>
            <Button
              variant="big"
              onClick={() => setIsImportingFromProject(true)}
              disabled={!adventures.length}
            >
              Import from another project
            </Button>
            <Button
              variant="file-import"
              onFileSelect={onImportAdventure}
              disabled={creating}
            >
              Import from JSON file
            </Button>
          </S.NewAdventureBlock>
        )}

        {isManualCreating ? (
          <CreateForm
            onGoBack={() => {
              setIsManualCreating(false);
              setShowOption(false);
            }}
            titleText="Create New Adventure"
            labelText="Adventure title"
            onCreate={onCreateNewAdventure}
          />
        ) : isImportingFromProject ? (
          <ImportFromProjectForm
            onGoBack={() => {
              setIsImportingFromProject(false);
              setShowOption(false);
            }}
            titleText="Import from Another Project"
            onCreate={onImportFromProject}
            adventures={adventures}
          />
        ) : adventureLoading && !adventures.length ? (
          <div>Loading adventures...</div>
        ) : adventures.length ? (
          <S.Adventures>
            <AdventureTable
              data={adventures}
              onDeleteItem={onDeleteAdventure}
              onDuplicateItem={onDuplicateAdventure}
            />
          </S.Adventures>
        ) : null}

        <S.Footer>
          <S.Email>{user?.email}</S.Email>

          <S.Button onClick={handleSignOut}>Sign Out</S.Button>
        </S.Footer>
      </S.Container>
    </PageWrapper>
  );
};
