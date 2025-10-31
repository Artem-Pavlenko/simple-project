import { useState, useMemo, type FC } from "react";

import { type AdventureType } from "../../../utils/types/adventure.types";
import { type ChallengeType } from "../../../utils/types/challenge.types";
import { useChallenges } from "../../../utils/hooks";
import { challengeToasts } from "../../../utils/toast";
import { AddButton } from "../../AddButton";
import * as S from "./styles";

type DeleteConfirmType = {
  isOpen: boolean;
  challenge?: ChallengeType;
  isDeleting?: boolean;
};
interface IProps {
  adventure?: AdventureType;
}

export const Challenges: FC<IProps> = ({ adventure }) => {
  const {
    navigateToCreateNewChallenge,
    navigateToEditChallenge,
    exportChallenge,
    deleteChallenge,
  } = useChallenges();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmType>({
    isOpen: false,
    isDeleting: false,
  });

  // Filter challenges based on search query
  const filteredChallenges = useMemo(() => {
    if (!adventure?.challenges) return [];

    const challenges = Object.values(adventure.challenges);

    if (!searchQuery.trim()) return challenges;

    return challenges.filter(
      (challenge) =>
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [adventure?.challenges, searchQuery]);

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Edit challenge
  const handleEdit = (challenge: ChallengeType) => {
    if (adventure?.id) {
      navigateToEditChallenge(adventure.id, challenge.id);
    }
  };

  // Handle challenge export (FR-2.12) - now using the hook
  const handleExport = (challenge: ChallengeType) => {
    exportChallenge(challenge);
  };

  // Handle challenge delete with confirmation
  // Confirm delete action
  const handleConfirmDelete = async () => {
    if (!deleteConfirm.challenge || !adventure?.id) return;

    setDeleteConfirm((prev) => ({ ...prev, isDeleting: true }));

    try {
      const challengeTitle = deleteConfirm.challenge.title;
      await deleteChallenge(adventure.id, deleteConfirm.challenge.id);
      challengeToasts.deleteSuccess(challengeTitle);
      setDeleteConfirm({ isOpen: false, isDeleting: false });
    } catch (error) {
      console.error("Failed to delete challenge:", error);
      challengeToasts.deleteError(
        error instanceof Error ? error.message : undefined
      );
      setDeleteConfirm((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Cancel delete action
  const handleCancelDelete = () => {
    if (deleteConfirm.isDeleting) return;
    setDeleteConfirm({ isOpen: false, isDeleting: false });
  };

  return (
    <S.Wrapper>
      <AddButton
        onClick={() =>
          adventure?.id && navigateToCreateNewChallenge(adventure.id)
        }
        $marginBottom={20}
      >
        + New challenge
      </AddButton>

      <S.SearchContainer>
        <S.SearchInput
          type="text"
          placeholder="Search challenges..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </S.SearchContainer>

      {filteredChallenges.length === 0 ? (
        <S.EmptyState>
          {searchQuery
            ? "No challenges match your search."
            : "No challenges yet. Create your first challenge!"}
        </S.EmptyState>
      ) : (
        <S.Table>
          <S.TableHeader>
            <S.TableRow>
              <S.TableHeaderCell>Challenge</S.TableHeaderCell>
              <S.TableHeaderCell>Tag</S.TableHeaderCell>
              <S.TableHeaderCell>Date created</S.TableHeaderCell>
              <S.TableHeaderCell>Last modified</S.TableHeaderCell>
              <S.TableHeaderCell>Version</S.TableHeaderCell>
              <S.TableHeaderCell>Action</S.TableHeaderCell>
            </S.TableRow>
          </S.TableHeader>
          <tbody>
            {filteredChallenges.map((challenge) => (
              <S.TableRow key={challenge.id}>
                <S.TableCell>
                  <S.ChallengeTitle>{challenge.title}</S.ChallengeTitle>
                </S.TableCell>
                <S.TableCell>
                  {challenge.tag && (
                    <S.StatusBadge $status={challenge.tag}>
                      {challenge.tag}
                    </S.StatusBadge>
                  )}
                </S.TableCell>
                <S.TableCell>{formatDate(challenge.created_at)}</S.TableCell>
                <S.TableCell>{formatDate(challenge.updated_at)}</S.TableCell>
                <S.TableCell>
                  <S.StatusBadge>{challenge.version}</S.StatusBadge>
                </S.TableCell>
                <S.TableCell>
                  <S.ActionButtons>
                    <S.ActionButton
                      $variant="edit"
                      onClick={() => handleEdit(challenge)}
                      title="Edit challenge"
                    >
                      Edit
                    </S.ActionButton>
                    <S.ActionButton
                      $variant="export"
                      onClick={() => handleExport(challenge)}
                      title="Export challenge as JSON"
                    >
                      Export
                    </S.ActionButton>
                    <S.ActionButton
                      $variant="delete"
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          challenge,
                          isDeleting: false,
                        })
                      }
                      title="Delete challenge"
                    >
                      Delete
                    </S.ActionButton>
                  </S.ActionButtons>
                </S.TableCell>
              </S.TableRow>
            ))}
          </tbody>
        </S.Table>
      )}

      {/* Delete Confirmation Modal */}
      <S.ConfirmModal $isOpen={deleteConfirm.isOpen}>
        <S.ConfirmContent>
          <S.ConfirmTitle>Delete Challenge</S.ConfirmTitle>
          <S.ConfirmMessage>
            Are you sure you want to delete "{deleteConfirm.challenge?.title}"?
            <br />
            This action cannot be undone.
          </S.ConfirmMessage>
          <S.ConfirmButtons>
            <S.ConfirmButton
              $variant="secondary"
              onClick={handleCancelDelete}
              disabled={deleteConfirm.isDeleting}
            >
              Cancel
            </S.ConfirmButton>
            <S.ConfirmButton
              $variant="primary"
              onClick={handleConfirmDelete}
              disabled={deleteConfirm.isDeleting}
            >
              {deleteConfirm.isDeleting ? "Deleting..." : "Delete"}
            </S.ConfirmButton>
          </S.ConfirmButtons>
        </S.ConfirmContent>
      </S.ConfirmModal>
    </S.Wrapper>
  );
};
