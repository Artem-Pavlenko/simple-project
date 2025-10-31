import { useState, useRef } from "react";
import type { FC } from "react";

import { SelectField, type SelectOption } from "../SelectField";
import * as S from "./styles";

const buttonOptions = ["G1", "G2", "R1", "R2", "R3", "R4", "R5"];
const sidePads = ["S1", "S2", "S3", "S4", "S5"];
const mainPads = [
  "P1",
  "P2",
  "P3",
  "P4",
  "P5",
  "P6",
  "P7",
  "P8",
  "P9",
  "P10",
  "P11",
  "P12",
];

const BUTTON_SELECT_OPTIONS: SelectOption[] = buttonOptions.map((opt) => ({
  value: opt,
  label: opt,
}));

export const HardwareMapping: FC = () => {
  const [startButton, setStartButton] = useState<string>("G1");
  const [pauseButton, setPauseButton] = useState<string>("G2");
  const [componentName, setComponentName] = useState<string>("G1");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Image uploaded:", file.name);
    }
  };

  return (
    <S.Wrapper>
      <S.Container>
        {/* Left Panel */}
        <S.LeftPanel>
          <S.Section>
            <S.Label>Overlay image</S.Label>
            <S.FileInputWrapper>
              <S.FileInputLabel>Select JPG/PNG file</S.FileInputLabel>
              <S.UploadIcon>📁</S.UploadIcon>
            </S.FileInputWrapper>
            <S.HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageUpload}
            />
            <S.UploadButton onClick={handleUploadClick}>Upload</S.UploadButton>
          </S.Section>

          <S.Section>
            <SelectField
              value={startButton}
              onChange={setStartButton}
              options={BUTTON_SELECT_OPTIONS}
              label="START button"
            />
          </S.Section>

          <S.Section>
            <SelectField
              value={pauseButton}
              onChange={setPauseButton}
              options={BUTTON_SELECT_OPTIONS}
              label="PAUSE button"
            />
          </S.Section>
        </S.LeftPanel>

        {/* Center Preview */}
        <S.CenterPanel>
          <S.PreviewContainer>
            {/* Top buttons S1-S3 */}
            <S.TopButtons>
              {sidePads.slice(0, 3).map((pad) => (
                <S.SideButton key={pad}>{pad}</S.SideButton>
              ))}
            </S.TopButtons>

            {/* Left side buttons */}
            <S.LeftButtons>
              <S.SideButton>G1</S.SideButton>
              <S.SideButton>R1</S.SideButton>
              <S.SideButton>R2</S.SideButton>
              <S.SideButton>R3</S.SideButton>
            </S.LeftButtons>

            {/* Circular pad diagram */}
            <S.CircularDiagram>
              {mainPads.map((pad, index) => {
                const angle = (index / 12) * 360 - 90 + 15; // Start from top
                const radius = 42; // 42% from center
                const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
                return (
                  <S.Pad key={pad} $x={x} $y={y}>
                    {pad}
                  </S.Pad>
                );
              })}
            </S.CircularDiagram>

            {/* Right side buttons */}
            <S.RightButtons>
              {sidePads.slice(3, 5).map((pad) => (
                <S.SideButton key={pad}>{pad}</S.SideButton>
              ))}
            </S.RightButtons>

            {/* Bottom buttons */}
            <S.BottomButtons>
              <S.SideButton>R4</S.SideButton>
              <S.SideButton>R5</S.SideButton>
              <S.SideButton>G2</S.SideButton>
            </S.BottomButtons>
          </S.PreviewContainer>
        </S.CenterPanel>

        {/* Right Panel */}
        <S.RightPanel>
          <S.Title>Edit hardware component</S.Title>
          <S.Section>
            <S.Label>Component name</S.Label>
            <S.Input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
            />
          </S.Section>
        </S.RightPanel>
      </S.Container>
    </S.Wrapper>
  );
};
