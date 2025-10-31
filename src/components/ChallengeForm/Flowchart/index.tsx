import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { ChallengeType } from "../../../utils/types/challenge.types";
import type { AdventureType } from "../../../utils/types/adventure.types";
import type {
  IntermediateNode,
  IEndNode,
} from "../../../utils/types/node.types";
import { NodeEditor, LoadingOverlay, ValidationPanel } from "../..";
import { NodeCard } from "./NodeCard";
import { EndNodeEditor } from "./EndNodeEditor";
import { FlowchartActionButtons } from "./FlowchartActionButtons";
import { VersionHistoryPanel } from "./VersionHistoryPanel";
import {
  simpleNodeToReactFlow,
  type CustomNodeData,
} from "./utils/nodeConverters";
import {
  useFlowchartEdges,
  useChallengeBuilder,
  useFlowchartValidation,
  useFlowchartSave,
  useVersionHistory,
} from "./hooks";
import {
  useNodeOperations,
  useNodeTransformations,
  useEdgeHandlers,
} from "./handlers";
import * as S from "./styles";

const AUTOSAVE_DELAY_MS = 3000; // 3 seconds

export interface FlowchartProps {
  challenge?: ChallengeType | null;
  adventure?: AdventureType;
  onUpdateAdventure?: (updatedAdventure: AdventureType) => Promise<void>;
}

export const Flowchart: React.FC<FlowchartProps> = ({
  challenge,
  adventure,
  onUpdateAdventure,
}) => {
  const [flowNodes, setFlowNodes, handleNodesChange] = useNodesState<Node>([]);
  const [flowEdges, setFlowEdges, handleEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutosaveEnabled, setIsAutosaveEnabled] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Build edges from challenge data
  const challengeEdges = useFlowchartEdges(challenge);

  // Version history - stores up to 20 last saved versions
  const {
    versions,
    currentVersionId,
    saveVersion: saveVersionToHistory,
    setAsCurrentVersion,
    clearHistory,
  } = useVersionHistory(challenge?.id);

  // Create versions list including current unsaved state
  const versionsWithCurrent = useMemo(() => {
    if (!challenge) return versions;

    // If there are no saved versions yet, or if current challenge has unsaved changes
    // add current challenge as the first "unsaved" version
    const currentVersion = {
      id: "current",
      challengeId: challenge.id,
      timestamp: new Date().toISOString(),
      challenge: challenge,
      description: hasUnsavedChanges ? "Unsaved changes" : "Current state",
      isAutosave: false,
    };

    // Only add current version if it's different from the first saved version
    // or if there are no saved versions yet
    if (versions.length === 0 || hasUnsavedChanges) {
      return [currentVersion, ...versions];
    }

    return versions;
  }, [challenge, versions, hasUnsavedChanges]);

  // Can rollback if there are at least 2 versions (current + previous)
  const canRollback = versions.length >= 2;

  // Challenge builder (flow state -> challenge)
  const { buildCurrentChallenge } = useChallengeBuilder(
    challenge,
    flowNodes,
    flowEdges
  );

  // Validation
  const {
    showValidation,
    handleValidate,
    validationResult,
    setShowValidation,
    handleValidationErrorClick,
  } = useFlowchartValidation({
    buildCurrentChallenge,
    hasUnsavedChanges,
    flowNodes,
  });

  // Save logic
  const { isSaving, handleSaveChanges } = useFlowchartSave({
    challenge,
    adventure,
    flowNodes,
    flowEdges,
    onUpdateAdventure,
    hasUnsavedChanges,
    setSelectedNodeId,
    setHasUnsavedChanges,
    saveVersionToHistory,
  });

  // Node operations (add, delete, add success/failure)
  const {
    handleAddNode,
    handleDeleteNode,
    handleAddSuccessNode,
    handleAddFailureNode,
  } = useNodeOperations({
    flowNodes,
    flowEdges,
    setFlowNodes,
    setFlowEdges,
    setHasUnsavedChanges,
  });

  // Node transformations (copy, convert)
  const {
    handleCopyNode,
    handleConvertEndToRestart,
    handleConvertEndToIntermediate,
  } = useNodeTransformations({
    flowNodes,
    flowEdges,
    setFlowNodes,
    setFlowEdges,
    handleAddNode,
    handleDeleteNode,
    setHasUnsavedChanges,
  });

  // Edge connection handling
  const { onConnect } = useEdgeHandlers({
    flowNodes,
    flowEdges,
    setFlowNodes,
    setFlowEdges,
    setHasUnsavedChanges,
  });

  // Custom handler for node changes to track position updates
  const handleCustomNodesChange = useCallback(
    (changes: NodeChange[]) => {
      handleNodesChange(changes);

      // Check if any position changes occurred
      const hasPositionChanges = changes.some(
        (change) =>
          change.type === "position" &&
          "dragging" in change &&
          change.dragging === false
      );

      if (hasPositionChanges) {
        setHasUnsavedChanges(true);
      }
    },
    [handleNodesChange, setHasUnsavedChanges]
  );

  // Custom handler for edge changes to track modifications
  const handleCustomEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      handleEdgesChange(changes);

      // Check if any edges were removed
      const hasEdgeChanges = changes.some((change) => change.type === "remove");

      if (hasEdgeChanges) {
        setHasUnsavedChanges(true);
      }
    },
    [handleEdgesChange, setHasUnsavedChanges]
  );

  const handleNodeClick = useCallback(
    (nodeId: string, nodeType: string) => {
      if (nodeType === "start" || isSaving) return;
      setSelectedNodeId(nodeId === selectedNodeId ? null : nodeId);
    },
    [selectedNodeId, isSaving]
  );

  // Get the selected node data for editing
  const selectedNodeForEditing = useMemo(():
    | IntermediateNode
    | IEndNode
    | null => {
    if (!selectedNodeId) {
      return null;
    }

    const flowNode = flowNodes.find((n) => n.id === selectedNodeId);
    if (
      !flowNode ||
      (flowNode.data.type !== "node" && flowNode.data.type !== "end")
    ) {
      return null;
    }

    // Handle IntermediateNode editing
    if (flowNode.data.type === "node") {
      const nodeData = flowNode.data?.nodeData as IntermediateNode;

      return {
        id: selectedNodeId,
        type: "node",
        x: flowNode.position.x,
        y: flowNode.position.y,
        events: nodeData?.events || [],
        timeOut: nodeData?.timeOut || null,
        description: nodeData?.description || "",
        exitEffects: nodeData?.exitEffects || [],
        entryEffects: nodeData?.entryEffects || [],
        width: (flowNode.style?.width as number) || 180,
        height: (flowNode.style?.height as number) || 80,
        success: nodeData?.success || `${selectedNodeId}-success`,
        failure: nodeData?.failure || `${selectedNodeId}-failure`,
        title: (flowNode.data.label as string) || `Node ${selectedNodeId}`,
      };
    }

    // Handle EndNode editing
    if (flowNode.data.type === "end") {
      const endNodeData = flowNode.data?.nodeData as IEndNode;
      return {
        type: "end",
        id: selectedNodeId,
        x: flowNode.position.x,
        y: flowNode.position.y,
        outcome: endNodeData?.outcome || "success",
        width: (flowNode.style?.width as number) || 120,
        height: (flowNode.style?.height as number) || 60,
      } as IEndNode;
    }

    return null;
  }, [selectedNodeId, flowNodes]);

  const handleNodeUpdate = useCallback(
    (updatedNode: IntermediateNode) => {
      // Update the node in the flowchart
      setFlowNodes((nodes) =>
        nodes.map((node) =>
          node.id === updatedNode.id
            ? {
                ...node,
                data: {
                  ...node.data,
                  label: updatedNode.title,
                  nodeData: updatedNode,
                },
              }
            : node
        )
      );

      // Mark as having unsaved changes
      setHasUnsavedChanges(true);
    },
    [setFlowNodes]
  );

  // Handle validation error click (navigate to node)
  const handleValidationErrorClickWithSelect = useCallback(
    (nodeId: string) => {
      const resultNodeId = handleValidationErrorClick(nodeId);
      setSelectedNodeId(resultNodeId);
    },
    [handleValidationErrorClick]
  );

  // Handle restore from version history
  const handleRestoreVersion = useCallback(
    async (versionId: string, restoredChallenge: ChallengeType) => {
      if (!adventure || !onUpdateAdventure) {
        console.warn("[Flowchart] Missing adventure or onUpdateAdventure");
        return;
      }

      setIsRestoring(true);
      try {
        // Update adventure with restored challenge in database
        const updatedAdventure = {
          ...adventure,
          challenges: {
            ...adventure.challenges,
            [restoredChallenge.id]: restoredChallenge,
          },
        };

        console.log("[Flowchart] Calling onUpdateAdventure...");
        await onUpdateAdventure(updatedAdventure);

        console.log("[Flowchart] Database updated successfully");

        // Mark the restored version as current (don't add a new version)
        // This makes it appear as "Current Version" in the list
        setAsCurrentVersion(versionId);

        setHasUnsavedChanges(false);
        setSelectedNodeId(null); // Clear any selected node

        console.log("[Flowchart] Restore completed successfully");
        // Note: flowchart will be rebuilt automatically by the useEffect
        // when the challenge prop updates from the parent component
      } catch (error) {
        console.error("[Flowchart] Failed to restore version:", error);
      } finally {
        setIsRestoring(false);
      }
    },
    [adventure, onUpdateAdventure, setAsCurrentVersion]
  );

  // Rollback - restore previous version from version history
  const handleQuickRollback = useCallback(async () => {
    console.log("[Flowchart] ===== ROLLBACK CLICKED =====");

    // Find the current version in the list
    const currentIndex = versionsWithCurrent.findIndex(
      (v) => v.id === currentVersionId || v.id === "current"
    );
    // Get the next version (previous in time)
    const previousVersion = versionsWithCurrent[currentIndex + 1];

    if (!previousVersion) {
      console.warn("[Flowchart] No previous version to rollback to");
      return;
    }

    // Skip "current" unsaved state - rollback to the next saved version
    if (previousVersion.id === "current") {
      const nextVersion = versionsWithCurrent[currentIndex + 2];
      if (!nextVersion) {
        console.warn("[Flowchart] No saved version to rollback to");
        return;
      }
      await handleRestoreVersion(nextVersion.id, nextVersion.challenge);
    } else {
      await handleRestoreVersion(previousVersion.id, previousVersion.challenge);
    }
  }, [versionsWithCurrent, currentVersionId, handleRestoreVersion]);

  // Initialize nodes and edges from challenge
  // This effect runs when challenge changes (including after restore)
  useEffect(() => {
    if (!challenge) {
      setFlowNodes([]);
      setFlowEdges([]);
      return;
    }

    console.log("[Flowchart] Rebuilding flowchart from challenge", {
      challengeId: challenge.id,
      updatedAt: challenge.updated_at,
      nodesCount: Object.keys(challenge.nodes || {}).length,
    });

    // Build initial nodes from challenge
    const rfNodes: Node[] = [
      ...(challenge.startNode
        ? [simpleNodeToReactFlow(challenge.startNode)]
        : []),
      ...Object.values(challenge.nodes || {}).map(simpleNodeToReactFlow),
      ...(challenge.endNodes ?? []).map(simpleNodeToReactFlow),
    ];

    // Build initial edges from challenge
    setFlowNodes(rfNodes);
    setFlowEdges(challengeEdges);
    setHasUnsavedChanges(false); // Reset unsaved changes when loading new challenge
  }, [
    challenge,
    challenge?.id,
    challenge?.updated_at, // Track updated_at to detect restore changes
    setFlowNodes,
    setFlowEdges,
    challengeEdges,
    setHasUnsavedChanges,
  ]);

  // Autosave logic: save 6 seconds after last change
  useEffect(() => {
    // Clear existing timer
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }

    // Only set timer if autosave is enabled and there are unsaved changes
    if (isAutosaveEnabled && hasUnsavedChanges && !isSaving) {
      autosaveTimerRef.current = setTimeout(() => {
        handleSaveChanges(true); // Pass true to indicate autosave
      }, AUTOSAVE_DELAY_MS);
    }

    // Cleanup on unmount
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [isAutosaveEnabled, hasUnsavedChanges, isSaving, handleSaveChanges]);

  // Node types for ReactFlow
  const nodeTypes = {
    custom: ({ id, data }: { id: string; data: CustomNodeData }) => {
      const isSelected = selectedNodeId === id;

      // Check if success/failure nodes exist for intermediate nodes
      const hasSuccessNode =
        data.type === "node"
          ? flowNodes.some((n) => n.id === `${id}-success`)
          : false;

      // Check if failure leads to an end node with outcome: "failure"
      const hasFailureEndNode =
        data.type === "node"
          ? (() => {
              const nodeData = data.nodeData as IntermediateNode;
              const failureId = nodeData.failure;
              if (!failureId || failureId === nodeData.id) return false; // Empty or RESTART

              const failureNode = flowNodes.find((n) => n.id === failureId);
              return (
                failureNode?.data.type === "end" &&
                (failureNode.data.nodeData as IEndNode).outcome === "failure"
              );
            })()
          : false;

      return (
        <NodeCard
          label={data.label}
          type={data.type}
          nodeData={data.nodeData}
          isSelected={isSelected}
          onNodeClick={() => handleNodeClick(id, data.type)}
          onAddNode={
            data.type === "start" && !isSaving
              ? () => handleAddNode(id)
              : undefined
          }
          onDeleteNode={
            data.type !== "start" && !isSaving
              ? () => handleDeleteNode(id)
              : undefined
          }
          onCopyNode={
            data.type === "node" && !isSaving
              ? () => handleCopyNode(id)
              : undefined
          }
          onAddSuccessNode={
            data.type === "node" && !hasSuccessNode && !isSaving
              ? () => handleAddSuccessNode(id)
              : undefined
          }
          onAddFailureNode={
            data.type === "node" && !isSaving
              ? () => handleAddFailureNode(id)
              : undefined
          }
          hasSuccessNode={hasSuccessNode}
          hasFailureEndNode={hasFailureEndNode}
        />
      );
    },
  };

  return (
    <S.Container>
      {/* Action Buttons */}
      <FlowchartActionButtons
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        validationResult={validationResult}
        challengeExists={!!challenge}
        isAutosaveEnabled={isAutosaveEnabled}
        canRollback={canRollback}
        isRestoring={isRestoring}
        onSave={handleSaveChanges}
        onValidate={handleValidate}
        onAutosaveToggle={setIsAutosaveEnabled}
        onRollback={handleQuickRollback}
      />

      <ReactFlow
        key={`reactflow-${flowNodes.length}-${flowEdges.length}`}
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={isSaving ? () => {} : handleCustomNodesChange}
        onEdgesChange={isSaving ? () => {} : handleCustomEdgesChange}
        onConnect={isSaving ? () => {} : onConnect}
        nodeTypes={nodeTypes}
        nodesDraggable={!isSaving}
        nodesConnectable={!isSaving}
        elementsSelectable={!isSaving}
        defaultEdgeOptions={{
          style: { strokeWidth: 3, stroke: "#3b82f6" },
          animated: true,
          markerEnd: {
            type: "arrowclosed",
            color: "#3b82f6",
          },
        }}
        fitView
      >
        <Background color="#e0e7ef" gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {/* Loading Overlay - hide when autosave is enabled */}
      <LoadingOverlay
        isVisible={isSaving && !isAutosaveEnabled}
        message="Saving changes..."
        subMessage="Please wait"
      />

      {selectedNodeForEditing &&
        !isSaving &&
        selectedNodeForEditing.type === "node" && (
          <NodeEditor
            selectedNode={selectedNodeForEditing as IntermediateNode}
            onSave={handleNodeUpdate}
            onClose={() => setSelectedNodeId(null)}
          />
        )}

      {selectedNodeForEditing &&
        !isSaving &&
        selectedNodeForEditing.type === "end" && (
          <EndNodeEditor
            selectedNode={selectedNodeForEditing as IEndNode}
            flowEdges={flowEdges}
            onConvertToIntermediate={(nodeId) => {
              handleConvertEndToIntermediate(nodeId);
              setSelectedNodeId(null);
            }}
            onConvertToRestart={(nodeId) => {
              handleConvertEndToRestart(nodeId);
              setSelectedNodeId(null);
            }}
            onClose={() => setSelectedNodeId(null)}
          />
        )}

      {/* Validation Panel */}
      {showValidation && validationResult && (
        <ValidationPanel
          validationResult={validationResult}
          onErrorClick={handleValidationErrorClickWithSelect}
          onClose={() => setShowValidation(false)}
        />
      )}

      {/* Version History Panel */}
      <VersionHistoryPanel
        versions={versionsWithCurrent}
        currentVersionId={currentVersionId}
        onRestore={handleRestoreVersion}
        onClearHistory={clearHistory}
        isRestoring={isRestoring}
      />
    </S.Container>
  );
};
