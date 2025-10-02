import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0001;
  padding: 24px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

export const Avatar = styled.div`
  margin-left: auto;
  background: #e0e7ef;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

export const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  margin: 8px 0;
`;

export const Tabs = styled.div`
  display: flex;
  width: 100%;
`;

export const Tab = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  border-radius: 8px 8px 0px 0px;
  background: ${({ active }) => (active ? "#dbeafe" : "#e0e7ef")};
  border: none;
  font-weight: 600;
  cursor: pointer;
  width: 50%;
  text-align: center;
  color: ${({ active }) => (active ? "#1e40af" : "#555")};
  transition: all 0.2s;

  &:hover {
    color: #1e40af;
  }
`;

export const Section = styled.div`
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  width: 100%;
`;

export const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

export const Description = styled.div`
  width: 100%;
  min-height: 60px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  margin-top: 4px;
  padding: 8px;
  color: #333;
`;

export const Tag = styled.span`
  background: #e0f7e9;
  color: #1a7f37;
  border-radius: 6px;
  padding: 2px 8px;
  font-weight: 500;
`;

export const AddTagButton = styled.button`
  background: #e0e7ef;
  border: none;
  border-radius: 6px;
  padding: 2px 8px;
  font-weight: 500;
  cursor: pointer;
`;

export const Input = styled.input`
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 4px;
`;

export const Row = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
`;

export const FileLabel = styled.span`
  margin-left: 8px;
`;

export const SequenceRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

export const ExportButton = styled.button`
  background: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
`;

export const DeleteButton = styled.button`
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;
