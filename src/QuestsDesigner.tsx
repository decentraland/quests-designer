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
import { initialNodes, createNewNode, getCurrentStepNumber, getLastNodeId, subStepNumber, isValidQuest, generateQuestDefinition, DesignerContext} from './utils'
import './index.css'

/**
 * Props that can be given to {@link QuestsDesigner} component
 */
/** @public */
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
  maxConnnectionsPerStep?: number
}

let currentNodeIdTriggeringAnEdge: string | null = null;
/**
 * Component to design a Quest
 */
/** @public */
export const QuestsDesigner: React.FunctionComponent<QuestsDesignerProps> = ({ maxConnnectionsPerStep = 3, maxStartingSteps = 2, maxEndSteps = 5 }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );
  const reactFlowWrapper = useRef() as RefObject<HTMLDivElement>;

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();

  const [currentCustomizableStep, setCurrentCustomizableStep] = useState<Node<StepNode>| null>(null)

  const onDrop = useCallback(
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

        let source = getCurrentStepNumber() > 1 ? getLastNodeId() : nodes[0].id
        const newNode = createNewNode(position)

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat({ id: newNode.id, source: source as any, target: newNode.id }));
      }
    },
    [reactFlowInstance]
  );
  
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
  
          let source = currentNodeIdTriggeringAnEdge ? currentNodeIdTriggeringAnEdge : getCurrentStepNumber() > 1 ? getLastNodeId() : nodes[0].id
          currentNodeIdTriggeringAnEdge = null

          let newStepNode: Node<StepNode>;
          if (event instanceof MouseEvent) {
            newStepNode = createNewNode(reactFlowInstance!.project({ x: event.clientX - left - 75, y: event.clientY - top }))
          } else if (event instanceof TouchEvent) {
            newStepNode = createNewNode(reactFlowInstance!.project({ x: event.touches[0].clientX - left - 75, y: event.touches[0].clientY - top }))
          }
  
  
          setNodes((nds) => nds.concat(newStepNode));
          setEdges((eds) => eds.concat({ id: newStepNode.id, source: source as any, target: newStepNode.id }));
        }
      }
    };

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
                currentNodeIdTriggeringAnEdge = params.nodeId
              }}
              
              onConnectEnd={onConnectEnd}
              onConnect={onConnect}
              onNodesChange={onNodesChange}
              onNodesDelete={(deletedNodes) => {
                if (deletedNodes.some((node) => node.data.stepNumber == currentCustomizableStep?.data.stepNumber)) {
                  setCurrentCustomizableStep(null)
                }
                subStepNumber(deletedNodes.length)
              }}
              onNodeClick={(_, node) => {
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
            </ReactFlow>
          </div>
          {

            currentCustomizableStep ? 
              <CustomizeStep close={() => setCurrentCustomizableStep(null)} step={currentCustomizableStep} /> 
              : <Sidebar isValidQuest={isValidQuest(nodes, edges)} nodes={nodes} generateQuest={() => generateQuestDefinition(nodes, edges)} />
          }
        </ReactFlowProvider>
      </div>
    </DesignerContext.Provider>
  );
};

