import type { FC } from "react";

import * as S from "./styles";
import { RoutePathNames } from "../../utils/constants";

export const SideBar: FC = () => {
  return (
    <S.Wrapper>
      <S.NavItem to={RoutePathNames.Home} isSelected>
        You adventures
      </S.NavItem>
      <S.NavItem to={RoutePathNames.DeletedAdventures} isSelected={false}>
        Deleted adventures
      </S.NavItem>
    </S.Wrapper>
  );
};
