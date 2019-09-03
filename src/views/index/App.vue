<template>
<div id="app">
  <router-view />
</div>
</template>

<script>
import {
  mapModules,
  mapRules
} from 'vuet'
import {
  Button
} from 'vant';
import {
  Toast
} from 'vant';
export default {
  name: 'App',
  mixins: [
    mapModules({
      data: 'app'
    }),
    mapRules({
      routerule: 'app'
    })
  ],
  components: {
    "van-button": Button
  },
  mounted() {

  }
}
</script>

<style lang="less">
body,
html {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
* {
    box-sizing: border-box;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
}
.header {
    width: 100%;
    height: @headerheight;
    background-color: green;
}
</style>
