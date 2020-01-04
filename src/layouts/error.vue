<template lang="pug">
  v-flex(xs12 sm12 md12)
    v-card
      v-card-title
        .subheading
          | {{ messageByStatusCode }}

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class ErrorLayout extends Vue {
  @Prop({ type: Object })
  error?: any

  get statusCode(): number {
    return (this.error && this.error.statusCode) || 500
  }

  get path(): string {
    return (this.error && this.error.path) || ''
  }

  get message(): string {
    return (this.error && this.error.message) || ''
  }

  get messageByStatusCode(): string {
    let message = this.$t('messages.errorOccurred').toString()

    switch (this.statusCode) {
      case 401:
        message = this.$t('messages.unauthorized').toString()
        break
      case 404:
        message = this.$t('messages.notFound').toString()
        break
      case 500:
        message = this.$t('messages.internalServerError').toString()
        break
    }
    return message
  }
}
</script>
