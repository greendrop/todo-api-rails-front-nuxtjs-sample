import { ITaskForm, TaskForm } from './task-form'

export interface ITask {
  id: number
  title: string
  description: string | null
  done: boolean
  createdAt: string
  updatedAt: string
  toTaskForm(): ITaskForm
}

export class Task implements ITask {
  id: number = 0
  title: string = ''
  description: string | null = null
  done: boolean = false
  createdAt: string = ''
  updatedAt: string = ''

  constructor(init?: Partial<Task>) {
    if (init) {
      Object.assign(this, init)
    }
  }

  toTaskForm(): ITaskForm {
    return new TaskForm({
      title: this.title,
      description: this.description,
      done: this.done
    })
  }
}
