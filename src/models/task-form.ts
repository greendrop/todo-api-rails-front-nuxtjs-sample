import _ from 'lodash'

export interface ITaskForm {
  title: string
  description: string | null
  done: boolean
  equals(taskForm: ITaskForm): boolean
  clone(): ITaskForm
}

export class TaskForm implements ITaskForm {
  title: string = ''
  description: string | null = null
  done: boolean = false

  constructor(init?: Partial<TaskForm>) {
    if (init) {
      Object.assign(this, init)
    }
  }

  equals(taskForm: ITaskForm): boolean {
    return _.isEqual(this, taskForm)
  }

  clone(): ITaskForm {
    return _.cloneDeep(this)
  }
}
