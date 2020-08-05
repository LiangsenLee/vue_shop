<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>

      <!-- 搜索与添加区域 -->
      <el-row :gutter="20" class="sea-row">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="resetSearch">
            <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格区域s -->

      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay">
          <template v-slot="scope">
            <div>
              <el-tag :type="scope.row.pay_status===1? 'success':'danger'">{{scope.row.order_pay===1? '已付款': '未付款'}}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否发货">
          <template v-slot="scope">
            <div>
              {{scope.row.is_send}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">
            <div>
              {{scope.row.create_time*1000 | dateFormat}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">

          <template v-slot="scope">
            <el-button id="editBtn" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            <el-button id="setBtn" type="success" icon="el-icon-location" @click="showProgress"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格区域 end-->
    </el-card>
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
    <el-dialog title="提示" :visible.sync="editdialogVisible" width="50%" >
  <!-- 添加表单 -->
    <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区县" prop="address1">
            <el-cascader :options="cityData" v-model="addressForm.address1" :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息进度对话框 -->
<el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
    <!-- 时间线组件  -->
    <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo"
        :key="index" :timestamp="activity.time">
            {{activity.context}}
        </el-timeline-item>
    </el-timeline>
</el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  props: [],
  data () {
    return {
      queryInfo: {
        query: '', // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 10 // 每页条数
      },
      // 保存物流信息
      progressInfo: [],
      orderList: [],
      total: 0,
      editdialogVisible: false,
      progressVisible: false,
      // 将导入的cityData数据保存起来
      cityData: cityData,
      addressForm: {
        address1: '',
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }

        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }

        ]
      }
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async  getOrderList () {
      try {
        const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
        res.meta.status === 200 ? (this.orderList = res.data.goods) && (this.total = res.data.total) : this.$message.error('获取数据失败!请刷新后重试')
        console.log(res)
      } catch (error) {
        this.$message.error('获取订单列表失败,失败信息:' + error)
      }
    },
    resetSearch () {
      this.getOrderList()
    },
    searchOrder () {
      this.getOrderList()
    },
    handleSizeChange (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听当前页码变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getOrderList()
    },
    handleEdit () {
      this.editdialogVisible = true
    },
    async showProgress () {
      this.progressVisible = true
      // 发送请求获取物流数据
      const { data: res } = await this.$http.get('/kuaidi/1125988353145763751')
      console.log(res, '---------res')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败!')
      }
      this.progressInfo = res.data
      // 显示对话框
      this.progressVisible = true
    }

  }
}
</script>
<style lang="less" scoped>
.sea-row {
  margin-bottom: 20px;
}
</style>
