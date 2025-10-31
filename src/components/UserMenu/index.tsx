import React, { useState, useRef, useEffect } from "react";
import { useUserStore } from "../../stores/authStore";
import { useLogout } from "../../utils/hooks";
import * as S from "./styles";

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useUserStore();
  const { logout, loading } = useLogout();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  if (!user) return null;

  const initials = `${user.firstName?.charAt(0) || ""}${
    user.lastName?.charAt(0) || ""
  }`.toUpperCase();

  return (
    <S.MenuContainer ref={menuRef}>
      <S.UserButton onClick={() => setIsOpen(!isOpen)}>
        <S.UserAvatar>{initials}</S.UserAvatar>
        <S.UserName>
          {user.firstName} {user.lastName}
        </S.UserName>
      </S.UserButton>

      <S.DropdownMenu $isOpen={isOpen}>
        <S.MenuHeader>
          <S.MenuUserEmail>{user.email}</S.MenuUserEmail>
          <S.MenuUserName>
            {user.firstName} {user.lastName}
          </S.MenuUserName>
        </S.MenuHeader>

        <S.MenuDivider />

        <S.MenuItem onClick={() => setIsOpen(false)}>
          <S.MenuIcon>⚙️</S.MenuIcon>
          Settings
        </S.MenuItem>

        <S.MenuItem onClick={() => setIsOpen(false)}>
          <S.MenuIcon>👤</S.MenuIcon>
          Profile
        </S.MenuItem>

        <S.MenuDivider />

        <S.MenuItem
          className="danger"
          onClick={handleLogout}
          disabled={loading}
        >
          <S.MenuIcon>🚪</S.MenuIcon>
          {loading ? "Logging out..." : "Logout"}
        </S.MenuItem>
      </S.DropdownMenu>
    </S.MenuContainer>
  );
};
