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

export const SettingsTabContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Label = styled.label<{
  marginTop?: number;
  marginBottom?: number;
}>`
  display: block;
  margin-bottom: ${({ marginBottom }) =>
    marginBottom ? `${marginBottom}px` : "4px"};
  font-weight: 600;

  ${({ marginTop }) => (marginTop ? `margin-top: ${marginTop}px;` : "")}
`;

export const Description = styled.p`
  font-size: 12px;
  color: #222;
  margin-top: 4px;
  margin-bottom: 12px;
  border-radius: 12px;
  background: #fff;
  padding: 8px;
  display: inline-block;
`;

export const Button = styled.button<{ $color: string }>`
  padding: 6px 12px;
  font-size: 13px;
  border: none;
  border-radius: 6px;
  color: #fff;
  background: ${({ $color }) => $color};
  cursor: pointer;
  width: 150px;

  &:hover {
    opacity: 0.9;
  }
`;

export const BtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-top: 20px;
`;
