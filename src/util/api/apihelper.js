import Vue from 'vue'
import config from '../config'
import vueresource from 'vue-resource'
Vue.use(vueresource)
import {
  Toast
} from 'vant';

let ResultObject = function(response) {
  this._response = response;
  if (this._response.ok) {
    this._data = response.body;
  }
  if (!this._data) {
    this._data = {
      code: -1,
      msg: this._response.statusText
    }
  }
}
ResultObject.prototype = {
  get data() {
    return this._data.content;
  },
  get R() {
    return this._data.code === 1 || this._data.code === "1";
  },
  get msg() {
    return this._data.msg;
  },
  get code() {
    return this._data.code;
  }
}

export default {
  //post提交
  postbase: function(url, params, showloadding) {
    const toast = Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      loadingType: 'spinner',
      message: '加载中...'
    });

    return Vue.http.post(config.remoteurl + url, params, {
      emulateJSON: false
    }).then(function(response) {
      toast.clear();
      var obj = new ResultObject(response);
      return obj;
    }, function(response) {
      toast.clear();
      var obj = new ResultObject(response);
      return obj;
    })
  },
  //post提交，显示 加载中...
  post: function(url, params) {
    this.postbase(url, params, true);
  }
}
