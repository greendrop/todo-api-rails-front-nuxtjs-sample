import { AxiosResponse } from 'axios'
import Repository from '~/repositories/repository'
import { ITask } from '~/models/task'
import { ITaskForm } from '~/models/task-form'

const baseUrl = '/api/v1/tasks'

export default {
  getList(params: any): Promise<AxiosResponse<Array<ITask>>> {
    const url = baseUrl
    return Repository.get(url, { params })
  },
  get(id: number): Promise<AxiosResponse<ITask>> {
    const url = `${baseUrl}/${id}`
    return Repository.get(url)
  },
  create(taskForm: ITaskForm): Promise<AxiosResponse<ITask>> {
    const url = baseUrl
    return Repository.post(url, { task: taskForm })
  },
  update(id: number, taskForm: ITaskForm): Promise<AxiosResponse<ITask>> {
    const url = `${baseUrl}/${id}`
    return Repository.put(url, { task: taskForm })
  },
  delete(id: number): Promise<AxiosResponse<ITask>> {
    const url = `${baseUrl}/${id}`
    return Repository.delete(url)
  }
}
