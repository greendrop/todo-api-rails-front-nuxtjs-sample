import assert from 'assert'
import { AxiosError } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import camelcaseKeys from 'camelcase-keys'
import TaskRepository, { Repository } from '~/repositories/task-repository'
import { TaskForm } from '~/models/task-form'

describe('getList', () => {
  test('success', async () => {
    const url = '/api/v1/tasks'
    const tasks = [
      {
        id: 1,
        title: 'title1',
        description: 'description1',
        done: false,
        created_at: '2019-11-25T23:40:02.000+09:00',
        updated_at: '2019-11-25T23:41:02.000+09:00'
      },
      {
        id: 2,
        title: 'title2',
        description: 'description2',
        done: true,
        created_at: '2019-11-25T23:40:02.000+09:00',
        updated_at: '2019-11-25T23:41:02.000+09:00'
      }
    ]
    const mockAdapter = new MockAdapter(Repository)
    mockAdapter.onGet(url).reply(200, tasks)
    await TaskRepository.getList({})
      .then(response => {
        assert.strictEqual(response.status, 200)
        assert.deepStrictEqual(
          response.data,
          camelcaseKeys(tasks, { deep: true })
        )
      })
      .catch((_error: AxiosError) => {
        throw new Error('failed')
      })
  })

  test('error', async () => {
    const url = '/api/v1/tasks'
    const mockAdapter = new MockAdapter(Repository)
    mockAdapter.onGet(url).reply(500, '')
    await TaskRepository.getList({})
      .then(_response => {
        throw new Error('failed')
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          assert.strictEqual(error.response.status, 500)
        }
      })
  })
})

describe('get', () => {
  test('success', async () => {
    const url = '/api/v1/tasks/1'
    const task = {
      id: 1,
      title: 'title1',
      description: 'description1',
      done: false,
      created_at: '2019-11-25T23:40:02.000+09:00',
      updated_at: '2019-11-25T23:41:02.000+09:00'
    }
    const mockAdapter = new MockAdapter(Repository)
    mockAdapter.onGet(url).reply(200, task)
    await TaskRepository.get(1)
      .then(response => {
        assert.strictEqual(response.status, 200)
        assert.deepStrictEqual(
          response.data,
          camelcaseKeys(task, { deep: true })
        )
      })
      .catch((_error: AxiosError) => {
        throw new Error('failed')
      })
  })

  test('error', async () => {
    const url = '/api/v1/tasks/1'
    const mockAdapter = new MockAdapter(Repository)
    mockAdapter.onGet(url).reply(500, '')
    await TaskRepository.get(1)
      .then(_response => {
        throw new Error('failed')
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          assert.strictEqual(error.response.status, 500)
        }
      })
  })
})

describe('create', () => {
  test('success', async () => {
    const url = '/api/v1/tasks'
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
      created_at: '2019-11-25T23:40:02.000+09:00',
      updated_at: '2019-11-25T23:41:02.000+09:00'
    }
    const mockAdapter = new MockAdapter(Repository)
    mockAdapter.onPost(url).reply(201, task)
    await TaskRepository.create(taskForm)
      .then(response => {
        assert.strictEqual(response.status, 201)
        assert.deepStrictEqual(
          response.data,
          camelcaseKeys(task, { deep: true })
        )
      })
      .catch((_error: AxiosError) => {
        throw new Error('failed')
      })
  })

  test('error', async () => {
    const url = '/api/v1/tasks'
    const mockAdapter = new MockAdapter(Repository)
    mockAdapter.onPost(url).reply(500, '')
    await TaskRepository.create(new TaskForm())
      .then(_response => {
        throw new Error('failed')
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          assert.deepStrictEqual(error.response.status, 500)
        }
      })
  })
})

describe('update', () => {
  test('success', async () => {
    const url = '/api/v1/tasks/1'
    const taskForm = new TaskForm({
      title: 'title1',
      description: 'description1',
      done: false
    })
    const mockAdapter = new MockAdapter(Repository)
    mockAdapter.onPut(url).reply(204, '')
    await TaskRepository.update(1, taskForm)
      .then(response => {
        assert.strictEqual(response.status, 204)
      })
      .catch((_error: AxiosError) => {
        throw new Error('failed')
      })
  })

  test('error', async () => {
    const url = '/api/v1/tasks/1'
    const mockAdapter = new MockAdapter(Repository)
    mockAdapter.onPut(url).reply(500, '')
    await TaskRepository.update(1, new TaskForm())
      .then(_response => {
        throw new Error('failed')
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          assert.strictEqual(error.response.status, 500)
        }
      })
  })
})

describe('delete', () => {
  test('success', async () => {
    const url = '/api/v1/tasks/1'
    const mockAdapter = new MockAdapter(Repository)
    mockAdapter.onDelete(url).reply(204, '')
    await TaskRepository.delete(1)
      .then(response => {
        assert.strictEqual(response.status, 204)
      })
      .catch((_error: AxiosError) => {
        throw new Error('failed')
      })
  })

  test('error', async () => {
    const url = '/api/v1/tasks/1'
    const mockAdapter = new MockAdapter(Repository)
    mockAdapter.onDelete(url).reply(500, '')
    await TaskRepository.delete(1)
      .then(_response => {
        throw new Error('failed')
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          assert.strictEqual(error.response.status, 500)
        }
      })
  })
})
