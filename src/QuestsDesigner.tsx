import React, { RefObject, useCallback, useRef, useState } from "react"

import { QuestDefinition } from "@dcl/quests-client/dist/protocol/decentraland/quests/definitions.gen"
import {
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow"

import { BackButton } from "./components/BackButton"
import { CloseButton } from "./components/CloseButton"
import { CustomizeStep } from "./CustomizeStep"
import Sidebar from "./Sidebar"
import { StepNode, nodeTypes } from "./types"
import {
  DesignerContext,
  createNewNode,
  initialNodes as defaultInitialNodes,
  generateQuestDefinition,
  isValidNode,
  isValidQuest,
} from "./utils"

import "./index.css"

/**
 * @public
 */
export type QuestsDesignerProps = {
  /**
   *  Max steps that can be connected to the Start node
   */
  maxStartingSteps?: number
  /**
   * Max steps that can be connected to the End node
   */
  maxEndSteps?: number
  /**
   * Max steps that can be connected to a one step
   */
  maxConnnectionsPerStep?: number
  /**
   * Modify the button to save the Quest design
   */
  saveDesignButton?: {
    content?: string
    onClick: (questDefinition: QuestDefinition, nodes: Node<StepNode>[], edges: Edge[]) => void
  }
  /**
   * Optional function to show a close button that execute the given function
   */
  closeDesigner?: () => void
  /**
   * Optional function to show back button that executes the given function
   */
  backButton?: () => void
  /**
   * Initial nodes to display on the panel
   */
  initialNodes?: Node<StepNode>[]
  /**
   * Initial edges for the initial nodes
   */
  initialEdges?: Edge[]
}

/** @public */
export const QuestsDesigner = ({
  maxConnnectionsPerStep = 3,
  maxStartingSteps = 2,
  maxEndSteps = 5,
  saveDesignButton,
  closeDesigner,
  backButton,
  initialEdges,
  initialNodes,
}: QuestsDesignerProps): JSX.Element => {
  const [nodes, setNodes, onNodesChange] = useNodesState<StepNode>(initialNodes || defaultInitialNodes)

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges || [])

  const reactFlowWrapper = useRef() as RefObject<HTMLDivElement>

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>()

  const [currentCustomizableStep, setCurrentCustomizableStep] = useState<Node<StepNode> | null>(null)

  const [globalId, setGlobalId] = useState(1)
  const [lastNodeId, setLastNodeId] = useState<string | null>(null)
  const [currentNodeIdTriggeringAnEdge, setCurrentNodeIdTriggeringAnEdge] = useState<string | null>(null)

  const getId = () => {
    const next = `Step-${globalId}`
    setGlobalId(globalId + 1)
    setLastNodeId(next)
    return next
  }

  const onConnect = useCallback((params: Edge | Connection) => setEdges((els) => addEdge(params, els)), [setEdges])

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault()
    if (reactFlowWrapper && reactFlowWrapper.current) {
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData("application/reactflow")

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return
      }

      const position = reactFlowInstance!.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const source = nodes.length > 2 ? lastNodeId : nodes[0].id
      const newNode = createNewNode(getId(), position, undefined, undefined, false)

      setNodes((nds) => nds.concat(newNode))
      setEdges((eds) => eds.concat({ id: newNode.id, source: source as any, target: newNode.id }))
    }
  }

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onConnectEnd = (event: MouseEvent | TouchEvent) => {
    if (event.target instanceof HTMLElement) {
      const targetIsPane = event.target.classList.contains("react-flow__pane")

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const { top, left } = reactFlowWrapper.current!.getBoundingClientRect()

        const source = currentNodeIdTriggeringAnEdge
          ? currentNodeIdTriggeringAnEdge
          : nodes.length > 2
          ? lastNodeId
          : nodes[0].id
        setCurrentNodeIdTriggeringAnEdge(null)

        let newStepNode: Node<StepNode>
        if (event instanceof MouseEvent) {
          newStepNode = createNewNode(
            getId(),
            reactFlowInstance!.project({ x: event.clientX - left - 75, y: event.clientY - top }),
            undefined,
            undefined,
            false,
          )
        } else if (event instanceof TouchEvent) {
          newStepNode = createNewNode(
            getId(),
            reactFlowInstance!.project({
              x: event.touches[0].clientX - left - 75,
              y: event.touches[0].clientY - top,
            }),
            undefined,
            undefined,
            false,
          )
        }

        setNodes((nds) => nds.concat(newStepNode))
        setEdges((eds) =>
          eds.concat({
            id: newStepNode.id,
            source: source as any,
            target: newStepNode.id,
          }),
        )
      }
    }
  }

  const triggerGenerateQuest = () => {
    saveDesignButton?.onClick(generateQuestDefinition(nodes, edges), nodes, edges)
  }

  return (
    <DesignerContext.Provider value={{ maxConnnectionsPerStep, maxEndSteps, maxStartingSteps }}>
      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              onInit={setReactFlowInstance}
              nodes={nodes}
              edges={edges}
              onConnectStart={(_, params) => {
                setCurrentNodeIdTriggeringAnEdge(params.nodeId)
              }}
              onConnectEnd={onConnectEnd}
              onConnect={onConnect}
              onNodesChange={onNodesChange}
              onNodesDelete={(deletedNodes) => {
                if (deletedNodes.some((node) => node.data.id == currentCustomizableStep?.data.id)) {
                  setCurrentCustomizableStep(null)
                }
              }}
              onNodeClick={(_, node) => {
                if (node.id === "_START_" || node.id === "_END_") return
                if (currentCustomizableStep && currentCustomizableStep.id == node.id) {
                  setCurrentCustomizableStep(null)
                } else {
                  setCurrentCustomizableStep(node as any)
                }
              }}
              nodeTypes={nodeTypes}
              onEdgesChange={onEdgesChange}
              onDragOver={onDragOver}
              onDrop={onDrop}
              fitView
            >
              <Background />
              <Controls />
              {closeDesigner && <CloseButton onClick={closeDesigner} />}
              {backButton && <BackButton onClick={backButton} />}
            </ReactFlow>
          </div>
          {currentCustomizableStep ? (
            <CustomizeStep
              step={currentCustomizableStep.data}
              onSaveStep={() => {
                setNodes((nds) =>
                  nds.map((n) =>
                    n.id == currentCustomizableStep.id
                      ? {
                          ...n,
                          data: { ...currentCustomizableStep.data },
                          type: isValidNode(currentCustomizableStep, nodes) ? "questStep" : "questStepInvalid",
                        }
                      : n,
                  ),
                )
              }}
              onChangeStep={(step) => {
                setCurrentCustomizableStep({ ...currentCustomizableStep, data: { ...step } })
              }}
              close={() => setCurrentCustomizableStep(null)}
            />
          ) : (
            <Sidebar
              isValidQuest={isValidQuest(nodes, edges)}
              generateButton={
                saveDesignButton
                  ? { content: saveDesignButton.content || "Generate Quest Definition", onClick: triggerGenerateQuest }
                  : undefined
              }
            />
          )}
        </ReactFlowProvider>
      </div>
    </DesignerContext.Provider>
  )
}
