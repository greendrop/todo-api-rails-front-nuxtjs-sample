<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12 sm12 md12)
      v-layout(row wrap)
        v-flex(xs12 sm12 md12 mb-1)
          v-breadcrumbs(:items="breadcrumbItems")

    v-flex(xs12 sm12 md12)
      v-layout(row wrap)
        v-flex(xs12 sm12 md12 mb-3)
          .headline
            | {{ $t('labels.editModel', { model: $t('models.task') }) }}

    task-edit-component(:task.sync="task")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Context } from '@nuxt/types'
import TaskEditComponent from '~/components/organisms/TaskEditComponent.vue'
import { ITask, Task } from '~/models/task'
import { TasksStore } from '~/store'

@Component({
  components: { TaskEditComponent },
  middleware: 'auth',
  async asyncData(context: Context) {
    await TasksStore.getTaskById({ id: parseInt(context.route.params.id) })
    const data = {
      task: TasksStore.task
    }
    return data
  }
})
export default class Edit extends Vue {
  tasksStore = TasksStore
  task: ITask = new Task()

  get breadcrumbItems(): { [key: string]: any }[] {
    const id = this.$route.params.id
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
        disabled: false
      },
      {
        text: this.$i18n.t('labels.showModel', {
          model: this.$i18n.t('models.task')
        }),
        to: `/tasks/${id}`,
        exact: true,
        disabled: false
      },
      {
        text: this.$i18n.t('labels.editModel', {
          model: this.$i18n.t('models.task')
        }),
        to: `/tasks/${id}/edit`,
        exact: true,
        disabled: true
      }
    ]
  }
}
</script>
