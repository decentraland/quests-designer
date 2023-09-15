import React from "react"
import { createRoot } from "react-dom/client"
import { initialNodes } from "../src/utils"
import { QuestsDesigner } from "../src"

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QuestsDesigner
      initialEdges={[]}
      initialNodes={initialNodes}
      backButton={() => alert("close")}
      saveDesignButton={{
        onClick: async (def, nodes, edges) => {
          console.log(def)
          console.log(nodes)
          console.log(edges)
          await navigator.clipboard.writeText(JSON.stringify(def))
          alert("Saved")
        },
        content: "Generate Quest",
        validate: false,
      }}
    />
  </React.StrictMode>,
)
