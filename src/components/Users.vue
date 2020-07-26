<template>
  <div>
    <h3>用户列表组件</h3>
    <!-- 面包屑导航 -->

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="resetSearch">
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="addBtn" type="primary" @click='centerDialogVisible=true'>添加用户</el-button>
        </el-col>
      </el-row>
      <!-- dialog -->
      <el-dialog title="添加用户" :visible.sync="centerDialogVisible" width="50%" center @close='addFormClose'>

          <!-- 表单s  -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >

          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" >
            <el-input v-model="addForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 表单end -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
      </el-dialog>
      <!-- dialog end -->
    </el-card>
    <!-- 表格 -->
    <el-table border stripe :data="userList" style="width: 100%">
      <el-table-column type="index" label="#">
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="电话">
      </el-table-column>
      <el-table-column prop="role_name" label="角色">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">

          <el-switch active-color="#14bdcc" v-model="scope.row.mg_state" inactive-color="#ccc"
            @change="stateChange(scope)">
          </el-switch>
        </template>

      </el-table-column>
      <el-table-column label="操作">

        <template slot-scope="scope">

          <!-- //修改按钮 -->
          <el-tooltip class="item" effect="dark" content="编辑用户" placement="top" @click="editUser(scope.row)">
            <el-button id="editBtn" type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <!-- 删除按钮 -->
          <el-tooltip class="item" effect="dark" content="删除用户" placement="top">
            <el-button id="delBtn" type="primary" icon="el-icon-delete"></el-button>
          </el-tooltip>
          <!-- 提示文字 + 设置按钮 -->
          <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
            <el-button id="setBtn" type="primary" icon="el-icon-setting"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
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
  </div>
</template>
<script>
export default {
  props: [],
  data () {
    const validateMobile = (rule, value, callback) => {
      const mobileReg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/
      if (!value) {
        callback(new Error('请输入手机号码!'))
      } else if (!mobileReg.test(value)) {
        callback(new Error('请输入正确的手机号码!'))
      } else {
        callback()
      }
    }

    return {

      queryInfo: {
        query: '', // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 2 // 每页条数
      },
      userList: [],
      total: 1,
      centerDialogVisible: false, // 添加用户是否弹出对话框
      // 添加用户 表单验证
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', required: true, message: '请输入正确的邮箱地址', trigger: 'blur' }

        ],
        mobile: [
          { validator: validateMobile, trigger: 'blur' }
        ]
      }, // 添加用户的表单规则
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }// 添加用户表单数据
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表 请求
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听每页显示多少条
    handleSizeChange (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听当前页码变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    // 监听switch开关变化
    async stateChange (val) {
      console.log(val)
      const { data: res } = await this.$http.put(
        `users/${val.row.id}/state/${val.row.mg_state}`
      )

      res.meta.status === 200
        ? this.$message.success('修改用户状态成功!')
        : this.$message.error('修改用户状态失败!') &&
          (val.row.mg_state = !val.row.mg_state)
    },
    // 搜索
    searchUser () {
      this.getUserList()
    },
    // 清空搜索框后
    resetSearch () {
      this.getUserList()
    },
    // 关掉dialog然后清掉表单内容
    addFormClose () {
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      // 添加用户
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        try {
          const { data: res } = await this.$http.post('users', this.addForm)
          res.meta.status === 201 && this.getUserList() && this.$message.success('添加成功!') && (this.centerDialogVisible = false)
        } catch (error) {
          this.$message.error(error) && (this.centerDialogVisible = false)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  .addBtn {
    background-color: #59c3c8;
  }
}

#setBtn,
#editBtn {
  background-color: #59c3c8 !important;
}
#delBtn {
  background-color: rgb(175, 77, 77);
  border-color: rgb(56, 56, 56);
}
</style>
