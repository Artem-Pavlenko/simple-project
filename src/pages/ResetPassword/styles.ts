import { Link } from "react-router-dom";
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledLink = styled(Link)``;

export const ForgotPassword = styled.div`
  margin-top: 12px;
  cursor: pointer;

  &:hover {
  }
`;
