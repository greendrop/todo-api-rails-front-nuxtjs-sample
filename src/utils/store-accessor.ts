import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Tasks from '~/store/tasks'

/* eslint-disable import/no-mutable-exports */
let TasksStore: Tasks
/* eslint-enable import/no-mutable-exports */

function initialiseStores(store: Store<any>): void {
  TasksStore = getModule(Tasks, store)
}

export { initialiseStores, TasksStore }
