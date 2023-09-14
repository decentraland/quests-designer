import { createActionItems, createNewNode, generateQuest, isValidQuest, resetState } from "../src/utils"

describe("utils functions", () => {
  beforeEach(() => {
    resetState()
  })
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

  describe("generateQuest()", () => {
    it("should generate a deployable quest", () => {
      const quest = generateQuest(
        [
          createNewNode({ x: 100, y: 200 }, [{ type: "CUSTOM", parameters: { id: "EVENT" }, loop: 1 }]),
          createNewNode({ x: 300, y: 200 }, [{ type: "CUSTOM", parameters: { id: "EVENT_2" }, loop: 2 }]),
          createNewNode({ x: 400, y: 200 }, [{ type: "CUSTOM", parameters: { id: "EVENT_3" }, loop: 0 }]),
        ],
        [
          { id: "dndnode_1", source: "_START_", target: "dndnode_2" },
          { id: "dndnode_2", source: "dndnode_1", target: "dndnode_3" },
          { id: "dndnode_3", source: "dndnode_2", target: "_END_" },
        ],
      )
      expect(quest.steps.length).toBe(3)
      expect(quest.steps[0].id).toBe("dndnode_1")
      expect(quest.steps[0].tasks.length).toBe(1)
      expect(quest.steps[1].id).toBe("dndnode_2")
      expect(quest.steps[1].tasks.length).toBe(1)
      expect(quest.steps[2].id).toBe("dndnode_3")
      expect(quest.steps[2].tasks.length).toBe(1)
      expect(quest.steps[0].tasks[0].actionItems.length).toBe(2)
      expect(quest.steps[1].tasks[0].actionItems.length).toBe(3)
      expect(quest.steps[2].tasks[0].actionItems.length).toBe(1)
      expect(quest.connections.length).toBe(2)
      expect(quest.connections[0].stepFrom).toBe("dndnode_1")
      expect(quest.connections[0].stepTo).toBe("dndnode_2")
      expect(quest.connections[1].stepFrom).toBe("dndnode_2")
      expect(quest.connections[1].stepTo).toBe("dndnode_3")
    })
  })

  describe("isValidQuest()", () => {
    it("should be a valid quest", () => {
      expect(
        isValidQuest(
          [
            createNewNode({ x: 100, y: 200 }, [{ type: "CUSTOM", parameters: { id: "EVENT" }, loop: 1 }]),
            createNewNode({ x: 300, y: 200 }, [{ type: "CUSTOM", parameters: { id: "EVENT_2" }, loop: 2 }]),
            createNewNode({ x: 400, y: 200 }, [{ type: "CUSTOM", parameters: { id: "EVENT_3" }, loop: 0 }]),
          ],
          [
            { id: "dndnode_1", source: "_START_", target: "dndnode_2" },
            { id: "dndnode_2", source: "dndnode_1", target: "dndnode_3" },
            { id: "dndnode_3", source: "dndnode_2", target: "_END_" },
          ],
        ),
      ).toBe(true)
    })
  })
})
