<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12 sm12 md12)
      v-layout(row wrap)
        v-flex(xs12 sm12 md12 mb-1)
          v-breadcrumbs(:items="breadcrumbItems")

    v-flex(xs12 sm12 md12)
      v-layout(row wrap)
        v-flex(xs12 sm12 md12 mb-1)
          .headline
            | {{ $t('labels.listModel', { model: $t('models.task') }) }}

    v-flex(xs12 sm12 md12)
      v-layout(row wrap)
        v-flex(xs12 sm12 md12 mb-1)
          .text-xs-right
            v-btn(to="/tasks/new")
              v-icon.mr-1(small)
                | fas fa-plus
              | {{ $t('labels.new') }}

        task-list-component(
          :tasks="tasks"
          :tasksTotalCount="tasksTotalCount"
          :tasksLoading="tasksLoading"
          :query="query"
          :pagination.sync="pagination"
          @getTasks="getTasks"
        )
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import qs from 'qs'
import camelcaseKeys from 'camelcase-keys'
import { ITask } from '~/models/task'
import {
  IVDataTablePagination,
  VDataTablePagination
} from '~/models/v-data-table-pagination'
import { TasksStore } from '~/store'
import TaskListComponent from '~/components/organisms/TaskListComponent.vue'

@Component({
  components: { TaskListComponent },
  middleware: 'auth',
  async asyncData(context: Context, options = {}) {
    const tasksStore = options.tasksStore || TasksStore
    const data = {
      tasks: [] as ITask[],
      tasksTotalCount: 0,
      tasksLoading: false,
      query: {} as { [key: string]: any },
      pagination: new VDataTablePagination(),
      requestGetTasks: false
    }
    if (context.route.params.page) {
      data.pagination.page = parseInt(context.route.params.page)
    }
    if (context.route.params.per_page) {
      data.pagination.rowsPerPage = parseInt(context.route.params.per_page)
    }
    if (context.route.params.q) {
      const query: { [key: string]: any } = camelcaseKeys(
        qs.parse(context.route.params.q),
        { deep: true }
      )
      const s: string = data.query.s
      data.query = query
      if (s) {
        data.pagination.sortBy = s.split(' ')[0]
        if (s.split(' ')[1] === 'desc') {
          data.pagination.descending = true
        }
      }
    }
    if (process.client) {
      data.requestGetTasks = true
    } else {
      const { sortBy, descending, page, rowsPerPage } = data.pagination
      const params: { [key: string]: any } = { page, perPage: rowsPerPage }
      params.q = data.query
      if (sortBy) {
        params.q.s = `${sortBy} ${descending ? 'desc' : 'asc'}`
      }
      await tasksStore.getTasks({ params })
      data.tasks = tasksStore.tasks
      const tasksMeta = tasksStore.tasksMeta
      data.tasksTotalCount = tasksMeta.totalCount
    }
    return data
  }
})
export default class Index extends Vue {
  tasksStore = TasksStore
  tasks: ITask[] = []
  tasksTotalCount = 0
  tasksLoading = false
  query: { [key: string]: any } = {}
  pagination: IVDataTablePagination = new VDataTablePagination()
  requestGetTasks = false

  mounted() {
    if (this.requestGetTasks) {
      this.getTasks()
    }
  }

  get breadcrumbItems(): { [key: string]: any }[] {
    return [
      {
        text: this.$i18n.t('labels.home'),
        to: '/',
        exact: true,
        disabled: false
      },
      {
        text: this.$i18n.t('labels.listModel', {
          model: this.$i18n.t('models.task')
        }),
        to: '/tasks',
        exact: true,
        disabled: true
      }
    ]
  }

  async getTasks() {
    this.tasksLoading = true
    const { sortBy, descending, page, rowsPerPage } = this.pagination
    const params: { [key: string]: any } = { page, perPage: rowsPerPage }
    params.q = this.query
    if (sortBy) {
      params.q.s = `${sortBy} ${descending ? 'desc' : 'asc'}`
    }
    await this.tasksStore.getTasks({ params })

    if (!this.tasksStore.got) {
      const message = this.$t('messages.errorOccurred').toString()
      this.$toast.error(message)
      this.$log.error(this.tasksStore.errorStatus)
      this.$log.error(this.tasksStore.errorData)
    }

    this.tasks = this.tasksStore.tasks
    const tasksMeta = this.tasksStore.tasksMeta
    this.tasksTotalCount = tasksMeta.totalCount
    this.tasksLoading = false
  }
}
</script>
