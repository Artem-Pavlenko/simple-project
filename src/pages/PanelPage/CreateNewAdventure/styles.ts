import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1b2029;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.87);
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 4px;
  margin-top: 14px;
  color: rgba(255, 255, 255, 0.87);
`;

export const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.87);

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

export const TextArea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  min-height: 100px;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 60px;
  align-self: flex-start;
`;

export const Button = styled.button`
  padding: 10px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  margin: 10px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  height: 36px;
  text-align: center;

  &:hover {
    background-color: #1e40af;
  }
`;

export const BackButton = styled(Button)`
  background-color: #6b7280;

  &:hover {
    background-color: #4b5563;
  }
`;

export const Text = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0px;
  color: rgba(255, 255, 255, 0.87);
`;
