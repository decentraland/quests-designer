import {
  createActionItems,
  createNewNode,
  generateNodesAndEdgesFromQuestDefinition,
  generateQuestDefinition,
  isValidQuest,
} from "../src/utils"

describe("utils functions", () => {
  describe("createActionItems()", () => {
    it("should create as many actions as loops", () => {
      const actions = createActionItems({ type: "CUSTOM", parameters: { id: "EVENT" }, loop: 4 })
      expect(actions.length).toBe(5)
      expect(actions.every((action) => action.type == "CUSTOM" && action.parameters.id == "EVENT")).toBe(true)
    })

    it("should be one action when loop is 0", () => {
      const actions = createActionItems({ type: "CUSTOM", parameters: { id: "EVENT" }, loop: 0 })
      expect(actions.length).toBe(1)
    })
  })

  describe("generateNodesAndEdgesFromQuestDefinition()", () => {
    it("shoulc create nodes properly", () => {
      const { nodes } = generateNodesAndEdgesFromQuestDefinition({
        steps: [
          {
            id: "step-1",
            description: "desc",
            tasks: [{ id: "task-1", description: "desc", actionItems: [{ type: "CUSTOM", parameters: { id: "C" } }] }],
          },
          {
            id: "step-2",
            description: "desc",
            tasks: [
              {
                id: "task-2",
                description: "desc",
                actionItems: [
                  { type: "CUSTOM", parameters: { id: "C" } },
                  { type: "CUSTOM", parameters: { id: "C" } },
                  { type: "CUSTOM", parameters: { id: "D" } },
                ],
              },
            ],
          },
        ],
        connections: [{ stepFrom: "step-1", stepTo: "step-2" }],
      })

      const step1Node = nodes.find((node) => node.id == "step-1")
      expect(step1Node).not.toBeUndefined()
      expect(step1Node?.data.tasks[0].actionItems.length).toBe(1)
      expect(step1Node?.data.tasks[0].actionItems[0].loop).toBe(null)
      expect(step1Node?.data.tasks[0].actionItems[0].type).toBe("CUSTOM")
      expect(step1Node?.data.tasks[0].actionItems[0].parameters).toEqual({ id: "C" })

      const step2Node = nodes.find((node) => node.id == "step-2")
      expect(step2Node).not.toBeUndefined()
      expect(step2Node?.data.tasks[0].actionItems.length).toBe(2)
      expect(step2Node?.data.tasks[0].actionItems[0].loop).toBe(1)
      expect(step2Node?.data.tasks[0].actionItems[0].type).toBe("CUSTOM")
      expect(step2Node?.data.tasks[0].actionItems[0].parameters).toEqual({ id: "C" })
      expect(step2Node?.data.tasks[0].actionItems[1].loop).toBe(null)
      expect(step2Node?.data.tasks[0].actionItems[1].type).toBe("CUSTOM")
      expect(step2Node?.data.tasks[0].actionItems[1].parameters).toEqual({ id: "D" })
    })
  })

  describe("generateQuest()", () => {
    it("should generate a deployable quest", () => {
      const quest = generateQuestDefinition(
        [
          createNewNode(
            "step-1",
            { x: 100, y: 200 },
            [
              {
                id: "task-1",
                description: "desc",
                actionItems: [{ type: "CUSTOM", parameters: { id: "EVENT_1" }, loop: 1 }],
              },
            ],
            "step desc",
            true,
          ),
          createNewNode(
            "step-2",
            { x: 100, y: 200 },
            [
              {
                id: "task-2",
                description: "desc",
                actionItems: [{ type: "CUSTOM", parameters: { id: "EVENT_2" }, loop: 2 }],
              },
            ],
            "step desc",
            true,
          ),
          createNewNode(
            "step-3",
            { x: 100, y: 200 },
            [
              {
                id: "task-3",
                description: "desc",
                actionItems: [{ type: "CUSTOM", parameters: { id: "EVENT_3" }, loop: null }],
              },
            ],
            "step desc",
            true,
          ),
        ],
        [
          {
            id: "step-1",
            source: "_START_",
            target: "step-1",
          },
          {
            source: "step-1",
            target: "step-2",
            id: "reactflow__edge-step-1-step-2",
          },
          {
            source: "step-2",
            target: "step-3",
            id: "reactflow__edge-step-2-step-3",
          },
          {
            source: "step-3",
            target: "_END_",
            id: "reactflow__edge-step-3-_END_",
          },
        ],
      )
      expect(quest.steps.length).toBe(3)
      expect(quest.steps[0].id).toBe("step-1")
      expect(quest.steps[0].tasks.length).toBe(1)
      expect(quest.steps[1].id).toBe("step-2")
      expect(quest.steps[1].tasks.length).toBe(1)
      expect(quest.steps[2].id).toBe("step-3")
      expect(quest.steps[2].tasks.length).toBe(1)
      expect(quest.steps[0].tasks[0].actionItems.length).toBe(2)
      expect(quest.steps[1].tasks[0].actionItems.length).toBe(3)
      expect(quest.steps[2].tasks[0].actionItems.length).toBe(1)
      expect(quest.connections.length).toBe(2)
      expect(quest.connections[0].stepFrom).toBe("step-1")
      expect(quest.connections[0].stepTo).toBe("step-2")
      expect(quest.connections[1].stepFrom).toBe("step-2")
      expect(quest.connections[1].stepTo).toBe("step-3")
    })
  })

  describe("isValidQuest()", () => {
    it("should be a valid quest", () => {
      expect(
        isValidQuest(
          [
            createNewNode(
              "step-1",
              { x: 100, y: 200 },
              [
                {
                  id: "task-1",
                  description: "desc",
                  actionItems: [{ type: "CUSTOM", parameters: { id: "EVENT_1" }, loop: 1 }],
                },
              ],
              "step desc",
              true,
            ),
            createNewNode(
              "step-2",
              { x: 100, y: 200 },
              [
                {
                  id: "task-2",
                  description: "desc",
                  actionItems: [{ type: "CUSTOM", parameters: { id: "EVENT_2" }, loop: 1 }],
                },
              ],
              "step desc",
              true,
            ),
            createNewNode(
              "step-3",
              { x: 100, y: 200 },
              [
                {
                  id: "task-3",
                  description: "desc",
                  actionItems: [{ type: "CUSTOM", parameters: { id: "EVENT_3" }, loop: 1 }],
                },
              ],
              "step desc",
              true,
            ),
            createNewNode(
              "step-4",
              { x: 100, y: 200 },
              [
                {
                  id: "task-4",
                  description: "desc",
                  actionItems: [{ type: "CUSTOM", parameters: { id: "EVENT_4" }, loop: 1 }],
                },
              ],
              "step desc",
              true,
            ),
          ],
          [
            {
              id: "step-1",
              source: "_START_",
              target: "step-1",
            },
            {
              source: "step-1",
              target: "step-2",
              id: "reactflow__edge-step-1-step-2",
            },
            {
              source: "step-2",
              target: "step-3",
              id: "reactflow__edge-step-2-step-3",
            },
            {
              source: "step-3",
              target: "step-4",
              id: "mmmm",
            },
            {
              source: "step-4",
              target: "_END_",
              id: "reactflow__edge-step-4-_END_",
            },
          ],
        ),
      ).toBe(true)
    })
  })
})
