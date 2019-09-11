<template>
<div class="svg-vue-tree">
  <svg xmlns="http://www.w3.org/2000/svg" class="svg_container" @mousedown="mousedown_handle($event)">
    <defs>
      <marker id="m_end" class="marker_end" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 L0 0 z" />
      </marker>
      <marker id="m_start" class="marker_start" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10" orient="auto">
        <circle cx='5' cy='5' r='5'></circle>
      </marker>
    </defs>
    <g ref='svg_g_root' class="svg_g_root"  :transform='`translate(${svg_g_root.tx},${svg_g_root.ty})`'>
      <g class="svg_g_line">
        <template v-for='(item,index) in lines'>
          <path :d='get_line_path(item.from,item.to)' marker-start="url(#m_start)" marker-end="url(#m_end)"></path>
        </template>
      </g>
      <g class="svg_g_component">
        <item-tag :transform='`translate(${item.tx},${item.ty})`' :ref='"com_"+item.id' :key='item.id' :item='item' v-for='(item,index) in items' @mousedown.native.stop="mousedown_handle($event,item)"></item-tag>
      </g>
    </g>
  </svg>
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
      linetype: 2, //0:直线，1：折线，2：曲线
      svg_g_root: {
        tx: 0,
        ty: 0,
        width: 180,
        height: 50
      },
      moveitem: { //拖拽实时数据
        el: null,
        //鼠标按下时坐标
        startx: 0,
        endx: 0,
        //鼠标按下时元素坐标
        elx: 0,
        ely: 0,
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

      let linedirector = 'x';
      if ((angel >= 315 && angel <= 360) || (angel >= 0 && angel <= 45)) {
        x1 = from.tx + from.width / 2;
        y1 = from.ty;

        x2 = to.tx + to.width / 2;
        y2 = to.ty + to.height;

        linedirector = 'y';
      } else if (angel >= 45 && angel <= 135) {
        x1 = from.tx + from.width;
        y1 = from.ty + from.height / 2;

        x2 = to.tx;
        y2 = to.ty + to.height / 2;

        linedirector = 'x';
      } else if (angel >= 135 && angel <= 225) {
        x1 = from.tx + from.width / 2;
        y1 = from.ty + from.height;

        x2 = to.tx + to.width / 2;
        y2 = to.ty;

        linedirector = 'y';
      } else {
        x1 = from.tx;
        y1 = from.ty + from.height / 2;

        x2 = to.tx + to.width;
        y2 = to.ty + to.height / 2;

        linedirector = 'x';
      }

      return this.lineexchange(this.linetype, linedirector, x1, y1, x2, y2);
    },
    //连线风格变换
    lineexchange(linetype, director, startx, starty, endx, endy) {
      if (linetype == 0) {
        return `M${startx},${starty} L${endx},${endy}`;
      } else if (linetype == 1) {
        if (director == "x") {
          let x2 = startx + (endx - startx) / 2;
          let y2 = starty;
          let x3 = x2;
          let y3 = endy;
          return `M${startx},${starty} L${x2},${y2} L${x3},${y3} L${endx},${endy}`;
        } else {
          let x2 = startx;
          let y2 = starty + (endy - starty) / 2;
          let x3 = endx;
          let y3 = y2;
          return `M${startx},${starty} L${x2},${y2} L${x3},${y3} L${endx},${endy}`;
        }
      } else if (linetype == 2) {
        let x = startx + (endx - startx) / 2;
        let y = starty + (endy - starty) / 2;
        if (director == "x") {
          x = startx;
          y = endy;
        } else {
          x = endx;
          y = starty;
        }
        return `M${startx},${starty} C${startx},${starty} ${x},${y} ${endx},${endy}`;
      }
    },
    mousedown_handle(e, item) {
      this.moveitem.startx = e.screenX;
      this.moveitem.starty = e.screenY;
      if (item) {
        this.moveitem.el = e.currentTarget;
        this.moveitem.data = item;
        this.moveitem.elx = item.tx;
        this.moveitem.ely = item.ty;
      } else {
        this.moveitem.el = this.$refs["svg_g_root"];
        this.moveitem.data = this.svg_g_root;
        this.moveitem.elx = this.svg_g_root.tx;
        this.moveitem.ely = this.svg_g_root.ty;
      }
    },
    mousemove_handler(e) {
      if (this.moveitem.el) {
        var target = this.moveitem.el;
        var data = this.moveitem.data;

        let endx = e.screenX;
        let endy = e.screenY;

        let offsetx = endx - this.moveitem.startx;
        let osffsety = endy - this.moveitem.starty;

        offsetx = parseInt(offsetx / this.moveitem.unit) * this.moveitem.unit;
        osffsety = parseInt(osffsety / this.moveitem.unit) * this.moveitem.unit;

        let ox = this.moveitem.elx || 0;
        let oy = this.moveitem.ely || 0;

        let x = ox + offsetx;
        let y = oy + osffsety;

        data.tx = x;
        data.ty = y;
      }
      if (window.getSelection) {
        window.getSelection().removeAllRanges()
      } else {
        document.selection.empty()
      }
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
    overflow: hidden;
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
                stroke-width: 0.8;
                fill: none;
            }
        }
        .marker_end,
        .marker_start {
            fill: @linecolor;
        }
    }
}
</style>
