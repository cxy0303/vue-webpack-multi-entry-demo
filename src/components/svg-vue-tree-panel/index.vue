<template>
<div class="svg-vue-tree">
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
        offsetx: 0,
        offsety: 0,
        unit: 10,
        data: null
      }
    }
  },
  components: {
    "item-tag": itemtag
  },
  computed: {},
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
      this.moveitem.offsetx = 0;
      this.moveitem.offsety = 0;
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

        this.moveitem.offsetx += e.movementX;
        this.moveitem.offsety += e.movementY;

        let ox = data.tx || 0;
        let oy = data.ty || 0;

        let x = ox;
        if (Math.abs(this.moveitem.offsetx) >= this.moveitem.unit) {
          x += this.moveitem.offsetx > 0 ? this.moveitem.unit : 0 - this.moveitem.unit;
          this.moveitem.offsetx = 0;
        }

        let y = oy;
        if (Math.abs(this.moveitem.offsety) >= this.moveitem.unit) {
					console.log('========================');
          y += this.moveitem.offsety > 0 ? this.moveitem.unit : 0 - this.moveitem.unit;
          this.moveitem.offsety = 0;
        }

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
      this.addline();
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
    overflow: 2bg;
    position: relative;
    background: @bg;
    .svg_container {
        width: 100%;
        height: 100%;
        background: none;
        cursor: pointer;
        position: relative;
        z-index: 11;
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
