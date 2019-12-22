import assert from 'assert'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { getModule } from 'vuex-module-decorators'
import { AxiosResponse } from 'axios'
import Tasks, { TaskRepository } from '~/store/tasks'
import { Task } from '~/models/task'
import { TaskForm } from '~/models/task-form'

const localVue = createLocalVue()
localVue.use(Vuex)
const store = new Vuex.Store({ modules: { tasks: Tasks } })
const tasksStore = getModule(Tasks, store)

describe('actions', () => {
  describe('getTasks', () => {
    test('success', async () => {
      const tasks = [
        {
          id: 1,
          title: 'title1',
          description: 'description1',
          done: false,
          createdAt: '2019-11-25T23:40:02.000+09:00',
          updatedAt: '2019-11-25T23:41:02.000+09:00'
        },
        {
          id: 2,
          title: 'title2',
          description: 'description2',
          done: false,
          createdAt: '2019-11-25T23:40:02.000+09:00',
          updatedAt: '2019-11-25T23:41:02.000+09:00'
        }
      ]
      jest.spyOn(TaskRepository, 'getList').mockImplementation(() => {
        return new Promise(resolve => {
          const response = {
            data: tasks,
            headers: { totalCount: tasks.length }
          }
          resolve(response as AxiosResponse)
        })
      })

      await tasksStore.getTasks({ params: {} })
      assert.strictEqual(tasksStore.got, true)
      assert.strictEqual(tasksStore.tasks.length, tasks.length)
      tasks.forEach((task, index) => {
        assert.strictEqual(tasksStore.tasks[index].equals(new Task(task)), true)
      })
    })

    test('error', async () => {
      jest.spyOn(TaskRepository, 'getList').mockImplementation(() => {
        return new Promise((_resolve, reject) => {
          const error = { response: { status: 500, data: '' } }
          reject(error)
        })
      })

      await tasksStore.getTasks({ params: {} })
      assert.strictEqual(tasksStore.got, false)
      assert.strictEqual(tasksStore.errorStatus, 500)
      assert.strictEqual(tasksStore.errorData, '')
    })
  })

  describe('getTaskById', () => {
    test('success', async () => {
      const task = {
        id: 1,
        title: 'title1',
        description: 'description1',
        done: false,
        createdAt: '2019-11-25T23:40:02.000+09:00',
        updatedAt: '2019-11-25T23:41:02.000+09:00'
      }
      jest.spyOn(TaskRepository, 'get').mockImplementation(() => {
        return new Promise(resolve => {
          const response = { data: task }
          resolve(response as AxiosResponse)
        })
      })

      await tasksStore.getTaskById({ id: 1 })
      assert.strictEqual(tasksStore.got, true)
      if (tasksStore.task) {
        assert.strictEqual(tasksStore.task.equals(new Task(task)), true)
      }
    })

    test('error', async () => {
      jest.spyOn(TaskRepository, 'get').mockImplementation(() => {
        return new Promise((_resolve, reject) => {
          const error = { response: { status: 500, data: '' } }
          reject(error)
        })
      })

      await tasksStore.getTaskById({ id: 1 })
      assert.strictEqual(tasksStore.got, false)
      assert.strictEqual(tasksStore.errorStatus, 500)
      assert.strictEqual(tasksStore.errorData, '')
    })
  })

  describe('createTask', () => {
    test('success', async () => {
      const taskForm = new TaskForm({
        title: 'title1',
        description: 'description1',
        done: false
      })
      const task = {
        id: 1,
        title: 'title1',
        description: 'description1',
        done: false,
        createdAt: '2019-11-25T23:40:02.000+09:00',
        updatedAt: '2019-11-25T23:41:02.000+09:00'
      }
      jest.spyOn(TaskRepository, 'create').mockImplementation(() => {
        return new Promise(resolve => {
          const response = { data: task }
          resolve(response as AxiosResponse)
        })
      })

      await tasksStore.createTask({ taskForm })
      assert.strictEqual(tasksStore.created, true)
      if (tasksStore.task) {
        assert.strictEqual(tasksStore.task.equals(new Task(task)), true)
      }
    })

    test('error', async () => {
      jest.spyOn(TaskRepository, 'create').mockImplementation(() => {
        return new Promise((_resolve, reject) => {
          const error = { response: { status: 500, data: '' } }
          reject(error)
        })
      })

      await tasksStore.createTask({ taskForm: new TaskForm() })
      assert.strictEqual(tasksStore.created, false)
      assert.strictEqual(tasksStore.errorStatus, 500)
      assert.strictEqual(tasksStore.errorData, '')
    })
  })

  describe('updateTask', () => {
    test('success', async () => {
      const taskForm = new TaskForm({
        title: 'title1',
        description: 'description1',
        done: false
      })
      jest.spyOn(TaskRepository, 'update').mockImplementation(() => {
        return new Promise(resolve => {
          const response = {}
          resolve(response as AxiosResponse)
        })
      })

      await tasksStore.updateTask({ id: 1, taskForm })
      assert.strictEqual(tasksStore.updated, true)
    })

    test('error', async () => {
      jest.spyOn(TaskRepository, 'update').mockImplementation(() => {
        return new Promise((_resolve, reject) => {
          const error = { response: { status: 500, data: '' } }
          reject(error)
        })
      })

      await tasksStore.updateTask({ id: 1, taskForm: new TaskForm() })
      assert.strictEqual(tasksStore.updated, false)
      assert.strictEqual(tasksStore.errorStatus, 500)
      assert.strictEqual(tasksStore.errorData, '')
    })
  })

  describe('deleteTask', () => {
    test('success', async () => {
      jest.spyOn(TaskRepository, 'delete').mockImplementation(() => {
        return new Promise(resolve => {
          const response = {}
          resolve(response as AxiosResponse)
        })
      })

      await tasksStore.deleteTask({ id: 1 })
      assert.strictEqual(tasksStore.deleted, true)
    })

    test('error', async () => {
      jest.spyOn(TaskRepository, 'delete').mockImplementation(() => {
        return new Promise((_resolve, reject) => {
          const error = { response: { status: 500, data: '' } }
          reject(error)
        })
      })

      await tasksStore.deleteTask({ id: 1 })
      assert.strictEqual(tasksStore.deleted, false)
      assert.strictEqual(tasksStore.errorStatus, 500)
      assert.strictEqual(tasksStore.errorData, '')
    })
  })
})
