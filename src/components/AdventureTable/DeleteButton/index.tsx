import { useState } from "react";

import * as S from "./styles";

interface DeleteButtonProps {
  adventureName: string;
  onDelete: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  adventureName,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <S.DeleteWrapper>
      <S.Button $color="#dc3545" onClick={() => setOpen((prev) => !prev)}>
        Delete
      </S.Button>

      {open && (
        <S.Popover>
          <div>
            Are you sure want to delete <b>{adventureName}</b>?
          </div>
          <S.PopoverActions>
            <S.Button onClick={() => setOpen(false)}>Cancel</S.Button>
            <S.Button $color="#dc3545" onClick={onDelete}>
              Delete
            </S.Button>
          </S.PopoverActions>
        </S.Popover>
      )}
    </S.DeleteWrapper>
  );
};
