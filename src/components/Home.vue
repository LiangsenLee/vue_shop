
<template>

  <el-container class="home-container">
    <el-header height="70px" class="header">
      <div class="img">
        <img src="../assets/logo2.png" alt="">
        <span>Vue App</span>
      </div>
      <el-button type="info" @click="logout" around>退出</el-button>
    </el-header>
    <!-- 头部end -->
    <el-container>
      <!-- //侧边栏s -->
  <el-aside :width=" isCollapse  ? '65px' :'200px' ">
      <div class="toggleCollapse" @click="isCollapse = !isCollapse">|||</div>
          <!-- 侧边栏菜单 -->
          <el-menu  background-color="#383838" unique-opened :collapse="isCollapse" :collapse-transition="false" router default-active="$route.path">

            <!-- 一级菜单 -->

            <el-submenu :index="'/'+item.path" :key='item.id' v-for="item in menuList">
              <!-- 一级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级子菜单 -->
               <el-menu-item-group>
              <el-menu-item :index= "'/'+i.path" v-for=" i in item.children " :key="i.id">
                <!-- 二级菜单模板 -->
                <template slot="title">
                  <!-- 图标 -->
                    <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{i.authName}}</span>
                </template>
              </el-menu-item>
               </el-menu-item-group>
            </el-submenu>

          </el-menu>
        </el-aside>
      <!-- 侧边栏end -->
      <!-- main s -->
      <el-main>
          <router-view></router-view>
      </el-main>
       <!-- main end -->
    </el-container>
  </el-container>

</template>
<script>
export default {
  props: [],
  data () {
    return {
      menuList: null,
      iconsObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-warning',
        101: 'el-icon-s-goods',
        102: 'el-icon-tickets',
        145: 'el-icon-s-platform'
      },
      isCollapse: false

    }
  },
  mounted () {},
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      this.menuList = res.data
    },
    // 保存链接的激活状态
    saveNavState (path) {

    }
  },
  created () {
    this.getMenuList()
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
  .header {
    background-color: #424242;
    color: #14bdcc;
    padding: 5px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
box-shadow: 1px 1px 3px 1px #ccc;

    .img {
      height: 100%;
      display: flex;
      align-items: center;

      img {
        height: 100%;
        margin-right: 20px;
      }
    }
  }

  .el-aside {
    background-color: #383838;
    color: #d1d3d3;
    box-shadow: 1px 1px 3px 1px #ccc;
    height: 100%;
    .toggleCollapse{
        text-align: center;
        background-color: #434646;
        cursor: pointer;
        color: #a3a6a7;

    }
    .aside-menu{
        color: #f6fafa !important;

    }
      .item-two{
            padding-left: 20px;
        }
        .el-menu-item{
        color: aliceblue ;
        &:hover{
            color: rgb(64, 158, 255) !important;
        }
    }

  }

.el-main {
    background-color: #fff;
    color: #00adb5;
    height: 100%;
  }
}
</style>
