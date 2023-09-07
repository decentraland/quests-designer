import { createContext } from 'react';
import { Edge, Node, XYPosition } from 'reactflow'
import { ActionType, Params, StepNode, StepTask, StepTaskAction } from "./types";
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

export const createActionItems = (action: StepTaskAction) => {
  const actions: Action[] = []
  let loop = action.loop == 0 ? 1 : action.loop + 1
  for (let i = loop; i > 0; i--) {
    actions.push({
      type: action.type,
      parameters: action.parameters as any
    })
  }
  return actions
}

export const createNewNode = (stepid: string, position: XYPosition, tasks: StepTask[] = [], description?: string, valid = true): Node<StepNode> => {
  return {
    id: stepid,
    type: valid ? 'questStep' : 'questStepInvalid',
    position,
    data: { id: stepid, tasks, description: description || "" },
  };
}

export const generateQuestDefinition = (nodes: Node<StepNode>[], edges: Edge<any>[]): QuestDefinition | never => {
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
      id: node.data.id,
      description: node.data.description,
      tasks: node.data.tasks.reduce<Task[]>((acc, curr) => {
        acc.push({
          id: curr.id,
          description: curr.description,
          actionItems: curr.actionItems.reduce<Action[]>((acc, curr) => {
            const toacc = createActionItems(curr)
            
            return [...acc, ...toacc]
          }, [])
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

  for (const { source, target } of filteredEdges) {
    questDefinition.connections.push({
      stepFrom: source,
      stepTo: target
    })
  }


  return questDefinition
}

export const generateNodesAndEdgesFromQuestDefinition = (questDefinition: QuestDefinition, nodePositions?: Record<string, { x: number, y: number }>): { nodes: Node<StepNode>[], edges: Edge<any>[] } | never => {
  const { steps, connections } = questDefinition;
  const nodes: Node<StepNode>[] = [...initialNodes];
  const edges: Edge<any>[] = [];

  if (steps.length === 0) {
    throw new Error("QuestDefinition does not have any steps.");
  }

  // Create nodes from steps
  for (const step of steps) {
    const { id, description, tasks } = step;
    const tasksToStepTask = tasks.reduce<StepTask[]>((acc, curr) => {
      const stepTask: StepTask = {
        id: curr.id,
        description: curr.description,
        actionItems: [...createStepTasks(curr.actionItems)]
      }

      acc.push(stepTask)
      return acc
    }, [])
    const stepNode = createNewNode(id, {x: 0, y:0}, tasksToStepTask, description)
    nodes.push(stepNode);
  }

  if (connections.length === 0) {
    throw new Error("QuestDefinition does not have any connections between steps.");
  }

  const iWithoutTo = 0

  // Create edges from connections
  for (const connection of connections) {
    const { stepFrom, stepTo } = connection;
    if (!stepFrom || !stepTo) {
      throw new Error("Invalid connection data.");
    }

    let id = stepTo;
    if (edges.find((e) => e.id == id)) {
      id = `reactflow__edge-${stepFrom}-${stepTo}`;
    }

    if (connections.every((connection) => connection.stepTo != stepFrom)) {
      const edge: Edge<any> = {
        id: stepFrom,
        source: "_START_",
        target: stepFrom,
      };
      edges.push(edge);
    }

    if (connections.every((connection) => connection.stepFrom != stepTo)) {
      const edge: Edge<any> = {
        id: iWithoutTo > 0 ? "_END_" : `reactflow__edge-${stepTo}-_END_`,
        source: stepTo,
        target: "_END_",
      };
      edges.push(edge);
    }

    const edge: Edge<any> = {
      id,
      source: stepFrom,
      target: stepTo,
    };
    edges.push(edge);
  }

  if (nodePositions) {
    for (const node of nodes) {
      node.position = nodePositions[node.id]
    }
  } else {
    // set end to 550
    nodes[1].position.y = 400
    // reorder edges, sources that contains _START_ at first indexes, and _END_ targets at last indexes
    edges.sort((a, b) => {
      if (a.source == "_START_") {
        return -1
      }
      if (b.source == "_START_") {
        return 1
      }
      if (a.target == "_END_") {
        return 1
      }
      if (b.target == "_END_") {
        return -1
      }
      return 0
    })
    const sources: Record<string, { lastXPosition: number, nodes: number }> = {}
    for (const edge of edges) {
      const nodeSource = nodes.find((node) => node.id == edge.source)
      const nodeTarget = nodes.find((node) => node.id == edge.target)
      if (nodeTarget?.type == "end") {
        continue
      }
      if (nodeSource && nodeTarget) {
        if (!sources[edge.source]) {
          sources[edge.source] = { lastXPosition: 0, nodes: 0 }
        }
        nodeTarget.position.y = nodeSource.position.y + 100
        if (nodeSource.type == "start") {
          nodeTarget.position.x = nodeSource.position.x + (sources[edge.source].nodes || 1) * (sources[edge.source].lastXPosition > nodeSource.position.x ? -40 : 40)
          sources[edge.source].nodes += 1
          sources[nodeTarget.id] = { lastXPosition: nodeTarget.position.x, nodes: 0 }
        } else {
          nodeTarget.position.x = sources[edge.source].lastXPosition
        }
        sources[edge.source] = { lastXPosition: nodeTarget.position.x, nodes: sources[edge.source].nodes+1 }
      }
    }
  }

  return { nodes, edges };
};

export const createStepTasks = (actions: Action[]): StepTaskAction[] => {
  const stepTasks: StepTaskAction[] = [];
  let currentTask: StepTaskAction | null = null;

  for (const action of actions) {
    if (currentTask === null || currentTask.type !== action.type) {
      if (currentTask !== null) {
        stepTasks.push(currentTask);
      }
      currentTask = {
        type: action.type as ActionType,
        parameters: null,
        loop: 0,
      };
    }

    if (currentTask.type == action.type) {
      currentTask.loop++;
    }

    if (currentTask.parameters === undefined) {
      currentTask.parameters = action.parameters as Params<ActionType>;
    } else if (currentTask.parameters && typeof action.parameters === "object") {
      currentTask.parameters = { ...currentTask.parameters, ...action.parameters };
    }
  }

  if (currentTask !== null) {
    stepTasks.push(currentTask);
  }

  return stepTasks;
};


export const isValidQuest = (nodes: Node<StepNode>[], edges: Edge[]) => {
  let isValid = true;

  const filteredNodes = nodes.filter((node) => node.id != "_START_" && node.id != "_END_")
  const filteredEdges = edges.filter((edge) => edge.source != "_START_" || edge.target != "_END_")

  if (!filteredNodes.length || !filteredEdges.length) return false

  for (const node of filteredNodes) {
    if (!(
      edges.find((edge) => edge.source == node.id) && 
      edges.find((edge) => edge.target == node.id) && 
      node.data.tasks.length > 0 &&
      node.data.tasks.every((task) => task.actionItems.length > 0)
    )) {
      isValid = false
      break;
    }
  }

  return isValid
}

export const isValidNode = (node: Node<StepNode>) => {
  if (!(
    node.data.tasks.length > 0 &&
    node.data.tasks.every((task) => task.actionItems.length > 0)
  )) {
    return false
  }

  return true
}