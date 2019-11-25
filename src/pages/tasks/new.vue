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
            = "{{ $t('labels.newModel', { model: $t('models.task') }) }}"

    task-new-component
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TaskNewComponent from '~/components/organisms/TaskNewComponent.vue'

@Component({ components: { TaskNewComponent }, middleware: 'auth' })
export default class New extends Vue {
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
        disabled: false
      },
      {
        text: this.$i18n.t('labels.newModel', {
          model: this.$i18n.t('models.task')
        }),
        to: '/tasks/new',
        exact: true,
        disabled: true
      }
    ]
  }
}
</script>
