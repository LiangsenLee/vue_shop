<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert show-icon title="添加商品信息" type="info" :closable="false">
      </el-alert>
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 步骤end -->
      <!-- 表单 -->
      <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- tab栏 -->
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabsLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number" @input.native='priceValidate'></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" @input.native='weightValidate' type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input @input.native='goodsValidate' v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="casProps" @change="handleChange">
              </el-cascader>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyList" :key='item.attr_id' :label="item.attr_name">
              <el-checkbox-group v-model='item.attr_vals'>
                <el-checkbox border v-for="(i,index) in item.attr_vals" :key="index" :label="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in staticListData" :key='item.attr_id' :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview"
              :on-success="handleSuccess" :on-remove="handleRemove" list-type="picture" :headers="headersObj">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor  v-model="addForm.goods_introduce" class="editor"  />
        <el-button type='primary' class="btnAdd" @click="addFormSubmit">添加商品</el-button>
          </el-tab-pane>

        </el-tabs>
        <!-- tab栏 end-->
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="picDialogVisible" width="50%">
      <el-image style="width: 100%" :src="picUrl">
      </el-image>
    </el-dialog>
  </div>
</template>
<script>
var _ = require('lodash')
export default {

  props: [],
  data () {
    return {
      activeIndex: 0,
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        goods_cat: [],
        pics: [], // 上传图片得到的路径
        attrs: []
      },
      addFormrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      // 级联选择框的配置
      casProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: false
      },

      // 参数列表
      manyList: [],
      // 静态属性
      staticListData: [],

      headersObj: {
        // 图片上传的 header
        Authorization: sessionStorage.getItem('token')
      },
      picUrl: '', // 图片路径
      picDialogVisible: false,
      content: ''
      // 富文本编辑器输入内容
    }
  },
  mounted () {
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
    handleChange () {
      this.addForm.goods_cat.length < 3 &&
        (this.addForm.goods_cat = []) &&
        this.$message.warning('请选择一个三级分类!')
    },
    // 下面几个是对价格 重量 商品进行监听,他们不能为负数
    priceValidate (e) {
      console.log(e.target.value, 'eeee')
      this.addForm.goods_price = e.target.value < 0 ? 0 : e.target.value
    },
    weightValidate (e) {
      this.addForm.goods_weight = e.target.value < 0 ? 0 : e.target.value
    },
    goodsValidate (e) {
      this.addForm.goods_number = e.target.value < 0 ? 0 : e.target.value
    },
    beforeTabsLeave (activeName, oldActiveName) {
      // 在tabs 要切换的时候 如果没选分类  那么...
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择分类!')
        return false
      }
    },
    async tabClicked () {
      // 点击tabs 的时候
      console.log(this.activeIndex, '选中的')
      if (this.activeIndex === '1') {
        try {
          const { data: res } = await this.$http.get(
            `categories/${this.cateId}/attributes`,
            {
              params: { sel: 'many' }
            }
          )
          res.data &&
            res.data.map(t => {
              t.attr_vals = !t.attr_vals ? t.attr_vals : t.attr_vals.split(' ')
            })
          res.meta.status === 200
            ? (this.manyList = res.data)
            : this.$message.error('获取参数列表失败!')
          console.log(res)
        } catch (error) {
          this.$message.error('获取参数列表失败!错误信息:' + error)
        }
      } else if (this.activeIndex === '2') {
        try {
          const { data: res } = await this.$http.get(
            `categories/${this.cateId}/attributes`,
            {
              params: { sel: 'only' }
            }
          )
          res.meta.status === 200
            ? (this.staticListData = res.data)
            : this.$message.error('获取参数列表失败!')
          console.log(res)
        } catch (error) {
          this.$message.error('获取参数列表失败!错误信息:' + error)
        }
      }
    },
    handlePreview (file) {
      // 图片预览
      console.log(file)
      this.picUrl = file.url
      this.picDialogVisible = true
    },
    // 删除图片
    handleRemove (file) {
      console.log(file)
      const path = file.response.data.tmp_path
      const idx = this.addForm.pics.findIndex(t => t.pic === path)

      this.addForm.pics.splice(idx, 1)
    },
    handleSuccess (res) {
      // 上传成功时
      console.log(res, 'res')
      this.addForm.pics.push({ pic: res.data.tmp_path })
    },
    addFormSubmit () {
      // 点了添加按钮
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyList.forEach(item => {
          form.attrs.push({ attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') })
        })
        // 处理静态属性
        this.staticListData.forEach(item => {
          form.attrs.push({ attr_id: item.attr_id, attr_value: item.attr_vals })
        })
        console.log(form, 'form--------!!')
        try {
          const { data: res } = await this.$http.post('goods', form)
          console.log(res, '-----res')
          res.meta.status === 201 ? this.$message.success('添加商品成功!') && this.$router.push('/goods') : this.$message.error('添加商品失败!')
        } catch (error) {
          this.$message.error('添加商品失败!失败信息:' + error)
        }
      })
    }
  },
  computed: {
    cateId () {
      return this.addForm.goods_cat.length === 3 ? this.addForm.goods_cat[2] : null
    }
  }
}
</script>
<style lang="less" scoped>
.el-steps {
  margin: 20px 0;
}
/deep/ .el-step__title {
  font-size: 13px;
}
.el-card {
  padding-bottom: 200px;
}
.el-tab-pane {
  .el-tag {
    margin: 5px;
  }
}
.el-checkbox {
  margin: 5px 5px 0 0 !important;
}

//给添加商品按钮添加间距
.btnAdd{
  margin-top:15px;
}
</style>
