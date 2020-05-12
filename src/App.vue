<template>
  <div id="app">
    <transition name="fade" mode="out-in" >
        <router-view></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
export default {}
</script>

<style lang="scss">
@import './app.scss';
</style>
