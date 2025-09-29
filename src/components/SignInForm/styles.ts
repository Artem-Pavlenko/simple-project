import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 300px;
  margin: 50px auto;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 16px;
  color: #333;
`;

export const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

export const Button = styled.button`
  padding: 10px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #4338ca;
  }
`;

export const Message = styled.div`
  text-align: center;
  color: red;
  font-size: 13px;
`;
