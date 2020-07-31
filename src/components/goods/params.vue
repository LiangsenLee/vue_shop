<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航end -->
    <!-- 卡片视图区域 -->
    <el-card>
        <el-alert type="warning" title="注意：只允许为第三级分类设置参数" :closable='false' show-icon></el-alert>
        <!-- 选择商品分类s -->
        <el-row class="m30">
            <el-col>
                <span>选择商品分类：</span>
            </el-col>
        </el-row>
        <!-- 选择商品分类end -->
      <el-row>
        <el-col>
          <el-button type="primary" plain @click="showCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  props: [],
  data () {
    return {}
  },
  mounted () {},
  methods: {}
}
</script>
<style lang="less" scoped>
.m30{
    margin: 30px 0;
}
</style>
