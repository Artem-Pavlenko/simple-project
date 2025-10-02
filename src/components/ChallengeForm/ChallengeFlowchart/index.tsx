import type { FC } from "react";
import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import * as S from "./styles";

interface IProps {
  handleAddNode: () => void;
  nodes: any[];
  edges: any[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  selectedNodeId: string | null;
  handleNodeClick: (event: any, node: any) => void;
  sideTab: "GENERAL" | "TRIGGERS";
  setSideTab: (tab: "GENERAL" | "TRIGGERS") => void;
}

export const ChallengeFlowchart: FC<IProps> = ({
  handleAddNode,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  selectedNodeId,
  handleNodeClick,
  sideTab,
  setSideTab,
}) => {
  return (
    <S.Section>
      <div>
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={handleAddNode}
            style={{
              background: "#e0e7ef",
              border: "none",
              borderRadius: 6,
              padding: "6px 14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            + Add node
          </button>
        </div>
        <div
          style={{
            display: "flex",
            height: 350,
            background: "#fff",
            borderRadius: 8,
          }}
        >
          <div style={{ flex: 1, position: "relative" }}>
            <ReactFlow
              nodes={nodes.map((node) =>
                node.id === selectedNodeId
                  ? {
                      ...node,
                      style: {
                        ...node.style,
                        boxShadow: "0 0 0 3px #60a5fa",
                        border: "2px solid #60a5fa",
                        minWidth:
                          typeof node.style.minWidth === "number"
                            ? node.style.minWidth
                            : 120,
                      },
                    }
                  : {
                      ...node,
                      style: {
                        ...node.style,
                        boxShadow: node.style.boxShadow ?? "",
                        minWidth:
                          typeof node.style.minWidth === "number"
                            ? node.style.minWidth
                            : 120,
                      },
                    }
              )}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              fitView
            >
              <Background color="#e0e7ef" gap={16} />
              <Controls />
              <MiniMap
                nodeColor={(n) =>
                  n.id === "fail"
                    ? "#ef4444"
                    : n.id === "success"
                    ? "#22c55e"
                    : "#60a5fa"
                }
              />
            </ReactFlow>
          </div>
          {selectedNodeId && (
            <div
              style={{
                width: 340,
                background: "#f8fafc",
                borderLeft: "1px solid #e0e7ef",
                padding: 24,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                <button
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: 8,
                    border: "none",
                    background:
                      sideTab === "GENERAL" ? "#e0e7ef" : "transparent",
                    fontWeight: 600,
                    color: "#222",
                    cursor: "pointer",
                    fontSize: 16,
                    transition: "background 0.2s",
                  }}
                  onClick={() => setSideTab("GENERAL")}
                >
                  GENERAL
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: 8,
                    border: "none",
                    background:
                      sideTab === "TRIGGERS" ? "#e0e7ef" : "transparent",
                    fontWeight: 600,
                    color: "#222",
                    cursor: "pointer",
                    fontSize: 16,
                    transition: "background 0.2s",
                  }}
                  onClick={() => setSideTab("TRIGGERS")}
                >
                  TRIGGERS
                </button>
              </div>
              {sideTab === "GENERAL" ? (
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 12,
                    }}
                  >
                    General node settings
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontWeight: 500 }}>Node name:</label>
                    <input
                      type="text"
                      style={{
                        width: "100%",
                        marginTop: 4,
                        padding: 6,
                        borderRadius: 6,
                        border: "1px solid #e0e7ef",
                      }}
                      defaultValue={
                        nodes.find((n) => n.id === selectedNodeId)?.data?.label
                          ?.props?.children || ""
                      }
                    />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontWeight: 500 }}>Timeout (sec):</label>
                    <input
                      type="number"
                      style={{
                        width: 80,
                        marginTop: 4,
                        padding: 6,
                        borderRadius: 6,
                        border: "1px solid #e0e7ef",
                      }}
                      defaultValue={10}
                    />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontWeight: 500 }}>Entry effects:</label>
                    <div style={{ marginTop: 4 }}>
                      <span>🔊 Beep</span>, <span>🔵 Blink [L1,L6] 10 sec</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 12,
                    }}
                  >
                    Triggers
                  </div>
                  <div
                    style={{
                      marginBottom: 10,
                      background: "#fff",
                      borderRadius: 8,
                      padding: 12,
                      boxShadow: "0 2px 8px #0001",
                    }}
                  >
                    <div style={{ fontWeight: 500, marginBottom: 6 }}>
                      When <b>P3 is pressed</b>
                    </div>
                    <div>🔊 Audio: Cheers</div>
                    <div>🎯 State: Success</div>
                  </div>
                  <div
                    style={{
                      marginBottom: 10,
                      background: "#fff",
                      borderRadius: 8,
                      padding: 12,
                      boxShadow: "0 2px 8px #0001",
                    }}
                  >
                    <div style={{ fontWeight: 500, marginBottom: 6 }}>
                      When <b>15 seconds elapsed</b>
                    </div>
                    <div>⚡ Rod speed +10 rpm</div>
                  </div>
                  <div
                    style={{
                      marginBottom: 10,
                      background: "#fff",
                      borderRadius: 8,
                      padding: 12,
                      boxShadow: "0 2px 8px #0001",
                    }}
                  >
                    <div style={{ fontWeight: 500, marginBottom: 6 }}>
                      When <b>rod hit</b>
                    </div>
                    <div>🔊 Audio: Womp</div>
                    <div>🎯 State: Failure</div>
                  </div>
                  <div
                    style={{
                      marginBottom: 10,
                      background: "#fff",
                      borderRadius: 8,
                      padding: 12,
                      boxShadow: "0 2px 8px #0001",
                    }}
                  >
                    <div style={{ fontWeight: 500, marginBottom: 6 }}>
                      When <b>timeout</b>
                    </div>
                    <div>🔊 Audio: Tick-tock</div>
                    <div>🎯 State: Failure</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 18,
                height: 18,
                background: "#f9fbe7",
                borderRadius: 4,
                border: "1px solid #e0e7ef",
              }}
            ></div>
            <span style={{ fontSize: 13 }}>Challenge node</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 18,
                height: 18,
                background: "#6ee7b7",
                borderRadius: 4,
              }}
            ></div>
            <span style={{ fontSize: 13 }}>Challenge success</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 18,
                height: 18,
                background: "#fca5a5",
                borderRadius: 4,
              }}
            ></div>
            <span style={{ fontSize: 13 }}>Challenge fail</span>
          </div>
        </div>
        <div style={{ marginTop: 16, fontSize: 13, color: "#888" }}>
          <b>Delete node:</b> Click node and press <kbd>Delete</kbd> or{" "}
          <kbd>Backspace</kbd>.<br />
          <b>Move node:</b> Drag & drop.
          <br />
          <b>Add node:</b> Use "+ Add node" button.
          <br />
          <b>Add edge:</b> Drag from node handle.
        </div>
      </div>
    </S.Section>
  );
};
