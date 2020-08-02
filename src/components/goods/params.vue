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
          <el-cascader v-model="selectKeys" :options="cateList" :props="casProps" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- 选择商品分类end -->

      <!-- tab区域s  -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 面板1 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isSelect3" size="mini" @click="showAddDialog">添加参数</el-button>
        </el-tab-pane>
        <!-- 面板2 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isSelect3" size="mini" @click="showAddDialog">添加属性</el-button>
        </el-tab-pane>

      </el-tabs>
      <!-- tab区域e   -->

      <!-- 动态表格区域s  -->
      <el-table border stripe :data="manyTabData" style="width: 100%" v-if='activeName==="many"'>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag closable v-show='item.length>=1' @close="handleCloseTag(scope.row,index)" class="expandTag" v-for="(item,index) in scope.row.attr_vals"
              :key="index">{{item}}</el-tag>
            <!-- +newtag -->

            <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

            <!-- +newtag end  -->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#">
        </el-table-column>

        <el-table-column prop="attr_name" label="参数名称">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" size="mini" type="success" @click="editCateAttr(scope.row.attr_id)">修改
            </el-button>
            <el-button icon="el-icon-delete" size="mini" type="danger" @click="delCateAttr(scope.row.attr_id)">删除
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 静态表格 -->
      <el-table border stripe :data="staticTabData" style="width: 100%" v-if='activeName==="only"'>
          <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag closable v-show='item.length>=1' @close="handleCloseTag(scope.row,index)" class="expandTag" v-for="(item,index) in scope.row.attr_vals"
              :key="index">{{item}}</el-tag>
            <!-- +newtag -->

            <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

            <!-- +newtag end  -->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#">
        </el-table-column>

        <el-table-column prop="attr_name" label="属性名称">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" size="mini" type="success" @click="editCateAttr(scope.row.attr_id)">修改
            </el-button>
            <el-button icon="el-icon-delete" size="mini" type="danger" @click="delCateAttr(scope.row.attr_id)">删除
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 表格区域end -->
      <!-- 添加dialog -->
      <el-dialog width="50%" :title="'添加'+titleText" :visible.sync="addDialogVisible" @close="addDialogClose">
        <!-- 表单 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">

          <el-form-item :label="titleText+'名称'" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 表单 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAddForm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- dialog -->
      <!-- 修改dialog -->
      <el-dialog width="50%" :title="'修改'+titleText" :visible.sync="editDialogVisible" @close="editDialogClose">
        <!-- 表单 -->
        <el-form :model="editForm" :rules="addFormRules" ref='editFormRef' label-width="100px">

          <el-form-item :label="titleText+'名称'" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 表单 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditForm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- dialog -->
    </el-card>
  </div>
</template>
<script>
export default {
  props: [],
  data () {
    return {
      cateList: [],
      // 级联选择框的配置
      casProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: false
      },
      // 选中的id
      selectKeys: [],
      // 选中的tab栏
      activeName: '',
      manyTabData: [],
      staticTabData: [],
      // 添加的对话框
      addDialogVisible: false,
      addForm: {
        // 添加参数的表单
        attr_name: '',
        attr_sel: ''
      },
      editForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入添加内容', trigger: 'blur' }
        ]
      },
      // 编辑对话框
      editDialogVisible: false,
      editId: '' // 在编辑的属性ID

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      try {
        const { data: res } = await this.$http.get('categories')
        res.meta.status === 200 && (this.cateList = res.data)
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 点击添加
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 级联选择框变化时
    handleChange () {
      if (this.selectKeys.length < 3) {
        this.selectKeys = []
        this.manyTabData = []
        this.staticTabData = []
      }
      this.getParmas()
    },
    // 获取动静态参数的函数
    async getParmas () {
      if (this.selectKeys.length === 3) {
        try {
          const { data: res } = await this.$http.get(
            `categories/${this.selectId}/attributes`,
            {
              params: { sel: this.activeName === 'only' ? 'only' : 'many' }
            }
          )
          if (res.meta.status === 200) {
            this.$message.success('获取参数成功')

            res.data.map(item => {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
              item.inputVisible = false
              item.inputValue = ''
            })
            console.log(res, 'map后')
            this.activeName === 'many'
              ? (this.manyTabData = res.data)
              : (this.staticTabData = res.data)
          } else {
            this.$message.error('获取参数失败')
          }
        } catch (error) {
          this.$message.error(error)
        }
      }
    },
    // tab 栏点击
    handleTabClick () {
      this.getParmas()
      this.addForm.attr_sel = this.activeName
    },
    // 添加对话框关闭
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定添加
    submitAddForm () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        try {
          const { data: res } = await this.$http.post(
            `categories/${this.selectId}/attributes`,
            this.addForm
          )
          console.log(res)
          res.meta.status === 201 &&
            this.$message.success('添加成功!') &&
            this.getParmas()
        } catch (error) {
          this.$message.error(error)
        } finally {
          this.addDialogVisible = false
        }
      })
    },
    async editCateAttr (id) {
      // 点击 修改按钮
      this.editId = id
      this.editDialogVisible = true
      try {
        const { data: res } = await this.$http.get(
          `categories/${this.selectId}/attributes/${id}`
        )
        console.log(res)
        res.meta.status === 200 && (this.editForm = res.data)
      } catch (error) {
        this.$message.error('获取参数失败!')
      }
    },
    // 提交编辑表单
    submitEditForm () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        try {
          const { data: res } = await this.$http.put(
            `categories/${this.selectId}/attributes/${this.editId}`,
            this.editForm
          )
          console.log(res)
          res.meta.status === 200
            ? this.$message.success('修改成功!') && this.getParmas()
            : this.$message.error('修改失败!')
        } catch (error) {
          this.$message({
            message: '修改失败!',
            type: 'error'
          })
        } finally {
          this.editDialogVisible = false
        }
      })
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 删除
    delCateAttr (id) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            const { data: res } = await this.$http.delete(
              `categories/${this.selectId}/attributes/${id}`
            )
            res.meta.status === 200
              ? this.$message.success('删除成功!') && this.getParmas()
              : this.$message.error('删除失败!')
          } catch (error) {
            this.$message.error('删除失败!')
          }
        })
        .catch(() => {
          this.$message.info('已取消删除!')
        })
    },
    showInput (row) {
      // 显示+newtag 的输入框
      row.inputVisible = true

      this.$nextTick(_ => {
        // $nextTick 当页面上元素被重新渲染后,才执行的回调函数
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async  handleInputConfirm (row) {
      // 点了回车 或者失去焦点
      console.log(row)
      if (!row.inputValue.trim()) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      try {
        const { data: res } = await this.$http.put(`categories/${this.selectId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        res.meta.status === 200 ? this.$message.success('添加tag成功!') : this.$message.error('添加tag失败!')
        console.log(res, '--------res')
      } catch (error) {
        this.$message.error(error)
      }
    },
    async handleCloseTag (row, index) {
      // 关掉标签的时候
      console.log(row.attr_vals)
      row.attr_vals.splice(index, 1)
      // 发请求 将改动同步到 后台
      try {
        const { data: res } = await this.$http.put(`categories/${this.selectId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        res.meta.status === 200 ? this.$message.success('删除tag成功!') : this.$message.error('删除tag失败!')
        console.log(res, '--------res')
      } catch (error) {
        this.$message.error(error)
      }
    }
  },

  computed: {
    isSelect3 () {
      return this.selectKeys.length !== 3
    },
    selectId () {
      return this.selectKeys.length === 3 ? this.selectKeys[2] : null
    },
    titleText () {
      return this.activeName === 'many' ? '参数' : '属性'
    }
  }
}
</script>
<style lang="less" scoped>
.m30 {
  margin: 30px 0;
}
.el-tabs {
  .el-button {
    margin-bottom: 10px;
  }
}
.expandTag {
  margin-left: 10px;
}

 .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
