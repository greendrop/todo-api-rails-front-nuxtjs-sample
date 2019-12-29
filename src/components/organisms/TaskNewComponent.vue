<template lang="pug">
  v-flex(xs12 sm12 md12)
    v-card
      v-card-title
        v-layout(row wrap)
          v-flex(xs12 sm12 md12)
            form(@submit.prevent="submit")
              task-form-component(:task-form.sync="taskForm")

              v-layout(row wrap)
                v-flex(xs12 sm12 md12)
                  v-btn(color="primary" @click="submit")
                    v-icon.mr-1(small)
                      | fas fa-plus
                    | {{ $t('labels.create') }}
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ITask, Task } from '~/models/task'
import { ITaskForm } from '~/models/task-form'
import TaskFormComponent from '~/components/molecules/TaskFormComponent.vue'
import { TasksStore } from '~/store'

@Component({ components: { TaskFormComponent } })
export default class TaskNewComponent extends Vue {
  tasksStore = TasksStore
  task: ITask = new Task()
  taskForm: ITaskForm = this.task.toTaskForm()

  async submit() {
    await this.$validator.validateAll().then(async result => {
      if (result) {
        await this.tasksStore.createTask({ taskForm: this.taskForm })
        if (this.tasksStore.created) {
          const message = this.$t('messages.createModel', {
            model: this.$t('models.task')
          }).toString()
          this.$toast.success(message)
          const task = this.tasksStore.task
          this.$router.push(`/tasks/${task.id}`)
        } else {
          const message = this.$t('messages.errorOccurred').toString()
          this.$toast.error(message)
          this.$log.error(this.tasksStore.errorStatus)
          this.$log.error(this.tasksStore.errorData)
        }
      }
    })
  }
}
</script>
