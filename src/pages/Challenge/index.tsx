import { useState, type FC } from "react";
import { useParams } from "react-router-dom";

import { CreateForm, PageWrapper } from "../../components";
import * as S from "./styles";

interface IChallenge {
  title: string;
  description: string;
  id: string;
}

export const ChallengePage: FC = () => {
  const params = useParams<{ id?: string }>();

  const [isEditMode, setIsEditMode] = useState(!!params.id);
  const [challenge, setChallenge] = useState<IChallenge | undefined>();

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
                setChallenge({ title, description, id: crypto.randomUUID() });
              }
            }}
          />
        ) : (
          <>Edit Form</>
        )}
      </S.Wrapper>
    </PageWrapper>
  );
};
