import React from "react";
import { UserMenu } from "../UserMenu";
import * as S from "./styles";

interface HeaderProps {
  title?: string;
  showUserMenu?: boolean;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showUserMenu = true,
  breadcrumbs,
}) => {
  return (
    <S.HeaderContainer>
      <div>
        <S.Logo>
          <S.LogoIcon>🎮</S.LogoIcon>
          Softspinner Adventures
        </S.Logo>
        {breadcrumbs && (
          <S.Breadcrumbs>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {crumb.href ? (
                  <a href={crumb.href}>{crumb.label}</a>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <S.BreadcrumbSeparator>/</S.BreadcrumbSeparator>
                )}
              </React.Fragment>
            ))}
          </S.Breadcrumbs>
        )}
        {title && <S.PageTitle>{title}</S.PageTitle>}
      </div>

      <S.HeaderActions>{showUserMenu && <UserMenu />}</S.HeaderActions>
    </S.HeaderContainer>
  );
};
