<template>
    <div>
        <h1>这里是home</h1>
        <el-button type="info" @click="logout">退出登录</el-button>
    </div>
</template>
<script>
export default {
  props: [],
  data () {
    return {

    }
  },
  mounted () {

  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>

</style>
