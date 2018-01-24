<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.loginName" placeholder="登录名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="search" v-on:click="search">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="fa-repeat" v-on:click="resetForm">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="plus" v-on:click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24" class="toolbar" style="padding-top: 15px">
        <div class="grid-content bg-purple">
          <el-table row-key="id" :data="userList" border tooltip-effect="dark" style="width: 100%"
                    v-loading="listLoading" element-loading-text="拼命加载中">
            <el-table-column prop="loginName" label="登录名" width="100"> </el-table-column>
            <el-table-column prop="name" label="名称" > </el-table-column>
            <el-table-column prop="enabled" label="状态" :formatter="formatData" width="80"> </el-table-column>
            <el-table-column prop="mobile" label="手机" > </el-table-column>
            <el-table-column prop="email" label="邮件" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="phone" label="电话" > </el-table-column>
            <el-table-column prop="createDate" label="创建时间" sortable  :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column label="操作" width="400">
              <template slot-scope="scope">
                <el-button type="info" size="mini" @click="authUser(scope.$index, scope.row)">授权</el-button>
                <el-button type="warning" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                <el-button type="info" v-if="showEnabled(scope.row)" size="mini" @click="handleEnabled('1', scope.row)">启用</el-button>
                <el-button type="danger" v-else size="mini" @click="handleEnabled('0', scope.row)">停用</el-button>
                <el-button type="success" size="mini" @click="updatePassword(scope.$index, scope.row)">更新密码</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
      </el-col>
    </el-row>

    <el-dialog :title="title" :visible.sync="userFormVisible">
      <el-form :model="userForm" label-width="100px" :rules="userFormRules" ref="userForm" >
        <el-row>
          <el-col :span="12">
            <el-form-item required label="登录名" prop="loginName" >
              <el-input v-model="userForm.loginName" :disabled="readName" :minlength="4" :maxlength="15" placeholder="请填写登录账号，4-15个字符" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required v-if="showPassword" label="密码" prop="password" >
              <el-input type="password" v-model="userForm.password" :minlength="6" :maxlength="18" placeholder="请填写密码，6-18个字符" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item required label="名称" prop="name" >
              <el-input v-model="userForm.name" :minlength="1" :maxlength="15" placeholder="请填写名称，1-15个字符" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="手机" prop="mobile" >
              <el-input v-model="userForm.mobile" :minlength="11" :maxlength="11" placeholder="请填写手机号码" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="邮件" prop="email" >
              <el-input v-model="userForm.email" :minLength="1" :maxLength="18" placeholder="请填写邮件地址" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks" >
              <el-input type="textarea" v-model="userForm.remarks" :maxLength="50" placeholder="备注信息不超过50个字符" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-40px;">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="editLoading">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="更新密码" :visible.sync="passwordFormVisible" >
      <div style="text-align:center;">
        <el-input type="password" v-model="newPassword" style="width:80%;" placeholder="请填写密码，6-18个字符"  :minlngth="6" :maxlength="18"></el-input>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-top:20px;">
        <el-button @click="cancelPassDialog">取消</el-button>
        <el-button type="primary" @click="submitPassword" :loading="editLoading">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="用户授权管理" :fullscreen="true" :visible.sync="authFormVisible" >
      <el-row :gutter="20">
        <el-col :span="10">
          <el-table row-key="id" :data="authList" border tooltip-effect="dark" style="width: 100%;height:500px;"
                    @selection-change="authChangeAll" v-loading="listLoading" element-loading-text="拼命加载中">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="已授予角色"> </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="4">
          <el-row>
            <el-button style="width:150px;margin-top:200px;" :loading="authLoading" @click="addAuthList" type="success">授权</el-button>
          </el-row>
          <el-row>
            <el-button style="width:150px;margin-top:25px;" :loading="authLoading" @click="deleteAuthList" type="danger">取消</el-button>
          </el-row>
        </el-col>
        <el-col :span="10">
          <el-table row-key="id" :data="unAuthList" border tooltip-effect="dark" style="width: 100%;height:500px;"
                    @selection-change="unAuthChangeAll" v-loading="listLoading" element-loading-text="拼命加载中">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="未授予角色"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer" style="margin-top:-20px;">
        <el-button @click="cancelAuth">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import util from '@/common/js/util'
  export default {
    data() {
      return {
        filters:{
          loginName: '',
          name: ''
        },
        userList: [],
        listLoading: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
        options: [],
        userFormVisible: false,
        userForm:{
          loginName: '',
          name: '',
          password: '',
          mobile: '',
          email: '',
          remarks: ''
        },
        userFormRules:{
          loginName: [
            { required: true, message: '请填写登录账号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请填写密码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请填写名称', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请填写手机号码', trigger: 'blur' }
          ]
        },
        editLoading: false,
        showPassword: true,
        title: '',
        passwordFormVisible: false,
        newPassword: '',
        authList: [],
        unAuthList: [],
        authTables: [],
        unAuthTables: [],
        authFormVisible: false,
        userId: '',
        authLoading: false,
        readName: false,
        isAdmin: false,
        userInfo: {}
      };
    },
    created(){
      
    },
    methods:{
      formatData: function(row, column){
        if (column.property == "createDate") {
          var date = new Date();
          date.setTime(row.createDate);
          return util.formatDate.format(date, "yyyy-MM-dd hh:mm");
        }else if( column.property == "enabled" ){
          if( row.enabled == 1 ){
            return "可用";
          }else if( row.enabled == 0 ){
            return "停用";
          }
        }
      },
      authChangeAll: function(table){
        this.authTables = table;
      },
      unAuthChangeAll: function(table){
        this.unAuthTables = table;
      },
      authUser: function( index, row ){
        this.userId = row.id;
        this.getUserAuthList(row.id);
        this.authFormVisible = true;
      },
      getUserAuthList: function( userId ){
        let para = {userId: userId};
        this.listLoading = true;
        baseAjax({
          url: '/auth/user/authList',
          data: JSON.stringify(para),
          type: 'POST',
          success: function (data) {
            if( data.success == true ){
              this.authList = data.data.authList;
              this.unAuthList = data.data.unAuthList;
            }else{
              this.$message({
                message: data.responseMsg,
                type: 'error'
              });
            }
            this.listLoading = false;
          }.bind(this),
          error: function(){
            this.listLoading = false;
          }.bind(this)
        });
        this.listLoading = false;
      },
      addAuthList: function(){
        this.changeAuthList('auth');
      },
      deleteAuthList: function(){
        this.changeAuthList('unAuth');
      },
      changeAuthList: function( type ){
        var list = [];
        if( type == 'auth' ){
          if( this.unAuthTables.length == 0 ){
            this.$message({
              message: '请选择未授权角色',
              type: 'error'
            });
            return
          }
          list = this.unAuthTables;
        }else if(type == 'unAuth'){
          if( this.authTables.length == 0 ){
            this.$message({
              message: '请选择已授权角色',
              type: 'error'
            });
            return
          }
          list = this.authTables;
        }
        this.authLoading = true;
        let para = { type: type, list: list, userId: this.userId };
        baseAjax({
          url: '/auth/user/editAuthList',
          data: JSON.stringify(para),
          type: 'POST',
          success: function (data) {
            if( data.success == true ){
              this.$message({
                message: '请求成功',
                type: 'success'
              });
              this.getUserAuthList(this.userId);
            }else{
              this.$message({
                message: data.responseMsg,
                type: 'error'
              });
            }
            this.authLoading = false;
          }.bind(this),
          error: function(){
            this.authLoading = false;
          }.bind(this)
        });
      },
      cancelAuth: function(){
        this.userId = '';
        this.authTables = [];
        this.unAuthTables = [];
        this.authFormVisible = false;
      },
      search: function(){
        var page = new Object();
        page.pageNum = this.pageNum;
        page.pageSize = this.pageSize;
        var user = new Object();
        user.loginName = this.filters.loginName;
        user.name = this.filters.name;
        let para = {
          page: page,
          user: user
        };
        this.listLoading = true;
        baseAjax({
          url: '/auth/user/list',
          data: JSON.stringify(para),
          type: 'POST',
          success: function (data) {
            this.userList = data.list;
            this.total = Number(data.total);
            this.listLoading = false;
          }.bind(this),
          error: function(){
            this.listLoading = false;
          }.bind(this)
        });
      },
      resetForm: function(){
        this.filters = {
            loginName: '',
            name: '',
            companyCode: ''
        }
      },
      showEnabled: function(row){
        if( row.enabled == 1 ){
          return false;
        }
        return true;
      },
      handleAdd: function(){
        this.userForm = {
          loginName: '',
          name: '',
          password: '',
          mobile: '',
          email: '',
          remarks: ''
        }
        this.readName = false;
        this.title = "新增用户";
        this.id = '';
        this.showPassword = true;
        this.userFormVisible = true;
      },
      handleEdit: function(index, row){
        this.title = "编辑用户";
        this.showPassword = false;
        this.readName = true;
        this.userForm = Object.assign({}, row);
        this.id = row.id;
        this.userFormVisible = true;
      },
      handleEnabled: function(val, row){
        var str = "";
        if( val == "1" ){
          str = "是否确认启用该账号";
        }else{
          str = "是否确认停用该账号";
        }
        this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var user = {};
          user.id = row.id;
          user.enabled = val;
          let para = {user: user};
          baseAjax({
            url: '/auth/user/edit',
            data: JSON.stringify(para),
            success: function (data) {
              if(data.success == true ){
                this.editLoading = false;
                this.$message({
                  message: '请求成功',
                  type: 'success'
                });
                this.search();
              }else{
                this.editLoading = false;
                this.$message({
                  message: data.responseMsg,
                  type: 'error'
                });
              }
            }.bind(this),
            error: function(){
              this.editLoading = false;
            }.bind(this)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      submitPassword: function(){
        if( this.newPassword == '' ){
          this.$message({
            message: "请输入密码信息",
            type: 'error'
          });
          return
        }
        let para = {id: row.id, newPassowrd: this.newPassword};
        baseAjax({
          url: '/auth/user/edit',
          data: JSON.stringify(para),
          success: function (data) {
            if(data.success == true ){
              this.editLoading = false;
              this.$message({
                message: '请求成功',
                type: 'success'
              });
              this.search();
            }else{
              this.editLoading = false;
              this.$message({
                message: data.responseMsg,
                type: 'error'
              });
            }
          }.bind(this),
          error: function(){
            this.editLoading = false;
          }.bind(this)
        })
      },
      updatePassword: function(index, row){
        this.id = row.id;
        this.newPassword = '';
        this.passwordFormVisible = true;
      },
      handleDelete: function(index, row){
        this.$confirm('是否确认删除选中的用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let para = {userId: row.id};
          baseAjax({
            url: '/auth/user/' + row.id,
            data: para,
            type: 'DELETE',
            success: function (data) {
              if( data.success == true ){
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.search();
              }else{
                this.$message({
                  message: data.message,
                  type: 'error'
                });
              }
            }.bind(this)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      editSubmit: function(){
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              let para = {user: Object.assign({}, this.userForm)};
              para.user.id = this.id;
              para.user.enabled = '1';
              baseAjax({
                url: '/auth/user/edit',
                data: JSON.stringify(para),
                success: function (data) {
                  if(data.success == true ){
                    this.editLoading = false;
                    this.$message({
                      message: '保存成功',
                      type: 'success'
                    });
                    this.$refs.userForm.resetFields();
                    this.search();
                    this.cancelDialog();
                  }else{
                    this.editLoading = false;
                    this.$message({
                      message: data.responseMsg,
                      type: 'error'
                    });
                  }
                }.bind(this),
                error: function(){
                  this.editLoading = false;
                }.bind(this)
              });
            });
          }
        });
      },
      cancelDialog: function(){
        this.$refs['userForm'].resetFields();
        this.userFormVisible = false;
      },
      cancelPassDialog: function(){
        this.newPassword = '';
        this.passwordFormVisible = false;
      },
      //表格每页显示数据量变更
      handleSizeChange: function (val) {
        this.pageSize = val;
        this.search();
      },
      handleCurrentChange(val) {
        this.pageNum= val;
        this.search();
      },
    },
    mounted() {
      this.userInfo = JSON.parse(sessionStorage.getItem("user_info"));
      this.search();
    }
  }
</script>
