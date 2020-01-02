<template lang="pug">
  v-flex(xs12 sm12 md12)
    v-data-table(
      :headers="taskHeaders"
      :items="tasks"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="localPagination"
      :total-items="tasksTotalCount"
      :loading="tasksLoading")
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
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator'
import qs from 'qs'
import snakecaseKeys from 'snakecase-keys'
import { ITask } from '~/models/task'
import {
  IVDataTablePagination,
  VDataTablePagination
} from '~/models/v-data-table-pagination'
import { TasksStore } from '~/store'

@Component
export default class TaskListComponent extends Vue {
  @Prop({ type: Array, required: true })
  tasks!: ITask[]

  @Prop({ type: Number, required: true })
  tasksTotalCount!: number

  @Prop({ type: Boolean, required: true })
  tasksLoading!: boolean

  @Prop({ type: Object, required: true })
  query!: { [key: string]: any }

  @Prop({ type: Object, required: true })
  pagination!: IVDataTablePagination

  tasksStore = TasksStore
  taskHeaders: { [key: string]: any }[] = []
  rowsPerPageItems = [5, 10, 25]
  localPagination: { [key: string]: any } = {}

  @Watch('pagination', { deep: true })
  onChangePagination(
    val: IVDataTablePagination,
    oldVal: IVDataTablePagination
  ) {
    if (!val.equals(oldVal)) {
      this.localPagination = val.clone()
    }
  }

  @Watch('localPagination', { deep: true })
  onLocalPagination(val: IVDataTablePagination, oldVal: IVDataTablePagination) {
    const valPagination = new VDataTablePagination(val)
    const oldValPagination = new VDataTablePagination(oldVal)
    if (!valPagination.equals(oldValPagination)) {
      this.$emit('update:pagination', valPagination)

      const query = {
        q: this.query,
        page: valPagination.page,
        perPage: valPagination.rowsPerPage
      }
      if (valPagination.sortBy) {
        query.q.s = `${valPagination.sortBy} ${
          valPagination.descending ? 'desc' : 'asc'
        }`
      }
      this.$router.push(
        `/tasks?${qs.stringify(snakecaseKeys(query), {
          arrayFormat: 'brackets'
        })}`
      )
    }
  }

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

  mounted() {
    this.localPagination = this.pagination
  }

  showTask(task: ITask) {
    this.$router.push(`/tasks/${task.id}`)
  }

  editTask(task: ITask) {
    this.$router.push(`/tasks/${task.id}/edit`)
  }

  async deleteTask(task: ITask) {
    if (confirm(this.$t('messages.destroyConfirm').toString())) {
      await this.tasksStore.deleteTask({ id: task.id })
      if (this.tasksStore.deleted) {
        const message = this.$t('messages.destroyModel', {
          model: this.$t('models.task')
        }).toString()
        this.$toast.success(message)
        this.$emit('getTasks')
      } else {
        const message = this.$t('messages.errorOccurred').toString()
        this.$toast.error(message)
        this.$log.error(this.tasksStore.errorStatus)
        this.$log.error(this.tasksStore.errorData)
      }
    }
  }
}
</script>
