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
  $isSelected?: boolean;
}

export const NavItem = styled(Link)<NavItemProps>`
  color: #1b2029;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  background: ${({ $isSelected }) => ($isSelected ? "#e6f7ff" : "transparent")};
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 8px;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    background: #e6f7e4ff;
  }
`;

export const LogoutButton = styled.button`
  margin-top: auto;
  margin-bottom: 20px;
  padding: 12px 20px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    background: #ff3742;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

export const UserInfo = styled.div`
  margin-top: auto;
  margin-bottom: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  width: 100%;
`;

export const UserEmail = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

export const UserName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;
