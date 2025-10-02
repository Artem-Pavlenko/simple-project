import type { FC } from "react";
import * as S from "./styles.ts";
import type { AdventureType } from "../../../utils/types/adventure.types.ts";

interface IProps {
  adventure: AdventureType | undefined;
}

export const GeneralSettings: FC<IProps> = ({ adventure }) => (
  <S.Wrapper>
    <div>
      <div style={{ marginBottom: 12 }}>
        <S.Label>Challenge Description</S.Label>
        <S.Description>{adventure?.description}</S.Description>
      </div>
      <div style={{ marginBottom: 12 }}>
        <S.Label>Tags</S.Label>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <S.Tag>Final</S.Tag>
          <S.AddTagButton>+ Add tag</S.AddTagButton>
        </div>
      </div>
      <S.Row>
        <div>
          <S.Label>Version</S.Label>
          <S.Input
            type="text"
            style={{ width: 60, marginLeft: 8 }}
            defaultValue={"5.4"}
          />
        </div>
        <div>
          <S.Label>Challenge timeout</S.Label>
          <S.Input
            type="number"
            style={{ width: 60, marginLeft: 8 }}
            defaultValue={180}
          />{" "}
          seconds
        </div>
      </S.Row>
      <div style={{ marginBottom: 12 }}>
        <S.Label>Upload music file (.wav)</S.Label>
        <S.Input type="file" accept=".wav" style={{ marginLeft: 8 }} />
        <S.FileLabel>AtlantisKey.wav</S.FileLabel>
      </div>
      <div style={{ marginBottom: 12 }}>
        <S.Label>Game launch sequence</S.Label>
        <S.SequenceRow>
          <select
            style={{
              borderRadius: 6,
              border: "1px solid #d1d5db",
              padding: 4,
            }}
          >
            <option>Select pad / button</option>
          </select>
          <S.AddTagButton>+ Add step</S.AddTagButton>
        </S.SequenceRow>
      </div>
      <S.Row style={{ alignItems: "center", marginBottom: 12 }}>
        <S.Label>Metronome</S.Label>
        <S.Input type="checkbox" style={{ marginLeft: 8 }} defaultChecked />
        <S.Input
          type="number"
          style={{ width: 60, marginLeft: 8 }}
          defaultValue={60}
        />{" "}
        bpm
      </S.Row>
      <S.ButtonRow>
        <S.ExportButton>Export challenge</S.ExportButton>
        <S.DeleteButton>Delete challenge</S.DeleteButton>
      </S.ButtonRow>
    </div>
  </S.Wrapper>
);
