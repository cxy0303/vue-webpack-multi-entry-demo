<template>
<div ref='svg_root' class="svg-vue-tree">
  <div class="svg-vue-toolbar">
    <div class="svg-vue-toolbar-container">
      <div class="svg-vue-toolbar-container-panel">
        <line-style v-model='linetype'></line-style>
      </div>
      <div class="svg-vue-toolbar-container-panel">
        <a class="save" @click='save'>保存</a>
      </div>
      <div class="svg-vue-toolbar-container-panel">
        <a class="save" @click='clear'>清空</a>
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
    <g x=0 y=0 ref='svg_g_root' class="svg_g_root" :transform='`translate(${svg_g_root.tx},${svg_g_root.ty}) scale(${svg_g_root.scale})`'>
      <g class="svg_g_line">
        <!---拖动时校准虚线start -->
        <template v-if='moveitem.data&&!moveitem.isroot'>
          <path class="dotted_line" :d='`M-20000,${moveitem.data.ty} L20000,${moveitem.data.ty}`'></path>
          <path class="dotted_line" :d='`M-20000,${moveitem.data.ty+moveitem.data.height} L20000,${moveitem.data.ty+moveitem.data.height}`'></path>
          <path class="dotted_line" :d='`M${moveitem.data.tx},-20000 L${moveitem.data.tx},20000`'></path>
          <path class="dotted_line" :d='`M${moveitem.data.tx+moveitem.data.width},-20000 L${moveitem.data.tx+moveitem.data.width},20000`'></path>
        </template>
        <!---拖动时校准虚线end -->

        <!---组件之间连线start -->
        <template v-for='(item,index) in lines_obj'>
          <path :d='get_line_path(item.from,item.to)' marker-start="url(#m_start)" marker-end="url(#m_end)"></path>
        </template>
        <!---组件之间连线end -->
        <path class="line_temp" :d='get_line_path(line_temp.from,line_temp.to)' v-if='line_temp' marker-start="url(#m_start)" marker-end="url(#m_end)"></path>
      </g>
      <g class="svg_g_component" ref='svg_g_components'>
        <item-box :key='key' :istemp='moveitem.data==value' :item='value' v-for='(value,key) in items_obj' @mousedown.native.stop="mousedown_handle($event,value)" @adddragstart='add_dargstart_handler' @edit='item_box_edit'>
        </item-box>
        <item-box :item='line_temp.to' v-if='line_temp' :istemp='true'></item-box>
      </g>
    </g>
  </svg>
  <div class="svg-vue-tree-empty">
    <a class="btn-add" @click='addfirst'>+</a>
  </div>
  <svg-input v-if='edititem' v-model='edititem' :root='svg_g_root' @cancel='edititem=null'></svg-input>
</div>
</template>
<script>
import itembox from './itembox'
import linestyle from './common/linestyle'
import svginput from './common/svginput/dialog'
export default {
  data() {
    return {
      root_padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      mode: 0, //0:浏览模式;1:编辑模式;2:编辑-新增模式
      items: [],
      lines: [],
      line_temp: null,
      linetype: 1, //0:直线，1：折线，2：曲线
      dragitem: null,
      svg_g_root: {
        tx: 0,
        ty: 0,
        scale: 1,
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
      },
      edititem: null //编辑实例
    }
  },
  components: {
    "item-box": itembox,
    "line-style": linestyle,
    "svg-input": svginput
  },
  computed: {
    items_obj() {
      var temp = {}
      this.items.forEach((item) => {
        temp[item.id] = item;
      })
      return temp;
    },
    lines_obj() {
      var lines = [];
      this.items.forEach((item) => {
        for (var key in item.to) {
          item.to[key].forEach((toitem) => {
            lines.push({
              from: item,
              to: this.items_obj[toitem]
            })
          })
        }
      })
      return lines;
    },
    //元素边界矩形中心,
    boundary() {
      var obj = this.boundary_rect;
      // obj.max.x = obj.min.x = (obj.max.x + obj.min.x) / 2;
      // obj.max.y = obj.min.y = (obj.min.y + obj.max.y) / 2;

      obj.max.y -= 39 //往上拖动距离减少100
      // obj.min.y += 50; //往下拖动距离减少100
      //
      // obj.max.x -= 100; //往左拖动距离减少100
      // obj.min.x += 100; //往右拖动距离减少100//


      return obj;
    },
    //边界矩形
    boundary_rect() {
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
          obj.max.x = item.tx;
        }
        if (obj.max.y == null || obj.max.y < item.ty) {
          obj.max.y = item.ty;
        }

        if (obj.min.x == null || obj.min.x > item.tx) {
          obj.min.x = item.tx + item.width;
        }
        if (obj.min.y == null || obj.min.y > item.ty) {
          obj.min.y = item.ty + item.height;
        }

      })
      return obj;
    }
  },
  methods: {
    //双击元素编辑事件
    item_box_edit(item) {
      this.edititem = item;
    },
    clear() {
      localStorage.setItem("items", "");
    },

    save() {
      localStorage.setItem("items", JSON.stringify(this.items));
      localStorage.setItem("lines", JSON.stringify(this.lines));
      alert("已保存至本地！");
    },
    //格式化坐标，这里拖动时每次移动10px，为了保证拖动后元素能对齐，元素的坐标只能是10像素的倍数，移动单位可修改；
    format_point(pointvalue) {
      return parseInt(pointvalue / this.moveitem.unit) * this.moveitem.unit;
    },

    addnew(item) {
      this.items.push(item);
    },

    addfirst() {
      let item = {
        id: "tag_" + parseInt(Math.random() * 1000000),
        type: "item-tag",
        tx: 0,
        ty: 0,
        width: 150,
        height: 40,
        type: 'item-tag',
        subject: '元素主题',
        text: "元素内容",
        from: {
          top: [],
          bottom: [],
          left: [],
          right: []
        },
        to: {
          top: [],
          bottom: [],
          left: [],
          right: []
        }
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

    unitscale(value, isrevser) {
      let rate = isrevser ? this.svg_g_root.scale - 1 : 1 - this.svg_g_root.scale;
      value = value * 10;
      value = value + value * rate / this.svg_g_root.scale;
      value = parseInt(value / 10);
      return value;
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
        if (!this.moveitem.isroot) {
          offsetx = this.unitscale(offsetx);
          osffsety = this.unitscale(osffsety);
        }

        offsetx = parseInt(offsetx / this.moveitem.unit) * this.moveitem.unit;
        osffsety = parseInt(osffsety / this.moveitem.unit) * this.moveitem.unit;

        let ox = this.moveitem.elx || 0;
        let oy = this.moveitem.ely || 0;

        let x = ox + offsetx;
        let y = oy + osffsety;

        data.tx = x;
        data.ty = y;
        if (window.getSelection) {
          window.getSelection().removeAllRanges()
        } else {
          document.selection.empty()
        }
      }
    },

    add_dargstart_handler(e, key, fromitem, toitem) {
      // this.mode = 2;
      toitem.tx = this.format_point(toitem.tx);
      toitem.ty = this.format_point(toitem.ty);
      this.items.push(toitem);
      this.$nextTick(() => {
        this.autoajust(key, fromitem)
      })
      // this.line_temp = {
      //   from: from,
      //   to: to
      // }
      //跟随鼠标移动
      // this.moveitem.startx = e.screenX;
      // this.moveitem.starty = e.screenY;
      // this.moveitem.elx = this.line_temp.to.tx;
      // this.moveitem.ely = this.line_temp.to.ty;
      // this.moveitem.el = e.currentTarget;
      // this.moveitem.data = this.line_temp.to;
    },

    autoajust(key, item) {
      var items = item.to[key];
      if (key == "left" || key == "right") {
        var m = items.length % 2;
        var n = (items.length - m) / 2
        for (var i = 0; i < items.length; i++) {
          var id = items[i];
          var m_item = this.items_obj[id];

          if (m_item.tx == item.tx) {
            m_item.tx += (key == "right" ? 300 : -300);
          }
          m_item.ty = item.ty - (n - i) * item.height * 2 + (m == 0 ? item.height : 0);
        }
      }
    },

    addmousewheel(e) {
      if (e.wheelDelta > 0) {
        if (this.svg_g_root.scale + 0.1 >= 2) {
          this.svg_g_root.scale = 2;
        } else {
          this.svg_g_root.scale += 0.1;
        }
      } else if (e.wheelDelta < 0) {
        if (this.svg_g_root.scale - 0.1 <= 0.4) {
          this.svg_g_root.scale = 0.3;
        } else {
          this.svg_g_root.scale -= 0.1;
        }
      }
    },
    //外部bound，所有元素矩形区域，默认最外面的元素不进行计算
    getbounding(outerrect) {
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
      var compoent_root = this.$refs["svg_g_components"];
      if (!compoent_root) {
        return;
      }
      var children = compoent_root.children || compoent_root.childNodes;
      for (let i = 0; i < children.length; i++) {
        let item = children[i];

        if (item.nodeType != Node.ELEMENT_NODE) {
          continue;
        }
        let rect = item.getBoundingClientRect();
        let max_x = outerrect ? rect.right : rect.left;
        if (obj.max.x == null || obj.max.x < max_x) {
          obj.max.x = max_x;
        }

        let min_x = outerrect ? rect.left : rect.right;
        if (obj.min.x == null || obj.min.x > min_x) {
          obj.min.x = min_x;
        }

        let max_y = outerrect ? rect.bottom : rect.top;
        if (obj.max.y == null || obj.max.y < max_y) {
          obj.max.y = max_y;
        }
        let min_y = outerrect ? rect.top : rect.bottom;
        if (obj.min.y == null || obj.min.y > min_y) {
          obj.min.y = min_y;
        }
      }
      return obj;
    },
    //自动根据视窗大小，将元素呈现在中间
    autoview() {
      if (!this.$refs["svg_g_components"])
        return;

      var boundary = this.$refs["svg_g_components"].getBoundingClientRect();

      let work_Width = this.$refs["svg_root"].offsetWidth;
      let work_Height = this.$refs["svg_root"].offsetHeight;

      let g_width = boundary.width;
      let g_height = boundary.height;

      let dis_x = g_width - work_Width;
      let dis_y = g_height - work_Height;

      let scalex = 1;
      if (dis_x > 0) {
        scalex = work_Width / g_width;
      }

      let scaley = 1;
      if (dis_y > 0) {
        scaley = work_Height / g_height;
      }

      this.svg_g_root.tx += (0 - dis_x / 2 - boundary.left) * scalex;
      this.svg_g_root.ty += (0 - dis_y / 2 - boundary.top) * scalex;
      let scale = scalex > scaley ? scaley : scalex;
      scale = parseInt(scale * 10) / 10;
      this.svg_g_root.scale = scale;
    },

    autoboundary() {
      let boundary = this.getbounding();

      let ts = {
        x: 0,
        y: 0
      }

      //容器大小，如果容器坐标不是（0，0）要计算
      if (!this.$refs["svg_root"])
        return;
      let root_rect = this.$refs["svg_root"].getBoundingClientRect();
      let root_x = root_rect.x;
      let root_y = root_rect.y;
      let work_Width = this.$refs["svg_root"].offsetWidth;
      let work_Height = this.$refs["svg_root"].offsetHeight;

      if (boundary.min.x > work_Width) {
        ts.x = work_Width - boundary.min.x + root_x + this.root_padding.right; //往左移出边界
      } else if (boundary.max.x < 0) {
        ts.x = 0 - boundary.max.x + root_x + this.root_padding.left; //往右移出边界
      }

      if (boundary.min.y > work_Height) {
        ts.y = work_Height - boundary.min.y + root_y + this.root_padding.bottom; //往下移出边界
      } else if (boundary.max.y < 0) {
        ts.y = 0 - boundary.max.y + root_y + this.root_padding.top; //往上移出边界
      }

      this.moveitem.data.tx += ts.x;
      this.moveitem.data.ty += ts.y;
    },

    init() {
      var root = this.$refs["svg_root"];

      this.root_padding = {
        top: parseInt(this.getStyle(root, "paddingTop")),
        left: parseInt(this.getStyle(root, "paddingLeft")),
        bottom: parseInt(this.getStyle(root, "paddingBottom")),
        right: parseInt(this.getStyle(root, "paddingRight"))
      }

      document.addEventListener("mousemove", this.mousemove_handler)
      document.addEventListener("mouseup", () => {
        if (this.moveitem.isroot) { //拖拽顶层容器时，边距检测，防止将元素移出视图区域
          this.autoboundary();
        }
        this.moveitem.el = null;
        this.moveitem.data = null;
        if (this.mode == 2 && this.line_temp) {
          let to = {
            id: parseInt(Math.random() * 1000000),
            tx: 0,
            ty: 0,
            width: 300,
            height: 120,
            subject: '新元素',
            type: "item-tag",
            ...this.line_temp.to,
            text: ""
          }

          this.addnew(to);
          this.addline(this.line_temp.from.id, to.id);
          this.line_temp = null;
        }
        this.mode = 0;
        this.moveitem.isroot = false;
      })
      document.addEventListener("mousewheel", this.addmousewheel);
      // window.addEventListener("resize", this.autoview);
      if (localStorage.getItem("items")) {
        this.items = JSON.parse(localStorage.getItem("items"))
        this.lines = JSON.parse(localStorage.getItem("lines"))
      }
      this.$nextTick(() => {
        this.autoview();
      })
    },

    getStyle(obj, attr) {
      if (obj.currentStyle) {
        return obj.currentStyle[attr]; //IE 6 7 8 兼容
      } else {
        return getComputedStyle(obj)[attr]; //谷歌 火狐等浏览器兼容
      }
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
    padding-top: 55px;

    .svg-vue-toolbar {
        height: 55px;
        padding-bottom: 1px;
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
                bottom: 1px;
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
                a {
                    display: flex;
                    cursor: pointer;
                    min-width: 60px;
                    align-items: center;
                    justify-content: center;
                    &:hover {
                        background-color: @bg;
                    }
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
        box-shadow: 0 0 20px 1px white;
        z-index: 11;
        .svg_g_root {
            transform-origin: 50% 50%;
        }
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
                stroke-linecap: round;
                stroke-linejoin: round;
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
    .dotted_line {
        stroke-dasharray: 3;
        stroke-dashoffset: 50;
        stroke: @bordercolor1;
        stroke-width: 1;
    }
    .svg-textarea {
        top: 55px;
    }
}
</style>
