import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 40px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 0;
  margin-bottom: 26px;
`;

export const TabsWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

export const Tab = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.active ? "#007bff" : "transparent")};
  background-color: transparent;
  color: ${(props) => (props.active ? "#007bff" : "#555")};
  cursor: pointer;

  &:hover {
    color: #007bff;
  }
`;
