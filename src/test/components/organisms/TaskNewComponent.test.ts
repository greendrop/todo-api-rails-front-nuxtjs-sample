import assert from 'assert'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import ja from '~/locales/ja'
import TaskNewComponent from '~/components/organisms/TaskNewComponent.vue'
import { Task } from '~/models/task'

Vue.use(Vuetify)
const localVue = createLocalVue()
localVue.use(VueI18n)
const messages = { ja }
const i18n = new VueI18n({ locale: 'ja', fallbackLocale: 'ja', messages })

describe('TaskNewComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders', () => {
    const wrapper = shallowMount(TaskNewComponent, {
      i18n,
      localVue
    })
    assert.strictEqual(wrapper.isVisible(), true)
  })

  describe('methods', () => {
    const tasksStore = {
      createTask: jest.fn(),
      created: true,
      task: new Task()
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
    const router = {
      push: jest.fn()
    }
    const log = {
      error: jest.fn()
    }
    const wrapper = shallowMount(TaskNewComponent, {
      i18n,
      localVue,
      mocks: {
        tasksStore,
        $toast: toast,
        $validator: validator,
        $log: log,
        $router: router
      }
    })

    describe('submit', () => {
      describe('when created is true', () => {
        beforeEach(() => {
          tasksStore.created = true
        })

        test('called router.push', async () => {
          const vm = wrapper.vm as any
          await vm.submit()
          expect(tasksStore.createTask).toHaveBeenCalled()
          expect(router.push).toHaveBeenCalled()
        })
      })

      describe('when created is false', () => {
        beforeEach(() => {
          tasksStore.created = false
        })

        test('called toast.error', async () => {
          const vm = wrapper.vm as any
          await vm.submit()
          expect(tasksStore.createTask).toHaveBeenCalled()
          expect(toast.error).toHaveBeenCalled()
        })
      })
    })
  })
})
