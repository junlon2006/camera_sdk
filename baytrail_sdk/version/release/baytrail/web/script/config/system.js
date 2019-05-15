// JavaScript Document
// 
var m_uploading=false;
var m_szFileDownName="";
var g_modetext=false,g_aactext=false;
var denoise_audiosource=1;
var decdenoise_audiosource=1;
var g_aacenable=false;
var g_modeenable=false;
var System = {
	tabs: null	// 保存System配置页面的tabs对象引用
};
function XmlUtils(xmlDoc) {
	this.doc = xmlDoc;
}
XmlUtils.prototype = {
	constructor: XmlUtils,
	elems: function(name) {
		return this.doc.documentElement.getElementsByTagName(name);
	},
	elem: function(name) {
		return this.elems(name)[0];
	},
	val: function(name, value) {
		if (arguments.length === 1){
			try {
				return this.elem(name).childNodes[0].nodeValue;
			} catch (e) {
				return "";
			}
		}else{
			this.elem(name).childNodes[0].nodeValue = value;
		}
	}
};
/*************************************************
Function:		DeviceInfo
Description:	构造函数，Singleton派生类
Input:			无			
Output:			无
return:			无				
*************************************************/
function DeviceInfo() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(DeviceInfo);
pr(DeviceInfo).update = function() {
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["system", "DeviceInfo"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initDeviceInfo()
	autoResizeIframe();
	Plugin();
}
/*************************************************
Function:		initDeviceInfo
Description:	初始化设备信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function initDeviceInfo(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/deviceinfo"
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
		   
		   
			$(xmlDoc).find("devicename").each(function(i){ //设备名称
			    devicenamemin=$(this).attr('min');
				devicenamemax=$(this).attr('max');
				$("#devicename").val($(this).text()).attr('maxlength' , devicenamemax);
			});
			
			$("#devicetype").html($(xmlDoc).find('devicetype').eq(0).text() )//设备型号
			$("#deviceserial").html($(xmlDoc).find('deviceserial').eq(0).text() )//设备序列号
			$("#firmwareversion").html($(xmlDoc).find('firmwareversion').eq(0).text() )//硬件版本号
			$("#softversion").html($(xmlDoc).find('softversion').eq(0).text() )//软件版本号
			$("#videosourcenum").html($(xmlDoc).find('videosourcenum').eq(0).text() )//视频源个数
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};


/*************************************************
Function:		SaveDeviceInfo
Description:	保存设备信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function SaveDeviceInfo(obj,tab){
	if (!CheckTypeC($("#devicename").val(),"laDeviceNameTips",'laDeviceName',Number(devicenamemin),Number(devicenamemax),0))
	{
	   return;
	}
	if(document.getElementById("setosd").checked==true){
		if (m_PreviewOCX==null)
		{
			szRetInfo=  m_szErrorState+m_plugintips;
			$("#SetResultTipsDeviceInfo").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsDeviceInfo").html("");},5000);  //5秒后自动清除
			return;
		}
		var plugin= top.parent.document.getElementById("IpcCtrl")
		var videoid=1
		var ret=plugin.eventWebToPlugin("saveosdpic",camera_hostname,camera_port.toString(),"1",videoid.toString(),"0",$("#devicename").val(),$.cookie('authenticationinfo'));
		if (ret=="false"){
			$("#SetResultTipsDeviceInfo").show().html(m_szErrorState+m_szError1)
			setTimeout(function(){$("#SetResultTipsDeviceInfo").hide();},2500);
			return
		}
		else if(ret=="nopower")
		{
			alert(m_Mauthorization);//没有权限
			return;
		}
	  }
		 var szXml = "<deviceinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		  szXml += "<devicename>"+$.rtrim($.ltrim($("#devicename").val()))+"</devicename>";
		  szXml += "</deviceinfo>";
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/deviceinfo"
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
			 $(xmlDoc).find("statuscode").each(function(i){ 
				var state= $(this).text();
					if("0" == state)	//OK
					{
						//szRetInfo = m_szSuccessState+m_szSuccess1;
						if (tab=="save")
						{
							szRetInfo = m_szSuccessState+m_szSuccess1;
							$("#SetResultTipsDeviceInfo").html(szRetInfo);
							setTimeout(function(){$("#SetResultTipsDeviceInfo").html("");},5000);  //5秒后自动清除
						}
						else if (tab=="up")
						{
							if (g_Protocol==true)
							{
								if (m_gb28181==true)
								{
									$("#aAccessProtocol").click();
									$.cookie('tabAccessProtocol_curTab','2');
									showmenuconfig("AccessProtocol","0","FastSetConfig","gbup");
								}
								else if(m_onvif==true)
								{
									$("#aAccessProtocol").click();
									$.cookie('tabAccessProtocol_curTab','1');
									showmenuconfig("AccessProtocol","0","FastSetConfig","onvifup");
								}
								else if(m_vsip==true)
								{
									$("#aAccessProtocol").click();
									$.cookie('tabAccessProtocol_curTab','0');
									showmenuconfig("AccessProtocol","0","FastSetConfig","vsipup");
								}
							}
							else
							{
								$("#aIPAddress").click();
								showmenuconfig("IPAddress","0","FastSetConfig");
							}
							
							
						}
						else if(tab=="down")
						{
							$("#aDateTime").click();
							showmenuconfig("TimeSet","0","FastSetConfig")
						}
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
						$("#SetResultTipsDeviceInfo").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsDeviceInfo").html("");},5000);  //5秒后自动清除
					}
				});
			  
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,'SaveDevice');
			}
		});

};


function TimeSystem() {
	SingletonInheritor.implement(this);
	this.m_dtDeviceTime = null; // 获得的设备时间的Date对象，原systemTimeInit为String类型
	this.m_timerPerSecond = null; // 秒钟定时器
	this.m_timerSyncDeviceTime = null; // 设备时间同步时钟
	this.m_szDeviceTimeZone = null; // 获得的设备时区，原timeZoneInit				
}
SingletonInheritor.declare(TimeSystem);
(function() { // TimeSystem implementation 进入配置页面开始
    /*************************************************
	Function:		dateFormat 类方法
	Description:	格式化Date对象
					月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
					年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
					eg:
					pr(TimeSettings).DateFormat((new Date()), "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
					pr(TimeSettings).DateFormat((new Date()), "yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
					pr(TimeSettings).DateFormat((new Date()), "yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
					pr(TimeSettings).DateFormat((new Date()), "yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
					pr(TimeSettings).DateFormat((new Date()), "yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
	Input:			date: Date对象
					format: 格式
	Output:			无
	return:			无
	*************************************************/
	  
		TimeSystem.prototype.dateFormat = function(date, format) {
			if (date !== null){
				
				
					var o = {
						"M+" : date.getMonth()+1, //月份
						"d+" : date.getDate(), //日
						"h+" : date.getHours()%12 == 0 ? 12 : date.getHours()%12, //小时
						"H+" : date.getHours(), //小时
						"m+" : date.getMinutes(), //分
						"s+" : date.getSeconds(), //秒
						"q+" : Math.floor((date.getMonth()+3)/3), //季度
						"S" : date.getMilliseconds() //毫秒
					};
					var week = {
						"0" : "\u65e5",
						"1" : "\u4e00",
						"2" : "\u4e8c",
						"3" : "\u4e09",
						"4" : "\u56db",
						"5" : "\u4e94",
						"6" : "\u516d"
					};
					if (/(y+)/.test(format)) {
						format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
					}
					if (/(E+)/.test(format)) {
						format = format.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "") + week[date.getDay() + ""]);
					}
					for (var k in o){
						if (new RegExp("("+ k +")").test(format)){
							format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
						}
					}
					return format;
				
				
			}
			
	  }
		
   
   
   function Appendzero(obj) {
        if (obj < 10) {return "0" + obj}
		 else {return obj};
	 }
   // var d = new Date("2014-07-30T18:14:25");
//	d.setDate(d.getDate() + 1 + 1);//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1
	//alert(d+"月后是"+d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate());
   
   
  // var d2 = new Date("2014-07-29T18:14:25");
	//alert(d2.getHours()+"-"+d2.getMinutes()+"-"+d2.getSeconds());
   
   /*************************************************
	Function:		setRadioItem 类方法
	Description:	设置单选框的选中项
	Input:			parentId: 单选框父id
					index: 选中项的序号，从0开始
	Output:			无
	return:			无
	*************************************************/
	TimeSystem.prototype.setRadioItem = function(parentId, index) {
		ia(TimeSystem).setTimeSyncMode(index);
		pr(SingletonInheritor.base).setRadioItem.apply(this, arguments);
	}
   
	/*************************************************
	Function:		clickTimeSyncWithPC 类方法
	Description:	点击chTimeSyncWithPC复选框
	Input:			无
	Output:			this.m_dtDeviceTime的字符串表示
	return:			无
	*************************************************/	
	TimeSystem.prototype.clickTimeSyncWithPC = function()
	{
		if ($("#chTimeSyncWithPC").prop("checked"))
		{ // 与本地时间同步
			var dtNow = new Date();
			//console.log(new Date())
			//console.log("与电脑同步")
			$("#teSelectTime").prop("disabled", true).val(this.dateFormat(dtNow, "yyyy-MM-ddTHH:mm:ss")); // 电脑时间
			$("#ModalteSelectTime").prop("disabled", true);
			$("#ModalteSelectTime").prop("disabled", true).val(this.dateFormat(dtNow, "yyyy-MM-ddTHH:mm:ss")); // 电脑时间
			var iTZOffset = dtNow.getTimezoneOffset();
			var iHour = Math.abs(parseInt(iTZOffset / 60));
			var iSecond = iTZOffset % 60;
			//var szPCTZ = "CST" + ((iTZOffset >= 0) ? "+" : "-") + iHour + ((iSecond >= 30) ? ":30:00" : ":00:00");
			var szPCTZ = "GMT" + ((iTZOffset >= 0) ? "-" : "+") + Appendzero(iHour) + ((iSecond >= 30) ? ":30" : ":00");
			$("#ModalseTimeZone").val(szPCTZ).prop("disabled", true);
		}
		else
		{
			$("#ModalteSelectTime").prop("disabled", false);
			$("#ModalseTimeZone").prop("disabled", false);
		}
	}
	
	
	

	/*************************************************
	Function:		CheckBoxAutoTime 类方法  自动校时
	Description:	点击CheckBoxAutoTime复选框
	Input:			无
	Output:			this.m_dtDeviceTime的字符串表示
	return:			无
	*************************************************/	
	TimeSystem.prototype.CheckBoxAutoTime = function()
	{
		if ($("#AutoTime").prop("checked"))
		{ // 自动校时
			//$(input)
			$("#AutoTime").val(true).prop("checked", true);
			
			$('[name=raNetsPreach]:radio').attr("disabled", false)
			//$("#seTimeZone").prop("disabled", false);
			$("#teNtpServer").prop("disabled", false);
			$("#teNtpInterval").prop("disabled", false);
		}
		else
		{   
		    $("#AutoTime").val(false).prop("checked", false);
			$('[name=raNetsPreach]:radio').attr("disabled", true)
		  //  $("#seTimeZone").prop("disabled", true);
			$("#teNtpServer").prop("disabled", true);
			$("#teNtpInterval").prop("disabled", true);
		}
	}
	
	
	//手动设置
	TimeSystem.prototype.setmanual = function()
	{  
	   $("#ModalTimeTips").html("")
       $("#divTimeTable").modal(
	    {
		"close":false,
		"autoResize":true,
		 "position":[150]  
	 	 }
	   );
	   
	   $("#ModalseTimeZone").val(Select_ModalseTimeZone);
	  // console.log($("#ModalseTimeZone").val())
	   var oldzone=$("#ModalseTimeZone").val();
	   // m_oldzone = oldzone.match(/([+-])(\d+):(\d+)/);
	    m_oldzone =oldzone;
		//console.log("m_oldzone"+"   "+m_oldzone)
	  // that.m_szDeviceTimeZone = xmlU.val("timezone");
	}
	
	
	
	/*************************************************
	Function:		update
	Description:	更新
	Input:			无	
	Output:			无
	return:			无				
	*************************************************/
	TimeSystem.prototype.update = function()
	{
		if($.browser.msie && parseInt($.browser.version, 10) == 6)
		{
			$("#diTimeConfig").find("select").show();
            $(".timehidden").hide();
			$(".232hidden").hide();
			$(".485hidden").hide();
			$("#dvTelecontrol").find("select").hide();
		}
		$("#SaveConfigBtn").show();
		$("#SetResultTips").html("");
		
		g_transStack.clear();
		var that = this;
		g_transStack.push(function() {
			that.setLxd(parent.translator.getLanguageXmlDoc(["system", "TimeSettings"]));
			parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			parent.translator.translatePage(that.getLxd(), document);
		}, true);
		
		$("#chTimeSyncWithPC").prop("checked", false); // 从其它tab页切换回来的情况
		// 设置秒钟定时器
		function updatePCTime() {
			if ($("#chTimeSyncWithPC").prop("checked"))
			{
			//	console.log("设置定时器")
				$("#teSelectTime").val(that.dateFormat(new Date(), "yyyy-MM-ddTHH:mm:ss"));
				$("#ModalteSelectTime").val(that.dateFormat(new Date(), "yyyy-MM-ddTHH:mm:ss"));
			}
			if (that.m_dtDeviceTime !== null)
			{
				that.m_dtDeviceTime = new Date(that.m_dtDeviceTime.getTime() + 1000);
				$("#teDeviceTime").val(that.dateFormat(that.m_dtDeviceTime, "yyyy-MM-ddTHH:mm:ss"));
				$("#ModalteDeviceTime").val(that.dateFormat(that.m_dtDeviceTime, "yyyy-MM-ddTHH:mm:ss"));
			}
		}
		updatePCTime();
		if (this.m_timerPerSecond !== null)
		{
			clearInterval(this.m_timerPerSecond);
		}
		this.m_timerPerSecond = setInterval(updatePCTime, 1000);
		// 设置设备时间同步定时器
		if (this.m_timerSyncDeviceTime !== null)
		{
			clearInterval(this.m_timerSyncDeviceTime);
		}
		//this.m_timerSyncDeviceTime = setInterval(this.syncDeviceTime, 300000); // 五分钟同步一次
		//function GetTimeinfo(){
		TimeSystem.prototype.GetTimeinfo= function(){	
		   var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/time/info"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		 timeout: 15000,
		beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
			},
			success: function(xmlDoc, textStatus, xhr) {
				var Docxml =xhr.responseText;
		        var xmlDoc = GetparseXmlFromStr(Docxml);
				var xmlU = new XmlUtils(xmlDoc);
				//获取时间
				var szDeviceTime = xmlU.val("time");
				var arDTms = szDeviceTime.match(/(\d+)-(\d+)-(\d+)(\D+)(\d+):(\d+):(\d+)/);
				/*if (arDTms.length !== 8)
				{
					return;
				}*/
				that.m_dtDeviceTime = new Date(arDTms[1], arDTms[2] - 1, arDTms[3], arDTms[5], arDTms[6], arDTms[7]);
				
				//var szDeviceTimeformat=TimeSystem.prototype.dateFormat(that.m_dtDeviceTime, "yyyy-MM-ddTHH:mm:ss");
				//$("#ModalteSelectTime").val(szDeviceTimeformat);
				
				
				
				
				that.m_szDeviceTimeZone = xmlU.val("timezone");
				
				
				
				
				
				var Select_seTimeZone="GMT"+that.m_szDeviceTimeZone
				var selectCode=document.getElementById("seTimeZone")
				for (i=0;i<selectCode.length;i++){
				 if(selectCode.options[i].value==Select_seTimeZone){  
					selectCode.options[i].selected=true;  
					}
			    } 
				 Select_ModalseTimeZone="GMT"+that.m_szDeviceTimeZone
				var selectCode_Moda=document.getElementById("ModalseTimeZone")
				for (i=0;i<selectCode_Moda.length;i++){
				 if(selectCode_Moda.options[i].value==Select_ModalseTimeZone){  
					selectCode_Moda.options[i].selected=true;  
					}
			    } 
				
				//console.log("本地时间"+(that.dateFormat(new Date(), "yyyy-MM-ddTHH:mm:ss")));
				var arTZms = Select_seTimeZone.match(/([+-])(\d+):(\d+)/);
	           // console.log("szDeviceTime"+"   "+szDeviceTime+"   "+arTZms+"    "+arTZms[1]+"   "+arTZms[2]+"    "+arTZms[3])  //得到"+或-"
					var d = new Date(szDeviceTime);
					//d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()
					//d.setMonth(d.getMonth() + 1 + 1);//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1
					//console.log(arTZms[1])
					if (arTZms[1]==="-"){
						d.setHours(d.getHours() - parseInt(arTZms[2]));//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1,小时getHours
						d.setMinutes(d.getMinutes() - parseInt(arTZms[3]));//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1,小时getHours
					}else if(arTZms[1]==="+"){
						d.setHours(d.getHours() + parseInt(arTZms[2]));//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1,小时getHours
						d.setMinutes(d.getMinutes() + parseInt(arTZms[3]));//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1,小时getHours
					}
					var dtTime=d.getFullYear()+"-"+Appendzero(parseInt(d.getMonth()+1))+"-"+Appendzero(d.getDate())+"T"+Appendzero(d.getHours())+":"+Appendzero(d.getMinutes())+":"+Appendzero(d.getSeconds())
				//$("#ModalteSelectTime").val(dtTime)
				
				$("#ModalteSelectTime").val(szDeviceTime)
				
				autoResizeIframe();
			}/*,error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}*/
		 });
	    }
		
	TimeSystem.prototype.GetTimeinfo();	
		//自动校时
	
		
	
		TimeSystem.prototype.GetTimeauto= function(){	
		  var szXml = "<contentroot>";
			szXml +=$.cookie('authenticationinfo');
			szXml += "</contentroot>";
			var xmlDoc = GetparseXmlFromStr(szXml);
		 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/time/auto"
		$.ajax({
			type: "post",
			url:szURL,
			processData: false,//不转换
			data: xmlDoc,
			 timeout: 15000,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
			},
			success: function(xmlDoc, textStatus, xhr) {
				
				var Docxml =xhr.responseText;
		        var xmlDoc = GetparseXmlFromStr(Docxml);
				$(xmlDoc).find("enable").each(function(i){ 
					if ($(this).text()=="true"){
						$("#AutoTime").val(true).prop("checked", true);
						$('[name=raNetsPreach]:radio').attr("disabled", false)
						//$("#seTimeZone").prop("disabled", false);
						$("#teNtpServer").prop("disabled", false);
						$("#teNtpInterval").prop("disabled", false);
					}else{
						$("#AutoTime").val(false).prop("checked", false);
						$('[name=raNetsPreach]:radio').attr("disabled", true)
						//$("#seTimeZone").prop("disabled", true);
						$("#teNtpServer").prop("disabled", true);
						$("#teNtpInterval").prop("disabled", true);
					};
				});
				
				var timemode =$(xmlDoc).find('timemode').eq(0).text();
				if (timemode == 'inputprotocol')
					{ // 接入协议校时
						$("#inputprotocol").prop("checked", true);
						$("#inputprotocolExplain").show();
						$("#systemntp").hide(); 
						that.setTimeSyncMode('inputprotocol');
						
						$("#teDeviceTime").val((that.dateFormat(that.m_dtDeviceTime, "yyyy-MM-ddTHH:mm:ss")));
					}
					else if(timemode == 'ntp')
					{ // ntp校时
						$("#ntp").prop("checked", true);
						$("#inputprotocolExplain").hide();
						$("#systemntp").show(); 
						that.setTimeSyncMode('ntp');
						if (!$("#chTimeSyncWithPC").prop("checked"))
						{
							$("#teSelectTime").prop("disabled", false);
							//$("#seTimeZone").prop("disabled", false);
						}
					}
				$("#teNtpServer").val($(xmlDoc).find('url').eq(0).text());
				$("#teNtpPort").val($(xmlDoc).find('port').eq(0).text());
				$("#teNtpInterval").val($(xmlDoc).find('timespeed').eq(0).text());
				autoResizeIframe();
			}/*,error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}*/
		 });
	    }
		
		TimeSystem.prototype.GetTimeauto();	
		
		var szXml = "<contentroot>";
			szXml +=$.cookie('authenticationinfo');
			szXml += "</contentroot>";
			var xmlDoc = GetparseXmlFromStr(szXml);
		 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/time/summer"
		$.ajax({
			type: "post",
			url:szURL,
			processData: false,//不转换
			data: xmlDoc,
		   timeout: 15000,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
			},
			success: function(xmlDoc, textStatus, xhr) {
				var Docxml =xhr.responseText;
		        var xmlDoc = GetparseXmlFromStr(Docxml);
				var enabledaylighttime=$(xmlDoc).find('enabledaylighttime').eq(0).text();  //enabledaylighttime是否启用夏令时
				  if (enabledaylighttime=="true"){
					$("#IsEnableDST").val("true");  //设置value为true
				    $("#IsEnableDST").prop("checked", true);  //选中
					$("#dvDST select").prop("disabled",false);  //div为dvDST下的select可用
				  }else{
					   $("#IsEnableDST").val(false);
					    $("#IsEnableDST").prop("checked", false);
		 			   $("#dvDST select").prop("disabled",true);
				 };
			//夏令时开始时间
			$(xmlDoc).find("daylighttimestart").each(function(i) {
				 var startmonth=$(this).children('month').text();
				 var startweekindex= $(this).children('weekindex').text();
				 var startweekday= $(this).children('weekday').text();
				 var starthour= $(this).children('hour').text();
				 var Select_startmonth=document.getElementById("StartMonth")
					for (i=0;i<Select_startmonth.length;i++){
					 if(Select_startmonth.options[i].value==startmonth){  
						Select_startmonth.options[i].selected=true;  
						}
				   }
				   
				 var Select_startweekindex=document.getElementById("StartWeek")
					for (i=0;i<Select_startweekindex.length;i++){
					 if(Select_startweekindex.options[i].value==startweekindex){  
						Select_startweekindex.options[i].selected=true;  
						}
				   }
				   
				 var Select_startweekday=document.getElementById("StartWeekDay")
					for (i=0;i<Select_startweekday.length;i++){
					 if(Select_startweekday.options[i].value==startweekday){  
						Select_startweekday.options[i].selected=true;  
						}
				   }
				   
				var Select_starthour=document.getElementById("StartTime")
					for (i=0;i<Select_starthour.length;i++){
					 if(Select_starthour.options[i].value==starthour){  
						Select_starthour.options[i].selected=true;  
						}
				   }
				 
				 
				 
			});
			//夏令时结束时间
			$(xmlDoc).find("daylighttimeend").each(function(i) {
				 var ednmonth=$(this).children('month').text();
				 var endweekindex= $(this).children('weekindex').text();
				 var endweekday= $(this).children('weekday').text();
				 var endhour= $(this).children('hour').text();
				 
				 var Select_ednmonth=document.getElementById("StopMonth")
					for (i=0;i<Select_ednmonth.length;i++){
					 if(Select_ednmonth.options[i].value==ednmonth){  
						Select_ednmonth.options[i].selected=true;  
						}
				   }
				   
				 var Select_endweekindex=document.getElementById("StopWeek")
					for (i=0;i<Select_endweekindex.length;i++){
					 if(Select_endweekindex.options[i].value==endweekindex){  
						Select_endweekindex.options[i].selected=true;  
						}
				   }
				 
				 var Select_endweekday=document.getElementById("StopWeekDay")
					for (i=0;i<Select_endweekday.length;i++){
					 if(Select_endweekday.options[i].value==endweekday){  
						Select_endweekday.options[i].selected=true;  
						}
				   }
				   
				  var Select_endhour=document.getElementById("StopTime")
					for (i=0;i<Select_endhour.length;i++){
					 if(Select_endhour.options[i].value==endhour){  
						Select_endhour.options[i].selected=true;  
						}
				   }
				 
				 
			});
			
				$(xmlDoc).find("daylighttimeoffset").each(function(i){ //夏令时偏移时间
				
					var  k_szdaylighttimeoffset= $(this).text();
				  
				   $("#DSTBias").empty();
					var arr = $(this).attr('opt').split(","); 
					for (i=0;i<arr.length;i++){
					  $("#DSTBias").append("<option  name='"+'DSTBiasOpt'+(i + 1)+"'  value="+arr[i]+">" + getNodeValue('DSTBiasOpt'+(i+1)) + "</option>");
						var selectCode=document.getElementById("DSTBias"); 
						if(selectCode.options[i].value==k_szdaylighttimeoffset){  
							selectCode.options[i].selected=true;  
						 } 
					};
				  
				  
				}); 
				
				
				
				
				autoResizeIframe();
			},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		});
	}
	
	//弹出手动设置窗口确定按扭、时间同步
    TimeSystem.prototype.ModalTimeOKclick= function(){
	
	var timezoneopt=$("#ModalseTimeZone").val();
    var timezone = timezoneopt.split("GMT");
	//var arDTZms = timezoneopt.match(/([+-])(\d+):(\d+):(\d+)/);
	//var ModalteSelectTime=$("#ModalteDeviceTime").val();  //设备时间
	var ModalteSelectTime=$("#ModalteSelectTime").val();   //设置时间
	var a = ModalteSelectTime.match(/\d+/g);
	var d = new Date(a[0],a[1]-1,a[2],a[3],a[4],a[5]);
	//alert(d+"  "+d.getHours())  
	
	var szTimeZone = $("#ModalseTimeZone").val();
	var arTZms = szTimeZone.match(/([+-])(\d+):(\d+)/);
	//console.log("arTZms"+"    "+arTZms[1]+"   "+arTZms[2]+"    "+arTZms[3])  //得到"+或-"
	//var d = new Date(ModalteSelectTime);
	//d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()
	//d.setMonth(d.getMonth() + 1 + 1);//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1
	
	//console.log(arTZms[1])
	if (arTZms[1]==="-"){
		//alert("减"+"   "+arTZms[1]+"    "+arTZms[2])
		d.setHours(d.getHours() + parseInt(arTZms[2]));//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1,小时getHours
		d.setMinutes(d.getMinutes() + parseInt(arTZms[3]));//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1,小时getHours
	}else if(arTZms[1]==="+"){
		//alert("加"+"   "+arTZms[1]+"    "+arTZms[2]+"    "+d.setHours(d.getHours() - parseInt(arTZms[2])))
		var nHour = arTZms[2];
		d.setHours(d.getHours() - nHour);//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1,小时getHours
		d.setMinutes(d.getMinutes() - parseInt(arTZms[3]));//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1,小时getHours
		
	}
	
	var dtTime=d.getFullYear()+"-"+Appendzero(parseInt(d.getMonth()+1))+"-"+Appendzero(d.getDate())+"T"+Appendzero(d.getHours())+":"+Appendzero(d.getMinutes())+":"+Appendzero(d.getSeconds())
		
	//TimeSystem.prototype.dateFormat(dtTime, "yyyy-MM-ddTHH:mm:ss")
	//console.log(dtTime)
	//return
	var szXml = "<timesyninfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<timezone>"+arTZms[1]+arTZms[2]+":"+arTZms[3]+"</timezone>";
	szXml += "<time>"+dtTime+"</time>";
 	szXml += "</timesyninfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/time/synchronise"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		//cache:false, 缓存
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},success: function(xmlDoc, textStatus, xhr)
		{
			 var Docxml =xhr.responseText;
		     var xmlDoc = GetparseXmlFromStr(Docxml);
			 $(xmlDoc).find("statuscode").each(function(i){ 
					var state= $(this).text();
					if("0" == state)	//OK
					{
						szRetInfo = m_szSuccessState+m_szSuccess1;
						$.modal.impl.close();
						
						//ModalManualTimeclose();
						TimeSystem.prototype.GetTimeinfo();
						TimeSystem.prototype.GetTimeauto();
						
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;
					}
				});
			$("#ModalTimeTips").html(szRetInfo);
			setTimeout(function(){$("#ModalTimeTips").html("");},5000);  //5秒后自动清除
			//setTimeout(function(){$.modal.impl.close();},1000);
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
  };
	
	
	
	
	


     /*************************************************
	Function:		setTimeSyncMode
	Description:	设置校时方式
	Input:			mode 校时方式	，ntp-ntp校时，inputprotocol-接入协议校时		
	Output:			无
	return:			无
	*************************************************/
	TimeSystem.prototype.setTimeSyncMode = function(mode)
	{
		if (mode == 'inputprotocol')
		{ // 接入协议校时
			$("#inputprotocol").prop("checked", true);
			$("#inputprotocolExplain").show();
			//$("#subSelectTime").show();
			//$("#subNtpServer").hide();
			//$("#subNtpPort").hide();
			//$("#subNtpInterval").hide();
			$("#systemntp").hide(); 
			//$("#systemmanual").show();
			if (!$("#chTimeSyncWithPC").prop("checked"))
			{
				$("#teSelectTime").prop("disabled", false);
				//$("#seTimeZone").prop("disabled", false);
			}
			//this.updateSystemTime();
			TimeSystem.prototype.clickTimeSyncWithPC();
		}
		else if(mode == 'ntp')
		{ // ntp校时
			$("#ntp").prop("checked", true);
			$("#inputprotocolExplain").hide();
			$("#systemntp").show(); 
			
			
			if (!$("#chTimeSyncWithPC").prop("checked"))
			{
				$("#teSelectTime").prop("disabled", false);
				//$("#seTimeZone").prop("disabled", false);
			}
			//this.updateSystemTime();
			TimeSystem.prototype.clickTimeSyncWithPC();
		}
	}
	
	
	/*************************************************
	Function:		updateSystemTime
	Description:	根据所选时区，更新$("#teDeviceTime").val()，并非通过设备来更新
	Input:			无
	Output:			无
	return:			无	
	*************************************************/
	TimeSystem.prototype.updateSystemTime = function()
	{
		if ($("#chTimeSyncWithPC").prop("checked"))
		{
			return;
		}
		var iDeviceTime = this.m_dtDeviceTime.getTime(); // ms
		var arDTZms = this.m_szDeviceTimeZone.match(/\D+([+-])(\d+):(\d+):(\d+)/);
		if (arDTZms !== null && arDTZms.length === 5)
		{
			var iDInc = (parseInt(arDTZms[2]) * 3600 + parseInt(arDTZms[3]) * 60 + parseInt(arDTZms[4])) * 1000; // ms
			iDInc = (arDTZms[1] === "+") ? iDInc : -iDInc;
		}
		else
		{
			//arDTZms = this.m_szDeviceTimeZone.match(/\D+([+-])(\d+)/);
		    arDTZms = this.m_szDeviceTimeZone.match(/([+-])(\d+):(\d+)/);
			var iDInc = parseInt(arDTZms[2]) * 3600000; // ms
			iDInc = (arDTZms[1] === "+") ? iDInc : -iDInc;
		}
		var szTimeZone = $("#seTimeZone").val(); // 当前选择时区
		
		if (szTimeZone == null)
		{ // 刷新时，$("#seTimeZone")尚未得到？？
			return;
		}
		//var arTZms = szTimeZone.match(/\D+([+-])(\d+):(\d+):(\d+)/);
		var arTZms = szTimeZone.match(/([+-])(\d+):(\d+)/);
		//dk   ["-12:00", "-", "12", "00"]
		//hk   ["CST-8:00:00", "-", "8", "00", "00"]
		//console.log(arTZms)
		//-   12   00   undefined
	//	-   8   00   00
		
		var iInc = (parseInt(arTZms[2]) * 3600 + parseInt(arTZms[3]) * 60 ) * 1000; // ms
		//console.log(arTZms.length)
		if (arTZms.length !== 4)
		{
			return;
		}
		
		iInc = (arTZms[1] === "+") ? iInc : -iInc;
		
		var dtTime = new Date(iDeviceTime + iDInc - iInc);
		//$("#teSelectTime").val(this.dateFormat(dtTime, "yyyy-MM-ddTHH:mm:ss"));
		//$("#ModalteSelectTime").val(this.dateFormat(dtTime, "yyyy-MM-ddTHH:mm:ss"));
	}
	
	
	
	
	
	/*************************************************
	Function:		ModalupdateSystemTime  弹出窗口
	Description:	根据所选时区，更新$("#teDeviceTime").val()，并非通过设备来更新
	Input:			无
	Output:			无
	return:			无	
	*************************************************/
	TimeSystem.prototype.ModalupdateSystemTime = function()
	{
		if ($("#chTimeSyncWithPC").prop("checked"))
		{
			return;
		}
	 
	  var szDeviceTime=$("#ModalteSelectTime").val();   //设置时间  
	  var tt=m_oldzone.match(/([+-])(\d+):(\d+)/);
	  var hh = tt[2];
	  var mm = tt[3];
	  var a = szDeviceTime.match(/\d+/g);
	 // var d = new Date(szDeviceTime);
	  var d = new Date( a[0],a[1]-1,a[2],a[3],a[4],a[5]);
	
	  if(tt[1] == "+")
	  {
	      d.setHours(d.getHours() - hh);//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1,小时getHours
	      d.setMinutes(d.getMinutes() - parseInt(mm));//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1,小时getHours
	  }
	  else
	  {
		  d.setHours(d.getHours() + parseInt(hh));//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1,小时getHours
	      d.setMinutes(d.getMinutes() + parseInt(mm));//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1,小时getH
	  }
	  
	  var seTimeZone=$("#ModalseTimeZone").val();   //时区
	  
	  var tt=seTimeZone.match(/([+-])(\d+):(\d+)/);
	  var hh = tt[2];
	  var mm = tt[3];
      if(tt[1] == "+")
	  {
	      d.setHours(d.getHours() + parseInt(hh));//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1,小时getHours
	      d.setMinutes(d.getMinutes() + parseInt(mm));//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1,小时getHours
	  }
	  else
	  {
		   d.setHours(d.getHours() - hh);//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1,小时getHours
	       d.setMinutes(d.getMinutes() - parseInt(mm));//加一个月，同理，可以加一天：getDate()+1，加一年：getYear()+1,小时getHours
	  }
      var dtTime=d.getFullYear()+"-"+Appendzero(parseInt(d.getMonth()+1))+"-"+Appendzero(d.getDate())+"T"+Appendzero(d.getHours())+":"+Appendzero(d.getMinutes())+":"+Appendzero(d.getSeconds());
	 //alert("时区"+"   "+dtTime)
	  $("#ModalteSelectTime").val(dtTime)

	  m_oldzone=$("#ModalseTimeZone").val()
	}
	
	
    TimeSystem.prototype.updateNtpInfo= function(){
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/ntpserver.xml"
	//var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/time/ntpserver"
	$.ajax({
		type: "get",
		url:szURL,
		async: true,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{
			var Docxml =xhr.responseText;
		     var xmlDoc = GetparseXmlFromStr(Docxml);
			$("#teNtpServer").val($(xmlDoc).find('url').eq(0).text());   //获取URL
			$("#teNtpPort").val($(xmlDoc).find('port').eq(0).text());   //获取端口
			$("#teNtpInterval").val($(xmlDoc).find('timespeed').eq(0).text());   //时间间隔
			
		}
	});
  };
	
	
	
  
 
  
   

})(); // TimeSystem implementation  结束
function ModalManualTimeclose(){
	$.modal.impl.close();
};
function EnableclickDST(obj){
	if($(obj).prop("checked")){ //选中
	   //alert("选中")
		   $(obj).val("true");
			$("#dvDST select").prop("disabled", !$("#IsEnableDST").prop("checked"));
		  
		}else{
		//	alert("未选")
		 $(obj).val("false");
		  $("#dvDST select").prop("disabled", !$("#IsEnableDST").prop("checked"));
		}
}


 //保存时间设置
function SaveTimeSystem(obj,tab){
  var startmonth=$("#StartMonth").val();
  var startweekindex=$("#StartWeek").val();
  var startweekday=$("#StartWeekDay").val();
  var starthour=$("#StartTime").val();
  
  var endmonth=$("#StopMonth").val();
  var endweekindex=$("#StopWeek").val();
  var endweekday=$("#StopWeekDay").val();
  var endhour=$("#StopTime").val();
  
 // 1.月相同：开始星期 < 结束星期 
 // 2.月相同 && 星期相同：开始天 < 结束天
 // 3.月相同 && 星期相同 && 天相同：开始小时 < 结束小时
   if ((parseInt(startmonth) > parseInt(endmonth)))
   {
	  alert(getNodeValue('jsTimeErrorTips'));
	  return;
   }
   else if((parseInt(startmonth) == parseInt(endmonth)) && (parseInt(startweekindex) > parseInt(endweekindex)) )
   {
	  alert(getNodeValue('jsTimeErrorTips'));
	  return;
   }
   else if((parseInt(startmonth) == parseInt(endmonth)) && (parseInt(startweekindex) == parseInt(endweekindex))  && (parseInt(startweekday) > parseInt(endweekday)) )
   {
	  alert(getNodeValue('jsTimeErrorTips'));
	  return;
   }
   else if((parseInt(startmonth) == parseInt(endmonth)) && (parseInt(startweekindex) == parseInt(endweekindex))  && (parseInt(startweekday) == parseInt(endweekday))  && (parseInt(starthour) > parseInt(endhour)) )
   {
	  alert(getNodeValue('jsTimeErrorTips'));
	  return;
   }
  SavtAuto(obj,tab);  //自动校时
  
}
//保存时间设置
function SaveTime(){
  var timezoneopt=$("#seTimeZone").val();
  var timezone = timezoneopt.split("GMT");
  var teDeviceTime=$("#teDeviceTime").val();
  var szXml = "<systemtimeinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<timezone>"+timezone[1]+"</timezone>";
	szXml += "<time>"+$("#teDeviceTime").val()+"</time>";
 	szXml += "</systemtimeinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/time/info"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},success: function(xmlDoc, textStatus, xhr)
		{
			//  var Docxml =xhr.responseText;
		      // var xmlDoc = GetparseXmlFromStr(Docxml);
			 /*$(xmlDoc).find("statuscode").each(function(i){ 
			   var  state= $(this).text();
			   if("0" == state)	//OK
				{
					szRetInfo = m_szSuccessState+m_szSuccess1;
				}else{
					szRetInfo=  m_szErrorState+m_szError1;
				}
			});
			$("#SetResultTipsTimeSystem").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsTimeSystem").html("");},5000);  //5秒后自动清除
		  */
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	
	});	
}
//保存自动校时
function SavtAuto(obj,tab){
  var timezoneopt=$("#seTimeZone").val();
  var timezone = timezoneopt.split("GMT");
  var teDeviceTime=$("#teDeviceTime").val();
  var teNtpServer=$("#teNtpServer").val();
  //var myArrayteNtpServer = $("#teNtpServer").val().split(/\./); 
  //var teNtpServer=Number(myArrayteNtpServer[0])+"."+myArrayteNtpServer[1]+"."+myArrayteNtpServer[2]+"."+myArrayteNtpServer[3];
  var teNtpInterval=$("#teNtpInterval").val()
  var timemode=$("input[name='raNetsPreach']:checked").val();
  
  var szXml = "<systemtimeautoinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  if (timemode=="ntp"){
	  
	//if(!CheckIPadd(teNtpServer,'laNtpServerTips','NtpServerTips'))
	//IsURLIP(this.value,'laNtpServerTips','NtpServerTips')
	if(!IsURLIP(teNtpServer,'laNtpServerTips','NtpServerTips'))  //IP域名都支持
	{
		return;
	}
	if(!CheackIDNORange(teNtpInterval,'laNtpIntervalTips','NTPIntervalRangeTips',1,65535))
	{
		return;
	}
	 szXml += "<enable>"+$("#AutoTime").val()+"</enable>";
	 szXml += "<timemode>"+timemode+"</timemode>";
	 szXml += "<url>"+teNtpServer+"</url>";
	 szXml += "<port>"+$("#teNtpPort").val()+"</port>";
	 szXml += "<timespeed>"+teNtpInterval+"</timespeed>";
  }else{
	  szXml += "<enable>"+$("#AutoTime").val()+"</enable>";
	  szXml += "<timemode>"+timemode+"</timemode>";
	 }
 	szXml += "</systemtimeautoinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/time/auto"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,
		data: xmlDoc,
		async: false,  //同步
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},success: function(xmlDoc, textStatus, xhr)
		{
			 
			var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			 $(xmlDoc).find("statuscode").each(function(i){ 
			   var  state= $(this).text();
			   if("0" == state)	//OK
				{
					//szRetInfo = m_szSuccessState+m_szSuccess1;
					SaveTimesummer(obj,tab);  //保存夏令时
				}else{
					szRetInfo=  m_szErrorState+m_szError1;
					$("#SetResultTipsTimeSystem").html(szRetInfo);
					setTimeout(function(){$("#SetResultTipsTimeSystem").html("");},5000);  //5秒后自动清除
				}
			});
			
		  
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj,"SaveTime");
		}
	});	
}
//保存夏令时
function SaveTimesummer(obj,tab){
 var startmonth=$("#StartMonth").val();
  var startweekindex=$("#StartWeek").val();
  var startweekday=$("#StartWeekDay").val();
  var starthour=$("#StartTime").val();
  
  var endmonth=$("#StopMonth").val();
  var endweekindex=$("#StopWeek").val();
  var endweekday=$("#StopWeekDay").val();
  var endhour=$("#StopTime").val();
  
  var daylighttimeoffset=$("#DSTBias").val();
  var enabledaylighttime=$("#IsEnableDST").val();
  
  var szXml = "<summertimeinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<enabledaylighttime>"+$("#IsEnableDST").val()+"</enabledaylighttime>";
	szXml += "<daylighttimestart>";
	     szXml += "<month>"+startmonth+"</month>";
		 szXml += "<weekindex>"+startweekindex+"</weekindex>";
		 szXml += "<weekday>"+startweekday+"</weekday>";
		 szXml += "<hour>"+starthour+"</hour>";
	  szXml += "</daylighttimestart>";
	  szXml += "<daylighttimeend>";
	     szXml += "<month>"+endmonth+"</month>";
		 szXml += "<weekindex>"+endweekindex+"</weekindex>";
		 szXml += "<weekday>"+endweekday+"</weekday>";
		 szXml += "<hour>"+endhour+"</hour>";
	  szXml += "</daylighttimeend>";
	szXml += "<daylighttimeoffset>"+daylighttimeoffset+"</daylighttimeoffset>";
 	szXml += "</summertimeinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/time/summer"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},success: function(xmlDoc, textStatus, xhr)
		{
			 
			 var Docxml =xhr.responseText;
		     var xmlDoc = GetparseXmlFromStr(Docxml);
			 $(xmlDoc).find("statuscode").each(function(i){
				
			  var  state= $(this).text(); 
			   if("0" == state)	//OK
				{
					if (tab=='save')
					{
						szRetInfo = m_szSuccessState+m_szSuccess1;
						$("#SetResultTipsTimeSystem").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsTimeSystem").html("");},5000);  //5秒后自动清除
						TimeSystem.prototype.GetTimeinfo();
						TimeSystem.prototype.GetTimeauto();
					}
					else if (tab=="up")
					{
						$("#aDeviceInformation").click();
						showmenuconfig("deviceinfo","0","FastSetConfig")
					}
					else if(tab=="succ")
					{
						szRetInfo = m_szSuccessState+m_szSuccess1;
						$("#SetResultTipsTimeSystem").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsTimeSystem").html("");},5000);  //5秒后自动清除
						TimeSystem.prototype.GetTimeinfo();
						TimeSystem.prototype.GetTimeauto();
					}
					//szRetInfo = m_szSuccessState+m_szSuccess1;
				}else{
					szRetInfo=  m_szErrorState+m_szError1;
				}
			});
			
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj,"SaveTime");
		}
	
	});	
}

function DST() {
	SingletonInheritor.implement(this);
	
	
}
SingletonInheritor.declare(DST);

pr(DST).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["system", "TimeSettings"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	autoResizeIframe();
	
}




/*************************************************
Function:		Maintain
Description:	构造函数，Singleton派生类
Input:			无			
Output:			无
return:			无				
*************************************************/
function Maintain() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Maintain);
pr(Maintain).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["system", "Maintain"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	
	 if(document.all)
   {
		 $("#mainplugin").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="plugin0"  width="100%" height="100%" ></object>')
	   }
   else
	   {
		 $("#mainplugin").html('<embed id="plugin0" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
	  }
     Plugin();
	 Getautomaintain();  //初始化自动维护
	 autoResizeIframe();
}

/*************************************************
Function:		Getautomaintain
Description:	初始化自动维护
Input:			无			
Output:			无
return:			无				
*************************************************/
function Getautomaintain(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/automaintain"
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
			if("true" == $(xmlDoc).find('enable').eq(0).text())
		    {
			    $("#automaintainenable").val(true);
				$("#automaintainenable").prop("checked", true);
		    }else{
				$("#automaintainenable").val(false);
				$("#automaintainenable").prop("checked", false);
			}
			
			$(xmlDoc).find("cycle").each(function(i){ 
		  	 	var g_cycleType= $(this).text();
				$("#cycleType").empty(); 
				 var g_cycleTypes = $(this).attr('opt').split(",");
				insertOptions2Select(g_cycleTypes, ["everyday","monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], ["Meveryday","MMonday", "MTuesday", "MWednesday", "MThursday", "MFriday", "MSaturday", "MSunday"], "cycleType");
				setValueDelayIE6("cycleType" ,"","",g_cycleType);
			}); 
			$("#automaintainTime").val($(xmlDoc).find('time').eq(0).text());
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};


/*************************************************
Function:		systemreboot
Description:	重启系统
Input:			无			
Output:			无
return:			无				
*************************************************/
function systemreboot(){
	if (confirm(m_szRestartAsk)){ //是否重启设备
		var szXml = "<contentroot>";
	        szXml +=$.cookie('authenticationinfo');
 	        szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/reboot"
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
				window.parent.parent.$('#divUpgradeTable').modal({
			      "close":false   //禁用叉叉和ESC
			    });
				window.parent.parent.$('#divTitle').html(m_MDeviceRestar)
			    window.parent.parent.$('#divUpgradeExplaintips').hide();
			    window.parent.parent.$('#UpgradeClose').show().prop("disabled",true);
			    window.parent.parent.$('#divUpgradeExplain').show().html(m_MDeviceRestaring+"...");//设备正在重启
			    m_TextSignal= setInterval("TextSysSignal()",2000);
				m_TimerRebootOutID= setInterval("RebootSignal()",180000 ); // 3分钟没有返回值表示设备断开或IP
			},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		});
		
	  }
};

/*************************************************
Function:		ledfind
Description:	发现
Input:			无			
Output:			无
return:			无				
*************************************************/
function ledfind(){
	var speed=$("#speedselct").val();
	var szXml = "<ledfindinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<speed>"+speed+"</speed>";
		szXml += "</ledfindinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/ledfind"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

/*************************************************
Function:		factorydefaultSys
Description:	恢复
Input:			无			
Output:			无
return:			无				
*************************************************/
function factorydefaultSys(obj){
	if (confirm(m_MDefaultRestar)){
		var szXml = "<factorydefaultinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<speed>"+obj+"</speed>";
	 	szXml += "</factorydefaultinfo>";
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/factorydefault"
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
					 $(xmlDoc).find("statuscode").each(function(i){ 
					var state= $(this).text();
					 if("4" == state)	//OK
						{
						 parent.$("#header").hide();
						 parent.$("#content").removeClass().addClass("ipeditmain").removeAttr("style").html(getNodeValue('jsnewip'));
						}
					});
			},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		});
		
	}
	
};
//自动维护
function automaintain(obj){
	var automaintainenable=$("#automaintainenable").val();
	var cycle=$("#cycleType").val();
	var automaintainTime=$("#automaintainTime").val()
	var szXml = "<automaintain version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<enable>"+automaintainenable +"</enable >";
		szXml += "<cycle>"+cycle +"</cycle>";
		szXml += "<time>"+automaintainTime +"</time>";
	 	szXml += "</automaintain>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/automaintain"
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
		    
			 $(xmlDoc).find("statuscode").each(function(i){ 
				var state= $(this).text();
				 if("0" == state)	//OK
					{
						szRetInfo = m_szSuccessState+m_szSuccess1;
					}else{
						szRetInfo=  m_szErrorState+m_szError1;
					}
				});
			 
			$("#SetResultTipsautomaintain").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsautomaintain").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj);
			}
	});
};
function IPAddress() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(IPAddress);
pr(IPAddress).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["system", "Maintain"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	autoResizeIframe();
}
//获取文件大小
 ///获得文件的大小(单位字节)  
function GetFileSize(fileId) {  
	var dom = document.getElementById(fileId);  
	try {  
		return dom.files.item(0).fileSize;  
	} catch (e) {  
		try {  
			var img = new Image();  
			img.src = dom.value;  
			img.style.display='none';  
			document.body.appendChild(img);  
						setTimeout(function(){  
							document.body.removeChild(img);  
						},1000);  
			return img.fileSize;  
		} catch (e) {  
			return -1;  
		}  
	}  
}  
function upfile(){
	var szFileName=window.parent.document.getElementById("IpcCtrl").eventWebToPlugin("OpenDlg")  //打开窗口
	$("#teUpgradeFile").val(szFileName)
}

function SysFilePath(szId){
	var szFileName=window.parent.document.getElementById("IpcCtrl").eventWebToPlugin("OpenDlg")
	if(szFileName!=""){
		$("#"+szId).val(szFileName)
	}
	
}



function browseFilePath1(){
	var szFileName=window.parent.document.getElementById("IpcCtrl").openFileNameDlg();
}
//导入
function Introduction(szId){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;	
		$("#SetSystemTips").html(szRetInfo);
		setTimeout(function(){$("#SetSystemTips").html("");},5000);  //5秒后自动清除
		return;
	}
	var szFileName=window.parent.document.getElementById("IpcCtrl").eventWebToPlugin("OpenDlg")
	if(szFileName==""){
		return
		//$("#"+szId).val(szFileName)
	}
	if (confirm(getNodeValue('ImportRebootTips'))){//ImportRebootTips参数导入将自动重启，确认导入
		var ret=document.getElementById("plugin0").eventWebToPlugin("cfg","upload",camera_hostname,camera_port.toString(),szFileName,$.cookie('authenticationinfo'));
		if (ret=="true"){
			window.parent.parent.$('#divUpgradeTable').modal({
			   "close":false   //禁用叉叉和ESC
			});
			window.parent.parent.$('#divUpgradeExplaintips').hide();
			window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",true);
			window.parent.parent.$('#divTitle').html(getNodeValue('laParamImport')); //参数导入
			window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('laParamImport')+"...");
			m_Timercfgup= setInterval("cfgup_progess()",1000);
		}
	}
}
//导入进度条
function cfgup_progess(){
	var varcfgup_progess=document.getElementById("plugin0").eventWebToPlugin("cfg","upquery")
	var cfgdown = varcfgup_progess.split(",");
	//console.log("varcfgup_progess"+"   "+varcfgup_progess+"   "+cfgdown[0]+"   "+cfgdown[1])
	if (cfgdown[0] >= 100){
		clearInterval(m_Timercfgup);
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#UpgradePTZsystemreboot').hide();
		window.parent.parent.$('#UpgradePTZClose').hide();
		window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('ImportSuccessTips'));//导入成功
		window.parent.parent.$("#UpgradeClose").show().prop("disabled",false);
	}else if (cfgdown[1]==1){
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('ImportFailedTips')); //导入失败
		clearInterval(m_Timercfgup);
		window.parent.parent.$("#UpgradePTZsystemreboot").hide();
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
	}else if(cfgdown[1]==2){
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('ImportFailedTips'));  //导入失败
		clearInterval(m_Timercfgup);
		window.parent.parent.$("#UpgradePTZsystemreboot").hide();
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
	}else if(cfgdown[1]==3){
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#divUpgradeExplain').show().html(m_Mauthorization);//没有权限 config.js
		clearInterval(m_Timercfgup);
		window.parent.parent.$("#UpgradePTZsystemreboot").hide();
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
	}
};
//导出
function cfgdown(){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;	
		$("#SetSystemTips").html(szRetInfo);
		setTimeout(function(){$("#SetSystemTips").html("");},5000);  //5秒后自动清除
		return;
	}
	 m_szFileDownName=document.getElementById("plugin0").eventWebToPlugin("SaveDlg");
	if(m_szFileDownName!=""){
		cfgdowninfo(m_szFileDownName);
	}
};
//导出按钮
function cfgdowninfo(szFileDownName){
	var tt=document.getElementById("plugin0").eventWebToPlugin("cfg","download",camera_hostname,camera_port.toString(),szFileDownName,$.cookie('authenticationinfo'))
	
	window.parent.parent.$('#divUpgradeTable').modal({
	   "close":false   //禁用叉叉和ESC
	  });

	window.parent.parent.$("#divTitle").html(getNodeValue('laParamExport'));//参数导出
    window.parent.parent.$("#divUpgradeExplaintips").hide();
	window.parent.parent.$("#divUpgradeExplain").html(getNodeValue('laParamExport')+"...");
    window.parent.parent.$("#UpgradePTZClose").show();
    m_Timercfgdown= setInterval("cfgdown_progess()",1000);

}
//导出进度条
function cfgdown_progess(){
	var cfgdown_progess=document.getElementById("plugin0").eventWebToPlugin("cfg","downquery")
	var cfgdown = cfgdown_progess.split(",");
	//console.log("cfgdown_progess"+"   "+cfgdown[0]+"   "+cfgdown[1])
	if (cfgdown[0] >= 100){
		//console.log("进"+"  "+cfgdown[0])
		clearInterval(m_Timercfgdown);
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('laParamExport')+":"+m_szFileDownName);//导出成功
		window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
		//window.parent.parent.$("#UpgradeIdclose").click()
	}else if (cfgdown[1]==1){
		clearInterval(m_Timercfgdown);
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('ExportFailedTips'));//导出失败
		window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
	}else if(cfgdown[1]==2){
		clearInterval(m_Timercfgdown);
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('ExportFailedTips'));
		window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
	}else if(cfgdown[1]==3){
		clearInterval(m_Timercfgdown);
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#divUpgradeExplain').show().html(m_Mauthorization);  //没有权限
		window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
	}
};
function StateFile(szId){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;	
		$("#SetSystemTips").html(szRetInfo);
		setTimeout(function(){$("#SetSystemTips").html("");},5000);  //5秒后自动清除
		return;
	}
	
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/upgrade/statequery"
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
			m_uploading = false;
			var szFileName=window.parent.document.getElementById("IpcCtrl").eventWebToPlugin("OpenDlg","update")
			if(szFileName==""){
				return;
			}
			window.parent.document.getElementById("IpcCtrl").eventWebToPlugin("startUpload",camera_hostname,camera_port.toString(),szFileName,$.cookie('authenticationinfo'))  //开始升级
			 window.parent.parent.$('#divUpgradeTable').modal({
				   "close":false,   //禁用叉叉和ESC
				   "autoResize":true
				});
			//$("#simplemodal-container").height("auto");
			window.parent.parent.$('#divTitle').html(getNodeValue('tipsUpgradeTitle'))//设备升级中
			 m_TimerOutID2 = 0;
			 m_TimerOutID1= setInterval("uploadtimeoout1()",120000); // 120秒没有上传文件表示升级失败
			 m_TimerID= setInterval("systemuploadstatequery()",2000);
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
// 升级重启升级检查
function uploadtimeoout1(){
	clearInterval(m_TimerID);
	clearInterval(m_TimerOutID1);
	window.parent.parent.$("#divUpgradeExplain").html(getNodeValue('tipsUpgradeFailed'));//升级失败
	window.parent.parent.$("#divUpgradeExplaintips").hide();
	window.parent.parent.$("#divUpgradeico").hide();
	window.parent.parent.$("#UpgradeClose").hide();
	window.parent.parent.$("#UpgradePTZClose").show().prop("disabled",false);
	$.modal.impl.close();
};

//设备升级超时检查
function uploadtimeoout2(){
	clearInterval(m_TimerID);
	clearInterval(m_TimerOutID1);
	clearInterval(m_TimerOutID2);
	setTimeout(function (){
		window.parent.parent.$("#divUpgradeExplain").html(getNodeValue('tipsUpgradeTimeOut'));//升级超时,请检查是否升级成功
		window.parent.parent.$("#divUpgradeExplaintips").hide();
		window.parent.parent.$("#divUpgradeico").hide();
		window.parent.parent.$("#UpgradeClose").show().prop("disabled",false);
	},5000)//等待5秒后可关闭
};

//升级状态查询
function systemuploadstatequery(){
	var sysUpGradeError= window.parent.document.getElementById("IpcCtrl").eventWebToPlugin("sysUpGradeError")
	if (sysUpGradeError==1){//没有权限
		clearInterval(m_TimerID);
		clearInterval(m_TimerOutID1);
		clearInterval(m_TimerOutID2);
		window.parent.parent.$("#divUpgradeExplaintips").hide();
		window.parent.parent.$("#divUpgradeico").hide();
		window.parent.parent.$("#divUpgradeExplain").html(m_Mauthorization);//没有权限
		window.parent.parent.$("#UpgradePTZClose").show().prop("disabled",false);
		return;
	}
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/upgrade/statequery"
	$.ajax({
		type: "get",
		url:szURL,
		//processData: false,//不转换
		//data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{
			 var Docxml =xhr.responseText;
		     var xmlDoc = GetparseXmlFromStr(Docxml);
			$(xmlDoc).find("state").each(function(i){ 
			   var m_iStreamType= $(this).text();
				if ($(this).text()=="prepare")
				{
					window.parent.parent.$("#divUpgradeExplain").html(getNodeValue('tipsUpgradeState')+"...");//状态:准备升级中
				}
				else if($(this).text()=="uploading")
				{
					window.parent.parent.$("#divUpgradeExplain").html(getNodeValue('tipsUpgradeState1')+"...");//状态升级中
					m_uploading = true;
					if(m_TimerOutID2 == 0){
						clearInterval(m_TimerOutID1);
					    m_TimerOutID2= setInterval("uploadtimeoout2()",300000); // 发送文件后超时300秒 超时提示"升级超时，请检查是否升级成功"
					   }
				}
				else if($(this).text()=="idel")
				{
					clearInterval(m_TimerID);
					clearInterval(m_TimerOutID1);
					clearInterval(m_TimerOutID2);
					
					if(m_uploading==true)
					{
						setTimeout(function (){
							window.parent.parent.$("#divUpgradeico").hide();
							window.parent.parent.$("#divUpgradeExplaintips").hide();
							window.parent.parent.$("#divUpgradeExplain").html(getNodeValue('tipsUpdateSucc')); //设备已升级完成
							window.parent.parent.$("#UpgradeClose").show().prop("disabled",false);
						},5000)//等待5秒后可关闭
					}
					else
					{
						window.parent.parent.$("#divUpgradeico").hide();
						window.parent.parent.$("#divUpgradeExplaintips").hide();
						window.parent.parent.$("#divUpgradeExplain").html(getNodeValue('tipsUpgradeFailed'));//升级失败
						window.parent.parent.$("#UpgradePTZClose").show().prop("disabled",false);
					}
				}
			}); 
		}/*,error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}*/
	});
};

/*function UpgradeCloseclose(){
	//console.log("aaaa")
	window.parent.parent.$("#UpgradeIdclose").click()
};*/
function AdvanceConfig(){
	pr(Maintain).update();
	 $("#divPortMapTable").modal(
		{
			"close":false,
			"autoResize":false,
			"position":[100]
		 }
	  );
	 $("#simplemodal-container").width(660).height("auto");   
	   /*
	   dvosd 是否支持VSIP设置OSD时功能
	   aec
	   */
	   //initConfigsystemGetCap("dvosd=true&aec=true&dynamicosd=true&mtcf=true");//
	   //initConfigsystemGetCap("dvosd=true&aec=true&dynamicosd=true&mtcf=true");//
};
function initConfigsystemGetCap(obj){
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
			
			if($(xmlDoc).find("dvosd").length > 0){
				$(xmlDoc).find("dvosd").each(function(i){ 
					 if($(this).text()!="true")
					{
						$("#dvosd").hide();
					}else{
						$("#dvosd").show();
						
					}
				});
			}
			
			var g_aec_dvosd = false;
			if($(xmlDoc).find("aec").length > 0){
				$(xmlDoc).find("aec").each(function(i){ 
					 if($(this).text()!="true")
					{
						$("#subaec").hide();
					}else{
						$("#subaec").show();
						g_aec_dvosd=true;
					}
				});
			}
			if($(xmlDoc).find("dynamicosd").length > 0){
				$(xmlDoc).find("dynamicosd").each(function(i){ 
					 if($(this).text()!="true")
					{
						$("#sudynamicosd").hide();
					}else{
						$("#sudynamicosd").show();
						g_aec_dvosd=true;
					}
				});
			}
			
			if (g_aec_dvosd!=true)
			{
				$("#subaecsupport").hide();
			}
			else
			{
				$("#subaecsupport").show();
			}
			if($(xmlDoc).find("mtcf").length > 0){
				$(xmlDoc).find("mtcf").each(function(i){ 
					 if($(this).text()!="true")
					{
						$("#submtcfcat").hide();
					}else{
						$("#submtcfcat").show();
					}
				});
			}
                
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
/**********************************
功能: 按回车键登录
***********************************/
function keydownEvent() {
	 var e = window.event || arguments.callee.caller.arguments[0];
	 if (e && e.keyCode == 13 ) {
		 AdvanceConfigOKclick();
	 }
	}
/*document.onkeydown=function (event) 
{
	event = event?event:(window.event?window.event:null);	 
	 if(event.keyCode==13)
	{
		AdvanceConfigOKclick(); 
	}
}*/
function AdvanceConfigOKclick(){
	var UserName=$("#UserName").val();
	var UserPWD=$("#UserPWD").val();
	if (!CheckDevUserName(UserName,'UserNametips','jsUser',0))
	{
	   return;
	}
	if (!CheckDevUserName(UserPWD,'UserPWDtips','jsUserPWD',0,32))
	{
	   return;
	}
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/link/authenticationid";
	$.ajax({
		type: "get",
		url:szURL,
		async: false,  //同步
		//cache:false,  //不缓存
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{
		    var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
		    if($(xmlDoc).find("authenticationid").length > 0){
				$(xmlDoc).find("authenticationid").each(function(i){ 
					// var AdvanceConfigauthenticationid = $(this).text();
					 authenticationLogin($(this).text());
					// $.cookie('authenticationid',authenticationid);
				});
			}
		},
		error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj,'GetAuthentication');
		}
	});
		
};

function authenticationLogin(obj){
	var UserName=$("#UserName").val();
	var UserPWD=$("#UserPWD").val();
	if (!CheckDevUserName(UserName,'UserNametips','jsUser',0))
	{
	   return;
	}
	if (!CheckDevUserName(UserPWD,'UserPWDtips','jsUserPWD',0,32))
	{
	   return;
	}
    var AGauthentipassword = $("#UserName").val()+","+$("#UserPWD").val()+","+obj;
		AGauthentipassword = Base64.encode(hex_md5(AGauthentipassword));
		var AGauthenticationinfo = '<authenticationinfo type="7.0">';
			AGauthenticationinfo += "<username>"+UserName+"</username>";
			AGauthenticationinfo += "<password>"+AGauthentipassword+"</password>";
			AGauthenticationinfo += "</authenticationinfo>";
    var szXml = "<loginparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	//szXml +=$.cookie('authenticationinfo');
 	szXml += "</loginparam>";
	 $.cookie('AGauthenticationinfo', AGauthenticationinfo);
	var xmlDoc = AGparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/login"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		cache:false,  //不缓存
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{
			
			
			var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			//alert("aa"+xhr.status) 200
			　if (xhr.readyState == 4) {
		　　			if (xhr.status == 200) {
			           $.modal.impl.close();
					    $("#divAdvanceinfoTable").modal(
						{
							"close":false,
							"autoResize":false,
							"position":[100]
						 }
					   );
					   $("#simplemodal-container").width(660).height("auto");
		               GetAdvancedConfig();
					   GetSysMtcf();
					   $.cookie('AGauthenticationinfo',null);
		　　			} else {
		　　			    $("#spCheckResultTips").show().html(getNodeValue('LoginTips4'))//用户名不存在
						setTimeout(function(){$("#spCheckResultTips").hide();},2500);
						
		　　			}
		　　		}
		},
		error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,'GetAuthentication');
			}
	});
};


//获取高级配置
function GetAdvancedConfig(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
    var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/advanced"
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
			//视频流时间戳
			if($(xmlDoc).find("kedavsiptimestamp").length > 0){
				  $(xmlDoc).find("kedavsiptimestamp").each(function(i){ 
					if($(this).attr('enable') != "true")
					{
						$("#Subkedavsiptimestamp").hide();
					}
					else
					{
						$("#Subkedavsiptimestamp").show();
						var kedavsiptimestamp = $(this).text();
						if (kedavsiptimestamp=="normal")
						{
							$("input[name='kedavisiptimestamp'][value='normal']").attr("checked",true);
						}
						else if(kedavsiptimestamp=="old")
						{
							$("input[name='kedavisiptimestamp'][value='old']").attr("checked",true);
						}
					}
				});
			};
			
			
			
			var g_avalive = false;
			//VSIP申请的音视频流保
			if($(xmlDoc).find("kedavsipavalive").length > 0){
				  $(xmlDoc).find("kedavsipavalive").each(function(i){ 
					if($(this).attr('enable') != "true")
					{
						$("#Subkedavsipavalive").hide();
					}
					else
					{
						$("#Subkedavsipavalive").show();
						g_avalive = true;
						var kedavisipavlive = $(this).text();
						if (kedavisipavlive=="auto")
						{
							$("input[name='kedavisipavlive'][value='auto']").attr("checked",true);
						}
						else if(kedavisipavlive=="open")
						{
							$("input[name='kedavisipavlive'][value='open']").attr("checked",true);
						}
						else if(kedavisipavlive=="close")
						{
							$("input[name='kedavisipavlive'][value='close']").attr("checked",true);
						}
						
					}
				});
			};
			
			//Onvif(RTSP)申请的音视频流保活
			if($(xmlDoc).find("onvifavalive").length > 0){
				  $(xmlDoc).find("onvifavalive").each(function(i){ 
					if($(this).attr('enable') != "true")
					{
						$("#Subonvifavalive").hide();
					}
					else
					{
						$("#Subonvifavalive").show();
						g_avalive = true;
						var onvifavlive = $(this).text();
						if (onvifavlive=="auto"){
							$("input[name='onvifavlive'][value='auto']").attr("checked",true);
						}else if(onvifavlive=="open"){
							$("input[name='onvifavlive'][value='open']").attr("checked",true);
						}else if(onvifavlive=="close"){
							$("input[name='onvifavlive'][value='close']").attr("checked",true);
						}
						
					}
				});
			};
			
			//GB28181申请的音视频流保活
			if($(xmlDoc).find("gb28181avalive").length > 0){
				  $(xmlDoc).find("gb28181avalive").each(function(i){ 
					if($(this).attr('enable') != "true")
					{
						$("#subgb28181avalive").hide();
					}
					else
					{
						$("#subgb28181avalive").show();
						g_avalive = true;
						var gb28181avalive = $(this).text();
						if (gb28181avalive=="auto"){
							$("input[name='gb28181avlive'][value='auto']").attr("checked",true);
						}else if(gb28181avalive=="open"){
							$("input[name='gb28181avlive'][value='open']").attr("checked",true);
						}else if(gb28181avalive=="close"){
							$("input[name='gb28181avlive'][value='close']").attr("checked",true);
						}
						
					}
				});
			};
			
			if (g_avalive!=true)
			{
				$("#subkedavisipavlive").hide();
			}	
			else
			{
				$("#subkedavisipavlive").show();
			}
		
		   //VSIP协议兼容性
		   //VSIP设置OSD时 
		   if($(xmlDoc).find("osdpicsource").length > 0){
				  $(xmlDoc).find("osdpicsource").each(function(i){ 
					if($(this).attr('enable') != "true")
					{
						$("#dvosd").hide();
					}
					else
					{
						$("#dvosd").show();
						var osdpicsource = $(this).text();
						if (osdpicsource=="client"){
							$("input[name='osdpicsource'][value='client']").attr("checked",true);
						}else if(osdpicsource=="dev"){
							$("input[name='osdpicsource'][value='dev']").attr("checked",true);
						}
						
					}
				});
			};
		   
		   //字体
		   if($(xmlDoc).find("osdpicfont").length > 0){
				  $(xmlDoc).find("osdpicfont").each(function(i){ 
					if($(this).attr('enable') != "true")
					{
						$("#osdpicfont").hide();
					}
					else
					{
						$("#osdpicfont").show();
						$("#osdpicfont").empty(); 
						 var osdpicfontopts = $(this).attr('opt').split(",");
						insertOptions2Select(osdpicfontopts, ["song", "black"], ["jssong", "jsblack"], "osdpicfont");
						setValueDelayIE6("osdpicfont" ,"","",$(this).text());
					}
				});
			};
		   
		   //网络适应性
		   var g_subavalive = false;
		   if($(xmlDoc).find("tccontrol").length > 0){
				  $(xmlDoc).find("tccontrol").each(function(i){ 
					if($(this).attr('enable') != "true")
					{
						$("#subtccontrol").hide();
					}
					else
					{
						$("#subtccontrol").show();
						g_subavalive=true;
						var tccontrol = $(this).text();
						if (tccontrol=="false"){
							$("input[name='tccontrol'][value='false']").attr("checked",true);
						}else if(tccontrol=="true"){
							$("input[name='tccontrol'][value='true']").attr("checked",true);
						}
					}
				});
			};
			enablelimit=false;
			$(xmlDoc).find("limit").each(function(i){ 
			     
				if($(this).attr('enable') != "true")
				{
					$("#sublimit").hide();
				}
				else
				{
					$("#sublimit").show();
					g_subavalive=true;
					enablelimit=true;
					var g_limit = $(this).text();
					 g_limitmin=$(this).attr('min');
					 g_limitmax=$(this).attr('max');
					$("#limit").val(g_limit).attr('maxlength' , g_limitmax.length); 
					$("#fixedlimitTips").html(g_limitmin+"~"+g_limitmax)
				}
			});
			
			if (g_subavalive!=true)
			{
				$("#SubNettccontrol").hide();
			}	
			else
			{
				$("#SubNettccontrol").show();
			}
		
		
			//功能开关
			//支持回声抵消
			var g_aecsupport = false;
			if($(xmlDoc).find("aecsupport").length > 0){
				  $(xmlDoc).find("aecsupport").each(function(i){ 
					if($(this).attr('enable') != "true")
					{
						$("#subaec").hide();
					}
					else
					{
						$("#subaec").show();
						g_aecsupport = true;
						var aecsupport = $(this).text();
						if (aecsupport=="false"){
							$("input[name='aecsupport'][value='false']").attr("checked",true);
						}else if(aecsupport=="true"){
							$("input[name='aecsupport'][value='true']").attr("checked",true);
						}
					}
				});
			};
			//OSD动态内容功能
			if($(xmlDoc).find("dynamicosdsupport").length > 0){
				  $(xmlDoc).find("dynamicosdsupport").each(function(i){ 
					if($(this).attr('enable') != "true")
					{
						$("#subdynamicosd").hide();
					}
					else
					{
						$("#subdynamicosd").show();
						g_aecsupport = true;
						var dynamicosdsupport = $(this).text();
						if (dynamicosdsupport=="false")
						{
							$("input[name='dynamicosd'][value='false']").attr("checked",true);
						
						}else if(dynamicosdsupport=="true")
						{
							$("input[name='dynamicosd'][value='true']").attr("checked",true);
						}
					}
				});
			};
			
			if (g_aecsupport!=true)
			{
				$("#subaecsupport").hide();
			}	
			else
			{
				$("#subaecsupport").show();
			}
			//降噪
			//采集降噪
			if($(xmlDoc).find("capdenoise").length > 0){
				  $(xmlDoc).find("capdenoise").each(function(i){ 
					if($(this).attr('enable') != "true")
					{
						$("#SubCapdenoise").hide();
					}
					else
					{
						
						$("#Subreduction").show();
						$("#SubCapdenoise").show();
						denoise_audiosource=$(this).attr('audiosource');
						$("#capdenoiseopt").empty();
						 var capdenoiseopts = $(this).attr('opt').split(",");
						//insertOptions2Select(capdenoiseopts, ["auto", "open", "close"], ["MAuto", "MEnable", "optclose"], "capdenoiseopt");
						insertOptions2Select(capdenoiseopts, ["close", "hight", "middle", "low"], ["Moptclose", "Mopthigh", "Moptmiddle", "Moptlow"], "capdenoiseopt");
						setValueDelayIE6("capdenoiseopt" ,"","",$(this).text());
					}
				});
			};
			
			//解码降噪
			if($(xmlDoc).find("decdenoise").length > 0){
				  $(xmlDoc).find("decdenoise").each(function(i){ 
						if($(this).attr('enable') != "true")
						{
							$("#SubDecdenoise").hide();
						}
						else
						{
							$("#Subreduction").show();
							$("#SubDecdenoise").show();
							decdenoise_audiosource=$(this).attr('audiosource');
							$("#decdenoiseopt").empty();
							 var decdenoiseopts = $(this).attr('opt').split(",");
							//insertOptions2Select(decdenoiseopts, ["auto", "open", "close"], ["MAuto", "MEnable", "optclose"], "decdenoiseopt");
							insertOptions2Select(decdenoiseopts, ["close", "hight", "middle", "low"], ["Moptclose", "Mopthigh", "Moptmiddle", "Moptlow"], "decdenoiseopt");
							setValueDelayIE6("decdenoiseopt" ,"","",$(this).text());
						}
				});
			};

		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

//获取工作模式
function GetSysMtcf(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/mtcf"
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
			 //低延时
			if($(xmlDoc).find("aac").length > 0)
			{
				$(xmlDoc).find("aac").each(function(i)
				 {
					var g_enable = $(this).attr('enable');
					if (g_enable=="true")
					{
						g_aactext=$(this).text();
						g_aacenable=true;
						$("#submtcfcat").show();
						$("#aacmode").show();
						if (g_aactext=="autolow")
						{
							$("input[name='advancedmtcf'][value='autolow']").attr("checked",true);
						}
						else if(g_aactext=="normal")
						{
							$("input[name='advancedmtcf'][value='normal']").attr("checked",true);
						}
						else if(g_aactext=="low")
						{
							$("input[name='advancedmtcf'][value='low']").attr("checked",true);
						}
					}
					else
					{
						$("#aacmode").hide();
						
					}
				 });
			}
			//工作模式
			if($(xmlDoc).find("mode").length > 0)
			 {
				$(xmlDoc).find("mode").each(function(i){ 
				   var g_enable = $(this).attr('enable');
				   if (g_enable=="true")
				   {
						 g_modetext= $(this).text();
						 g_modeenable=true;
						 $("#submtcfcat").show();
						 $("#submtcfchange").show();
						 var g_modes = $(this).attr('opt').split(",");
						insertOptions2Select(g_modes, ["hdr","fps60","stream4","4k","div4","normal","hdsdi","stream3"], ["Mhdr","Mfps60","Mstream4","M4K","Mdiv4","Mnormal","Mhdsdi","Mstream3"], "modechange");
						setValueDelayIE6("modechange" ,"","",g_modetext);
				   }
				   else
				   {
						
						$("#submtcfchange").hide();
				   }
				}); 
			 }
			if (g_modetext==false&&g_aactext==false){
				$("#submtcfcat").hide()
			}
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//保存高级配置
function AdvanceSaveOKclick(){
	var kedavsiptimestamp = $("input[name='kedavisiptimestamp']:checked").val();
	var kedavisipavlive=$("input[name='kedavisipavlive']:checked").val();
	var onvifavlive=$("input[name='onvifavlive']:checked").val();
	var gb28181avlive=$("input[name='gb28181avlive']:checked").val();
	var memorymode=$("input[name='memorymode']:checked").val();
	var osdpicsource=$("input[name='osdpicsource']:checked").val();
	var tccontrol=$("input[name='tccontrol']:checked").val();
	var aecsupport=$("input[name='aecsupport']:checked").val();
	var dynamicosdsupport=$("input[name='dynamicosd']:checked").val();
	var aacmode=$("input[name='advancedmtcf']:checked").val();
	var modechange=$("#modechange").val();
	if (g_aacenable!=false || g_modeenable!=false){//不支持工作模式时，直接保存高级配置
		if (g_modetext!=false)
		{
			if (g_modetext!=modechange)
			{
				if (confirm(m_szAsk))
				{
					SaveAdvance();
				}
			}
			else
			{
				SaveAdvance();
			}
		}
		else
		{
			if (g_aactext!=false)
			{
				SaveAdvance();
			}
		}
	}
	else
	{
		SaveAdvance();
	}
};
function SaveAdvance(){
	var kedavsiptimestamp = $("input[name='kedavisiptimestamp']:checked").val();
	var kedavisipavlive=$("input[name='kedavisipavlive']:checked").val();
	var onvifavlive=$("input[name='onvifavlive']:checked").val();
	var gb28181avlive=$("input[name='gb28181avlive']:checked").val();
	var memorymode=$("input[name='memorymode']:checked").val();
	var osdpicsource=$("input[name='osdpicsource']:checked").val();
	var tccontrol=$("input[name='tccontrol']:checked").val();
	var g_limit = $("#limit").val();
	if(!CheackServerIDIntNum(g_limit,'limitTips','Mlimit',Number(g_limitmin),Number(g_limitmax)))
	{ 
		return;
	};
	var aecsupport=$("input[name='aecsupport']:checked").val();
	var dynamicosdsupport=$("input[name='dynamicosd']:checked").val();
	var capdenoiseopt = $('#capdenoiseopt').val();
	var decdenoiseopt = $('#decdenoiseopt').val();
	var szXml = "<advanceinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	if (kedavsiptimestamp!=undefined){
		szXml += "<kedavsiptimestamp>"+kedavsiptimestamp+"</kedavsiptimestamp>";
	}
	if (kedavisipavlive!=undefined){
		szXml += "<kedavsipavalive>"+kedavisipavlive+"</kedavsipavalive>";
	}
	if (onvifavlive!=undefined){
		szXml += "<onvifavalive>"+onvifavlive+"</onvifavalive>";
	}
	if (gb28181avlive!=undefined){
		szXml += "<gb28181avalive>"+gb28181avlive+"</gb28181avalive>";
	}
	if (osdpicsource!=undefined){
		szXml += "<osdpicsource>"+osdpicsource+"</osdpicsource>";
	}
	if ($("#osdpicfont").val()!=null){
		szXml += "<osdpicfont>"+$("#osdpicfont").val()+"</osdpicfont>";
	}
	if (tccontrol!=undefined){
		szXml += "<tccontrol>"+tccontrol+"</tccontrol>";
	}
	
	if (enablelimit==true){
		szXml += "<limit>"+$("#limit").val()+"</limit>";
	}
	if (aecsupport!=undefined){
		szXml += "<aecsupport>"+aecsupport+"</aecsupport>";
	}
	if (dynamicosdsupport!=undefined){
		szXml += "<dynamicosdsupport>"+dynamicosdsupport+"</dynamicosdsupport>";
	}
	if (capdenoiseopt!=null){
		szXml += "<capdenoise audiosource='"+denoise_audiosource+"'>"+capdenoiseopt+"</capdenoise>";
	}
	if (decdenoiseopt!=null){
		szXml += "<decdenoise audiosource='"+decdenoise_audiosource+"'>"+decdenoiseopt+"</decdenoise>";
	}
 	szXml += "</advanceinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/advanced"
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
			$(xmlDoc).find("statuscode").each(function(i){ 
				var state= $(this).text();
				 if("0" == state)	//OK
				 {
					if (g_aacenable!=false || g_modeenable!=false){
						SetSysMtcf();
					}
					else
					{
						szRetInfo = m_szSuccessState+m_szSuccess1;
						$("#AdvanceSaveTips").html(szRetInfo);
						setTimeout(function(){$("#AdvanceSaveTips").html("");},5000);  //5秒后自动清除
					}
				 }
				 else if("3" == state)
				 {
					$.cookie('authenticationinfo',null);
					$.cookie('page',null);
					$.cookie('UserNameLogin',null)
					$.cookie('UserPassLogin',null);
					$.cookie('curpage',null);
					$.cookie('anonymous',null);
					$.cookie('VersionSession',null);
					top.location.href = "/";
				 }
				 else
				 {
					szRetInfo=  m_szErrorState+m_szError1;
					$("#AdvanceSaveTips").html(szRetInfo);
					 setTimeout(function(){$("#AdvanceSaveTips").html("");},5000);  //5秒后自动清除
				 }
				 
				});
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr);
		}
	});
};

//保存工作模式
function SetSysMtcf(){
	var aacmode=$("input[name='advancedmtcf']:checked").val();
	var modechange=$("#modechange").val();
	var szXml = "<mtcfinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	if (g_modetext!=false)
	{
		szXml += "<mode>"+modechange+"</mode>";
	}
	if (g_aactext!=false)
	{
		szXml += "<aac>"+aacmode+"</aac>";
	}
 	szXml += "</mtcfinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/mtcf"
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
			 $(xmlDoc).find("statuscode").each(function(i){ 
				 var state= $(this).text();
				 if("0" == state)	//OK
				 {
					 szRetInfo = m_szSuccessState+m_szSuccess1;
				 }
				 else if("3" == state)
				 {
					$.cookie('authenticationinfo',null);
					$.cookie('page',null);
					$.cookie('UserNameLogin',null)
					$.cookie('UserPassLogin',null);
					$.cookie('curpage',null);
					$.cookie('anonymous',null);
					$.cookie('VersionSession',null);
					top.location.href = "/";
				 }
				 else
				 {
					szRetInfo=  m_szErrorState+m_szError1;
				}
				$("#AdvanceSaveTips").html(szRetInfo);
				setTimeout(function(){$("#AdvanceSaveTips").html("");},5000);  //5秒后自动清除
			});
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj);
		}
	});
};

function mtcfhelp_tips(obj){
	if (obj=="aacmode")
	{
	  alert(getNodeValue('Mvideodelay')+'\r\n'
	  +"1、"+getNodeValue('Mnoisereduction3D')+'\r\n'
	  +"2、"+getNodeValue('MImagemasking')+'\r\n'
	  +getNodeValue('MNormalmode')+":"+getNodeValue('MNodelayoptimization')+'\r\n'
	  +getNodeValue('MForcedlowdelaymodel')+":"+getNodeValue('MForcedclose3D')+'\r\n'
	  +getNodeValue('MautoLowdelaymodel')+":"+getNodeValue('MForcedclose3D2')+'\n'
	  )
	}
	else if(obj=="mtcfmode")
	{
		alert(getNodeValue('MhdsdiTips')+'\r\n'
		  +getNodeValue('MhdsdiTips1')+'\n'
	  )
	}
};
/*************************************************
Function:		OnlyNumbers
Description:	只能输入数字
Input:			无			
Output:			无
return:			无				
*************************************************/
function OnlyNumbers(e){
	var keyIsNum = true;
	var keynum;
	if(window.event) // IE
	{
		keynum = e.keyCode
		if (!((keynum>=48&&keynum<=57)  || (keynum>=96&&keynum<=105)  || ( keynum==8 )||(keynum==46)||(keynum==37)||(keynum==39)||(keynum==13)||(keynum==229) ))
			 {
		   keyIsNum = false;
		}
		else
		{
		   keyIsNum = true;
		}
	}
	else if(e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which
		if (!((keynum>=48&&keynum<=57)  || (keynum>=96&&keynum<=105)  || ( keynum==8 )||(keynum==46)||(keynum==37)||(keynum==39)||(keynum==13)||(keynum==229) ))
		 {
			   keyIsNum = false;
		}
		else
		{
		   keyIsNum = true;
		}
	}
	return keyIsNum;
};
