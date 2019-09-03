import Vue from 'vue'
import Vuet from 'vuet'
import api from '@/util/api'
import config from '@/util/config'
// myrule，befrecreated执行数据查询，当fetch方法返回不等于false的值时，
// 标记此组件已经加载数据（在组件对应vuet实例中增加loaded=true），后续不会在调用fetch方法
// 但是如果路由参数发生变化会重新加载
Vuet.rule('routerule', {
  rule({
    path
  }) {
    return {
      beforeCreate() {
        var m = this.$vuet.getModule(path); //组件对应vuet实例
        var fetchlist = this.$vuet.getModule("app").fetchlist;
        var params = this.$route.params;
        var loaded = fetchlist.indexOf(path) >= 0;
        if (params) {
          for (var key in params) {
            if (m[key] != params[key] && params[key]) {
              loaded = false;
            }
          }
        }
        if (loaded)
          return;
        m.reset();
        for (var key in params) {
          if (params[key])
            m[key] = params[key];
        }
        if (m.fetch) {
          var obj = m.fetch();
          if (obj && obj.then) {
            obj.then((r) => {
              if (r != false && fetchlist.indexOf(path) < 0) {
                fetchlist.push(path);
              }
            })
          } else {
            if (obj != false && fetchlist.indexOf(path) < 0) {
              fetchlist.push(path);
            }
          }
        }
      }
    }
  }
})
Vue.use(Vuet)
Vuet.options.module.$api = api
Vuet.options.module.$config = config

var app = {
  data() {
    return {
      list: [],
      fetchlist: []
    }
  },
  fetch() {

  }
}

export default new Vuet({
  pathJoin: '/',
  modules: {
    app
  }
})
