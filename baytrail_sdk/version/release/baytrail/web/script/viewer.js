var m_szBrowser = navigator.appName; //获取浏览器名称
var g_lxdPreview = null; // Preview.xml
var m_iBrowserHeight=0;//高度
var m_ContentWidth=0;  //宽度
var m_iWndType = 0;  //浏览界面
var m_audiodec = false;  //是否支持音频解码
var m_audioenc = false;  //是否支持音频编码
var m_viewaudio= null;
var m_infrace =0; //0 开关灯 1红外灯
//var m_iPtzMode=null;  //PTZ 0显示 1隐藏

var m_bChannelRecord = 0;   //1、播放  2、暂停 2、继续
var m_bTalk = 0;   //是否正在呼叫
var m_Record=0;   //是否录像
var m_soundsideChage=0;   //音量
var m_TalksideSound=0;   //呼叫音量
var m_bSound = true;  //正常
var m_VideoState=0;
var m_lHttp="http://";
var szRetInfo="";
var UserNameLogin=$.cookie('UserNameLogin');   //
var UserPassLogin=$.cookie('UserPassLogin');   //
var m_bStartPTZ = false;
var m_ePTZ = 0;   // 0为无状态,1为ePTZ,2为PTZ
var m_nShowMode = 0;  // 0,自适应， 1、4:3; 2，16:9 3、1:1 
var m_bHorScan = 0;   // 水平巡航
var m_bWiper = 0;  //雨刷
var m_anonymous=$.cookie('anonymous');
var m_anonymousRecord=0;
var m_PluginWH=null;
var m_iPTZ=0;  //0 PTZ支持
var m_ibrightness=0; // 是否支持图像调节
var m_ChangeSize=true;  //PTZ面板是否点击 true 可点击
var isDevSnapPic="flase";  //前端抓拍是否支持 
/*************************************************
Function:		Load_viewer
Description:	初始化预览界面
Input:			无
Output:			无
return:			无
*************************************************/
function Load_viewer(){
 
 ChangeLanguage(parent.translator.szCurLanguage);	
 window.parent.ChangeMenu(1);
 
 if(document.all)
 {
	document.getElementById("mainplugin").innerHTML ='<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="plugin0" width="100%" height="100%" ></object>';
 }
 else
 {
	document.getElementById("mainplugin").innerHTML = '<embed type="application/x-ipcwebui" id = "plugin0" width="100%" height="100%"></embed>';
 }
 Plugin();
	if (m_PreviewOCX!=null){
		top.parent.$("#PluginWeb").html(top.document.getElementById("IpcCtrl").getPluginVersion())
		document.getElementById("plugin0").setPluginType("videoview");
		document.getElementById("plugin0").eventWebToPlugin("changelanguage",parent.translator.szCurLanguage);
		loadBackPlay(document.getElementById("plugin0"));
		var videodecstate=document.getElementById("plugin0").eventWebToPlugin("getSettings", "playparam", "videodecstate")
		isDevSnapPic=document.getElementById("plugin0").eventWebToPlugin("view","isDevSnapPic",camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'));  //是否显示前端抓拍
		if (videodecstate=="true")
		{
			$("#videodecstate").show();
		}
		else
		{
			$("#videodecstate").hide();
		};
		if (isDevSnapPic=="true")
		{
			$("#isDevSnapPic").show()
		}
		else
		{
			$("#isDevSnapPic").hide()
		}	
	}
   /*
	brightness  是否支持图像调节
	audiodec   音频解码
	audioenc   音频编码
	videosourcenum 视频源个数
	*/
   InitViewerGetCap("ptz=true&brightness=true&audiodec=true&audioenc=true&videosourcenum=true");
 //初始化预置点
  InitPreset();
 // GetPresetName();
 //InitPresetList();
	
	$( "#slider_vertical" ).slider({
	orientation: "vertical",
	range: "min",
	min: 1,
	max: 100,
	value: 50,
	slide: function( event, ui ) {
		$("#vertical_value").text(ui.value);
	},change: function( event, ui ) {
			$("#vertical_value").text($( "#slider_vertical" ).slider( "value" ))
		 }});
 	$("#vertical_value").text($( "#slider_vertical" ).slider( "value" ))
	
	 $( "#slider_sound" ).slider({
      range: "min",
      value: 50,
      min: 0,
      max: 100,
      slide: function( event, ui ) {
		  m_soundsideChage = ui.value;
      },
	change: function( event, ui ) {
	     m_soundsideChage=ui.value
	     ChangeOpenSound();
      }});
	   m_soundsideChage = $("#slider_sound" ).slider( "value" );
	   
   ptz_hover();
   
   
   //视频底部音量按钮鼠标悬停样式
   
   $(".btnmouseout1").find("div").each(function() {
		var toolbar_id=$(this).attr("class")
        $(this).hover(function () {
			   $(this).addClass(toolbar_id+"_hover");
            },function () {
               $(this).removeClass(toolbar_id+"_hover")
			    $(this).removeClass(toolbar_id+"_down")
            },$(this).mousedown(function (){
				$(this).addClass(toolbar_id+"_down")
			})
        );
    });
		
	 $(".btnmouseout").find("div").each(function() {
		var id=$(this).attr("id")
        $(this).hover(function () {
			   $(this).addClass(id+"_hover");
            },function () {
               $(this).removeClass(id+"_hover")
			    $(this).removeClass(id+"_down")
            },$(this).mousedown(function (){
				$(this).addClass(id+"_down")
			})
        );
    });
	
	 $(".btnmouseoutright").find("div").each(function() {
		//var id=$(this).attr("id")
		var toolbar_id=$(this).attr("class")
        $(this).hover(function () {
			   $(this).addClass(toolbar_id+"_hover");
            },function () {
               $(this).removeClass(toolbar_id+"_hover")
			    //$(this).removeClass(toolbar_id+"_down")
            },$(this).mousedown(function (){
				$(this).addClass(toolbar_id+"_down")
			})
        );
    });
	$(".btnmouseoutrightdown").find("div").each(function() {
		//var id=$(this).attr("id")
		var toolbar_id=$(this).attr("class")
        $(this).hover(function () {
			   $(this).addClass(toolbar_id+"_hover");
            },function () {
               $(this).removeClass(toolbar_id+"_hover")
			   $(this).removeClass(toolbar_id+"_down")
            },$(this).mousedown(function (){
				$(this).addClass(toolbar_id+"_down")
			})
        );
    });
	
	//,$(this).click(function() {
               
               
	//		});
	
	$("#sizetoplug").find("div").each(function() {
		//var id=$(this).attr("id")
		var toolbar_id=$(this).attr("class")
        $(this).hover(function () {
			   $(this).addClass(toolbar_id+"_hover");
            },function () {
               $(this).removeClass(toolbar_id+"_hover")
			   // $(this).removeClass(id+"_down")
            }/*,$(this).mousedown(function (){
				$(this).addClass(toolbar_id+"_down")
			})*/
        );
    });
  
  
    
 // alert("浏览"+"  "+document.getElementById("plugin0").width)
 ptzinfrace();
 GetColor();
 Getscnlist();   //初始化场景列表
 $("body").bind({
		click: function (e) {
			if($("#ulmode").css("display") !== "none") {
				$('#ulmode').hide();
			}
		}
	});	

	$(".scnbutton").bind({
	    click: function (e){
			e.stopPropagation();
			if($("#ulmode").css("display") !== "none") 
			{
				$('#ulmode').hide();
			} 
			else 
			{
				
				$('#ulmode').show();
			}
		}
	});	
}


/*************************************************
Function:		GetColor
Description:	获取图像信息			
*************************************************/
function GetColor(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/color"
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
		     $("#brightness_slider,#constrast_slider,#huelevel_slider,#saturation_slider").unbind("change");
			 $("#brightness_slider,#constrast_slider,#huelevel_slider,#saturation_slider").unbind("keydown");
			$(xmlDoc).find("brightnesslevel").eq(0).each(function(i){
			  var g_szbrightnesslevelmin=Number($(this).attr('min'));	
			  var g_szbrightnesslevelmax=Number($(this).attr('max'));	
		  	  var g_szbrightnesslevel= Number($(this).text());
			  $("#brightness_slider").val(g_szbrightnesslevel).attr('maxlength',$(this).attr('max').length);
			  $("#slider_brightness").slider({
			  range: "min",
			  value: g_szbrightnesslevel,
			  min: g_szbrightnesslevelmin,
			  max: g_szbrightnesslevelmax,
			  slide: function( event, ui ) {
					$("#brightness_slider").val(ui.value);
			  },
			  stop: function( event, ui ) {
					$("#brightness_slider").val($( "#slider_brightness" ).slider( "value" ));
				Setcolor("brightnesslevel");
				  }
			   }); 
			   if($.browser.msie) {
				$('#brightness_slider').keydown(function(e){
					  if(e.keyCode==13)
					  {
						  if (!CheackOnlyNum($("#brightness_slider").val()))
							{
								  $("#brightness_slider").val($( "#slider_brightness" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#brightness_slider").val()) < parseInt(g_szbrightnesslevelmin) || parseInt($("#brightness_slider").val()) > parseInt(g_szbrightnesslevelmax) ){
								 $("#brightness_slider").val($( "#slider_brightness" ).slider( "value" ))
							}
							else
							{
								$("#slider_brightness").slider( "value", $("#brightness_slider").val() );
								Setcolor("brightnesslevel");
							}
					  }
					});
				};
				$( "#brightness_slider" ).change(function() {
					if (!CheackOnlyNum($("#brightness_slider").val()))
					{
						  $("#brightness_slider").val($( "#slider_brightness" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#brightness_slider").val()) < parseInt(g_szbrightnesslevelmin) || parseInt($("#brightness_slider").val()) > parseInt(g_szbrightnesslevelmax) ){
						 $("#brightness_slider").val($( "#slider_brightness" ).slider( "value" ))
					}
					else
					{
						$("#slider_brightness").slider( "value", $("#brightness_slider").val() );
						Setcolor("brightnesslevel");
					}
				});
			});
			$(xmlDoc).find("contrastlevel").each(function(i){ 
			 var g_szcontrastlevelmin=Number($(this).attr('min'));	
			 var g_szcontrastlevelmax=Number($(this).attr('max'));	
		  	 var g_szcontrastlevel= Number($(this).text());
			  $("#constrast_slider").val(g_szcontrastlevel).attr('maxlength',$(this).attr('max').length);
			   $("#slider_constrast").slider({
				  range: "min",
				  value: g_szcontrastlevel,
				  min: g_szcontrastlevelmin,
				  max: g_szcontrastlevelmax,
				  slide: function( event, ui ) {
					$("#constrast_slider").val(ui.value);
				  },
				  stop: function( event, ui ) {
					$("#constrast_slider").val($( "#slider_constrast" ).slider( "value" ));
					Setcolor("contrastlevel");
				  }
				});
				
				if($.browser.msie) {
				$('#constrast_slider').keydown(function(e){
					  if(e.keyCode==13)
					  {
						  if (!CheackOnlyNum($("#constrast_slider").val()))
							{
								  $("#constrast_slider").val($( "#slider_constrast" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#constrast_slider").val()) < parseInt(g_szcontrastlevelmin) || parseInt($("#constrast_slider").val()) > parseInt(g_szcontrastlevelmax) ){
								 $("#constrast_slider").val($( "#slider_constrast" ).slider( "value" ))
							}
							else
							{
								$("#slider_constrast").slider( "value", $("#constrast_slider").val() );
								Setcolor("contrastlevel");
							}
					  }
					});
				};
				$( "#constrast_slider" ).change(function() {
					if (!CheackOnlyNum($("#constrast_slider").val()))
					{
						  $("#constrast_slider").val($( "#slider_constrast" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#constrast_slider").val()) < parseInt(g_szcontrastlevelmin) || parseInt($("#constrast_slider").val()) > parseInt(g_szcontrastlevelmax) ){
						 $("#constrast_slider").val($( "#slider_constrast" ).slider( "value" ))
					}
					else
					{
						$("#slider_constrast").slider( "value", $("#constrast_slider").val() );
						Setcolor("contrastlevel");
					}
				});
			});
			$(xmlDoc).find("saturationlevel").each(function(i){ 
			 var g_szsaturationlevelmin=Number($(this).attr('min'));	
			 var g_szsaturationlevelmax=Number($(this).attr('max'));	
		  	 var g_szsaturationlevel= Number($(this).text());
			  $("#saturation_slider").val(g_szsaturationlevel).attr('maxlength',$(this).attr('max').length);
			  $("#slider_saturation").slider({
					  range: "min",
					  value: g_szsaturationlevel,
					  min: g_szsaturationlevelmin,
					  max: g_szsaturationlevelmax,
					  slide: function( event, ui ) {
						$("#saturation_slider").val(ui.value);
					  },
					stop: function( event, ui ) {
						$("#saturation_slider").val($( "#slider_saturation" ).slider( "value" ));
						Setcolor("saturationlevel");
					  }
				});
				if($.browser.msie) {
				$('#saturation_slider').keydown(function(e)
				 {
					  if(e.keyCode==13)
					  {
						  if (!CheackOnlyNum($("#saturation_slider").val()))
							{
								  $("#saturation_slider").val($( "#slider_saturation" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#saturation_slider").val()) < parseInt(g_szsaturationlevelmin) || parseInt($("#saturation_slider").val()) > parseInt(g_szsaturationlevelmax) ){
								 $("#saturation_slider").val($( "#slider_saturation" ).slider( "value" ))
							}
							else
							{
								$("#slider_saturation").slider( "value", $("#saturation_slider").val() );
								Setcolor("saturationlevel");
							}
					  }
					});
				};
				$( "#saturation_slider" ).change(function()
				 {
					if (!CheackOnlyNum($("#saturation_slider").val()))
					{
						  $("#saturation_slider").val($( "#slider_saturation" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#saturation_slider").val()) < parseInt(g_szsaturationlevelmin) || parseInt($("#saturation_slider").val()) > parseInt(g_szsaturationlevelmax) ){
						 $("#saturation_slider").val($( "#slider_saturation" ).slider( "value" ))
					}
					else
					{
						$("#slider_saturation").slider( "value", $("#saturation_slider").val() );
						Setcolor("saturationlevel");
					}
				});
			});
			$(xmlDoc).find("huelevel").each(function(i){ 
			 var g_szhuelevelmin=Number($(this).attr('min'));	
			 var g_szhuelevelmax=Number($(this).attr('max'));
		  	 var g_szhuelevel= Number($(this).text());
			  $("#huelevel_slider").val(g_szhuelevel).attr('maxlength',$(this).attr('max').length);
			  $("#slider_huelevel").slider({
					  range: "min",
					  value: g_szhuelevel,
					  min: g_szhuelevelmin,
					  max: g_szhuelevelmax,
					  slide: function( event, ui ) {
						$("#huelevel_slider").val(ui.value);
					  },
					stop: function( event, ui ) {
						$("#huelevel_slider").val($( "#slider_huelevel" ).slider( "value" ));
						Setcolor("huelevel");
					  }
				});
				if($.browser.msie) {
				$('#huelevel_slider').keydown(function(e)
				 {
					  if(e.keyCode==13)
					  {
						  if (!CheackOnlyNum($("#huelevel_slider").val()))
							{
								  $("#huelevel_slider").val($( "#slider_huelevel" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#huelevel_slider").val()) < parseInt(g_szhuelevelmin) || parseInt($("#huelevel_slider").val()) > parseInt(g_szhuelevelmax) ){
								 $("#huelevel_slider").val($( "#slider_huelevel" ).slider( "value" ))
							}
							else
							{
								$("#slider_huelevel").slider( "value", $("#huelevel_slider").val() );
								Setcolor("huelevel");
							}
					  }
					});
				};
				$( "#huelevel_slider" ).change(function()
				 {
					if (!CheackOnlyNum($("#huelevel_slider").val()))
					{
						  $("#huelevel_slider").val($( "#slider_huelevel" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#huelevel_slider").val()) < parseInt(g_szhuelevelmin) || parseInt($("#huelevel_slider").val()) > parseInt(g_szhuelevelmax) ){
						 $("#huelevel_slider").val($( "#slider_huelevel" ).slider( "value" ))
					}
					else
					{
						$("#slider_huelevel").slider( "value", $("#huelevel_slider").val() );
						Setcolor("huelevel");
					}
				});
			});
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj,"SaveImages");
		}
	});
};
function Setcolor(obj){
	var szXml = "<colorinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	if (obj=="brightnesslevel")
	{
		szXml += "<brightnesslevel>"+$("#brightness_slider").val()+"</brightnesslevel>";
	}
	else if(obj=="contrastlevel")
	{
		szXml += "<contrastlevel>"+$("#constrast_slider").val()+"</contrastlevel>";
	}
	else if(obj=="saturationlevel")
	{
		szXml += "<saturationlevel>"+$("#saturation_slider").val()+"</saturationlevel>";
	}
	else if(obj=="huelevel")
	{
		szXml += "<huelevel>"+$("#huelevel_slider").val()+"</huelevel>";
	}
 	szXml += "</colorinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/color"
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
						//szRetInfo = m_szSuccessState+getNodeValue('MSuccess');
					}
					else{
						//szRetInfo=  m_szErrorState+getNodeValue('MError');
					}
				});
			 
			//$("#SetTipsImage").html(szRetInfo);
			//setTimeout(function(){$("#SetTipsImage").html("");},2000);  //2秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};

//获取红外灯
function ptzinfrace(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/infrace"
	//var szURL=m_lHttp+camera_hostname+":"+camera_port+"/infrace.xml"
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
			
			$(xmlDoc).find("mode").each(function(i){ 
		  	 	var g_szinfracemode= $(this).text();
			}); 
			 
			$(xmlDoc).find("ctrlmode").each(function(i){ 
		  	 	var g_szctrlmodeopt= $(this).attr('opt');
				var g_szctrlmode= $(this).text();
				if (g_szctrlmode=="openclose")
				{
					$("#ptz_light").attr("title", parent.translator.translateNode(g_lxdPreview, 'Mlight'));//开灯
					$("#ptz_mist").attr("title", parent.translator.translateNode(g_lxdPreview, 'Mmist')); //关灯
					$('#ptz_light').unbind().bind('click', function() {
		  				 SetIrClick('ir_set', 'open')
					});	
					$('#ptz_mist').unbind().bind('click', function() {
		  				 SetIrClick('ir_set', 'close')
					});
					m_infrace=0;
				}
				else
				{
					$("#ptz_light").attr("title", parent.translator.translateNode(g_lxdPreview, 'Maddlight'));//加亮红外灯
					$("#ptz_mist").attr("title", parent.translator.translateNode(g_lxdPreview, 'Msubmist')); //减弱红外灯
					$('#ptz_light').unbind().bind('click', function() {
		  				 SetIrClick('infrare', 'add')
					});	
					$('#ptz_mist').unbind().bind('click', function() {
		  				 SetIrClick('infrare', 'sub')
					});
				  m_infrace=1;
				}
			}); 
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
function InitViewerGetCap(obj){
	
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
			//解码
			if($(xmlDoc).find("audiodec").length > 0){
				$(xmlDoc).find("audiodec").each(function(i){ 
					if($(this).text()!="true")
					{
						$("#Talksub").hide();
					}
					else
					{
						m_audiodec=true;
						$("#Talksub").show();
						$( "#talk_slider_sound").slider({
						  range: "min",
						  value: 50,
						  min: 0,
						  max: 100,
						  slide: function( event, ui ) {
							  m_TalksideSound = ui.value;
						  },
						change: function( event, ui ) {
						    m_TalksideSound=ui.value
							document.getElementById("plugin0").eventWebToPlugin("view","callvolume",m_TalksideSound.toString());
						  }
						});  
					}
				});
			}
			//编码
			if($(xmlDoc).find("audioenc").length > 0){
				$(xmlDoc).find("audioenc").each(function(i){ 
					if($(this).text()!="true")
					{
						$("#subsound").hide();
					}
					else
					{
						m_audioenc=true;
						$("#subsound").show();
					}
				});
			};	
			
			/*是否支持PTZ面板*/
			if($(xmlDoc).find("ptz").length > 0){
				$(xmlDoc).find("ptz").each(function(i){ 
					if (Number($.cookie('m_iPtzMode'))=="" ||  Number($.cookie('m_iPtzMode'))==null)
					{
						$.cookie('m_iPtzMode',0);
					}
					else
					{
						m_iPtzMode = $.cookie('m_iPtzMode');
					}
                     
					 
					if($(this).text()!="true")  //不支持
					{
						  m_iPTZ=1;
						  $("#ptz_auto").attr("title", getNodeValue('Mreset')); 
					}
					else   //支持
					{
						 m_iPTZ=0;
						 $("#ptz_auto").attr("title", getNodeValue('Mcruise')); 
					}
				});
			}; //PTZ Panel End
			
			/*是否显示图像调节*/
			if($(xmlDoc).find("brightness").length > 0){
				$(xmlDoc).find("brightness").each(function(i){ 
					if($(this).text()!="true")  //不支持
					{
						$("#subimage").hide();
						$("#subpreset").css({ "border-bottom":"1px solid #d1d1d1" });
						m_ibrightness=1;
					}
					else   //支持
					{
						$("#subimage").show(); 
						m_ibrightness=0;
						$("#subimageadjust").toggle(function() {
							 $(this).removeClass("viewercollapsed").addClass("viewercoll"); 
							 $("#ViewImages").show();
							 if($("#ulmode").css("display") !== "none") {
								$('#ulmode').hide();
							 }
						 },function() {
							$(this).removeClass("viewercoll").addClass("viewercollapsed"); 
							$("#ViewImages").hide();
							if($("#ulmode").css("display") !== "none") {
								$('#ulmode').hide();
							}
						 });
					}
				});
			}; //PTZ Panel End
			
			if (m_iPTZ==0  ||  m_ibrightness==1)//支持PTZ
			{
				$("#subPTZPanel").show();
				 $("#subpreset").show();
				 
				 $("#subPTZPanel").toggle(function() {
					 $(this).removeClass("viewercoll").addClass("viewercollapsed"); 
					 $("#PTZ_Panel").hide();
					 if($("#ulmode").css("display") !== "none") {
						$('#ulmode').hide();
					 }
				 },function() {
					$(this).removeClass("viewercollapsed").addClass("viewercoll"); 
					$("#PTZ_Panel").show();
					if($("#ulmode").css("display") !== "none") {
						$('#ulmode').hide();
					}
				 });
				 
				 
				 $("#subpreset").toggle(function() {
					 $(this).removeClass("viewercoll").addClass("viewercollapsed"); 
					 $("#preset_yzw").hide();
					 if($("#ulmode").css("display") !== "none") {
						$('#ulmode').hide();
					}
				 },function() {
					$(this).removeClass("viewercollapsed").addClass("viewercoll"); 
					$("#preset_yzw").show();
					if($("#ulmode").css("display") !== "none") {
						$('#ulmode').hide();
					}
				 });
			}
			else if (m_iPTZ==1)
			{
				 $("#subPTZPanel").removeClass("viewercoll").addClass("viewercollapsed");
				 $("#PTZ_Panel").hide();
				 $("#subpreset").removeClass("viewercoll").addClass("viewercollapsed");
				 $("#preset_yzw").hide();
				 $("#subimageadjust").removeClass("viewercollapsed").addClass("viewercoll");
				 $("#ViewImages").show();
				 $("#subPTZPanel").toggle(function() {
					 $(this).removeClass("viewercollapsed").addClass("viewercoll"); 
					 $("#PTZ_Panel").show();
					 if($("#ulmode").css("display") !== "none") {
						$('#ulmode').hide();
					}
				 },function() {
					$(this).removeClass("viewercoll").addClass("viewercollapsed"); 
					$("#PTZ_Panel").hide();
					if($("#ulmode").css("display") !== "none") {
						$('#ulmode').hide();
					}
				 });
				 
				 $("#subpreset").toggle(function() {
					 $(this).removeClass("viewercollapsed").addClass("viewercoll"); 
					 $("#preset_yzw").show();
					 if($("#ulmode").css("display") !== "none") {
							$('#ulmode').hide();
						}
				 },function() {
					$(this).removeClass("viewercoll").addClass("viewercollapsed"); 
					 $("#preset_yzw").hide();
					 if($("#ulmode").css("display") !== "none") {
						$('#ulmode').hide();
					}
				 });
			};
			
			
			
			
		autoSize();	
		initmultivideo();   //获取视频码流路数
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr);
		}
	});
}
/*************************************************
Function:		LastPage
Description:	主页面加载时，获取cookie，跳转到刷新前的界面
Input:			无
Output:			无
return:			无				
*************************************************/
function LatestPage()
{
	var curpage = $.cookie('page');
	if(null == curpage)
	{
		ChangeFrame("../view/viewer.htm"+ (new Date()).getTime(),1);
	}else
	{
		ChangeFrame(curpage.split("%")[0],curpage.split("%")[1]);
	}
}

/*************************************************
Function:		autoSize
Description:	高度自适应
Input:			无			
Output:			无
return:			无				
*************************************************/ 
function autoSize() {
 	 m_iBrowserHeight = Number(parent.document.documentElement.clientHeight);  //高
	 m_iPtzMode=Number($.cookie('m_iPtzMode'));
	 if (m_iWndType === 0) //浏览界面
	 {
		 if(m_nShowMode==0 || m_nShowMode==1  ||  m_nShowMode==2)  //0为自适应  1为4:3 2为16:9   1:1时不随浏览器大小而改变
		 {
			 if (m_iBrowserHeight <= 722)    //722刚好没有滚动条  距离底留有25px的高度
			 {
				m_iBrowserHeight=620;
				m_ContentWidth=960;
				parent.$("#head_top").width(m_ContentWidth)
				parent.$("#menu").width(m_ContentWidth)
				top.parent.$("#maindevicetype").width(m_ContentWidth);
				if (m_ibrightness==1)//不支持图像调节 预置位长度改变
				{
					$("#preset_yzw,#PTZ_Preset").height(m_iBrowserHeight-281);
				}
				else
				{
					 $("#preset_yzw,#PTZ_Preset").height(m_iBrowserHeight-500);
				}
				if ($.cookie('anonymous')=="anonymous")
				{
					  if (m_iPTZ==1)
					  {
						  ChangeIsShow('hide')
					     SizePTZHideSmall(); 
					     m_ChangeSize=false; 
					  }
					  else
					  {
						  ChangeIsShow('show')
						  SizePTZShowSmall();
					   }
				 }
				 else
				 {
					if(m_iPtzMode === 0)   //PTZ面板显示
					{
						ChangeIsShow('show')
						SizePTZShowSmall();
						
					}//ptz面板显示
					else if (m_iPtzMode === 1)  //PTZ面板隐藏
					{
					   ChangeIsShow('hide')
					   SizePTZHideSmall();  //隐藏小于722
					}//PTZ面板隐藏 
				 }
				
			 }//<=722 end
			 else //>722
			 {
				 m_ContentWidth=(parseInt(((m_iBrowserHeight-100)*16)/9))-160;
				 parent.$("#head_top").width(m_ContentWidth)
				 parent.$("#menu").width(m_ContentWidth)
	             top.parent.$("#maindevicetype").width(m_ContentWidth);
				 if (m_ibrightness==1)//不支持图像调节 预置位长度改变
				 {
					$("#preset_yzw,#PTZ_Preset").height(m_iBrowserHeight-394);
				 }
				 else
				 {
					 $("#preset_yzw,#PTZ_Preset").height(m_iBrowserHeight-612);
				 }
				 if ($.cookie('anonymous')=="anonymous")
				 {
					  if (m_iPTZ==1)
					  {
						 ChangeIsShow('hide')
						 SizePTZHideBig();
					     m_ChangeSize=false; 
					  }
					  else
					  {
						  ChangeIsShow('show')
						  SizePTZShowBig();
					  }
				 }
				 else 
				 {
					 if(m_iPtzMode === 0)   //PTZ面板显示
					 {
						ChangeIsShow('show')
						SizePTZShowBig();
					 }//PTZ面板显示
					 else if(m_iPtzMode === 1)   ////PTZ面板隐藏
					 {
						ChangeIsShow('hide')
						SizePTZHideBig();
					 }////PTZ面板隐藏
				 }
			 }//>722 end
			 
		 }//0 1 2 end
	 }//viewer end
};

//匿名情况下窗口改变
function ChangeAnonymou(){
   $("#viewer_left").hide();
   $("#menubar").removeClass().addClass("menubar_close");
};
//ptz显示大于722
function SizePTZShowBig(){
   m_iBrowserHeight = Number(parent.document.documentElement.clientHeight);
   m_ContentWidth=(parseInt(((m_iBrowserHeight-100)*16)/9))-160;
   parent.$("#content").height(m_iBrowserHeight-126).width(m_ContentWidth);
   $("#container").removeClass().addClass("container_show").width(m_ContentWidth-2).height(m_iBrowserHeight - 138);
   $("#contentright").removeClass().addClass("viererright").height(m_iBrowserHeight-138).width(m_ContentWidth-199);
   $("#mainplugin").height(m_iBrowserHeight-200).width(m_ContentWidth-201);
};

//ptz隐藏大于722
function SizePTZHideBig(){
	m_iBrowserHeight = Number(parent.document.documentElement.clientHeight);
	m_ContentWidth=(parseInt(((m_iBrowserHeight-100)*16)/9))-160;
	parent.$("#content").height(m_iBrowserHeight-136).width(m_ContentWidth);
	$("#container").removeClass().addClass("container").width(m_ContentWidth-2).height(m_iBrowserHeight - 138);
	$("#contentright").removeClass().addClass("contenter_hide").height(m_iBrowserHeight-48).width(m_ContentWidth-15);
	$("#mainplugin").height(m_iBrowserHeight-200).width(m_ContentWidth-17);
};

//PTZ显示小于722
function SizePTZShowSmall(){
	m_iBrowserHeight=620;
	m_ContentWidth=960;
	//console.log("函数面板显示<722    "+m_iBrowserHeight)
	parent.$("#content").height(m_iBrowserHeight).width(m_ContentWidth);
	$("#container").removeClass().addClass("container_show").width(m_ContentWidth).height(m_iBrowserHeight - 26);
	$("#contentright").removeClass().addClass("viererright").height(m_iBrowserHeight-26).width(m_ContentWidth-195);
	$("#mainplugin").height(m_iBrowserHeight-88).width(m_ContentWidth-197);
};
//PTZ隐藏小于722
function SizePTZHideSmall(){
	m_iBrowserHeight=620;
	m_ContentWidth=960;
   // console.log("函数面板隐藏<722    "+m_iBrowserHeight)
	parent.$("#content").height(m_iBrowserHeight).width(m_ContentWidth);	
	$("#container").removeClass().addClass("container").width(m_ContentWidth-2).height(m_iBrowserHeight-26);
	$("#contentright").removeClass().addClass("contenter_hide").height(m_iBrowserHeight-26).width(m_ContentWidth-14);
	$("#mainplugin").height(m_iBrowserHeight-88).width(m_ContentWidth-16);
};

//PTZ显示1:1 插件小于722
function SizePTZShowX1Small(obj){
	if (obj=="small")
	{
		parent.$("#head_top").width(m_ContentWidth)
	    parent.$("#menu").width(m_ContentWidth)
	    top.parent.$("#maindevicetype").width(m_ContentWidth);
	    parent.$("#content").width(m_ContentWidth).height(parseInt(m_PluginWH[1]) + parseInt(100))
	    $("#container").removeClass().addClass("container_show").width(m_ContentWidth).height(parseInt(m_PluginWH[1]) + parseInt(62));
	    $("#contentright").removeClass().addClass("viererright").width(m_ContentWidth-parseInt(195)).height(parseInt(m_PluginWH[1]) + parseInt(62) );
	    $("#mainplugin").width(m_ContentWidth-parseInt(197)).height(parseInt(m_PluginWH[1]));
	    $("#preset_yzw,#PTZ_Preset").height(parseInt(m_PluginWH[1])-412); 
	}
	else if(obj=="big")
	{
		parent.$("#head_top").width(parseInt(m_PluginWH[0])+parseInt(197));
	    parent.$("#menu").width(parseInt(m_PluginWH[0])+parseInt(197));
	    top.parent.$("#maindevicetype").width(parseInt(m_PluginWH[0])+parseInt(197));
	    parent.$("#content").width(parseInt(m_PluginWH[0])+parseInt(197)).height(parseInt(m_PluginWH[1]) + parseInt(100));
	    $("#container").removeClass().addClass("container_show").width(parseInt(m_PluginWH[0])+parseInt(197)).height(parseInt(m_PluginWH[1]) + parseInt(62));
	    $("#contentright").removeClass().addClass("viererright").width(parseInt(m_PluginWH[0])+parseInt(2)).height(parseInt(m_PluginWH[1]) + parseInt(62));
	    $("#mainplugin").width(parseInt(m_PluginWH[0])).height(parseInt(m_PluginWH[1]));
	    $("#preset_yzw,#PTZ_Preset").height(parseInt(m_PluginWH[1])-412); 
	}
};
/*************************************************
Function:		SizePTZHideX1Small
Description:	PTZ隐藏1:1 插件小于960
Input:			small 插件小于960  big插件大于960 						
*************************************************/
function SizePTZHideX1Small(obj){
	if (obj=="small")
	{
		parent.$("#head_top").width(m_ContentWidth)
	    parent.$("#menu").width(m_ContentWidth)
	    top.parent.$("#maindevicetype").width(m_ContentWidth);
	    parent.$("#content").width(m_ContentWidth).height(parseInt(m_PluginWH[1]) + parseInt(100))
	    $("#container").removeClass().addClass("container").width(m_ContentWidth-2).height(parseInt(m_PluginWH[1]) + parseInt(62));
	    $("#contentright").removeClass().addClass("contenter_hide").width(m_ContentWidth-12).height(parseInt(m_PluginWH[1]) + parseInt(62) );
	    $("#mainplugin").width(m_ContentWidth).height(parseInt(m_PluginWH[1]));
		$("#preset_yzw,#PTZ_Preset").height(m_iBrowserHeight-295);
	}
	else if(obj=="big")
	{
	    parent.$("#head_top").width(parseInt(m_PluginWH[0])+parseInt(14))
	    parent.$("#menu").width(parseInt(m_PluginWH[0])+parseInt(14))
	    top.parent.$("#maindevicetype").width(parseInt(m_PluginWH[0])+parseInt(14));
	    parent.$("#content").width(parseInt(m_PluginWH[0])+parseInt(14)).height(parseInt(m_PluginWH[1]) + parseInt(100))
	    $("#container").removeClass().addClass("container").width(parseInt(m_PluginWH[0])+parseInt(12)).height(parseInt(m_PluginWH[1]) + parseInt(62));
	    $("#contentright").removeClass().addClass("contenter_hide").width(parseInt(m_PluginWH[0])+parseInt(2)).height(parseInt(m_PluginWH[1]) + parseInt(102));
	    $("#mainplugin").width(parseInt(m_PluginWH[0])).height(parseInt(m_PluginWH[1]));
		$("#preset_yzw,#PTZ_Preset").height(parseInt(m_PluginWH[1])-190); 
	}
};
//PTZ显示1:1 大于722
function SizePTZShowX1Big(obj){
	if (obj=="small")
	{
		parent.$("#head_top").width(m_ContentWidth)
		parent.$("#menu").width(m_ContentWidth)
		top.parent.$("#maindevicetype").width(m_ContentWidth);
		parent.$("#content").width(m_ContentWidth).height(parseInt(m_PluginWH[1]) + parseInt(100))
		$("#container").removeClass().addClass("container_show").width(m_ContentWidth).height(parseInt(m_PluginWH[1]) + parseInt(62));
		$("#contentright").removeClass().addClass("viererright").width(m_ContentWidth-parseInt(195)).height(parseInt(m_PluginWH[1]) + parseInt(62) );
		$("#mainplugin").width(m_ContentWidth-parseInt(197)).height(parseInt(m_PluginWH[1]));
		$("#preset_yzw,#PTZ_Preset").height(parseInt(m_PluginWH[1])-412); 
	}
	else if(obj=="big")
	{
		parent.$("#head_top").width(parseInt(m_PluginWH[0])+parseInt(197));
		parent.$("#menu").width(parseInt(m_PluginWH[0])+parseInt(197));
		top.parent.$("#maindevicetype").width(parseInt(m_PluginWH[0])+parseInt(197));
		parent.$("#content").width(parseInt(m_PluginWH[0])+parseInt(197)).height(parseInt(m_PluginWH[1]) + parseInt(100));
		$("#container").removeClass().addClass("container_show").width(parseInt(m_PluginWH[0])+parseInt(197)).height(parseInt(m_PluginWH[1]) + parseInt(62));
		$("#contentright").removeClass().addClass("viererright").width(parseInt(m_PluginWH[0])+parseInt(2)).height(parseInt(m_PluginWH[1]) + parseInt(62));
		$("#mainplugin").width(parseInt(m_PluginWH[0])).height(parseInt(m_PluginWH[1]));
		$("#preset_yzw,#PTZ_Preset").height(parseInt(m_PluginWH[1])-412); 
	}
	
	
};

//PTZ隐藏1:1 大于722
function SizePTZHideX1Big(obj){
	if (obj=="small")
	{
		  parent.$("#head_top").width(m_ContentWidth)
		  parent.$("#menu").width(m_ContentWidth)
		  top.parent.$("#maindevicetype").width(m_ContentWidth);
		  parent.$("#content").width(m_ContentWidth).height(parseInt(m_PluginWH[1]) + parseInt(100))
		  $("#container").removeClass().addClass("container").width(m_ContentWidth-2).height(parseInt(m_PluginWH[1]) + parseInt(62));
		  $("#contentright").removeClass().addClass("contenter_hide").width(m_ContentWidth-12).height(parseInt(m_PluginWH[1]) + parseInt(62) );
		  $("#mainplugin").width(m_ContentWidth).height(parseInt(m_PluginWH[1]));
		  $("#preset_yzw,#PTZ_Preset").height(parseInt(m_PluginWH[1])-412); 
	}
	else if(obj=="big")
	{
		parent.$("#head_top").width(parseInt(m_PluginWH[0])+parseInt(14))
	    parent.$("#menu").width(parseInt(m_PluginWH[0])+parseInt(14))
	    top.parent.$("#maindevicetype").width(parseInt(m_PluginWH[0])+parseInt(14));
	    parent.$("#content").width(parseInt(m_PluginWH[0])+parseInt(14)).height(parseInt(m_PluginWH[1]) + parseInt(100))
	    $("#container").removeClass().addClass("container").width(parseInt(m_PluginWH[0])+parseInt(12)).height(parseInt(m_PluginWH[1]) + parseInt(62));
	    $("#contentright").removeClass().addClass("contenter_hide").width(parseInt(m_PluginWH[0])+parseInt(2)).height(parseInt(m_PluginWH[1]) + parseInt(102));
	    $("#mainplugin").width(parseInt(m_PluginWH[0])).height(parseInt(m_PluginWH[1]));
		$("#preset_yzw,#PTZ_Preset").height(parseInt(m_PluginWH[1])-412); 
	}
	
};



/**********改变窗口大小************/
function dvChangeSize(){
	if (m_ChangeSize==false)
	{
		return;
	}
	if(m_nShowMode==0 || m_nShowMode==1  ||  m_nShowMode==2)  //浏览界面 0为自适应  1为4:3 2为16:9
	{
		if (m_iBrowserHeight <= 722)  //高度小于717
			{
				m_iBrowserHeight=620;
				m_ContentWidth=960;
				if(m_iPtzMode === 0)   //PTZ面板显示
				{ 
					 ChangeIsShow('hide');
					SizePTZHideSmall();  //面板显示小于722
				}
				else //PTZ面板隐藏
				{
				  ChangeIsShow('show')	
				  SizePTZShowSmall();  //面板显示小于722
				}
			}
			else if(m_iBrowserHeight > 722) //高度大于717
			{
				m_ContentWidth=(parseInt(((m_iBrowserHeight-100)*16)/9));
				if(m_iPtzMode === 0)   //PTZ面板显示
				{ 
					 ChangeIsShow('hide');
					 SizePTZHideBig();
				}
				else //PTZ面板隐藏
				{
				   ChangeIsShow('show');
				   SizePTZShowBig(); 
				}
			}// >722 end
	}//0 1 2 end
	else if(m_nShowMode==3)   //浏览界面  3为1:1
	{
		if (m_iBrowserHeight <= 722)  //高度小于717
		{
			m_iBrowserHeight=620;
			m_ContentWidth=960;
			if(m_iPtzMode === 0)   //PTZ面板显示
			{
				  ChangeIsShow('hide');
				  if(parseInt(m_PluginWH[0]) <=960 )  //插件小于等于960
					{
					  SizePTZHideX1Small('small');
					}
					else
					{
					  SizePTZHideX1Small('big')
					}
				  
			}//show end
			else if(m_iPtzMode === 1) //PTZ面板隐藏
			{
				  ChangeIsShow('show');
				  if(parseInt(m_PluginWH[0]) <=960 )  //插件小于等于960
				  {
					  SizePTZShowX1Small('small');
					  
				  }
				  else
				  {
					  SizePTZShowX1Small('big')
				  }
			}//hide end
		} //<717
		else if(m_iBrowserHeight > 722) //>722
		{
			if(m_iPtzMode === 0)   //PTZ面板显示
			{
				ChangeIsShow('hide');
				if (parseInt(m_PluginWH[0]) <=960 )  //插件小于等于960
				{
					SizePTZHideX1Big('small');
				}
				else
				{
					SizePTZHideX1Big('big')
				}
				
			}//show end
			else
			{
				
				ChangeIsShow('show');
				if (parseInt(m_PluginWH[0]) <=960 )  //插件小于等于960
				{
					SizePTZShowX1Big('small');
				}
				else
				{
					SizePTZShowX1Big('big')
				}
			}//hide end
		}
	}// 3 1:1 end
};

/*************************************************
Function:		ChangeIsShow
Description:	点击PTZ显示隐藏
Input:			show显示 hide隐藏			
*************************************************/
function ChangeIsShow(type){
   if (type=="show")
   {
	   m_iPtzMode = 0;
	   $.cookie('m_iPtzMode',0)
	   $("#viewer_left").show();
	   $("#menubar").removeClass().addClass("menubar_open");
   }
   else
   {
	   m_iPtzMode = 1;
	   $.cookie('m_iPtzMode',1)
	   $("#viewer_left").hide();
	   $("#menubar").removeClass().addClass("menubar_close");
   }
};

//获取视频码流码数
function initmultivideo(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/multivideo"
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
		  if($(xmlDoc).find("multivideo").length > 0){
			  $("#changePlay").empty();
				$(xmlDoc).find("multivideo").each(function(i){ 
					for (i=1;i<=$(this).text();i++){
						$("<option value='" + i + "' name='"+'MaviewTypeOpt'+(i)+"' id='"+'MaviewTypeOpt'+(i)+"' >"+getNodeValue('MaviewTypeOpt'+(i))+"</option>").appendTo("#changePlay");
					}
				});
				StartRealPlay();  //发送请求
			}
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

function ptz_hover(){
    $(".ptz_direction_left").find("span").each(function() {
		var id=$(this).attr("id")
        $(this).hover(function () {
              
			   $(this).addClass(id+"_hover");
            },function () {
               $(this).removeClass(id+"_hover")
            }
        );
    });
	
	
	$(".ptz_direction_second").find("span").each(function() {
		var id=$(this).attr("id")
        $(this).hover(function () {
			   $(this).addClass(id+"_hover");
            },function () {
               $(this).removeClass(id+"_hover")
            }
        );
    });
	
	$(".ptz_view").find("span").each(function() {
		var id=$(this).attr("id")
        $(this).hover(function () {
			   $(this).addClass(id+"_hover");
            },function () {
               $(this).removeClass(id+"_hover")
            }
        );
    });
	
	$(".ptz_direction_right").find("span").each(function() {
		var id=$(this).attr("id")
        $(this).hover(function () {
			   $(this).addClass(id+"_hover");
            },function () {
               $(this).removeClass(id+"_hover")
            }
        );
    }); 
	
	$("#sizetoplug").find("div").each(function() {
		var toolbar_id=$(this).attr("class")
        $(this).hover(function () {
			   $(this).addClass(toolbar_id+"_hover");
            },function () {
               $(this).removeClass(toolbar_id+"_hover")
            }
        );
    }); 
	
	
	
	$("#menubar").hover(function (){
		 $(this).addClass("menubar_open_hover");
		},function () {
		$(this).removeClass("menubar_open_hover");
	});
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

	g_lxdPreview = parent.translator.getLanguageXmlDoc("viewer", lan);
	parent.translator.appendLanguageXmlDoc(g_lxdPreview, parent.g_lxdMain);
	parent.translator.translatePage(g_lxdPreview, document);
	
	
	 parent.translator.translateNode(g_lxdPreview, 'MPTZpanel');
	 $("#sizeX1").attr("title", getNodeValue('MsizeX1')); 
	 $("#sizeauto").attr("title", getNodeValue('MSizeauto'));
	// $("<option value='1' name='MaviewTypeOpt1' id='MaviewTypeOpt1' >"+getNodeValue('MaviewTypeOpt1')+"</option>").appendTo("#changePlay");
	 $("#recordState").attr("title", getNodeValue('Mstate'));
	 $("#full").attr("title", getNodeValue('Mfull'));
	 $("#stop").attr("title", getNodeValue('Mstop'));
	 $("#record").attr("title", getNodeValue('Mrecord'));
	 $("#capture").attr("title", getNodeValue('Mcap'));
	 $("#voiceoff").attr("title", getNodeValue('Mcall'));
	 $("#opensound").attr("title", getNodeValue('Msound'));
	 $(".play").attr("title", getNodeValue('Mplay'));
	 $(".pause").attr("title", getNodeValue('Mpause'));
	
	  $("#ptz_zoomIn").attr("title", parent.translator.translateNode(g_lxdPreview, 'MzoomIn'));
	  $("#ptz_zoomOut").attr("title", parent.translator.translateNode(g_lxdPreview, 'MzoomOut'));
	  $("#ptz_PullAway").attr("title", parent.translator.translateNode(g_lxdPreview, 'MpullAway'));
	  $("#ptz_PushIn").attr("title", parent.translator.translateNode(g_lxdPreview, 'MpushIn'));
	  $("#ptz_focusautoPush").attr("title", parent.translator.translateNode(g_lxdPreview, 'MfocusautoPush'));
	  $("#ptz_irisIn").attr("title", parent.translator.translateNode(g_lxdPreview, 'MirisIn'));
	  $("#ptz_irisOut").attr("title", parent.translator.translateNode(g_lxdPreview, 'MirisOut'));
	  $("#ptz_focusauto").attr("title", parent.translator.translateNode(g_lxdPreview, 'Mfocusauto'));
	  $("#ptz_rain").attr("title", parent.translator.translateNode(g_lxdPreview, 'Mrain'));
	  $(".gotoPreset").attr("title", parent.translator.translateNode(g_lxdPreview, 'MLoadTitle'));
	  $(".setPreset").attr("title", parent.translator.translateNode(g_lxdPreview, 'MSetTielt'));
	  $(".cleanPreset").attr("title", parent.translator.translateNode(g_lxdPreview, 'MCleanTitle'));
	
	  if (m_infrace==0)
	  {
		 $("#ptz_light").attr("title", parent.translator.translateNode(g_lxdPreview, 'Mlight'));
	 	 $("#ptz_mist").attr("title", parent.translator.translateNode(g_lxdPreview, 'Mmist'));
	  }
	  else
	  {
		 $("#ptz_light").attr("title", parent.translator.translateNode(g_lxdPreview, 'Maddlight'));//加亮红外灯
		 $("#ptz_mist").attr("title", parent.translator.translateNode(g_lxdPreview, 'Msubmist')); //减弱红外灯
	  }
	 
	 if (m_iPTZ==0){
	   $("#ptz_auto").attr("title", getNodeValue('Mcruise')); 
	  }
	  else{
		$("#ptz_auto").attr("title", getNodeValue('Mreset')); 
	  }
	
	 
	InitPresetListLan()
}
/*************************************************
Function:		InitPresetListLan
Description:	初始化预置点下拉框语言
Input:			无			
Output:			无
return:			无				
*************************************************/
function InitPresetListLan() {
	var szName = parent.translator.translateNode(g_lxdPreview, 'MPreset');
	for(var i = 1; i < 257; i++)
	{
		$("#PreId"+parseInt(i)).html(szName);
	}
	
}
//
function SetPTZClick(obj){
	//if(m_bStartPTZ == false)
	 //return;
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	if(m_iPTZ ==0 && obj == "ptz_reset"){
		if(m_bHorScan == 0)
		{
		    szXml += "<ptzevent>"+'horizon_scan'+"</ptzevent>";
			szXml += "<mode>"+'open'+"</mode>";
			m_bHorScan = 1;
		}
		else 
		{
		    szXml += "<ptzevent>"+'horizon_scan'+"</ptzevent>";
			szXml += "<mode>"+'close'+"</mode>";
			m_bHorScan = 0;
		}
	}
	else
	{
		m_bHorScan = 0;
		szXml += "<ptzevent>"+obj+"</ptzevent>";
	}
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		async: false,  //同步
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{ 
			 g_szSetircutfilterXml =xhr.responseText;
			m_bStartPTZ = false;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

//雨刷
function SetRainClick(obj){
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	if(m_bWiper == 0)
	{
		szXml += "<ptzevent>"+obj+"</ptzevent>";
		szXml += "<mode>"+'open'+"</mode>";
		m_bWiper = 1;
	}
	else 
	{
		szXml += "<ptzevent>"+obj+"</ptzevent>";
		szXml += "<mode>"+'close'+"</mode>";
		m_bWiper = 0;
	}
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		async: false,  //同步
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{ 
			 g_szSetircutfilterXml =xhr.responseText;
			// m_bWiper = 0;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};


function SetIrClick(obj, param){
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<mode>"+param+"</mode>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 g_szSetircutfilterXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//PTZ点击
function SetPTZStart(obj){
	 m_bStartPTZ = true; 
	 m_bHorScan = 0;
	var panspeed=$("#vertical_value").text();
	var tilspeed=$("#vertical_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
	$.ajax({
		
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		//async: false,  //同步
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{ 
			 g_szSetircutfilterXml =xhr.responseText;
			 if (obj!="ptz_reset"){
				 m_bStartPTZ = true; 
			 }
			
		},error: function(xhr, textStatus, errorThrown)
			{
				m_bStartPTZ = false;
				ErrStateTips(xhr);
			}
		
	});
}
//PTZ弹起
function SetPTZStop(obj){
	if(m_bStartPTZ == false)
	    return;
	m_bStartPTZ = false;
	var panspeed=$("#vertical_value").text();
	var tilspeed=$("#vertical_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		//async: false,  //同步
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{ 
			 g_szSetircutfilterXml =xhr.responseText;
			 m_bStartPTZ = false;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}

/*************************************************
Function:		size4to3
Description:	插件按照4:3显示
Input:			无			
Output:			无
return:			无				
*************************************************/
function size4to3(){
	if (m_PreviewOCX==null){
		return;
	}
	document.getElementById("plugin0").eventWebToPlugin("view","displaytype","4:3");
	m_nShowMode=1;
	autoSize();
	RefreshShowModeCtrl();
}
/*************************************************
Function:		size16to9
Description:	插件按照16:9显示
Input:			无			
Output:			无
return:			无				
*************************************************/
function size16to9(){
	if (m_PreviewOCX==null){
		return;
	}
	document.getElementById("plugin0").eventWebToPlugin("view","displaytype","16:9");
	m_nShowMode=2;
	autoSize();
	RefreshShowModeCtrl();
}
/*************************************************
Function:		sizeX1
Description:	插件按照1:1显示
Input:			无			
Output:			无
return:			无				
*************************************************/
function sizeX1(){
	if (m_PreviewOCX==null){
		return;
	}
	m_nShowMode=3;
	var sizeX1_str=document.getElementById("plugin0").eventWebToPlugin("view","displaytype","original");
	m_PluginWH =  sizeX1_str.split("*");
	if (m_iBrowserHeight <= 722)  //高度小于717
	{
		m_iBrowserHeight=620;
		m_ContentWidth=960;
		if(m_iPtzMode === 0)   //PTZ面板显示
		{
			 if(parseInt(m_PluginWH[0]) <=960 )  //插件小于等于960
			  {
				  SizePTZShowX1Small('small');
				  
			  }
			  else
			  {
				  SizePTZShowX1Small('big')
			  }
		}//show end
		else if(m_iPtzMode === 1) //PTZ面板隐藏
		{
			if(parseInt(m_PluginWH[0]) <=960 )  //插件小于等于960
		    {
			  SizePTZHideX1Small('small');
		    }
		    else
		    {
		  	  SizePTZHideX1Small('big')
		    }
		}//hide end
	} //<717
	else //>722
	{
		if(m_iPtzMode === 0)   //PTZ面板显示
		{
			if (parseInt(m_PluginWH[0]) <=960 )  //插件小于等于960
			{
				SizePTZShowX1Big('small');
			}
			else
			{
				SizePTZShowX1Big('big')
			}
		}//show end
		else
		{
			if (parseInt(m_PluginWH[0]) <=960 )  //插件小于等于960
			{
				SizePTZHideX1Big('small');
			}
			else
			{
				SizePTZHideX1Big('big')
			}
		}//hide end
	}
	RefreshShowModeCtrl();
}
/*************************************************
Function:		hisChangeX1Size
Description:	脚本修改翰讯编码卡(正常不调用)
Input:			无			
Output:			无
return:			无				
*************************************************/
function hisChangeX1Size(){
   if(m_nShowMode==3)   //浏览界面  3为1:1
		{
			if (m_iBrowserHeight <= 722)  //高度小于717
			{
				m_iBrowserHeight=620;
				m_ContentWidth=960;
				  if(parseInt(m_PluginWH[0]) <=960 )  //插件小于等于960
				  {
					  parent.$("#head_top").width(m_ContentWidth)
					  parent.$("#menu").width(m_ContentWidth)
					  top.parent.$("#maindevicetype").width(m_ContentWidth);
					  parent.$("#content").width(m_ContentWidth).height(parseInt(m_PluginWH[1]) + parseInt(100))
					  $("#container").removeClass().addClass("container").width(m_ContentWidth-2).height(parseInt(m_PluginWH[1]) + parseInt(62));
					  $("#contentright").removeClass().addClass("contenter_hide").width(m_ContentWidth-12).height(parseInt(m_PluginWH[1]) + parseInt(62) );
					  $("#mainplugin").width(m_ContentWidth).height(parseInt(m_PluginWH[1]));
					  $("#preset_yzw").height(m_iBrowserHeight-295);  //133  18  185
					  $("#PTZ_Preset").height(m_iBrowserHeight-295);
				  }
				  else
				  {
					  parent.$("#head_top").width(parseInt(m_PluginWH[0])+parseInt(14))
					  parent.$("#menu").width(parseInt(m_PluginWH[0])+parseInt(14))
					  top.parent.$("#maindevicetype").width(parseInt(m_PluginWH[0])+parseInt(14));
					  parent.$("#content").width(parseInt(m_PluginWH[0])+parseInt(14)).height(parseInt(m_PluginWH[1]) + parseInt(100))
					  $("#container").removeClass().addClass("container").width(parseInt(m_PluginWH[0])+parseInt(12)).height(parseInt(m_PluginWH[1]) + parseInt(62));
					  $("#contentright").removeClass().addClass("contenter_hide").width(parseInt(m_PluginWH[0])+parseInt(2)).height(parseInt(m_PluginWH[1]) + parseInt(102));
					  $("#mainplugin").width(parseInt(m_PluginWH[0])).height(parseInt(m_PluginWH[1]));
					  $("#preset_yzw").height(parseInt(m_PluginWH[1])-190); 
					  $("#PTZ_Preset").height(parseInt(m_PluginWH[1])-190);
				  }
				
			}
			else if(m_iBrowserHeight > 722) //高度大于717
			{
				  if (parseInt(m_PluginWH[0]) <=960 )  //插件小于等于960
				  {
					  parent.$("#head_top").width(m_ContentWidth)
					  parent.$("#menu").width(m_ContentWidth)
					  top.parent.$("#maindevicetype").width(m_ContentWidth);
					  parent.$("#content").width(m_ContentWidth).height(parseInt(m_PluginWH[1]) + parseInt(100))
					  $("#container").removeClass().addClass("container").width(m_ContentWidth-2).height(parseInt(m_PluginWH[1]) + parseInt(62));
					  $("#contentright").removeClass().addClass("contenter_hide").width(m_ContentWidth-12).height(parseInt(m_PluginWH[1]) + parseInt(62) );
					  $("#mainplugin").width(m_ContentWidth).height(parseInt(m_PluginWH[1]));
					  $("#preset_yzw").height(parseInt(m_PluginWH[1])-412); 
					  $("#PTZ_Preset").height(parseInt(m_PluginWH[1])-412);
				  }
				  else
				  {
					  parent.$("#head_top").width(parseInt(m_PluginWH[0])+parseInt(14))
					  parent.$("#menu").width(parseInt(m_PluginWH[0])+parseInt(14))
					  top.parent.$("#maindevicetype").width(parseInt(m_PluginWH[0])+parseInt(14));
					  parent.$("#content").width(parseInt(m_PluginWH[0])+parseInt(14)).height(parseInt(m_PluginWH[1]) + parseInt(100))
					  $("#container").removeClass().addClass("container").width(parseInt(m_PluginWH[0])+parseInt(12)).height(parseInt(m_PluginWH[1]) + parseInt(62));
					  $("#contentright").removeClass().addClass("contenter_hide").width(parseInt(m_PluginWH[0])+parseInt(2)).height(parseInt(m_PluginWH[1]) + parseInt(102));
					  $("#mainplugin").width(parseInt(m_PluginWH[0])).height(parseInt(m_PluginWH[1]));
					  $("#preset_yzw").height(parseInt(m_PluginWH[1])-412); 
					  $("#PTZ_Preset").height(parseInt(m_PluginWH[1])-412);
				   }
			}
	}//1:1结束
}


/*************************************************
Function:		RefreshShowModeCtrl
Description:	刷新显示控件状态
Input:			无			
Output:			无
return:			无				
*************************************************/
function RefreshShowModeCtrl(){
	if(m_nShowMode == 0)
	{
		$("#sizeauto").removeClass().addClass("sizeauto_down");
		$("#size4to3").removeClass().addClass("size4to3");
		$("#size16to9").removeClass().addClass("size16to9");
		$("#sizeX1").removeClass().addClass("sizeX1");
	}
	else if(m_nShowMode == 1)
	{
		$("#sizeauto").removeClass().addClass("sizeauto");
		$("#size4to3").removeClass().addClass("size4to3_down");
		$("#size16to9").removeClass().addClass("size16to9");
		$("#sizeX1").removeClass().addClass("sizeX1");
	}else if(m_nShowMode == 2)
	{
		$("#sizeauto").removeClass().addClass("sizeauto");
		$("#size4to3").removeClass().addClass("size4to3");
		$("#size16to9").removeClass().addClass("size16to9_down");
		$("#sizeX1").removeClass().addClass("sizeX1");
	}else if(m_nShowMode == 3)
	{
		$("#sizeauto").removeClass().addClass("sizeauto");
		$("#size4to3").removeClass().addClass("size4to3");
		$("#size16to9").removeClass().addClass("size16to9");
		$("#sizeX1").removeClass().addClass("sizeX1_down");
	}
}

/*************************************************
Function:		PluginAutoSize
Description:	插件自适应显示
Input:			无			
Output:			无
return:			无				
*************************************************/
function PluginAutoSize(){
	if (m_PreviewOCX==null){
		return;
	}
	document.getElementById("plugin0").eventWebToPlugin("view","displaytype","auto");  //自适应
	m_nShowMode=0;
	m_iPtzMode=Number($.cookie('m_iPtzMode'));
	autoSize();
	RefreshShowModeCtrl();
}
//changePlay
/*************************************************
Function:		changePlay
Description:	开始预览
Output:			无
return:			无
*************************************************/
function changePlay() {
	//changePlay
	//主流
//	$("#play").removeClass().addClass("play").attr("title", parent.translator.translateNode(g_lxdPreview, 'stoppreview'));
	//m_bChannelRecord=2
	var chnid=$("#changePlay").val().toString();
	var videoid="1";
	//if(chnid==1){
	//	console.log("changePlay"+"   "+typeof chnid+"   "+typeof videoid)
	//var ret=document.getElementById("plugin0").eventWebToPlugin("view", "start",camera_hostname,camera_port.toString(),videoid,chnid, $.cookie('authenticationinfo'),UserNameLogin,UserPassLogin);  //开始播放
	//console.log(ret)
	m_bChannelRecord=0;
	m_Record=0;  //录像初始化
	$("#record").attr("title", getNodeValue('Mrecord'));
	m_bTalk =0;
	$("#voiceoff").attr("title", getNodeValue('Mcall'));
	$("#SubTalksider").hide();
	$( "#talk_slider_sound").slider({
	  range: "min",
	  value: 50,
	  min: 0,
	  max: 100,
	  slide: function( event, ui ) {
		  m_TalksideSound = ui.value;
	  },
	change: function( event, ui ) {
		m_TalksideSound=ui.value
		document.getElementById("plugin0").eventWebToPlugin("view","callvolume",m_TalksideSound.toString());
	  }
	});  
	StartRealPlay();
	
		
		
	
	//PluginAutoSize();
	
	//}
}
/*************************************************
Function:		StartRealPlay
Description:	开始预览
Output:			无
return:			无
*************************************************/
function StartRealPlay() {
	
	if (m_PreviewOCX==null){
		m_bChannelRecord=0;
		$("#play").removeClass().addClass("play_disable");
		RefreshToolbar();
		return;
	}
	var videoid="1";  //视频源ID
	var chnid=$("#changePlay").val().toString();     //通道ID
	if(m_audioenc)  //音频编码
	{
		 m_viewaudio="both";
	}
	else
	{
		m_viewaudio="vedio";
	}
	if(m_bChannelRecord==0){
		//开始
		if ($.cookie('authenticationinfo')==null || $.cookie('authenticationinfo')==''){
			//alert("匿名")
			var ret=document.getElementById("plugin0").eventWebToPlugin("view", "start", camera_hostname,camera_port.toString(),videoid,chnid,'','','',m_viewaudio);  //开始播放
			//alert("过插件")
		}else{
			//alert("用户")
		    var ret=document.getElementById("plugin0").eventWebToPlugin("view", "start", camera_hostname,camera_port.toString(),videoid,chnid,$.cookie('authenticationinfo'),UserNameLogin,UserPassLogin,m_viewaudio);  //开始播放	
		 //  alert("过用户")
		}
		PluginAutoSize();   //自适应
		if(ret=="true")
		{
			  $("#play").removeClass().addClass("pause").attr("title", getNodeValue('Mpause'));
			    document.getElementById("plugin0").eventWebToPlugin("view","volume",m_soundsideChage.toString());
			    m_bChannelRecord=1;
				RefreshPTZState();
				RefreshToolbar();
				$(".btnmouseout1").find("div").each(function() 
				{
			  	   var toolbar_id=$(this).attr("class")
				   $(this).hover(function () 
				   {
					   $(this).removeClass("pause_hover")
					   $(this).addClass(toolbar_id+"_hover");
					},function () 
					{
					   $(this).removeClass(toolbar_id+"_hover")
					}
				);
			});
		}
		else
		{
			m_bChannelRecord=0;
			RefreshToolbar();
		}
		
		
	}else if(m_bChannelRecord==1)
	{	//暂停
	   
	    document.getElementById("plugin0").eventWebToPlugin("view", "pause");
		m_bChannelRecord=2;
		RefreshPTZState();
		RefreshToolbar();
		$("#play").removeClass().addClass("play").attr("title", getNodeValue('Mplay'));
		
          $(".btnmouseout1").find("div").each(function() {
			var toolbar_id=$(this).attr("class")
			
			$(this).hover(function () {
				   $(this).removeClass("pause_hover")
				   $(this).addClass(toolbar_id+"_hover");
				},function () {
				   $(this).removeClass(toolbar_id+"_hover")
				}
			);
		});

        
	}else{
		//继续
		//console.log("继续")
		document.getElementById("plugin0").eventWebToPlugin("view", "resume");
		m_bChannelRecord=1;
		RefreshPTZState();
		RefreshToolbar();
		$("#play").removeClass().addClass("pause").attr("title", getNodeValue('Mpause'));
		$(".btnmouseout1").find("div").each(function() {
			var toolbar_id=$(this).attr("class")
			$(this).hover(function () {
				   $(this).removeClass("pause_hover")
				   $(this).addClass(toolbar_id+"_hover");
				},function () {
				   $(this).removeClass(toolbar_id+"_hover")
					//$(this).removeClass(toolbar_id+"_down")
				}
			);
		});
		
		
	}
	
} 
//停止
function StopAll(Toolbar){
	if (m_bChannelRecord==0){
		return
	}
	if (Toolbar!=1){
	 document.getElementById("plugin0").eventWebToPlugin("view", "stop");	
	}
	//$("#stop").removeClass().addClass("recorddisable");
	$("#stop").attr("title", parent.translator.translateNode(g_lxdPreview, 'Mstop'));
	$("#play").removeClass().addClass("play").attr("title", getNodeValue('Mplay'));
	$("#divPreviewTips").html("");
	m_bChannelRecord=0;
	m_Record=0;  //录像 
	m_bTalk=0;   //呼叫
	m_ePTZ=0;    //EPTZ
	RefreshPTZState();
	RefreshToolbar();
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
	
};

//刷新工具栏-开启停止时使用
function RefreshToolbar(){
	//console.log("m_bTalk"+"  "+m_bTalk)
	// 开始
	if(m_bChannelRecord > 0)
	{
		if (m_anonymous=="anonymous")
		{
		   m_anonymousRecord=1;
		   $("#voiceoff").removeClass().addClass("voiceoff_disable");
		   $("#SubTalksider").hide();
		   $("#capture").removeClass().addClass("capture_disable");
		   $("#record").removeClass().addClass("record_disable");
		   $("#recordptz").removeClass().addClass("recordptz_disable");
		  // return;
	    }
		else
		{
		  	//$("#voiceoff").removeClass().addClass("voiceoff");
		    $("#capture").removeClass().addClass("capture");
		   // $("#record").removeClass().addClass("record");
			if(m_bChannelRecord  == 2)
			{
				 $("#recordptz").removeClass().addClass("recordptz_disable");
			}
			else
			{
				 $("#recordptz").removeClass().addClass("recordptz");
			}
			
			
			//录像
			if (m_Record==1)
			{
				$("#record").removeClass().addClass("record_down");
			}
			else
			{
				$("#record").removeClass().addClass("record");
			}
			
			
			//呼叫
			if (m_bTalk==1)
			{
				$("#voiceoff").removeClass().addClass("voiceoff_down");
			}
			else
			{
				$("#voiceoff").removeClass().addClass("voiceoff");
			}
			
			//EPTZ
			if (m_ePTZ==1)
			{
				$("#ePTZ").removeClass().addClass("ePTZ_down");
			}
			else
			{
				$("#ePTZ").removeClass().addClass("ePTZ");
			}
		}
		
		
		
		
		$("#stop").removeClass().addClass("stop");
		$("#slider_sound").slider('enable');	 //启用拖动条
		if (m_soundsideChage==0){
			$("#opensound").removeClass().addClass('opensound_close');
		}else{
			$("#opensound").removeClass().addClass("opensound");
		}
		$("#recordState").removeClass().addClass("recordState");
		$("#full").removeClass().addClass("full");
	}
	else 
	{
		if (m_soundsideChage==0){
			$("#opensound").removeClass().addClass('opensound_disable');
		}else{
			$("#opensound").removeClass().addClass("opensound_close_disable");
		}
	
		$("#stop").removeClass().addClass("stop_disable");
		$("#slider_sound").slider( 'disable')	 //禁用拖动条 
		$("#voiceoff").removeClass().addClass("voiceoff_disable").attr("title",getNodeValue('Mcall'));
		$("#SubTalksider").hide();
		$("#capture").removeClass().addClass("capture_disable");
		$("#record").removeClass().addClass("record_disable").attr("title",getNodeValue('Mrecord'));
		$("#ePTZ").removeClass().addClass("ePTZ_disable");
		$("#recordptz").removeClass().addClass("recordptz_disable");
		$("#recordState").removeClass().addClass("recordState_disable");
		$("#full").removeClass().addClass("full_disable");
	}
	
};
//改变音量
function ChangeOpenSound(){
	//console.log(m_soundsideChage)
	if (m_soundsideChage==0){
		$("#opensound").removeClass().addClass('opensound_close');	
	    m_bSound = false;  //静音
	  // $("#slider_sound").slider( 'disable')  //禁用拖动条
	   $("#slider_sound").slider('enable');  //启用拖动条
	   document.getElementById("plugin0").eventWebToPlugin("view","volume",m_soundsideChage.toString());
	}else{
		$("#opensound").removeClass().addClass('opensound');	
	    m_bSound = true;  //正常
	    $("#slider_sound").slider('enable');  //启用拖动条
	    document.getElementById("plugin0").eventWebToPlugin("view","volume",m_soundsideChage.toString());
	}
}


//点击音量
function OpenSound(){
	//var soundsideChage=ui.value;
	//if (!m_bSound){
	if (m_bChannelRecord==0){
		return
	}
	
	if (m_bSound==true){  //正常
	  $("#opensound").removeClass().addClass('opensound_close');	
	  m_bSound = false;  //静音
	 // $("#slider_sound").slider( 'disable')  //禁用拖动条
	 $("#slider_sound").slider('enable')  //禁用拖动条
	  $( "#slider_sound" ).slider({
			  range: "min",
			  value: 0,
			  min: 0,
			  max: 100
			  /*slide: function( event, ui ) {
				  
				  m_soundsideChage = ui.value;
			  }*/
			  });
	  m_soundsideChage=0;
	  document.getElementById("plugin0").eventWebToPlugin("view","volume",m_soundsideChage.toString());
	 //console.log("静音"+"  "+m_soundsideChage)
	}else if(m_bSound==false){
	  $("#opensound").removeClass().addClass('opensound');	
	  m_bSound = true;  //正常
	  $("#slider_sound").slider('enable');  //启用拖动条
	  $( "#slider_sound" ).slider({
			  range: "min",
			  value: 50,
			  min: 0,
			  max: 100,
			  slide: function( event, ui ) {
				  //m_soundsideChage = ui.value;
			  }
			  });
	  m_soundsideChage=50;
	  document.getElementById("plugin0").eventWebToPlugin("view","volume",m_soundsideChage.toString());
	 // console.log("正常"+"   "+m_soundsideChage)
	}
	
		/*if (m_soundsideChage!==0){
			$("#opensound").removeClass('opensound_close').addClass('opensound');
			document.getElementById("plugin0").eventWebToPlugin("view","volume",m_soundsideChage.toString());
			m_bSound = true;
		 }else{
			$("#opensound").removeClass('opensound').addClass('opensound_close')
			$("#slider_sound").slider( 'disable')	 //禁用拖动条 
			
			//m_soundsideChage == 0;
			$( "#slider_sound" ).slider({
			  range: "min",
			  value: 0,
			  min: 0,
			  max: 100,
			  slide: function( event, ui ) {
				  m_soundsideChage = ui.value;
			  },
			   change: function( event, ui ) {
			  }});
			
			document.getElementById("plugin0").eventWebToPlugin("view","volume",m_soundsideChage.toString());
		}*/
	//}
	 
	
};

/*************************************************
Function:		Talk
Description:	语言对讲
Input:			无			
Output:			无
return:			无				
*************************************************/
function Talk(obj){
	if (m_bChannelRecord==0){
		return
	} 
	if(m_anonymousRecord==1){
		return
	}
	if(m_bTalk == 0) {
		var ret=document.getElementById("plugin0").eventWebToPlugin("view","StartAudioCall");
		if(ret=="true"){
			$("#voiceoff").removeClass().addClass("voiceoff_down").attr("title",parent.translator.translateNode(g_lxdPreview, 'Mstopcall'));
			m_bTalk =1;
			$("#SubTalksider").show();
			$("#divPreviewTips").html(parent.translator.translateNode(g_lxdPreview, 'Mcallsucc'));
			setTimeout(function(){$("#divPreviewTips").html("");},5000);  //5秒后自动清除
		}
		else{
			m_bTalk =0;
			$("#SubTalksider").hide();
			$("#voiceoff").removeClass().addClass("voiceoff"); 
			$("#divPreviewTips").html(parent.translator.translateNode(g_lxdPreview, 'Mcallerr'));
			setTimeout(function(){$("#divPreviewTips").html("");},5000);  //5秒后自动清除
		}
	} else {
		var ret=document.getElementById("plugin0").eventWebToPlugin("view","StopAudioCall");//停止呼叫
		if (ret=="true"){
			m_bTalk =0;
			$("#SubTalksider").hide();
		$("#voiceoff").removeClass().addClass("voiceoff").attr("title", parent.translator.translateNode(g_lxdPreview, 'Mcall'));
		}else{
			m_bTalk=1;
			$("#SubTalksider").hide();
			$("#voiceoff").removeClass().addClass("voiceoff_down").attr("title", getNodeValue('Mstopcall')); 
			$("#divPreviewTips").html(getNodeValue('Mcallstoperr'));
			setTimeout(function(){$("#divPreviewTips").html("");},5000);  //5秒后自动清除
		}
		
		
		
	}
};

//抓图
function CapturePicture(){
	if (m_bChannelRecord==0){
		return
	}
	if(m_anonymousRecord==1){
		return
	}
   if (isDevSnapPic=="true")
   {
	  var ret=document.getElementById("plugin0").eventWebToPlugin("view","Snapshot");
   }
   else
   {
	   
	  var ret=document.getElementById("plugin0").eventWebToPlugin("view","LocalSnapshot");
   }
   if (ret=="true"){
		$("#divPreviewTips").html(parent.translator.translateNode(g_lxdPreview, 'Mcapsucc'));
		setTimeout(function(){$("#divPreviewTips").html("");},5000);  //5秒后自动清除
	}
	else
	{
		$("#divPreviewTips").html(parent.translator.translateNode(g_lxdPreview, 'Mcaperr'));
		setTimeout(function(){$("#divPreviewTips").html("");},5000);  //5秒后自动清除
	}
	
};
function downcap (){
	var ret=document.getElementById("plugin0").eventWebToPlugin("view","SnapMode");
}
//全屏
function fullscreen(){
	if (m_bChannelRecord==0){
		return
	}
	document.getElementById("plugin0").eventWebToPlugin("view","fullscreen");
	RefreshPTZState();
};
//录像
function record(){
	if (m_bChannelRecord==0){
		return
	}
	if(m_anonymousRecord==1){
		return
	}
	if (m_Record==0){
		var ret=document.getElementById("plugin0").eventWebToPlugin("view","StartLocalRec");
		if (ret=="true"){
			m_Record=1;
			$("#record").removeClass().addClass("record_down").attr("title",  parent.translator.translateNode(g_lxdPreview, 'Mrecord'));
		   	$("#divPreviewTips").html(parent.translator.translateNode(g_lxdPreview, 'Mrecordsucc'));
			setTimeout(function(){$("#divPreviewTips").html("");},5000);  //5秒后自动清除
		}else{
			m_Record=0;
			$("#record").removeClass().addClass("record");
			$("#divPreviewTips").html(parent.translator.translateNode(g_lxdPreview, 'Mrecorderr'));
			setTimeout(function(){$("#divPreviewTips").html("");},5000);  //5秒后自动清除
		}
	}else{
		//m_Record=0
		var ret=document.getElementById("plugin0").eventWebToPlugin("view","StopLocalRec");
		if (ret=="true"){
			m_Record=0;
			$("#record").removeClass().addClass("record").attr("title", parent.translator.translateNode(g_lxdPreview, 'Mrecord')); 
		}else{
			m_Record=1;
			$("#record").removeClass().addClass("record_down").attr("title", parent.translator.translateNode(g_lxdPreview, 'jsRecord')); 
			$("#divPreviewTips").html(parent.translator.translateNode(g_lxdPreview, 'Mrecorderr'));
			setTimeout(function(){$("#divPreviewTips").html("");},5000);  //5秒后自动清除
		}
	}
};
function RefreshPTZState(){
	if (m_bChannelRecord==0){
		return
	}
	var state = document.getElementById("plugin0").eventWebToPlugin("view","ptzstate");// ptz, eptz, null
	if(state == "ptz")
	{
	   m_ePTZ = 2;
	   $("#recordptz").removeClass().addClass("recordptz_down");
	   $("#ePTZ").removeClass().addClass("ePTZ");
	}
	else  if(state == "eptz")
	{
	   m_ePTZ = 1;
	   $("#ePTZ").removeClass().addClass("ePTZ_down");
	  // $("#recordptz").removeClass().addClass("recordptz");
	  if(m_anonymousRecord==1){
		  return
	     }
		 else{
		   if (m_bChannelRecord!=2)
			{
				$("#recordptz").removeClass().addClass("recordptz");
			} 
		}
    }
	else 
	{
	   $("#ePTZ").removeClass().addClass("ePTZ");
	  // $("#recordptz").removeClass().addClass("recordptz");
	  if(m_anonymousRecord==1){
		  return
	     }
		 else{
		    if (m_bChannelRecord!=2)
			{
				$("#recordptz").removeClass().addClass("recordptz");
			} 
		}
	   m_ePTZ = 0;
	}
};
function EPTZ(){
	if (m_bChannelRecord==0){
		return
	}
	if (m_ePTZ==0){
		document.getElementById("plugin0").eventWebToPlugin("view","piczoom");
		m_ePTZ=1;
		$("#ePTZ").removeClass().addClass("ePTZ_down");
		if(m_anonymousRecord==1){
		  return
	     }
		 else{
			if (m_bChannelRecord!=2)
			{
				$("#recordptz").removeClass().addClass("recordptz");
			} 
		}
	}else if(m_ePTZ==1){
		document.getElementById("plugin0").eventWebToPlugin("view","piczoom");
		m_ePTZ=0;
		$("#ePTZ").removeClass().addClass("ePTZ");
		//$("#recordptz").removeClass().addClass("recordptz");
		if(m_anonymousRecord==1){
		  return
	     }
		 else{
		   //$("#recordptz").removeClass().addClass("recordptz");
		   if (m_bChannelRecord!=2)
			{
				$("#recordptz").removeClass().addClass("recordptz");
			} 
		}
	}else if(m_ePTZ==2){
		document.getElementById("plugin0").eventWebToPlugin("view","piczoom")
		$("#ePTZ").removeClass().addClass("ePTZ_down");
		//$("#recordptz").removeClass().addClass("recordptz");
		if(m_anonymousRecord==1){
		  return
	     }
		 else{
		   $("#recordptz").removeClass().addClass("recordptz");
		}
		m_ePTZ=1;
	}

};
function recordptz(){
	if (m_bChannelRecord==0  ||  m_bChannelRecord==2){
		return
	}
	if(m_anonymousRecord==1){
		return
	}
	if (m_ePTZ==0){
		//console.log("04")
		document.getElementById("plugin0").eventWebToPlugin("view","ptzzoom");
		m_ePTZ=2;
		$("#recordptz").removeClass().addClass("recordptz_down");
		$("#ePTZ").removeClass().addClass("ePTZ");
	}else if(m_ePTZ==2){
		document.getElementById("plugin0").eventWebToPlugin("view","ptzzoom");
		m_ePTZ=0;
		//console.log("05")
		$("#recordptz").removeClass().addClass("recordptz");
		$("#ePTZ").removeClass().addClass("ePTZ");
	}else if(m_ePTZ==1){
		//console.log("06")
		document.getElementById("plugin0").eventWebToPlugin("view","ptzzoom");
		$("#recordptz").removeClass().addClass("recordptz_down");
		$("#ePTZ").removeClass().addClass("ePTZ");
		m_ePTZ=2;
	}
	//RefreshPTZState();
	}
//状态
function VideoInfoState(){
	if (m_bChannelRecord==0){
		return
	}
	var ret=document.getElementById("plugin0").eventWebToPlugin("view","state");
};
/*************************************************
Function:		InitPresetList
Description:	初始化预置点下拉框
Input:			无			
Output:			无
return:			无				
*************************************************/
function InitPresetList() {
	//$("#SelectPreset").empty();
	var szName = parent.translator.translateNode(g_lxdPreview, 'MPreset');
	//console.log(szName)
	for(var i = 0; i < 256; i++) {
		if(window.parent.g_bIsIPDome) {
			if((i >= 32 && i < 44) || (i >= 90 && i < 105)) {
				continue;
			}
		}
		if (i < 9) {
			$("<option value='"+ (i+1) +"'>"+szName+" 0"+(i+1)+"</option>").appendTo("#SelectPreset");
	   	} else {
	       	$("<option value='"+ (i+1) +"'>"+szName+" "+(i+1)+"</option>").appendTo("#SelectPreset");
       	}
   	}
}
//获取化预置点
function GetPresetName(){
	/* var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<name>"+'name'+"</name>";
		szXml += "</ptzparam>";
		var xmlDoc = parseXmlFromStr(szXml);
	*/
	/* var szXml = "<contentroot>";
	    szXml +=authenticationinfo;
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	*/
	
	var szXml = "<presetqueryinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<mode>"+"multi"+"</mode>";  //预置点编号
		szXml += "</presetqueryinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/presetget"
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
			/*if("true" == $(xmlDoc).find('enabled').eq(0).text())
		    {
			    $("#DDNSenabled").val(true).prop("checked", true);
				$("#provider").prop("disabled",false)
				$("#UserNameDDNS").prop("disabled",false)
				$("#PasswordDDNS").prop("disabled",false)
				
		    }else{
				$("#DDNSenabled").val(false).prop("checked", false);
				$("#UserNameDDNS").prop("disabled",true)
				$("#PasswordDDNS").prop("disabled",true)
				$("#provider").prop("disabled",true)
			}*/
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
/*************************************************
Function:		InitPreset
Description:	初始化预置点
Input:			无 
Output:			无
return:			无
*************************************************/
function InitPreset() {
	var szName = parent.translator.translateNode(g_lxdPreview, 'MPreset');
	var szNameClick = parent.translator.translateNode(g_lxdPreview, 'laPresetclick');
	for(var i = 1; i < 257; i++) {
	  	$("<div style='cursor:pointer;height:30px; line-height:30px;border-bottom:1px solid #d1d1d1'>"
					+"<span style='width:150px;margin-left:10px;'><label id='PreId"+parseInt(i)+"' class='fontnormal mousepointer' style='width:150px;height:30px;'>" +  szName + "</label> " + i +"</span>"
					+"<span id='PresetIdspan' style='width:70px;display:none;margin-top:3px;'>"
							+"<span class='gotoPreset' title='' onclick='SetViewPreset("+i+","+'"preset_load"'+")'></span>"
							+"<span class='setPreset' title=''  onclick='SetViewPreset("+i+","+'"preset_set"'+")'></span>"
							+"<span class='cleanPreset' title='' onclick='SetViewPreset("+i+","+'"preset_remove"'+")'></span>"
						+"</span>"
					+"</div>").appendTo("#PTZ_Preset").bind({
					mouseover:function() {
						if(!$(this).hasClass("select")) {
							$(this).addClass("select");
							$(this).children("span").eq(0).css({'width':'80','float':'left'});
							$(this).children("span").eq(1).css({'width':'70','float':'right'}).show();
						}
					},
					mouseout:function() {
						$(this).removeClass("select");
						$(this).children("span").eq(0).css({'width':'150'});
						$(this).children("span").eq(1).css({'width':'70'}).hide();
					}
				});
	 
	}
	 $(".gotoPreset").attr("title", parent.translator.translateNode(g_lxdPreview, 'MLoadTitle'));
	 $(".setPreset").attr("title", parent.translator.translateNode(g_lxdPreview, 'MSetTielt'));
	 $(".cleanPreset").attr("title", parent.translator.translateNode(g_lxdPreview, 'MCleanTitle'));
	/*for(var i = 1; i < 257; i++) {
		$("<div><span><label name='laPreset' class='fontnormal mousepointer'>" + szName + "</label> " + i +
		  "</span><span><span id='PresetId"+parseInt(i)+"'></span><span></span><span></span><span></span></span></div>").appendTo("#PTZ_Preset").bind("click", {index: i}, function(event) {
			if(!$(this).hasClass("select")) {
				
				$(this).siblings(".select").each(function() {
					$(this).removeClass("select");
					$(this).children("span").eq(1).removeClass("ptzset")
					$(this).children("span").children("span").eq(0).html("")
					$(this).children("span").children("span").eq(0).removeClass("Presetyzw1").unbind();
					$(this).children("span").children("span").eq(1).removeClass("gotoPreset").unbind();
					$(this).children("span").children("span").eq(2).removeClass("setPreset").unbind();
					$(this).children("span").children("span").eq(3).removeClass("cleanPreset").unbind();
					//$(this).children("span").children("span").eq(4).removeClass("editPreset").unbind();
					
				});
				$(this).attr("class","select");
				$(this).children("span").eq(1).addClass("ptzset")
			    $(this).children("span").children("span").eq(0).addClass("Presetyzw1").html("预置点");
				$(this).children("span").children("span").eq(1).addClass("gotoPreset").attr("title", getNodeValue("LoadPreset")).bind("click",{index: event.data.index},function(event) {
					GotoPreset(event.data.index);
				});
				$(this).children("span").children("span").eq(2).addClass("setPreset").attr("title", getNodeValue("SetPreset")).bind("click",{index: event.data.index},function(event) {
					SetPresetFun(event.data.index);
				});
				
				$(this).children("span").children("span").eq(3).addClass("cleanPreset").attr("title", getNodeValue("CleanPreset")).bind("click",{index: event.data.index},function(event) {
					CleanPreset(event.data.index);
				});
			}
		}).bind({
			mouseover:function() {
				if(!$(this).hasClass("select")) {
					$(this).addClass("enter");
				}
			},
			mouseout:function() {
				$(this).removeClass("enter");
			}
		}).children("span").eq(0).addClass("firstchild");
	}*/
}


/*************************************************
Function:		SetViewPreset
Description:	设置预置点
Input:			iPresetId 预置点ID,type类型
Output:			无
return:			无
*************************************************/
function SetViewPreset(iPresetId,type) {
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+type+"</ptzevent>";
	szXml += "<preset>"+iPresetId+"</preset>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
						if (type=="preset_load")
						{
							szRetInfo = m_szSuccessState+getNodeValue("Mgopresssuc");
						}
						else if(type=="preset_set")
						{
							szRetInfo = m_szSuccessState+getNodeValue("Msetsucc");
						}
						else
						{
							szRetInfo = m_szSuccessState+getNodeValue("MCleansucc");
						}
						
					}
					else
					{
						szRetInfo=  m_szErrorState+getNodeValue("Mopterr")
					}
				});
			$("#SetResultTipsPTZ").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsPTZ").html("");},2000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr);
		}
	});
}
function btnPresetOK(){
	var PresetName=$("#PresetName").val()
	if(!CheckDevUserName(PresetName,'PresetNametips','jsPresetName',0))
	{
	    return;
	}
	
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml +=  authenticationinfo;
	szXml += "<ptzevent>"+"preset_set"+"</ptzevent>";
	szXml += "<preset>"+SetIdOK+"</preset>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
	$("#PresetId"+SetIdOK).html(PresetName)
	$.modal.impl.close();		
};
function EditPreset(etId){
	}
/*恢复默认*/
function colordef(obj){
	
	//if (confirm(getNodeValue("MAsk"))){	
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	   var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/def/color"
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
           
		    $(xmlDoc).find("statuscode").each(function(i){ 
				var state= $(this).text();
				 if("0" == state)	//OK
				 {
					//szRetInfo = m_szSuccessState+getNodeValue('MRestoredesuccess');
					GetColor();
				 }
				});
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj,"SaveImages");
		}
	});
  // }
}

/*************************************************
Function:		Getscnlist
Description:	获取场景列表
Input:			无			
Output:			无
return:			无				
*************************************************/
function Getscnlist(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/scnmode/list"
	//var szURL=m_lHttp+camera_hostname+":"+camera_port+"/scnmodelist.xml"
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
			$("#ulmode").empty();
			if($(xmlDoc).find("defmodelist").length > 0)
			{
				$(xmlDoc).find("defmodelist").each(function(i){ 
					var g_defmodesize = $(this).find('mode').length;
					
					for (var i=1;i<=g_defmodesize;i++){
						var g_name=$(this).find('mode').eq(i-1).text();
						$("<li id='"+g_name+"' title='"+TurnScnText(g_name)+"' onclick='scnload(this,"+'"def"'+","+i+")'>"+"<label name='M"+g_name+"' style='cursor:pointer;'>"+TurnScnText(g_name)+"</label>"+"</option>").appendTo("#ulmode");
					}
					//$("<li onclick='addscn(this)'>"+"<label name='Mscnsave' style='cursor:pointer;'>"+getNodeValue('Mscnsave')+"</label>"+"</option>").appendTo("#ulmode");
				});
			};
			
			//解析自定义方案
			if($(xmlDoc).find("custommodelist").length > 0)
			{
				$(xmlDoc).find("custommodelist").each(function(i){ 
					g_custommodesize = $(this).find('mode').length;
					g_strmax=$(this).attr('strmax')
					g_listmax=$(this).attr('listmax');
				    $("#scnname").attr('maxlength',g_strmax);
					for (var i=1;i<=g_custommodesize;i++){
						 var g_name=$(this).find('mode').eq(i-1).text();
						 var g_nametitle=$(this).find('mode').eq(i-1).text();
						 if($.lengthw(g_name) > 8  ){
								g_name = g_name.substring(0,8) + "...";
						 }
						//$("<li id='"+g_nametitle+"' title='"+g_nametitle+"' style='background:#fff;'>"+"<i class='delicon' onclick='delscn("+i+")'></i>"+"<span style='display:block;' onclick='scnload(this,"+'"custom"'+","+i+")'>"+g_name+"</span>"+"</option>").appendTo("#ulmode");
						$("<li id='"+g_nametitle+"' title='"+g_nametitle+"'>"+"<span style='display:block;' onclick='scnload(this,"+'"custom"'+","+i+")'>"+g_name+"</span>"+"</option>").appendTo("#ulmode");
					}
				});
			};
			
			$("#ulmode").find("li").each(function() {
					$(this).hover(function () {
						   $(this).addClass("trOdd");
						},function () {
						   $(this).removeClass("trOdd")
						}
					);
				});
			
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj,"SaveImages");
		}
	});
};
/*************************************************
Function:		TurnScnText
Description:	将类型字符串成文字
Output:			无
return:			无				
*************************************************/
function TurnScnText(iText)
{
	var szText = '';
	if('standard' == iText)
	{
		szText = getNodeValue('Mstandard');    //标准
	}
	else if('court' == iText)
	{
		szText = getNodeValue('Mcourt');    //法庭
	}
	return szText;
}
//加载场景
function scnload(obj,type,tid){
	var szXml = "<scnmodeinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	{
		szXml += "<index type='"+type+"'>"+tid+"</index>";
	}
	szXml += "</scnmodeinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/scnmode/load"
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
					    //initImagegGetCap("brightness=true&contrast=true&saturation=true&hue=true&focus=true&whitebalance=true&dynamicmode=true&imageenhance=true&Iris=true&shutter=true&powerlinefrequency=true&corridormode=true&localecho=true&noisereduce2d=true&noisereduce3d=true&gain=true&ircutfilter=true&imagemode=true&wdr=true&fogthrough=true&gamma=true&laser=true&infrared=true&antishake=true");
						GetColor();    //图像信息
  						Getscnlist();   //初始化场景列表 
						$('#ulmode').hide();
					}else{
						//szRetInfo=  m_szErrorState+m_szError1;
					}
				});
			//$("#SetResultImagsSettingsTips").html(szRetInfo);
			//setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},2000);  //2秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});
};
function scnshow(){
	$("#ulmode").show();
}
//弹出参数另存窗口
function addscn(){
	//$("#mainplugin").width(1).height(1)
	$("#ScnResultTips").html('');
	if (g_custommodesize >= g_listmax){
	//	$("#mainplugin").height(254).width(352);
		alert("数据已满，请删除后添加");
		return;
	}
	$("#divScnTable").modal(
		{
			"close":false,
			"autoResize":false,
			"position":[90]
		 }
	  );
	 $("#simplemodal-container").width(620).height("auto");
};
//保存方案
function ScnOKclick(){
	if(!checkDeviceNameValidiDevice($("#scnname").val(),'scnnametips','Mgbencvideoname',g_strmax))
    {
		return;
    }
	var szXml = "<scnmodeinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	{
		szXml += "<mode index='"+(parseInt(g_custommodesize)+parseInt(1))+"'>"+$("#scnname").val()+"</mode>";
	}
	szXml += "</scnmodeinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/scnmode/save"
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
					//	szRetInfo = m_szSuccessState+m_szSuccess1;
						$.modal.impl.close();
						$('#ulmode').hide();
						$("#mainplugin").height(254).width(352);
						Getscnlist();
					}else{
						//szRetInfo=  m_szErrorState+m_szError1;
					}
				});
			//$("#ScnResultTips").html(szRetInfo);
			//setTimeout(function(){$("#ScnResultTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});
}
function delscn(tid){
	var szXml = "<scnmodeinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	{
		szXml += "<index>"+tid+"</index>";
	}
	szXml += "</scnmodeinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/scnmode/delete"
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
						//$.modal.impl.close();
						$('#ulmode').hide();
						Getscnlist();
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;
					}
				});
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},2000);  //2秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});
	
}
function CleanScn(){
	$.modal.impl.close();
}
