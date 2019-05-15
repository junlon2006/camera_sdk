//osdset.xml
var osdset = {
	tabs: null	// 保存网络配置页面的tabs对象引用
};

function OsdSet() {
	SingletonInheritor.implement(this);
	//this.initCSS();	
}
SingletonInheritor.declare(OsdSet);
pr(OsdSet).update = function() {
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["osdset", "Osdcurplugin"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	
	
	initOSDKD();
	
};
/*************************************************
Function:		initOSDKD
Description:	初始化OSD
Input:			无			
Output:			无
return:			无				
*************************************************/
function initOSDKD(){
	if(document.all)
	   {
			 $("#mainplugin").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="pluginOSD"  width="100%" height="100%" ></object>')
		   }
	   else
		   {
			$("#mainplugin").html('<embed id="pluginOSD" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
		  }
		  
   Plugin();
   if (m_PreviewOCX!=null)
   {
	   plugin= top.parent.document.getElementById("IpcCtrl")
	   var pluginOSD=document.getElementById("pluginOSD")
	     pluginOSD.setPluginType("osdset");
	    var videosourceid=1
	   
	   if ($.cookie('authenticationinfo')==null || $.cookie('authenticationinfo')==''){
			//alert("匿名")
			var ret=pluginOSD.eventWebToPlugin("osdoper","initosdsetdlg",camera_hostname,camera_port.toString(),videosourceid.toString(),''); //开始播放
			//alert("过插件")
		}else{
			//alert("用户")
		    var ret=pluginOSD.eventWebToPlugin("osdoper","initosdsetdlg",camera_hostname,camera_port.toString(),videosourceid.toString(),$.cookie('authenticationinfo'));  //开始播放	
		 //  alert("过用户")
		}
		
		
		//ChangeLanguage(parent.translator.szCurLanguage);
		pluginOSD.eventWebToPlugin("changelanguage",parent.translator.szCurLanguage)
		loadBackPlay(document.getElementById("pluginOSD"));
   }
   
	autoResizeIframe();
};

/*************************************************
Function:		SaveOsdSet
Description:	保存OSD
Input:			无			
Output:			无
return:			无				
*************************************************/
function SaveOsdSet(obj){
	var videosourceid=1
	var SvarState=document.getElementById("pluginOSD").eventWebToPlugin("osdoper","saveosd",camera_hostname,videosourceid);
	if("true" == SvarState)	//OK
		{
			szRetInfo = m_szSuccessState+m_szSuccess1;
		}else{
			szRetInfo=  m_szErrorState+m_szError1;
		}
	$("#SetResultTipsOsdSet").html(szRetInfo);
	setTimeout(function(){$("#SetResultTipsOsdSet").html("");},5000);  //5秒后自动清除
};


function curplugin() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(curplugin);
pr(curplugin).update = function() {
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["osdset", "Osdcurplugin"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	GetCurplugin();
}

/*************************************************
Function:		GetCurplugin
Description:	动态内容插件
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetCurplugin(){
    var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/osd/plugininfo";
	//var szURL=m_lHttp+camera_hostname+":"+camera_port+"/osd.xml";
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
			 
			 m_RefreshOsdXml=xmlDoc;
		     RefreshOsdXML()
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		
	});
   
};
function osdselect(){
	var g_osdselect=$("#osdselect").val();
	//RefreshOsdXML()
	$("#spanosd").empty();
	 $(m_RefreshOsdXml).find("pluginlist").each(function(i){ 
			    var g_lplugin = $(this).find("plugin").length;
				// console.log($(this).find("plugin").length)
				for (var i=0;i<g_lplugin;i++)
				{
				  var g_pluginname = $(this).find("pluginname").eq(i).text();
				  
					  if (g_pluginname==g_osdselect)
					  {
					    
						 var g_examples=$(this).find("examples").attr('size');
						 for (k=0;k<g_examples;k++)
						 {
							 var tt=$(this).find("examples").eq(i).find("line").eq(k).text();
							 $("#spanosd").append("<span style='width:500px; display:block'>"+tt+"</span>"); 
						}
					  } 
					  
				};//for end
	});
	
	SaveOsd();
	
};
function RefreshOsdXML(){
	//是否启用动态内容插件
			if("true" == $(m_RefreshOsdXml).find('enable').eq(0).text())
		    {
			    $("#Osdenabled").val(true).prop("checked", true);
		    }
			else
			{
				$("#Osdenabled").val(false).prop("checked", false);
			}
			$("#osdselect").empty();
			$("#spanosd").empty();
			var g_plugin=$(m_RefreshOsdXml).find('curplugin').eq(0).text()
			 /*$(m_RefreshOsdXml).find("pluginlist").each(function(i){ 
			    var g_lplugin = $(this).find("plugin").length;
				for (var i=0;i<g_lplugin;i++)
				{
				    var g_pluginname = $(this).find("pluginname").eq(i).text();
				   $("#osdselect").append( "<option value="+g_pluginname+">"+g_pluginname+"</option>")
						var selectCode=document.getElementById("osdselect"); 
						 if(selectCode.options[i].value==g_plugin){  
							selectCode.options[i].selected=true;  
						 } 
					  if (g_pluginname==g_plugin)
					  {
					    
						 var g_examples=$(this).find("examples").attr('size');
						 for (k=0;k<g_examples;k++)
						 {
							 var tt=$(this).find("examples").eq(i).find("line").eq(k).text();
							 $("#spanosd").append("<span style='width:500px; display:block'>"+tt+"</span>"); 
						}
					  }
				};//for end
	    
		 
	}); */
	
	 var g_lplugin =$(m_RefreshOsdXml).find("plugin").length;
	 for (var i=0;i<g_lplugin;i++)
 	 {
			var g_pluginname = $(m_RefreshOsdXml).find("pluginname").eq(i).text();
			$("#osdselect").append( "<option value="+g_pluginname+">"+g_pluginname+"</option>")
			var selectCode=document.getElementById("osdselect"); 
			 if(selectCode.options[i].value==g_plugin){  
				selectCode.options[i].selected=true;  
			 } 
			 
			if (g_pluginname==g_plugin)
			  {
				 var g_examples=$(m_RefreshOsdXml).find("examples").attr('size');
				 for (k=0;k<g_examples;k++)
				 {
					 var tt=$(m_RefreshOsdXml).find("examples").eq(i).find("line").eq(k).text();
					 $("#spanosd").append("<span style='width:500px; display:block'>"+tt+"</span>"); 
				}
			  } 
	  }
	
	
};
function SaveOsd(obj){
   var szXml = "<curplugin version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	  szXml += "<enable>"+$("#Osdenabled").val()+"</enable>"; 
	  szXml += "<plugin>"+$("#osdselect").val()+"</plugin>";  
 	szXml += "</curplugin>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/osd/curplugin"
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
			$("#SetResultTipsosd").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsosd").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj);
			}
	});
};
function osdcheckbox(obj){
   if($(obj).prop("checked"))//选中
   { 
	  $(obj).val(true).prop("checked", true);
	}
	else
	{
	  $(obj).prop("checked", false).val(false);
	}
	SaveOsd();
}


//osd测试
function osdtest(){
    var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	
	 /*var szXml = "<curplugin version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	  szXml += "<plugin>"+$("#osdselect").val()+"</plugin>";  
 	szXml += "</curplugin>";
	var xmlDoc = parseXmlFromStr(szXml);
	*/
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/osd/plugintest";
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
					$("#osdtest").prop("disabled",true)
					//szRetInfo = m_szSuccessState+"保存成功";
			       setTimeout(function (){osdtestnr()},2000)
				  // osdtestnr();
				}
				else
				{
					//szRetInfo=  m_szErrorState+"操作失败"
					 alert(getNodeValue("jsosdtest"));
				}
			});
			
		}
	});
};

//获取测试内容
function osdtestnr(){
    var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/osd/gettestres";
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
			  var g_examples=$(this).find("examples").attr('size');
			  $(xmlDoc).find("examples").each(function(i){ 
			    $("#osdtest").prop("disabled",false)
			     var g_examples=$(this).attr('size');
				 var g_line=""
				 for (i=0;i<g_examples;i++)
				 {
					 g_line+=$(this).find("line").eq(i).text();
					// $("#OsdTestTips").html(g_line)
					 g_line+="\r\n";
				}
				 alert(g_line)
			});
		},error: function(xhr, textStatus, errorThrown)
		{
				 //返回值为0
				 
			var xmlDoc =xhr.responseText;
			var xmlDocstate = GetparseXmlFromStr(xmlDoc);
			$(xmlDocstate).find("statuscode").each(function(i){ 
		  	   var state= $(this).text();
			   //0、测试失败，请检查线路链接是否正常  
			   if("0" == state )	//OK   //正常  200
				{
					alert(getNodeValue("jsosdtest"));
				}
			  });
				 $("#osdtest").prop("disabled",false);
				 
			}
	});
};
