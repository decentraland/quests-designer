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
      saveDesignButton={{ onClick: () => alert("save") }} 
    />
  </React.StrictMode>
)
