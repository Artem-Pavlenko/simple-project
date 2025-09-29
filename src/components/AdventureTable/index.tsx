import type { FC } from "react";
import { Actions, Badge, Button, Table, Td, Th } from "./styles";
import type { IAdventure } from "../../stores/adventureStore";
import { DeleteButton } from "./DeleteButton";

interface IProps {
  data: IAdventure[];
  onDeleteItem: (id: string) => void;
}

export const AdventureTable: FC<IProps> = ({ data, onDeleteItem }) => {
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
            <Td>{row.createdAt || "-- --"} </Td>
            <Td>{row.updatedAt || "-- --"}</Td>
            <Td>
              {row.version}{" "}
              <Badge $type={row.type as "draft" | "final"}>{row.type}</Badge>
            </Td>
            <Td>
              {row.challenges?.length
                ? row.challenges.map((ch, i) => (
                    <div key={i}>
                      <a href="#">{ch}</a>
                    </div>
                  ))
                : "-"}
            </Td>
            <Td>
              <Actions>
                <Button $color="#0d6efd">Edit</Button>
                <DeleteButton
                  adventureName={row.title}
                  onDelete={() => onDeleteItem(row.id)}
                />
                <Button $color="#dc3545">Delete</Button>
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
