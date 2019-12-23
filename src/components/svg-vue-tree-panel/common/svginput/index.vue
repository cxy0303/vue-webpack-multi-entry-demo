<template>
<div class="svg-textarea" :style='rootStyle'>
  <textarea v-model='text' :style='style' @blur='blur' ref='textarea'></textarea>
  <div class="div_height" contenteditable="true" v-html='text.replace(/\n/g,"<br />")' :style='style'>
  </div>
</div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: {

      }
    },
    root: {
      type: Object,
      default: {

      }
    }
  },
  model: {
    prop: "item",
    event: "change"
  },
  data() {
    return {
      text: this.item.text
    }
  },
  computed: {
    rootStyle() {
      return {
        transform: `translate(${this.tx}px,${this.ty}px)`
      }
    },
    style() {
      var style = {
        minWidth: this.item.width + "px",
        minHeight: this.item.height + "px",
        ...this.item.style
      }
      return style;
    },
    tx() {
      return this.item.tx + this.root.tx;
    },
    ty() {
      return this.item.ty + this.root.ty;
    }
  },
  methods: {
    blur() {
      this.item.text = this.text;
      this.$emit("cancel");
    }
  },
  watch: {

  },
  mounted() {
    this.$nextTick(() => {
      this.$refs["textarea"].focus();
    })
  }
}
</script>
<style lang="less">
.svg-textarea {
    position: absolute;
    top: 100px;
    left: 0;
    z-index: 21;
    display: inline-block;
    overflow: hidden;
    textarea {
        border-radius: 5px;
        background-color: #FFFFCC;
        width: 100%;
        height: 100%;
        resize: none;
        border: none;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }
    .div_height {
        padding: 10px;
    }
}
</style>
