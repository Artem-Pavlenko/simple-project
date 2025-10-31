import { useState, type FC, useEffect, useMemo } from "react";
import * as S from "../CreateForm/styles";
import type { TagType } from "../../utils/types";
import type { AdventureType } from "../../utils/types/adventure.types";
import { SelectField, type SelectOption } from "..";

const TAG_OPTIONS: SelectOption<TagType | "">[] = [
  { value: "", label: "Select tag" },
  { value: "Draft", label: "Draft" },
  { value: "Final", label: "Final" },
  { value: "Not started", label: "Not started" },
];

interface IProps {
  onGoBack?: () => void;
  titleText?: string;
  onCreate?: (
    selectedAdventureId: string,
    title: string,
    description: string,
    tag: TagType | undefined,
    version: string
  ) => void;
  adventures: AdventureType[];
}

export const ImportFromProjectForm: FC<IProps> = ({
  onGoBack,
  titleText,
  onCreate,
  adventures,
}) => {
  const [selectedAdventureId, setSelectedAdventureId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState<TagType | undefined>("Draft");
  const [version, setVersion] = useState("1.0");

  const adventureOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "Choose an adventure" },
      ...adventures.map((adventure) => ({
        value: adventure.id,
        label: `${adventure.title}${
          adventure.tag ? ` (${adventure.tag})` : ""
        }`,
      })),
    ],
    [adventures]
  );

  // Auto-populate fields when adventure is selected
  useEffect(() => {
    if (selectedAdventureId) {
      const selectedAdventure = adventures.find(
        (adv) => adv.id === selectedAdventureId
      );
      if (selectedAdventure) {
        setTitle(`Copy of ${selectedAdventure.title}`);
        setDescription(selectedAdventure.description || "");
        setTag(selectedAdventure.tag);
        setVersion(selectedAdventure.version || "1.0");
      }
    } else {
      setTitle("");
      setDescription("");
      setTag("Draft");
      setVersion("1.0");
    }
  }, [selectedAdventureId, adventures]);

  const handleCreate = () => {
    if (selectedAdventureId && title) {
      onCreate?.(selectedAdventureId, title, description, tag, version);
    }
  };

  return (
    <S.Wrapper>
      <S.Title>{titleText}</S.Title>

      <SelectField
        value={selectedAdventureId}
        onChange={setSelectedAdventureId}
        options={adventureOptions}
        label="Select Adventure to Copy"
      />

      {selectedAdventureId && (
        <>
          <S.Label>New Adventure Title</S.Label>
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
        </>
      )}

      <S.ButtonsWrapper>
        {onGoBack && <S.BackButton onClick={onGoBack}>{"< Back"}</S.BackButton>}
        <S.Button
          onClick={handleCreate}
          disabled={!selectedAdventureId || !title}
        >
          {"Start editing >"}
        </S.Button>
      </S.ButtonsWrapper>
    </S.Wrapper>
  );
};
