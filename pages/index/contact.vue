<template>
  <nuxt-child :contact="contact" />
</template>

<script>
import { ContactModel } from '~/libs/Contact'
export default {
  data() {
    return {
      contact: new ContactModel(),
    }
  },
}
</script>

<style></style>
