import React from 'react'
import { createRoot } from 'react-dom/client'
import { QuestsDesigner } from '../src'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QuestsDesigner />
  </React.StrictMode>
)