<template>
<div id="app">
  <div class="header">

  </div>
  <router-view />
</div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%
}

.header {
	width:100%;
  height: @headerheight;
  background-color: green;
}
</style>
