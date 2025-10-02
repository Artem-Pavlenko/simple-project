import { useState, type FC } from "react";
import { useParams } from "react-router-dom";

import { ChallengeForm, CreateForm, PageWrapper } from "../../components";
import * as S from "./styles";
import { useAdventureStore } from "../../stores/adventureStore";
import type { ChallengeType } from "../../utils/types/challenge.types";

type ParamsType = {
  id?: string;
  challengeId?: string;
};

export const ChallengePage: FC = () => {
  const params = useParams<ParamsType>();
  const { adventures, updAdventureChallenge } = useAdventureStore();

  const [isEditMode, setIsEditMode] = useState(!!params.challengeId);

  const currentAdventure = adventures.find((adv) => adv.id === params.id);

  return (
    <PageWrapper withBackButton withSideBar={false} goBackText="Adventure list">
      <S.Wrapper>
        {!isEditMode ? (
          <CreateForm
            labelText="Challenge title"
            titleText="Create New Challenge"
            onCreate={(title, description) => {
              if (title && description) {
                setIsEditMode(true);
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
                  version: "1.0",
                };
                if (params.id) {
                  updAdventureChallenge(params.id, newChallenge);
                }
              }
            }}
          />
        ) : (
          <ChallengeForm adventure={currentAdventure} />
        )}
      </S.Wrapper>
    </PageWrapper>
  );
};
