import { Node as RFlowNode, Edge as RFlowEdge} from 'reactflow'

import { End, QuestStep, Start } from "./CustomNode";

export type StepNode = {
    id: string,
    tasks: StepTask[], 
    description: string 
}

export type Node = RFlowNode<StepNode>
export type Edge = RFlowEdge

export type ActionType = "CUSTOM" | "LOCATION" | "EMOTE" | "JUMP" | "NPC_INTERACTION";

export type Params<T> = T extends "CUSTOM" ? { id: string } : 
  T extends "LOCATION" ? { x: number, y: number } : 
  T extends "EMOTE" ? { id: string, x: number, y: number } : 
  T extends "JUMP" ? { x: number, y: number } : 
  never;

export type StepTaskAction = {
  type: ActionType,
  parameters: Params<ActionType> | null
  loop: number
}

export type StepTask = {
  id: string;
  description: string;
  actionItems: StepTaskAction[]
}

export const nodeTypes = {
  start: Start,
  end: End,
  questStep: QuestStep,
  questStepInvalid: QuestStep
};