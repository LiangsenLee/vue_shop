<template>
    <div>

<img src="../assets/bg.jpg" alt="">

    </div>
</template>
<script>
export default {
  props: [],
  data () {
    return {
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value1: [],
      value2: []
    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
img{
    margin: 0;
    padding: 0;
    height: 100%;
}
</style>
