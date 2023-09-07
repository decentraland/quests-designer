import React from 'react'
import { createRoot } from 'react-dom/client'
import { QuestsDesigner } from '../src'
import { initialNodes } from '../src/utils'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QuestsDesigner 
      initialEdges={[]} 
      initialNodes={initialNodes} 
      closeDesigner={() => alert("close")} 
      saveDesignButton={{ onClick: (def, nodes, edges) => {
        console.log(def)
        console.log(nodes)
        console.log(edges)
        alert("Saved")
      }, content: "Generate Quest" }} 
    />
  </React.StrictMode>
)
