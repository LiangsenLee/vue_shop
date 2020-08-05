<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航end -->
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" @keyup.enter.native="searchGoods" clearable @clear="resetSearch"  >
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="addBtn" type="primary" @click='goAddPage'>添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table区域s  -->
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="180">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="180">
        </el-table-column>
        <el-table-column  label="更新时间" width="220">
            <template slot-scope="scope">
               {{scope.row.upd_time*1000 | dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="280">

        <template slot-scope="scope">

          <!-- //修改按钮 -->
            <el-button id="editBtn" type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <!-- 删除按钮 -->
            <el-button id="delBtn" type="primary" size="mini" icon="el-icon-delete" @click="removeGoods(scope.row)">删除</el-button>
        </template>
        </el-table-column>

      </el-table>
      <!-- table区域e   -->

       <!-- 分页s  -->
    <!-- 分页导航区域
        @size-change(pagesize改变时触发)
        @current-change(页码发生改变时触发)
        :current-page(设置当前页码)
        :page-size(设置每页的数据条数)
        :total(设置总页数) -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum" :page-sizes="[5,10,20,50]" :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 分页end -->
    </el-card>
    <!-- 卡片视图区域 end-->
  </div>
</template>
<script>
export default {
  props: [],
  data () {
    return {
      // 商品列表
      goodsList: [],
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总数据量
      total: 0,
      addDialogVisible: false
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      try {
        const { data: res } = await this.$http.get('goods', {
          params: this.queryInfo
        })
        if (res.meta.status === 200) {
          this.goodsList = res.data.goods
          this.total = res.data.total
        }
        console.log(res, '-------------商品列表')
      } catch (error) {
        this.$message.error('获取参数失败!')
        console.log(error)
      }
    },
    handleEdit () {
      console.log('handleEdit')
    },
    resetSearch () {
      this.getGoodsList()
    },
    searchGoods () {
      this.getGoodsList()
    },

    removeGoods (row) {
      // 删除商品
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const { data: res } = await this.$http.delete('goods/' + row.goods_id)
          res.meta.status === 200 ? this.$message.success('删除成功!') && this.getGoodsList() : this.$message.error('删除失败!')
          console.log(res)
        } catch (error) {
          this.$message.error('删除失败!')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听当前页码变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    goAddPage () {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped>
.el-table{
    margin-top: 20px;
}
 #delBtn{
    background-color: rgb(233, 61, 61);
    border: 0;
    &:hover{
         background-color: rgb(246, 90, 90);
    }
}

</style>
