import React from 'react';
import { useStore } from 'reactflow';
import { Button, ButtonProps } from 'decentraland-ui';
import { isValidNode } from './utils';

export default ({
  generateQuest, 
  saveButtonContent, 
  isValidQuest, 
}: 
{ 
  generateQuest: () => void, 
  saveButtonContent: string, 
  isValidQuest: boolean, 
}) => {
  const nodes = useStore((state) => state.getNodes())
  return (
    <aside>
      <div className='generate-box'>
        <h1 className='title'>Current Steps: {nodes.length - 2}</h1>
        <div className='steps-box'>
          {
            nodes.length - 2 > 0 &&
            nodes
              .filter((node) => node.type !== "start" && node.type !== "end")
              .map((node) => (
                <p className='step' key={node.data.id}>
                  {node.data.id} - {" "}
                  <span style={{ color: isValidNode(node) ? "#36D41D" : "#FF0000" }}>
                    {isValidNode(node) ? "Valid" : "Invalid"}
                  </span>
                </p>
              ))
          }
        </div>
        <Button 
          primary
          size='medium'
          className='generate-quest-btn'
          disabled={!isValidQuest}
          content={saveButtonContent}
          onClick={() => generateQuest()}
        />
      </div>
      <div className='new-step-box'>
        <div>
          <Button
            content="new step"
            className='new-step-btn'
            draggable
            onDragStart={(event: React.DragEvent<ButtonProps>) => {
              event.dataTransfer.setData('application/reactflow', 'questStep')
              event.dataTransfer.effectAllowed = 'move'
            }}
          />
        </div>
        <p className="description">
          Create a new step by dragging the above component onto the canvas, or by creating a connection line.
        </p>
      </div>
    </aside>
  );
};