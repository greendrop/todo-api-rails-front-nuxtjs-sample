import qs from 'qs'
import changeCaseObject from '~/lib/change-case-object'

export const state = () => ({
  tasks: [],
  tasksMeta: {
    currentPage: 0,
    perPage: 0,
    totalCount: 0
  },
  task: null,
  createCompleted: false,
  updateCompleted: false,
  deleteCompleted: false
})

export const actions = {
  async getTasks({ state, commit }, { accessToken, params = {} }) {
    const url = `${process.env.API_URL}/api/v1/tasks`
    const response = await this.$axios
      .get(url, {
        headers: { Authorization: accessToken },
        params: changeCaseObject.snakeCase(params),
        paramsSerializer: function(params) {
          return qs.stringify(params, { arrayFormat: 'brackets' })
        }
      })
      .then(response => {
        return {
          tasks: changeCaseObject.camelCase(response.data),
          tasksMeta: {
            totalCount: Number(response.headers['total-count']),
            perPage: Number(params['perPage']) || 25,
            currentPage: Number(params['page']) || 1
          }
        }
      })
      .catch(() => {
        return {
          tasks: state.tasks
        }
      })
    commit('setTasks', response.tasks)
    commit('setTasksMeta', response.tasksMeta)
  },
  async getTaskById({ commit }, { accessToken, id }) {
    const url = `${process.env.API_URL}/api/v1/tasks/${id}`
    const response = await this.$axios
      .get(url, { headers: { Authorization: accessToken } })
      .then(response => {
        return {
          task: changeCaseObject.camelCase(response.data)
        }
      })
      .catch(() => {
        return {
          task: null
        }
      })
    commit('setTask', response.task)
  },
  async createTask({ commit }, { accessToken, task }) {
    const url = `${process.env.API_URL}/api/v1/tasks`
    const params = changeCaseObject.snakeCase({ ...task })
    await this.$axios
      .post(url, params, { headers: { Authorization: accessToken } })
      .then(() => {
        commit('setCreateCompleted', true)
      })
      .catch(() => {
        commit('setCreateCompleted', false)
      })
  },
  async updateTask({ commit }, { accessToken, id, task }) {
    const url = `${process.env.API_URL}/api/v1/tasks/${id}`
    const params = changeCaseObject.snakeCase({
      title: task.title,
      description: task.description,
      done: task.done
    })
    await this.$axios
      .put(url, params, { headers: { Authorization: accessToken } })
      .then(() => {
        commit('setUpdateCompleted', true)
      })
      .catch(() => {
        commit('setUpdateCompleted', false)
      })
  },
  async deleteTask({ commit }, { accessToken, id }) {
    const url = `${process.env.API_URL}/api/v1/tasks/${id}`
    await this.$axios
      .delete(url, { headers: { Authorization: accessToken } })
      .then(() => {
        commit('setDeleteCompleted', true)
      })
      .catch(() => {
        commit('setDeleteCompleted', false)
      })
  }
}

export const mutations = {
  setTasks(state, data) {
    state.tasks = data
  },
  setTasksMeta(state, data) {
    state.tasksMeta = data
  },
  setTask(state, data) {
    state.task = data
  },
  setCreateCompleted(state, data) {
    state.createCompleted = data
  },
  setUpdateCompleted(state, data) {
    state.updateCompleted = data
  },
  setDeleteCompleted(state, data) {
    state.deleteCompleted = data
  }
}

export const getters = {
  tasks(state) {
    return state.tasks
  },
  tasksMeta(state) {
    return state.tasksMeta
  },
  task(state) {
    return state.task
  },
  createCompleted(state) {
    return state.createCompleted
  },
  updateCompleted(state) {
    return state.updateCompleted
  },
  deleteCompleted(state) {
    return state.deleteCompleted
  }
}
