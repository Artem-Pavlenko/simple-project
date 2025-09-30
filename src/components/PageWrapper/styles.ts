import styled from "styled-components";

interface IWrapperProps {
  withSideBar: boolean;
  withBackButton: boolean;
}

export const Wrapper = styled.div<IWrapperProps>`
  padding: 30px 30px 30px
    ${({ withSideBar, withBackButton }) =>
      withSideBar ? (withBackButton ? 220 : 330) : withBackButton ? 220 : 30}px;
  height: 100vh;
  width: 100%;
  position: relative;
`;

export const GoBackWrapper = styled.div`
  position: fixed;
  left: 20px;
  top: 20px;
  height: 100vh;
  width: 300px;
`;
