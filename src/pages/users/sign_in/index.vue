<template lang="pug">
  div
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Index extends Vue {
  mounted() {
    if (this.$auth.loggedIn) {
      this.$auth.redirect('home')
    } else {
      this.$auth.loginWith(process.env.AUTH_STRATEGY_NAME)
    }
  }
}
</script>
