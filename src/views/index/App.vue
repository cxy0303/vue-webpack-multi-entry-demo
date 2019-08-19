<template>
<div id="app">
  <div class="header">
    {{$config.remoteurl}}
  </div>
  <van-button type="default">默认按钮</van-button>
  <van-button type="primary">主要按钮</van-button>
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
