import type { FC } from "react";
import { useNavigate } from "react-router-dom";

import * as S from "./styles";
import type { AdventureType } from "../../utils/types/adventure.types";
import { RoutePathNames } from "../../utils/constants";
import { DeleteButton } from "./DeleteButton";
import { useAdventures } from "../../utils/hooks";
import { adventureToasts } from "../../utils/toast";

interface IProps {
  data: AdventureType[];
  onDeleteItem: (id: string) => void;
  onDuplicateItem?: (id: string) => void;
}

export const AdventureTable: FC<IProps> = ({
  data,
  onDeleteItem,
  onDuplicateItem,
}) => {
  const navigate = useNavigate();
  const { exportAdventure } = useAdventures();

  const handleExportAdventure = (adventure: AdventureType) => {
    try {
      exportAdventure(adventure);
      adventureToasts.exportSuccess(adventure.title);
    } catch (error) {
      adventureToasts.exportError(
        error instanceof Error ? error.message : undefined
      );
    }
  };

  return (
    <S.Table>
      <thead>
        <tr>
          <S.Th>Adventure</S.Th>
          <S.Th>Date created</S.Th>
          <S.Th>Last modified</S.Th>
          <S.Th>Version</S.Th>
          <S.Th>Tag</S.Th>
          <S.Th>Challenges</S.Th>
          <S.Th>Action</S.Th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <S.Td>{row.title}</S.Td>
            <S.Td>{row.created_at || "-- --"} </S.Td>
            <S.Td>{row.updated_at || "-- --"}</S.Td>
            <S.Td>{row.version}</S.Td>
            <S.Td>
              {row.tag ? <S.Badge $type="draft">{row.tag}</S.Badge> : "--"}
            </S.Td>
            <S.Td>{"-- --"}</S.Td>
            <S.Td>
              <S.Actions>
                <S.Button
                  onClick={() =>
                    row.id &&
                    navigate(
                      RoutePathNames.EditAdventure.replace(":id", row.id)
                    )
                  }
                  $color="#0d6efd"
                >
                  Edit
                </S.Button>
                <DeleteButton
                  adventureName={row.title}
                  onDelete={() => onDeleteItem(row.id)}
                />
                <S.Button
                  $color="#6c757d"
                  onClick={() => onDuplicateItem?.(row.id)}
                >
                  Duplicate
                </S.Button>
                <S.Button
                  $color="#198754"
                  onClick={() => handleExportAdventure(row)}
                >
                  Export
                </S.Button>
              </S.Actions>
            </S.Td>
          </tr>
        ))}
      </tbody>
    </S.Table>
  );
};
