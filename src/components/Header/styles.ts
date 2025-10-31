import styled from "styled-components";

export const HeaderContainer = styled.header`
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const Logo = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const LogoIcon = styled.span`
  font-size: 24px;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

export const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
`;

export const BreadcrumbSeparator = styled.span`
  color: #ccc;
`;
