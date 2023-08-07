import React, { useCallback, useContext } from "react";
import { memo } from "react";
import { Handle, NodeProps, Position, ReactFlowState, getConnectedEdges, useNodeId, useStore } from "reactflow";
import { DesignerContext } from "./utils";

export const Start = memo(({
  data,
  sourcePosition = Position.Bottom
}: NodeProps) => {
  const nodeId = useNodeId();
  const ctx = useContext(DesignerContext)
  const isConnectable = useStore(
    useCallback(selector(nodeId, ctx.maxStartingSteps), [
      nodeId,
  ]))
  
  return (
    <>
      {data?.label}
      <Handle
        type="source"
        position={sourcePosition}
        isConnectable={isConnectable}
      />
    </>
  );
});

Start.displayName = "StartNode";

export const End = memo(({
  data,
  targetPosition = Position.Top,
}: NodeProps) => {
  const nodeId = useNodeId();
  const ctx = useContext(DesignerContext)
  const isConnectable = useStore(
    useCallback(selector(nodeId, ctx.maxEndSteps), [
      nodeId,
  ]))

  return (
    <>
      <Handle
        type="target"
        position={targetPosition}
        isConnectable={isConnectable}
      />
      {data?.label}
    </>
  );
});

End.displayName = "EndNode";

export const QuestStep = ({
  data,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom
}: NodeProps) => {
  const nodeId = useNodeId();
  const ctx = useContext(DesignerContext)
  const isConnectable = useStore(
    useCallback(selector(nodeId, ctx.maxConnnectionsPerStep), [
      nodeId,
  ]))

  return (
    <>
      <Handle
        type="target"
        position={targetPosition}
        isConnectable={isConnectable}
      />
      {data?.id}
      <Handle
        type="source"
        position={sourcePosition}
        isConnectable={isConnectable}
      />
    </>
  );
};

const selector =
  (nodeId: string | null, maxConnections = Infinity) =>
  (s: ReactFlowState) => {
    const node = s.nodeInternals.get(nodeId!);
    const connectedEdges = getConnectedEdges([node!], s.edges);

    return connectedEdges.length <= maxConnections;
};