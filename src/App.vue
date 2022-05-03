<template>
  <div>

    <router-view></router-view>
  </div>
</template>

<script>
import { } from 'vue'

export default {
  name: "App",
  created () {
    this.initApp()
  },
  methods: {

    async initApp () {

    }
  },
  setup () {

  }
};
</script>

<style>
#app {
  --mainPadding: 20px;
  --headerHeight: 65px;
}
</style>
