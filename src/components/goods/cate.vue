<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航end -->
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" plain @click="showCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 对话框 -->

      <el-dialog title="添加分类" :visible.sync="cateDialogVisible" width="50%" @close="closeAddCateDialog">
        <el-form :model="addCateForm" :rules="rules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader v-model="selectedKeys" clearable  :options="parentCateList" change-on-select   :props="cascaderProps" @change="parentCateChange">
            </el-cascader>

          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAddCateDialog">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 对话框 -->
      <!-- 表格s -->
      <zk-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index
        index-text="#" border>

        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:#00adb5"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row._level===1">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row._level===2">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>

        <template slot="opt" slot-scope="">
          <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          <el-button type="primary" size="small" icon="el-icon-delete" class="del">删除</el-button>
        </template>

      </zk-table>
      <!-- 表格end -->
      <!-- 分页s  -->

      <!-- 分页导航区域
        @size-change(pagesize改变时触发)
        @current-change(页码发生改变时触发)
        :current-page(设置当前页码)
        :page-size(设置每页的数据条数)
        :total(设置总页数) -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1,2,5,10]" :page-size="queryInfo.pagesize"
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
      // 添加分类显示与隐藏
      cateDialogVisible: false,
      // 添加分类表单
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 分类数据
      cateList: [],
      // 2级的分类
      parentCateList: [],
      queryInfo: {
        // 当前页码值
        pagenum: 1,
        // 每页显示多少条
        pagesize: 5
      },
      total: undefined,
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 级联选择到的id
      selectedKeys: [],
      // 级联选择配置
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },

      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ] // 表格列数据
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      try {
        const { data: res } = await this.$http.get('categories', {
          params: this.queryInfo
        })
        if (res.meta.status === 200) {
          this.cateList = res.data.result
          this.total = res.data.total
        }
      } catch (error) {
        this.$message.error('获取商品分类列表失败!')
      }
    },
    async getParentCateList () {
      try {
        const { data: res } = await this.$http.get('categories', {
          params: { type: 2 }
        })
        if (res.meta.status === 200) {
          this.parentCateList = res.data
        }
      } catch (error) {
        this.$message.error('获取商品分类列表失败!')
      }
    },
    showCateDialog () {
      this.getParentCateList()
      this.cateDialogVisible = true
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    handleSizeChange (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    closeAddCateDialog () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    submitAddCateDialog () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        try {
          const { data: res } = await this.$http.post('categories', this.addCateForm)
          console.log(res)
          res.meta.status === 201 ? this.$message.success('添加分类成功!') && this.getCateList() : this.$message.info(res.meta.msg)
        } catch (error) {
          this.$message.error(error)
        } finally {
          this.cateDialogVisible = false
        }
      })
    },
    // 级联选择框change
    parentCateChange () {
      // 如果选择两个分类 那么说明添加的是三级分类
      switch (this.selectedKeys.length) {
        case 0:
          this.addCateForm.cat_level = 0
          this.addCateForm.cat_pid = 0
          break
        case 1:
          this.addCateForm.cat_level = 1
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          break
        case 2:
          this.addCateForm.cat_level = 2
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          break
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  .el-button {
    margin-bottom: 20px;
    background-color: #59c3c8;
    color: #fff;
  }
  .el-pagination {
    margin-top: 30px;
  }
  .del {
    background-color: rgb(161, 73, 73);
  }
  .el-cascader{
      width: 100%;
  }
}
</style>
