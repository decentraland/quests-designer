import React from "react"

import { Button, ButtonProps } from "decentraland-ui/dist/components/Button/Button"
import { useStore } from "reactflow"

import { isValidNode } from "./utils"

export default ({
  isValidQuest,
  generateButton,
}: {
  generateButton?: {
    content: string
    onClick: () => void
  }
  isValidQuest: boolean
}) => {
  const nodes = useStore((state) => state.getNodes())
  return (
    <aside style={{ overflowY: "scroll", position: "relative" }}>
      <div className="new-step-box">
        <div>
          <Button
            content="new step"
            className="new-step-btn"
            draggable
            onDragStart={(event: React.DragEvent<ButtonProps>) => {
              event.dataTransfer.setData("application/reactflow", "questStep")
              event.dataTransfer.effectAllowed = "move"
            }}
          />
        </div>
        <p className="description">
          Create a new step by dragging the above component onto the canvas, or by creating a connection line.
        </p>
      </div>
      <div>
        <h1 className="title">Steps</h1>
        <div className="steps-box">
          {nodes.length - 2 > 0 &&
            nodes
              .filter((node) => node.type !== "start" && node.type !== "end")
              .map((node) => (
                <p className="step" key={node.data.id}>
                  {node.data.id} -{" "}
                  <span
                    style={{
                      color: !isValidNode(node, nodes) ? "#FF0000" : "",
                      fontWeight: isValidNode(node, nodes) ? "normal" : "600",
                    }}
                  >
                    {isValidNode(node, nodes) ? "Valid" : "Invalid"}
                  </span>
                </p>
              ))}
        </div>
      </div>
      {generateButton && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <Button
            primary
            size="medium"
            className="generate-quest-btn"
            disabled={!isValidQuest}
            content={generateButton.content}
            onClick={() => generateButton.onClick()}
          />
        </div>
      )}
    </aside>
  )
}
