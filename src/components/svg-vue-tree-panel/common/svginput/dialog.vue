<template>
<el-dialog title="提示" :visible.sync='show' width="30%" class="svg_textarea" :before-close='closed'>
  <div slot='title'>
  </div>
  <textarea v-model='text' @input='input'></textarea>
  <div class="tright">
    {{text.length}}/50
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="$emit('cancel')">取 消</el-button>
    <el-button type="primary" @click='sure'>确 定</el-button>
  </span>
</el-dialog>
</template>
<script>
export default {
  props: {
    item: {
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
      show: true,
      text: this.item.text
    }
  },
  methods: {
    input() {
      if (this.text.length > 50) {
        this.text = this.text.substring(0, 50);
      }
    },
    sure() {
      this.item.text = this.text;
      this.$emit("cancel");
    },
    closed(done) {
      this.$emit("cancel");
      done();
    }
  }
}
</script>
<style lang="less">
.svg_textarea {
    textarea {
        width: 100%;
        height: 200px;
        resize: none;
        background-color: #FFFFCC;
        border-radius: 3px;
    }
    .tright {
        text-align: right;
    }
    .el-dialog__body {
        padding-bottom: 10px;
    }
}
</style>
