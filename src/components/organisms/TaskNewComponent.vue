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
import { Component, Vue } from 'vue-property-decorator'
import { ITask, Task } from '~/models/task'
import { ITaskForm } from '~/models/task-form'
import TaskFormComponent from '~/components/molecules/TaskFormComponent.vue'
import { tasksStore } from '~/store'

@Component({ components: { TaskFormComponent } })
export default class TaskNewComponent extends Vue {
  task: ITask = new Task()
  taskForm: ITaskForm = this.task.toTaskForm()

  submit() {
    this.$validator.validateAll().then(async result => {
      if (result) {
        await tasksStore.createTask({ taskForm: this.taskForm })
        if (tasksStore.created) {
          const message = this.$t('messages.createModel', {
            model: this.$t('models.task')
          }).toString()
          this.$toast.success(message)
          const task = tasksStore.task
          this.$router.push(`/tasks/${task.id}`)
        } else {
          const message = this.$t('messages.errorOccurred').toString()
          this.$toast.error(message)
          this.$log.error(tasksStore.errorStatus)
          this.$log.error(tasksStore.errorData)
        }
      }
    })
  }
}
</script>
