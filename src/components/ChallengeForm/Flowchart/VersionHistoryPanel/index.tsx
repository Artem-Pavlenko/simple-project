import { useState, type FC } from "react";

import type { ChallengeVersion } from "../../../../utils/types/versionHistory.types";
import type { ChallengeType } from "../../../../utils/types/challenge.types";
import * as S from "./styles";
import { ConfirmModal } from "../../..";

interface VersionHistoryPanelProps {
  versions: ChallengeVersion[];
  currentVersionId: string | null;
  onRestore: (versionId: string, challenge: ChallengeType) => void;
  onClearHistory: () => void;
  isRestoring?: boolean;
}

export const VersionHistoryPanel: FC<VersionHistoryPanelProps> = ({
  versions,
  currentVersionId,
  onRestore,
  onClearHistory,
  isRestoring = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [restoreModal, setRestoreModal] = useState<{
    open: boolean;
    version: ChallengeVersion | null;
  }>({ open: false, version: null });

  // Format timestamp for display
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return "Today";
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Calculate time ago
  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 minute ago";
    if (diffMins < 60) return `${diffMins} minutes ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return formatDate(timestamp);
  };

  // Count nodes in challenge
  const countNodes = (challenge: ChallengeType): number => {
    return (
      Object.keys(challenge.nodes || {}).length +
      (challenge.endNodes?.length || 0)
    );
  };

  const handleRestore = (version: ChallengeVersion) => {
    setRestoreModal({ open: true, version });
  };

  const handleConfirmRestore = () => {
    if (restoreModal.version) {
      onRestore(restoreModal.version.id, restoreModal.version.challenge);
    }
    setRestoreModal({ open: false, version: null });
  };

  const handleCancelRestore = () => {
    setRestoreModal({ open: false, version: null });
  };

  const handleClearHistory = () => {
    if (
      window.confirm(
        `Are you sure you want to clear all ${versions.length} saved versions?\n\nThis action cannot be undone.`
      )
    ) {
      onClearHistory();
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={restoreModal.open}
        title="Restore Version"
        message={
          restoreModal.version
            ? `Are you sure you want to restore this version from ${formatDate(
                restoreModal.version.timestamp
              )} at ${formatTime(
                restoreModal.version.timestamp
              )}?\n\nThis will replace your current flowchart.`
            : ""
        }
        confirmText="Restore"
        cancelText="Cancel"
        onConfirm={handleConfirmRestore}
        onCancel={handleCancelRestore}
        isLoading={isRestoring}
      />
      <S.ToggleButton $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "CLOSE HISTORY" : "VERSION HISTORY"} ({versions.length})
      </S.ToggleButton>

      <S.Panel $isOpen={isOpen}>
        <S.Header>
          <S.Title>Version History</S.Title>
          <S.CloseButton onClick={() => setIsOpen(false)}>×</S.CloseButton>
        </S.Header>

        <S.VersionList>
          {versions.length === 0 ? (
            <S.EmptyState>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
              <div style={{ fontSize: "14px", fontWeight: "500" }}>
                No saved versions yet
              </div>
              <div style={{ fontSize: "12px", marginTop: "8px" }}>
                Enable autosave to automatically save versions
              </div>
            </S.EmptyState>
          ) : (
            versions.map((version) => (
              <S.VersionItem key={version.id}>
                <S.VersionHeader>
                  <S.VersionInfo>
                    <S.VersionTime>
                      {formatTime(version.timestamp)}
                    </S.VersionTime>
                    <S.VersionDate>
                      {getTimeAgo(version.timestamp)}
                    </S.VersionDate>
                  </S.VersionInfo>
                  <S.VersionBadge $isAutosave={version.isAutosave}>
                    {version.isAutosave ? "Auto" : "Manual"}
                  </S.VersionBadge>
                </S.VersionHeader>

                <S.VersionDetails>
                  <S.DetailRow>
                    <S.DetailLabel>Nodes:</S.DetailLabel>
                    <S.DetailValue>
                      {countNodes(version.challenge)}
                    </S.DetailValue>
                  </S.DetailRow>
                  {version.challenge.tag && (
                    <S.DetailRow>
                      <S.DetailLabel>Tag:</S.DetailLabel>
                      <S.DetailValue>{version.challenge.tag}</S.DetailValue>
                    </S.DetailRow>
                  )}
                  {(version.id === currentVersionId ||
                    version.id === "current") && (
                    <S.DetailRow>
                      <S.DetailLabel>Status:</S.DetailLabel>
                      <S.DetailValue
                        style={{ color: "#059669", fontWeight: "600" }}
                      >
                        {version.id === "current" ? "Unsaved" : "Current"}
                      </S.DetailValue>
                    </S.DetailRow>
                  )}
                </S.VersionDetails>

                <S.RestoreButton
                  onClick={() => handleRestore(version)}
                  disabled={
                    isRestoring ||
                    version.id === currentVersionId ||
                    version.id === "current"
                  }
                  title={
                    version.id === "current"
                      ? "This is your current unsaved state"
                      : version.id === currentVersionId
                      ? "This is the current version"
                      : "Restore this version"
                  }
                >
                  {version.id === "current"
                    ? "Current (Unsaved)"
                    : version.id === currentVersionId
                    ? "Current Version"
                    : isRestoring
                    ? "Restoring..."
                    : "Restore"}
                </S.RestoreButton>
              </S.VersionItem>
            ))
          )}
        </S.VersionList>

        {versions.length > 0 && (
          <S.ClearButton onClick={handleClearHistory} disabled={isRestoring}>
            Clear All History
          </S.ClearButton>
        )}
      </S.Panel>
    </>
  );
};
