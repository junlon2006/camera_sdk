document.charset = "utf-8";
var g_lxdLog = null; // Log.xml
var m_LogSearchFinish = false; // 日志查询已完成
var ReadRecordMax=100;  //最大查询数  
var total=0;  //总条数 
var curPage = 0 ; //当前页码 
var total,pageSize,totalPage; //总记录数，每页显示数，总页数
var pageg="";
var LogType="";  //大类
var LogTypex="";  //次类
var g_szChangeLogXml="";
var Log = {
	tabs: null   // 
};
function LogMain() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(LogMain);
pr(LogMain).update = function() {
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["log", "LogPage"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initLog();
	autoResizeIframe();
	
	$("#lastPage").attr("title", getNodeValue('MlastPage'));
 	$("#nextpage").attr("title", getNodeValue('Mnextpage'));
	
	//this.initCSS();	
}

/*************************************************
Function:		GetNowTime
Description:	获取当前日期
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetNowTime()
{
	var LSTR_ndate=new Date(); 
	var LSTR_Year=LSTR_ndate.getFullYear(); 
	var LSTR_Month=LSTR_ndate.getMonth(); 
	var LSTR_Date=LSTR_ndate.getDate(); 
	var LSTR_Hours=LSTR_ndate.getHours(); 
	var LSTR_Minutes=LSTR_ndate.getMinutes(); 
	var LSTR_Seconds=LSTR_ndate.getSeconds();
	//alert(LSTR_Month)
	//处理 
	var uom = new Date(LSTR_Year,LSTR_Month,LSTR_Date,LSTR_Hours,LSTR_Minutes,LSTR_Seconds); 
	uom.setDate(uom.getDate()-1);//取得系统时间的前一天,重点在这里,负数是前几天,正数是后几天 
	var LINT_MM=uom.getMonth(); 
	LINT_MM++; 
	var LSTR_MM=LINT_MM > 9?LINT_MM:("0"+LINT_MM) 
	var LINT_DD=uom.getDate(); 
	var LSTR_DD=LINT_DD > 9?LINT_DD:("0"+LINT_DD) 
	var LINT_HH=uom.getHours(); 
	var LSTR_HH=LINT_HH > 9?LINT_HH:("0"+LINT_HH) 
	var LINT_MMt=uom.getMinutes(); 
	var LINT_MMt=LINT_MMt > 9?LINT_MMt:("0"+LINT_MMt) 
	var LINT_SS=uom.getSeconds(); 
	var LSTR_SS=LINT_SS > 9?LINT_SS:("0"+LINT_SS)
	szNowTime = uom.getFullYear() + "-" + LSTR_MM + "-" + LSTR_DD +"T"+ LSTR_HH +":"+LINT_MMt+":"+LSTR_SS
	document.getElementById("StartTime").value = szNowTime;
	
	startY=new Date().Format('yyyy')
	startM=new Date().Format('MM')
	startD=new Date().Format('dd')
	startH=new Date().Format('hh')
	startm=new Date().Format('mm')
	starts=new Date().Format('ss')
	szEndTime=startY+"-"+startM+"-"+startD+"T"+startH+":"+startm+":"+starts
	document.getElementById("EndTime").value = szEndTime;
	
}

/*************************************************
Function:		TurnLogText
Description:	将搜索出的字符串成文字
Output:			无
return:			无				
*************************************************/
function TurnLogText(iLogText)
{
	var szLogText = '';
	if('LOG_USER_SET_MOVE_ALARM_PARAM' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_MOVE_ALARM_PARAM');    //设置移动告警参数
	}
	else if('LOG_USER_SET_PIN_ALARM_PARAM' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_PIN_ALARM_PARAM');    //设置并口告警参数
	}
	else if('LOG_USER_SET_SHADE_ALARM_PARAM' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_SHADE_ALARM_PARAM');   //设置遮挡告警参数
	}
	else if('LOG_USER_SET_REC_PARAM' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_REC_PARAM');   //设置录像参数
	}
	else if('LOG_USER_START_REC' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_START_REC');  //开启录像
	}
	else if('LOG_USER_END_REC' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_END_REC');  //结束录像
	}
	else if('LOG_USER_DOWNLOAD_REC' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_DOWNLOAD_REC');  //录像下载
	}
	else if('LOG_USER_REPLAY_REC' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_REPLAY_REC');  //录像回放
	}
	else if('LOG_USER_SET_SNAP_PARAM' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_SNAP_PARAM');  //设置抓拍参数
	}
	else if('LOG_USER_IPC_SNAP' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_IPC_SNAP');  //前端抓拍
	}
	else if('LOG_USER_DOWNLOAD_SNAP_IMG' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_DOWNLOAD_SNAP_IMG');  //下载抓拍图片
	}
	else if('LOG_USER_PTZ' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_PTZ');  //云台操作
	}
	else if('LOG_USER_PTZ_UPGRADE' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_PTZ_UPGRADE');  //云台升级
	}
	else if('LOG_USER_PTZ_FACTORY' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_PTZ_FACTORY');  //云台恢复出厂
	}
	else if('LOG_USER_SET_SERIAL_PARAM' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_SERIAL_PARAM');  //设置串口参数
	}
	else if('LOG_USER_DELETE_LOG_FILE' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_DELETE_LOG_FILE');  //删除日志文件
	}
	else if('LOG_USER_SYSTEM_UPGRADE' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SYSTEM_UPGRADE');  //系统升级
	}
	else if('LOG_USER_SYSTEM_REBOOT' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SYSTEM_REBOOT');  //系统重启
	}
	else if('LOG_USER_SET_USER_PARAM' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_USER_PARAM');  //修改用户管理参数
	}
	else if('LOG_USER_SET_NETWORK' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_NETWORK');  //设置网络参数
	}
	else if('LOG_USER_SET_SNTP' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_SNTP');  //设置时间同步
	}
	else if('LOG_USER_LOGIN' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_LOGIN');  //用户登录
	}
	else if('LOG_USER_SET_VIDEO_PARAM' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_VIDEO_PARAM');  //设置视频参数
	}
	else if('LOG_USER_SET_AUDIO_PARAM' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_AUDIO_PARAM');  //设置音频参数
	}
	else if('LOG_ALARM_MOVE_ALARM_START' == iLogText)
	{
		szLogText = getNodeValue('LOG_ALARM_MOVE_ALARM_START');  //移动告警开启
	}
	else if('LOG_ALARM_MOVE_ALARM_END' == iLogText)
	{
		szLogText = getNodeValue('LOG_ALARM_MOVE_ALARM_END');  //移动告警结束
	}
	else if('LOG_ALARM_PIN_ALARM_START' == iLogText)
	{
		szLogText = getNodeValue('LOG_ALARM_PIN_ALARM_START');  //并口告警开启
	}
	else if('LOG_ALARM_PIN_ALARM_END' == iLogText)
	{
		szLogText = getNodeValue('LOG_ALARM_PIN_ALARM_END');  //并口告警结束
	}
	else if('LOG_ALARM_SHADE_ALARM_START' == iLogText)
	{
		szLogText = getNodeValue('LOG_ALARM_SHADE_ALARM_START');  //遮挡告警开启
	}
	else if('LOG_ALARM_SHADE_ALARM_END' == iLogText)
	{
		szLogText = getNodeValue('LOG_ALARM_SHADE_ALARM_END');  //遮挡告警结束
	}
	else if('LOG_SYSTEM_MOVE_ALARM_START' == iLogText)
	{
		szLogText = getNodeValue('LOG_SYSTEM_MOVE_ALARM_START');  //定时移动告警检测开启
	}
	else if('LOG_SYSTEM_MOVE_ALARM_END' == iLogText)
	{
		szLogText = getNodeValue('LOG_SYSTEM_MOVE_ALARM_END');  //定时移动告警检测关闭
	}
	else if('LOG_SYSTEM_PIN_ALARM_START' == iLogText)
	{
		szLogText = getNodeValue('LOG_SYSTEM_PIN_ALARM_START');  //定时并口告警检测开启
	}
	else if('LOG_SYSTEM_PIN_ALARM_END' == iLogText)
	{
		szLogText = getNodeValue('LOG_SYSTEM_PIN_ALARM_END');  //定时并口告警检测关闭
	}
	else if('LOG_SYSTEM_SHADE_ALARM_START' == iLogText)
	{
		szLogText = getNodeValue('LOG_SYSTEM_SHADE_ALARM_START');  //定时遮蔽告警检测开启
	}
	else if('LOG_SYSTEM_SHADE_ALARM_END' == iLogText)
	{
		szLogText = getNodeValue('LOG_SYSTEM_SHADE_ALARM_END');  //定时遮蔽告警检测关闭
	}
	else if('LOG_SYSTEM_REC_START' == iLogText)
	{
		szLogText = getNodeValue('LOG_SYSTEM_REC_START');  //定时录像开启
	}
	else if('LOG_SYSTEM_REC_END' == iLogText)
	{
		szLogText = getNodeValue('LOG_SYSTEM_REC_END');  //定时录像关闭
	}
	else if('LOG_SYSTEM_DN_MODE_DAY' == iLogText)
	{
		szLogText = getNodeValue('LOG_SYSTEM_DN_MODE_DAY');  //定时日夜模式-日模式
	}
	else if('LOG_SYSTEM_DN_MODE_NIGHT' == iLogText)
	{
		szLogText = getNodeValue('LOG_SYSTEM_DN_MODE_NIGHT');  //定时日夜模式-夜模式
	}
	else if('LOG_SYSTEM_PTZ_START' == iLogText)
	{
		szLogText = getNodeValue('LOG_SYSTEM_PTZ_START');  //定时云台任务开启
	}
	else if('LOG_SYSTEM_PTZ_END' == iLogText)
	{
		szLogText = getNodeValue('LOG_SYSTEM_PTZ_END');  //定时云台任务关闭
	}
	else if('LOG_EXCEPTION_DISK_FULL' == iLogText)
	{
		szLogText = getNodeValue('LOG_EXCEPTION_DISK_FULL');  //磁盘满
	}
	else if('LOG_EXCEPTION_DISK_ERROR' == iLogText)
	{
		szLogText = getNodeValue('LOG_EXCEPTION_DISK_ERROR');  //磁盘错误
	}
	else if('LOG_EXCEPTION_CABLE_BREAK' == iLogText)
	{
		szLogText = getNodeValue('LOG_EXCEPTION_CABLE_BREAK');  //网线断开
	}
	else if('LOG_EXCEPTION_CABLE_RESUME' == iLogText)
	{
		szLogText = getNodeValue('LOG_EXCEPTION_CABLE_RESUME');  //网线重连上
	}
	else if('LOG_EXCEPTION_IP_CLASH' == iLogText)
	{
		szLogText = getNodeValue('LOG_EXCEPTION_IP_CLASH');  //IP冲突
	}
	else if('LOG_EXCEPTION_ILLEGAL_VISIT' == iLogText)
	{
		szLogText = getNodeValue('LOG_EXCEPTION_ILLEGAL_VISIT');  //非法访问
	}
	else if('LOG_USER_SET_PINOUT_ALARM_PARAM' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_PINOUT_ALARM_PARAM');  //设置告警输出参数
	}
	else if('LOG_USER_SET_EXCEPTION_LINK_PARAM' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_EXCEPTION_LINK_PARAM');  //设置异常联动参数
	}
	else if('LOG_USER_MEMORY_MANAGE' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_MEMORY_MANAGE');  //存储管理
	}
	else if('LOG_USER_SET_PTZ_CONFIG' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_PTZ_CONFIG');  //设置云台配置参数
	}
	else if('LOG_USER_SET_RTSP_ADENTI' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_RTSP_ADENTI');  //RTSP认证参数
	}
	else if('LOG_USER_SET_IP_FLITER' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_IP_FLITER');  //IP地址过滤参数
	}
	else if('LOG_USER_SET_DEV_INFO' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_DEV_INFO');  //设置设备信息
	}
	else if('LOG_USER_RECOVER_FACTORY' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_RECOVER_FACTORY');  //恢复出厂
	}
	else if('LOG_USER_SET_DISCOVER_MODE' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_DISCOVER_MODE');  //设置发现模式
	}
	else if('LOG_USER_MANUAL_TIMING' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_MANUAL_TIMING');  //手动校时
	}
	else if('LOG_USER_SET_SUMMER_TIME' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_SUMMER_TIME');  //设置夏令时参数
	}
	else if('LOG_USER_EXPORT_CONFIG' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_EXPORT_CONFIG');  //导出配置文件
	}
	else if('LOG_USER_INPORT_CONFIG' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_INPORT_CONFIG');  //导入配置文件
	}
	else if('LOG_USER_SET_ADVANCED_CONFIG' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_ADVANCED_CONFIG');  //设置高级配置
	}
	else if('LOG_USER_SET_AUTO_MAINTAIN' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_AUTO_MAINTAIN');  //设置自动维护参数
	}
	else if('LOG_USER_SET_OSD_PARAM' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_OSD_PARAM');  //用户设置OSD参数
	}
	else if('LOG_USER_SET_ISP_PARAM' == iLogText)
	{
		szLogText = getNodeValue('LOG_USER_SET_ISP_PARAM');  //设置图像参数
	}
	
	return szLogText;
}

/*************************************************
Function:		initLog
Description:	初始化日志页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initLog()
{
	
	
	
	
	
	GetNowTime();//获取时间表
	GetLogType()  //获取类型
	
	setTimeout(function (){
		GetLogStartrecord();  //获取是否启用记录
	},100);
	
	
	//window.parent.document.getElementById("IpcCtrl")
	//top.document.getElementById("IpcCtrl").saveLog("用户类型             远程主机地址      时间                   内容", true);
	
	 if(document.all)
   {
		 $("#mainplugin").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="plugin0"  width="100%" height="100%" ></object>')
	   }
   else
	   {
		 $("#mainplugin").html('<embed id="plugin0" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
	  }
	  Plugin();
	  autoResizeIframe();
}

function GetLogType(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/log/getlogtype"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{
		    var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			g_szChangeLogXml=xmlDoc;
			$(xmlDoc).find("types").each(function(i){ 
			   var  BigType = $(this).attr("name");//this-> 
			   if(BigType=="All Log"){
				  $("<option id='"+'MajorTypeOpt1'+"' name='"+'MajorTypeOpt1'+"' value='"+BigType+"'>"+getNodeValue('MajorTypeOpt1')+"</option>").appendTo("#LogType"); 
				}
			   else if (BigType=="User Operator"){
				 //  $("#LogType").append("<option id='"+'MajorTypeOpt'+(i + 1)+"' name='"+'MajorTypeOpt'+(i + 1)+"' value='"+BigType+"'>"+getNodeValue('MajorTypeOpt'+(i + 1))+"</option>");   //替换下拉菜单里文字
				   $("<option id='"+'MajorTypeOpt2'+"' name='"+'MajorTypeOpt2'+"' value='"+BigType+"'>"+getNodeValue('MajorTypeOpt2')+"</option>").appendTo("#LogType");
				}
				else if(BigType=="Alter Message")
				{
				   $("<option id='"+'MajorTypeOpt3'+"' name='"+'MajorTypeOpt3'+"' value='"+BigType+"'>"+getNodeValue('MajorTypeOpt3')+"</option>").appendTo("#LogType");	
				}
				else if(BigType=="System Task"){
					$("<option id='"+'MajorTypeOpt4'+"' name='"+'MajorTypeOpt4'+"' value='"+BigType+"'>"+getNodeValue('MajorTypeOpt4')+"</option>").appendTo("#LogType");
				}
				else if(BigType=="System Exception"){
					$("<option id='"+'MajorTypeOpt4'+"' name='"+'MajorTypeOpt4'+"' value='"+BigType+"'>"+getNodeValue('MajorTypeOpt5')+"</option>").appendTo("#LogType");
				}
		       // $("#LogType").append("<option id='"+'MajorTypeOpt'+(i + 1)+"' name='"+'MajorTypeOpt'+(i + 1)+"' value='"+BigType+"'>"+getNodeValue('MajorTypeOpt'+(i + 1))+"</option>");   //替换下拉菜单里文字
			   
			   //$("<option value='pirStart' name='pirStart'>"+getNodeValue("pirStart")+"</option>").appendTo("#MinorType");
			  }); 

			ChangeLogType(); //选择子类下拉
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};	

function ChangeLogType(){
   $("#LogTypex > option").remove(); 
   var pname = $("#LogType").val(); 
   if(pname == 'User Operator'){
	 	 $(g_szChangeLogXml).find("types[name='"+pname+"']>type").each(function(i,data){ 
		   var Typetext=$(g_szChangeLogXml).find("types[name='"+pname+"']>type").eq(i).text();
		   if(Typetext=="User_Alarm_Param_Set"){ //告警类操作
			  $("<option id='"+'LogTypexUserOpt1'+"' name='"+'LogTypexUserOpt1'+"' value='"+Typetext+"'>"+getNodeValue('LogTypexUserOpt1')+"</option>").appendTo("#LogTypex");
		    }
			else if(Typetext=="User_Rec_Operate"){    //录像抓拍类操作
			  $("<option id='"+'LogTypexUserOpt2'+"' name='"+'LogTypexUserOpt2'+"' value='"+Typetext+"'>"+getNodeValue('LogTypexUserOpt2')+"</option>").appendTo("#LogTypex"); 
			}
			else if(Typetext=="User_PTZ_Set"){  //云台控制类操作
			  $("<option id='"+'LogTypexUserOpt3'+"' name='"+'LogTypexUserOpt3'+"' value='"+Typetext+"'>"+getNodeValue('LogTypexUserOpt3')+"</option>").appendTo("#LogTypex"); 
			}
		   else if(Typetext=="User_Sys_Maintain"){  //系统维护类操作
			  $("<option id='"+'LogTypexUserOpt4'+"' name='"+'LogTypexUserOpt4'+"' value='"+Typetext+"'>"+getNodeValue('LogTypexUserOpt4')+"</option>").appendTo("#LogTypex"); 
			 }
		   else if(Typetext=="User_Video_Operate"){  //视频类操作
			  $("<option id='"+'LogTypexUserOpt5'+"' name='"+'LogTypexUserOpt5'+"' value='"+Typetext+"'>"+getNodeValue('LogTypexUserOpt5')+"</option>").appendTo("#LogTypex"); 
			 }
		   else if(Typetext=="User_Audio_Operate"){  //音频类操作
			  $("<option id='"+'LogTypexUserOpt6'+"' name='"+'LogTypexUserOpt6'+"' value='"+Typetext+"'>"+getNodeValue('LogTypexUserOpt6')+"</option>").appendTo("#LogTypex"); 
			 }
		   else if(Typetext=="User_Isp_Operate"){  //图像类操作
			  $("<option id='"+'LogTypexUserOpt7'+"' name='"+'LogTypexUserOpt7'+"' value='"+Typetext+"'>"+getNodeValue('LogTypexUserOpt7')+"</option>").appendTo("#LogTypex"); 
			 }
		});
	 }
   else if(pname == 'Alter Message'){
	   $(g_szChangeLogXml).find("types[name='"+pname+"']>type").each(function(i){ 
	         var TypetextAlter=$(g_szChangeLogXml).find("types[name='"+pname+"']>type").eq(i).text();
			 if(TypetextAlter=="AlarmInfo_Moving"){  //移动告警信息
			   $("<option id='"+'LogTypexAlterOpt1'+"' name='"+'LogTypexAlterOpt1'+"' value='"+TypetextAlter+"'>"+getNodeValue('LogTypexAlterOpt1')+"</option>").appendTo("#LogTypex");
		     }
			 else if(TypetextAlter=="AlarmInfo_Pin"){  //并口告警信息
			  $("<option id='"+'LogTypexAlterOpt2'+"' name='"+'LogTypexAlterOpt2'+"' value='"+TypetextAlter+"'>"+getNodeValue('LogTypexAlterOpt2')+"</option>").appendTo("#LogTypex"); 
			 }
			 else if(TypetextAlter=="AlarmInfo_Shade"){  //遮蔽告警信息
			  $("<option id='"+'LogTypexAlterOpt3'+"' name='"+'LogTypexAlterOpt3'+"' value='"+TypetextAlter+"'>"+getNodeValue('LogTypexAlterOpt3')+"</option>").appendTo("#LogTypex"); 
			 }
			
			//$("#LogTypex").append("<option id='"+'LogTypexAlterOpt'+(i + 1)+"' name='"+'LogTypexAlterOpt'+(i + 1)+"' value='"+$(this).text()+"'>"+getNodeValue('LogTypexAlterOpt'+(i + 1))+"</option>");
		});
	 }
 
	if ($("#LogTypex").val()==null){
	  $(".LogTypexHide").hide();	
	}else{
	  $(".LogTypexHide").show();	
	}
   $("#LogTableList").empty();
   $("#SaveLog").prop("disabled", true);  //启用
   $("#pagetoolbar").hide();
   autoResizeIframe();
}
function changeLogTypex(){
	 $("#LogTableList").empty();
     $("#SaveLog").prop("disabled", true);  //启用
	 $("#pagetoolbar").hide();
	 
};

//隔行换色
function tablese(){
	$("#LogTableList tr:odd").addClass("trOdd");  /* 奇数行添加样式*/
   $("#LogTableList tr:even").addClass("treven"); /* 偶数行添加样式*/	
};


function tab(){
	var oTab=document.getElementById('gmss_table0');
	var oldBgColor='#434549';
	var i=0;
	for(i=0;i<oTab.tBodies[0].rows.length;i++)    //egnth-1 表示最后一行没有鼠标效果
	{
		oTab.tBodies[0].rows[i].style.background=i%2?'#F8F8F6':'';  //隔行换色
		oTab.tBodies[0].rows[i].onmouseover=function ()
		{
			//this.style.cursor="pointer";
			oldBgColor=this.style.background;
			this.style.background='#DAEBF2';
		};
		oTab.tBodies[0].rows[i].onmouseout=function ()
		{
			this.style.background=oldBgColor;
		};
	}
};//隔行换色
/***保存日志**/
var g_TimerLogDown;
function SaveLog(){
   if (m_PreviewOCX==null)
	{
		//szRetInfo=  m_szErrorState+"请安装插件"	
		//$("#SetResultTipscropping").html(szRetInfo);
		//setTimeout(function(){$("#SetResultTipscropping").html("");},5000);  //5秒后自动清除
		alert(m_plugintips)
		return;
	}
   var ret = "false";
   if (LogTypex==null){
	   ret = top.document.getElementById("IpcCtrl").eventWebToPlugin("log", camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'),s_time,End_time,LogType);
	  }else{
	  ret =  top.document.getElementById("IpcCtrl").eventWebToPlugin("log", camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'),s_time,End_time,LogType,LogTypex);	  
	   };
	   if("true" == ret)
	   {
         window.parent.parent.$('#divUpgradeTable').modal({
         "close":false   //禁用叉叉和ESC
        });
        window.parent.parent.$("#divTitle").html(getNodeValue('MSaveLog'));
        window.parent.parent.$("#divUpgradeExplaintips").hide();
        window.parent.parent.$("#divUpgradeExplain").html(getNodeValue('MSaveLoging'))
        window.parent.parent.$("#UpgradePTZClose").show();
        g_TimerLogDown= setInterval("logdown_progess()",1000);
	   }
}

// 日志下载进度条
function logdown_progess(){
	var logdown_progess=top.document.getElementById("IpcCtrl").eventWebToPlugin("log","downquery");
	var logdown = logdown_progess.split(",");
	if (logdown[0] >= 100){
		//console.log("进"+"  "+cfgdown[0])
		clearInterval(g_TimerLogDown);
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('MSaveLog')+m_szSuccess6); //保存成功
		window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
		//window.parent.parent.$("#UpgradeIdclose").click()
	}else if (logdown[1]==1){
		clearInterval(g_TimerLogDown);
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('MSaveLog')+m_szError9);  //保存失败
		window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
	}
};

/*********
清空日志
*************/
function ClearLog(){
	if (confirm(getNodeValue('MEmptyLog'))){
		var szXml = "<contentroot>";
	        szXml +=$.cookie('authenticationinfo');
 	        szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/log/clear"
		$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{
		   $("#LogTableList").empty();
		   $("#pagetoolbar").hide();
		   autoResizeIframe();
		   
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	  });
	}
	
}


//获取系统时间
function GetSysTime(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/time/info"
	$.ajax({
		type: "post",
		url:szURL,
		async: false,  //同步
		processData: false,//不转换
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
			},
			success: function(xmlDoc, textStatus, xhr) {
				var Docxml =xhr.responseText;
		        var xmlDoc = GetparseXmlFromStr(Docxml);
				
				//获取时间
				GetSytTtme=$(xmlDoc).find('time').eq(0).text();  //当前页
				
			},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		 });
	    
};

/***********
  日志搜索
***********/
/*************************************************
Function:		GetexPage
Description:	搜索日志
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetexPage(obj){
	 
	LogType=$("#LogType").val();
	LogTypex=$("#LogTypex").val();
	if (obj=="SearchLog"){
		//GetSysTime();  //获取设备时间
		 s_time= $("#StartTime").val();
		 End_time= $("#EndTime").val();
		if (s_time > End_time){
			alert(getNodeValue('MStartTime')+getNodeValue('MNgreater')+getNodeValue('MEndTime'));
			return;
		}
		var StartSize=1;
	}else if(obj=="NextPage"){
		var totalsun=Math.ceil(Number(total)/Number(ReadRecordMax))
		if (curPage >= totalsun ){
			return
		}
		var StartSize=((parseInt(curPage)+parseInt(1))*parseInt(ReadRecordMax))-(parseInt(ReadRecordMax)-parseInt(1));
	}else if(obj=="lastPage"){
		if (curPage <= 1){
			return
		}
		var StartSize=((parseInt(curPage)-parseInt(1))*parseInt(ReadRecordMax))-(parseInt(ReadRecordMax)-parseInt(1));
	}else if(obj=="GoPage"){
		var curPagevalue=$("#curPagevalue").val();
		var totalPage = Math.ceil(Number(total)/Number(ReadRecordMax))
		if (curPagevalue==0 || curPagevalue=="" ){
			return;
		}else if(curPagevalue > totalPage ){
			$("#curPagevalue").val(curPage)
			return;
		}
		var StartSize=(parseInt(curPagevalue)-1)*parseInt(ReadRecordMax)+parseInt(1)
	 }
	var szXml = "<logparamex version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<start>"+s_time+"</start>";  //开始时间
		szXml += "<end>"+End_time+"</end>";      //结束时间
		szXml += '<types name="'+LogType+'">';    //查询大类
		if (LogTypex!=null){
			szXml += "<type>"+LogTypex+"</type>"; //查询小类
		}
		szXml += "</types>";
		szXml += "<startpos>"+StartSize+"</startpos>";  //查询起始位置
		szXml += "<readrecordmax >"+ReadRecordMax+"</readrecordmax >";  //查询最大长度
		szXml += "</logparamex>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/log/getex"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		async: false,  //同步
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},success: function(xmlDoc, textStatus, xhr)
		{
			var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			$("#LogTableList").empty();
			total=$(xmlDoc).find('sum').eq(0).text();  //取得总页数
			var curPage1=$(xmlDoc).find('start').eq(0).text();  //当前页
			curPage=Math.ceil(Number(curPage1)/Number(ReadRecordMax))
			
			if(total <=0 ){
				$("#pagetoolbar").hide();
				$("#SaveLog").prop("disabled", true);  //禁用
				autoResizeIframe();
				return
			}
			
			$("#pagetoolbar").show();
			$("#SaveLog").prop("disabled", false);  //禁用
			 $(xmlDoc).find("records").find("record").each(function(i,data)
				{
					//k_size=$(this).attr('size');
					//console.log("k_size"+"   "+k_size)
					var  time= $(this).children('time').text();
					 var ip= $(this).children('ip').text();
					var  username= $(this).children('username').text();
					var  content=$(this).children('content').text();
					 var _len = $("#LogTableList").length; 
						$("#LogTableList").append("<tr>"
						  +"<td class='td_user'>"+username+"</td>"
						   +"<td class='td_user2'>"+ip+"</td>"
						   +"<td class='td_user2'>"+time+"</td>"
						   +"<td class='td_user2'>"+"<label name='"+content+"'>"+TurnLogText(content)+"</label>"+"</td>"
						 +"</tr>");
				});
		   $("#curPagetext").html(total);  //总条数
		   
		   $("#total").html(Math.ceil(Number(total)/Number(ReadRecordMax)));
		   $("#curPagevalue").val(curPage).prop("disabled", false);  //启用
		   $(".curPageClass").html(curPage);	
		   $("#SaveLog").prop("disabled", false);  //启用
			tablese();  //隔行换色
		    autoResizeIframe();
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//是否启用日志记录
function GetLogStartrecord(){
    var szXml = "<contentroot>";
	        szXml +=$.cookie('authenticationinfo');
 	        szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/log/startrecord"
		$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{
		    var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			 $(xmlDoc).find("startrecord").each(function(i,data) {
				var g_startrecord= $(this).text();  
				if (g_startrecord=="true"){
					$("#startrecord").val(true).prop("checked", true);
				}else{
					$("#startrecord").val(false).prop("checked", false);
				};
			});
			
		   
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	  });
}
//启用日志记录
function startrecord()
{
  
	if($("#startrecord").prop("checked")){ //选中
	  $("#startrecord").val(true).prop("checked", true);
	  
	}else{
	  $("#startrecord").prop("checked", false);
	  $("#startrecord").val(false).prop("checked",false)
	 
	}
	
	
	var startrecord=$("#startrecord").val();
	
	var szXml = "<startrecordinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<startrecord>"+startrecord+"</startrecord>";
		szXml += "</startrecordinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/log/startrecord"
		$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{
			GetLogStartrecord();
		   
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	  });
}
