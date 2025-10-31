import styled from "styled-components";

export const EditorContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: min(500px, 100vw);
  height: 100vh;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border-left: 1px solid #dee2e6;
  padding: 24px;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  @media (max-width: 768px) {
    width: 100vw;
    padding: 16px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.h3`
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: #333;
    background-color: #f0f0f0;
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #dee2e6;
`;

export const Tab = styled.button<{ $isActive: boolean }>`
  padding: 10px 20px;
  border: none;
  background: ${(props) => (props.$isActive ? "#007bff" : "transparent")};
  color: ${(props) => (props.$isActive ? "white" : "#007bff")};
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background: ${(props) => (props.$isActive ? "#0056b3" : "#f8f9fa")};
  }
`;

export const TabContent = styled.div`
  flex: 1;
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
  font-size: 14px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 80px;
  resize: vertical;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const EffectsContainer = styled.div`
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 16px;
  margin-top: 15px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #007bff;
    background: #f0f7ff;
  }
`;

export const EmptyEffects = styled.div`
  text-align: center;
  padding: 20px;
  color: #6c757d;
  font-style: italic;
  font-size: 14px;

  &::before {
    content: "🎯";
    font-size: 24px;
    display: block;
    margin-bottom: 8px;
  }
`;

export const AddEffectButton = styled.button`
  padding: 10px 16px;
  background: linear-gradient(145deg, #28a745, #20c997);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;

  &:hover {
    background: linear-gradient(145deg, #20c997, #17a2b8);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: "➕";
    font-size: 12px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export const SaveButton = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #218838;
  }
`;

export const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #5a6268;
  }
`;
export const EffectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

export const EffectRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: #007bff;
  }
`;

export const EffectHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
`;

export const EffectTypeSelect = styled.select`
  flex: 1;
  padding: 6px 10px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  background: white;
  color: #495057;
  min-width: 120px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

export const EffectParams = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 8px;
  align-items: center;
`;

export const EffectSelect = styled.select`
  padding: 6px 10px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 12px;
  background: white;
  color: #495057;
  min-width: 80px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

export const EffectInput = styled.input`
  padding: 6px 10px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 12px;
  background: white;
  color: #495057;
  min-width: 80px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
    font-style: italic;
  }
`;

export const RemoveEffectButton = styled.button`
  padding: 6px 8px;
  background: linear-gradient(145deg, #dc3545, #c82333);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: linear-gradient(145deg, #c82333, #a71e2a);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SmallLabel = styled(Label)`
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 8px;
`;

export const SmallEmptyEffects = styled(EmptyEffects)`
  font-size: 11px;
  padding: 8px;
`;

export const SmallButton = styled.button`
  font-size: 11px;
  padding: 6px 12px;
  margin-top: 8px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6c757d;

  &:hover {
    background: #e9ecef;
  }
`;

export const EffectCard = styled.div`
  margin-left: 8px;
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 8px;
`;

export const SmallText = styled.span`
  font-size: 11px;
`;

export const NestedContainer = styled.div`
  margin-left: 16px;
  border-left: 2px solid #e9ecef;
  padding-left: 12px;
  margin-top: 8px;
`;

export const SmallEffectTypeSelect = styled(EffectTypeSelect)`
  font-size: 11px;
`;
