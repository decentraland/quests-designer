import { createContext } from 'react';
import { Edge, Node, XYPosition } from 'reactflow'
import { ActionType, StepNode, StepTask } from "./types";
import { Action, QuestDefinition, Task } from "./protocol/quests";

export const DesignerContext = createContext({ maxConnnectionsPerStep: 3, maxStartingSteps: 2, maxEndSteps: 5})

export const initialNodes: Node[] = [
  {
      id: "_START_",
      type: "start",
      data: { label: "Start" },
      position: { x: 250, y: 5 }
  },
  {
      id: "_END_",
      type: "end",
      data: { label: "End" },
      position: { x: 250, y: 150 }
  },
]

export const createActionItems = (task: StepTask<ActionType>) => {
  const actions: Action[] = []
  let loop = task.loop === 1 ? 2 : task.loop > 0 ? task.loop+1 : 1;
  for (let i = loop; i > 0; i--) {
    actions.push({
      type: task.type,
      parameters: task.parameters as any
    })
  }
  return actions
}

let stepNumber = 1;
const getStepNumber = () => {
  let number = stepNumber;
  stepNumber += 1;
  return {step: number, label: `Step ${number}`};
}
export const getCurrentStepNumber = () => stepNumber
export const subStepNumber = (steps: number) => stepNumber -= steps

export const createNewNode = (position: XYPosition, tasks: StepTask<ActionType>[] = []): Node<StepNode> => {
  let {label, step} = getStepNumber()
  return {
    id: getId(),
    type: 'simpleStep',
    position,
    data: { label, stepNumber: step, tasks, description: "" },
  };
}

let globalId = 1;
let lastNodeId: string | null = null;
export const getId = () => {
  lastNodeId = `dndnode_${globalId++}`
  return lastNodeId
};
export const getLastNodeId = () => lastNodeId;
export const getCurrentGlobalId = () => globalId;

export const resetState = () => {
  stepNumber = 1;
  globalId = 1;
  lastNodeId = null;
}

export const generateQuest = (nodes: Node<StepNode>[], edges: Edge<any>[]): QuestDefinition | never => {
  const questDefinition: QuestDefinition = {
    steps: [],
    connections: []
  };

  const filteredNodes = nodes.filter((node) => node.type != "start" && node.type != "end")

  if (!filteredNodes.length) {
    throw new Error("Missing steps")
  }

  for (const node of filteredNodes) {
    questDefinition.steps.push({
      id: node.id,
      description: node.data.description,
      tasks: node.data.tasks.reduce<Task[]>((acc, curr, currIndex) => {
        acc.push({
          id: `${node.id}_${currIndex}`,
          description: "",
          actionItems: createActionItems(curr)
        })
        return acc
      }, [])
    })   
  }

  if (questDefinition.steps.some((step) => step.tasks.length == 0)) {
    throw new Error("Invalid Tasks")
  }

  const filteredEdges = edges.filter((edge) => edge.source != "_START_" && edge.target != "_END_")

  if (!filteredEdges.length) {
    throw new Error("Missing connections between steps")
  }

  for (const { id, source, target } of filteredEdges) {
    questDefinition.connections.push({
      stepFrom: source,
      stepTo: id
    })
    questDefinition.connections.push({
      stepFrom: id,
      stepTo: target
    })
  }


  return questDefinition
}

export const isValidQuest = (nodes: Node<StepNode>[], edges: Edge[]) => {
  let isValid = true;

  const filteredNodes = nodes.filter((node) => node.type != "_START_" && node.type != "_END_")
  const filteredEdges = edges.filter((edge) => edge.source != "_START_" && edge.target != "_END_")

  if (!filteredNodes.length || !filteredEdges.length) return false

  for (const node of filteredNodes) {
    if (!(edges.some((edge) => edge.id == node.id) && edges.some((edge) => edge.id == node.id) && node.data.tasks.length > 0)) {
      console.log(node)
      isValid = false
      console.log(edges)
      break;
    }
  }

  return isValid
}
  