import { AxiosResponse } from 'axios'
import Repository from '~/repositories/repository'
import { ITask } from '~/models/task'
import { ITaskForm } from '~/models/task-form'

const repository = Repository
const baseUrl = '/api/v1/tasks'

export { repository as Repository }

export default {
  getList(params: any): Promise<AxiosResponse<Array<ITask>>> {
    const url = baseUrl
    return repository.get(url, { params })
  },
  get(id: number): Promise<AxiosResponse<ITask>> {
    const url = `${baseUrl}/${id}`
    return repository.get(url)
  },
  create(taskForm: ITaskForm): Promise<AxiosResponse<ITask>> {
    const url = baseUrl
    return repository.post(url, { task: taskForm })
  },
  update(id: number, taskForm: ITaskForm): Promise<AxiosResponse<ITask>> {
    const url = `${baseUrl}/${id}`
    return repository.put(url, { task: taskForm })
  },
  delete(id: number): Promise<AxiosResponse<ITask>> {
    const url = `${baseUrl}/${id}`
    return repository.delete(url)
  }
}
