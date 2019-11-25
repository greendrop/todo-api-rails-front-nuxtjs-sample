<template lang="pug">
  v-app(dark)
    v-navigation-drawer(
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app)

      navigation-list-component

    v-toolbar(
      :clipped-left="clipped"
      fixed
      app)

      v-toolbar-side-icon(@click="drawer = !drawer")
      v-toolbar-title(v-text="title")

    v-content
      v-container
        nuxt
    v-footer(:fixed="fixed" app)
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NavigationListComponent from '../components/organisms/NavigationListComponent.vue'

@Component({ components: { NavigationListComponent } })
export default class Default extends Vue {
  clipped: boolean = true
  drawer: boolean | null = null
  fixed: boolean = false
  miniVariant: boolean = false
  right: boolean = true
  rightDrawer: boolean = false
  title: string = 'Todo PWA Sample'
}
</script>
