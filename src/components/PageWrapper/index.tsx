import type { FC, PropsWithChildren } from "react";
import { GoBack } from "../GoBack";
import { SideBar } from "../SideBar";
import * as S from "./styles";
import type { RoutePathNameType } from "../../utils/types";

interface IProps extends PropsWithChildren {
  withSideBar?: boolean;
  withBackButton?: boolean;
  goBackText?: string;
  backRoute?: RoutePathNameType;
}

export const PageWrapper: FC<IProps> = ({
  children,
  goBackText,
  backRoute,
  withSideBar = true,
  withBackButton = false,
}) => (
  <S.Wrapper $withSideBar={withSideBar} $withBackButton={withBackButton}>
    {withSideBar ? (
      <SideBar />
    ) : withBackButton ? (
      <S.GoBackWrapper>
        <GoBack text={goBackText} route={backRoute} />
      </S.GoBackWrapper>
    ) : null}
    {children}
  </S.Wrapper>
);
