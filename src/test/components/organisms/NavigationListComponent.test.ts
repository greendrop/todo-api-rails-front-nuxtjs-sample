import assert from 'assert'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import ja from '~/locales/ja'
import NavigationListComponent from '~/components/organisms/NavigationListComponent.vue'

Vue.use(Vuetify)
const localVue = createLocalVue()
localVue.use(VueI18n)
const messages = { ja }
const i18n = new VueI18n({ locale: 'ja', fallbackLocale: 'ja', messages })

describe('NavigationListComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders', () => {
    const wrapper = shallowMount(NavigationListComponent, {
      i18n,
      localVue,
      stubs: {
        'client-only': true
      },
      mocks: {
        $auth: {
          loggedIn: true
        }
      }
    })
    assert.strictEqual(wrapper.isVisible(), true)
  })

  describe('methods', () => {
    const auth = {
      loginWith: jest.fn(),
      logout: jest.fn().mockImplementation(() => {
        return new Promise(resolve => {
          resolve(true)
        })
      }),
      loggedIn: true
    }
    const toast = {
      success: jest.fn(),
      error: jest.fn()
    }
    const wrapper = shallowMount(NavigationListComponent, {
      i18n,
      localVue,
      stubs: {
        'client-only': true
      },
      mocks: {
        $auth: auth,
        $toast: toast
      }
    })
    const vm = wrapper.vm as any

    test('signIn', async () => {
      await vm.signIn()
      expect(auth.loginWith).toHaveBeenCalled()
    })

    test('signOut', async () => {
      await vm.signOut()
      expect(auth.logout).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalled()
    })
  })
})
