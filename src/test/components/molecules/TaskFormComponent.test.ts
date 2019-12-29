import assert from 'assert'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate from 'vee-validate'
import VueI18n from 'vue-i18n'
import ja from '~/locales/ja'
import TaskFormComponent from '~/components/molecules/TaskFormComponent.vue'
import { TaskForm } from '~/models/task-form'

Vue.use(Vuetify)
const localVue = createLocalVue()
localVue.use(VeeValidate)
localVue.use(VueI18n)
const messages = { ja }
const i18n = new VueI18n({ locale: 'ja', fallbackLocale: 'ja', messages })

describe('TaskFormComponent', () => {
  test('renders', () => {
    const wrapper = shallowMount(TaskFormComponent, {
      i18n,
      localVue,
      sync: false,
      propsData: {
        taskForm: new TaskForm()
      }
    })
    assert.strictEqual(wrapper.isVisible(), true)
  })
})
