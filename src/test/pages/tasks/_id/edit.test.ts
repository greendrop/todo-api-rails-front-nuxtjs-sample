import assert from 'assert'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import ja from '~/locales/ja'
import Edit from '~/pages/tasks/_id/edit.vue'
import { Task } from '~/models/task'

Vue.use(Vuetify)
const localVue = createLocalVue()
localVue.use(VueI18n)
const messages = { ja }
const i18n = new VueI18n({ locale: 'ja', fallbackLocale: 'ja', messages })

describe('Edit', () => {
  test('renders', () => {
    const task = new Task()
    const route = {
      params: {
        id: task.id
      }
    }
    const wrapper = shallowMount(Edit, {
      i18n,
      localVue,
      mocks: {
        task,
        $route: route
      }
    })
    assert.strictEqual(wrapper.isVisible(), true)
  })

  describe('methods', () => {
    const tasksStore = {
      getTaskById: jest.fn(),
      got: true,
      task: new Task({ id: 1 })
    }
    const toast = {
      success: jest.fn(),
      error: jest.fn()
    }
    const log = {
      error: jest.fn()
    }
    const route = {
      params: {
        id: 1
      }
    }
    const router = {
      push: jest.fn()
    }
    const wrapper = shallowMount(Edit, {
      i18n,
      localVue,
      mocks: {
        tasksStore,
        $toast: toast,
        $log: log,
        $route: route,
        $router: router
      }
    })
    const vm = wrapper.vm as any

    describe('asyncData', () => {
      const context = {
        route
      }

      describe('when process.client is true', () => {
        beforeEach(() => {
          process.client = true
        })

        test('returns requestGetTask', async () => {
          const data = await vm.$options.asyncData(context, {
            tasksStore
          })
          assert.strictEqual(data.requestGetTask, true)
        })
      })

      describe('when process.client is false', () => {
        beforeEach(() => {
          process.client = false
        })

        test('returns task', async () => {
          const data = await vm.$options.asyncData(context, {
            tasksStore
          })
          expect(tasksStore.getTaskById).toHaveBeenCalledWith({
            id: route.params.id
          })
          assert.deepStrictEqual(data.task, tasksStore.task)
        })
      })
    })

    describe('getTask', () => {
      describe('when got is true', () => {
        beforeEach(() => {
          tasksStore.got = true
        })

        test('not call toast.error', async () => {
          await vm.getTask()
          expect(tasksStore.getTaskById).toHaveBeenCalledWith({ id: 1 })
          expect(toast.error).not.toHaveBeenCalled()
        })
      })

      describe('when got is false', () => {
        beforeEach(() => {
          tasksStore.got = false
        })

        test('throw error', async () => {
          await expect(vm.getTask()).rejects.toThrow()
        })
      })
    })
  })
})
