import assert from 'assert'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import ja from '~/locales/ja'
import { PaginateMeta } from '~/models/paginate-meta'
import Index from '~/pages/tasks/index.vue'

Vue.use(Vuetify)
const localVue = createLocalVue()
localVue.use(VueI18n)
const messages = { ja }
const i18n = new VueI18n({ locale: 'ja', fallbackLocale: 'ja', messages })

describe('Index', () => {
  test('renders', () => {
    const wrapper = shallowMount(Index, {
      i18n,
      localVue
    })
    assert.strictEqual(wrapper.isVisible(), true)
  })

  describe('methods', () => {
    const tasksStore = {
      getTasks: jest.fn(),
      tasksMeta: new PaginateMeta(),
      totalCount: 0,
      got: true,
      tasks: []
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
    const nuxt = {
      error: jest.fn()
    }
    const wrapper = shallowMount(Index, {
      i18n,
      localVue,
      mocks: {
        tasksStore,
        $toast: toast,
        $log: log,
        $router: router,
        $nuxt: nuxt
      }
    })
    const vm = wrapper.vm as any

    describe('asyncData', () => {
      const context = {
        route: { params: {} },
        app: {
          $nuxt: nuxt
        }
      }

      describe('when process.client is true', () => {
        beforeEach(() => {
          process.client = true
        })

        test('returns requestGetTasks', async () => {
          const data = await vm.$options.asyncData(context, {
            tasksStore
          })
          assert.strictEqual(data.requestGetTasks, true)
        })
      })

      describe('when process.client is false', () => {
        beforeEach(() => {
          process.client = false
        })

        test('returns tasks', async () => {
          const data = await vm.$options.asyncData(context, {
            tasksStore
          })
          expect(tasksStore.getTasks).toHaveBeenCalled()
          assert.deepStrictEqual(data.tasks, tasksStore.tasks)
        })
      })
    })

    describe('getTasks', () => {
      describe('when got is true', () => {
        beforeEach(() => {
          tasksStore.got = true
        })

        test('not call $nuxt.error', async () => {
          await vm.getTasks()
          expect(tasksStore.getTasks).toHaveBeenCalled()
          expect(nuxt.error).not.toHaveBeenCalled()
        })
      })

      describe('when got is false', () => {
        beforeEach(() => {
          tasksStore.got = false
        })

        test('called $nuxt.error', async () => {
          await vm.getTasks()
          expect(tasksStore.getTasks).toHaveBeenCalled()
          expect(nuxt.error).toHaveBeenCalled()
        })
      })
    })
  })
})
