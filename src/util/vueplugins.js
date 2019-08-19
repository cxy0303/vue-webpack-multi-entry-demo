import Vue from 'vue'
import api from './api'
import config from './config'

export default {
  install(Vue) {
    Vue.prototype.$api = api;
    Vue.prototype.$config = config;
  }
}
