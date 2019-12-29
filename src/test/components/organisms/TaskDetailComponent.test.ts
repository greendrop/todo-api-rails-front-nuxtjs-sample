import assert from 'assert'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import ja from '~/locales/ja'
import TaskDetailComponent from '~/components/organisms/TaskDetailComponent.vue'
import { Task } from '~/models/task'
import { datetime } from '~/lib/filters'

Vue.use(Vuetify)
const localVue = createLocalVue()
localVue.use(VueI18n)
const messages = { ja }
const i18n = new VueI18n({ locale: 'ja', fallbackLocale: 'ja', messages })
localVue.filter('datetime', datetime)

describe('TaskDetailComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders', () => {
    const wrapper = shallowMount(TaskDetailComponent, {
      i18n,
      localVue,
      propsData: {
        task: new Task()
      }
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
    const task = new Task()
    const wrapper = shallowMount(TaskDetailComponent, {
      i18n,
      localVue,
      propsData: {
        task
      },
      mocks: {
        tasksStore,
        $toast: toast,
        $log: log,
        $router: router
      }
    })

    describe('deleteTask', () => {
      describe('when deleted is true', () => {
        beforeEach(() => {
          tasksStore.deleted = true
        })

        test('called router.push', async () => {
          window.confirm = jest.fn().mockImplementation(() => true)
          const vm = wrapper.vm as any
          await vm.deleteTask(task)
          expect(tasksStore.deleteTask).toHaveBeenCalled()
          expect(router.push).toHaveBeenCalled()
        })
      })

      describe('when deleted is false', () => {
        beforeEach(() => {
          tasksStore.deleted = false
        })

        test('called toast.error', async () => {
          window.confirm = jest.fn().mockImplementation(() => true)
          const vm = wrapper.vm as any
          await vm.deleteTask(task)
          expect(tasksStore.deleteTask).toHaveBeenCalled()
          expect(toast.error).toHaveBeenCalled()
        })
      })
    })
  })
})
