var m_szBrowser = navigator.appName; //获取浏览器名称
var g_lxdPreview = null; // Preview.xml
var m_dtCalendarDate = "";		    //当前日历的日期
var m_szStartTimeSet = new Array(); //开始时间集合
var m_szEndTimeSet = new Array();   //结束时间集合
var curPage = 0 ; //当前页码 
var total,pageSize,totalPage; //总记录数，每页显示数，总页数
var pagesum=0 ,total=0; //图片总数
var picinfo="";

var SearchID="";//图片搜索ID
var StartSize=null;
var m_qurnumber=20; //最大查询数量
var m_storagestate=0;
var m_szSuccessState = "&nbsp;<img src='../images/config/smile.png' class='imgmiddle'>&nbsp;"; //设置成功
//var m_szSuccessState = "&nbsp;"; //设置成功
var m_szErrorState = "&nbsp;<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;"; //设置失败 

/*************************************************
Function:		Initplayback
Description:	初始化预览界面
Input:			无
Output:			无
return:			无
*************************************************/
function Initpic() {
	
    window.parent.ChangeMenu(3);
    ChangeLanguage(parent.translator.szCurLanguage);
 
    var ContentWidth=960;
    parent.$("#head_top").width(ContentWidth);
	parent.$("#maindevicetype").width(ContentWidth);
	parent.$("#menu").width(ContentWidth);
	parent.$("#content").width(ContentWidth);
	parent.$("#content").height(720);
	parent.$("#contentframe").height(700);
	initPicGetCap("picmanager=true");//图片管理
	  if(document.all)
  	 {
		 $("#mainplugin").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="plugin0"  width="100%" height="100%" ></object>');
	   }
   else
	   {
		 $("#mainplugin").html('<embed id="plugin0" type="application/x-ipcwebui"  width="100%" height="100%"></embed>');
	  }
	 Plugin();
	 
	 
	  if (m_PreviewOCX!=null){
		top.parent.$("#PluginWeb").html(top.document.getElementById("IpcCtrl").getPluginVersion())
	  }
	GetNowTime();
	 $("#CheckedAll").click(function(){
			//所有checkbox跟着全选的checkbox走。
			$('[name=PicTypeList]:checkbox').attr("checked", this.checked );
			var checktypeObj=$("input[name='PicTypeList']:checked").length;
			
	 });
	 $("#CheckedAll").prop("checked", true);
	 $("input[name='PicTypeList']").prop("checked", true);
	 /*$("#lastPage").attr("title", getNodeValue('MlastPage'));
 	 $("#nextpage").attr("title", getNodeValue('Mnextpage'));
	 ("#firstPage").attr("title", getNodeValue('Mfirstpage'));
	 ("#endPage").attr("title", getNodeValue('Mendpage'));
	 $("#down").attr("title", getNodeValue('Mdown'));*/
	 
}
function initPicGetCap(obj){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/getcap?"+obj
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
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr);
		}
	});
};

function GetNowTime(){
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
	uom.setDate(uom.getDate()-7);//取得系统时间的前一天,重点在这里,负数是前几天,正数是后几天 
	var LINT_MM=uom.getMonth(); 
	LINT_MM++; 
	var LSTR_MM=LINT_MM > 9?LINT_MM:("0"+LINT_MM);
	var LINT_DD=uom.getDate(); 
	var LSTR_DD=LINT_DD > 9?LINT_DD:("0"+LINT_DD);
	var LINT_HH=uom.getHours(); 
	var LSTR_HH=LINT_HH > 9?LINT_HH:("0"+LINT_HH); 
	var LINT_MMt=uom.getMinutes(); 
	var LINT_MMt=LINT_MMt > 9?LINT_MMt:("0"+LINT_MMt); 
	var LINT_SS=uom.getSeconds(); 
	var LSTR_SS=LINT_SS > 9?LINT_SS:("0"+LINT_SS);
	szNowTime = uom.getFullYear() + "-" + LSTR_MM + "-" + LSTR_DD +"T"+ LSTR_HH +":"+LINT_MMt+":"+LSTR_SS
	//document.getElementById("StartTime").value = szNowTime;
	
	
	var LSTR_ndate1=new Date(); 
	var LSTR_Year1=LSTR_ndate1.getFullYear(); 
	var LSTR_Month1=LSTR_ndate1.getMonth(); 
	var LSTR_Date1=LSTR_ndate1.getDate(); 
	var LSTR_Hours1=LSTR_ndate1.getHours(); 
	var LSTR_Minutes1=LSTR_ndate1.getMinutes(); 
	var LSTR_Seconds1=LSTR_ndate1.getSeconds();
	var uom1 = new Date(LSTR_Year1,LSTR_Month1,LSTR_Date1,LSTR_Hours1,LSTR_Minutes1,LSTR_Seconds1); 
	uom1.setDate(uom1.getDate()-1);//取得系统时间的前一天,重点在这里,负数是前几天,正数是后几天 
	
	var LINT_MM1=uom1.getMonth(); 
	LINT_MM1++; 
	var LSTR_MM1=LINT_MM1 > 9?LINT_MM1:("0"+LINT_MM1) 
	var LINT_DD1=uom1.getDate(); 
	var LSTR_DD1=LINT_DD1 > 9?LINT_DD1:("0"+LINT_DD1) 
	var LINT_HH1=uom1.getHours(); 
	var LSTR_HH1=LINT_HH1 > 9?LINT_HH1:("0"+LINT_HH1) 
	var LINT_MMt1=uom1.getMinutes(); 
	var LINT_MMt1=LINT_MMt1 > 9?LINT_MMt1:("0"+LINT_MMt1) 
	var LINT_SS1=uom1.getSeconds(); 
	var LSTR_SS1=LINT_SS1 > 9?LINT_SS1:("0"+LINT_SS1)
	szNowTime1 = uom1.getFullYear() + "-" + LSTR_MM1 + "-" + LSTR_DD1 +"T"+ LSTR_HH1 +":"+LINT_MMt1+":"+LSTR_SS1
	startY=new Date().Format('yyyy');
	startM=new Date().Format('MM');
	startD=new Date().Format('dd');
	startH=new Date().Format('hh');
	startm=new Date().Format('mm');
	starts=new Date().Format('ss');
	
	
	//var date =  new Time();
	startY=new Date().Format('yyyy-MM-ddThh:mm:ss');
	$("#contenter").height(700);
	var objradio=$("input[name='SearchPicType']:checked"); 
	if (objradio.val()==1){
	   $("#SubPicTime").hide()	;
	   $("#StartTime").val(szNowTime);
	   $("#EndTime").val(startY);
	}
	$("input[name='SearchPicType']").click(function(){
		var LSTR_ndate1=new Date(); 
		var LSTR_Year1=LSTR_ndate1.getFullYear(); 
		var LSTR_Month1=LSTR_ndate1.getMonth(); 
		var LSTR_Date1=LSTR_ndate1.getDate(); 
		var LSTR_Hours1=LSTR_ndate1.getHours(); 
		var LSTR_Minutes1=LSTR_ndate1.getMinutes(); 
		var LSTR_Seconds1=LSTR_ndate1.getSeconds();
		var uom1 = new Date(LSTR_Year1,LSTR_Month1,LSTR_Date1,LSTR_Hours1,LSTR_Minutes1,LSTR_Seconds1); 
		uom1.setDate(uom1.getDate()-1);//取得系统时间的前一天,重点在这里,负数是前几天,正数是后几天 
		
		var LINT_MM1=uom1.getMonth(); 
		LINT_MM1++; 
		var LSTR_MM1=LINT_MM1 > 9?LINT_MM1:("0"+LINT_MM1) 
		var LINT_DD1=uom1.getDate(); 
		var LSTR_DD1=LINT_DD1 > 9?LINT_DD1:("0"+LINT_DD1) 
		var LINT_HH1=uom1.getHours(); 
		var LSTR_HH1=LINT_HH1 > 9?LINT_HH1:("0"+LINT_HH1) 
		var LINT_MMt1=uom1.getMinutes(); 
		var LINT_MMt1=LINT_MMt1 > 9?LINT_MMt1:("0"+LINT_MMt1) 
		var LINT_SS1=uom1.getSeconds(); 
		var LSTR_SS1=LINT_SS1 > 9?LINT_SS1:("0"+LINT_SS1)
		szNowTime1 = uom1.getFullYear() + "-" + LSTR_MM1 + "-" + LSTR_DD1 +"T"+ LSTR_HH1 +":"+LINT_MMt1+":"+LSTR_SS1
		startY=new Date().Format('yyyy-MM-ddThh:mm:ss');
		if ($(this).val()==0){
			$("#SubPicTime").hide()	;
		
		   $("#StartTime").val("1970-01-01T00:00:00");
		 $("#EndTime").val(startY);
		}else if($(this).val()==1){
			//$("#StartTime").val(DayAdd(date.getStringTime(),-7))
			$("#StartTime").val(szNowTime);
	      // $("#EndTime").val(date.getStringTime())
		    $("#EndTime").val(startY);
		    $("#SubPicTime").hide();
		}else{
			$("#StartTime").val(szNowTime1);
			$("#EndTime").val(startY);
			$("#SubPicTime").show();
		}
		
	 })
};
//查询硬盘状态
function storagestate(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/state"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		async: false,  //同步
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},success: function(xmlDoc, textStatus, xhr)
		{
			var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			   $(xmlDoc).find("state").each(function(i){ 
			     if ($(this).text()=="null"){
					//alert("磁盘不可用，请检查磁盘是否插入")
					$("#SearchPreparequerytips").html(parent.translator.translateNode(g_lxdpic, 'Mnomemorycard'));
					setTimeout(function(){$("#SearchPreparequerytips").html("");},5000);  //5秒后自动清除
					m_storagestate=1;
				}
			});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
function picautoResizeIframe(){
	if($("#content").height() > 616)
	{  
		window.parent.document.getElementById('content').style.height = $("#contentright").height() + 86 + "px";
		window.parent.document.getElementById('contentframe').style.height =  $("#EditAreaContent").height() + 50 + "px";
		
		//var th1=$("#contentleft").height();
		var th2=$("#contentright").height()
		//th1=th2;
		$("#contentleft").height(th2)
		$("#contentright").height(th2)
	}
	else
	{   
		window.parent.document.getElementById('content').style.height = 655 + "px";
		window.parent.document.getElementById('contentframe').style.height =  619 + "px";				
		
		$("#contentleft").height(616)
		$("#contentright").height(616)
	}
};

//图片搜索
/*************************************************
Function:		GetexPagePic
Description:	搜索图片
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetexPagePic(obj){
	 $("#PicAllCheck").prop("checked", false);  //全选下载复选框不勾选
	 
	if (obj=="SearchPic"){  //开始搜索
	     storagestate();
		 GetNowTime();
		 qurtype=""
	 	checktypeCheck=$("input[name='PicTypeList']:checked")
	 	if(checktypeCheck.length==0){
			$("#SearchPreparequerytips").html(parent.translator.translateNode(g_lxdpic, 'Mtypeofpicture'))
			setTimeout(function(){$("#SearchPreparequerytips").html("");},5000);  //5秒后自动清除 
			return
		}else if (checktypeCheck.length==1){
			qurtype=checktypeCheck.val()
			
		}else if(checktypeCheck.length==2){
			qurtype="all"
	 }
		
		
		$("#PicSearch").prop('disabled',true);
		setTimeout(function (){$("#PicSearch").prop('disabled',false)},2000);
		    szStartTime=$("#StartTime").val();
		if ($("input[name='SearchPicType']:checked").val()==0){
			//$("#EndTime").val(startY);
			$("#EndTime").val("2035-01-01T00:00:00");
			 szStopTime=$("#EndTime").val();
		}else if($("input[name='SearchPicType']:checked").val()==1){
			 szStopTime=$("#EndTime").val();
		}else{
			 szStopTime=$("#EndTime").val();
		}
		if (szStartTime > szStopTime){
			$("#SearchPreparequerytips").html(getNodeValue("Mstarttime")+getNodeValue("Mnotmorethan")+getNodeValue("Mendtime"))
			setTimeout(function(){$("#SearchPreparequerytips").html("");},5000);  //5秒后自动清除 
			return
		}
		var StartSize=1;
		
	}
	else if(obj=="firstPage"){ //首页
		if (curPage <= 1 ){
			return
		}
		var StartSize=1;
	}
	else if(obj=="endPage"){ //尾页
		var totalsun=Math.ceil(Number(total)/Number(m_qurnumber))
		if (curPage >= totalsun ){
			return
		}
		var StartSize=(parseInt(totalsun)*parseInt(m_qurnumber))-(parseInt(m_qurnumber)-parseInt(1));
	}
	else if(obj=="NextPage"){ //下一页
		var totalsun=Math.ceil(Number(total)/Number(m_qurnumber))
		if (curPage >= totalsun ){
			return
		}
		var StartSize=((parseInt(curPage)+parseInt(1))*parseInt(m_qurnumber))-(parseInt(m_qurnumber)-parseInt(1));
	}
	else if(obj=="lastPage"){ //上一页
		if (curPage <= 1){
			return
		}
	   var StartSize=((parseInt(curPage)-parseInt(1))*parseInt(m_qurnumber))-(parseInt(m_qurnumber)-parseInt(1));
	}
	else if(obj=="GoPage"){  //跳转
		
		var curPagevalue=$("#curPagevalue").val();
		var totalPage = Math.ceil(Number(total)/Number(m_qurnumber))
		if (curPagevalue==0 || curPagevalue=="" ){
			return;
		}else if(curPagevalue > totalPage ){
			$("#curPagevalue").val(curPage)
			return;
		}
	   var StartSize=(parseInt(curPagevalue)-1)*parseInt(m_qurnumber)+parseInt(1)
	}
	if (m_storagestate==1){
		return
	}
    var szXml = "<picqueryparamex version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<starttime>"+szStartTime+"</starttime>";  //开始时间
		szXml += "<endtime>"+szStopTime+"</endtime>";      //结束时间
	    szXml += "<qurtype>"+qurtype+"</qurtype>"; //查询类型
		szXml += "<qurstart>"+StartSize+"</qurstart>";  //查询起始位置
		szXml += "<qurnumber>"+m_qurnumber+"</qurnumber>";  //最大查询数量
		szXml += "</picqueryparamex>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/piccapture/1/picqueryex"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},success: function(xmlDoc, textStatus, xhr)
		{
			var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			 $("#TbodyPic").empty();
			total=$(xmlDoc).find('sum').eq(0).text();  //取得总条数
			if (total <= 0){
				$("#SearchPreparequerytips").html(getNodeValue("Mnopic"));
				setTimeout(function(){$("#SearchPreparequerytips").html("");},5000);  //5秒后自动清除
			}
			else if (total >= 3600 ){
				if (obj=="SearchPic"){
				$("#SearchPreparequerytips").html(getNodeValue("Mbeyond")+3600+getNodeValue("Mzhang")+getNodeValue("Msearchpic"));
					setTimeout(function(){$("#SearchPreparequerytips").html("");},5000);  //5秒后自动清除
				}
				total=3600;
			}
			
			var curPage1=$(xmlDoc).find('sn').eq(0).text();  //当前页
			curPage=Math.ceil(Number(curPage1)/Number(m_qurnumber))
			
			 $(xmlDoc).find("piclist").find("pic").each(function(i,data)
				{
					var  PicSn= $(this).children('sn').text();
					 var PicId= $(this).children('id').text();
					var  PicSnaptime= $(this).children('snaptime').text();
					 var _len = $("#TbodyPic").length; 
					$("#TbodyPic").append("<tr class='tabletrtd' id='tr"+parseInt(PicSn)+"'  style='border-right:none;'>"
						       +"<td class='tabletrtd tablethtdwidth01' id='check"+parseInt(PicSn)+"'><input id='checkbox"+parseInt(PicSn)+"' class='checkbox inputpic' type='checkbox' name='checkbixpic'></td>"
							   +"<td class='tabletrtd tablethtdwidth02' id='PicSn"+parseInt(PicSn)+"'>"+PicSn+"</td>"
							   +"<td class='tabletrtd tablethtdwidth02 displaynone' id='PicId"+parseInt(PicSn)+"'>"+PicId+"</td>"
							   +"<td colspan='2' class='tabletrtd tablethtdwidth02 border_right_none' style='border-right:none;' id='PicSnaptime"+parseInt(PicSn)+"'>"+PicSnaptime+"</td>"
						+"</tr>");
					
				});
		   $("#curPagetext").html(total);  //总条数
		   $("#total").html(Math.ceil(Number(total)/Number(m_qurnumber)));
		   if (total==0){
				$("#curPagevalue").val(curPage).prop("disabled", true);  //启用	
			}else{
			    $("#curPagevalue").val(curPage).prop("disabled", false);  //启用	
			}
		   $(".curPageClass").html(curPage);
		 	
			ttclick();
			clickpicbox();  //全选按钮可用
			tablese(); //隔行换色
		   // picautoResizeIframe();
		   
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};


function clickpicbox(){
	 $("#PicAllCheck").click(function(){
			//所有checkbox跟着全选的checkbox走。
			$('[name=checkbixpic]:checkbox').attr("checked", this.checked );
			var checktypeObj=$("input[name='checkbixpic']:checked").length
			if (checktypeObj>0){
				$("#down").prop("disabled", false).removeClass("down_disable").addClass("down_hover");
			}else{
				$("#PicAllCheck").prop("checked", false);
				$("#down").prop("disabled", true).removeClass("down_hover").addClass("down_disable");
			}
	 });
};


function remove_line(){ 
  if(currentStepUser==0){
    alert('请选择一项!');
	return false;
  }
  $("#TbodyPic tr").each(
    function(){
	  var seqUser=parseInt($(this).children("td").html());
	  if(seqUser==currentStepUser) $(this).remove();
	  if(seqUser>currentStepUser) $(this).children("td").each(function(i){if(i==0)$(this).html(seqUser-1);});
	}
  );
  currentStepUser=0;
}

function ttclick(){
	 $("#down").prop("disabled", true).removeClass("down_hover").addClass("down_disable");
	 $("#PicAllCheck").prop("checked", false)
	 $('#TbodyPic tr').click(function() {
					//判断当前是否选中
						 var _checkbox=$("input[name=checkbixpic]:checked").length
						 var _checked=$("input[name=checkbixpic]").length
						 if (_checkbox > 0){
							 $("#down").prop("disabled", false).removeClass("down_disable").addClass("down_hover");
							}
						 else{
							 $("#down").prop("disabled", true).removeClass("down_hover").addClass("down_disable");
							}
						if (_checkbox >=_checked){
							$("#PicAllCheck").prop("checked", true);
						}else{
							$("#PicAllCheck").prop("checked", false);
						}
				}); 		 
};

function getNextElementSibling(dom){
	dom=dom.nextSibling;
	while(dom&&!dom.tagName){
		dom=dom.nextSibling;
	}
	return dom;
}
//下载
function picdown(){
	if (m_PreviewOCX==null){
		return
	}
	var _checkbox=$("input[name=checkbixpic]:checked").length
	if (_checkbox <= 0 ){
		return
	}
	
	var cs=$("input[name=checkbixpic]")
	var arr=[];
	for(var i=0,len=cs.length;i<len;i++){
		if(cs[i].type.toLowerCase()=='checkbox'&&cs[i].checked&&cs[i].id.toLowerCase()!='PicAllCheck'){
			var l=getNextElementSibling(cs[i].parentNode);
			var ll=getNextElementSibling(l);
			var lll=getNextElementSibling(ll);
			var llll=getNextElementSibling(lll);
			arr.push(ll.innerHTML+'*'+lll.innerHTML);
		}
		
	}
   //alert(arr.join('&'));
	var picinfo=arr.join('$')+"$";
	//console.log(picinfo)
	var plugin=document.getElementById("plugin0");
	plugin.eventWebToPlugin("changelanguage",parent.translator.szCurLanguage);
	var ret = plugin.eventWebToPlugin("downpic", "star", camera_hostname,camera_port.toString(),picinfo,$.cookie('authenticationinfo')); 
};
//下载进度条
function ProgressQuery(){
	var plugin=document.getElementById("plugin0");
	 var ret = plugin.eventWebToPlugin("downpic", "progress");
};

//停止下载
function DownPicEnd(){
	var plugin=document.getElementById("plugin0");
	plugin.eventWebToPlugin("downpic", "stop");
};


//点击行
function lineclicUserList(line){
	
	 $('#TbodyPic tr').each(function(){$(this).css("background-color","#ffffff");});
   var seqUser=$(line).children("td").next().html();
  currentStepUser=seqUser;
   $("#checkbox"+parseInt(currentStepUser)).prop("checked", true);
   $(line).css("background-color","#f9f9f9");
}
//隔行换色
function tablese(){
  // $("#TbodyPic tr:nth-child(even)").addClass('trOdd');
  $("#TbodyPic tr:odd").addClass("trOdd");  /* 奇数行添加样式*/
  $("#TbodyPic tr:even").addClass("treven"); /* 偶数行添加样式*/	
}
function PicCheck(obj){
	var checktypeObj=$("input[name='PicTypeList']:checked").length
	
	var checktypeOpt=$("input[name='PicTypeList']").length
	if (checktypeObj==1){
		$("#CheckedAll").prop("checked", false)	
	}else if(checktypeObj==2){
		$("#CheckedAll").prop("checked", true)
		checktype="all"
	}else if(checktypeObj==0){
	}
}


/*************************************************
Function:		ChangeLanguage
Description:	改变页面语言
Input:			lan：语言
Output:			无
return:			无
*************************************************/
var g_transStack = new parent.TransStack();
function ChangeLanguage(lan) {

	g_lxdpic = parent.translator.getLanguageXmlDoc("pic", lan);
	parent.translator.appendLanguageXmlDoc(g_lxdpic, parent.g_lxdMain);
	parent.translator.translatePage(g_lxdpic, document);

	var szLanguage = '';
	if(parent.translator.szCurLanguage == 'zh')
	{
		szLanguage = 'zh-cn';
	} else if(parent.translator.szCurLanguage == 'zh_TW') {
		szLanguage = 'zh-tw';	
	}  else {
		$.each(parent.translator.languages, function(i) {
				if (this.value === parent.translator.szCurLanguage) {
					szLanguage = this.value;
				}
		});
		if(szLanguage === '') {
			szLanguage = 'en';
		}
	}
	
	WdatePicker({minDate:'1970-01-01 00:00:00',maxDate:'2037-12-31 23:59:59',eCont:'div1',lang: szLanguage,onpicked:function(dp){m_dtCalendarDate = dp.cal.getDateStr();},startDate:m_dtCalendarDate});
	
	 $("#lastPage").attr("title", getNodeValue('MlastPage'));
 	 $("#nextpage").attr("title", getNodeValue('Mnextpage'));
	 $("#firstPage").attr("title", getNodeValue('Mfirstpage'));
	 $("#endPage").attr("title", getNodeValue('Mendpage'));
	 $("#down").attr("title", getNodeValue('Mdown'));
	
}
//全选
function AllCheck(obj){
   if($(obj).prop("checked")){ //选中
		//  m_TimeMode = 1;
		   $("input[name='CheckPic']").prop("checked",true);  
		}else{
		//  m_TimeMode = 0;  //未选
		  $("input[name='CheckPic']").prop("checked",false);  
		}
};




