<template lang="pug">
  v-list
    v-list-tile(v-for="(item, i) in items" :key="i" :to="item.to" router exact)
      v-list-tile-action
        v-icon(small)
          | {{ item.icon }}
      v-list-tile-content
        v-list-tile-title(v-text="item.title")
    client-only
      v-list-tile(v-if="!signedIn" @click="signIn()")
        v-list-tile-action
          v-icon(small)
            | fas fa-sign-in-alt
        v-list-tile-content
          v-list-tile-title(v-text="$t('labels.signIn')")
      v-list-tile(v-if="signedIn" @click="signOut()")
        v-list-tile-action
          v-icon(small)
            | fas fa-sign-out-alt
        v-list-tile-content
          v-list-tile-title(v-text="$t('labels.signOut')")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class TaskFormComponent extends Vue {
  items: { [key: string]: any }[] = []

  created() {
    this.items = [
      {
        icon: 'fas fa-home',
        title: this.$i18n.t('labels.home').toString(),
        to: '/'
      },
      {
        icon: 'fas fa-list',
        title: this.$i18n.t('models.task').toString(),
        to: '/tasks'
      }
    ]
  }

  get signedIn() {
    return (this as any).$auth.loggedIn
  }

  async signIn() {
    await this.$auth.loginWith(process.env.AUTH_STRATEGY_NAME)
  }

  async signOut() {
    await this.$auth.logout().then(() => {
      this.$toast.success(this.$i18n.t('messages.signedOut').toString())
    })
  }
}
</script>
