import type { FC } from "react";
import { useLocation } from "react-router-dom";

import { useUserStore } from "../../stores/authStore";
import { useLogout } from "../../utils/hooks";
import * as S from "./styles";
import { RoutePathNames } from "../../utils/constants";

export const SideBar: FC = () => {
  const { user } = useUserStore();
  const { logout, loading } = useLogout();
  const location = useLocation();

  return (
    <S.Wrapper>
      <S.NavItem
        to={RoutePathNames.Home}
        $isSelected={location.pathname === RoutePathNames.Home}
      >
        You adventures
      </S.NavItem>
      <S.NavItem
        to={RoutePathNames.DeletedAdventures}
        $isSelected={location.pathname === RoutePathNames.DeletedAdventures}
      >
        Deleted adventures
      </S.NavItem>

      {user && (
        <S.UserInfo>
          <S.UserEmail>{user.email}</S.UserEmail>
          <S.UserName>
            {user.firstName} {user.lastName}
          </S.UserName>
        </S.UserInfo>
      )}

      <S.LogoutButton onClick={logout} disabled={loading}>
        {loading ? "Logging out..." : "Logout"}
      </S.LogoutButton>
    </S.Wrapper>
  );
};
