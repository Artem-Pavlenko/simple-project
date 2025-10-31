import { useState, type FC } from "react";
import * as S from "./styles";
import type { TagType } from "../../utils/types";
import { SelectField, type SelectOption } from "../SelectField";

const TAG_OPTIONS: SelectOption<TagType | "">[] = [
  { value: "", label: "Select tag" },
  { value: "Draft", label: "Draft" },
  { value: "Not started", label: "Not started" },
];

interface IProps {
  onGoBack?: () => void;
  titleText?: string;
  labelText?: string;
  onCreate?: (
    title: string,
    description: string,
    tag: TagType | undefined,
    version: string
  ) => void;
}

export const CreateForm: FC<IProps> = ({
  onGoBack,
  titleText,
  labelText,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState<TagType | undefined>("Draft");
  const [version, setVersion] = useState("1.0");

  return (
    <S.Wrapper>
      <S.Title>{titleText}</S.Title>

      <S.Label>{labelText}</S.Label>
      <S.Input
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        type="text"
        placeholder="Enter adventure title"
      />

      <S.Label>Description</S.Label>
      <S.TextArea
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        placeholder="Enter adventure description"
      />

      <SelectField
        value={tag || ""}
        onChange={(value) =>
          setTag(value === "" ? undefined : (value as TagType))
        }
        options={TAG_OPTIONS}
        label="Tags"
      />

      <S.Label>Version</S.Label>
      <S.Input
        value={version}
        onChange={(e) => setVersion(e.currentTarget.value)}
        type="text"
        placeholder="1.0"
      />

      <S.ButtonsWrapper>
        {onGoBack && <S.BackButton onClick={onGoBack}>{"< Back"}</S.BackButton>}
        <S.Button onClick={() => onCreate?.(title, description, tag, version)}>
          {"Start editing >"}
        </S.Button>
      </S.ButtonsWrapper>
    </S.Wrapper>
  );
};
