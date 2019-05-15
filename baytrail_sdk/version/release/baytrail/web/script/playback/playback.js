var m_szBrowser = navigator.appName; //获取浏览器名称
var g_lxdPreview = null; // Preview.xml
var m_bWndPlayPause = 0;		    //0,无状态 1、播放 2、暂停 3、恢复 4、停止
var m_digitalzoom = false;           //电子放大EPTZ
var m_tWndMidTime = "";		        //窗口的时间轴时间
var tTimeBar = null;                //时间条对象
var m_dtSearchDate = "";		    //当前搜索的日期
var m_dtCalendarDate = "";		    //当前日历的日期
var m_szStartTimeSet = new Array(); //开始时间集合
var m_szEndTimeSet = new Array();   //结束时间集合
var m_cut=false;                       //是否开始剪辑
var m_bSound = true;                // 音量正常
var m_soundsideChage=0;   //音量   
var m_DownWindow = null;				//下载窗口
var m_monthview=null;
/*************************************************
Function:		Initplayback
Description:	初始化回放界面
Input:			无
Output:			无
return:			无
*************************************************/
function Initplayback() {
	//var szLanguage = $.cookie('language','zh');
	//$.cookie('page',null);
	window.parent.ChangeMenu(2);
	Getmonthview()   //获取月视图
	 if(document.all)
	 {
		$("#downloadplugin").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="plugin0"  width="100%" height="100%" class="playplugin" ></object>')
	 }
	 else
	 {
	    $("#downloadplugin").html('<embed id="plugin0" type="application/x-ipcwebui"  width="100%" height="100%" class="playplugin"></embed>')
	 }
	Plugin();
	
	ChangeLanguage(parent.translator.szCurLanguage);
	
	playautoSize();

    //GetVideogettype()//获取数据类型
	
	$("#CheckedAll").prop("checked", true)
	 $("input[name='videotypelist']").prop("checked", true)
	
	initMouseHover();  //初始化鼠标悬停样式
		 
	$( "#slider-range-footer" ).slider({
      range: "min",
      value: 50,
      min: 0,
      max: 100,
      slide: function( event, ui ) {
		   m_soundsideChage = ui.value;
       // $( "#amount" ).val( "$" + ui.value );
      },
	stop: function( event, ui ) {
		m_soundsideChage=ui.value
	     ChangeOpenSound();
		//var levelsideChage= ui.value
		//document.getElementById("plugin0").eventWebToPlugin("recordoper","soundchange",levelsideChage);
      }});	
	  m_soundsideChage = $("#slider-range-footer" ).slider( "value" );
	  
	  if (m_PreviewOCX!=null){
		 plugin= top.parent.document.getElementById("IpcCtrl")
		 var g_playback=document.getElementById("plugin0")
		 g_playback.setPluginType("rec");
		 var videoid=1;
		 if ($.cookie('authenticationinfo')==null || $.cookie('authenticationinfo')==''){
			//alert("匿名")
			var ret=g_playback.eventWebToPlugin("recordoper","initpuinfo",camera_hostname,camera_port.toString(),videoid.toString(),'');	  //开始播放
			//alert("过插件")
		}else{
			//alert("用户")
		    var ret=g_playback.eventWebToPlugin("recordoper","initpuinfo",camera_hostname,camera_port.toString(),videoid.toString(),$.cookie('authenticationinfo'));	   //开始播放	
		 //  alert("过用户")
		}
		g_playback.eventWebToPlugin("recordoper","soundchange",m_soundsideChage.toString());
		g_playback.eventWebToPlugin("changelanguage",parent.translator.szCurLanguage);
		top.parent.$("#PluginWeb").html(top.document.getElementById("IpcCtrl").getPluginVersion())
		loadBackPlay(document.getElementById("plugin0"));
	}
	
	
	  RefreshWinToolbar();
	var toolbar_id=$(this).attr("class")
	$("#gototime").hover(function () {
		   $("#gototime").removeClass("")
		   $("#gototime").addClass("gototime"+"_hover");
		},function () {
		   $("#gototime").removeClass("gototime"+"_hover")
			//$(this).removeClass(toolbar_id+"_down")
		}
	);
	
};
/*************************************************
Function:		GetVideogettype
Description:	获取数据类型
Output:			无
return:			无
*************************************************/
function GetVideogettype(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/rec/1/gettype"
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
			
			$(xmlDoc).find("typelist").find("type").each(function(i){ 
		  	 	 typelist=$(this).attr('type');
				 typetest=$(this).text();
				
			});
			//console.log(re); //返回
			
			
			
		}
	});
};
/*************************************************
Function:		Getmonthview
Description:	获取月视图
Output:			无
return:			无
*************************************************/
function Getmonthview(){
	var mydate=new Date(); 
	var szXml = "<monthviewparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<year>"+mydate.getFullYear()+"</year>";
	szXml += "<month>"+(mydate.getMonth() + 1)+"</month>";
 	szXml += "</monthviewparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/rec/1/getmonthview"
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
			var arr="";
			if($(xmlDoc).find("hadrec").length > 0){
				$(xmlDoc).find("hadrec").each(function(i){ 
					 if ($(this).text()=="true"){
							 arr+=$(this).attr('index');  //ID
							 arr+=",";
						}
						
				});
				var arr1=arr.substring(0, arr.length - 1);  //删除最后一个逗号
				 m_monthview =  arr1.split(",");
				 m_monthview = jQuery.map(m_monthview, function (m_monthview) { return '%y-%M-' + Appendzero(m_monthview); }); 
				WdatePicker({eCont:'div1',specialDates:m_monthview,lang: szLanguage})  //日期  
			}
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};





function Appendzero(obj) {
        if (obj < 10) {return "0" + obj}
		 else {return obj};
 }
//开始查询录像
function SearchVideo(){
	if (m_PreviewOCX==null){
		$("#SearchVideotips").html("<label name='MpluginTips'>"+getNodeValue('MpluginTips')+"</label>"); //请安装插件
		setTimeout(function(){$("#SearchVideotips").html("");},5000);  //5秒后自动清除 
		return
	}
	
	
	// console.log(m_dtCalendarDate)
	var changedata = $dp.cal.getDateStr();
	//var checktype=$("input[name='videotypelist']:checked").val();
	var videoid=1
	//var checktypeCheck=$("input[name='videotypelist']:checked").length
	//var checktypeOpt=$("input[name='videotypelist']").length
	//var checktypeOptNum=checktypeOpt-1
	//console.log(checktypeCheck+"   "+checktypeOpt+"    "+checktypeOptNum)
	/* if(checktypeCheck==0){
		$("#SearchVideotips").html("请选择录像类型")
		setTimeout(function(){$("#SearchVideotips").html("");},5000);  //5秒后自动清除 
		return
	}else if (checktypeCheck==1){
	  	checktype=$("input[name='videotypelist']:checked").val();
	}else if(checktypeCheck>=2&&checktypeCheck<=checktypeOptNum ){
		var checktype1="";
		$('input[name=videotypelist]:checkbox:checked').each(function(){
			checktype1+=$(this).val()+",";
		})
		var checktype=checktype1.substring(0, checktype1.length - 1);  //删除最后一个逗号
	}else if(checktypeCheck==checktypeOpt){
	   checktype="all"
	} */
	var checktype="all";
	var ret=document.getElementById("plugin0").eventWebToPlugin("recordoper","queryrec",camera_hostname,changedata,checktype,videoid.toString());
	if (ret!="true"  && ret!="false"  ){
		$("#SearchVideotips").html(ret)
		setTimeout(function(){$("#SearchVideotips").html("");},5000);  //5秒后自动清除
	}
	
	
}
function videocheck(obj){
	var checktypeObj=$("input[name='videotypelist']:checked").length
	var checktypeOpt=$("input[name='videotypelist']").length
	if (checktypeObj>0 && checktypeObj<=2){
		//$("#SearchVideo").prop("disabled", false);
		$("#CheckedAll").prop("checked", false);
	}else if(checktypeObj==0){
		//$("#SearchVideo").prop("disabled", true);
		//$("#CheckedAll").prop("checked", true);
	}else if(checktypeObj==3){
		$("#CheckedAll").prop("checked", true);
	}
	/*if (checktypeObj==checktypeOpt){
		$("#CheckedAll").prop("checked", true);
	}*/
}

function setIntervalstate(){
	var ret=document.getElementById("plugin0").eventWebToPlugin("recordoper","recstate");
	if (ret=="over"){
		clearInterval(m_Timerstate);
		StopPlay(1);
	}
}


function PlayPause(){
	if (m_PreviewOCX==null){
		return
	}
	var videoid=1
	if(m_bWndPlayPause === 0) {
	  //  console.log("t")
		var ret=document.getElementById("plugin0").eventWebToPlugin("recordoper","startplayrec",camera_hostname,videoid.toString());
		//console.log("aa")	
			if (ret>=0){
				$("#play").removeClass().addClass("pause").attr("title", parent.translator.translateNode(g_lxdPlayback, 'Mpause'));
				$( "#slider-range-footer" ).slider({
					  range: "min",
					  value: 50,
					  min: 0,
					  max: 100
					 });
			  m_soundsideChage=50;
			  document.getElementById("plugin0").eventWebToPlugin("recordoper","soundchange",m_soundsideChage.toString());
				 m_bWndPlayPause =1;
				 RefreshWinToolbar();
				  $(".btnmouseout1").find("div").each(function() {
					var toolbar_id=$(this).attr("class")
					$(this).hover(function () {
						   $(this).removeClass("pause_hover play_hover")
						   $(this).addClass(toolbar_id+"_hover");
						},function () {
						   $(this).removeClass(toolbar_id+"_hover")
						}
					);
				});
				m_Timerstate= setInterval("setIntervalstate()",1000);
				
				
				
			}
			
		
	}else if(m_bWndPlayPause === 1){
	//	console.log("暂停")
		var str=document.getElementById("plugin0").eventWebToPlugin("recordoper","recctrl",'pause');
		if (str=="true")
		{
			$("#play").removeClass('pause pause_hover').addClass("play").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mplay'));
			m_bWndPlayPause =2;
			 $(".btnmouseout1").find("div").each(function() {
						var toolbar_id=$(this).attr("class")
						$(this).hover(function () {
							   $(this).removeClass("pause_hover play_hover")
							   $(this).addClass(toolbar_id+"_hover");
							},function () {
							   $(this).removeClass(toolbar_id+"_hover")
								//$(this).removeClass(toolbar_id+"_down")
							}
						);
					});	
			 m_bSound = true; 
			//$("#stop").removeClass().addClass("stop_disable");
			$("#deceleration").removeClass().addClass("deceleration_disable");
			$("#acceleration").removeClass().addClass("acceleration_disable");
			$("#forward").removeClass().addClass("forward_disable");
			$("#back").removeClass().addClass("back_disable");
			//$("#opensound").removeClass().addClass("opensound_disable");
			if (m_soundsideChage==0){
				$("#opensound").removeClass().addClass('opensound_disable');
			}else{
				$("#opensound").removeClass().addClass("opensound_close_disable");
			}
			
			
			$("#slider-range-footer").slider('disable');	 //禁用拖动条 
			//$("#PullAway").removeClass().addClass("PullAway_disable");
			$("#capture").removeClass().addClass("capture_disable");
			$("#recordClip").removeClass().addClass("recordClip_disable").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mstartclip'));
		}
		
		
		//RefreshWinToolbar();
	}else {
		var str=document.getElementById("plugin0").eventWebToPlugin("recordoper","recctrl",'continue');
		if (str=="true")
		{
			$("#play").removeClass().addClass("pause").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mpause'));
			m_bWndPlayPause =1;
			 $(".btnmouseout1").find("div").each(function() {
						var toolbar_id=$(this).attr("class")
						$(this).hover(function () {
							   $(this).removeClass("pause_hover play_hover")
							   $(this).addClass(toolbar_id+"_hover");
							},function () {
							   $(this).removeClass(toolbar_id+"_hover")
								//$(this).removeClass(toolbar_id+"_down")
							}
						);
					});
			RefreshWinToolbar();
		}
	}
	
}
//获取刷新工具栏图标状态
function RefreshWinToolbar(){
	if (m_PreviewOCX==null){
		$("#DownPause").removeClass().addClass("DownPause_disable");
		$("#enlarge").removeClass().addClass("enlarge_disable");
		$("#narrow").removeClass().addClass("narrow_disable");
		$("#full").removeClass().addClass("full_disable");
		m_bWndPlayPause=0;
		//return
	}
	
	
	if (m_bWndPlayPause > 0){
		$("#stop").removeClass().addClass("stop");
		$("#deceleration").removeClass().addClass("deceleration");
		$("#acceleration").removeClass().addClass("acceleration");
		$("#forward").removeClass().addClass("forward");
		$("#back").removeClass().addClass("back");
		//$("#opensound").removeClass().addClass("opensound");
		
		if (m_soundsideChage==0){
			$("#opensound").removeClass().addClass('opensound_close');
		}else{
			$("#opensound").removeClass().addClass("opensound");
		}
		$("#slider-range-footer").slider('enable');	 //启用拖动条 
		$("#PullAway").removeClass().addClass("PullAway");
		$("#capture").removeClass().addClass("capture");
		$("#recordClip").removeClass().addClass("recordClip").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mstartclip'));
	}else{
		if (m_soundsideChage==0){
			$("#opensound").removeClass().addClass('opensound_disable');
		}else{
			$("#opensound").removeClass().addClass("opensound_close_disable");
		}
		$("#play").removeClass().addClass("play").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mplay'));
		$("#stop").removeClass().addClass("stop_disable");
		$("#deceleration").removeClass().addClass("deceleration_disable");
		$("#acceleration").removeClass().addClass("acceleration_disable");
		$("#forward").removeClass().addClass("forward_disable");
		$("#back").removeClass().addClass("back_disable");
		//$("#opensound").removeClass().addClass("opensound_close_disable");
		$("#slider-range-footer").slider('disable');	 //禁用拖动条 
		$("#PullAway").removeClass().addClass("PullAway_disable");
		$("#capture").removeClass().addClass("capture_disable");
		$("#recordClip").removeClass().addClass("recordClip_disable").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mstartclip'));
	}
}
//停止
function StopPlay(Toolbar){
	if (m_bWndPlayPause==0){
		return
	}
	
	var videoid=1;
	if (Toolbar!=1){
		clearInterval(m_Timerstate);
		document.getElementById("plugin0").eventWebToPlugin("recordoper","stoprec",camera_hostname,videoid.toString());
	}
	//$("#play").removeClass().addClass("pause").attr("title", "播放");
	
	m_bWndPlayPause =0;
	m_digitalzoom =false;
	m_cut =false;
	
	/*$( "#slider-range-footer" ).slider({
			  range: "min",
			  value: 50,
			  min: 0,
			  max: 100
			 });
	  m_soundsideChage=50;
	  */
	  m_bSound = true; 
	//  document.getElementById("plugin0").eventWebToPlugin("recordoper","soundchange",m_soundsideChage);
	RefreshWinToolbar();
	$(".btnmouseout1").find("div").each(function() {
					var toolbar_id=$(this).attr("class")
					$(this).hover(function () {
						   $(this).removeClass("pause_hover play_hover")
						   $(this).addClass(toolbar_id+"_hover");
						},function () {
						   $(this).removeClass(toolbar_id+"_hover")
							//$(this).removeClass(toolbar_id+"_down")
						}
					);
				});
}
function StartRecord(){
 // alert("a")	
}
//浏览抓拍
function Capture(){
	if (m_bWndPlayPause==0 || m_bWndPlayPause==2){
		return
	}
	document.getElementById("plugin0").eventWebToPlugin("recordoper","snapshot");
};
//开始剪辑
function PlayBackSaveFile(){
	if (m_bWndPlayPause==0 || m_bWndPlayPause==2){
		return
	}
	if(m_cut == false) {
	   document.getElementById("plugin0").eventWebToPlugin("recordoper","cut","start");
	   $("#recordClip").removeClass().addClass("recordClip_down").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mstopclip'));
	   m_cut =true;
	} else {
	    document.getElementById("plugin0").eventWebToPlugin("recordoper","cut","stop");
		 $("#recordClip").removeClass().addClass("recordClip").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mstartclip'));
		m_cut =false;
	}
}
//放大缩小
function PullAway(){
	//if (m_bWndPlayPause==0 || m_bWndPlayPause==2 ){
     if (m_bWndPlayPause==0  ){
		return
	}
	if(m_digitalzoom == false) {
	   document.getElementById("plugin0").eventWebToPlugin("recordoper","digitalzoom","start");
	   $("#PullAway").removeClass().addClass("PullAway_down");
	   m_digitalzoom =true;
	} else {
	    document.getElementById("plugin0").eventWebToPlugin("recordoper","digitalzoom","stop");
		$("#PullAway").removeClass().addClass("PullAway");
		m_digitalzoom =false;
	}
};


function ChangeOpenSound(){
	
	//console.log(m_soundsideChage)
	if (m_soundsideChage==0){
	  // console.log("02"+"  "+m_soundsideChage)
		$("#opensound").removeClass().addClass('opensound_close');	
	    m_bSound = false;  //静音
	   //$("#slider-range-footer").slider( 'disable')  //禁用拖动条
	    $("#slider-range-footer").slider('enable');  //启用拖动条
	   document.getElementById("plugin0").eventWebToPlugin("recordoper","soundchange",m_soundsideChage.toString());
	}else{
		// console.log("03"+"  "+m_soundsideChage)
		$("#opensound").removeClass().addClass('opensound');	
	    m_bSound = true;  //正常
	    $("#slider-range-footer").slider('enable');  //启用拖动条
	   document.getElementById("plugin0").eventWebToPlugin("recordoper","soundchange",m_soundsideChage.toString());
	}
}

//打开声音
function OpenSound(){
	
	if (m_bWndPlayPause==0 ||  m_bWndPlayPause==2){
		return
	}
	//console.log(m_bSound +"  "+typeof m_bSound)
	if (m_bSound==true){  //正常
	  //console.log("静音")
	  m_bSound = false;  //静音
	  $("#opensound").removeClass().addClass('opensound_close');
	 // $("#slider-range-footer").slider( 'disable')  //禁用拖动条
	  $( "#slider-range-footer" ).slider({
			  range: "min",
			  value: 0,
			  min: 0,
			  max: 100
			 });
	  m_soundsideChage=0;
	  document.getElementById("plugin0").eventWebToPlugin("recordoper","soundchange",m_soundsideChage.toString());
	}else if(m_bSound==false){
		//console.log("正常")
	 
	  m_bSound = true;  //正常
	   $("#opensound").removeClass().addClass('opensound');	
	  $("#slider-range-footer").slider('enable');  //启用拖动条
	  $( "#slider-range-footer" ).slider({
			  range: "min",
			  value: 50,
			  min: 0,
			  max: 100
			});
	  m_soundsideChage=50;
	  document.getElementById("plugin0").eventWebToPlugin("recordoper","soundchange",m_soundsideChage.toString());
	 // console.log("正常"+"   "+m_soundsideChage)
	}
	
	
	
	//var soundid=10
	//document.getElementById("plugin0").eventWebToPlugin("recordoper","soundchange",soundid);
}
//定位
function goseek(){
	if (m_bWndPlayPause==0){
		return
	}
	var changedata = $dp.cal.getDateStr();
	var gototime=changedata+"T"+$("#time_shi").val()+":"+$("#time_fen").val()+":"+$("#time_miao").val();
	var str = document.getElementById("plugin0").eventWebToPlugin("recordoper","seek",gototime);
	if (str=="true")
	{
	}
	else if (str=="false")
	{
		$("#SearchVideotips").html("<label name='jsposition'>"+getNodeValue('jsposition')+"</label>");
		setTimeout(function(){$("#SearchVideotips").html("");},5000);  //5秒后自动清除 
		return;
	}
	else
	{
		$("#SearchVideotips").html(str);
		setTimeout(function(){$("#SearchVideotips").html("");},5000);  //5秒后自动清除 
		return;
	}
}
//下载
/*************************************************
 Function:        DownPause
 Description:     录像下载
 Input:           无
 Output:          无
 return:          无
 *************************************************/
function DownPause(){
		  window.parent.parent.$("#videodownload").modal(
		      {
				"close":false,
				"autoResize":true,
				"position":[100]
				  }
		   );
		window.parent.parent.$("#simplemodal-container").width(710).height(445);
	    if(document.all)
	     {
		window.parent.parent.$("#downplugin").html
		('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="downplugin0"  width="700" height="370" ></object>')
		 }
		 else
		 {
			window.parent.parent.$("#downplugin").html('<embed id="downplugin0" type="application/x-ipcwebui"  width="700" height="370"></embed>')
		 }
		 var download=window.parent.parent.document.getElementById("downplugin0")
		 download.setPluginType("download");
		 var videoid=1;
		 var ret=download.eventWebToPlugin("download",camera_hostname,videoid.toString(),$.cookie('authenticationinfo'),camera_port.toString());
		 download.eventWebToPlugin("changelanguage",$.cookie('language'))
		 $("#downloadplugin").width(1).height(0);
		 $(".playplugin").css("background","#000000");

	//},20);
	
	
	//m_DownWindow=window.open("download.htm", 'Download', 'height=445,width=720,top=0,left=0,toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no');
}

//锁定与删除
function delplayback(){
}
//快进
function Fastforward(){
	if (m_bWndPlayPause==0){
		return
	}
	//document.getElementById("plugin0").eventWebToPlugin("recordoper","download");
}
function Slowprogress(){
	if (m_bWndPlayPause==0){
		return
	}
	//document.getElementById("plugin0").eventWebToPlugin("recordoper","download");
};
//加速
function accelerationPause(){
if (m_bWndPlayPause==0  ||  m_bWndPlayPause==2){
		return
	}
	document.getElementById("plugin0").eventWebToPlugin("recordoper","recctrl",'speedup');
};

//减速
function decelerationPause(){
   if (m_bWndPlayPause==0  || m_bWndPlayPause==2){
		return
	}
  document.getElementById("plugin0").eventWebToPlugin("recordoper","recctrl",'speeddown');	
};
//前一片段"
function forwardPause(){
    if (m_bWndPlayPause==0 || m_bWndPlayPause==2){
		return
	}
	document.getElementById("plugin0").eventWebToPlugin("recordoper","recctrl",'preframe');	
}
//下一片段"
function backPause(){
    if (m_bWndPlayPause==0 || m_bWndPlayPause==2){
		return
	}
	document.getElementById("plugin0").eventWebToPlugin("recordoper","recctrl",'nextframe');	
}

//刻度放大
function EnlargePause(){
   if (m_PreviewOCX==null){
		return
	}
	document.getElementById("plugin0").eventWebToPlugin("recordoper","recctrl",'expand');	
}
//刻度缩小
function NarrowPause(){
    if (m_PreviewOCX==null){
		return
	}
	document.getElementById("plugin0").eventWebToPlugin("recordoper","recctrl",'shrink');	
}
//全屏
function fullscreen(){
	if (m_PreviewOCX==null){
		return
	}
   document.getElementById("plugin0").eventWebToPlugin("recordoper","fullscreen");	
};
/*************************************************
Function:		ChangeLanguage
Description:	改变页面语言
Input:			lan：语言
Output:			无
return:			无
*************************************************/
var g_transStack = new parent.TransStack();
function ChangeLanguage(lan) {
    
	g_lxdPlayback = parent.translator.getLanguageXmlDoc("playback", lan);
	parent.translator.appendLanguageXmlDoc(g_lxdPlayback, parent.g_lxdMain);
	parent.translator.translatePage(g_lxdPlayback, document);
	
	
	$(".play").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mplay'));
	$(".pause").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mpause'));
	$("#stop").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mstop'));
	$("#deceleration").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mdeceleration'));
	$("#acceleration").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Macceleration'));
	$("#forward").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mforward'));
	$("#back").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mback'));
	$("#opensound").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Msound'));
	$("#capture").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mcat'));
	
	$("#DownPause").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mdown'));
	$("#enlarge").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Menlarge'));
	$("#narrow").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mnarrow'));
	$("#full").attr("title",parent.translator.translateNode(g_lxdPlayback, 'Mfull'));
	
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
	//Getmonthview();
 	//WdatePicker({minDate:'1970-01-01 00:00:00',maxDate:'2037-12-31 23:59:59',eCont:'div1', class:'Wdate',onpicked:function(dp){m_dtCalendarDate = dp.cal.getDateStr();},lang: szLanguage,startDate:m_dtCalendarDate});
	//WdatePicker({eCont:'div1',lang: szLanguage});
	WdatePicker({eCont:'div1',specialDates:m_monthview,lang: szLanguage})  //日期  
	if (m_DownWindow)
	{
		var plugindown=m_DownWindow.document.getElementById("mainplugin");
		if (plugindown)  
		{
			if (typeof (m_DownWindow.document.getElementById("plugin0").eventWebToPlugin)!="undefined")
			{
				m_DownWindow.document.getElementById("plugin0").eventWebToPlugin("changelanguage",parent.translator.szCurLanguage)
			}
		}
	}
	
}
/*************************************************
Function:		initMouseHover
Description:	初始化鼠标悬浮样式
Input:			无			
Output:			无
return:			无				
*************************************************/
function initMouseHover()
{
  	/* $(".btnmouseout").find("div").each(function() {
		//var classId=$(this).attr("class")
		var classId=$(this).attr("class")
        $(this).hover(function () {
			   $(this).addClass(classId+"_hover");
            },function () {
               $(this).removeClass(classId+"_hover")
			   $(this).removeClass(classId+"_down")
            },$(this).mousedown(function (){
				$(this).addClass(classId+"_down")
			})
        );
    });*/
	 $(".btnmouseout").find("div").each(function() {
			var toolbar_id=$(this).attr("class")
			$(this).hover(function () {
				 
				   $(this).addClass(toolbar_id+"_hover");
				},function () {
				   $(this).removeClass(toolbar_id+"_hover")
					//$(this).removeClass(toolbar_id+"_down")
				}
			);
		});
		
		 $(".btnmouseout1").find("div").each(function() {
			var toolbar_id=$(this).attr("class")
			$(this).hover(function () {
				   $(this).addClass(toolbar_id+"_hover");
				},function () {
				   $(this).removeClass(toolbar_id+"_hover")
					//$(this).removeClass(toolbar_id+"_down")
				}
			);
		});
	
	
	 $("#CheckedAll").click(function(){
			//所有checkbox跟着全选的checkbox走。
			$('[name=videotypelist]:checkbox').attr("checked", this.checked );
			
			var checktypeObj=$("input[name='videotypelist']:checked").length
	//console.log($(obj).val())
			if (checktypeObj>0){
			//	$("#SearchVideo").prop("disabled", false);	
			}else{
				$("#CheckedAll").prop("checked", false);
				//$("#SearchVideo").prop("disabled", true);		
			}
	 });
}



function playautoSize(){
	var ContentPlayBackWidth=null;
    iBrowserPlayBackHeight = parent.document.documentElement.clientHeight;
	if (iBrowserPlayBackHeight<=722){
		iBrowserPlayBackHeight=620;
		ContentPlayBackWidth=960;
		top.parent.$("#head_top").width(ContentPlayBackWidth)
		top.parent.$("#menu").width(ContentPlayBackWidth)
		parent.$("#content").width(ContentPlayBackWidth).height(iBrowserPlayBackHeight -42 )
		$("#contenter").width(ContentPlayBackWidth-4).height(iBrowserPlayBackHeight -44 )
		parent.$("#contentframe").width(ContentPlayBackWidth-2).height(iBrowserPlayBackHeight -42 );
	    $("#main_left").height(iBrowserPlayBackHeight - 54 )
		$("#main_right").width(ContentPlayBackWidth-201).height(iBrowserPlayBackHeight -54);
		$("#mainplugin").width(ContentPlayBackWidth-201).height(iBrowserPlayBackHeight-89);
		$("#playtoolbar").width(ContentPlayBackWidth-201)
		top.parent.$("#maindevicetype").width(ContentPlayBackWidth)
	
	}else
	{
		//console.log("aa")
		ContentPlayBackWidth=(parseInt((iBrowserPlayBackHeight*4)/3))
		top.parent.$("#menu").width(ContentPlayBackWidth)
		top.parent.$("#head_top").width(ContentPlayBackWidth)
		parent.$("#content").width(ContentPlayBackWidth)
		$("#contenter").width(ContentPlayBackWidth-2).height(iBrowserPlayBackHeight -103 )
		parent.$("#contentframe").width(ContentPlayBackWidth).height(iBrowserPlayBackHeight -103 );
		$("#main_left").height(iBrowserPlayBackHeight - 145 )
		$("#main_right").width(ContentPlayBackWidth-199).height(iBrowserPlayBackHeight - 145 )
		$("#mainplugin").width(ContentPlayBackWidth-199).height(iBrowserPlayBackHeight - 178 )
		$("#playtoolbar").width(ContentPlayBackWidth-199)
		top.parent.$("#maindevicetype").width(ContentPlayBackWidth)
		
	}	
}

/*************************************************
Function:		mainEventBind
Description:	事件绑定
Input:			无
Output:			无
return:			无				
*************************************************/
function mainEventBind() {
    //点击语言选择框
	$(".languageshow").bind({
	    click: function (e) {
			e.stopPropagation();
			if($("#divLanguageChoose").css("display") !== "none") {
				$('#divLanguageChoose').hide();
			} else {
				$('#divLanguageChoose').show();
			}
			
		}
	});
	//点击语言选择框和帮助以为的地方
    $("body").bind({
	    click: function (e) {
			if($("#divLanguageChoose").css("display") !== "none") {
				$('#divLanguageChoose').hide();
			}
			if($("#SoftwareEdition").css("display") !== "none") {
				$("#SoftwareEdition").hide();
			}			
		}
	});	
}

function timego(){
	$("#localizer").show();
}
function download(){
	if(document.all)
	 {
		$("#mainplugin").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="plugin0"  width="100%" height="100%" ></object>')
	 }
	 else
	 {
	    $("#mainplugin").html('<embed id="plugin0" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
	 }
	Plugin();
	var download=document.getElementById("plugin0")
	 download.setPluginType("download");
	 var videoid=1;
	 var ret=download.eventWebToPlugin("download",camera_hostname,videoid.toString(),$.cookie('authenticationinfo'),camera_port.toString());
};


/*************************************************
  Function:    	CheackOnlyNum
  Description:	//只能输入数字，允许为空
  
*************************************************/
function CheackOnlyNump(strInfo)
{
	if(strInfo == "")
	{
		
		return false;
	}	
	var strP=/^^[0-9]*$/; 
	if(!strP.test(strInfo))
	{
		
		return false;
	}
	return true;
}

function CheackNum(obj,type){
    if (!CheackOnlyNump($(obj).val()))
	{
		  $(obj).val("00")
		  return;
	}
	if (type=="shi")
	{
		if (!(Number($(obj).val()) <=23 )){
			 $(obj).val("00")
		}
	}
	else {
		if (!(Number($(obj).val()) <=59 )){
			$(obj).val("00")
		}
	}
	
	
}