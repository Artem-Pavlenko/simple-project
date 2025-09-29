import { Link } from "react-router-dom";
import styled from "styled-components";

export const Wrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  background: #ffffff;
  border-right: 1px solid #e6e6e6;
  box-shadow: 2px 0px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100vh;
  width: 300px;
`;

interface NavItemProps {
  isSelected?: boolean;
}

export const NavItem = styled(Link)<NavItemProps>`
  color: #1b2029;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  background: ${({ isSelected }) => (isSelected ? "#e6f7ff" : "transparent")};
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 8px;

  &:hover {
    background: #e6f7e4ff;
  }
`;
