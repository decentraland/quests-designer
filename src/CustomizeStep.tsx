import React, { useState } from 'react';
import { StepTask, ActionType, StepNode, StepTaskAction  } from './types'
import { Button, Field, Header, SelectField } from 'decentraland-ui';

const Trash = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.5 12C7.5 12.4125 7.1625 12.75 6.75 12.75C6.3375 12.75 6 12.4125 6 12V9C6 8.5875 6.3375 8.25 6.75 8.25C7.1625 8.25 7.5 8.5875 7.5 9V12ZM12 12C12 12.4125 11.6625 12.75 11.25 12.75C10.8375 12.75 10.5 12.4125 10.5 12V9C10.5 8.5875 10.8375 8.25 11.25 8.25C11.6625 8.25 12 8.5875 12 9V12ZM13.5 14.25C13.5 14.6632 13.164 15 12.75 15H5.25C4.836 15 4.5 14.6632 4.5 14.25V6H13.5V14.25ZM7.5 3.246C7.5 3.12975 7.6605 3 7.875 3H10.125C10.3395 3 10.5 3.12975 10.5 3.246V4.5H7.5V3.246ZM15.75 4.5H15H12V3.246C12 2.283 11.1593 1.5 10.125 1.5H7.875C6.84075 1.5 6 2.283 6 3.246V4.5H3H2.25C1.8375 4.5 1.5 4.8375 1.5 5.25C1.5 5.6625 1.8375 6 2.25 6H3V14.25C3 15.4905 4.0095 16.5 5.25 16.5H12.75C13.9905 16.5 15 15.4905 15 14.25V6H15.75C16.1625 6 16.5 5.6625 16.5 5.25C16.5 4.8375 16.1625 4.5 15.75 4.5Z"
        fill="#161518"
      />
    </svg>
  )
}

const Copy = () => {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.7992 14.44V14.44C14.8545 14.44 15.7101 13.5845 15.7101 12.5291V5.32004C15.7101 4.06083 14.6893 3.04004 13.4301 3.04004H7.00965C6.16362 3.04004 5.47778 3.72588 5.47778 4.57191V4.57191"
        stroke="#161518"
        stroke-width="0.76"
        stroke-linejoin="round"
      />
      <rect
        x="3.80005"
        y="5.19385"
        width="9.6989"
        height="11.4"
        rx="1.52"
        stroke="#161518"
        stroke-width="1.52"
        stroke-linejoin="round"
      />
    </svg>
  )
}

const Close = () => {
  return (
    <svg
      width="32"
      height="33"
      viewBox="0 0 32 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3.88794"
        y="3.88818"
        width="24.2998"
        height="24.2998"
        rx="5.83196"
        fill="#ECEBED"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20.1335 11.9491C20.5129 12.3288 20.5126 12.9443 20.1328 13.3237L13.3228 20.1274C12.943 20.5068 12.3276 20.5065 11.9482 20.1267C11.5688 19.747 11.5691 19.1316 11.9488 18.7521L18.7589 11.9484C19.1386 11.569 19.7541 11.5693 20.1335 11.9491Z"
        fill="#43404A"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20.1335 20.127C19.7541 20.5068 19.1386 20.507 18.7589 20.1276L11.9488 13.3239C11.5691 12.9445 11.5688 12.3291 11.9482 11.9493C12.3276 11.5696 12.943 11.5693 13.3228 11.9487L20.1328 18.7524C20.5126 19.1318 20.5129 19.7472 20.1335 20.127Z"
        fill="#43404A"
      />
    </svg>
  )
}


export const CustomizeStep: React.FunctionComponent<{
  step: StepNode, 
  close: () => void, 
  onSaveStep: () => void,
  onChangeStep: (step:StepNode) => void 
}> = 
({ step, close, onSaveStep, onChangeStep }) => {
  const [addTask, setAddTask] = useState(false)
  const [editTask, setEditTask] = useState<[StepTask, number] | null>(null)

  return (
    <aside>
      <div className='edit-step-title-box'>
        <div>
          <h1 style={{ fontSize: "22px" }}>Edit Step</h1>
        </div>
        <Button 
          content={<Close />}
          size='small'
          onClick={() => close()}
          style={{
            backgroundColor: "transparent",
            minWidth: "0px"
          }}
        />
      </div>
      <div style={{ margin: "5px 0" }} className='step-edit-input'>
        <Field 
          label="ID"
          kind='full'
          size='small'
          placeholder='Step ID'
          value={step.id}
          onChange={(event) => {
            onChangeStep({
              ...step, 
              id: event.target.value 
            })
          }}
        />
      </div>
      <div style={{ margin: "5px 0" }} className='step-edit-input'>
        <Field 
          label="Description"
          kind='full'
          size='small'
          placeholder='Step Description'
          value={step.description}
          onChange={(event) => {
            onChangeStep({
              ...step, 
              description: event.target.value 
            })
          }}
        />
      </div>
      {
        step.tasks.length && !addTask && !editTask ? 
        <div style={{ marginBottom: "20px" }}>
          <Header sub>
            Tasks
          </Header>
          { 
            step.tasks.map((task, i) => (
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }} >
                <Button
                  inverted
                  content={task.id}
                  onClick={() => setEditTask([task, i])}
                />
                <Button
                  size="small"
                  onClick={() => {
                    onChangeStep({ ...step, tasks: step.tasks.filter((_, index) => index != i) })
                  }}
                  content={<Trash />}
                  style={{
                    backgroundColor: "transparent",
                    minWidth: "0px"
                  }}
                />
              </div>
            )) 
            }
        </div>
        : null
      }
      {
        !addTask && !editTask && <Button content="add task" size='small' onClick={() => setAddTask(true)} secondary />
      }
      {
        addTask &&
        <Task 
          onNewTask={(task) => {
            onChangeStep({ ...step, tasks: [...step.tasks, task] })
            setAddTask(false)
          }}
          onCancel={() => setAddTask(false)}
        />
      }
      {
        editTask &&
        <Task
          task={editTask[0]}
          onNewTask={(task) => {
            const tasks = step.tasks.map((t, i) => i == editTask[1] ? task : t)
            onChangeStep({ ...step, tasks })
            setEditTask(null)
          }}
          onCancel={() => setEditTask(null)}
        />
      }
      {
        !addTask && !editTask && 
        <div style={{ margin: "10px 0" }}>
          <Button 
            style={{ marginTop: "10px", marginRight: "5px" }} 
            onClick={() => {
              onSaveStep()
              close()
            }}
            content="Done"
            primary
          />
          <Button
            style={{ marginTop: "10px" }} 
            onClick={() => close()}
            content="Cancel"
            secondary
          />
        </div>
      }
    </aside>
  );
}

const Task = ({ onNewTask, onCancel, task }: { task?: StepTask, onNewTask: (t: StepTask) => void; onCancel: () => void }) => {
  const [newTask, setNewTask] = useState<StepTask>({ 
    id: task?.id || "", 
    description: task?.description || "", 
    actionItems: task?.actionItems || [] 
  })

  const [newAction, setNewAction] = useState(false)
  const [editAction, setEditAction] = useState<[StepTaskAction, number] | null>(null)

  return (
    <div>
      <p style={{ fontSize: "16px", fontWeight: "600" }}>Add a Task to Step</p>
     <div style={{ margin: "5px 0" }} className='step-edit-input'>
        <Field 
          label="ID"
          kind='full'
          size='small'
          placeholder='Task ID'
          value={newTask.id}
          onChange={(e) => setNewTask({ ...newTask, id: e.target.value }) }
        />
      </div>
      <div style={{ margin: "5px 0" }} className='step-edit-input'>
        <Field 
          label="Description"
          kind='full'
          size='small'
          placeholder='Task Description'
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value }) }
        />
      </div>
      <div>
        <Header sub>
          Actions
        </Header>
        {
          newTask.actionItems.length > 0 && !newAction && !editAction &&
          newTask.actionItems.map((action, i) => (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", marginTop: "10px"}} >
              <Button
                content={`${action.type}`}
                onClick={() => setEditAction([action, i])}
                inverted
              />
              <div style={{ display: "flex", alignContent: "center" }}>
                <Button
                  size="small"
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      `${action.parameters}`
                    )
                  }}
                  content={<Copy />}
                  style={{
                    backgroundColor: "transparent",
                    minWidth: "0",
                    paddingLeft: "0",
                    paddingRight: "0",
                    marginRight: "6px"
                  }}
                />
                <Button
                  size="small"
                  onClick={() => {
                    setNewTask({ ...newTask, actionItems: newTask.actionItems.filter((_, index) => index != i) })
                  }}
                  content={<Trash />}
                  style={{
                    backgroundColor: "transparent",
                    minWidth: "0",
                    paddingLeft: "0",
                    paddingRight: "0",
                  }}
                />
              </div>
            </div>
          ))
        }
        {
          newAction && 
          <AddAction 
            onAddAction={(action) => {
              setNewTask({ ...newTask, actionItems: [...newTask.actionItems, action] })
              setNewAction(false)
            }} 
            onCancel={() => setNewAction(false)}
          />
        }
        {
          editAction &&
          <AddAction
            currentAction={editAction[0]}
            onAddAction={(action) => {
              setNewTask({ 
                ...newTask, 
                actionItems: newTask.actionItems.map((a, i) => i == editAction[1] ? action : a) 
              })
              setEditAction(null)
            }}
            onCancel={() => setEditAction(null)}
          />
        }
        {
          !newAction && !editAction &&
          <Button style={{ marginTop: "15px" }} content="add action" size='small' onClick={() => setNewAction(true)} secondary />
        }
      </div>
      {
        !newAction && !editAction &&
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <Button 
            size='small'
            content="Save Task"
            onClick={() => onNewTask(newTask)}
            primary
            style={{ marginRight: "5px" }}
          />
          <Button 
            size='small'
            content="Cancel"
            onClick={() => onCancel()}
          />
        </div>
      }
    </div>
  )
}

const AddAction = ({onAddAction, onCancel, currentAction}: { currentAction?: StepTaskAction, onAddAction: (action: StepTaskAction) => void, onCancel: () => void }) => {
  const [action, setAction] = useState<StepTaskAction>({ 
    type: currentAction?.type || "CUSTOM", 
    parameters: currentAction?.parameters || null, 
    loop: currentAction?.loop || 0 
  });
  const [currentTypeSelected, setSelected] = useState<ActionType>(currentAction?.type || "CUSTOM");

  return (
    <div>
      <div>
        <p style={{ fontSize: "16px", fontWeight: "600" }}>{currentAction ? "Edit Action" : "Add a new action"}</p>
        <div className='step-edit-select-input'>
          <SelectField 
            label="Action type"
            border
            closeOnChange
            placeholder="Select an action type"
            value={currentTypeSelected}
            options={[
              {
                key:"CUSTOM", value: "CUSTOM", text: "CUSTOM"
              },
              {
                key:"LOCATION", value: "LOCATION", text: "LOCATION"
              },
              {
                key:"EMOTE", value: "EMOTE", text: "EMOTE"
              },
              {
                key:"JUMP", value: "JUMP", text: "JUMP"
              }
            ]}
            onChange={(_, { value }) => {
              setAction({ type: value as ActionType, parameters: null, loop: 1 })
              setSelected(value as ActionType)
            }}
          />
        </div>
      </div>
      <div>
          {
            currentTypeSelected == "CUSTOM" ? 
            <CustomParamsSetter 
              paramSetter={(customId, loop) => setAction({ type: "CUSTOM", parameters: { id: customId }, loop })}
              currentState={{ 
                loop: action.loop, 
                id: action?.parameters && "id" in action.parameters ? action.parameters.id : "" 
              }}
            />
            : currentTypeSelected == "LOCATION" ? 
              <LocationParmsSetter 
                helpText='User has to go to: ' 
                paramSetter={(x, y, loop) => { setAction({ type: "LOCATION", parameters: { x, y }, loop }) }} 
                currentState={{ 
                  loop: action.loop, 
                  x: action?.parameters && "x" in action.parameters ? action.parameters.x : 0, 
                  y: action?.parameters && "y" in action.parameters ? action.parameters.y : 0
                }}
              /> :
            currentTypeSelected == "JUMP" ? 
              <LocationParmsSetter 
                helpText='User has to jump at: ' 
                paramSetter={(x, y, loop) => { setAction({ type: "JUMP", parameters: { x, y }, loop }) }} 
                currentState={{ 
                  loop: action.loop, 
                  x: action?.parameters && "x" in action.parameters ? action.parameters.x : 0, 
                  y: action?.parameters && "y" in action.parameters ? action.parameters.y : 0
                }}
              />
            : currentTypeSelected == "EMOTE" ? 
              <IDAndLocationSetter 
                label="Emote ID"
                helpText='User has to play an emote: '
                paramSetter={(id, x, y, loop) => setAction({ type: "EMOTE", parameters: { id: id, x, y}, loop })} 
                currentState={{ 
                  id: action?.parameters && "id" in action.parameters ? action.parameters.id : "",
                  loop: action.loop, 
                  x: action?.parameters && "x" in action.parameters ? action.parameters.x : 0, 
                  y: action?.parameters && "y" in action.parameters ? action.parameters.y : 0
                }}
              /> 
            : null
          }
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "5px" }}>
        <Button
          size='small'
          content={ currentAction ? "Save" : "Add"}
          onClick={() => onAddAction(action!)}
          disabled={!taskParametersAreValid(action.parameters!)}
          primary
        />
        <Button
          size='small'
          content="Cancel"
          onClick={() => onCancel()}
          secondary
        />
      </div>
    </div>
  )


}

const CustomParamsSetter = 
({paramSetter, currentState}: {paramSetter: (customId: string, loop: number) => void, currentState: { id: string, loop: number }}) => {
  const [state, setState] = useState({  
    id: currentState.id || "",
    loop: currentState.loop || 0
  })
  return (
    <div>
      <div className='step-edit-input'>
        <Field
          label="Action ID"
          placeholder="ID parameter"
          value={state.id}
          kind='full'
          size='small'
          onChange={(e) => {
            setState({ ...state, id: e.target.value });
            paramSetter(e.target.value, state.loop)
          }}
        />
      </div>
      <Loop 
        loopSetter={(loop) => {
          setState({ ...state, loop });
          paramSetter(state.id, loop)
        }} 
        currentLoop={state.loop} 
      />
    </div>
  )
}

const LocationParmsSetter = 
({helpText, paramSetter, currentState}: 
{helpText: string, paramSetter: (x: number, y: number, loop: number) => void, currentState: { loop: number, x: number, y: number }}) => {
  const [loop, setLoop] = useState(currentState.loop);

  return (
    <div>
      <p style={{ fontSize: "14px", fontWeight: "500" }}>{helpText}</p>
      <CoordsSetter 
        coordsSetter={(x, y) => paramSetter(x, y, loop)} 
        currentCoords={{ x: currentState.x, y: currentState.y }} 
      />
      <Loop 
        loopSetter={(loop) => setLoop(loop)} 
        currentLoop={loop}
      />
    </div>
  )
}


const CoordsSetter = 
({ coordsSetter, currentCoords }: { coordsSetter: (x: number, y: number) => void, currentCoords: { x: number, y: number } }) => {
  const [coords, setCoords] = useState<{x: number, y: number}>({
    x: currentCoords.x,
    y: currentCoords.y
  })
  
  return (
    <>
      <div className='step-edit-input'>
        <Field 
          label="X coord"
          type='number'
          kind='full'
          size='small'
          placeholder="X"
          value={coords.x || ""}
          onChange={(e) => {
            setCoords({ ...coords, x: Number(e.target.value) })
            coordsSetter(Number(e.target.value), coords.y)
          }}
        />
      </div>
      <div className='step-edit-input'>
        <Field 
          label="Y coord"
          type='number'
          kind='full'
          size='small'
          placeholder="Y"
          value={coords.y || ""}
          onChange={(e) => {
            setCoords({ ...coords, y: Number(e.target.value) })
            coordsSetter(coords.x, Number(e.target.value))
          }}
        />
      </div>
    </>
  )
}


const Loop = ({loopSetter, currentLoop}: {loopSetter: (loop: number) => void, currentLoop: number}) => {
  return (
    <div className='step-edit-input'>
      <Field 
        label="Repeat"
        type='number'
        placeholder="Repeat times"
        kind='full'
        size='small'
        value={currentLoop || ""}
        onChange={(e) => {
          loopSetter(Number(e.target.value))
        }}
      />
    </div>
  )
}


const IDAndLocationSetter = 
({helpText, label, paramSetter, currentState}:
{
  label: string, 
  helpText: string, 
  paramSetter: (id: string, x: number, y: number, loop: number) => void,
  currentState: { id: string, x: number, y: number, loop: number }
}) => {
  const [state, setState] = useState({  
    id: currentState?.id || "",
    x: currentState?.x || 0,
    y: currentState?.y || 0,
    loop: currentState?.loop || 0
  })

  return (
    <div>
      <p style={{ fontSize: "14px", fontWeight: "500"  }}>{helpText}</p>
      <div className='step-edit-input'>
        <Field
          label={label}
          placeholder={label}
          value={state.id}
          kind='full'
          size='small'
          onChange={(e) => {
            setState({ ...state, id: e.target.value });
            paramSetter(e.target.value, state.x, state.y, state.loop)
          }}
        />
      </div>
      <CoordsSetter 
        currentCoords={{ x: state.x, y: state.y }}
        coordsSetter={(x, y) => {
          setState({...state, x, y});
          paramSetter(state.id, x, y, state.loop)
        }} 
      />
      <Loop 
        loopSetter={(loop) => {
          setState({...state, loop});
          paramSetter(state.id, state.x, state.y, loop)
        }}
        currentLoop={state.loop} 
      />
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