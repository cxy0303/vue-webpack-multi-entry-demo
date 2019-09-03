import Vue from 'vue'
import Router from 'vue-router'
import svg_vue_tree_panel from '@/components/svg-vue-tree-panel'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    component: svg_vue_tree_panel
  }]
})
