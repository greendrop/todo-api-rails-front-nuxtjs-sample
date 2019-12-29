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
            | {{ $t('labels.showModel', { model: $t('models.task') }) }}

    task-detail-component(:task="task")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import TaskDetailComponent from '~/components/organisms/TaskDetailComponent.vue'
import { ITask, Task } from '~/models/task'
import { TasksStore } from '~/store'

@Component({
  components: { TaskDetailComponent },
  middleware: 'auth',
  async asyncData(context: Context) {
    await TasksStore.getTaskById({ id: parseInt(context.route.params.id) })
    const data = {
      task: TasksStore.task
    }
    return data
  }
})
export default class Index extends Vue {
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
        disabled: true
      }
    ]
  }
}
</script>
