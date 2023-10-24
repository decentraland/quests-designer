import { createContext } from "react"

import {
  Action,
  Connection,
  QuestDefinition,
  Step,
  Task,
} from "@dcl/quests-client/dist/protocol/decentraland/quests/definitions.gen"
import { validateStepsAndConnections, validateTask } from "@dcl/quests-client/dist/utils"
import deepEqual from "deep-equal"
import { Edge, Node, XYPosition } from "reactflow"

import { ActionType, Params, StepNode, StepTask, StepTaskAction } from "./types"

export const DesignerContext = createContext({ maxConnnectionsPerStep: 3, maxStartingSteps: 2, maxEndSteps: 5 })

export const initialNodes: Node[] = [
  {
    id: "_START_",
    type: "start",
    data: { label: "Start" },
    position: { x: 250, y: 5 },
  },
  {
    id: "_END_",
    type: "end",
    data: { label: "End" },
    position: { x: 250, y: 150 },
  },
]

export const createActionItems = (action: StepTaskAction) => {
  const actions: Action[] = []
  const loop = action.loop == 0 || action.loop == null ? 1 : action.loop + 1
  for (let i = loop; i > 0; i--) {
    actions.push({
      type: action.type,
      parameters: action.parameters as any,
    })
  }
  return actions
}

export const createNewNode = (
  stepid: string,
  position: XYPosition,
  tasks: StepTask[] = [],
  description?: string,
  valid = true,
): Node<StepNode> => {
  return {
    id: stepid,
    type: valid ? "questStep" : "questStepInvalid",
    position,
    data: { id: stepid, tasks, description: description || "" },
  }
}

const generateQuestSteps = (nodes: Node<StepNode>[]): Step[] => {
  const steps = []
  for (const node of nodes) {
    steps.push({
      id: node.data.id,
      description: node.data.description,
      tasks: generateQuestTasks(node.data.tasks),
    })
  }

  return steps
}

const generateQuestTasks = (stepTasks: StepTask[]) => {
  return stepTasks.reduce<Task[]>((acc, curr) => {
    acc.push({
      id: curr.id,
      description: curr.description,
      actionItems: curr.actionItems.reduce<Action[]>((acc, curr) => {
        const toacc = createActionItems(curr)
        return [...acc, ...toacc]
      }, []),
    })
    return acc
  }, [])
}

const generateQuestConnections = (nodes: Node<StepNode>[], edges: Edge<any>[]): Connection[] => {
  const connections = []
  for (const { source, target } of edges) {
    const nodeSource = nodes.find((node) => node.id === source)
    const nodeTarget = nodes.find((node) => node.id === target)

    if (!nodeSource || !nodeTarget) {
      break
    }

    connections.push({
      stepFrom: nodeSource.data.id || nodeSource.id!,
      stepTo: nodeTarget.data.id! || nodeSource.id!,
    })
  }
  return connections
}

export const generateQuestDefinition = (nodes: Node<StepNode>[], edges: Edge<any>[]): QuestDefinition | never => {
  const questDefinition: QuestDefinition = {
    steps: [],
    connections: [],
  }

  const filteredNodes = filterNodes(nodes)

  if (!filteredNodes.length) {
    throw new Error("Missing steps")
  }

  questDefinition.steps = generateQuestSteps(filteredNodes)

  // every node has edges
  for (const node of filteredNodes) {
    if (!edges.find((edge) => edge.source == node.id)) {
      throw new Error("Missing Edge")
    }

    if (!edges.find((edge) => edge.target == node.id)) {
      throw new Error("Missing Edge")
    }
  }

  const filteredEdges = edges.filter((edge) => edge.source != "_START_" && edge.target != "_END_")

  questDefinition.connections = generateQuestConnections(filteredNodes, filteredEdges)

  validateStepsAndConnections({ definition: questDefinition })

  return questDefinition
}

export const generateNodesAndEdgesFromQuestDefinition = (
  questDefinition: QuestDefinition,
  nodePositions?: Record<string, { x: number; y: number }>,
): { nodes: Node<StepNode>[]; edges: Edge<any>[] } | never => {
  const { steps, connections } = questDefinition
  const nodes: Node<StepNode>[] = [...initialNodes]
  const edges: Edge<any>[] = []

  if (steps.length === 0) {
    throw new Error("QuestDefinition does not have any steps.")
  }

  // Create nodes from steps
  for (const step of steps) {
    const { id, description, tasks } = step
    const tasksToStepTask = tasks.reduce<StepTask[]>((acc, curr) => {
      const stepTask: StepTask = {
        id: curr.id,
        description: curr.description,
        actionItems: [...createStepTasks(curr.actionItems)],
      }

      acc.push(stepTask)
      return acc
    }, [])
    const stepNode = createNewNode(id, { x: 0, y: 0 }, tasksToStepTask, description)
    nodes.push(stepNode)
  }

  if (connections.length === 0) {
    throw new Error("QuestDefinition does not have any connections between steps.")
  }

  const iWithoutTo = 0

  // Create edges from connections
  for (const connection of connections) {
    const { stepFrom, stepTo } = connection
    if (!stepFrom || !stepTo) {
      throw new Error("Invalid connection data.")
    }

    let id = stepTo
    if (edges.find((e) => e.id == id)) {
      id = `reactflow__edge-${stepFrom}-${stepTo}`
    }

    if (connections.every((connection) => connection.stepTo != stepFrom)) {
      const edge: Edge<any> = {
        id: stepFrom,
        source: "_START_",
        target: stepFrom,
      }
      edges.push(edge)
    }

    if (connections.every((connection) => connection.stepFrom != stepTo)) {
      const edge: Edge<any> = {
        id: iWithoutTo > 0 ? "_END_" : `reactflow__edge-${stepTo}-_END_`,
        source: stepTo,
        target: "_END_",
      }
      edges.push(edge)
    }

    const edge: Edge<any> = {
      id,
      source: stepFrom,
      target: stepTo,
    }
    edges.push(edge)
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
    const sources: Record<string, { lastXPosition: number; nodes: number }> = {}
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
          nodeTarget.position.x =
            nodeSource.position.x +
            (sources[edge.source].nodes || 1) * (sources[edge.source].lastXPosition > nodeSource.position.x ? -40 : 40)
          sources[edge.source].nodes += 1
          sources[nodeTarget.id] = { lastXPosition: nodeTarget.position.x, nodes: 0 }
        } else {
          nodeTarget.position.x = sources[edge.source].lastXPosition
        }
        sources[edge.source] = { lastXPosition: nodeTarget.position.x, nodes: sources[edge.source].nodes + 1 }
      }
    }
  }

  return { nodes, edges }
}

export const createStepTasks = (actions: Action[]): StepTaskAction[] => {
  const stepTasks: StepTaskAction[] = []
  let lastTask: StepTaskAction | null = null

  for (const action of actions) {
    if (lastTask === null) {
      lastTask = {
        type: action.type as ActionType,
        parameters: action.parameters as Params<ActionType>,
        loop: null,
      }
      continue
    }

    if (deepEqual({ type: lastTask.type, parameters: lastTask.parameters }, action)) {
      if (lastTask.loop === null) {
        lastTask.loop = 0
      }
      lastTask.loop++
    } else {
      if (lastTask !== null) {
        stepTasks.push(lastTask)
      }
      lastTask = {
        type: action.type as ActionType,
        parameters: action.parameters as Params<ActionType>,
        loop: null,
      }
    }
  }

  if (lastTask !== null) {
    stepTasks.push(lastTask)
  }

  return stepTasks
}

export const isValidQuest = (nodes: Node<StepNode>[], edges: Edge[]) => {
  try {
    generateQuestDefinition(nodes, edges)
    return true
  } catch (error) {
    console.error("> Invalid Quest > ", error)
    return false
  }
}

export const isValidNode = (node: Node<StepNode>, nodes: Node<StepNode>[]) => {
  if (!nodeIsUniqueStepID(node.data.id, nodes)) {
    return false
  }

  if (!nodeMustHaveDescription(node.data)) {
    return false
  }

  if (!node.data.tasks.length) {
    return false
  }

  for (const task of node.data.tasks) {
    if (!isValidStepTask(task, nodes)) {
      return false
    }
  }

  return true
}

export const nodeIsUniqueStepID = (id: string, nodes: Node<StepNode>[]) =>
  nodes.filter((node) => node.data.id === id).length === 1

export const stepTaskIsUniqueID = (id: string, nodes: Node<StepNode>[]) => {
  let count = 0
  const newNodes = filterNodes(nodes)
  for (const node of newNodes) {
    if (!node.data.tasks || !node.data.tasks.length) continue
    for (const task of node.data.tasks) {
      if (task.id === id) {
        count += 1
      }
    }
  }

  return count <= 1
}

export const stepTaskMustHaveDescription = (task: StepTask) => !!task.description.length

export const nodeMustHaveDescription = (node: StepNode) => !!node.description.length

export const isValidStepTask = (stepTask: StepTask, nodes: Node<StepNode>[]): boolean => {
  const task = generateQuestTasks([stepTask])[0]

  try {
    validateTask(task)
  } catch (error) {
    console.error("> Error validating task > ", error)
    return false
  }

  return stepTaskIsUniqueID(task.id, nodes)
}

export const filterNodes = (nodes: Node<StepNode>[]) =>
  nodes.filter((node) => node.type != "start" && node.type != "end")
