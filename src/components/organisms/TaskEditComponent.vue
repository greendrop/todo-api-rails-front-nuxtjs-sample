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
                      | fas fa-pencil-alt
                    | {{ $t('labels.update') }}
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { ITask, Task } from '~/models/task'
import { ITaskForm, TaskForm } from '~/models/task-form'
import TaskFormComponent from '~/components/molecules/TaskFormComponent.vue'
import { TasksStore } from '~/store'

@Component({ components: { TaskFormComponent } })
export default class TaskEditComponent extends Vue {
  tasksStore = TasksStore

  @Prop({ type: Object, required: true })
  task: ITask

  localTask: ITask = new Task()
  taskForm: ITaskForm = new TaskForm()

  @Watch('task', { deep: true })
  onChangeTask(val: ITask, oldVal: ITask) {
    if (!val.equals(oldVal)) {
      this.localTask = val.clone()
    }
  }

  @Watch('localTask', { deep: true })
  onChangeLocalTask(val: ITask, _oldVal: ITask) {
    this.$emit('update:task', val)
  }

  mounted() {
    this.localTask = this.task
    this.taskForm = this.localTask.toTaskForm()
  }

  async submit() {
    await this.$validator.validateAll().then(async result => {
      if (result) {
        await this.tasksStore.updateTask({
          id: this.task.id,
          taskForm: this.taskForm
        })
        if (this.tasksStore.updated) {
          const message = this.$t('messages.updateModel', {
            model: this.$t('models.task')
          }).toString()
          this.$toast.success(message)
          this.$router.push(`/tasks/${this.task.id}`)
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
