<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.code" placeholder="角色编码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.name" placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="search" v-on:click="getRoleList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="close" v-on:click="resetForm">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="plus" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24" class="toolbar" style="padding-top: 0px">
        <div class="grid-content bg-purple">
          <!--列表-->
          <el-table :data="roleList" highlight-current-row v-loading="listLoading" fit style="width: 100%;">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="code" label="角色代码" sortable>
            </el-table-column>
            <el-table-column prop="name" label="角色名称">
            </el-table-column>
            <el-table-column prop="enabled" label="可见" :formatter="formatEnabled">
            </el-table-column>
            <el-table-column prop="createDate" label="创建日期" sortable>
            </el-table-column>
            <el-table-column prop="updateDate" label="更新时间" sortable>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="warning" size="small" icon="edit" @click="handleEdit(scope.$index, scope.row)">编辑
                </el-button>
                <el-button type="danger" size="small" icon="delete2" @click="handleDel(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-pagination
              @size-change="handleSizeChange"
              :current-page="pageNum"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </el-col>
        </div>
      </el-col>
    </el-row>

    <!--角色新增界面-->
    <el-dialog title="新增角色" :fullscreen="true" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="addForm.code" auto-complete="off" :maxlength="20"></el-input>
          <div class="sub-title">角色编码必须以 ROLE_ 开头</div>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off" :maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="是否可用" prop="enabled">
          <el-switch on-text="是" off-text="否" v-model="addForm.enabled"></el-switch>
        </el-form-item>
        <el-form-item label="角色授权">
          <el-tree
          :data="menuData"
          show-checkbox ref="tree"
          node-key="id" highlight-current
          :default-expand-all="true"
          :props="defaultProps">
        </el-tree>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="addForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--角色编辑界面-->
    <el-dialog title="编辑角色" :fullscreen="true" :visible.sync="editFormVisible">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="editForm.code" auto-complete="off" :maxlength="20"></el-input>
          <div class="sub-title">角色编码必须以 ROLE_ 开头</div>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off" :maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="是否可用" prop="enabled">
          <el-switch on-text="是" off-text="否" v-model="editForm.enabled"></el-switch>
        </el-form-item>
        <el-form-item label="角色授权">
          <el-tree
            :data="menuData"
            show-checkbox ref="tree"
            node-key="id" highlight-current
            :default-expand-all="true"
            :loading="treeLoading"
            :props="defaultProps">
          </el-tree>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="editForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import util from '@/common/js/util'
  export default {
    data(){
      return {
        filters: {
          code: '',
          name: ''
        },
        roleList: [],
        total: 0,
        pageNum: 1,
        pagesize: 15,
        listLoading: false,
        addForm: {
          code: '',
          name: '',
          enabled: true,
          remarks: ''
        },
        addFormVisible: false,
        addLoading: false,
        addFormRules: {
          code: [
            {required: true, message: '请输入角色编码', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入角色名称', trigger: 'blur'}
          ],
          remarks: [
            {required: true, message: '请输入描述信息', trigger: 'blur'}
          ]
        },
        menuData: [],
        treeLoading: false,
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        editForm: {
          code: '',
          name: '',
          enabled: true,
          remarks: ''
        },
        editFormVisible: false,
        editLoading: false,
        editFormRules: {
          code: [
            {required: true, message: '请输入角色编码', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入角色名称', trigger: 'blur'}
          ],
          remarks: [
            {required: true, message: '请输入描述信息', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //格式化时间
      formatDate: function (row, column) {
        if (column.property == "createDate") {
          var date = new Date();
          date.setTime(row.createDate);
          return util.formatDate.format(date, "yyyy-MM-dd hh:mm");
        } else if (column.property == "updateDate") {
          var date = new Date();
          date.setTime(row.updateDate);
          return util.formatDate.format(date, "yyyy-MM-dd hh:mm");
        }
      },
      //状态格式化
      formatEnabled: function (row, column) {
        if (column.property == "enabled") {
          if (row.enabled == "1") {
            return "是";
          } else if (row.enabled == "0") {
            return "否";
          }
        }
      },
      //表格每页显示数据量变更
      handleSizeChange: function (val) {
        this.pagesize = val;
        this.getRoleList();
      },
      getRoleList() {
        var page = new Object();
        page.pageNum = this.pageNum;
        page.pageSize = this.pagesize;
        var role = new Object();
        role.code = this.filters.code;
        role.name = this.filters.name;
        let para = {
          page: page,
          role: role
        };
        this.listLoading = true;
        baseAjax({
          url: '/auth/role/list',
          data: JSON.stringify(para),
          type: 'POST',
          success: function (data) {
            this.roleList = data.list;
            this.total = Number(data.total);
            this.listLoading = false;
          }.bind(this),
          error: function(){
            this.listLoading = false;
          }.bind(this)
        });
      },

      //显示新增界面
      handleAdd(){
        this.addFormVisible = true;
        this.getMenuTreeList();
      },
      //提交新增数据
      addSubmit(){
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              let para = {role: Object.assign({}, this.addForm)};
              if (para.role.enabled == true) {
                para.role.enabled = '1';
              } else {
                para.role.enabled = '0';
              }
              if (this.$refs.tree.getCheckedNodes() == null) {
                this.$message({
                  message: '请为角色配置菜单信息',
                  type: 'error'
                });
                return
              }
              //获取选择的菜单信息
              para.role.menus = this.$refs.tree.getCheckedNodes();
              //删除sysMenu对象中的children孩子对象，否则json化数据的时候会出错
              baseAjax({
                url: '/auth/role/edit',
                data: JSON.stringify(para),
                success: function (data) {
                  this.addLoading = false;
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  });
                  this.$refs['addForm'].resetFields();
                  this.addFormVisible = false;
                  this.getRoleList();
                }.bind(this),
                error: function(){
                  this.addLoading = false;
                }.bind(this)
              });
            }).catch(() => {

            });
          }
        });
      },
      //获取菜单树(全部）
      getMenuTreeList(){
        this.treeLoading = true;
        baseAjax({
          url: '/auth/menu/tree',
          async: false,
          data: {},
          type: 'GET',
          success: function (data) {
            this.menuData = data;
            this.treeLoading = false;
          }.bind(this),
          error: function(){
            this.treeLoading = false;
          }.bind(this)
        });
      },

      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.getMenuTreeList();
        let para = {roleId: row.id};
        baseAjax({
          url: '/auth/role/' + row.id,
          data: para,
          type: 'GET',
          success: function (data) {
            this.editForm = data;
            this.$refs.tree.setCheckedNodes(data.menus);
          }.bind(this)
        });
      },

      //编辑角色提交
      editSubmit(){
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              let para = {role: Object.assign({}, this.editForm)};
              if (para.role.enabled == true) {
                para.role.enabled = '1';
              } else {
                para.role.enabled = '0';
              }
              if (this.$refs.tree.getCheckedNodes() == null) {
                this.$message({
                  message: '请为角色配置菜单信息',
                  type: 'error'
                });
                return
              }
              //获取选择的菜单信息
              para.role.menus = this.$refs.tree.getCheckedNodes();
              //删除sysMenu对象中的children孩子对象，否则json化数据的时候会出错
              baseAjax({
                url: '/auth/role/edit',
                data: JSON.stringify(para),
                success: function (data) {
                  this.editLoading = false;
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  });
                  this.$refs['editForm'].resetFields();
                  this.editFormVisible = false;
                  this.getRoleList();
                }.bind(this),
                error: function(){
                  this.editLoading = false;
                }.bind(this)
              });
            }).catch(() => {

            });
          }
        });
      },

      //删除角色
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {roleId: row.id};
          baseAjax({
            url: '/auth/role/' + row.id,
            data: para,
            type: 'DELETE',
            dataType: 'text',
            success: function (data) {
              this.listLoading = false;
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getRoleList();
            }.bind(this),
            error: function(){
              this.listLoading = false;
            }.bind(this)
          });
        }).catch(() => {

        });
      },
      //重置查询
      resetForm(){
        this.filters = {
          code: '',
          name: ''
        }
      }
    },
    mounted() {
      this.getRoleList();
    }
  }

</script>
