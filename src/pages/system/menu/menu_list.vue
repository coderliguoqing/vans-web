<template>
  <div class="menuTree">
    <el-button size="primary" type="primary" icon="fa-refresh" @click="getMenuTreeList">
      重新加载
    </el-button>
    <el-button size="primary" type="primary" icon="plus" style="margin-bottom:15px;" @click="handleAdd">
      新建顶级菜单
    </el-button>
    <el-table
      :data="data"
      border
      v-loading="listLoading"
      style="width: 100%"
      :row-style="showTr">
      <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text">
        <template slot-scope="scope">
          <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
          <span v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
            <i v-if="!scope.row._expanded" class="el-icon-arrow-right" aria-hidden="true"></i>
            <i v-if="scope.row._expanded" class="el-icon-arrow-down" aria-hidden="true"></i>
          </span>
          <!--<span v-if="spaceIconShow(index)"><i class="el-icon-star-off"></i></span>-->
          <span v-else-if="index===0" class="ms-tree-space"></span>
          {{scope.row[column.dataIndex]}}
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="350">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-button v-if="scope.row.children.length == 0" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
            删除
          </el-button>
          <el-button size="mini" type="primary" @click="handleShow(scope.$index, scope.row)">
            详情
          </el-button>
          <el-button size="mini" type="success" @click="handleAdd(scope.$index, scope.row)">
            添加子菜单
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--菜单行新增界面-->
    <el-dialog title="新增菜单" :fullscreen="true" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item label="父菜单名称" prop="parentText" >
          <el-input v-model="addForm.parentText" :disabled="true" ></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="text" >
          <el-input v-model="addForm.text" auto-complete="off" :maxlength="20" ></el-input>
          <div class="sub-title">用于显示在菜单导航中的名字</div>
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-input v-model="addForm.url" auto-complete="off" :maxlength="200"></el-input>
          <div class="sub-title">点击菜单跳转的页面</div>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="addForm.icon" auto-complete="off" ></el-input>
          <div class="sub-title">获取图标：<a href="http://fontawesome.io/icons/" target="_blank">http://fontawesome.io/icons/</a></div>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="addForm.sort" :min="0" :max="5000"></el-input-number>
        </el-form-item>
        <el-form-item label="是否显示" prop="show">
          <el-switch on-text="是" off-text="否" v-model="addForm.show"></el-switch>
        </el-form-item>
        <el-form-item label="权限标识" prop="permission">
          <el-input v-model="addForm.permission" auto-complete="off" :maxlength="200"></el-input>
          <div class="sub-title">控制器中定义的权限标识，如：@PreAuthorize("hasAuthority('权限标识')")</div>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="addForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
      </div>
    </el-dialog>

    <!--菜单行编辑界面-->
    <el-dialog title="编辑菜单" :fullscreen="true" :visible.sync="editFormVisible">
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item label="名称" prop="text" >
          <el-input v-model="editForm.text" auto-complete="off" :maxlength="20" ></el-input>
          <div class="sub-title">用于显示在菜单导航中的名字</div>
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-input v-model="editForm.url" auto-complete="off" :maxlength="200"></el-input>
          <div class="sub-title">点击菜单跳转的页面</div>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="editForm.icon" auto-complete="off" ></el-input>
          <div class="sub-title">获取图标：<a href="http://fontawesome.io/icons/" target="_blank">http://fontawesome.io/icons/</a></div>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="editForm.sort" :min="0" :max="5000"></el-input-number>
        </el-form-item>
        <el-form-item label="是否显示" prop="show">
          <el-switch on-text="是" off-text="否" v-model="editForm.show"></el-switch>
        </el-form-item>
        <el-form-item label="权限标识" prop="permission">
          <el-input v-model="editForm.permission" auto-complete="off" :maxlength="200"></el-input>
          <div class="sub-title">控制器中定义的权限标识，如：@PreAuthorize("hasAuthority('权限标识')")</div>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="editForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
      </div>
    </el-dialog>

    <!--菜单行显示界面-->
    <el-dialog title="菜单详情" :visible.sync="showFormVisible">
      <el-form :model="showForm" label-width="120px" ref="showForm">
        <el-form-item label="名称：" prop="text" >
          <span class="show-span">{{showForm.text}}</span>
        </el-form-item>
        <el-form-item label="链接：" prop="url">
          <span class="show-span">{{showForm.url}}</span>
        </el-form-item>
        <el-form-item label="图标：" prop="icon">
          <span class="show-span">{{showForm.icon}}</span>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input-number v-model="showForm.sort" :disabled="true"></el-input-number>
        </el-form-item>
        <el-form-item label="是否显示：" prop="show">
          <el-switch on-text="是" off-text="否" v-model="showForm.show" :disabled="true"></el-switch>
        </el-form-item>
        <el-form-item label="权限标识：" prop="permission">
          <span class="show-span">{{showForm.permission}}</span>
        </el-form-item>
        <el-form-item label="备注：" prop="remarks">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" :readonly="true" v-model="showForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="showFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Utils from './utils/index.js'

  export default {
    data () {
      return {
        // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
        treeStructure: {
          type: Boolean,
          default: function () {
            return false
          }
        },
        // 这是数据源
        dataSource: {
          type: Array,
          default: function () {
            return []
          }
        },
        columns: [
          {
            text: '名称',
            dataIndex: 'text'
          },
          {
            text: '链接',
            dataIndex: 'url'
          },
          {
            text: '图标',
            dataIndex: 'icon'
          },
          {
            text: '排序',
            dataIndex: 'sort'
          },
          {
            text: '可见',
            dataIndex: 'show'
          },
          {
            text: '权限标识',
            dataIndex: 'permission'
          }
        ],
        listLoading: false,
        editForm:{
          text: '',
          url: '',
          icon: '',
          sort: 1,
          show: true,
          permission: '',
          remarks: ''
        },
        //编辑菜单数据
        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          text: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '请输入排序权重' },
            { type: 'number', message: '请输入数字' }
          ]
        },

        addForm:{
          parentText: '',
          text: '',
          url: '',
          icon: '',
          sort: 1,
          show: true,
          permission: '',
          remarks: '',
          parentId: ''
        },
        //新增菜单界面
        addFormVisible: false,//界面是否显示
        addLoading: false,
        addFormRules: {
          text: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '请输入排序权重'},
            {type: 'number', message: '请输入数字'}
          ]
        },
        showForm:{
          text: '',
          url: '',
          icon: '',
          sort: 1,
          show: true,
          permission: '',
          remarks: '',
          parentId: ''
        },
        //详情菜单界面
        showFormVisible: false
      }
    },
    computed: {
      // 格式化数据源
      data: function () {
        let me = this
        if (me.treeStructure) {
          let data = Utils.DataTransfer.treeToArray(me.dataSource, null, null, false)
          return data
        }
        return me.dataSource
      }
    },
    methods:{
      //获取菜单树
      getMenuTreeList(){
        this.listLoading = true;
        baseAjax({
          url: '/auth/menu/tree',
          data: {},
          type: 'GET',
          success: function(data){
            this.dataSource = data;
            this.listLoading = false;
          }.bind(this),
          error: function(){
            this.listLoading = false;
          }.bind(this)
        });
      },
      // 显示行
      showTr: function (row, index) {
        row = row.row;
        let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
        row._show = show
        return show ? '' : 'display:none;'
      },
      // 展开下级
      toggle: function (trIndex) {
        let me = this
        let record = me.data[trIndex]
        record._expanded = !record._expanded
      },
      // 显示层级关系的空格和图标
      spaceIconShow (index) {
        let me = this
        if (me.treeStructure && index === 0) {
          return true
        }
        return false
      },
      // 点击展开和关闭的时候，图标的切换
      toggleIconShow (index, record) {
        let me = this
        if (me.treeStructure && index === 0 && record.children && record.children.length > 0) {
          return true
        }
        return false
      },
      handleDelete ( index, row ) {
        if( row.children.length > 0 ){
          this.$message({
            message: '非叶子节点菜单不能删除',
            type: 'error'
          });
          return
        }
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let para = { menuId: row.id };
          baseAjax({
            url: '/auth/menu/delete',
            data: JSON.stringify(para),
            type: 'DELETE',
            dataType: 'text',
            success: function (data) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getMenuTreeList();
              this.editLoading = false;
            }.bind(this),
            error: function(){
              this.editLoading = false;
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },

      //编辑菜单行
      editSubmit: function ( ){
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认保存吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = { sysMenu: Object.assign({}, this.editForm)};
              if( para.sysMenu.show == true ){
                para.sysMenu.isShow = '1';
              }else{
                para.sysMenu.isShow = '0';
              }
              //删除sysMenu对象中的children孩子对象，否则json化数据的时候会出错
              delete para.sysMenu.children;
              delete para.sysMenu._parent;
              baseAjax({
                url: '/auth/menu/edit',
                data: JSON.stringify(para),
                success: function (data) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.$refs['editForm'].resetFields();
                  this.editFormVisible = false;
                  this.getMenuTreeList();
                  this.editLoading = false;
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

      //显示新增界面
      handleAdd: function (index, row) {
        this.addFormVisible = true;
        if( row == undefined ){
          this.addForm = {parentText: '已是顶级菜单',show:true}
        }else{
          this.addForm = {
            parentText: row.text,
            parentId: row.id,
            show: true,
            sort: 1
          }
        }
      },

      //新增菜单行
      addSubmit: function ( ){
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认保存吗？', '提示', {}).then(() => {
              this.addLoading = true;
              //NProgress.start();
              let para = { sysMenu: Object.assign({}, this.addForm)};
              if( para.sysMenu.show == true ){
                para.sysMenu.isShow = '1';
                para.sysMenu.targetType = 'iframe-tab';
              }else{
                para.sysMenu.isShow = '0';
                para.sysMenu.targetType = 'iframe-tab';
              }
              //删除sysMenu对象中的children孩子对象，否则json化数据的时候会出错
              delete para.sysMenu.children;
              baseAjax({
                url: '/auth/menu/edit',
                data: JSON.stringify(para),
                success: function (data) {
                  this.addLoading = false;
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.$refs['addForm'].resetFields();
                  this.addFormVisible = false;
                  this.getMenuTreeList();
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

      //显示菜单信息
      handleShow: function(index, row){
        this.showFormVisible = true;
        this.showForm = Object.assign({}, row);
      }
    },
    mounted() {
      this.getMenuTreeList();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .menuTree{ margin-top: 15px;}
  .ms-tree-space{position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 14px;
    height: 14px;}
  .ms-tree-space::before{content: ""}
  table td{
    line-height: 26px;
  }
  .show-span{
    font-size:14px;
    font-weight:400;
  }
</style>
