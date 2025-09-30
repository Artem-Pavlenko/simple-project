import { useEffect, type FC } from "react";

import * as S from "./styles";
import { useNavigate, useParams } from "react-router-dom";
import { useAdventureStore } from "../../stores/adventureStore";
import { RoutePathNames } from "../../utils/constants";
import { LOG } from "../../utils";
import { AdventureEditor, PageWrapper } from "../../components";

export const EditAdventure: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { adventures } = useAdventureStore();

  const adventure = adventures.find((adv) => adv.id === id);

  LOG(adventure, "adventure");

  useEffect(() => {
    if (!adventure) {
      navigate(RoutePathNames.YouAdventures);
    }
  }, [adventure]);

  return (
    <PageWrapper withSideBar={false} goBackText="Adventure list" withBackButton>
      <S.Wrapper>
        <S.Title>{adventure?.title}</S.Title>

        <AdventureEditor adventure={adventure} />
      </S.Wrapper>
    </PageWrapper>
  );
};
