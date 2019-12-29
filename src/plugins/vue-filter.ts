import Vue from 'vue'
import { datetime, truncate } from '~/lib/filters'

Vue.filter('datetime', datetime)
Vue.filter('truncate', truncate)
