import { Node as RFlowNode, Edge as RFlowEdge} from 'reactflow'

import { End, QuestStep, Start } from "./CustomNode";

export type StepNode = {
    id: string, 
    tasks: StepTask<ActionType>[], 
    description: string 
}

export type Node = RFlowNode<StepNode>
export type Edge = RFlowEdge

export type ActionType = "CUSTOM" | "LOCATION" | "EMOTE" | "JUMP" | "NPC_INTERACTION";

export type Params<T> = T extends "CUSTOM" ? { id: string } : 
  T extends "LOCATION" ? { x: number, y: number } : 
  T extends "EMOTE" ? { emote_id: string, x: number, y: number } : 
  T extends "JUMP" ? { x: number, y: number } : 
  T extends "NPC_INTERACTION" ? { npc_id: string, x: number, y: number } : 
  never;

export type StepTask<T> = {
  type: T,
  parameters: Params<T> | undefined
  loop: number
}

export const nodeTypes = {
  start: Start,
  end: End,
  questStep: QuestStep
};