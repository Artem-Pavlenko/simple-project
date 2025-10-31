import styled from "styled-components";

export const Wrapper = styled.div`
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 40px;
  align-items: start;
`;

// Left Panel
export const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
`;

export const FileInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
`;

export const FileInputLabel = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

export const UploadIcon = styled.span`
  font-size: 18px;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const UploadButton = styled.button`
  padding: 8px 24px;
  background: #9ca3af;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #6b7280;
  }
`;

export const Select = styled.select`
  padding: 10px 12px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

export const Input = styled.input`
  padding: 10px 12px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

// Center Panel
export const CenterPanel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PreviewContainer = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CircularDiagram = styled.div`
  position: relative;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #6b8e9f 0deg 30deg,
    #7a9aaa 30deg 60deg,
    #5d7a8a 60deg 90deg,
    #6b8e9f 90deg 120deg,
    #5d7a8a 120deg 150deg,
    #7a9aaa 150deg 180deg,
    #6b8e9f 180deg 210deg,
    #5d7a8a 210deg 240deg,
    #7a9aaa 240deg 270deg,
    #6b8e9f 270deg 300deg,
    #5d7a8a 300deg 330deg,
    #7a9aaa 330deg 360deg
  );
`;

interface PadProps {
  $x: number;
  $y: number;
}

export const Pad = styled.div<PadProps>`
  position: absolute;
  top: ${(props) => props.$y}%;
  left: ${(props) => props.$x}%;
  width: 50px;
  height: 50px;
  border-radius: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
  color: white;
  transform: translate(-50%, -50%);
  z-index: 2;
  background: #9ca3af;
`;

export const SideButton = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #9ca3af;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #6b7280;
  }
`;

export const TopButtons = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
`;

export const LeftButtons = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RightButtons = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const BottomButtons = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
`;

// Right Panel
export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;
