import assert from 'assert'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import ja from '~/locales/ja'
import TaskListComponent from '~/components/organisms/TaskListComponent.vue'
import { Task } from '~/models/task'
import { datetime, truncate } from '~/lib/filters'

Vue.use(Vuetify)
const localVue = createLocalVue()
localVue.use(VueI18n)
const messages = { ja }
const i18n = new VueI18n({ locale: 'ja', fallbackLocale: 'ja', messages })
localVue.filter('datetime', datetime)
localVue.filter('truncate', truncate)

describe('TaskListComponent', () => {
  test('renders', () => {
    const wrapper = shallowMount(TaskListComponent, {
      i18n,
      localVue
    })
    assert.strictEqual(wrapper.isVisible(), true)
  })

  describe('methods', () => {
    const tasksStore = {
      deleteTask: jest.fn(),
      deleted: true
    }
    const toast = {
      success: jest.fn(),
      error: jest.fn()
    }
    const log = {
      error: jest.fn()
    }
    const router = {
      push: jest.fn()
    }
    const wrapper = shallowMount(TaskListComponent, {
      i18n,
      localVue,
      mocks: {
        tasksStore,
        $toast: toast,
        $log: log,
        $router: router
      }
    })
    const vm = wrapper.vm as any

    test('showTask', async () => {
      const task = new Task()
      await vm.showTask(task)
      expect(router.push).toHaveBeenCalledWith(`/tasks/${task.id}`)
    })

    test('editTask', async () => {
      const task = new Task()
      await vm.editTask(task)
      expect(router.push).toHaveBeenCalledWith(`/tasks/${task.id}/edit`)
    })

    describe('deleteTask', () => {
      const task = new Task()

      describe('when deleted is true', () => {
        beforeEach(() => {
          tasksStore.deleted = true
        })

        test('called toast.success', async () => {
          window.confirm = jest.fn().mockImplementation(() => true)
          await vm.deleteTask(task)
          expect(tasksStore.deleteTask).toHaveBeenCalled()
          expect(toast.success).toHaveBeenCalled()
        })
      })

      describe('when deleted is false', () => {
        beforeEach(() => {
          tasksStore.deleted = false
        })

        test('called toast.error', async () => {
          window.confirm = jest.fn().mockImplementation(() => true)
          await vm.deleteTask(task)
          expect(tasksStore.deleteTask).toHaveBeenCalled()
          expect(toast.error).toHaveBeenCalled()
        })
      })
    })
  })
})
