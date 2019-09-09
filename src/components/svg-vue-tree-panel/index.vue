<template>
<div class="svg-vue-tree">
  <button @click='addline'>添加连线{{test}}</button>
  <div class="svg-vue-grid">
  </div>
  <svg xmlns="http://www.w3.org/2000/svg" class="svg_container" @mousedown="mousedown_handle($event)">
    <g ref='svg_g_root' class="svg_g_root">
      <g class="svg_g_line">
        <path v-for='(item,index) in lines' :d='get_line_path(item.from,item.to)'></path>
      </g>
      <g class="svg_g_component">
        <item-tag :ref='"com_"+item.id' :key='item.id' :item='item' v-for='(item,index) in items' @mousedown.native.stop="mousedown_handle($event,item)"></item-tag>
      </g>
    </g>
  </svg>
</div>
</div>
</template>
<script>
import itemtag from './itembox/itemtag'
export default {
  data() {
    return {
      test: 0,
      items: [{ //显示数据
        id: 0,
        text: '任务测试一sdfsdfdsfsdfsdfsdfsdf',
        tx: 0,
        ty: 0,
        width: 180,
        height: 50
      }, {
        id: 1,
        text: '任务测试二',
        tx: 0,
        ty: 0,
        width: 180,
        height: 50
      }, { //显示数据
        id: 2,
        text: '任务测试三',
        tx: 0,
        ty: 0,
        width: 180,
        height: 50
      }, {
        id: 3,
        text: '任务测试四',
        tx: 0,
        ty: 0,
        width: 180,
        height: 50
      }],
      lines: [],
      svg_g_root: {
        tx: 0,
        ty: 0,
        width: 180,
        height: 50
      },
      moveitem: { //拖拽实时数据
        el: null,
        data: null
      }
    }
  },
  components: {
    "item-tag": itemtag
  },
  computed: {},
  lines() {
    var all_paths = {};

    return all_paths;
  },
  methods: {
    addline() {
      this.lines.push({
        from: this.items[0],
        to: this.items[1]
      })
      this.lines.push({
        from: this.items[2],
        to: this.items[3]
      })
      this.lines.push({
        from: this.items[0],
        to: this.items[2]
      })
    },
    get_x_line_angel(px, py, mx, my) {
      var x = Math.abs(px - mx);
      var y = Math.abs(py - my);
      var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      var cos = y / z;
      var radina = Math.acos(cos); //用反三角函数求弧度
      var angle = Math.floor(180 / (Math.PI / radina)); //将弧度转换成角度

      if (mx > px && my > py) { //鼠标在第四象限
        angle = 180 - angle;
      }

      if (mx == px && my > py) { //鼠标在y轴负方向上
        angle = 180;
      }

      if (mx > px && my == py) { //鼠标在x轴正方向上
        angle = 90;
      }

      if (mx < px && my > py) { //鼠标在第三象限
        angle = 180 + angle;
      }

      if (mx < px && my == py) { //鼠标在x轴负方向
        angle = 270;
      }

      if (mx < px && my < py) { //鼠标在第二象限
        angle = 360 - angle;
      }

      return angle;
    },
    get_line_path(from, to) {
      let x1 = from.tx + from.width / 2;
      let y1 = from.ty + from.height / 2;

      let x2 = to.tx + to.width / 2;
      let y2 = to.ty + to.height / 2;

      var angel = this.get_x_line_angel(x1, y1, x2, y2);

      if ((angel >= 315 && angel <= 360) || (angel >= 0 && angel <= 45)) {
        x1 = from.tx + from.width / 2;
        y1 = from.ty;

        x2 = to.tx + to.width / 2;
        y2 = to.ty + to.height;
      } else if (angel >= 45 && angel <= 135) {
        x1 = from.tx + from.width;
        y1 = from.ty + from.height / 2;

        x2 = to.tx;
        y2 = to.ty + to.height / 2;
      } else if (angel >= 135 && angel <= 225) {
        x1 = from.tx + from.width / 2;
        y1 = from.ty + from.height;

        x2 = to.tx + to.width / 2;
        y2 = to.ty;
      } else {
        x1 = from.tx;
        y1 = from.ty + from.height / 2;

        x2 = to.tx + to.width;
        y2 = to.ty + to.height / 2;
      }

      return `M${x1},${y1} L${x2},${y2}`;
    },
    mousedown_handle(e, item) {
      if (item) {
        this.moveitem.el = e.currentTarget;
        this.moveitem.data = item;
      } else {
        this.moveitem.el = this.$refs["svg_g_root"];
        this.moveitem.data = this.svg_g_root;
      }
    },
    mousemove_handler(e) {
      if (this.moveitem.el) {
        var target = this.moveitem.el;
        var data = this.moveitem.data;
        let ox = data.tx || 0;
        let oy = data.ty || 0;
        let x = e.movementX + ox;
        let y = e.movementY + oy;
        target.style.transform = `translate(${x}px,${y}px)`;
        data.tx = x;
        data.ty = y;
      }
      window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    },
    init() {
      document.addEventListener("mousemove", this.mousemove_handler)
      document.addEventListener("mouseup", () => {
        this.moveitem.el = null;
        this.moveitem.data = null;
      })
    }
  },
  mounted() {
    this.init();
  }
}
</script>
<style lang="less">
@import './index.less';
.svg-vue-tree {
    font-family: '微软雅黑';
    width: 100%;
    height: 100%;
    background-color: white;
    overflow: hidden;
    position: relative;
    .svg-vue-grid {
        position: absolute;
        left: -500px;
        top: -500px;
        width: 3000px;
        height: 3000px;
        background: -moz-linear-gradient(top, transparent 49px, blue 50px), -moz-linear-gradient(left, transparent 49px, @gridborder1 50px);
        background: -o-linear-gradient(top, transparent 49px, blue 50px), -o-linear-gradient(left, transparent 49px, @gridborder1@gridborder1 50px);
        background: -ms-linear-gradient(top, transparent 49px, blue 50px), -ms-linear-gradient(left, transparent 49px, @gridborder1 50px);
        background: linear-gradient(top, transparent 49px, blue 50px), linear-gradient(left, transparent 49px, @gridborder1 50px);
        background: -webkit-linear-gradient(top, transparent 49px, @bordercolor 50px), -webkit-linear-gradient(left, transparent 49px, @gridborder1 50px);
        -webkit-background-size: 50px 50px;
        -moz-background-size: 50px 50px;
        background-size: 50px 50px;
        &::before {
            content: ' ';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: -webkit-linear-gradient(top, transparent 9px, @bordercolor 10px), -webkit-linear-gradient(left, transparent 9px, @gridborder1 10px);
            background-size: 10px 10px;
        }
    }
    .svg_container {
        width: 100%;
        height: 100%;
        background: none;
        cursor: pointer;
        position: relative;
        z-index: 1;
        .svg_g_component {
            position: relative;
            z-index: 2;
        }
        .svg_g_line {
            position: relative;
            z-index: 1;
            path {
                stroke: @linecolor;
                stroke-width: 1;
            }
        }
    }
}
</style>
