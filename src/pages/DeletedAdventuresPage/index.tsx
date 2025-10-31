import type { FC } from "react";

import { PageTitle, PageWrapper } from "../../components";
import * as S from "./styles";

export const DeletedAdventuresPage: FC = () => (
  <PageWrapper>
    <S.Container>
      <PageTitle>Deleted Adventures</PageTitle>
      <S.EmptyState>Deleted adventures will appear here.</S.EmptyState>
    </S.Container>
  </PageWrapper>
);
