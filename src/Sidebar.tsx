import React from 'react';
import { Node } from 'reactflow';

export default ({nodes, generateQuest, isValidQuest}: { nodes: Node[], generateQuest: () => void, isValidQuest: boolean}) => {
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
        event.dataTransfer.setData('application/reactflow', 'simpleStep')
        event.dataTransfer.effectAllowed = 'move'
      }} draggable>
        New Step
      </div>
      <p className="description">
        You can can create a new step by dragging the above button, or by dropping the connection line on the pane on the right
      </p>
      <button disabled={!isValidQuest} style={{ margin:"20px 0", padding: "10px"}} onClick={() => generateQuest()}>Generate Quest</button>
    </aside>
  );
};