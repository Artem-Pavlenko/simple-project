import type { FC } from "react";
import { useNavigate } from "react-router-dom";

import { Actions, Badge, Button, Table, Td, Th } from "./styles";
import type { IAdventure } from "../../stores/adventureStore";
import { RoutePathNames } from "../../utils/constants";
import { DeleteButton } from "./DeleteButton";

interface IProps {
  data: IAdventure[];
  onDeleteItem: (id: string) => void;
}

export const AdventureTable: FC<IProps> = ({ data, onDeleteItem }) => {
  const navigate = useNavigate();

  return (
    <Table>
      <thead>
        <tr>
          <Th>Adventure</Th>
          <Th>Date created</Th>
          <Th>Last modified</Th>
          <Th>Version</Th>
          <Th>Challenges</Th>
          <Th>Action</Th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <Td>{row.title}</Td>
            <Td>{row.created_at || "-- --"} </Td>
            <Td>{row.updated_at || "-- --"}</Td>
            <Td>
              {row.version}{" "}
              <Badge $type={row.type as "draft" | "final"}>{row.type}</Badge>
            </Td>
            <Td>{"-- --"}</Td>
            <Td>
              <Actions>
                <Button
                  onClick={() =>
                    row.id &&
                    navigate(
                      RoutePathNames.EditAdventure.replace(":id", row.id)
                    )
                  }
                  $color="#0d6efd"
                >
                  Edit
                </Button>
                <DeleteButton
                  adventureName={row.title}
                  onDelete={() => onDeleteItem(row.id)}
                />
                <Button $color="#6c757d">Duplicate</Button>
                <Button $color="#198754">Export</Button>
              </Actions>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
