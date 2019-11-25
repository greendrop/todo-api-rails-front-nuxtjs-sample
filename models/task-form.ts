export interface ITaskForm {
  title: string
  description: string | null
  done: boolean
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
}
