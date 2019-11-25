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
import _ from 'lodash'
import { ITask, Task } from '~/models/task'
import { ITaskForm, TaskForm } from '~/models/task-form'
import TaskFormComponent from '~/components/molecules/TaskFormComponent.vue'
import { tasksStore } from '~/store'

@Component({ components: { TaskFormComponent } })
export default class TaskEditComponent extends Vue {
  @Prop({ type: Object, required: true })
  task: ITask

  localTask: ITask = new Task()
  taskForm: ITaskForm = new TaskForm()

  @Watch('task', { deep: true })
  onChangeTask(val: ITask, oldVal: ITask) {
    if (!_.isEqual(val, oldVal)) {
      this.localTask = _.cloneDeep(val)
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

  submit() {
    this.$validator.validateAll().then(async result => {
      if (result) {
        await tasksStore.updateTask({
          id: this.task.id,
          taskForm: this.taskForm
        })
        if (tasksStore.updated) {
          const message = this.$t('messages.updateModel', {
            model: this.$t('models.task')
          }).toString()
          this.$toast.success(message)
          this.$router.push(`/tasks/${this.task.id}`)
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
