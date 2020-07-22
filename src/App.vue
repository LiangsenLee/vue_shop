<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div>
     <el-badge :value="200" :max="99" class="item">
        <el-button size="small">评论</el-button>
    </el-badge>
    <el-badge :value="100" :max="10" class="item">
        <el-button size="small">回复</el-button>
    </el-badge>

      <el-button>el-button</el-button>
    </div>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
