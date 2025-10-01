import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 16px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  color: #333;
  width: 100%;
`;

export const EditorTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 16px;
`;

export const Tab = styled.div<{ active?: boolean }>`
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  font-weight: 600;
  border-bottom: 2px solid
    ${(props) => (props.active ? "#007bff" : "transparent")};
  background-color: transparent;
  color: ${(props) => (props.active ? "#007bff" : "#555")};
  cursor: pointer;
  width: 33%;
  text-align: center;

  &:hover {
    color: #007bff;
  }
`;
