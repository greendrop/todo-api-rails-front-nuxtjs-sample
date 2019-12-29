<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12 sm12 md12)
      v-text-field(
        v-model="localTaskForm.title"
        v-validate="'required|max:255'"
        :counter="255"
        :label="$t('models.attributes.task.title')"
        :error-messages="errors.collect('title')"
        :data-vv-as="$t('models.attributes.task.title')"
        :data-vv-name="'title'"
        required)

      v-textarea(
        v-model="localTaskForm.description"
        :label="$t('models.attributes.task.description')"
        :error-messages="errors.collect('description')"
        :data-vv-as="$t('models.attributes.task.description')"
        :data-vv-name="'description'")

      v-switch(
        v-model="localTaskForm.done"
        :label="$t('models.attributes.task.done')"
        :error-messages="errors.collect('done')"
        :data-vv-as="$t('models.attributes.task.done')"
        :data-vv-name="'done'")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator'
import { ITaskForm, TaskForm } from '~/models/task-form'

@Component
export default class TaskFormComponent extends Vue {
  @Prop({ type: Object, required: true })
  taskForm!: ITaskForm

  localTaskForm: ITaskForm = new TaskForm()

  @Watch('taskForm')
  onChangeTaskForm(val: ITaskForm, oldVal: ITaskForm) {
    if (!val.equals(oldVal)) {
      this.localTaskForm = val.clone()
    }
  }

  @Watch('localTaskForm', { deep: true })
  onChangeLocalTaskForm(val: ITaskForm, _oldVal: ITaskForm) {
    this.$emit('update:taskForm', val)
  }

  mounted() {
    this.localTaskForm = this.taskForm
  }
}
</script>
