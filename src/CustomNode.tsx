import React, { memo, useCallback, useContext } from "react"

import { Handle, NodeProps, Position, ReactFlowState, getConnectedEdges, useNodeId, useStore } from "reactflow"

import { DesignerContext } from "./utils"

export const Start = memo(({ data, sourcePosition = Position.Bottom }: NodeProps) => {
  const nodeId = useNodeId()
  const ctx = useContext(DesignerContext)
  const isConnectable = useStore(useCallback(selector(nodeId, ctx.maxStartingSteps), [nodeId]))

  return (
    <>
      {data?.label}
      <Handle type="source" position={sourcePosition} isConnectable={isConnectable} />
    </>
  )
})

Start.displayName = "StartNode"

export const End = memo(({ data, targetPosition = Position.Top }: NodeProps) => {
  const nodeId = useNodeId()
  const ctx = useContext(DesignerContext)
  const isConnectable = useStore(useCallback(selector(nodeId, ctx.maxEndSteps), [nodeId]))

  return (
    <>
      <Handle type="target" position={targetPosition} isConnectable={isConnectable} />
      {data?.label}
    </>
  )
})

End.displayName = "EndNode"

export const QuestStep = ({ data, targetPosition = Position.Top, sourcePosition = Position.Bottom }: NodeProps) => {
  const nodeId = useNodeId()
  const ctx = useContext(DesignerContext)
  const isConnectable = useStore(useCallback(selector(nodeId, ctx.maxConnnectionsPerStep), [nodeId]))

  return (
    <>
      <Handle type="target" position={targetPosition} isConnectable={isConnectable} />
      {data?.id}
      <Handle type="source" position={sourcePosition} isConnectable={isConnectable} />
    </>
  )
}

export const InvalidQuestStep = ({
  data,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps) => {
  const nodeId = useNodeId()
  const ctx = useContext(DesignerContext)
  const isConnectable = useStore(useCallback(selector(nodeId, ctx.maxConnnectionsPerStep), [nodeId]))

  return (
    <>
      <Handle type="target" position={targetPosition} isConnectable={isConnectable} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ marginRight: "5px", display: "flex", alignItems: "center" }}>
          <InavlidIcon />
        </div>
        {data?.id}
      </div>
      <Handle type="source" position={sourcePosition} isConnectable={isConnectable} />
    </>
  )
}

const selector =
  (nodeId: string | null, maxConnections = Infinity) =>
  (s: ReactFlowState) => {
    const node = s.nodeInternals.get(nodeId!)
    const connectedEdges = getConnectedEdges([node!], s.edges)

    return connectedEdges.length <= maxConnections
  }

const InavlidIcon = () => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="Group 2971">
      <circle id="Ellipse 86" cx="12" cy="12.5" r="11.9104" fill="#FF2D55" />
      <g id="x">
        <g id="Vector">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.9109 9.2488C16.2429 9.5803 16.2427 10.1175 15.9104 10.4487L9.9516 16.3879C9.61931 16.7191 9.08081 16.7189 8.74882 16.3874C8.41684 16.0558 8.41709 15.5186 8.74938 15.1874L14.7082 9.24824C15.0405 8.91704 15.579 8.91729 15.9109 9.2488Z"
            fill="#FCFCFC"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.9109 16.3876C15.579 16.7191 15.0405 16.7193 14.7082 16.3881L8.74939 10.449C8.41709 10.1178 8.41684 9.58052 8.74882 9.24901C9.08081 8.9175 9.61931 8.91725 9.9516 9.24845L15.9104 15.1876C16.2427 15.5188 16.2429 16.0561 15.9109 16.3876Z"
            fill="#FCFCFC"
          />
        </g>
      </g>
    </g>
  </svg>
)
