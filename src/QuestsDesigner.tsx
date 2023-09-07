import React, { RefObject, useCallback, useRef, useState } from "react";
import ReactFlow, {
  Node,
  addEdge,
  Background,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Controls,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";

import Sidebar from "./Sidebar";
import { CustomizeStep} from "./CustomizeStep";
import { StepNode, nodeTypes } from './types'
import { initialNodes as defaultInitialNodes, createNewNode, isValidQuest, generateQuestDefinition, DesignerContext, isValidNode} from './utils'
import { QuestDefinition } from "./protocol/quests";

import 'semantic-ui-css/semantic.min.css'
import 'balloon-css/balloon.min.css'
import 'decentraland-ui/dist/themes/base-theme.css'
import 'decentraland-ui/dist/themes/alternative/light-theme.css'

import './index.css'
import { Back, Button } from "decentraland-ui";

/** 
 * @public 
*/
export type QuestsDesignerProps = {
  /**
   *  Max steps that can be connected to the Start node
   */
  maxStartingSteps?: number, 
  /**
  * Max steps that can be connected to the End node
  */
  maxEndSteps?: number, 
  /**
  * Max steps that can be connected to a one step
  */
  maxConnnectionsPerStep?: number,
  /**
   * Modify the button to save the Quest design
   */
  saveDesignButton: {
    content?: string
    onClick: (questDefinition: QuestDefinition, nodes: Node<StepNode>[], edges: Edge[]) => void
  }
  /**
   * Optional function to close the designer from the right panel
   */
  closeDesigner?: () => void,
  /**
   * Initial nodes to display on the panel
   */
  initialNodes?: Node<StepNode>[],
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
  initialEdges, 
  initialNodes }: QuestsDesignerProps
): JSX.Element => {
  const [nodes, setNodes, onNodesChange] = useNodesState<StepNode>(initialNodes || defaultInitialNodes);

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges || []);

  const reactFlowWrapper = useRef() as RefObject<HTMLDivElement>;

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();

  const [currentCustomizableStep, setCurrentCustomizableStep] = useState<Node<StepNode>| null>(null)

  const [globalId, setGlobalId] = useState(1)
  const [lastNodeId, setLastNodeId] = useState<string | null>(null)
  const [currentNodeIdTriggeringAnEdge, setCurrentNodeIdTriggeringAnEdge] = useState<string | null>(null)

  const getId = () => {
    const next = `Step-${globalId}`
    setGlobalId(globalId + 1)
    setLastNodeId(next)
    return next
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  const onDrop = 
    (event: React.DragEvent) => {
      event.preventDefault();
      if (reactFlowWrapper && reactFlowWrapper.current) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');
  
        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
          return;
        }
  
        const position = reactFlowInstance!.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        let source = nodes.length > 2 ? lastNodeId : nodes[0].id
        const newNode = createNewNode(getId(), position, undefined, undefined, false)

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat({ id: newNode.id, source: source as any, target: newNode.id }));
      }
    }
  
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);


  const onConnectEnd = 
    (event: MouseEvent | TouchEvent) => {
      if (event.target instanceof HTMLElement) {
        const targetIsPane = event.target.classList.contains('react-flow__pane');
  
        if (targetIsPane) {
          // we need to remove the wrapper bounds, in order to get the correct position
          const { top, left } = reactFlowWrapper.current!.getBoundingClientRect();
  
          let source = currentNodeIdTriggeringAnEdge ? currentNodeIdTriggeringAnEdge : nodes.length > 2 ? lastNodeId : nodes[0].id
          setCurrentNodeIdTriggeringAnEdge(null)

          let newStepNode: Node<StepNode>;
          if (event instanceof MouseEvent) {
            newStepNode = createNewNode(
              getId(), 
              reactFlowInstance!.project({ x: event.clientX - left - 75, y: event.clientY - top }), 
              undefined, 
              undefined, 
              false
            )
          } else if (event instanceof TouchEvent) {
            newStepNode = createNewNode(
              getId(), 
              reactFlowInstance!.project({ 
                x: event.touches[0].clientX - left - 75, 
                y: event.touches[0].clientY - top
              }),               
              undefined, 
              undefined, 
              false
            )
          }
  
          setNodes((nds) => nds.concat(newStepNode));
          setEdges((eds) => eds.concat({ 
            id: newStepNode.id, 
            source: source as any, 
            target: newStepNode.id 
          }));
        }
      }
    };

  const triggerGenerateQuest = () => {
    saveDesignButton.onClick(generateQuestDefinition(nodes, edges), nodes, edges)
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
              {
                closeDesigner &&
                <Button 
                  content={
                    <Back />
                  }
                  onClick={() => closeDesigner()}
                  className="back-btn"
                />
              }
            </ReactFlow>
          </div>
          {

            currentCustomizableStep ? 
              <CustomizeStep
                step={currentCustomizableStep.data}
                onSaveStep={() => { 
                  console.log("Changin node: ", isValidNode(currentCustomizableStep))
                  setNodes((nds) => 
                  nds.map((n) => n.id == currentCustomizableStep.id ? 
                    { 
                      ...n, 
                      data: { ...currentCustomizableStep.data }, 
                      type: isValidNode(currentCustomizableStep) ? "questStep" : "questStepInvalid" 
                    } 
                  : n
                ))
                }}
                onChangeStep={(step) => { 
                  setCurrentCustomizableStep({ ...currentCustomizableStep, data: { ...step } })
                }}
                close={() => setCurrentCustomizableStep(null)} 
              /> 
              : 
              <Sidebar 
                isValidQuest={isValidQuest(nodes, edges)} 
                saveButtonContent={saveDesignButton.content || "Generate Quest Definition"}
                generateQuest={() => triggerGenerateQuest()} 
              />
          }
        </ReactFlowProvider>
      </div>
    </DesignerContext.Provider>
  );
};

