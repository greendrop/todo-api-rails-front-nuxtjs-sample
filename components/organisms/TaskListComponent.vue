<template lang="pug">
  v-flex(xs12 sm12 md12)
    v-data-table(
      :headers="taskHeaders"
      :items="tasks"
      :pagination.sync="pagination"
      :total-items="taskTotalCount"
      :loading="taskLoading")
      template(slot="items" slot-scope="props")
        td {{ props.item.id }}
        td {{ props.item.title }}
        td {{ props.item.description | truncate }}
        td {{ props.item.done }}
        td {{ props.item.createdAt | datetime }}
        td {{ props.item.updatedAt | datetime }}
        td
          v-icon.mr-1(small @click="showTask(props.item)")
            | fas fa-chevron-down
          v-icon.mr-1(small @click="editTask(props.item)")
            | fas fa-pencil-alt
          v-icon.mr-1(
            small
            color="error"
            @click="deleteTask(props.item)")
            | fas fa-trash-alt
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import { ITask } from '~/models/task'
import { tasksStore } from '~/store'

@Component
export default class TaskListComponent extends Vue {
  taskHeaders: { [key: string]: any }[] = []
  tasks: ITask[] = []
  taskTotalCount = 0
  taskLoading = true
  pagination: { [key: string]: any } = {}

  created() {
    this.taskHeaders = [
      {
        text: this.$i18n.t('models.attributes.task.id').toString(),
        value: 'id'
      },
      {
        text: this.$i18n.t('models.attributes.task.title').toString(),
        value: 'title'
      },
      {
        text: this.$i18n.t('models.attributes.task.description').toString(),
        value: 'description'
      },
      {
        text: this.$i18n.t('models.attributes.task.done').toString(),
        value: 'done'
      },
      {
        text: this.$i18n.t('models.attributes.task.createdAt').toString(),
        value: 'createdAt'
      },
      {
        text: this.$i18n.t('models.attributes.task.updatedAt').toString(),
        value: 'updatedAt'
      },
      { text: '', value: 'id', sortable: false }
    ]
  }

  @Watch('pagination', { deep: true })
  onPagination(_val: { [key: string]: any }, _oldVal: { [key: string]: any }) {
    this.getTasks()
  }

  async getTasks() {
    this.taskLoading = true
    const { sortBy, descending, page, rowsPerPage } = this.pagination
    const params: { [key: string]: any } = { page, perPage: rowsPerPage }
    if (sortBy) {
      if (!params.q) {
        params.q = {}
      }
      params.q.s = `${sortBy} ${descending ? 'desc' : 'asc'}`
    }
    await tasksStore.getTasks({ params })

    if (!tasksStore.got) {
      const message = this.$t('messages.errorOccurred').toString()
      this.$toast.error(message)
      this.$log.error(tasksStore.errorStatus)
      this.$log.error(tasksStore.errorData)
    }

    this.tasks = tasksStore.tasks
    const tasksMeta = tasksStore.tasksMeta
    this.taskTotalCount = tasksMeta.totalCount
    this.taskLoading = false
  }

  showTask(task: ITask) {
    this.$router.push(`/tasks/${task.id}`)
  }

  editTask(task: ITask) {
    this.$router.push(`/tasks/${task.id}/edit`)
  }

  async deleteTask(task: ITask) {
    if (confirm(this.$t('messages.destroyConfirm').toString())) {
      await this.$store.dispatch('tasks/deleteTask', {
        id: task.id
      })
      if (this.$store.getters['tasks/deleted']) {
        const message = this.$t('messages.destroyModel', {
          model: this.$t('models.task')
        }).toString()
        this.$toast.success(message)
        this.getTasks()
      } else {
        const message = this.$t('messages.errorOccurred').toString()
        this.$toast.error(message)
        this.$log.error(this.$store.getters['tasks/errorStatus'])
        this.$log.error(this.$store.getters['tasks/errorData'])
      }
    }
  }
}
</script>
