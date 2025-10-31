import styled from "styled-components";

export const SettingsTabContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Label = styled.label<{
  $marginTop?: number;
  marginBottom?: number;
}>`
  display: block;
  margin-bottom: ${({ marginBottom }) =>
    marginBottom ? `${marginBottom}px` : "4px"};
  font-weight: 600;

  ${({ $marginTop }) => ($marginTop ? `margin-top: ${$marginTop}px;` : "")}
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
