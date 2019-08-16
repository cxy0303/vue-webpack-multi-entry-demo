import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/fjj.html' : '/fjj.html',
  fallback: false,
  routes: [{
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  }]
})
