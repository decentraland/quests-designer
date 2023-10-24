import React, { useState } from "react"

import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Field } from "decentraland-ui/dist/components/Field/Field"
import { Header } from "decentraland-ui/dist/components/Header/Header"
import { SelectField } from "decentraland-ui/dist/components/SelectField/SelectField"
import { Node, useStore } from "reactflow"

import { CloseButton } from "./components/CloseButton"
import { CopyButton } from "./components/CopyButton"
import { DeleteButton } from "./components/DeleteButton"
import { ActionType, StepNode, StepTask, StepTaskAction } from "./types"
import {
  isValidStepTask,
  nodeIsUniqueStepID,
  nodeMustHaveDescription,
  stepTaskIsUniqueID,
  stepTaskMustHaveDescription,
} from "./utils"

type CustomizeStepProps = {
  step: StepNode
  onCancel: () => void
  onDone: () => void
  onChangeStep: (s: StepNode) => void
}

export const CustomizeStep: React.FunctionComponent<CustomizeStepProps> = ({
  step,
  onCancel,
  onChangeStep,
  onDone,
}) => {
  const [addTask, setAddTask] = useState(false)
  const [editTask, setEditTask] = useState<[StepTask, number] | null>(null)

  const nodes = useStore((state) => state.getNodes() as Node<StepNode>[])

  return (
    <aside style={{ overflowY: "scroll" }}>
      <div className="edit-step-title-box">
        <div>
          <h1 style={{ fontSize: "22px" }}>Edit Step</h1>
        </div>
        <CloseButton onClick={() => onCancel()} />
      </div>
      <div style={{ margin: "5px 0" }} className="step-edit-input">
        <Field
          label="ID"
          kind="full"
          size="small"
          placeholder="Step ID"
          value={step.id}
          onChange={(event) => {
            onChangeStep({
              ...step,
              id: event.target.value,
            })
          }}
          error={!nodeIsUniqueStepID(step.id, nodes)}
          message={nodeIsUniqueStepID(step.id, nodes) ? undefined : "This ID already exists"}
        />
      </div>
      <div style={{ margin: "5px 0" }} className="step-edit-input">
        <Field
          label="Description"
          kind="full"
          size="small"
          placeholder="Step Description"
          value={step.description}
          onChange={(event) => {
            onChangeStep({
              ...step,
              description: event.target.value,
            })
          }}
          error={!nodeMustHaveDescription(step)}
          message={!nodeMustHaveDescription(step) ? "Must have a description" : undefined}
        />
      </div>
      {step.tasks.length && !addTask && !editTask ? (
        <div style={{ marginBottom: "20px" }}>
          <Header sub>Tasks</Header>
          {step.tasks.map((task, i) => {
            const isValid = isValidStepTask(task, nodes)
            return (
              <div
                key={`${task.id}${i}`}
                style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}
              >
                <Button
                  inverted={isValid}
                  negative={!isValid}
                  content={task.id}
                  onClick={() => setEditTask([{ ...task }, i])}
                />
                <DeleteButton
                  onClick={() => {
                    onChangeStep({
                      ...step,
                      tasks: step.tasks.filter((_, index) => index != i),
                    })
                  }}
                />
              </div>
            )
          })}
        </div>
      ) : null}
      {!addTask && !editTask && (
        <Button
          content="add task"
          size="small"
          onClick={() => {
            setAddTask(true)
            onChangeStep({ ...step, tasks: [...step.tasks, { id: "", description: "", actionItems: [] }] })
          }}
          secondary
        />
      )}
      {addTask && (
        <Task
          task={step.tasks[step.tasks.length - 1]}
          onChangeTask={(task) => {
            const tasks = [...step.tasks]
            tasks[tasks.length - 1] = task
            onChangeStep({ ...step, tasks })
          }}
          onCancel={() => {
            setAddTask(false)
            onChangeStep({ ...step, tasks: step.tasks.slice(0, -1) })
          }}
          onDone={() => setAddTask(false)}
        />
      )}
      {editTask && (
        <Task
          task={step.tasks[editTask[1]]}
          onChangeTask={(task) => {
            const tasks = step.tasks.map((t, i) => (i == editTask[1] ? task : t))
            onChangeStep({ ...step, tasks })
          }}
          onCancel={() => {
            setEditTask(null)
            const tasks = step.tasks.map((t, i) => (i == editTask[1] ? editTask[0] : t))
            onChangeStep({ ...step, tasks })
          }}
          onDone={() => setEditTask(null)}
        />
      )}
      {!addTask && !editTask && (
        <div style={{ margin: "10px 0" }}>
          <Button
            style={{ marginTop: "10px", marginRight: "5px" }}
            onClick={() => {
              onDone()
            }}
            content="Done"
            primary
          />
          <Button style={{ marginTop: "10px" }} onClick={() => onCancel()} content="Cancel" secondary />
        </div>
      )}
    </aside>
  )
}

const Task = ({
  onChangeTask,
  onCancel,
  onDone,
  task,
}: {
  task: StepTask
  onChangeTask: (t: StepTask) => void
  onCancel: () => void
  onDone: () => void
}) => {
  const [newAction, setNewAction] = useState(false)
  const [editAction, setEditAction] = useState<[StepTaskAction, number] | null>(null)

  const nodes = useStore((state) => state.getNodes() as Node<StepNode>[])

  return (
    <div>
      <p style={{ fontSize: "16px", fontWeight: "600" }}>Add a Task to Step</p>
      <div style={{ margin: "5px 0" }} className="step-edit-input">
        <Field
          label="ID"
          kind="full"
          size="small"
          placeholder="Task ID"
          value={task.id}
          onChange={(e) => onChangeTask({ ...task, id: e.target.value })}
          error={!task.id ? false : !stepTaskIsUniqueID(task.id, nodes)}
          message={
            task.id == "" ? undefined : !stepTaskIsUniqueID(task.id, nodes) ? "The ID already exists" : undefined
          }
        />
      </div>
      <div style={{ margin: "5px 0" }} className="step-edit-input">
        <Field
          label="Description"
          kind="full"
          size="small"
          placeholder="Task Description"
          value={task.description}
          onChange={(e) => onChangeTask({ ...task, description: e.target.value })}
          error={!stepTaskMustHaveDescription(task)}
          message={!stepTaskMustHaveDescription(task) ? "Must have a description" : undefined}
        />
      </div>
      <div>
        <Header sub>Actions</Header>
        {task.actionItems.length > 0 &&
          !newAction &&
          !editAction &&
          task.actionItems.map((action, i) => (
            <div
              key={`${action.type}${i}`}
              style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", marginTop: "10px" }}
            >
              <Button content={`${action.type}`} onClick={() => setEditAction([action, i])} inverted />
              <div style={{ display: "flex", alignContent: "center" }}>
                <CopyButton
                  onClick={async () => {
                    await navigator.clipboard.writeText(`${action.parameters}`)
                  }}
                />
                <DeleteButton
                  onClick={() => {
                    onChangeTask({ ...task, actionItems: task.actionItems.filter((_, index) => index != i) })
                  }}
                />
              </div>
            </div>
          ))}
        {newAction && (
          <AddAction
            onAddAction={(action) => {
              onChangeTask({ ...task, actionItems: [...task.actionItems, action] })
              setNewAction(false)
            }}
            onCancel={() => setNewAction(false)}
          />
        )}
        {editAction && (
          <AddAction
            currentAction={editAction[0]}
            onAddAction={(action) => {
              onChangeTask({
                ...task,
                actionItems: task.actionItems.map((a, i) => (i == editAction[1] ? action : a)),
              })
              setEditAction(null)
            }}
            onCancel={() => setEditAction(null)}
          />
        )}
        {!newAction && !editAction && (
          <Button
            style={{ marginTop: "15px" }}
            content="add action"
            size="small"
            onClick={() => setNewAction(true)}
            secondary
          />
        )}
      </div>
      {!newAction && !editAction && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <Button size="small" content="Done" onClick={() => onDone()} primary style={{ marginRight: "5px" }} />
          <Button size="small" content="Cancel" onClick={() => onCancel()} />
        </div>
      )}
    </div>
  )
}

const AddAction = ({
  onAddAction,
  onCancel,
  currentAction,
}: {
  currentAction?: StepTaskAction
  onAddAction: (action: StepTaskAction) => void
  onCancel: () => void
}) => {
  const [action, setAction] = useState<StepTaskAction>({
    type: currentAction?.type || "CUSTOM",
    parameters: currentAction?.parameters || null,
    loop: currentAction?.loop || null,
  })

  const [currentTypeSelected, setSelected] = useState<ActionType>(currentAction?.type || "CUSTOM")

  return (
    <div>
      <div>
        <p style={{ fontSize: "16px", fontWeight: "600" }}>{currentAction ? "Edit Action" : "Add a new action"}</p>
        <div className="step-edit-select-input">
          <SelectField
            label="Action type"
            border
            closeOnChange
            placeholder="Select an action type"
            value={currentTypeSelected}
            options={[
              {
                key: "CUSTOM",
                value: "CUSTOM",
                text: "CUSTOM",
              },
              {
                key: "LOCATION",
                value: "LOCATION",
                text: "LOCATION",
              },
              {
                key: "EMOTE",
                value: "EMOTE",
                text: "EMOTE",
              },
              {
                key: "JUMP",
                value: "JUMP",
                text: "JUMP",
              },
            ]}
            onChange={(_, { value }) => {
              setAction({ type: value as ActionType, parameters: null, loop: null })
              setSelected(value as ActionType)
            }}
          />
        </div>
      </div>
      <div>
        {currentTypeSelected == "CUSTOM" ? (
          <CustomParamsSetter
            paramSetter={(customId, loop) => setAction({ type: "CUSTOM", parameters: { id: customId }, loop })}
            currentState={{
              loop: action.loop,
              id: action?.parameters && "id" in action.parameters ? action.parameters.id : "",
            }}
          />
        ) : currentTypeSelected == "LOCATION" ? (
          <LocationParmsSetter
            helpText="User has to go to: "
            paramSetter={(x, y, loop) => {
              setAction({ type: "LOCATION", parameters: { x, y }, loop })
            }}
            currentState={{
              loop: action.loop,
              x: action?.parameters && "x" in action.parameters ? action.parameters.x : null,
              y: action?.parameters && "y" in action.parameters ? action.parameters.y : null,
            }}
          />
        ) : currentTypeSelected == "JUMP" ? (
          <LocationParmsSetter
            helpText="User has to jump at: "
            paramSetter={(x, y, loop) => {
              setAction({ type: "JUMP", parameters: { x, y }, loop })
            }}
            currentState={{
              loop: action.loop,
              x: action?.parameters && "x" in action.parameters ? action.parameters.x : null,
              y: action?.parameters && "y" in action.parameters ? action.parameters.y : null,
            }}
          />
        ) : currentTypeSelected == "EMOTE" ? (
          <IDAndLocationSetter
            label="Emote ID"
            helpText="User has to play an emote: "
            paramSetter={(id, x, y, loop) => setAction({ type: "EMOTE", parameters: { id: id, x, y }, loop })}
            currentState={{
              id: action?.parameters && "id" in action.parameters ? action.parameters.id : "",
              loop: action.loop,
              x: action?.parameters && "x" in action.parameters ? action.parameters.x : null,
              y: action?.parameters && "y" in action.parameters ? action.parameters.y : null,
            }}
          />
        ) : null}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "5px" }}>
        <Button
          size="small"
          content={currentAction ? "Save" : "Add"}
          onClick={() => onAddAction(action!)}
          disabled={!taskParametersAreValid(action.parameters!)}
          primary
        />
        <Button size="small" content="Cancel" onClick={() => onCancel()} secondary />
      </div>
    </div>
  )
}

const CustomParamsSetter = ({
  paramSetter,
  currentState,
}: {
  paramSetter: (customId: string, loop: number | null) => void
  currentState: { id: string; loop: number | null }
}) => {
  const [state, setState] = useState({
    id: currentState.id || "",
    loop: currentState.loop || null,
  })
  return (
    <div>
      <div className="step-edit-input">
        <Field
          label="Action ID"
          placeholder="ID parameter"
          value={state.id}
          kind="full"
          size="small"
          onChange={(e) => {
            setState({ ...state, id: e.target.value })
            paramSetter(e.target.value, Number(state.loop))
          }}
        />
      </div>
      <Loop
        loopSetter={(loop) => {
          setState({ ...state, loop })
          paramSetter(state.id, loop)
        }}
        currentLoop={state.loop === null ? undefined : Number(state.loop)}
      />
    </div>
  )
}

const LocationParmsSetter = ({
  helpText,
  paramSetter,
  currentState,
}: {
  helpText: string
  paramSetter: (x: number | null, y: number | null, loop: number | null) => void
  currentState: { loop: number | null; x: number | null; y: number | null }
}) => {
  const [loop, setLoop] = useState(currentState.loop)

  return (
    <div>
      <p style={{ fontSize: "14px", fontWeight: "500" }}>{helpText}</p>
      <CoordsSetter
        coordsSetter={(x, y) => paramSetter(x, y, loop)}
        currentCoords={{ x: currentState.x, y: currentState.y }}
      />
      <Loop loopSetter={(loop) => setLoop(loop)} currentLoop={loop} />
    </div>
  )
}

const CoordsSetter = ({
  coordsSetter,
  currentCoords,
}: {
  coordsSetter: (x: number | null, y: number | null) => void
  currentCoords: { x: number | null; y: number | null }
}) => {
  const [coords, setCoords] = useState<{ x: number | null; y: number | null }>({
    x: currentCoords.x,
    y: currentCoords.y,
  })

  return (
    <>
      <div className="step-edit-input">
        <Field
          label="X coord"
          type="number"
          kind="full"
          size="small"
          placeholder="X"
          value={coords.x ?? ""}
          onChange={(e) => {
            setCoords({ ...coords, x: Number(e.target.value) })
            coordsSetter(Number(e.target.value), coords.y)
          }}
        />
      </div>
      <div className="step-edit-input">
        <Field
          label="Y coord"
          type="number"
          kind="full"
          size="small"
          placeholder="Y"
          value={coords.y ?? ""}
          onChange={(e) => {
            setCoords({ ...coords, y: Number(e.target.value) })
            coordsSetter(coords.x, Number(e.target.value))
          }}
        />
      </div>
    </>
  )
}

const Loop = ({
  loopSetter,
  currentLoop,
}: {
  loopSetter: (loop: number | null) => void
  currentLoop?: number | null
}) => {
  return (
    <div className="step-edit-input">
      <Field
        label="Repeat"
        type="number"
        placeholder="Repeat times"
        kind="full"
        size="small"
        value={currentLoop ?? ""}
        onChange={(e) => {
          loopSetter(Number(e.target.value))
        }}
      />
    </div>
  )
}

const IDAndLocationSetter = ({
  helpText,
  label,
  paramSetter,
  currentState,
}: {
  label: string
  helpText: string
  paramSetter: (id: string, x: number | null, y: number | null, loop: number | null) => void
  currentState: { id: string; x: number | null; y: number | null; loop: number | null }
}) => {
  const [state, setState] = useState({
    id: currentState?.id || "",
    x: currentState?.x || null,
    y: currentState?.y || null,
    loop: currentState?.loop || null,
  })

  return (
    <div>
      <p style={{ fontSize: "14px", fontWeight: "500" }}>{helpText}</p>
      <div className="step-edit-input">
        <Field
          label={label}
          placeholder={label}
          value={state.id}
          kind="full"
          size="small"
          onChange={(e) => {
            setState({ ...state, id: e.target.value })
            paramSetter(e.target.value, state.x, state.y, state.loop)
          }}
        />
      </div>
      <CoordsSetter
        currentCoords={{ x: state.x, y: state.y }}
        coordsSetter={(x, y) => {
          setState({ ...state, x, y })
          paramSetter(state.id, x, y, state.loop)
        }}
      />
      <Loop
        loopSetter={(loop) => {
          setState({ ...state, loop })
          paramSetter(state.id, state.x, state.y, loop)
        }}
        currentLoop={state.loop}
      />
    </div>
  )
}

function taskParametersAreValid<P extends { [key: string]: any }>(data: P) {
  if (data != undefined) {
    const keys = Object.keys(data)
    return keys.every((key) => Boolean(data[key]))
  }

  return false
}
