
<template>
  <div class="login_container">

    <div class="login_box">
      <!-- 头像 s-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 头像end -->
      <!-- 表单s -->

    <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="LoginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username"  placeholder="用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password"  placeholder="密码" show-password prefix-icon="el-icon-lock"  @keyup.enter.native="onSubmit" ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>

    </el-form>
      <!-- 表单e -->
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      LoginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    onSubmit () {
      console.log(111)
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false
        try {
          const { data: res } = await this.$http.post('/login', this.loginForm)
          console.log(res)
          res.meta.msg === '登录成功' && this.$message.success('登录成功!')
          this.resetLoginForm()
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        } catch (error) {
          console.log(error)
          this.$message.error('登录失败!')
        }
      })
    },
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    }

  }
}
</script>

<style lang="less" scoped>

.login_container {
  background-color: #252a34;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.157);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      width: 130px;
      height: 130px;
      box-shadow: 0 0 10px 1px #ccc;
      border: 5px solid #fff;
      background-color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 0%;
      left: 50%;
      transform: translate(-50%, -50%);
      overflow: hidden;
    //   padding: 10px;
      img {
        width: 100%;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;

      .btns {
        display: flex;
        justify-content: flex-end;
        .el-button:first-child{
            background-color: #252a34b4 ;
            border-color: rgba(0, 0, 0, 0.452);
            &:hover{
                 background-color: #11141bb4 ;
            }
        }
        .el-button:last-child{
            background-color: #5d5d5db4 ;
            border-color: rgba(0, 0, 0, 0.452);
            &:hover{
                 background-color: rgba(64, 67, 73, 0.706) ;
            }

        }
      }
    }
  }
}
</style>
