import assert from 'assert'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import ja from '~/locales/ja'
import TaskEditComponent from '~/components/organisms/TaskEditComponent.vue'
import { Task } from '~/models/task'

Vue.use(Vuetify)
const localVue = createLocalVue()
localVue.use(VueI18n)
const messages = { ja }
const i18n = new VueI18n({ locale: 'ja', fallbackLocale: 'ja', messages })

describe('TaskEditComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders', () => {
    const wrapper = shallowMount(TaskEditComponent, {
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
      updateTask: jest.fn(),
      updated: true
    }
    const validator = {
      validateAll: () => {
        return new Promise(resolve => {
          resolve(true)
        })
      }
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
    const wrapper = shallowMount(TaskEditComponent, {
      i18n,
      localVue,
      propsData: {
        task
      },
      mocks: {
        tasksStore,
        $toast: toast,
        $validator: validator,
        $log: log,
        $router: router
      }
    })

    describe('submit', () => {
      describe('when updated is true', () => {
        beforeEach(() => {
          tasksStore.updated = true
        })

        test('called router.push', async () => {
          window.confirm = jest.fn().mockImplementation(() => true)
          const vm = wrapper.vm as any
          await vm.submit()
          expect(tasksStore.updateTask).toHaveBeenCalled()
          expect(router.push).toHaveBeenCalled()
        })
      })

      describe('when updated is false', () => {
        beforeEach(() => {
          tasksStore.updated = false
        })

        test('called toast.error', async () => {
          window.confirm = jest.fn().mockImplementation(() => true)
          const vm = wrapper.vm as any
          await vm.submit()
          expect(tasksStore.updateTask).toHaveBeenCalled()
          expect(toast.error).toHaveBeenCalled()
        })
      })
    })
  })
})
