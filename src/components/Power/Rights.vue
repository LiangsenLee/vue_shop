<template>
    <div>
          <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
 <!-- 面包屑导航end -->
    <!-- 卡片视图区域 -->
    <el-card>

 <!-- 表格s -->
    <el-table border stripe :data="rightsList" style="width: 100%">
      <el-table-column type="index" label="#">
      </el-table-column>
      <el-table-column prop="authName" label="权限名称" >
      </el-table-column>
      <el-table-column prop="path" label="路径" >
      </el-table-column>
      <el-table-column prop="level" label="权限层级">
          <template slot-scope="scope">
              <el-tag v-if="scope.row.level==='0'" >一级</el-tag>
              <el-tag type="success"  v-else-if="scope.row.level==='1'" >二级</el-tag>
              <el-tag type="warning" v-else >三级</el-tag>
          </template>
      </el-table-column>
    </el-table>
 <!-- 表格end -->
    </el-card>
    </div>
</template>
<script>
export default {
  props: [],
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async  getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      res.meta.status === 200 ? this.rightsList = res.data : this.$message.error('获取权限列表失败!')
    }
  }
}
</script>
<style lang="less" scoped>

</style>
