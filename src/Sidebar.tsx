import React from 'react';
import { Node } from 'reactflow';

export default ({
  nodes, 
  generateQuest, 
  saveButtonContent, 
  isValidQuest, 
  closeDesigner
}: 
{ 
  nodes: Node[], generateQuest: () => void, 
  saveButtonContent: string, 
  isValidQuest: boolean, 
  closeDesigner?: () => void
}) => {
  return (
    <aside>
      <div>
        <h3>Current Steps: {nodes.length - 2}</h3>
        {
          nodes.length - 2 ? 
          nodes
            .filter((node) => node.data.label !== "Start" && node.data.label !== "End")
            .map((node) => (
              <>
                <p>{node.data.label} - <span style={{ color: node.data.tasks.length ? "green" : "red" }}>{node.data.tasks.length ? "Valid" : "Invalid"}</span></p>
              </>
            ))
          : <p>Let's create a new step!</p>
        }
      </div>
      <div className="dndnode input" onDragStart={(event) => {
        event.dataTransfer.setData('application/reactflow', 'questStep')
        event.dataTransfer.effectAllowed = 'move'
      }} draggable>
        New Step
      </div>
      <p className="description">
        You can can create a new step by dragging the above button, or by dropping the connection line on the pane on the right
      </p>
      <div style={{ display: "flex", justifyContent: "space-between" , margin: "20px 0"}}>
        <button disabled={!isValidQuest} style={{ padding: "10px", marginRight: "5px"}} onClick={() => generateQuest()}>{saveButtonContent}</button>
        {
          closeDesigner && <button  style={{ padding: "10px"}} onClick={() => closeDesigner()}>Close</button>
        }
      </div>
    </aside>
  );
};