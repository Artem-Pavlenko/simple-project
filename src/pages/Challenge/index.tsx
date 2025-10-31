import { useState, useEffect, type FC } from "react";
import { useParams } from "react-router-dom";

import { useAdventureStore } from "../../stores/adventureStore";
import type { ChallengeType } from "../../utils/types/challenge.types";
import type { AdventureType } from "../../utils/types/adventure.types";
import type { TagType } from "../../utils/types";
import {
  ChallengeForm,
  CreateForm,
  PageWrapper,
  Button,
} from "../../components";
import { useAdventures } from "../../utils/hooks";
import { challengeToasts } from "../../utils/toast";
import { importChallengeFromJSON } from "../../utils/import";
import * as S from "./styles";

type ParamsType = {
  id?: string;
  challengeId?: string;
};

export const ChallengePage: FC = () => {
  const params = useParams<ParamsType>();
  const { updAdventure } = useAdventureStore();
  const { getAdventureById, updateAdventure, error } = useAdventures();

  const [isEditMode, setIsEditMode] = useState(!!params.challengeId);
  const [currentAdventure, setCurrentAdventure] =
    useState<AdventureType | null>(null);
  const [loadingAdventure, setLoadingAdventure] = useState(true);
  const [challengeId, setChallengeId] = useState<string | undefined>(undefined);
  const [isManualCreating, setIsManualCreating] = useState(false);
  const [creating, setCreating] = useState(false);

  // Load adventure from Supabase
  useEffect(() => {
    const loadAdventure = async () => {
      if (!params.id) {
        setLoadingAdventure(false);
        return;
      }

      try {
        setLoadingAdventure(true);
        const adventure = await getAdventureById(params.id);
        if (adventure) {
          setCurrentAdventure(adventure);
          // Update local store for consistency
          updAdventure(adventure);
        }
      } catch (err) {
        console.error("Failed to load adventure:", err);
      } finally {
        setLoadingAdventure(false);
      }
    };

    loadAdventure();
  }, [params.id, getAdventureById, updAdventure]);

  const handleCreateChallenge = async (
    title: string,
    description: string,
    tag: TagType | undefined,
    version: string
  ) => {
    if (!title || !description || !params.id || !currentAdventure) return;

    setCreating(true);
    try {
      const newChallenge: ChallengeType = {
        title,
        description,
        id: crypto.randomUUID(),
        challengeStart: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        endNodes: [],
        nodes: {},
        startNode: {
          type: "start",
          id: crypto.randomUUID(),
          height: 100,
          width: 100,
          x: 100,
          y: 100,
        },
        version: version,
        tag: tag,
      };

      // Update adventure with new challenge in Supabase
      const updatedChallenges = {
        ...currentAdventure.challenges,
        [newChallenge.id]: newChallenge,
      };

      const updatedAdventure = await updateAdventure(params.id, {
        challenges: updatedChallenges,
      });

      if (updatedAdventure) {
        setCurrentAdventure(updatedAdventure);
        updAdventure(updatedAdventure);
        challengeToasts.createSuccess(newChallenge.title);
        setIsEditMode(true);
        setChallengeId(newChallenge.id);
        setIsManualCreating(false);
      }
    } catch (err) {
      console.error("Failed to create challenge:", err);
      challengeToasts.createError(
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setCreating(false);
    }
  };

  const handleImportChallenge = async (file: File) => {
    if (!params.id || !currentAdventure) return;

    setCreating(true);
    try {
      const importedChallenge = await importChallengeFromJSON(file);

      // Update adventure with imported challenge in Supabase
      const updatedChallenges = {
        ...currentAdventure.challenges,
        [importedChallenge.id]: importedChallenge,
      };

      const updatedAdventure = await updateAdventure(params.id, {
        challenges: updatedChallenges,
      });

      if (updatedAdventure) {
        setCurrentAdventure(updatedAdventure);
        updAdventure(updatedAdventure);
        challengeToasts.createSuccess(importedChallenge.title);
        setIsEditMode(true);
        setChallengeId(importedChallenge.id);
      }
    } catch (err) {
      console.error("Failed to import challenge:", err);
      challengeToasts.createError(
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateAdventure = async (updatedAdventure: AdventureType) => {
    try {
      const result = await updateAdventure(
        updatedAdventure.id,
        updatedAdventure
      );
      if (result) {
        setCurrentAdventure(result);
        updAdventure(result);
      }
    } catch (err) {
      console.error("Failed to update adventure:", err);
    }
  };

  if (loadingAdventure) {
    return (
      <PageWrapper
        withBackButton
        withSideBar={false}
        goBackText="Adventure list"
      >
        <S.Wrapper>
          <div>Loading adventure...</div>
        </S.Wrapper>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper
        withBackButton
        withSideBar={false}
        goBackText="Adventure list"
      >
        <S.Wrapper>
          <div>Error loading adventure: {error}</div>
        </S.Wrapper>
      </PageWrapper>
    );
  }

  if (!currentAdventure) {
    return (
      <PageWrapper
        withBackButton
        withSideBar={false}
        goBackText="Adventure list"
      >
        <S.Wrapper>
          <div>Adventure not found</div>
        </S.Wrapper>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper withBackButton withSideBar={false} goBackText="">
      <S.Wrapper>
        {!isEditMode && !isManualCreating && (
          <S.NewChallengeBlock>
            <S.Title>New challenge</S.Title>
            <Button
              variant="big"
              onClick={() => setIsManualCreating(true)}
              disabled={creating}
            >
              Create new
            </Button>
            <Button
              variant="file-import"
              onFileSelect={handleImportChallenge}
              disabled={creating}
            >
              Import from JSON file
            </Button>
          </S.NewChallengeBlock>
        )}

        {isManualCreating && !isEditMode ? (
          <CreateForm
            onGoBack={() => {
              setIsManualCreating(false);
            }}
            labelText="Challenge title"
            titleText="Create New Challenge"
            onCreate={handleCreateChallenge}
          />
        ) : isEditMode ? (
          <ChallengeForm
            challengeId={params.challengeId || challengeId}
            adventure={currentAdventure}
            onUpdateAdventure={handleUpdateAdventure}
          />
        ) : null}
      </S.Wrapper>
    </PageWrapper>
  );
};
