import React, { useState } from 'react';
import { Node } from 'reactflow'
import { StepTask, ActionType, StepNode  } from './types'

export const CustomizeStep: React.FunctionComponent<{close: () => void, step: Node<StepNode>}> = ({ step, close }) => {
  const [tasks, setTasks] = useState<StepTask<ActionType>[]>([]);
  const [addTask, setAddTask] = useState(false)
  const [newName, setNewName] = useState(step.data.label)
  const [description, setDescription] = useState(step.data.description)

  const finish = (task: StepTask<ActionType>, save: boolean) => {
    if (save) {
      setTasks((tasks) => {
        const newTasks = [...tasks, task];
        step.data.tasks =  newTasks
        return newTasks
      })
    }
    setAddTask(false)
  }

  return (
    <aside>
      <button onClick={() => close()}>Close</button>
      <h1 className="description">Add Step {step.data.stepNumber} info</h1>
      <div style={{ margin: "10px 0" }}>
        <p>Change Step's name</p>
        <input type="text" value={newName} onChange={(event) => setNewName(event.target.value)} />
      </div>
      <div style={{ margin: "10px 0" }}>
        <p>Step's description</p>
        <textarea style={{ width: "155px" }} value={description} onChange={(event) => setDescription(event.target.value)} />
      </div>
      {
        tasks.length ? <ol>{ tasks.map((task) => (<li>{task.type} - {JSON.stringify(task.parameters)}</li>)) }</ol> : null
      }
      {
        !addTask && <button onClick={() => setAddTask(true)}>Add Task</button>
      }
      {
        addTask &&
        <AddTask taskNumber={tasks.length +1} finish={finish} />
      }
      {
        !addTask && <div style={{ margin: "10px 0" }}>
          <button disabled={!((newName != step.data.label || description != ""))} style={{ marginTop: "10px", marginRight: "5px" }} onClick={() => {
            step.data.label = newName
            step.data.description = description
            close()
          }}>Done</button>
          <button style={{ marginTop: "10px" }} onClick={() => close()}>Cancel</button>
        </div>
      }
    </aside>
  );
}

const AddTask = ({finish, taskNumber}: { finish: (task: StepTask<ActionType>, save: boolean) => void, taskNumber: number }) => {
  const [task, setTask] = useState<StepTask<ActionType>>({ type: "CUSTOM", parameters: undefined, loop: 0 });
  const [currentTypeSelected, setSelected] = useState<ActionType>("CUSTOM");

  return (
    <div>
      <div>
        <p>Adding Action to {taskNumber} task</p>
        <select onChange={(e) => {
            setTask({ type: e.target.value as ActionType, parameters: undefined, loop: 1 })
            setSelected(e.target.value as ActionType)
          }}>
          <option key="CUSTOM" value="CUSTOM">Custom</option>
          <option key="LOCATION" value="LOCATION">Location</option>
          <option key="EMOTE" value="EMOTE">Emote</option>
          <option key="JUMP" value="JUMP">Jump</option>
          <option key="NPC_INTERACTION" value="NPC_INTERACTION">NPC interaction</option>
        </select>
      </div>
      <div style={{ marginTop: "10px" }}>
          {
            currentTypeSelected == "CUSTOM" ? <CustomParamsSetter paramSetter={(customId, loop) => setTask({ type: "CUSTOM", parameters: { id: customId }, loop })} />
            : currentTypeSelected == "LOCATION" ? <LocationParmsSetter text='User has to go to' paramSetter={(x, y, loop) => { setTask({ type: "LOCATION", parameters: { x, y }, loop }) }} /> :
            currentTypeSelected == "JUMP" ? <LocationParmsSetter text='User has to jump at' paramSetter={(x, y, loop) => { setTask({ type: "JUMP", parameters: { x, y }, loop }) }} />
            : currentTypeSelected == "EMOTE" ? <IDAndLocationSetter text="Set the Emote ID" paramSetter={(id, x, y, loop) => setTask({ type: "EMOTE", parameters: { emote_id: id, x, y}, loop })} /> :
            currentTypeSelected == "NPC_INTERACTION" ? <IDAndLocationSetter text="Set the NPC ID" paramSetter={(id, x, y, loop) => setTask({ type: "NPC_INTERACTION", parameters: { npc_id: id, x, y}, loop })} /> 
            : null
          }
      </div>
      <button disabled={!taskParametersAreValid(task.parameters!)} style={{ marginTop: "10px", marginRight: "5px" }} onClick={() => finish(task!, true)}>Done</button>
      <button style={{ marginTop: "10px" }} onClick={() => finish(task!, false)}>Cancel</button>
    </div>
  )


}

const CustomParamsSetter = ({paramSetter}: {paramSetter: (customId: string, loop: number) => void}) => {
  const [state, setState] = useState({  
    id:"",
    loop: 0
  })
  return (
    <div>
      <div>
        <p>Set the ID for the custom task in your scene</p>
        <input type="text" placeholder='Custom ID' onChange={(e) =>{ 
          setState({ ...state, id: e.target.value });
          paramSetter(e.target.value, state.loop)
        }} />
      </div>
      <Loop loopSetter={(loop) => {
          setState({ ...state, loop });
          paramSetter(state.id, loop)
      }} />
    </div>
  )
}

const LocationParmsSetter = ({text, paramSetter}: {text: string, paramSetter: (x: number, y: number, loop: number) => void}) => {
  const [loop, setLoop] = useState(0);

  return (
    <div>
      <p>{text}</p>
      <CoordsSetter coordsSetter={(x, y) => paramSetter(x, y, loop)} />
      <Loop loopSetter={(loop) => setLoop(loop)} />
    </div>
  )
}


const CoordsSetter = ({ coordsSetter }: { coordsSetter: (x: number, y: number) => void }) => {
  const [coords, setCoords] = useState<{x: number, y: number}>({
    x: 0,
    y: 0
  })
  
  return (
    <>
      <div>
        <p>X coord</p>
        <input type="text" placeholder='X' onChange={(e) => {
          setCoords({ ...coords, x: Number(e.target.value) })
          coordsSetter(Number(e.target.value), coords.y)
        }} />
      </div>
      <div>
        <p>Y coord</p>
        <input type="text" placeholder='Y' onChange={(e) => {
          setCoords({ ...coords, y: Number(e.target.value) })
          coordsSetter(coords.x, Number(e.target.value))
        }} />
      </div>
    </>
  )
}


const Loop = ({loopSetter}: {loopSetter: (loop: number) => void}) => {

  return (
    <div>
      <p>Should the task be repeated?</p>
      <input type='number' placeholder='Repeat times' onChange={(e) => loopSetter(Number(e.target.value))}  />
    </div>
  )
}


const IDAndLocationSetter = ({text, paramSetter}: {text: string, paramSetter: (id: string, x: number, y: number, loop: number) => void}) => {
  const [state, setState] = useState({  
    id:"",
    x: 0,
    y: 0,
    loop: 0
  })
  return (
    <div>
      <div>
        <p>{text}</p>
        <input type="text" placeholder='ID' onChange={(e) =>{ 
          setState({ ...state, id: e.target.value });
          paramSetter(e.target.value, state.x, state.y, state.loop)
        }} />
      </div>
      <CoordsSetter coordsSetter={(x, y) => {
        setState({...state, x, y});
        paramSetter(state.id, x, y, state.loop)
      }} />
      <Loop loopSetter={(loop) => {
        setState({...state, loop});
        paramSetter(state.id, state.x, state.y, loop)
      }} />
    </div>
  )
}

function taskParametersAreValid<P extends {[key: string]: any}>(data: P) {
  if (data != undefined) {
    const keys = Object.keys(data);
    return keys.every((key) => Boolean(data[key]))
  } 

  return false
}