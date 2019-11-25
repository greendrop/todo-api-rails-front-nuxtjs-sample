import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { AxiosError } from 'axios'
import { ITask, Task } from '~/models/task'
import { ITaskForm } from '~/models/task-form'
import { IPaginateMeta, PaginateMeta } from '~/models/paginate-meta'
import TaskRepository from '~/repositories/task-repository'

@Module({
  name: 'tasks',
  stateFactory: true,
  namespaced: true
})
export default class Tasks extends VuexModule {
  tasks: ITask[] = []
  tasksMeta: IPaginateMeta = new PaginateMeta()
  task: ITask | null = null
  got: boolean = false
  created: boolean = false
  updated: boolean = false
  deleted: boolean = false
  errorStatus: number | null = null
  errorData: string | null = null

  @Mutation
  setTasks(tasks: ITask[]) {
    this.tasks = tasks
  }

  @Mutation
  setTasksMeta(tasksMeta: IPaginateMeta) {
    this.tasksMeta = tasksMeta
  }

  @Mutation
  setTask(task: ITask | null) {
    this.task = task
  }

  @Mutation
  setGot(got: boolean) {
    this.got = got
  }

  @Mutation
  setCreated(created: boolean) {
    this.created = created
  }

  @Mutation
  setUpdated(updated: boolean) {
    this.updated = updated
  }

  @Mutation
  setDeleted(deleted: boolean) {
    this.deleted = deleted
  }

  @Mutation
  setErrorStatus(errorStatus: number | null) {
    this.errorStatus = errorStatus
  }

  @Mutation
  setErrorData(errorData: string | null) {
    this.errorData = errorData
  }

  @Action
  async getTasks({ params = {} }: { params: { [key: string]: any } }) {
    await TaskRepository.getList(params)
      .then(response => {
        const tasks: ITask[] = response.data.map(data => new Task(data))
        const tasksMeta: IPaginateMeta = new PaginateMeta({
          totalCount: Number(response.headers.totalCount),
          perPage: Number(params.perPage) || 25,
          currentPage: Number(params.page) || 1
        })
        this.context.commit('setTasks', tasks)
        this.context.commit('setTasksMeta', tasksMeta)
        this.context.commit('setGot', true)
        this.context.commit('setErrorStatus', null)
        this.context.commit('setErrorData', null)
      })
      .catch((error: AxiosError) => {
        const tasks: ITask[] = []
        const tasksMeta: IPaginateMeta = new PaginateMeta()
        this.context.commit('setTasks', tasks)
        this.context.commit('setTasksMeta', tasksMeta)
        this.context.commit('setGot', false)
        this.context.commit(
          'setErrorStatus',
          error.response ? error.response.status : null
        )
        this.context.commit(
          'setErrorData',
          error.response ? error.response.data : null
        )
      })
  }

  @Action
  async getTaskById({ id }: { id: number }) {
    await TaskRepository.get(id)
      .then(response => {
        const task = new Task(response.data)
        this.context.commit('setTask', task)
        this.context.commit('setGot', true)
        this.context.commit('setErrorStatus', null)
        this.context.commit('setErrorData', null)
      })
      .catch((error: AxiosError) => {
        this.context.commit('setTask', null)
        this.context.commit('setGot', false)
        this.context.commit(
          'setErrorStatus',
          error.response ? error.response.status : null
        )
        this.context.commit(
          'setErrorData',
          error.response ? error.response.data : null
        )
      })
  }

  @Action
  async createTask({ taskForm }: { taskForm: ITaskForm }) {
    await TaskRepository.create(taskForm)
      .then(response => {
        this.context.commit('setTask', response.data)
        this.context.commit('setCreated', true)
        this.context.commit('setErrorStatus', null)
        this.context.commit('setErrorData', null)
      })
      .catch((error: AxiosError) => {
        this.context.commit('setCompleted', false)
        this.context.commit(
          'setErrorStatus',
          error.response ? error.response.status : null
        )
        this.context.commit(
          'setErrorData',
          error.response ? error.response.data : null
        )
      })
  }

  @Action
  async updateTask({ id, taskForm }: { id: number; taskForm: ITaskForm }) {
    await TaskRepository.update(id, taskForm)
      .then(_response => {
        this.context.commit('setUpdated', true)
        this.context.commit('setErrorStatus', null)
        this.context.commit('setErrorData', null)
      })
      .catch((error: AxiosError) => {
        this.context.commit('setUpdated', false)
        this.context.commit(
          'setErrorStatus',
          error.response ? error.response.status : null
        )
        this.context.commit(
          'setErrorData',
          error.response ? error.response.data : null
        )
      })
  }

  @Action
  async deleteTask({ id }: { id: number }) {
    await TaskRepository.delete(id)
      .then(_response => {
        this.context.commit('setDeleted', true)
        this.context.commit('setErrorStatus', null)
        this.context.commit('setErrorData', null)
      })
      .catch((error: AxiosError) => {
        this.context.commit('setDeleted', false)
        this.context.commit(
          'setErrorStatus',
          error.response ? error.response.status : null
        )
        this.context.commit(
          'setErrorData',
          error.response ? error.response.data : null
        )
      })
  }
}
