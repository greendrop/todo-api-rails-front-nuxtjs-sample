<template>
  <button @click="signIn">Sign in</button>
</template>

<script>
export default {
  methods: {
    signIn() {
      this.$auth.loginWith('doorkeeper')
    }
  }
}
</script>
