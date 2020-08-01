<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航end -->
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" plain @click="addRoles">添加角色</el-button>
        </el-col>
      </el-row>
          <!-- 添加对话框 -->

      <el-dialog title="权限分配" :visible.sync="rolesDialogVisible" width="50%" @close="closeAddRolesDialog">
          <el-form :model="addRolesForm" :rules="rules" ref="addRolesFormRef" label-width="100px" class="demo-ruleForm">
             <el-form-item label="角色名称" prop="roleName">
               <el-input v-model="addRolesForm.roleName"></el-input>
             </el-form-item>
             <el-form-item label="角色描述" prop="roleDesc">
               <el-input v-model="addRolesForm.roleDesc"></el-input>
             </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAddRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 对话框 -->
      <!-- 表格s -->
      <el-table border stripe :data="rolesList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id"
              :class="['bdline',i1 ===0 ? 'btline':'','vcenter']" closable
              @close="removeRightsById(scope.row,item1.id)">
              <!-- 第一列 -->
              <el-col :span="5">
                <!-- 一级权限标签 -->

                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>

              </el-col>
              <!-- 第二列 -->
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[ i2!==0&&'btline','vcenter']"
                  closable @close="removeRightsById(scope.row,item2.id)">
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="18">
                    <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable
                      @close="removeRightsById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

          </template>

        </el-table-column>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column prop="level" label="操作">
          <template slot-scope="scope">

            <!-- //修改按钮 -->
            <el-tooltip class="item" effect="dark" content="编辑用户" placement="top">
              <el-button id="editBtn" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="删除用户" placement="top">
              <el-button id="delBtn" type="primary" icon="el-icon-delete" @click="removeRole(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 提示文字 + 设置按钮 -->
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
              <el-button id="setBtn" type="primary" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格end -->
                <!--编辑用户加对话框 -->

      <el-dialog title="权限分配" :visible.sync="rolesEditDialogVisible" width="50%" @close="closeEditRolesDialog">
          <el-form :model="addRolesForm" :rules="rules" ref="editRolesFormRef" label-width="100px" class="demo-ruleForm">
             <el-form-item label="角色名称" prop="roleName">
               <el-input v-model="addRolesForm.roleName"></el-input>
             </el-form-item>
             <el-form-item label="角色描述" prop="roleDesc">
               <el-input v-model="addRolesForm.roleDesc"></el-input>
             </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rolesEditDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 对话框 -->

      <!-- 对话框 -->

      <el-dialog title="权限分配" :visible.sync="rightsDialogVisible" width="50%" @close="closeSetRightDialog">
        <el-tree :data="rightsList" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current
          :default-checked-keys="defKeys" :props="defaultProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitCheckedKeys">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 对话框 -->

    </el-card>
    <!-- 卡片视图区域 end-->
  </div>
</template>

<script>
export default {
  props: [],
  data () {
    return {
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      rightsDialogVisible: false,
      rolesEditDialogVisible: false,
      rolesList: [],
      rightsList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [], // 默认选中的三级下拉框节点
      roleId: '', // 当前角色的id
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      rolesDialogVisible: false,
      editRoleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      res.meta.status === 200
        ? (this.rolesList = res.data)
        : this.$message.error('获取角色列表失败!')
    },
    removeRightsById (id1, id2) {
      this.$confirm('是否要移除此权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${id1.id}/rights/${id2}`
          )

          res.meta.status === 200
            ? this.$message.success('取消权限成功!') &&
              (id1.children = res.data)
            : this.$message.error('取消权限失败!')
        })
        .catch(() => {
          this.message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async showSetRightDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')

      this.rightsList = res.data
      this.rightsDialogVisible = true
      this.gitdeepKeys(role, this.defKeys)
    },
    async submitCheckedKeys () {
      // 点击分配权限的确定按钮后
      const hanfKeys = this.$refs.tree.getHalfCheckedKeys()
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const arr = [...hanfKeys, ...checkedKeys].join(',')
      console.log(arr)
      try {
        const {
          data: res
        } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: arr })
        res.meta.status === 200
          ? this.$message.success('更新权限成功!') && this.getRolesList()
          : this.$message.error('更新权限失败!')
      } catch (error) {
        this.$message.error('更新权限失败!')
      } finally {
        this.rightsDialogVisible = false
      }
    },
    gitdeepKeys (data, arr) {
      // 递归获取三级children的 id
      if (!data.children) {
        arr.push(data.id)
      } else {
        data.children.forEach(item => {
          return this.gitdeepKeys(item, arr)
        })
      }
    },
    // 关闭dialog
    closeSetRightDialog () {
      this.defKeys = []
    },
    // 添加角色
    addRoles () {
      this.rolesDialogVisible = true
    },
    // 关闭添加角色对话框
    closeAddRolesDialog () {
      console.log(this.$refs.addRolesFormRef)
      this.$refs.addRolesFormRef.resetFields()
    },
    // 提交添加角色
    async  submitAddRoles () {
      try {
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        res.meta.status === 201 && this.$message.success('添加角色成功!') && this.getRolesList()
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.$refs.addRolesFormRef.resetFields()
        this.rolesDialogVisible = false
      }
    }, // 删除角色
    removeRole (id) {
      console.log(id)
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const { data: res } = await this.$http.delete('roles/' + id)
          res.meta.status === 200 && this.$message.success('删除角色成功！') && this.getRolesList()
        } catch (error) {
          this.$message.error(error)
        }
      }).catch(() => {
        this.message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑角色
    async  handleEdit (row) {
      try {
        const { data: res } = await this.$http.get('roles/' + row.id)
        if (res.meta.status === 200) {
          this.addRolesForm = res.data
          this.editRoleId = row.id
        }
        console.log(res)
      } catch (error) {
        this.$message.error(error)
      }

      this.rolesEditDialogVisible = true
    },
    async  submitEditRoles () {
      try {
        const { data: res } = await this.$http.put('roles/' + this.editRoleId, this.addRolesForm)
        res.meta.status === 200 && this.$message.success('编辑成功!') && this.getRolesList()
        console.log(res)
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.rolesEditDialogVisible = false
      }
    },
    closeEditRolesDialog () {
      this.$refs.editRolesFormRef.resetFields()
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
}
#delBtn {
  background-color: rgb(175, 77, 77);
}
.el-tag {
  margin: 7px;
}
.btline {
  border-top: 1px solid #ccc;
}
.bdline {
  border-bottom: 1px solid #ccc;
  margin-top: 10px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
