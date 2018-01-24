<template>
  <div id="app">
    <div class="main">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
        <el-form-item label="请输入旧密码" prop="PSW_OLD">
          <el-input type="password" v-model="ruleForm.PSW_OLD" :maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="请设置新密码" prop="PSW_NEW1">
          <el-input type="password" v-model="ruleForm.PSW_NEW1" :maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码" prop="PSW_NEW2">
          <el-input type="password" v-model="ruleForm.PSW_NEW2" :maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" style="width:100%;" @click="submitForm()" v-loading="editLoading">确认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        ruleForm: {},
        rules:{
          PSW_OLD:[
            { required: true, message: '请输入旧密码', trigger: 'blur'}
          ],
          PSW_NEW1:[
            {required: true, message: '请设置新密码', trigger: 'blur'},
            { min: 6, max: 18, message: '长度必须为6到18个字符', trigger: 'blur' }
          ],
          PSW_NEW2:[
            { required: true, message: '再次输入新密码', trigger: 'blur'},
            { min: 6, max: 18, message: '长度必须为6到18个字符', trigger: 'blur' }
          ]
        },
        editLoading: false
      }
    },
    methods: {
      submitForm: function () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.editLoading = true;
            if( this.ruleForm.PSW_NEW1 != this.ruleForm.PSW_NEW2 ){
              this.$message({
                message: "两次输入的新密码不一致，请重试",
                type: 'error'
              });
              return
            }
            var para = {
              oldPassword: this.ruleForm.PSW_OLD,
              newPassword: this.ruleForm.PSW_NEW1
            };
            baseAjax({
              url: '/sys/user/password',
              data: JSON.stringify(para),
              success: function (data) {
                if (data.code == true) {
                  this.$message({
                    message: '恭喜您，密码修改成功了~',
                    type: 'success'
                  });
                } else {
                  this.$message({
                    message: data.message,
                    type: 'error'
                  });
                }
                this.editLoading = false;
                this.$refs.ruleForm.resetFields();
              }.bind(this),
              error: function () {
                this.$message({
                  message: '网络繁忙，请稍后再试~',
                  type: 'error'
                });
                this.editLoading = false;
              }.bind(this)
            });
          }
        });
      }
    }
  }
</script>
<style scoped>
  /* CSS Document */
  body{
    width:100%;
    height:100%;
  }

  .main{
    width:40%;
    text-align:center;
    margin-top:100px;
    margin-left: 30%;
  }
  .main el-input{
    min-width:120px;
  }


</style>
