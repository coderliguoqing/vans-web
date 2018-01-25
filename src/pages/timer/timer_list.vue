<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.jobName" placeholder="任务名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.jobGroup" placeholder="任务分组"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.beanClass" placeholder="任务类名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.methodName" placeholder="方法名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" v-on:click="getTimerList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-refresh" v-on:click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24" class="toolbar">
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" v-on:click="addJob">新增任务</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" icon="el-icon-edit" v-on:click="editJobStatus">修改任务状态</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" icon="el-icon-edit" v-on:click="editCron">修改CRON表达式</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" icon="el-icon-edit" v-on:click="editJobPara">修改任务参数</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" icon="el-icon-check" v-on:click="runJobNow">立即执行</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="info" icon="el-icon-setting" v-on:click="pauseJob">暂停任务</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="info" icon="el-icon-setting" v-on:click="resumeJob">恢复任务</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" icon="el-icon-delete" v-on:click="deleteJob">删除任务</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-view" v-on:click="showJob">查看任务</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24" class="toolbar" style="padding-top: 15px">
        <div class="grid-content bg-purple">
          <el-table row-key="id" :data="timerList" border tooltip-effect="dark" style="width: 100%"
                    v-loading="listLoading" element-loading-text="拼命加载中">
            <el-table-column prop="jobName" label="任务名称"> </el-table-column>
            <el-table-column prop="jobGroup" label="任务分组" > </el-table-column>
            <el-table-column prop="jobStatus" label="状态任务" :formatter="formatData"> </el-table-column>
            <el-table-column prop="cronExpression" label="CRON表达式" > </el-table-column>
            <el-table-column prop="description" label="描述" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="beanClass" label="任务类名" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="methodName" label="类方法名" > </el-table-column>
            <el-table-column prop="springId" label="SPRING BEAN" > </el-table-column>
            <el-table-column prop="isConcurrent" label="任务是否有状态" :formatter="formatData"> </el-table-column>
            <el-table-column prop="createDate" label="创建时间" sortable  :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="updateDate" label="更新时间时间" sortable  :show-overflow-tooltip="true"> </el-table-column>
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

    <!-- <el-dialog title="新增任务" :visible.sync="timerFormVisible">
      <el-form :model="timerForm" label-width="100px" :rules="userFormRules" ref="timerForm" >
        <el-row>
          <el-col :span="12">
            <el-form-item required label="任务名称" prop="jobName" >
              <el-input v-model="timerForm.jobName" :disabled="readName" :minlength="1" :maxlength="25" placeholder="请填写任务名称，1-25个字符" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required v-if="showPassword" label="任务分组" prop="jobGroup" >
              <el-input type="jobGroup" v-model="timerForm.jobGroup" :minlength="1" :maxlength="18" placeholder="请填写任务分组，1-18个字符" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item required label="任务运行状态" prop="jobStatus" >
              <el-input v-model="userForm.name" :minlength="1" :maxlength="15" placeholder="请填写名称，1-15个字符" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="任务是否有状态" prop="isConcurrent" >
              <el-input v-model="userForm.mobile" :minlength="11" :maxlength="11" placeholder="请填写手机号码" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item required label="CRON表达式" prop="cronExpression" >
              <el-input v-model="timerForm.cronExpression" placeholder="请填写cron表达式" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="描述" prop="description" >
              <el-input v-model="timerForm.description" placeholder="请填写描述" ></el-input>
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
    </el-dialog> -->

  </div>
</template>
<script>
export default {
    data(){
        return {
            filters:{
                jobName: '',
                jobGroup: '',
                beanClass: '',
                methodName:''
            },
            timerList: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            listLoading: false
        }
    },
    methods: {
        formatData: function( row, column ){
            if (column.property == "createDate") {
                var date = new Date();
                date.setTime(row.createDate);
                return util.formatDate.format(date, "yyyy-MM-dd hh:mm");
            }else if(column.property == "updateDate"){
                var date = new Date();
                date.setTime(row.updateDate);
                return util.formatDate.format(date, "yyyy-MM-dd hh:mm");
            }else if( column.property == "jobStatus" ){
                if( row.jobStatus == 1 ){
                    return "运行";
                }else if( row.jobStatus == 0 ){
                    return "停止";
                }
            }else if( column.property == "isConcurrent" ){
                if( row.isConcurrent == 1 ){
                    return "是";
                }else if( row.isConcurrent == 0 ){
                    return "否";
                }
            }
        },
        getTimerList: function(){
            var page = new Object();
            page.pageNum = this.pageNum;
            page.pageSize = this.pageSize;
            var job = new Object();
            job.jobName = this.filters.jobName;
            job.jobGroup = this.filters.jobGroup;
            job.beanClass = this.filters.beanClass;
            job.methodName = this.filters.methodName;
            let para = {
                page: page,
                job: job
            };
            this.listLoading = true;
            baseAjax({
                url: '/task/job/list',
                data: JSON.stringify(para),
                type: 'POST',
                success: function (data) {
                    this.timerList = data.list;
                    this.total = Number(data.total);
                    this.listLoading = false;
                }.bind(this),
                error: function(){
                    this.listLoading = false;
                }.bind(this)
            });
            this.listLoading = false;
        },
        resetForm: function(){
            this.filters = {
                jobName: '',
                jobGroup: '',
                beanClass: '',
                methodName: ''
            }
        },
        //表格每页显示数据量变更
        handleSizeChange: function (val) {
            this.pageSize = val;
            this.getTimerList();
        },
        handleCurrentChange(val) {
            this.pageNum= val;
            this.getTimerList();
        }
    },
    mounted() {
        this.getTimerList();
    }
}
</script>

