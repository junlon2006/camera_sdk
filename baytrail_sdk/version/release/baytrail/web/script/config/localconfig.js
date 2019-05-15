
/*************************************************
Function:		LocalConfig
Description:	构造函数，Singleton派生类
Input:			无			
Output:			无
return:			无				
*************************************************/
function LocalConfig() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(LocalConfig);

/*************************************************
Function:		update
Description:	更新本地配置信息
Input:			无			
Output:			无
return:			无				
*************************************************/

pr(LocalConfig).update = function()
{
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc("localconfig"));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
 Plugin();
 initLocalConfig();
 initLocalGetCap("storage=true");//是否支持PTZ功能
 autoResizeIframe();
}
function initLocalGetCap(obj)
{
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
		 
			
			if($(xmlDoc).find("storage").length > 0){
				$(xmlDoc).find("storage").each(function(i){ 
					if($(this).text()!="true")
					{
						$("#diDownParams").hide();
						$("#subPlaybacksnapshot").hide();
					}else{
						$("#diDownParams").show();
						$("#subPlaybacksnapshot").show();
					}
				});
			}	
			
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
function initLocalConfig(){
	//console.log(m_PreviewOCX)
	if (m_PreviewOCX==null){
		$( "#slider-reduction" ).slider({
		  range: "min",
		  value: 1,
		  min: 1,
		  max: 4,
		  slide: function( event, ui ) {
			$("#reduction_value").val(ui.value);
		  },
		change: function( event, ui ) {
		  }});
		return
	}
	
	var plugin=window.parent.document.getElementById("IpcCtrl");
    var Getslider=plugin.eventWebToPlugin("getSettings","playparam","denoiselevel");
	$("#reduction_value").val(Getslider).attr('maxlength',1);
	$( "#slider-reduction" ).slider({
		  range: "min",
		  value: Getslider,
		  min: 1,
		  max: 4,
		  slide: function( event, ui ) {
			$("#reduction_value").val(ui.value);
		  },
		change: function( event, ui ) {
		  }
		});
	if($.browser.msie) {
			$('#reduction_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#reduction_value").val()))
					{
						  $("#reduction_value").val($( "#slider-reduction" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#reduction_value").val()) < 1 || parseInt($("#reduction_value").val()) > 4 ){
						 $("#reduction_value").val($( "#slider-reduction" ).slider( "value" ))
					}
					else
					{
						$("#slider-reduction").slider( "value", $("#reduction_value").val() );
					}
			  }
			});
		};
		$( "#reduction_value" ).change(function() {
			if (!CheackOnlyNum($("#reduction_value").val()))
			{
				  $("#reduction_value").val($( "#slider-reduction" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#reduction_value").val()) < 1 || parseInt($("#reduction_value").val()) > 4 ){
				 $("#reduction_value").val($( "#slider-reduction" ).slider( "value" ))
			}
			else
			{
				$("#slider-reduction").slider( "value", $("#reduction_value").val() );
			}
		});
		
		
	
	var objradio=plugin.eventWebToPlugin("getSettings", "playparam", "protype" ); 
		if (objradio=="1"){
		 $("input[name='ProtocolType'][value='1']").prop("checked",true); 
		}else{
			$("input[name='ProtocolType'][value='2']").prop("checked",true); 
		}
	
	//plugin.eventWebToPlugin("getSettings", "playparam",  "performance");  //性能
	var objradioraNetsPreach=plugin.eventWebToPlugin("getSettings", "playparam",  "performance"); 
	if (objradioraNetsPreach=="1"){
		 $("input[name='performance'][value='1']").prop("checked",true); 
		 //$("#upd").attr("checked",true); 
		}else if(objradioraNetsPreach=="2"){
			$("input[name='performance'][value='2']").prop("checked",true); 
		}else{
			$("input[name='performance'][value='3']").prop("checked",true); 
		}
	
	//plugin.eventWebToPlugin("getSettings", "playparam", "denoise");  //启用图像  //0-false 1-true
	var g_ReductionCheck=plugin.eventWebToPlugin("getSettings", "playparam",  "denoise"); 
	if (g_ReductionCheck=="true")
	{
		$("#ReductionCheck").val(true).prop("checked", true);
		$("#slider-reduction").slider('enable');	 //禁用拖动条
		$("#reduction_value").prop("disabled", false);
	}
	else
	{
		$("#ReductionCheck").val(false).prop("checked", false);
		$("#slider-reduction").slider('disable')	 //禁用拖动条
		$("#reduction_value").prop("disabled", true);
	}
			
	var 	Imglevel= plugin.eventWebToPlugin("getSettings", "playparam", "denoiselevel" );
	
	//plugin.eventWebToPlugin("getSettings", "playparam", "vb");  //同步   /0-false 1-true
	var verticalsync=plugin.eventWebToPlugin("getSettings", "playparam", "vb");  //同步   /0-false 1-true
	//alert(verticalsync)
	if (verticalsync=="true"){
				$("#Verticalsync").val(true).prop("checked", true);
			}else{
				$("#Verticalsync").val(false).prop("checked", false);
			}
			
	//获取状态
	var videodecstate=plugin.eventWebToPlugin("getSettings", "playparam", "videodecstate")
	if (videodecstate=="true")
	{
	 	$("#videodecstate").val(true).prop("checked", true);
	}
	else
	{
		$("#videodecstate").val(false).prop("checked", false);
	}		
			
	
	//plugin.eventWebToPlugin("getSettings", "recfile",  "recsize");  //打包
	var raAgreementTypesize=plugin.eventWebToPlugin("getSettings", "recfile",  "recsize");  //打包
	
	if (raAgreementTypesize=="1"){
		 $("input[name='raAgreementTypesize'][value='1']").prop("checked",true); 
		 //$("#upd").attr("checked",true); 
		}else if(raAgreementTypesize=="2"){
			$("input[name='raAgreementTypesize'][value='2']").prop("checked",true); 
		}else{
			$("input[name='raAgreementTypesize'][value='3']").prop("checked",true); 
		}
	
	
	$("#teRecpath").val(plugin.eventWebToPlugin("getSettings", "recfile", "recpath" ));
   	$("#teDownloadPath").val(plugin.eventWebToPlugin("getSettings", "recfile", "playpath"));
   	$("#tePreviewPicPath").val(plugin.eventWebToPlugin("getSettings", "pic",  "localpicpath"));
 	$("#teRecordPath").val(plugin.eventWebToPlugin("getSettings", "pic", "pupicpath"));
	$("#tePlaybackFilePath").val(plugin.eventWebToPlugin("getSettings", "pic", "playbackpath"));
	$("#teilePath").val(plugin.eventWebToPlugin("getSettings", "pic", "playbackvideopath"));
	
}
/***
启用图像降噪 控制降嗓等级是否可用
****/
function ReductionBox(obj)
{
	if($(obj).prop("checked"))//选中
	{ 
	  $(obj).val("true");
	  $("#slider-reduction").slider('enable');	 //禁用拖动条
	  $("#reduction_value").prop("disabled", false);
	}
	else
	{
	   $(obj).val("false");
	   $("#slider-reduction").slider('disable');	 //禁用拖动条
	   $("#reduction_value").prop("disabled", true);
	}
}
function Checkbtt(){
	var brightnl=$("#reduction_value").text()
	
};
function SaveConfigLocal(){
	
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips; //请安装插件
		$("#SetResultTipsConfigLocal").html(szRetInfo);
		setTimeout(function(){$("#SetResultTipsConfigLocal").html("");},5000);  //5秒后自动清除
		return;
	}
	
	
	var plugin=window.parent.document.getElementById("IpcCtrl");
	
			
	
	
	
	var teRecordPath=$("input[name='ProtocolType']:checked").val(); 
	plugin.eventWebToPlugin("setSettings", "playparam", "protype", teRecordPath );
   var performance=$("input[name='performance']:checked").val(); 
   plugin.eventWebToPlugin("setSettings", "playparam", "performance", performance );
	
	//plugin.eventWebToPlugin("setSettings", "playparam", "denoiseenable", "true" );
	
	plugin.eventWebToPlugin("setSettings", "playparam",  "denoise", $("#ReductionCheck").val()); 
	
	//降嗓等级
    var levelsideChage=$("#slider-reduction" ).slider( "value" )
	plugin.eventWebToPlugin("setSettings","playparam","denoiselevel",levelsideChage.toString());
		
		
		
	var Verticalsync=$("#Verticalsync").val();	
	plugin.eventWebToPlugin("setSettings", "playparam", "vb", Verticalsync );
	
	//设置状态
	plugin.eventWebToPlugin("setSettings", "playparam", "videodecstate", $("#videodecstate").val() );
	
	var recsize=$("input[name='raAgreementTypesize']:checked").val(); 
	plugin.eventWebToPlugin("setSettings", "recfile", "recsize", recsize );
	plugin.eventWebToPlugin("setSettings", "recfile", "recpath", $("#teRecpath").val() );
	plugin.eventWebToPlugin("setSettings", "recfile", "playpath", $("#teDownloadPath").val());
	plugin.eventWebToPlugin("setSettings", "pic", "localpicpath", $("#tePreviewPicPath").val() );
	plugin.eventWebToPlugin("setSettings", "pic", "pupicpath", $("#teRecordPath").val() );
	plugin.eventWebToPlugin("setSettings", "pic", "playbackpath", $("#tePlaybackFilePath").val() );
	var ret=plugin.eventWebToPlugin("setSettings", "pic", "playbackvideopath", $("#teilePath").val());
	 if(ret == "true")	//OK
		{
			szRetInfo = m_szSuccessState+m_szSuccess1;
		}else{
			szRetInfo=  m_szErrorState+Error1;
		}
	$("#SetResultTipsConfigLocal").html(szRetInfo);
	setTimeout(function(){$("#SetResultTipsConfigLocal").html("");},5000);  //5秒后自动清除
   
};
function ReductionCheck(){
   	
}
function browseFilePath(szId){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;  //请安装插件	
		$("#SetResultTipsConfigLocal").html(szRetInfo);
		setTimeout(function(){$("#SetResultTipsConfigLocal").html("");},5000);  //5秒后自动清除
		return;
	}
	var szFileName=window.parent.document.getElementById("IpcCtrl").eventWebToPlugin("SelectForder")
	if (szFileName!=""){
		$("#"+szId).val(szFileName)
	}
}
function downplugin(){
	window.open("../IPCWebSetup.exe","_self");
};


