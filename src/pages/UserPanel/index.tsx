import { SupabaseAPI } from "../../utils/service/api";
import * as S from "./styles";

interface UserPanelProps {
  userEmail: string;
  onSignOut?: () => void;
}

export const UserPanel: React.FC<UserPanelProps> = ({
  userEmail,
  onSignOut,
}) => {
  const handleSignOut = async () => {
    await SupabaseAPI.signOut();
    onSignOut?.();
  };

  return (
    <S.Container>
      <S.Email>{userEmail}</S.Email>
      <S.Button onClick={handleSignOut}>Sign Out</S.Button>
    </S.Container>
  );
};
