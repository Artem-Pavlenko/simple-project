import type { FC, PropsWithChildren } from "react";
import { SideBar } from "..";
import { Wrapper } from "./styles";

export const PageWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Wrapper>
      <SideBar />
      {children}
    </Wrapper>
  );
};
