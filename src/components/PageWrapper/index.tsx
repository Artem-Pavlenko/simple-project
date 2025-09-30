import type { FC, PropsWithChildren } from "react";
import { GoBack, SideBar } from "..";
import { GoBackWrapper, Wrapper } from "./styles";

interface IProps extends PropsWithChildren {
  withSideBar?: boolean;
  withBackButton?: boolean;
  goBackText?: string;
}

export const PageWrapper: FC<IProps> = ({
  children,
  goBackText,
  withSideBar = true,
  withBackButton = false,
}) => (
  <Wrapper withSideBar={withSideBar} withBackButton={withBackButton}>
    {withSideBar ? (
      <SideBar />
    ) : withBackButton ? (
      <GoBackWrapper>
        <GoBack text={goBackText} />
      </GoBackWrapper>
    ) : null}
    {children}
  </Wrapper>
);
