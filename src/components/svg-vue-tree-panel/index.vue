<template>
<div ref='svg_root' class="svg-vue-tree">
  <div class="svg-vue-toolbar">
    <div class="svg-vue-toolbar-container">
      <div class="svg-vue-toolbar-container-panel">
        <line-style v-model='linetype'></line-style>
      </div>
    </div>
  </div>
  <svg v-if='items.length>0' xmlns="http://www.w3.org/2000/svg" class="svg_container" @mousedown="mousedown_handle($event)">
    <defs>
      <marker id="m_end" class="marker_end" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 L0 0 z" />
      </marker>
      <marker id="m_start" class="marker_start" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10" orient="auto">
        <circle cx='5' cy='5' r='5'></circle>
      </marker>
    </defs>
    <g ref='svg_g_root' class="svg_g_root" :transform='`translate(${svg_g_root.tx},${svg_g_root.ty})`'>
      <g class="svg_g_line">
        <template v-for='(item,index) in lines'>
          <path :d='get_line_path(item.from,item.to)' marker-start="url(#m_start)" marker-end="url(#m_end)"></path>
        </template>
        <path class="line_temp" :d='get_line_path(line_temp.from,line_temp.to)' v-if='line_temp' marker-start="url(#m_start)" marker-end="url(#m_end)"></path>
      </g>
      <g class="svg_g_component">
        <item-box :key='item.id' :istemp='moveitem.data==item' :item='item' v-for='(item,index) in items' @mousedown.native.stop="mousedown_handle($event,item)" @adddragstart='add_dargstart_handler'></item-box>
        <item-box :item='line_temp.to' v-if='line_temp' :istemp='true'></item-box>
      </g>
    </g>
  </svg>
  <div class="svg-vue-tree-line" v-if='moveitem.data&&!moveitem.isroot'>
    <div class="top" :style='`transform:translateY(${moveitem.data.ty+svg_g_root.ty}px)`'>
    </div>
    <div class="bottom" :style='`transform:translateY(${moveitem.data.ty+svg_g_root.ty+moveitem.data.height}px)`'>
    </div>
    <div class="left" :style='`transform:translateX(${moveitem.data.tx+svg_g_root.tx}px)`'>
    </div>
    <div class="right" :style='`transform:translateX(${moveitem.data.tx+svg_g_root.tx+moveitem.data.width}px)`'>
    </div>
  </div>
  <div class="svg-vue-tree-empty">
    <a class="btn-add" @click='addfirst'>+</a>
  </div>
</div>
</template>
<script>
import itembox from './itembox'
import linestyle from './common/linestyle'
export default {
  data() {
    return {
      mode: 0, //0:浏览模式;1:编辑模式;2:编辑-新增模式
      items: [],
      lines: [],
      line_temp: null,
      linetype: 1, //0:直线，1：折线，2：曲线
      dragitem: null,
      svg_g_root: {
        tx: 0,
        ty: 0,
        width: 180,
        height: 50
      },
      moveitem: { //拖拽实时数据
        el: null,
        //鼠标按下时坐标
        startx: 0, //鼠标起始位置
        endx: 0,
        //鼠标按下时元素坐标
        elx: 0, //元素起始位置
        ely: 0,
        unit: 10, //拖拽每次移动距离
        data: null, //拖拽元素数据
        isroot: false //当前是否拖动容器
      }
    }
  },
  components: {
    "item-box": itembox,
    "line-style": linestyle
  },
  computed: {
    //元素边界,
    boundary() {
      var obj = {
        max: {
          x: null,
          y: null,
        },
        min: {
          x: null,
          y: null
        }
      };

      this.items.forEach((item) => {

        if (obj.max.x == null || obj.max.x < item.tx) {
          obj.max.x = item.tx + item.width;
        }
        if (obj.max.y == null || obj.max.y < item.ty) {
          obj.max.y = item.ty + item.height;
        }

        if (obj.min.x == null || obj.min.x > item.tx) {
          obj.min.x = item.tx;
        }
        if (obj.min.y == null || obj.min.y > item.ty) {
          obj.min.y = item.ty;
        }

      })

      obj.max.x = obj.min.x = (obj.max.x + obj.min.x) / 2;
      obj.max.y = obj.min.y = (obj.min.y + obj.max.y) / 2;

      obj.max.y -= 81; //往上拖动距离减少100
      obj.min.y += 50 //往下拖动距离减少100
      obj.min.x += 100; //往右拖动距离减少100//往上拖动距离减少100
      obj.max.x -= 100; //往左拖动距离减少100

      return obj;
    }
  },
  methods: {
    //格式化坐标，这里拖动时每次移动10px，为了保证拖动后元素能对齐，元素的坐标只能是10像素的倍数，移动单位可修改；
    format_point(pointvalue) {
      return parseInt(pointvalue / this.moveitem.unit) * this.moveitem.unit;
    },
    addnew(item) {
      this.items.push(item);
    },
    addfirst() {
      let item = {
        id: parseInt(Math.random() * 1000000),
        width: 160,
        height: 45,
        tx: 0,
        ty: 0,
        text: "新元素"
      }
      let root_el = this.$refs["svg_root"];
      item.tx = this.format_point(parseFloat(root_el.offsetWidth) / 2 - item.width / 2);
      item.ty = this.format_point(parseFloat(root_el.offsetHeight) / 2 - item.height / 2);
      this.items.push(item);
    },
    addline(from, to) {
      if (from && to) {
        this.lines.push({
          from: from,
          to: to
        })
      }
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
        this.moveitem.isroot = true;
      }
    },
    //跟随鼠标移动，每次鼠标点击记录点击位置，元素位置，每次移动通过计算鼠标相对上次点击位置的距离，得出元素移动距离，减少误差；
    //而不是通过移动多少鼠标就移动多少，这样会由于每次计算精确度的误差逐渐递增
    mousemove_handler(e) {
      if (this.moveitem.el) {
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
    add_dargstart_handler(e, from, to) {
      this.mode = 2;
      to.tx = this.format_point(to.tx);
      to.ty = this.format_point(to.ty);
      this.line_temp = {
        from: from,
        to: to
      }
      //跟随鼠标移动
      this.moveitem.startx = e.screenX;
      this.moveitem.starty = e.screenY;
      this.moveitem.elx = this.line_temp.to.tx;
      this.moveitem.ely = this.line_temp.to.ty;
      this.moveitem.el = e.currentTarget;
      this.moveitem.data = this.line_temp.to;
    },
    addmousewheel(e) {
      console.log(e);
    },
    init() {
      document.addEventListener("mousemove", this.mousemove_handler)
      document.addEventListener("mouseup", () => {
        if (this.moveitem.isroot) { //拖拽顶层容器时，边距检测，防止将元素移出视图区域
          let ts = {
            x: 0,
            y: 0
          }

          let work_Width = this.$refs["svg_root"].offsetWidth;
          let work_Height = this.$refs["svg_root"].offsetHeight;

          let max_x = work_Width - this.boundary.min.x;
          let max_y = work_Height - this.boundary.min.y;

          let min_x = 0 - this.boundary.max.x;
          let min_y = 0 - this.boundary.max.y;

          if (this.moveitem.data.tx > max_x) {
            ts.x = max_x;
          } else if (this.moveitem.data.tx < min_x) {
            ts.x = min_x;
          } else {
            ts.x = this.moveitem.data.tx;
          }

          if (this.moveitem.data.ty > max_y) {
            ts.y = max_y;
          } else if (this.moveitem.data.ty < min_y) {
            ts.y = min_y;
          } else {
            ts.y = this.moveitem.data.ty;
          }

          this.moveitem.data.tx = ts.x;
          this.moveitem.data.ty = ts.y;
        }
        this.moveitem.el = null;
        this.moveitem.data = null;
        if (this.mode == 2 && this.line_temp) {
          let to = {
            id: parseInt(Math.random() * 1000000),
            tx: 0,
            ty: 0,
            width: 0,
            height: 0,
            text: "新元素",
            ...this.line_temp.to
          }
          this.addnew(to);
          this.addline(this.line_temp.from, to);
          this.line_temp = null;
        }
        this.mode = 0;
        this.moveitem.isroot = false;
      })
      document.addEventListener("mousewheel", this.addmousewheel)
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
    .svg-vue-toolbar {
        height: 45px;
        padding-bottom: 5px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 100;
        .svg-vue-toolbar-container {
            width: 100%;
            height: 100%;
            background-color: #FFFFFF;
            border-bottom: 1px solid @bordercolor1;
            display: flex;
            &::before {
                content: ' ';
                position: absolute;
                bottom: 6px;
                left: 0;
                width: 100%;
                height: 1px;
                box-shadow: 0 -5px 30px 0 black;
            }
            .svg-vue-toolbar-container-panel {
                width: 0;
                flex: auto;
                display: flex;
                .drop-down {
                    width: 0;
                }
            }
        }
    }
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
    .svg-vue-item-bar {
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        left: 0;
        a {
            visibility: hidden;
            position: absolute;
            top: 0;
            left: 0;
        }
        &.show {
            a {
                visibility: visible;
            }
        }
    }
    .svg-vue-tree-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        position: relative;
        z-index: 11;
    }
    .new_circle {
        circle {
            fill: darken(@bordercolor1,5%);
            stroke: @bordercolor1;
        }
    }
    .line_temp {
        stroke-dasharray: 3;
        stroke-dashoffset: 2;
    }
    .svg-vue-tree-line {
        z-index: 10;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        .bottom,
        .top {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 0;
            border-top: 1px dotted grey;
        }
        .left,
        .right {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 0;
            border-left: 1px dotted grey;
        }
    }
}
</style>
