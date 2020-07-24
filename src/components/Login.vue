<template>
  <div class="login_container">

    <div class="login_box">
      <!-- 头像 s-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 头像end -->
      <!-- 表单s -->

      <el-form class="login_form">
        <el-form-item>
          <el-input v-model="uname" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="pwd" placeholder="密码" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button type="info" @click="onSubmit">重置</el-button>
        </el-form-item>

      </el-form>
      <!-- 表单e -->
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    border-radius: 5px;
    background-color: #fff;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      width: 130px;
      height: 130px;
      box-shadow: 0 0 10px #fff;
      border: 10px solid #fff;
      background-color: #eee;
      border-radius: 50%;
      position: absolute;
      top: 0%;
      left: 50%;
      transform: translate(-50%, -50%);
      overflow: hidden;
      padding: 10px;
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
      }
    }
  }
}
</style>
