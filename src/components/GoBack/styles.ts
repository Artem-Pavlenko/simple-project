import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 8px;
  background-color: #f9f9f9;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  color: #333;
  max-width: 170px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;
export const Text = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #222;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
