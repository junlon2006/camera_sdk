document.charset = "utf-8";

var g_szbrightnesslevel=null;
var g_szcontrastlevel=null;
var g_szsaturationlevel=null;
var g_szhuelevel=null;
var g_focusmin=false, g_focusmax=false,k_szfocusmin=null,k_szfocusmax=null;
var image_wdr=false,image_hlc=false, image_blc=false, image_fogthroughlevel=false, image_gammalevel=false, image_smartirlevel=false;
var g_gainthresholdShow="false";  //是否支持增益日夜转换阈值
var g_photothresholdShow="false";  //是否支持光敏日夜转换阈值


var g_szirislevel=null;  //光圈灵敏度
var ImagsSettings = {
	tabs: null	// 
};
//图像效果
function ImagsSets() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(ImagsSets);
pr(ImagsSets).update = function() {
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["imagssettings", "displaysettings"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	$("#StartImages").attr("name","Mstartdraw").val(getNodeValue('Mstartdraw'));
	ClickBlack();  //点击隐藏显示效果
	initdisplaysetting();
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

function ClickBlack(){
     $('.foldContent').eq(0).show();
	  $("li>h5","#questions").bind("click",function(){
			var li=$(this).parent();
			if(li.hasClass("fold")){
				li.removeClass("fold");
				$(this).find("b").removeClass("UI-bubble").addClass("UI-ask");
				//li.find(".foldContent").slideDown();
				li.find(".foldContent").show();
			}else{
				li.addClass("fold");
				$(this).find("b").removeClass("UI-ask").addClass("UI-bubble");
				//li.find(".foldContent").slideUp();
				li.find(".foldContent").hide();
			}
			if ($("#hegigtisp").height()>580){
				
				parent.$("#content").height(1220);
			   $("#contentright").height(1200);
			   $("#contentleft").height(1200);
			   $("#divImagsSets").height(1120);
			   parent.$("#contentframe").height(1220);
			  }
			  else
			  {
				  parent.$("#content").height(960);
				  parent.$("#contentframe").height(868);  
				 $("#contentleft").height(818);
				  $("#contentright").height(818);
				  $("#divImagsSets").height(740);
			}
		   
			
		 });
	autoResizeIframe();
};

function initdisplaysetting(){
	if(document.all)
	   {
			$("#mainplugin").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="plugin0"  width="100%" height="100%" ></object>')
		   }
	   else
		   {
			$("#mainplugin").html('<embed id="plugin0" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
		  }
		  
   Plugin();
   if (m_PreviewOCX!=null)
   {
	   plugin= top.parent.document.getElementById("IpcCtrl")
	   var plugin0=document.getElementById("plugin0")
	   plugin0.setPluginType("imagevideo");
	   
	   if ($.cookie('authenticationinfo')==null || $.cookie('authenticationinfo')==''){
			var ret=plugin0.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),'','',''); //开始播放
		}else{
		    var ret=plugin0.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'),UserNameLogin,UserPassLogin);  //开始播放	
		}
		 plugin0.eventWebToPlugin("changelanguage",parent.translator.szCurLanguage)
  		 loadBackPlay(document.getElementById("plugin0"));
   }
	
   //slider();
    //ImagesInfo()
 //  Getcap();  //能力集
 
 /*
 dynamicmode  动态调节/图像增强
  saturation 饱和度
  hue  锐度
  gain  曝光
  whitebalance  白平衡
  ircutfilter   日夜转换
  localecho  本地回显
  imagemode  翻转
   图像增加互斥功能imageenhance
   
   wdr/> 宽动态             <!—req, xs:integer -->
<blc/>背光补偿
<hlc/>强光抑制
<fogthrough />透雾
<gamma />geamma
laser 激光
infrared 红外
corridormode 走廊模式

 */
 /***********
 brightness   --亮度
 contrast     --对比度
 saturation   --饱和度
 hue          --锐度
 focus        --聚焦
 whitebalance --白平衡
 dynamicmode  --动态调节
 imageenhance --图像增强
 wdr          --宽动态
 blc          --强光抑制  00
 hlc          --背光补偿  00
 fogthrough   --透雾
 gamma        --Gamma
 SmartIR      --SmartIR  00
 antishake    --防抖
 ircutfilter  --日夜切换
 Iris         --光圈
 shutter      --快门
 gain         --增益
 corridormode --走廊模式
 imagemode    --镜像模式
 imagetrun    --图像翻转 00
 noisereduce2d-2D降噪
 noisereduce3d-3D降噪
 localecho    --本地回显
 hdsdi        --HDSDI  00
 powerlinefrequency--防闪烁
 laser        --激光
 infrared     --红外
 ***********/
 
 
 
   initImagegGetCap("brightness=true&contrast=true&saturation=true&hue=true&focus=true&whitebalance=true&dynamicmode=true&imageenhance=true&Iris=true&shutter=true&powerlinefrequency=true&corridormode=true&localecho=true&noisereduce2d=true&noisereduce3d=true&gain=true&ircutfilter=true&imagemode=true&wdr=true&fogthrough=true&gamma=true&laser=true&infrared=true&antishake=true");
   GetImages();    //图像信息
   Getscnlist();   //初始化场景列表  
  // SelectGainMax();   //增益下拉0-42
	//Getfocus();  //聚焦
	//Get2dlevel();  //2D降嗓
	//Get3dlevel();  //3D降嗓
	//Getdynamicmode() //背光模式 动态调节
	//GetIrcutfilter();  //日夜切换
	// Getwhiteblance();   //白平衡
	//GetIris();   //光圈
	//GetShutter121();   //快门
	//GetGain();  //增益
	//GetPowerlinefrequency();   //防闪烁
	//GetCorridormode();  //走廊模式
	//Getimagemode();  //镜像模式
    //Getlocalecho();   //本地回显
	//GetAntishake();   //防抖
	autoResizeIframe();
}

/********获取能力集****/
function initImagegGetCap(obj){
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
				//	亮度
				if($(xmlDoc).find("brightness").length > 0){
					$(xmlDoc).find("brightness").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#sublightness").hide();
						}else{
							$("#sublightness").show();
						}
					});
			    }
				//对比度
				if($(xmlDoc).find("contrast").length > 0){
					$(xmlDoc).find("contrast").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#subcontrast").hide();
						}else{
							$("#subcontrast").show();
						}
					});
			    }
				
				//	支持饱和度
				if($(xmlDoc).find("saturation").length > 0){
					$(xmlDoc).find("saturation").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#subsaturation").hide();
						}else{
							$("#subsaturation").show();
						}
					});
			    }
				//	支持锐度
				if($(xmlDoc).find("hue").length > 0){
					$(xmlDoc).find("hue").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#subsharpness").hide();
						}else{
							$("#subsharpness").show();
						}
					});
			    }
				//	支持聚焦
				if($(xmlDoc).find("focus").length > 0){
					$(xmlDoc).find("focus").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#focus").hide();
						}else{
							Getfocus();  //聚焦
							$("#focus").show();
						}
					});
			    }
				
				//	支持白平衡
				if($(xmlDoc).find("whitebalance").length > 0){
					$(xmlDoc).find("whitebalance").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#whiteblance").hide();
						}else{
							Getwhiteblance();   //白平衡
							$("#whiteblance").show();
						}
					});
			    }
				
				//	支持图像增强--动态调节
				if($(xmlDoc).find("dynamicmode").length > 0){
					$(xmlDoc).find("dynamicmode").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#ImageEnhancement").hide();
						}else{
							Getdynamicmode();
							$("#ImageEnhancement").show();
						}
					});
			    }
				
				//	支持图像增强--图像增强
				if($(xmlDoc).find("imageenhance").length > 0){
					$(xmlDoc).find("imageenhance").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#subimageenhance").hide();
						}
						else{
							$("#subimageenhance").show();
							Getimageenhancemode() //图像增强
						}
					});
			    }
				
				//	支持快门
				if($(xmlDoc).find("shutter").length > 0){
					$(xmlDoc).find("shutter").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#subshutter").hide();
						}
						else{
							GetShutter121();   //快门
							$("#subshutter").show();
						}
					});
			    }

				
				//光圈
				if($(xmlDoc).find("Iris").length > 0){
					$(xmlDoc).find("Iris").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#subIris").hide();
						}else{
							GetIris();   //光圈
							$("#subIris").show();
						}
					});
			    }
				
				
				//防闪烁
				if($(xmlDoc).find("powerlinefrequency").length > 0){
					$(xmlDoc).find("powerlinefrequency").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#subAntiFlickerMode").hide();
						}else{
							GetPowerlinefrequency();   //防闪烁
							$("#subAntiFlickerMode").show();
						}
					});
			    }
				
				
				//	支持曝光
				if($(xmlDoc).find("gain").length > 0){
					$(xmlDoc).find("gain").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#exposure").hide();
						}else{
							GetGain();
							$("#exposure").show();
						}
					});
			    }
				
				
				//	支持日夜转换
				if($(xmlDoc).find("ircutfilter").length > 0){
					$(xmlDoc).find("ircutfilter").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#ircutfilter").hide();
						}else{
							GetIrcutfilter();  //日夜切换
							$("#ircutfilter").show();
						}
					});
			    }
				
				//激光
				if($(xmlDoc).find("laser").length > 0){
					$(xmlDoc).find("laser").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#sublilaser").hide();
						}else{
							getlaser();  //获取激光
							$("#sublilaser").show();
						}
					});
			    }
				
				//红外
				if($(xmlDoc).find("infrared").length > 0){
					$(xmlDoc).find("infrared").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#subliinfrared").hide();
						}else{
							getinfrared();  //获取激光
							$("#subliinfrared").show();
						}
					});
			    }
				
				
				//	支持图像增强--宽动态
				if($(xmlDoc).find("wdr").length > 0){
					$(xmlDoc).find("wdr").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#exclusion_wdrEnable").hide();
							$("#exclusion_wdr").hide();
						}
						else
						{
							$("#exclusion_wdrEnable").show();
							$("#exclusion_wdr").show();
							getdynamicmode('wdr');
						}
					});
			    }
				
//<hlc/>强光抑制
//<fogthrough />透雾
//<gamma />geamma
				
				//	支持图像增强--背光补偿
				/*if($(xmlDoc).find("blc").length > 0){
					$(xmlDoc).find("blc").each(function(i){ 
					  if($(this).text()!="true")
						{
							
						}
						else
						{
							
							//getdynamicmode('blc');
						}
					});
			    }
				
				//	支持图像增强--强光抑制
				if($(xmlDoc).find("hlc").length > 0){
					$(xmlDoc).find("hlc").each(function(i){ 
					  if($(this).text()!="true")
						{
							
						}
						else
						{
							
							//getdynamicmode('hlc');
						}
					});
			    }*/
				
				//	支持图像增强--透雾
				if($(xmlDoc).find("fogthrough").length > 0){
					$(xmlDoc).find("fogthrough").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#exclusion_fogthroughEnable").hide();
							$("#exclusion_subfogthrough").hide();
						}
						else
						{
							$("#exclusion_fogthroughEnable").show();
							$("#exclusion_subfogthrough").show();
							getdynamicmode('fogthrough');
						}
					});
			    }
				
				//	支持图像增强--gamma
				if($(xmlDoc).find("gamma").length > 0){
					$(xmlDoc).find("gamma").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#exclusion_gammaEnable").hide();
							$("#exclusion_subgamma").hide();
						}
						else
						{
							$("#exclusion_gammaEnable").show();
							$("#exclusion_subgamma").show();
							getdynamicmode('gamma');
						}
					});
			    }
				
				//本地回显
				var bShowOther = false;
				if($(xmlDoc).find("localecho").length > 0){
					$(xmlDoc).find("localecho").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#subcvbsmode").hide();
						}else{
							Getlocalecho();
							$("#subcvbsmode").show();
							bShowOther  =true; 
						}
					});
			    }
				
				//走廊模式corridormode
				if($(xmlDoc).find("corridormode").length > 0){
					$(xmlDoc).find("corridormode").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#subcorridormode").hide();
						}else{
							GetCorridormode();  //走廊模式
							bShowOther  =true; 
							$("#subcorridormode").show();
						}
					});
			    }

				
				//镜像模式
				if($(xmlDoc).find("imagemode").length > 0){
					$(xmlDoc).find("imagemode").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#subimagemode").hide();
						}else{
							Getimagemode();
							$("#subimagemode").show();
							bShowOther  =true; 
						}
					});
			    }
				
				// 翻转与回显
				if(bShowOther)
				{
					$("#other").show();
				}
				else
				{
					$("#other").hide();
				}
				
				//2D降噪
				if($(xmlDoc).find("noisereduce2d").length > 0){
					$(xmlDoc).find("noisereduce2d").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#noisereduce2D").hide();
							$("#submode2d").hide();
						}else{
							Get2dlevel();  //2D降嗓
							$("#noisereduce2D").show();
							$("#submode2d").show();
						}
					});
			    }
				//3D降噪
				if($(xmlDoc).find("noisereduce3d").length > 0){
					$(xmlDoc).find("noisereduce3d").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#noisereduce3D").hide();
							$("#submode3d").hide();
						}else{
							Get3dlevel();  //3D降嗓
							$("#noisereduce3D").show();
							$("#submode3d").show();
						}
					});
			    }
				
				//防抖
				if($(xmlDoc).find("antishake").length > 0){
					$(xmlDoc).find("antishake").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#SubAntishake").hide();
						}else{
							GetAntishake();  //防抖
							$("#SubAntishake").show();
						}
					});
			    }

		}
	});
}
/********获取图像显示****/
function ImagesInfo(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/info"
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
		    g_szImagesInfoXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
}

//图像增强互斥
function getdynamicmode(obj){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/imageenhance/"+obj;
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
			 if (obj=="wdr")
			 {
				if($(xmlDoc).find("enabled").length > 0)
				 {
					if("true" == $(xmlDoc).find('enabled').eq(0).text())
					{
						$("#exclusion_wdr_enable").val(true).prop("checked", true);
					}
					else
					{
						$("#exclusion_wdr_enable").val(false).prop("checked", false);
					}
				 };
				 if($(xmlDoc).find("wdrlevel").length > 0)
				 {
					 $(xmlDoc).find("wdrlevel").each(function(i){ 
						  g_szexclusion_wdrlevel= Number($(this).text());
						  g_szexclusion_wdrlevelmin = Number($(this).attr('min'));
						  g_szexclusion_wdrlevelmax = Number($(this).attr('max'));
						  $("#exclusion_wdr_value").val(g_szexclusion_wdrlevel).attr('maxlength',$(this).attr('max').length);
						  GetSliderexclusion("exclusion",'wdr');
					});
				 } 
			 }
			 if(obj=="fogthrough")
			 {
				 if($(xmlDoc).find("enabled").length > 0)
				 {
					if("true" == $(xmlDoc).find('enabled').eq(0).text())
					{
						$("#exclusion_fogthrough_enable").val(true).prop("checked", true);
					}
					else
					{
						$("#exclusion_fogthrough_enable").val(false).prop("checked", false);
					}
				 };
				 if($(xmlDoc).find("fogthroughlevel").length > 0)
				 {
					 $(xmlDoc).find("fogthroughlevel").each(function(i){ 
						 g_szexclusion_fogthroughlevel= Number($(this).text());
						 g_szexclusion_fogthroughlevelmin = Number($(this).attr('min'));
						 g_szexclusion_fogthroughlevelmax = Number($(this).attr('max'));
						 $("#exclusion_fogthrough_value").val(g_szexclusion_fogthroughlevel).attr('maxlength',$(this).attr('max').length);
						 GetSliderexclusion("exclusion",'fogthrough');
					});
				 }
			 }
			if(obj=="gamma")
			 {
				 if($(xmlDoc).find("enabled").length > 0)
				 {
					if("true" == $(xmlDoc).find('enabled').eq(0).text())
					{
						$("#exclusion_gamma_enable").val(true).prop("checked", true);
					}
					else
					{
						$("#exclusion_gamma_enable").val(false).prop("checked", false);
					}
				 };
				 if($(xmlDoc).find("gammalevel").length > 0)
				 {
					 $(xmlDoc).find("gammalevel").each(function(i){ 
						  g_szexclusion_gammalevel= Number($(this).text());
						  g_szexclusion_gammalevelmin = Number($(this).attr('min'));
						  g_szexclusion_gammalevelmax = Number($(this).attr('max'));
						  $("#exclusion_gammaleve_value").val(g_szexclusion_gammalevel).attr('maxlength',$(this).attr('max').length);
						  GetSliderexclusion("exclusion",'gamma');
					});
				 }
			 }
			 
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};
//获取图像增强互斥灵敏度
function GetSliderexclusion(obj,typeid){
	 if (typeid=="wdr")
	 {
		$("#exclusion_slider_wdr").slider({
		  range: "min",
		  value: g_szexclusion_wdrlevel,
		  min: g_szexclusion_wdrlevelmin,
		  max: g_szexclusion_wdrlevelmax,
		  slide: function( event, ui ) {
			$("#exclusion_wdr_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#exclusion_wdr_value").val($( "#exclusion_slider_wdr" ).slider( "value" ));
			Setimageexclusion("exclusion","wdr");
		  }
		}); //灵敏度
		if($.browser.msie) {
			$('#exclusion_wdr_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#exclusion_wdr_value").val()))
					{
						  $("#exclusion_wdr_value").val($( "#exclusion_slider_wdr" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#exclusion_wdr_value").val()) < parseInt(g_szexclusion_wdrlevelmin) || parseInt($("#exclusion_wdr_value").val()) > parseInt(g_szexclusion_wdrlevelmax) ){
						 $("#exclusion_wdr_value").val($( "#exclusion_slider_wdr" ).slider( "value" ))
					}
					else
					{
						$("#exclusion_slider_wdr").slider( "value", $("#exclusion_wdr_value").val() );
						Setimageexclusion("exclusion","wdr");
					}
			  }
			});
		};//IE下回车
		$("#exclusion_wdr_value").change(function() {
			if (!CheackOnlyNum($("#exclusion_wdr_value").val()))
			{
				  $("#exclusion_wdr_value").val($( "#exclusion_slider_wdr" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#exclusion_wdr_value").val()) < parseInt(g_szexclusion_wdrlevelmin) || parseInt($("#exclusion_wdr_value").val()) > parseInt(g_szexclusion_wdrlevelmax) ){
				 $("#exclusion_wdr_value").val($( "#exclusion_slider_wdr" ).slider( "value" ))
			}
			else
			{
				$("#exclusion_slider_wdr").slider( "value", $("#exclusion_wdr_value").val() );
				Setimageexclusion("exclusion","wdr");
			}
		});  //手动改变值
	 }//wdr end
	 else if(typeid=="fogthrough")  //透雾
	 {
		  $( "#exclusion_slider_fogthrough" ).slider({
		  range: "min",
		  value: g_szexclusion_fogthroughlevel,
		  min: g_szexclusion_fogthroughlevelmin,
		  max: g_szexclusion_fogthroughlevelmax,
		  slide: function( event, ui ) {
			$("#exclusion_fogthrough_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#exclusion_fogthrough_value").val($( "#exclusion_slider_fogthrough" ).slider( "value" ));
			Setimageexclusion("exclusion","fogthrough");
		  }
		 });
			 if($.browser.msie) {
				$('#exclusion_fogthrough_value').keydown(function(e){
				  if(e.keyCode==13)
				  {
					  if (!CheackOnlyNum($("#exclusion_fogthrough_value").val()))
						{
							  $("#exclusion_fogthrough_value").val($( "#exclusion_slider_fogthrough" ).slider( "value" ))
							  return;
						}
						if (parseInt($("#exclusion_fogthrough_value").val()) < parseInt(g_szexclusion_fogthroughlevelmin) || parseInt($("#exclusion_fogthrough_value").val()) > parseInt(g_szexclusion_fogthroughlevelmax) ){
							 $("#exclusion_fogthrough_value").val($( "#exclusion_slider_fogthrough" ).slider( "value" ))
						}
						else
						{
							$("#exclusion_slider_fogthrough").slider( "value", $("#exclusion_fogthrough_value").val() );
							Setimageexclusion("exclusion","fogthrough");
						}
				  }
				});
			};
			$( "#exclusion_fogthrough_value" ).change(function() {
				if (!CheackOnlyNum($("#exclusion_fogthrough_value").val()))
				{
					  $("#exclusion_fogthrough_value").val($("#exclusion_slider_fogthrough").slider( "value" ))
					  return;
				}
				if (parseInt($("#exclusion_fogthrough_value").val()) < parseInt(g_szexclusion_fogthroughlevelmin) || parseInt($("#exclusion_fogthrough_value").val()) > parseInt(g_szexclusion_fogthroughlevelmax) ){
					 $("#exclusion_fogthrough_value").val($("#exclusion_slider_fogthrough").slider("value"))
				}
				else
				{
					$("#exclusion_slider_fogthrough").slider( "value", $("#exclusion_fogthrough_value").val() );
					Setimageexclusion("exclusion","fogthrough");
				}
			});
	 }//透雾 end
	 else if(typeid=="gamma")//gamma
	 {
		 $( "#exclusion_slider_gammaleve" ).slider({
		  range: "min",
		  value: g_szexclusion_gammalevel,
		  min: g_szexclusion_gammalevelmin,
		  max: g_szexclusion_gammalevelmax,
		  slide: function( event, ui ) {
			$("#exclusion_gammaleve_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#exclusion_gammaleve_value").val($( "#exclusion_slider_gammaleve" ).slider( "value" ));
			Setimageexclusion("exclusion","gamma");
		  }
		 });
		if($.browser.msie) {
			$('#exclusion_gammaleve_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#exclusion_gammaleve_value").val()))
					{
						  $("#exclusion_gammaleve_value").val($( "#exclusion_slider_gammaleve" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#exclusion_gammaleve_value").val()) < parseInt(g_szexclusion_gammalevelmin) || parseInt($("#exclusion_gammaleve_value").val()) > parseInt(g_szexclusion_gammalevelmax) ){
						 $("#exclusion_gammaleve_value").val($( "#exclusion_slider_gammaleve" ).slider( "value" ))
					}
					else
					{
						$("#exclusion_slider_gammaleve").slider( "value", $("#exclusion_gammaleve_value").val() );
						Setimageexclusion("exclusion","gamma");
					}
			  }
			});
		};
		$( "#exclusion_gammaleve_value" ).change(function() {
			if (!CheackOnlyNum($("#exclusion_gammaleve_value").val()))
			{
				  $("#exclusion_gammaleve_value").val($( "#exclusion_slider_gammaleve" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#exclusion_gammaleve_value").val()) < parseInt(g_szexclusion_gammalevelmin) || parseInt($("#exclusion_gammaleve_value").val()) > parseInt(g_szexclusion_gammalevelmax) ){
				 $("#exclusion_gammaleve_value").val($( "#imageenhance_slider_Gammaleve" ).slider( "value" ))
			}
			else
			{
				$("#exclusion_slider_gammaleve").slider( "value", $("#exclusion_gammaleve_value").val() );
				Setimageexclusion("exclusion","gamma");
			}
		});
	 }
};
function SetCheckBox(obj,typeid){
	if (typeid=="wdr"){ //宽动态
		//$("#imageenhance_wdr_enable").val(true).prop("checked", true);
		if($("#exclusion_wdr_enable").prop("checked"))
		{ //选中
		  $("#exclusion_wdr_enable").val(true).prop("checked", true);
		  Setimageexclusion("exclusion","wdr");
		}
		else
		{
		  $("#exclusion_wdr_enable").val(false).prop("checked", false);
		   Setimageexclusion("exclusion","wdr");
		}
	}
	else if(typeid=="fogthrough")  //透雾启用
	{
		if($("#exclusion_fogthrough_enable").prop("checked"))
		{ //选中
		  $("#exclusion_fogthrough_enable").val(true).prop("checked", true);
		  Setimageexclusion("exclusion","fogthrough");
		}
		else
		{
		  $("#exclusion_fogthrough_enable").val(false).prop("checked", false);
		   Setimageexclusion('imageenhance','fogthrough');
		}
	}
	else if(typeid=="gamma")  //Gamma启用
	{
		if($("#exclusion_gamma_enable").prop("checked"))
		{ //选中
		  $("#exclusion_gamma_enable").val(true).prop("checked", true);
		  Setimageexclusion("exclusion","gamma");
		}
		else
		{
		  $("#exclusion_gamma_enable").val(false).prop("checked", false);
		  Setimageexclusion("exclusion","gamma");
		}
	}
};
/*************************************************
Function:		Setimageexclusion
Description:	设置互斥图像增强
Input:			无			
Output:			无
return:			无				
*************************************************/
function Setimageexclusion(obj,typeid){
	var szXml = "<dynamicmodeInfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	if (typeid=="wdr")
	{
		szXml += "<enabled>"+$("#exclusion_wdr_enable").val()+"</enabled>";
		szXml += "<wdrlevel>"+$("#exclusion_wdr_value").val()+"</wdrlevel>";
	}
	else if(typeid=="gamma")  //gamma等级
	{
		szXml += "<enabled>"+$("#exclusion_gamma_enable").val()+"</enabled>";
		szXml += "<gammalevel>"+$("#exclusion_gammaleve_value").val()+"</gammalevel>";
	}
	else if(typeid=="fogthrough") //透雾
	{
		szXml += "<enabled>"+$("#exclusion_fogthrough_enable").val()+"</enabled>";
		szXml += "<fogthroughlevel>"+$("#exclusion_fogthrough_value").val()+"</fogthroughlevel>";
	}
	szXml += "</dynamicmodeInfo>";
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/imageenhance/"+typeid;
	var xmlDoc = parseXmlFromStr(szXml);
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
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};
/*************************************************
Function:		StartRealPlay
Description:	开始预览
*************************************************/
function StartRealPlayI() {
	document.getElementById("plugin0").eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'),UserNameLogin,UserPassLogin);
}


//宽动态灵敏度
function Sliderwdr(obj){
	 if (obj=="imageenhance")
	 {
		 $( "#imageenhance_slider_wdr" ).slider({
		  range: "min",
		  value: g_szimageenhance_wdrlevel,
		  min: g_szimageenhance_wdrlevelmin,
		  max: g_szimageenhance_wdrlevelmax,
		  slide: function( event, ui ) {
			$("#imageenhance_wdr_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#imageenhance_wdr_value").val($( "#imageenhance_slider_wdr" ).slider( "value" ));
			Setbacklightmode("imageenhance","wdr");
		  }
		});
		if($.browser.msie) {
			$('#imageenhance_wdr_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#imageenhance_wdr_value").val()))
					{
						  $("#imageenhance_wdr_value").val($( "#imageenhance_slider_wdr" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#imageenhance_wdr_value").val()) < parseInt(g_szimageenhance_wdrlevelmin) || parseInt($("#imageenhance_wdr_value").val()) > parseInt(g_szimageenhance_wdrlevelmax) ){
						 $("#imageenhance_wdr_value").val($( "#imageenhance_slider_wdr" ).slider( "value" ))
					}
					else
					{
						$("#imageenhance_slider_wdr").slider( "value", $("#imageenhance_wdr_value").val() );
						Setbacklightmode("imageenhance","wdr");
					}
			  }
			});
		};
		$( "#imageenhance_wdr_value" ).change(function() {
			if (!CheackOnlyNum($("#imageenhance_wdr_value").val()))
			{
				  $("#imageenhance_wdr_value").val($( "#imageenhance_slider_wdr" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#imageenhance_wdr_value").val()) < parseInt(g_szimageenhance_wdrlevelmin) || parseInt($("#imageenhance_wdr_value").val()) > parseInt(g_szimageenhance_wdrlevelmax) ){
				 $("#imageenhance_wdr_value").val($( "#imageenhance_slider_wdr" ).slider( "value" ))
			}
			else
			{
				$("#imageenhance_slider_wdr").slider( "value", $("#imageenhance_wdr_value").val() );
				Setbacklightmode("imageenhance","wdr");
			}
		});

	 }
	 else
	 {
		$( "#slider_wdr" ).slider({
		  range: "min",
		  value: g_szwdrlevel,
		  min: g_szwdrlevelmin,
		  max: g_szwdrlevelmax,
		  slide: function( event, ui ) {
			$("#wdr_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#wdr_value").val($( "#slider_wdr" ).slider( "value" ));
			Setbacklightmode('','wdrlevel');
		  }
		});
		if($.browser.msie) {
			$('#wdr_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#wdr_value").val()))
					{
						  $("#wdr_value").val($( "#slider_wdr" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#wdr_value").val()) < parseInt(g_szwdrlevelmin) || parseInt($("#wdr_value").val()) > parseInt(g_szwdrlevelmax) ){
						 $("#wdr_value").val($( "#slider_wdr" ).slider( "value" ))
					}
					else
					{
						$("#slider_wdr").slider( "value", $("#wdr_value").val() );
						Setbacklightmode('','wdrlevel');
					}
			  }
			});
		};
		$( "#wdr_value" ).change(function() {
			if (!CheackOnlyNum($("#wdr_value").val()))
			{
				  $("#wdr_value").val($( "#slider_wdr" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#wdr_value").val()) < parseInt(g_szwdrlevelmin) || parseInt($("#wdr_value").val()) > parseInt(g_szwdrlevelmax) ){
				 $("#wdr_value").val($( "#slider_wdr" ).slider( "value" ))
			}
			else
			{
				$("#slider_wdr").slider( "value", $("#wdr_value").val() );
				Setbacklightmode('','wdrlevel');
			}
		});

	 }
};
//强光抑制
function Slidehlc(obj){
	 if (obj=="imageenhance")
	 {
		 $( "#imageenhance_slider_hlc" ).slider({
		  range: "min",
		  value: g_szimageenhance_hlclevel,
		  min: g_szimageenhance_hlclevelmin,
		  max: g_szimageenhance_hlclevelmax,
		  slide: function( event, ui ) {
			$("#imageenhance_hlc_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#imageenhance_hlc_value").val($( "#imageenhance_slider_hlc" ).slider( "value" ));
			Setbacklightmode("imageenhance","hlc");
		  }
		});
		if($.browser.msie) {
			$('#imageenhance_hlc_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#imageenhance_hlc_value").val()))
					{
						  $("#imageenhance_hlc_value").val($( "#imageenhance_slider_hlc" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#imageenhance_hlc_value").val()) < parseInt(g_szimageenhance_hlclevelmin) || parseInt($("#imageenhance_hlc_value").val()) > parseInt(g_szimageenhance_hlclevelmax) ){
						 $("#imageenhance_hlc_value").val($( "#imageenhance_slider_hlc" ).slider( "value" ))
					}
					else
					{
						$("#imageenhance_slider_hlc").slider( "value", $("#imageenhance_hlc_value").val() );
						Setbacklightmode("imageenhance","hlc");
					}
			  }
			});
		};
		$( "#imageenhance_hlc_value" ).change(function() {
			if (!CheackOnlyNum($("#imageenhance_hlc_value").val()))
			{
				  $("#imageenhance_hlc_value").val($( "#imageenhance_slider_hlc" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#imageenhance_hlc_value").val()) < parseInt(g_szimageenhance_hlclevelmin) || parseInt($("#imageenhance_hlc_value").val()) > parseInt(g_szimageenhance_hlclevelmax) ){
				 $("#imageenhance_hlc_value").val($( "#imageenhance_slider_hlc" ).slider( "value" ))
			}
			else
			{
				$("#imageenhance_slider_hlc").slider( "value", $("#imageenhance_hlc_value").val() );
				Setbacklightmode("imageenhance","hlc");
			}
		});
	 }
	 else
	 {
		$( "#slider_hlc" ).slider({
		  range: "min",
		  value: g_szhlclevel,
		  min: g_szhlclevelmin,
		  max: g_szhlclevelmax,
		  slide: function( event, ui ) {
			$("#hlc_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#hlc_value").val($( "#slider_hlc" ).slider( "value" ));
			Setbacklightmode('','hlclevel');
		  }
		});
		if($.browser.msie) {
			$('#hlc_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#hlc_value").val()))
					{
						  $("#hlc_value").val($( "#slider_hlc" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#hlc_value").val()) < parseInt(g_szhlclevelmin) || parseInt($("#hlc_value").val()) > parseInt(g_szhlclevelmax) ){
						 $("#hlc_value").val($( "#slider_hlc" ).slider( "value" ))
					}
					else
					{
						$("#slider_hlc").slider( "value", $("#hlc_value").val() );
						Setbacklightmode('','hlclevel');
					}
			  }
			});
		};
		$( "#hlc_value" ).change(function() {
			if (!CheackOnlyNum($("#hlc_value").val()))
			{
				  $("#hlc_value").val($( "#slider_hlc" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#hlc_value").val()) < parseInt(g_szhlclevelmin) || parseInt($("#hlc_value").val()) > parseInt(g_szhlclevelmax) ){
				 $("#hlc_value").val($( "#slider_hlc" ).slider( "value" ))
			}
			else
			{
				$("#slider_hlc").slider( "value", $("#hlc_value").val() );
				Setbacklightmode('','hlclevel');
			}
		});
	 }
};
//背光补偿灵敏度
function Sliderautoblc(obj){
	 if (obj=="imageenhance")
	 {
		 $( "#imageenhance_slider_autoblc" ).slider({
		  range: "min",
		  value: g_szimageenhance_blclevel,
		  min: g_szimageenhance_blclevelmin,
		  max: g_szimageenhance_blclevelmax,
		  slide: function( event, ui ) {
			$("#imageenhance_autoblc_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#imageenhance_autoblc_value").val($( "#imageenhance_slider_autoblc" ).slider( "value" ));
			Setbacklightmode("imageenhance","autoblc");
		  }});
		$("#imageenhance_autoblc_value").val($( "#imageenhance_slider_autoblc" ).slider( "value" ))
	 }
	 else
	 {
		$( "#slider_autoblc" ).slider({
		  range: "min",
		  value: g_szblclevel,
		  min: g_szblclevelmin,
		  max: g_szblclevelmax,
		  slide: function( event, ui ) {
			$("#autoblc_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#autoblc_value").val($( "#slider_autoblc" ).slider( "value" ));
			Setbacklightmode('','autoblc');
		  }
		});
		if($.browser.msie) {
				$('#autoblc_value').keydown(function(e){
				  if(e.keyCode==13)
				  {
					  if (!CheackOnlyNum($("#autoblc_value").val()))
						{
							  $("#autoblc_value").val($( "#slider_autoblc" ).slider( "value" ))
							  return;
						}
						if (parseInt($("#autoblc_value").val()) < parseInt(g_szblclevelmin) || parseInt($("#autoblc_value").val()) > parseInt(g_szblclevelmax) ){
							 $("#autoblc_value").val($( "#slider_autoblc" ).slider( "value" ))
						}
						else
						{
							$("#slider_autoblc").slider( "value", $("#autoblc_value").val() );
							Setbacklightmode('','autoblc');
						}
				  }
				});
			};
			$( "#autoblc_value" ).change(function() {
				if (!CheackOnlyNum($("#autoblc_value").val()))
				{
					  $("#autoblc_value").val($( "#slider_autoblc" ).slider( "value" ))
					  return;
				}
				if (parseInt($("#autoblc_value").val()) < parseInt(g_szblclevelmin) || parseInt($("#autoblc_value").val()) > parseInt(g_szblclevelmax) ){
					 $("#autoblc_value").val($( "#slider_autoblc" ).slider( "value" ))
				}
				else
				{
					$("#slider_autoblc").slider( "value", $("#autoblc_value").val() );
				Setbacklightmode('','autoblc');
				}
			});
	 }
};
//透雾等级
function Slidefogthroughlevel(obj){
       if (obj=="imageenhance")
	   {
		 
		  $( "#imageenhance_slider_fogthrough" ).slider({
		  range: "min",
		  value: g_szimageenhance_fogthroughlevel,
		  min: g_szimageenhance_fogthroughlevelmin,
		  max: g_szimageenhance_fogthroughlevelmax,
		  slide: function( event, ui ) {
			$("#imageenhance_fogthrough_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#imageenhance_fogthrough_value").val($( "#imageenhance_slider_fogthrough" ).slider( "value" ));
			Setbacklightmode("imageenhance","fogthrough");
		  }
		 });
			 if($.browser.msie) {
				$('#imageenhance_fogthrough_value').keydown(function(e){
				  if(e.keyCode==13)
				  {
					  if (!CheackOnlyNum($("#imageenhance_fogthrough_value").val()))
						{
							  $("#imageenhance_fogthrough_value").val($( "#imageenhance_slider_fogthrough" ).slider( "value" ))
							  return;
						}
						if (parseInt($("#imageenhance_fogthrough_value").val()) < parseInt(g_szimageenhance_fogthroughlevelmin) || parseInt($("#imageenhance_fogthrough_value").val()) > parseInt(g_szimageenhance_fogthroughlevelmax) ){
							 $("#imageenhance_fogthrough_value").val($( "#imageenhance_slider_fogthrough" ).slider( "value" ))
						}
						else
						{
							$("#imageenhance_slider_fogthrough").slider( "value", $("#imageenhance_fogthrough_value").val() );
							Setbacklightmode("imageenhance","fogthrough");
						}
				  }
				});
			};
			$( "#imageenhance_fogthrough_value" ).change(function() {
				if (!CheackOnlyNum($("#imageenhance_fogthrough_value").val()))
				{
					  $("#imageenhance_fogthrough_value").val($( "#imageenhance_slider_fogthrough" ).slider( "value" ))
					  return;
				}
				if (parseInt($("#imageenhance_fogthrough_value").val()) < parseInt(g_szimageenhance_fogthroughlevelmin) || parseInt($("#imageenhance_fogthrough_value").val()) > parseInt(g_szimageenhance_fogthroughlevelmax) ){
					 $("#imageenhance_fogthrough_value").val($( "#imageenhance_slider_fogthrough" ).slider( "value" ))
				}
				else
				{
					$("#imageenhance_slider_fogthrough").slider( "value", $("#imageenhance_fogthrough_value").val() );
					Setbacklightmode("imageenhance","fogthrough");
				}
			});
	   }
	   else
	   {
		$("#fogthrough_value").val(g_szfogthroughlevel).attr('maxlength',$(this).attr('max').length);
		$( "#slider_fogthrough" ).slider({
		  range: "min",
		  value: g_szfogthroughlevel,
		  min: g_szfogthroughlevelmin,
		  max: g_szfogthroughlevelmax,
		  slide: function( event, ui ) {
			$("#fogthrough_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#fogthrough_value").val($( "#slider_fogthrough" ).slider( "value" ));
			Setbacklightmode('','fogthroughlevel');
		  }
		  });
		  if($.browser.msie) {
			$('#fogthrough_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#fogthrough_value").val()))
					{
						  $("#fogthrough_value").val($( "#slider_fogthrough" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#fogthrough_value").val()) < parseInt(g_szfogthroughlevelmin) || parseInt($("#fogthrough_value").val()) > parseInt(g_szfogthroughlevelmax) ){
						 $("#fogthrough_value").val($( "#slider_fogthrough" ).slider( "value" ))
					}
					else
					{
						$("#slider_fogthrough").slider( "value", $("#fogthrough_value").val() );
						Setbacklightmode('','fogthroughlevel');
					}
			  }
			});
		};
		$( "#fogthrough_value" ).change(function() {
			if (!CheackOnlyNum($("#fogthrough_value").val()))
			{
				  $("#fogthrough_value").val($( "#slider_fogthrough" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#fogthrough_value").val()) < parseInt(g_szfogthroughlevelmin) || parseInt($("#fogthrough_value").val()) > parseInt(g_szfogthroughlevelmax) ){
				 $("#fogthrough_value").val($( "#slider_fogthrough" ).slider( "value" ))
			}
			else
			{
				$("#slider_fogthrough").slider( "value", $("#fogthrough_value").val() );
				Setbacklightmode('','fogthroughlevel');
			}
		});
		
	   }
};
//geammal等级
function Slidgeammalevel(obj){
	if (obj=="imageenhance")
	{
		$( "#imageenhance_slider_Gammaleve" ).slider({
		  range: "min",
		  value: g_szimageenhance_gammalevel,
		  min: g_szimageenhance_gammalevelmin,
		  max: g_szimageenhance_gammalevelmax,
		  slide: function( event, ui ) {
			$("#imageenhance_Gammaleve_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#imageenhance_Gammaleve_value").val($( "#imageenhance_slider_Gammaleve" ).slider( "value" ));
			Setbacklightmode("imageenhance","gamma");
		  }
		 });
		if($.browser.msie) {
			$('#imageenhance_Gammaleve_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#imageenhance_Gammaleve_value").val()))
					{
						  $("#imageenhance_Gammaleve_value").val($( "#imageenhance_slider_Gammaleve" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#imageenhance_Gammaleve_value").val()) < parseInt(g_szimageenhance_gammalevelmin) || parseInt($("#imageenhance_Gammaleve_value").val()) > parseInt(g_szimageenhance_gammalevelmax) ){
						 $("#imageenhance_Gammaleve_value").val($( "#imageenhance_slider_Gammaleve" ).slider( "value" ))
					}
					else
					{
						$("#imageenhance_slider_Gammaleve").slider( "value", $("#imageenhance_Gammaleve_value").val() );
						Setbacklightmode("imageenhance","gamma");
					}
			  }
			});
		};
		$( "#imageenhance_Gammaleve_value" ).change(function() {
			if (!CheackOnlyNum($("#imageenhance_Gammaleve_value").val()))
			{
				  $("#imageenhance_Gammaleve_value").val($( "#imageenhance_slider_Gammaleve" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#imageenhance_Gammaleve_value").val()) < parseInt(g_szimageenhance_gammalevelmin) || parseInt($("#imageenhance_Gammaleve_value").val()) > parseInt(g_szimageenhance_gammalevelmax) ){
				 $("#imageenhance_Gammaleve_value").val($( "#imageenhance_slider_Gammaleve" ).slider( "value" ))
			}
			else
			{
				$("#imageenhance_slider_Gammaleve").slider( "value", $("#imageenhance_Gammaleve_value").val() );
				Setbacklightmode("imageenhance","gamma");
			}
		});

	}
	else
	{
		$( "#slider_Gammaleve" ).slider({
		  range: "min",
		  value: g_szgammalevel,
		  min: g_szgammalevelmin,
		  max: g_szgammalevelmax,
		  slide: function( event, ui ) {
			$("#Gammaleve_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#Gammaleve_value").val($( "#slider_Gammaleve" ).slider( "value" ));
			Setbacklightmode('','gammalevel');
		  }
	   });
	   if($.browser.msie) {
			$('#Gammaleve_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#Gammaleve_value").val()))
					{
						  $("#Gammaleve_value").val($( "#slider_Gammaleve" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#Gammaleve_value").val()) < parseInt(g_szgammalevelmin) || parseInt($("#Gammaleve_value").val()) > parseInt(g_szgammalevelmax) ){
						 $("#Gammaleve_value").val($( "#slider_Gammaleve" ).slider( "value" ))
					}
					else
					{
						$("#slider_Gammaleve").slider( "value", $("#Gammaleve_value").val() );
						Setbacklightmode('','gammalevel');
					}
			  }
			});
		};
		$( "#Gammaleve_value" ).change(function() {
			if (!CheackOnlyNum($("#Gammaleve_value").val()))
			{
				  $("#Gammaleve_value").val($( "#slider_Gammaleve" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#Gammaleve_value").val()) < parseInt(g_szgammalevelmin) || parseInt($("#Gammaleve_value").val()) > parseInt(g_szgammalevelmax) ){
				 $("#Gammaleve_value").val($( "#slider_Gammaleve" ).slider( "value" ))
			}
			else
			{
				$("#slider_Gammaleve").slider( "value", $("#Gammaleve_value").val() );
				Setbacklightmode('','gammalevel');
			}
		});
		
	}
};
//
function SlidesmartIRleve(){
	 if (obj=="imageenhance")
	 {
		 $( "#imageenhance_slider_smartIR" ).slider({
		  range: "min",
		  value: g_szimageenhance_smartIRlevel,
		  min: g_szimageenhance_smartIRlevelmin,
		  max: g_szimageenhance_smartIRlevelmax,
		  slide: function( event, ui ) {
			$("#imageenhance_smartIR_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#imageenhance_smartIR_value").val($( "#imageenhance_slider_smartIR" ).slider( "value" ));
			Setbacklightmode("imageenhance","smartIR");
		  }
		 });
		 if($.browser.msie) {
			$('#imageenhance_smartIR_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#imageenhance_smartIR_value").val()))
					{
						  $("#imageenhance_smartIR_value").val($( "#imageenhance_slider_smartIR" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#imageenhance_smartIR_value").val()) < parseInt(g_szimageenhance_smartIRlevelmin) || parseInt($("#imageenhance_smartIR_value").val()) > parseInt(g_szimageenhance_smartIRlevelmax) ){
						 $("#imageenhance_smartIR_value").val($( "#imageenhance_slider_smartIR" ).slider( "value" ))
					}
					else
					{
						$("#imageenhance_slider_smartIR").slider( "value", $("#imageenhance_smartIR_value").val() );
						Setbacklightmode("imageenhance","smartIR");
					}
			  }
			});
		};
		$( "#imageenhance_smartIR_value" ).change(function() {
			if (!CheackOnlyNum($("#imageenhance_smartIR_value").val()))
			{
				  $("#imageenhance_smartIR_value").val($( "#imageenhance_slider_smartIR" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#imageenhance_smartIR_value").val()) < parseInt(g_szimageenhance_smartIRlevelmin) || parseInt($("#imageenhance_smartIR_value").val()) > parseInt(g_szimageenhance_smartIRlevelmax) ){
				 $("#imageenhance_smartIR_value").val($( "#imageenhance_slider_smartIR" ).slider( "value" ))
			}
			else
			{
				$("#imageenhance_slider_smartIR").slider( "value", $("#imageenhance_smartIR_value").val() );
				Setbacklightmode("imageenhance","smartIR");
			}
		});
	 }
	 else
	 {
		$( "#slider_smartIR" ).slider({
		  range: "min",
		  value: g_szsmartIRlevel,
		  min: g_szsmartIRlevelmin,
		  max: g_szsmartIRlevelmax,
		  slide: function( event, ui ) {
			$("#smartIR_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#smartIR_value").val($( "#slider_smartIR" ).slider( "value" ));
			Setbacklightmode('','smartirlevel');
		  }
		});
		if($.browser.msie) {
				$('#smartIR_value').keydown(function(e){
				  if(e.keyCode==13)
				  {
					  if (!CheackOnlyNum($("#smartIR_value").val()))
						{
							  $("#smartIR_value").val($( "#slider_smartIR" ).slider( "value" ))
							  return;
						}
						if (parseInt($("#smartIR_value").val()) < parseInt(g_szsmartIRlevelmin) || parseInt($("#smartIR_value").val()) > parseInt(g_szsmartIRlevelmax) ){
							 $("#smartIR_value").val($( "#slider_smartIR" ).slider( "value" ))
						}
						else
						{
							$("#slider_smartIR").slider( "value", $("#smartIR_value").val() );
							Setbacklightmode('','smartirlevel');
						}
				  }
				});
			};
			$( "#smartIR_value" ).change(function() {
				if (!CheackOnlyNum($("#smartIR_value").val()))
				{
					  $("#smartIR_value").val($( "#slider_smartIR" ).slider( "value" ))
					  return;
				}
				if (parseInt($("#smartIR_value").val()) < parseInt(g_szsmartIRlevelmin) || parseInt($("#smartIR_value").val()) > parseInt(g_szsmartIRlevelmax) ){
					 $("#smartIR_value").val($( "#slider_smartIR" ).slider( "value" ))
				}
				else
				{
					$("#slider_smartIR").slider( "value", $("#smartIR_value").val() );
					Setbacklightmode('','smartirlevel');
				}
			});
	 }
};

/*************************************************
Function:		GetImages
Description:	获取图像信息			
*************************************************/
function GetImages(){
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
			 $("#lightness_value,#contrast_value,#saturation_value,#sharpness_value").unbind("change");
			 $("#lightness_value,#contrast_value,#saturation_value,#sharpness_value").unbind("keydown");
			$(xmlDoc).find("brightnesslevel").eq(0).each(function(i){
			  g_szbrightnesslevelminopt=Number($(this).attr('min'));	
			  g_szbrightnesslevelmaxopt=Number($(this).attr('max'));	
		  	  g_szbrightnesslevel= Number($(this).text());
			  $("#lightness_value").val(g_szbrightnesslevel).attr('maxlength',$(this).attr('max').length);
			  $("#slider-lightness").slider({
			  range: "min",
			  value: g_szbrightnesslevel,
			  min: g_szbrightnesslevelminopt,
			  max: g_szbrightnesslevelmaxopt,
			  slide: function( event, ui ) {
				$("#lightness_value").val(ui.value);
			  },
			  stop: function( event, ui ) {
				$("#lightness_value").val($( "#slider-lightness" ).slider( "value" ))
				SetImages('brightnesslevel');
			  }});
				if($.browser.msie) {
					$('#lightness_value').keydown(function(e){
					  if(e.keyCode==13)
					  {
						  if (!CheackOnlyNum($("#lightness_value").val()))
							{
								  $("#lightness_value").val($( "#slider-lightness" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#lightness_value").val()) < parseInt(g_szbrightnesslevelminopt) || parseInt($("#lightness_value").val()) > parseInt(g_szbrightnesslevelmaxopt) ){
								 $("#lightness_value").val($( "#slider-lightness" ).slider( "value" ))
							}
							else
							{
								$("#slider-lightness").slider( "value", $("#lightness_value").val() );
								SetImages('brightnesslevel');
							}
					  }
					});
			   };
				$( "#lightness_value" ).change(function() {
					if (!CheackOnlyNum($("#lightness_value").val()))
					{
						  $("#lightness_value").val($( "#slider-lightness" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#lightness_value").val()) < parseInt(g_szbrightnesslevelminopt) || parseInt($("#lightness_value").val()) > parseInt(g_szbrightnesslevelmaxopt) ){
						 $("#lightness_value").val($( "#slider-lightness" ).slider( "value" ))
					}
					else
					{
						$("#slider-lightness").slider( "value", $("#lightness_value").val() );
						SetImages('brightnesslevel');
					}
				});
			});
			$(xmlDoc).find("contrastlevel").each(function(i){ 
			  g_szcontrastlevelminopt=Number($(this).attr('min'));	
			  g_szcontrastlevelmaxopt=Number($(this).attr('max'));	
		  	  g_szcontrastlevel= Number($(this).text());
			  $("#contrast_value").val(g_szcontrastlevel).attr('maxlength',$(this).attr('max').length);
			  $( "#slider-contrast" ).slider({
				  range: "min",
				  value: g_szcontrastlevel,
				  min: g_szcontrastlevelminopt,
				  max: g_szcontrastlevelmaxopt,
				  slide: function( event, ui ) {
					$("#contrast_value").val(ui.value);
				  },
				stop: function( event, ui ) {
					$("#contrast_value").val($( "#slider-contrast" ).slider( "value" ))
					SetImages('contrastlevel');
				  }
			    });
			  if($.browser.msie) {
					$('#contrast_value').keydown(function(e){
					  if(e.keyCode==13)
					  {
						  if (!CheackOnlyNum($("#contrast_value").val()))
							{
								  $("#contrast_value").val($( "#slider-contrast" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#contrast_value").val()) < parseInt(g_szcontrastlevelminopt) || parseInt($("#contrast_value").val()) > parseInt(g_szcontrastlevelmaxopt) ){
								 $("#contrast_value").val($( "#slider-contrast" ).slider( "value" ))
							}
							else
							{
								$("#slider-contrast").slider( "value", $("#contrast_value").val() );
								SetImages('contrastlevel');
							}
					  }
					});
			   };
				$( "#contrast_value" ).change(function() {
					if (!CheackOnlyNum($("#contrast_value").val()))
					{
						  $("#contrast_value").val($( "#slider-contrast" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#contrast_value").val()) < parseInt(g_szcontrastlevelminopt) || parseInt($("#contrast_value").val()) > parseInt(g_szcontrastlevelmaxopt) ){
						 $("#contrast_value").val($( "#slider-contrast" ).slider( "value" ))
					}
					else
					{
						$("#slider-contrast").slider( "value", $("#contrast_value").val() );
						SetImages('contrastlevel');
					}
				});
			});
			$(xmlDoc).find("saturationlevel").each(function(i){ 
			  g_szsaturationlevelminopt=Number($(this).attr('min'));	
			  g_szsaturationlevelmaxopt=Number($(this).attr('max'));	
		  	  g_szsaturationlevel= Number($(this).text());
			  $("#saturation_value").val(g_szsaturationlevel).attr('maxlength',$(this).attr('max').length);
			  $( "#slider-saturation" ).slider({
				  range: "min",
				  value: g_szsaturationlevel,
				  min: g_szsaturationlevelminopt,
				  max: g_szsaturationlevelmaxopt,
				  slide: function( event, ui ) {
					$("#saturation_value").val(ui.value);
				  },
				stop: function( event, ui ) {
					$("#saturation_value").val($( "#slider-saturation" ).slider( "value" ));
					SetImages('saturationlevel');
				  }
				});
				if($.browser.msie) {
					$('#saturation_value').keydown(function(e){
					  if(e.keyCode==13)
					  {
						  if (!CheackOnlyNum($("#saturation_value").val()))
							{
								  $("#saturation_value").val($( "#slider-saturation" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#saturation_value").val()) < parseInt(g_szsaturationlevelminopt) || parseInt($("#saturation_value").val()) > parseInt(g_szsaturationlevelmaxopt) ){
								 $("#saturation_value").val($( "#slider-saturation" ).slider( "value" ))
							}
							else
							{
								$("#slider-saturation").slider( "value", $("#saturation_value").val() );
								SetImages('saturationlevel');
							}
					  }
					});
			   };
				$( "#saturation_value" ).change(function() {
					if (!CheackOnlyNum($("#saturation_value").val()))
					{
						  $("#saturation_value").val($( "#slider-saturation" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#saturation_value").val()) < parseInt(g_szsaturationlevelminopt) || parseInt($("#saturation_value").val()) > parseInt(g_szsaturationlevelmaxopt) ){
						 $("#saturation_value").val($( "#slider-saturation" ).slider( "value" ))
					}
					else
					{
						$("#slider-saturation").slider( "value", $("#saturation_value").val() );
						SetImages('saturationlevel');
					}
				});
				
			});
			$(xmlDoc).find("huelevel").each(function(i){ 
			  g_szhuelevelminopt=Number($(this).attr('min'));	
			  g_szhuelevelmaxopt=Number($(this).attr('max'));
		  	  g_szhuelevel= Number($(this).text());
			  $("#sharpness_value").val(g_szhuelevel).attr('maxlength',$(this).attr('max').length);
			  $("#slider-sharpness").slider({
				  range: "min",
				  value: g_szhuelevel,
				  min: g_szhuelevelminopt,
				  max: g_szhuelevelmaxopt,
				  slide: function( event, ui ) {
					$("#sharpness_value").val(ui.value);
				  },
				stop: function( event, ui ) {
					$("#sharpness_value").val($( "#slider-sharpness" ).slider( "value" ));
					SetImages('huelevel');
				  }
				});
				
				if($.browser.msie) {
					$('#sharpness_value').keydown(function(e){
					  if(e.keyCode==13)
					  {
						  if (!CheackOnlyNum($("#sharpness_value").val()))
							{
								  $("#sharpness_value").val($( "#slider-sharpness" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#sharpness_value").val()) < parseInt(g_szhuelevelminopt) || parseInt($("#sharpness_value").val()) > parseInt(g_szhuelevelmaxopt) ){
								 $("#sharpness_value").val($( "#slider-sharpness" ).slider( "value" ))
							}
							else
							{
								$("#slider-sharpness").slider( "value", $("#sharpness_value").val() );
								SetImages('huelevel');
							}
					  }
					});
			   };
				$( "#sharpness_value" ).change(function() {
					if (!CheackOnlyNum($("#sharpness_value").val()))
					{
						  $("#sharpness_value").val($( "#slider-sharpness" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#sharpness_value").val()) < parseInt(g_szhuelevelminopt) || parseInt($("#sharpness_value").val()) > parseInt(g_szhuelevelmaxopt) ){
						 $("#sharpness_value").val($( "#slider-sharpness" ).slider( "value" ))
					}
					else
					{
						$("#slider-sharpness").slider( "value", $("#sharpness_value").val() );
						SetImages('huelevel');
					}
				});
				
			});
			

		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};
/*************************************************
Function:		SetImages
Description:	设置图像调节			
*************************************************/
function SetImages(obj){
	var brightnesslevel=$("#lightness_value").val()
	var szXml = "<colorinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	if (obj=="brightnesslevel"){ //亮度
		szXml += "<brightnesslevel>"+brightnesslevel+"</brightnesslevel>";
	}
	else if(obj=="contrastlevel"){ // 对比度
		szXml += "<contrastlevel>"+$("#contrast_value").val()+"</contrastlevel>";
	}
	else if(obj=="saturationlevel"){ // 饱和度
		szXml += "<saturationlevel>"+$("#saturation_value").val()+"</saturationlevel>";
	}
	else if(obj=="huelevel"){ // 锐度
		szXml += "<huelevel>"+$("#sharpness_value").val()+"</huelevel>";
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
						szRetInfo = m_szSuccessState+m_szSuccess1;
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
}
/*************************************************
Function:		Getfocus
Description:	获取聚焦			
*************************************************/
function Getfocus(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/focus"
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
			//聚焦模式
			$(xmlDoc).find("focusstyle").each(function(i){ 
		  	 	var k_szfocusstyle= $(this).text();
				$("#FocusType").empty(); 
				 var k_focusstyleops = $(this).attr('opt').split(",");
				insertOptions2Select(k_focusstyleops, ["manual","single", "continu", "auto"], ["focusmanual","focusonce", "focuscontinue", "focuscontinueauto"], "FocusType");
				setValueDelayIE6("FocusType" ,"","",k_szfocusstyle);
			}); 
			//最小聚焦距离
			$(xmlDoc).find("focusmin").each(function(i){ 
			 var k_szfocusminenable=$(this).attr('enable');
			 if (k_szfocusminenable!="true")
			 {
				 $("#subminfocusdis").hide();
			 }
			 else
			 {
				  $("#subminfocusdis").show();
				  $("#focusminType").empty(); 
				   var k_szfocusminopt=$(this).attr('opt').split(",");
				   k_szfocusmin= $(this).text();
				   for (var i=0;i<k_szfocusminopt.length;i++){
				   $("#focusminType").append( "<option value="+k_szfocusminopt[i]+">"+k_szfocusminopt[i]+"</option>")
						var selectCode=document.getElementById("focusminType"); 
						if(selectCode.options[i].value==k_szfocusmin){  
							selectCode.options[i].selected=true;  
						 } 
					};
					//$("#focusminType option[value='infinity']").remove(); //删除Select中Value='infinity'的Option 
					//insertOptions2Select(k_szfocusminopt, ["infinity"], ["infinity"], "focusminType");
					$("#focusminType option[value='infinity']").attr("name", "infinity").text(getNodeValue('infinity')); //删除Select中Value='infinity'的Option
					g_focusmin=true; 
			  }
				 
			});
			
			//最大聚焦距离
			$(xmlDoc).find("focusmax").each(function(i){ 
			    var k_szfocusmaxenable=$(this).attr('enable');
				 if (k_szfocusmaxenable!="true")
				 {
					 $("#submaxfocusdis").hide();
				 }
				 else
				 {
					  $("#submaxfocusdis").show();
					  $("#focusmaxType").empty(); 
					   var k_szfocusmaxopt=$(this).attr('opt').split(",");
					   k_szfocusmax= $(this).text();
					   for (var i=0;i<k_szfocusmaxopt.length;i++){
					   $("#focusmaxType").append( "<option  value="+k_szfocusmaxopt[i]+">"+k_szfocusmaxopt[i]+"</option>")
							var selectCode=document.getElementById("focusmaxType"); 
							if(selectCode.options[i].value==k_szfocusmax){  
								selectCode.options[i].selected=true;  
							 } 
						};
						$("#focusmaxType option[value='infinity']").attr("name", "infinity").text(getNodeValue('infinity')); //删除Select中Value='3'的Option 
						g_focusmax=true;
				 }
			});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};
/*************************************************
Function:		Getfocus
Description:	设置聚焦			
*************************************************/
function SetFocus(obj){
    var focusstyle=$("#FocusType").val();
	var focusminType=$("#focusminType").val();
	var focusmaxType=$("#focusmaxType").val();
	 if (g_focusmin==true && g_focusmax==true)
	 {
		var focusminIndex=$('option:selected', '#focusminType').index();
		var focusmaxIndex=$('option:selected', '#focusmaxType').index();
		if (focusminIndex > focusmaxIndex)
		{
			alert(getNodeValue('altfocustips'));
			$("#focusminType").attr("value",k_szfocusmin);
			$("#focusmaxType").attr("value",k_szfocusmax);
			return;
		}
	}
	var szXml = "<focus version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	if (obj=='mode')
	{
		szXml += "<focusstyle>"+focusstyle+"</focusstyle>";
	}
	else if(obj=='min'){
		if (g_focusmin==true)
		{
			szXml += "<focusmin>"+focusminType+"</focusmin>";
		}
	}
	else if(obj=='max'){
		if (g_focusmax==true)
		{
			szXml += "<focusmax>"+focusmaxType+"</focusmax>";
		}
	}
 	szXml += "</focus>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/focus"
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
						Getfocus();
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};
/*************************************************
Function:		Getwhiteblance
Description:	获取白平衡			
*************************************************/
function Getwhiteblance(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	  var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/whiteblance"
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
		  $("#R_value,#B_value").unbind("change");
		  $("#R_value,#B_value").unbind("keydown");
		//白平衡模式
			$(xmlDoc).find("whiteblancestyle").each(function(i){ 
		  	 	var k_szwhiteblancestyle= $(this).text();
				$("#WhiteBalance").empty(); 
				 var k_szwhiteblancestyleopts = $(this).attr('opt').split(",");
				insertOptions2Select(k_szwhiteblancestyleopts, ["manual", "auto1","auto2", "lock", "fluorescentlight", "filamentlight", "warmlight", "natural"], ["whitebalancemanual", "autowhitebalance1","autowhitebalance2", "lockwhitebalance", "daylightlamp", "filamentlamp", "warmlightlamp", "Naturallight"], "WhiteBalance");
				setValueDelayIE6("WhiteBalance" ,"","",k_szwhiteblancestyle);
				if ($("#WhiteBalance").val()=="manual"){
				  $("#sliderR").show();
				  $("#sliderB").show();
				}else{
				  $("#sliderR").hide();
				  $("#sliderB").hide();
				}
			}); 
			$(xmlDoc).find("whiteblancered").each(function(i){ 
		  	  g_szwhiteblancered= Number($(this).text());
			  g_szwhiteblanceredmin= Number($(this).attr('min'));
			  g_szwhiteblanceredmax= Number($(this).attr('max'));
			  $("#R_value").val(g_szwhiteblancered).attr('maxlength',$(this).attr('max').length);
			  $( "#slider_R").slider({
				  range: "min",
				  value: g_szwhiteblancered,
				  min: g_szwhiteblanceredmin,
				  max: g_szwhiteblanceredmax,
				  slide: function( event, ui ) {
					$("#R_value").val(ui.value);
				  },
				stop: function( event, ui ) {
					$("#R_value").val($( "#slider_R" ).slider( "value" ))
					SetSliderWhiteBlance();
				  }
				 });
				 
				 if($.browser.msie) {
					$('#R_value').keydown(function(e){
					  if(e.keyCode==13)
					  {
						  if (!CheackOnlyNum($("#R_value").val()))
							{
								  $("#R_value").val($( "#slider_R" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#R_value").val()) < parseInt(g_szwhiteblanceredmin) || parseInt($("#R_value").val()) > parseInt(g_szwhiteblanceredmax) ){
								 $("#R_value").val($( "#slider_R" ).slider( "value" ))
							}
							else
							{
								$("#slider_R").slider( "value", $("#R_value").val() );
								SetSliderWhiteBlance();
							}
					  }
					});
				};
				$( "#R_value" ).change(function() {
					if (!CheackOnlyNum($("#R_value").val()))
					{
						  $("#R_value").val($( "#slider_R" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#R_value").val()) < parseInt(g_szwhiteblanceredmin) || parseInt($("#R_value").val()) > parseInt(g_szwhiteblanceredmax) ){
						 $("#R_value").val($( "#slider_R" ).slider( "value" ))
					}
					else
					{
						$("#slider_R").slider( "value", $("#R_value").val() );
						SetSliderWhiteBlance();
					}
				});

			}); 
			$(xmlDoc).find("whiteblanceblue").each(function(i){ 
		  	  g_szwhiteblanceblue= Number($(this).text());
			  g_szwhiteblancebluemin= Number($(this).attr('min'));
			  g_szwhiteblancebluemax= Number($(this).attr('max'));
			  $("#B_value").val(g_szwhiteblanceblue).attr('maxlength',$(this).attr('max').length);
			  $( "#slider_B" ).slider({
				  range: "min",
				  value: g_szwhiteblanceblue,
				  min: g_szwhiteblancebluemin,
				  max: g_szwhiteblancebluemax,
				  slide: function( event, ui ) {
					$("#B_value").val(ui.value);
				  },
				stop: function( event, ui ) {
					$("#B_value").val($( "#slider_B" ).slider( "value" ))
					SetSliderWhiteBlance();
				  }
				});
				if($.browser.msie) {
					$('#B_value').keydown(function(e){
					  if(e.keyCode==13)
					  {
						  if (!CheackOnlyNum($("#B_value").val()))
							{
								  $("#B_value").val($( "#slider_B" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#B_value").val()) < parseInt(g_szwhiteblancebluemin) || parseInt($("#B_value").val()) > parseInt(g_szwhiteblancebluemax) ){
								 $("#B_value").val($( "#slider_B" ).slider( "value" ))
							}
							else
							{
								$("#slider_B").slider( "value", $("#B_value").val() );
								SetSliderWhiteBlance();
							}
					  }
					});
				};
				$( "#B_value" ).change(function() {
					if (!CheackOnlyNum($("#B_value").val()))
					{
						  $("#B_value").val($( "#slider_B" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#B_value").val()) < parseInt(g_szwhiteblancebluemin) || parseInt($("#B_value").val()) > parseInt(g_szwhiteblancebluemax) ){
						 $("#B_value").val($( "#slider_B" ).slider( "value" ))
					}
					else
					{
						$("#slider_B").slider( "value", $("#B_value").val() );
						SetSliderWhiteBlance();
					}
				});
			}); 
		  
		  //SliderWhiteBlance();
		  
		  
	 
		
		  
		  
		  
		  
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};
/***白平衡关联*****/
function ChangeWhiteBalance(){
	  if ($("#WhiteBalance").val()=="manual"){
		  $("#sliderR").show()
		  $("#sliderB").show()
		}else{
		  $("#sliderR").hide()
		  $("#sliderB").hide()
		}
	SetSliderWhiteBlance()
}

/*************************************************
Function:		SetSliderWhiteBlance
Description:	设置白平衡			
*************************************************/
function SetSliderWhiteBlance(){
	var WhiteBalance=$("#WhiteBalance").val()
	var whiteblancered=$("#R_value").val()
	var whiteblanceblue=$("#B_value").val()
	var szXml = "<whiteblance version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<whiteblancestyle>"+WhiteBalance+"</whiteblancestyle>";
  	szXml += "<whiteblancered>"+whiteblancered+"</whiteblancered>";
 	szXml += "<whiteblanceblue>"+whiteblanceblue+"</whiteblanceblue>";
 	szXml += "</whiteblance>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/whiteblance"
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
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});
}



/*************************************************
Function:		Getdynamicmode
Description:	获取背光模式(动态调节)			
*************************************************/
function Getdynamicmode(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/dynamicmode"
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
			$("#hlc_value,#wdr_value,#Gammaleve_value,#smartIR_value,#imageenhance_fogthrough_value,#fogthrough_value,#autoblc_value").unbind("change");
		    $("#hlc_value,#wdr_value,#Gammaleve_value,#smartIR_value,#imageenhance_fogthrough_value,#fogthrough_value,#autoblc_value").unbind("keydown"); 
			if (m_PreviewOCX!=null)
			{
				document.getElementById("plugin0").eventWebToPlugin("image","setparam",Docxml);
			}
			
			//close,autoblc,regionblc,wdr,hlc
			$(xmlDoc).find("mode").each(function(i){ 
		  	 	g_szbacklightmode= $(this).text();
				$("#backlightmode").empty(); 
				 var g_modes = $(this).attr('opt').split(",");
				insertOptions2Select(g_modes, ["close", "autoblc","regionblc", "wdr", "hlc","fogthrough","gamma","smartir"], ["close", "BacklightCompensationauto","BacklightCompensationmanual", "widerange", "strongligthdes","Mfogthrough","MGamma","MsmartIR"], "backlightmode");
				setValueDelayIE6("backlightmode" ,"","",g_szbacklightmode);
				if (g_szbacklightmode=="close"){
					$("#wdr").hide();
					$("#hlc").hide();
					$("#blc").hide();
					$("#blccustom").hide();
					$("#autoblcevel").hide();
					$("#subfogthrough").hide();
					$("#subGammaleve").hide();
					$("#subsmartIR").hide();
				}else if(g_szbacklightmode=="wdr"){
					$("#wdr").show();
					$("#hlc").hide();
					$("#blc").hide();
					$("#blccustom").hide();
					$("#autoblcevel").hide();
					$("#subfogthrough").hide();
					$("#subGammaleve").hide();
					$("#subsmartIR").hide();
				}else if(g_szbacklightmode=="hlc"){
					$("#wdr").hide();
					$("#hlc").show();
					$("#blc").hide();
					$("#blccustom").hide();
					$("#autoblcevel").hide();
					$("#subfogthrough").hide();
					$("#subGammaleve").hide();
					$("#subsmartIR").hide();
				}else if(g_szbacklightmode=="autoblc"){
					$("#wdr").hide();
					$("#hlc").hide();
					$("#blc").hide();
					$("#blccustom").hide();
					$("#autoblcevel").show();
					$("#subfogthrough").hide();
					$("#subGammaleve").hide();
					$("#subsmartIR").hide();
				}else if(g_szbacklightmode=="regionblc"){
					$("#wdr").hide();
					$("#hlc").hide();
					$("#blc").show();
					$("#blccustom").hide();
					$("#autoblcevel").show();
					$("#subfogthrough").hide();
					$("#subGammaleve").hide();
					$("#subsmartIR").hide();
				}
				else if(g_szbacklightmode=="fogthrough"){
					$("#wdr").hide();
					$("#hlc").hide();
					$("#blc").hide();
					$("#blccustom").hide();
					$("#autoblcevel").hide();
					$("#subfogthrough").show();
					$("#subGammaleve").hide();
					$("#subsmartIR").hide();
				}
				else if(g_szbacklightmode=="gamma"){
					$("#wdr").hide();
					$("#hlc").hide();
					$("#blc").hide();
					$("#blccustom").hide();
					$("#autoblcevel").hide();
					$("#subfogthrough").hide();
					$("#subGammaleve").show();
					$("#subsmartIR").hide();
				}
				else if(g_szbacklightmode=="smartir")
				{
					$("#wdr").hide();
					$("#hlc").hide();
					$("#blc").hide();
					$("#blccustom").hide();
					$("#autoblcevel").hide();
					$("#subfogthrough").hide();
					$("#subGammaleve").hide();
					$("#subsmartIR").show();
				}
			}); 
			 
			
			
			$(xmlDoc).find("wdrlevel").each(function(i){ 
		  	  g_szwdrlevel= Number($(this).text());
			  g_szwdrlevelmin = Number($(this).attr('min'));
			  g_szwdrlevelmax = Number($(this).attr('max'));
			  $("#wdr_value").val(g_szwdrlevel).attr('maxlength',$(this).attr('max').length);
			  Sliderwdr();
			});
			$(xmlDoc).find("blclevel").each(function(i){ 
		  	  g_szblclevel= Number($(this).text());
			  g_szblclevelmin = Number($(this).attr('min'));
			  g_szblclevelmax = Number($(this).attr('max'));
			  $("#autoblc_value").val(g_szblclevel).attr('maxlength',$(this).attr('max').length);
			  Sliderautoblc();
			});
			$(xmlDoc).find("hlclevel").each(function(i){ 
		  	  g_szhlclevel= Number($(this).text());
			  g_szhlclevelmin = Number($(this).attr('min'));
			  g_szhlclevelmax = Number($(this).attr('max'));
			  $("#hlc_value").val(g_szhlclevel).attr('maxlength',$(this).attr('max').length);
			  Slidehlc();
			}); 
			if($(xmlDoc).find("fogthroughlevel").length > 0)
				{
					$(xmlDoc).find("fogthroughlevel").each(function(i){ 
					g_szfogthroughlevel= Number($(this).text());
					g_szfogthroughlevelmin = Number($(this).attr('min'));
					g_szfogthroughlevelmax = Number($(this).attr('max'));
					Slidefogthroughlevel();  //透雾等级
				});
			}
			
			if($(xmlDoc).find("gammalevel").length > 0)
				{
					$(xmlDoc).find("gammalevel").each(function(i){ 
					g_szgammalevel= Number($(this).text());
					g_szgammalevelmin = Number($(this).attr('min'));
					g_szgammalevelmax = Number($(this).attr('max'));
					$("#Gammaleve_value").val(g_szgammalevel).attr('maxlength',$(this).attr('max').length);
					Slidgeammalevel();  //gammalevel等级
				});
			}
			
			
			
			if($(xmlDoc).find("smartirlevel").length > 0)
				{
					$(xmlDoc).find("smartirlevel").each(function(i){ 
					g_szsmartIRlevel= Number($(this).text());
					g_szsmartIRlevelmin = Number($(this).attr('min'));
					g_szsmartIRlevelmax = Number($(this).attr('max'));
					$("#smartIR_value").val(g_szsmartIRlevel).attr('maxlength',$(this).attr('max').length);
					SlidesmartIRleve();
				});
			}
			
			
			
			$(xmlDoc).find("sel").each(function(i){ 
				 g_szsel= $(this).text();
				$("#blcmode").empty(); 
				 var g_sels = $(this).attr('opt').split(",");
				insertOptions2Select(g_sels, ["top", "bottom", "left", "right", "center", "custom"], ["up", "down", "left", "right", "center", "custom"], "blcmode");
				setValueDelayIE6("blcmode" ,"","",g_szsel);
				
				 if (g_szsel=="custom"  &&  g_szbacklightmode=="regionblc")
				 {
				    $("#blccustom").show();
				  }
				  else
				  {
					$("#blccustom").hide(); 
				 }
			});
			
			
			
			
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};


/*************************************************
Function:		Getimageenhancemode
Description:	图像增强		
*************************************************/
function Getimageenhancemode(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/imageenhance"
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
		   $("#imageenhance_wdr_value,#imageenhance_hlc_value,#imageenhance_fogthrough_value,#imageenhance_Gammaleve_value,#imageenhance_smartIR_value,#imageenhance_autoblc_value").unbind("change");
		   $("#imageenhance_wdr_value,#imageenhance_hlc_value,#imageenhance_fogthrough_value,#imageenhance_Gammaleve_value,#imageenhance_smartIR_value,#imageenhance_autoblc_value").unbind("keydown");
			if (m_PreviewOCX!=null)
			{
				document.getElementById("plugin0").eventWebToPlugin("image","setparam",Docxml);
			}
			
			$(xmlDoc).find("mode").each(function(i){ 
		  	 	var g_simageenhancemode= $(this).text();
				$("#imageenhance_slect").empty(); 
				 var g_modes = $(this).attr('opt').split(",");
				insertOptions2Select(g_modes, ["close", "autoblc","regionblc", "wdr", "hlc","fogthrough","gamma","smartir"], ["close", "BacklightCompensationauto","BacklightCompensationmanual", "widerange", "strongligthdes","Mfogthrough","MGamma","MsmartIR"], "imageenhance_slect");
				setValueDelayIE6("imageenhance_slect" ,"","",g_simageenhancemode);
				if (g_simageenhancemode=="close"){
					$("#imageenhance_wdr").hide();
					$("#imageenhance_hlc").hide();
					$("#imageenhance_blc").hide();
					$("#imageenhance_blccustom").hide();
					$("#imageenhance_autoblcevel").hide();
					$("#imageenhance_subfogthrough").hide();
					$("#imageenhance_subGammaleve").hide();
					$("#imageenhance_subsmartIR").hide();
				}else if(g_simageenhancemode=="wdr"){
					$("#imageenhance_wdr").show();
					$("#imageenhance_hlc").hide();
					$("#imageenhance_blc").hide();
					$("#imageenhance_blccustom").hide();
					$("#imageenhance_autoblcevel").hide();
					$("#imageenhance_subfogthrough").hide();
					$("#imageenhance_subGammaleve").hide();
					$("#imageenhance_subsmartIR").hide();
				}else if(g_simageenhancemode=="hlc"){
					$("#imageenhance_wdr").hide();
					$("#imageenhance_hlc").show();
					$("#imageenhance_blc").hide();
					$("#imageenhance_blccustom").hide();
					$("#imageenhance_autoblcevel").hide();
					$("#imageenhance_subfogthrough").hide();
					$("#imageenhance_subGammaleve").hide();
					$("#imageenhance_subsmartIR").hide();
				}else if(g_simageenhancemode=="autoblc"){
					$("#imageenhance_wdr").hide();
					$("#imageenhance_hlc").hide();
					$("#imageenhance_blc").hide();
					$("#imageenhance_blccustom").hide();
					$("#imageenhance_autoblcevel").show();
					$("#imageenhance_subfogthrough").hide();
					$("#imageenhance_subGammaleve").hide();
					$("#imageenhance_subsmartIR").hide();
				}else if(g_simageenhancemode=="regionblc"){
					$("#imageenhance_wdr").hide();
					$("#imageenhance_hlc").hide();
					$("#imageenhance_blc").show();
					$("#imageenhance_blccustom").hide();
					$("#imageenhance_autoblcevel").show();
					$("#imageenhance_subfogthrough").hide();
					$("#imageenhance_subGammaleve").hide();
					$("#imageenhance_subsmartIR").hide();
				}
				else if(g_simageenhancemode=="fogthrough"){
					$("#imageenhance_wdr").hide();
					$("#imageenhance_hlc").hide();
					$("#imageenhance_blc").hide();
					$("#imageenhance_blccustom").hide();
					$("#imageenhance_autoblcevel").hide();
					$("#imageenhance_subfogthrough").show();
					$("#imageenhance_subGammaleve").hide();
					$("#imageenhance_subsmartIR").hide();
				}
				else if(g_simageenhancemode=="gamma"){
					$("#imageenhance_wdr").hide();
					$("#imageenhance_hlc").hide();
					$("#imageenhance_blc").hide();
					$("#imageenhance_blccustom").hide();
					$("#imageenhance_autoblcevel").hide();
					$("#imageenhance_subfogthrough").hide();
					$("#imageenhance_subGammaleve").show();
					$("#imageenhance_subsmartIR").hide();
				}
				else if(g_simageenhancemode=="smartir")
				{
					$("#imageenhance_wdr").hide();
					$("#imageenhance_hlc").hide();
					$("#imageenhance_blc").hide();
					$("#imageenhance_blccustom").hide();
					$("#imageenhance_autoblcevel").hide();
					$("#imageenhance_subfogthrough").hide();
					$("#imageenhance_subGammaleve").hide();
					$("#imageenhance_subsmartIR").show();
				}
			}); 
			if($(xmlDoc).find("wdrlevel").length > 0)
			{
				$(xmlDoc).find("wdrlevel").each(function(i){ 
				  g_szimageenhance_wdrlevel= Number($(this).text());
				  g_szimageenhance_wdrlevelmin = Number($(this).attr('min'));
				  g_szimageenhance_wdrlevelmax = Number($(this).attr('max'));
				  $("#imageenhance_wdr_value").val(g_szimageenhance_wdrlevel).attr('maxlength',$(this).attr('max').length);
				  Sliderwdr("imageenhance");
				});
			}
			if($(xmlDoc).find("blclevel").length > 0)
			{
				$(xmlDoc).find("blclevel").each(function(i){ 
				  g_szimageenhance_blclevel= Number($(this).text());
				  g_szimageenhance_blclevelmin = Number($(this).attr('min'));
				  g_szimageenhance_blclevelmax = Number($(this).attr('max'));
				  Sliderautoblc("imageenhance");
				});
			}
			if($(xmlDoc).find("hlclevel").length > 0)
			{
				$(xmlDoc).find("hlclevel").each(function(i){ 
				  g_szimageenhance_hlclevel= Number($(this).text());
				  g_szimageenhance_hlclevelmin = Number($(this).attr('min'));
				  g_szimageenhance_hlclevelmax = Number($(this).attr('max'));
				  $("#imageenhance_hlc_value").val(g_szimageenhance_hlclevel).attr('maxlength',$(this).attr('max').length);
				  Slidehlc("imageenhance");
				}); 
			}
			if($(xmlDoc).find("fogthroughlevel").length > 0)
			{
				$(xmlDoc).find("fogthroughlevel").each(function(i){ 
					g_szimageenhance_fogthroughlevel= Number($(this).text());
					g_szimageenhance_fogthroughlevelmin = Number($(this).attr('min'));
					g_szimageenhance_fogthroughlevelmax = Number($(this).attr('max'));
					$("#imageenhance_fogthrough_value").val(g_szimageenhance_fogthroughlevel).attr('maxlength',$(this).attr('max').length);
					Slidefogthroughlevel("imageenhance");  //透雾等级
				});
			}
			if($(xmlDoc).find("gammalevel").length > 0)
			{
				$(xmlDoc).find("gammalevel").each(function(i){ 
					g_szimageenhance_gammalevel= Number($(this).text());
					g_szimageenhance_gammalevelmin = Number($(this).attr('min'));
					g_szimageenhance_gammalevelmax = Number($(this).attr('max'));
					$("#imageenhance_Gammaleve_value").val(g_szimageenhance_gammalevel).attr('maxlength',$(this).attr('max').length);
					Slidgeammalevel("imageenhance");  //gammalevel等级
				});
			}
			if($(xmlDoc).find("smartirlevel").length > 0)
			{
				$(xmlDoc).find("smartirlevel").each(function(i){ 
					g_szimageenhance_smartIRlevel= Number($(this).text());
					g_szimageenhance_smartIRlevelmin = Number($(this).attr('min'));
					g_szimageenhance_smartIRlevelmax = Number($(this).attr('max'));
					$("#imageenhance_smartIR_value").val(g_szsmartIRlevel).attr('maxlength',$(this).attr('max').length);
					SlidesmartIRleve("imageenhance");
				});
			}
			if($(xmlDoc).find("hlcarea").length > 0)
			{
				$(xmlDoc).find("sel").each(function(i){ 
					 g_szsel= $(this).text();
					$("#blcmode").empty(); 
					 var g_sels = $(this).attr('opt').split(",");
					insertOptions2Select(g_sels, ["top", "bottom", "left", "right", "center", "custom"], ["up", "down", "left", "right", "center", "custom"], "blcmode");
					setValueDelayIE6("blcmode" ,"","",g_szsel);
					
					 if (g_szsel=="custom"  &&  g_szbacklightmode=="regionblc")
					 {
						$("#blccustom").show();
					  }
					  else
					  {
						$("#blccustom").hide(); 
					 }
				});
			}
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};


/****选择背光模式***/
function Changebacklightmode(){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;
		$("#SetResultImagsSettingsTips").html(szRetInfo);
		setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		return;
	}
	var backlightmode=$("#backlightmode").val();
	if (backlightmode=="close"){
		document.getElementById("plugin0").eventWebToPlugin("image","close");
		$("#wdr").hide();
		$("#hlc").hide();
		$("#blc").hide();
		$("#blccustom").hide();
		$("#autoblcevel").hide();
		$("#subfogthrough").hide();
		$("#subGammaleve").hide();
		$("#subsmartIR").hide();
	}else if(backlightmode=="wdr"){
		document.getElementById("plugin0").eventWebToPlugin("image","wdr");
		$("#wdr").show();
		$("#hlc").hide();
		$("#blc").hide();
		$("#blccustom").hide();
		$("#autoblcevel").hide();
		$("#subfogthrough").hide();
		$("#subGammaleve").hide();
		$("#subsmartIR").hide();
	}else if(backlightmode=="hlc"){
		document.getElementById("plugin0").eventWebToPlugin("image","hlc");
		$("#wdr").hide();
		$("#hlc").show();
		$("#blc").hide();
		$("#blccustom").hide();
		$("#autoblcevel").hide();
		$("#subfogthrough").hide();
		$("#subGammaleve").hide();
		$("#subsmartIR").hide();
	}else if(backlightmode=="autoblc"){
		document.getElementById("plugin0").eventWebToPlugin("image","autoblc");
		$("#wdr").hide();
		$("#hlc").hide();
		$("#blc").hide();
		$("#blccustom").hide();
		$("#autoblcevel").show();
		$("#subfogthrough").hide();
		$("#subGammaleve").hide();
		$("#subsmartIR").hide();
	}else if(backlightmode=="regionblc"  &&  $("#blcmode").val()=="custom"){
		document.getElementById("plugin0").eventWebToPlugin("image","regionblc_custom");
		$("#wdr").hide();
		$("#hlc").hide();
		$("#blc").show();
		$("#blccustom").show();
		$("#autoblcevel").show();
		$("#subfogthrough").hide();
		$("#subGammaleve").hide();
		$("#subsmartIR").hide();
	}else if(backlightmode=="regionblc"){
		document.getElementById("plugin0").eventWebToPlugin("image","regionblc");
		$("#wdr").hide();
		$("#hlc").hide();
		$("#blc").show();
		$("#blccustom").hide();
		$("#autoblcevel").show();
		$("#subfogthrough").hide();
		$("#subGammaleve").hide();
		$("#subsmartIR").hide();
	}
	else if(backlightmode=="fogthrough"){
		document.getElementById("plugin0").eventWebToPlugin("image","fogthrough");
		$("#wdr").hide();
		$("#hlc").hide();
		$("#blc").hide();
		$("#blccustom").hide();
		$("#autoblcevel").hide();
		$("#subfogthrough").show();
		$("#subGammaleve").hide();
		$("#subsmartIR").hide();
	}
	else if(backlightmode=="gamma"){
		document.getElementById("plugin0").eventWebToPlugin("image","gamma");
		$("#wdr").hide();
		$("#hlc").hide();
		$("#blc").hide();
		$("#blccustom").hide();
		$("#autoblcevel").hide();
		$("#subfogthrough").hide();
		$("#subGammaleve").show();
		$("#subsmartIR").hide();
	}
	else if(backlightmode=="smartir"){
		document.getElementById("plugin0").eventWebToPlugin("image","smartir");
		$("#wdr").hide();
		$("#hlc").hide();
		$("#blc").hide();
		$("#blccustom").hide();
		$("#autoblcevel").hide();
		$("#subfogthrough").hide();
		$("#subGammaleve").hide();
		$("#subsmartIR").show();
	}
	Setbacklightmode();
}

/****
imageenhance_mode  图像增强选择
**/
function imageenhance_mode(){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;
		$("#SetResultImagsSettingsTips").html(szRetInfo);
		setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		return;
	}
	var backlightmode=$("#imageenhance_slect").val();
	if (backlightmode=="close"){
		document.getElementById("plugin0").eventWebToPlugin("image","close");
		$("#imageenhance_wdr").hide();
		$("#imageenhance_hlc").hide();
		$("#imageenhance_blc").hide();
		$("#imageenhance_blccustom").hide();
		$("#imageenhance_autoblcevel").hide();
		$("#imageenhance_subfogthrough").hide();
		$("#imageenhance_subGammaleve").hide();
		$("#imageenhance_subsmartIR").hide();
	}else if(backlightmode=="wdr"){
		document.getElementById("plugin0").eventWebToPlugin("image","wdr");
		$("#imageenhance_wdr").show();
		$("#imageenhance_hlc").hide();
		$("#imageenhance_blc").hide();
		$("#imageenhance_blccustom").hide();
		$("#imageenhance_autoblcevel").hide();
		$("#imageenhance_subfogthrough").hide();
		$("#imageenhance_subGammaleve").hide();
		$("#imageenhance_subsmartIR").hide();
	}else if(backlightmode=="hlc"){
		document.getElementById("plugin0").eventWebToPlugin("image","hlc");
		$("#imageenhance_wdr").hide();
		$("#imageenhance_hlc").show();
		$("#imageenhance_blc").hide();
		$("#imageenhance_blccustom").hide();
		$("#imageenhance_autoblcevel").hide();
		$("#imageenhance_subfogthrough").hide();
		$("#imageenhance_subGammaleve").hide();
		$("#imageenhance_subsmartIR").hide();
	}else if(backlightmode=="autoblc"){
		document.getElementById("plugin0").eventWebToPlugin("image","autoblc");
		$("#imageenhance_wdr").hide();
		$("#imageenhance_hlc").hide();
		$("#imageenhance_blc").hide();
		$("#imageenhance_blccustom").hide();
		$("#imageenhance_autoblcevel").show();
		$("#imageenhance_subfogthrough").hide();
		$("#imageenhance_subGammaleve").hide();
		$("#imageenhance_subsmartIR").hide();
	}else if(backlightmode=="regionblc"  &&  $("#blcmode").val()=="custom"){
		document.getElementById("plugin0").eventWebToPlugin("image","regionblc_custom");
		$("#imageenhance_wdr").hide();
		$("#imageenhance_hlc").hide();
		$("#imageenhance_blc").show();
		$("#imageenhance_blccustom").show();
		$("#imageenhance_autoblcevel").show();
		$("#imageenhance_subfogthrough").hide();
		$("#imageenhance_subGammaleve").hide();
		$("#imageenhance_subsmartIR").hide();
	}else if(backlightmode=="regionblc"){
		document.getElementById("plugin0").eventWebToPlugin("image","regionblc");
		$("#imageenhance_wdr").hide();
		$("#imageenhance_hlc").hide();
		$("#imageenhance_blc").show();
		$("#imageenhance_blccustom").hide();
		$("#imageenhance_autoblcevel").show();
		$("#imageenhance_subfogthrough").hide();
		$("#imageenhance_subGammaleve").hide();
		$("#imageenhance_subsmartIR").hide();
	}
	else if(backlightmode=="fogthrough"){
		document.getElementById("plugin0").eventWebToPlugin("image","fogthrough");
		$("#imageenhance_wdr").hide();
		$("#imageenhance_hlc").hide();
		$("#imageenhance_blc").hide();
		$("#imageenhance_blccustom").hide();
		$("#imageenhance_autoblcevel").hide();
		$("#imageenhance_subfogthrough").show();
		$("#imageenhance_subGammaleve").hide();
		$("#imageenhance_subsmartIR").hide();
	}
	else if(backlightmode=="gamma"){
		document.getElementById("plugin0").eventWebToPlugin("image","gamma");
		$("#imageenhance_wdr").hide();
		$("#imageenhance_hlc").hide();
		$("#imageenhance_blc").hide();
		$("#imageenhance_blccustom").hide();
		$("#imageenhance_autoblcevel").hide();
		$("#imageenhance_subfogthrough").hide();
		$("#imageenhance_subGammaleve").show();
		$("#imageenhance_subsmartIR").hide();
	}
	else if(backlightmode=="smartir"){
		document.getElementById("plugin0").eventWebToPlugin("image","smartir");
		$("#imageenhance_wdr").hide();
		$("#imageenhance_hlc").hide();
		$("#imageenhance_blc").hide();
		$("#imageenhance_blccustom").hide();
		$("#imageenhance_autoblcevel").hide();
		$("#imageenhance_subfogthrough").hide();
		$("#imageenhance_subGammaleve").hide();
		$("#imageenhance_subsmartIR").show();
	}
	Setbacklightmode("imageenhance");
};

/*************************************************
Function:		blcmode
Description:	背光补偿区域			
*************************************************/
function Changeblcmode(){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;
		$("#SetResultImagsSettingsTips").html(szRetInfo);
		setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		return;
	}
	if($("#blcmode").val()=="custom"){
		$("#blccustom").show();
	}else{
		$("#blccustom").hide();
	}
	var mode=$("#backlightmode").val();
	var wdrlevel=$("#wdr_value").val();
	var hlclevel=$("#hlc_value").val();
	var blclevel=$("#autoblc_value").val();
	var sel=$("#blcmode").val();
	document.getElementById("plugin0").eventWebToPlugin("image",sel);
	if (sel!="custom"){
		var szXml = "<dynamicmodeInfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<mode>"+mode+"</mode>";
		szXml += "<wdrlevel>"+wdrlevel+"</wdrlevel>";
		szXml += "<hlclevel>"+hlclevel+"</hlclevel>";
		szXml += "<blclevel>"+blclevel+"</blclevel>";
		szXml += "<hlcarea>"
		  szXml += "<sel>"+sel+"</sel>";
		szXml += "</hlcarea>"
		szXml += "</dynamicmodeInfo>";
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/dynamicmode"
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
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});
	}
}


/*****设置动态调节(背光)********/
function Setbacklightmode(obj,typeid){
	if (obj=="imageenhance")
	{
		var mode=$("#imageenhance_slect").val();
		var wdrlevel=$("#imageenhance_wdr_value").val();
		var hlclevel=$("#imageenhance_hlc_value").val();
		var blclevel=$("#imageenhance_autoblc_value").val();
		var fogthroughlevel=$("#imageenhance_fogthrough_value").val();
		var gammalevel=$("#imageenhance_Gammaleve_value").val();
		var smartirlevel=$("#imageenhance_smartIR_value").val();
		
		var szXml = "<dynamicmodeInfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<mode>"+mode+"</mode>";
		if (typeid=="wdr")
		{
			szXml += "<wdrlevel>"+wdrlevel+"</wdrlevel>";
		}
		else if (typeid=="hlc")
		{
			szXml += "<hlclevel>"+hlclevel+"</hlclevel>";
		}
		else if (typeid=="blc")
		{
			szXml += "<blclevel>"+blclevel+"</blclevel>";
		}
		
		else if (typeid=="fogthrough")
		{
			szXml += "<fogthroughlevel>"+fogthroughlevel+"</fogthroughlevel>";
		}
		else if (typeid=="gamma")
		{
			szXml += "<gammalevel>"+gammalevel +"</gammalevel>";
		}
		
		else if (typeid=="smartIR")
		{
			szXml += "<smartirlevel>"+smartirlevel+"</smartirlevel>";
		}
		/*szXml += "<hlcarea>"
		  szXml += "<sel>"+g_szsel+"</sel>";
		szXml += "</hlcarea>"
		*/
		szXml += "</dynamicmodeInfo>";
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/imageenhance"
	}
	else
	{
		var mode=$("#backlightmode").val();
		var wdrlevel=$("#wdr_value").val();
		var hlclevel=$("#hlc_value").val();
		var blclevel=$("#autoblc_value").val();
		var fogthroughlevel=$("#fogthrough_value").val();
		var gammalevel=$("#Gammaleve_value").val();
		var smartirlevel=$("#smartIR_value").val();
		var szXml = "<dynamicmodeInfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<mode>"+mode+"</mode>";
		if (typeid=="autoblc"){
			szXml += "<blclevel>"+blclevel+"</blclevel>";
		}
		else if(typeid=="wdrlevel"){
			szXml += "<wdrlevel>"+wdrlevel+"</wdrlevel>";
		}
		else if(typeid=="hlclevel"){
			szXml += "<hlclevel>"+hlclevel+"</hlclevel>";
		}
		else if(typeid=="fogthroughlevel"){
			szXml += "<fogthroughlevel>"+fogthroughlevel+"</fogthroughlevel>";
		}
		else if(typeid=='gammalevel'){
			szXml += "<gammalevel>"+gammalevel +"</gammalevel>";
		}
		else if(typeid=='smartirlevel'){
			szXml += "<smartirlevel>"+smartirlevel+"</smartirlevel>";
		}
		/*szXml += "<hlcarea>"
		  szXml += "<sel>"+g_szsel+"</sel>";
		szXml += "</hlcarea>"
		*/
		szXml += "</dynamicmodeInfo>";
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/dynamicmode"
	}
	var xmlDoc = parseXmlFromStr(szXml);
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
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
}
function SetSlidehlc(){
	var hlclevel=$("#hlc_value").val();
	var szXml = "<hlc version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<hlclevel>"+hlclevel+"</hlclevel>";
 	szXml += "</hlc>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/hlc"
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
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
}
/*************************************************
Function:		GetHlc
Description:	强光抑制			
*************************************************/
function GetHlc(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/hlc"
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
		    //g_szHlcXml =xhr.responseText;
			var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			$(xmlDoc).find("hlclevel").each(function(i){ 
		  	 g_szHlcXml= $(this).text();
			}); 
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};

/*************************************************
Function:		GetIrcutfilter
Description:	获取日夜切换			
*************************************************/
function GetIrcutfilter(obj){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/ircutfilter"
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
			$("#daytonightlevel_value,#photolevel_value,#daytonight_value,#threshold_value").unbind("change");
		    $("#daytonightlevel_value,#photolevel_value,#daytonight_value,#threshold_value").unbind("keydown");   
				 //增益日夜转换阈值
				 if($(xmlDoc).find("gainthreshold").length > 0)
				 {
					$(xmlDoc).find("gainthreshold").each(function(i){ 
						 g_gainthresholdShow = $(this).attr('enable');
						 g_gainthresholdmin= Number($(this).attr('min'));
						 g_gainthresholdmax= Number($(this).attr('max'));
						 g_gainthresholdtext= Number($(this).text());
					})
					 
				 };
				 
				 //光敏日夜转换阈值
				 if($(xmlDoc).find("photothreshold").length > 0)
				 {
					 ($(xmlDoc).find("photothreshold")).each(function(i){ 
						 g_photothresholdShow = $(this).attr('enable');
						 g_photothresholdmin= Number($(this).attr('min'));
						 g_photothresholdmax= Number($(this).attr('max'));
						 g_photothresholdtext= Number($(this).text());
					 });
				 };
				 
				
				
				
				//日夜转换类型
				$(xmlDoc).find("ircutfiltertype").each(function(i){ 
				  var k_szIrcutfilterxml= $(this).text();
					$("#IrcutfilterType").empty(); 
					 var k_Ircutfiltereopts = $(this).attr('opt').split(",");
					insertOptions2Select(k_Ircutfiltereopts, ["day", "night", "auto", "auto_gain","auto_photo", "time", "trigger"], ["day", "night", "auto","autogain","autophoto", "timedaynight", "alarminspring"], "IrcutfilterType");
					setValueDelayIE6("IrcutfilterType" ,"","",k_szIrcutfilterxml);
						//ChangeIrcutfilterType('get');    //日夜切换关联
						
						if(k_szIrcutfilterxml=="auto")
						{
							$("#subphotolevel").hide();  //光敏灵敏度
							$("#subdaytonightlevel").show();
							$("#subdaytonight").show();
							$("#SubTriggerState").hide();
							$("#edittime").hide();
							if (g_gainthresholdShow=="true")
							{
								$("#subthreshold").show();
								$("#threshold_value").val(g_gainthresholdtext).attr('maxlength',g_gainthresholdmax.length);
								GetircutfilterLevel('gainthreshold','get');  //增益日夜转换阈值
							}
							else if(g_photothresholdShow=="true")
							{
								$("#subthreshold").show();
								$("#threshold_value").val(g_photothresholdtext).attr('maxlength',g_photothresholdmax.length);
								GetircutfilterLevel('photothreshold','get');  //光敏日夜转换阈值
							}
							else
							{
								$("#subthreshold").hide();
							}
							
						}
						else if(k_szIrcutfilterxml=="auto_gain")//增益触发
						{
							$("#subphotolevel").hide();  //光敏灵敏度
							$("#subdaytonightlevel").show();
							$("#subdaytonight").show();
							$("#SubTriggerState").hide();
							$("#edittime").hide();
							if (g_gainthresholdShow=="true")
							{
								$("#subthreshold").show();
								$("#threshold_value").val(g_gainthresholdtext).attr('maxlength',g_gainthresholdmax.length);
								GetircutfilterLevel('gainthreshold','get');  //增益日夜转换阈值
							}
							else
							{
								$("#subthreshold").hide();
							}
							
						}
						else if(k_szIrcutfilterxml=="auto_photo")//光敏触发
						{
							$("#subphotolevel").show();
							$("#subdaytonightlevel").hide();
							$("#subdaytonight").show();
							$("#SubTriggerState").hide();
							$("#edittime").hide();
							if(g_photothresholdShow=="true")
							{
								$("#subthreshold").show();
								$("#threshold_value").val(g_photothresholdtext).attr('maxlength',g_photothresholdmax.length);
								GetircutfilterLevel('photothreshold','get');  //光敏日夜转换阈值
							}
							else
							{
								$("#subthreshold").hide();
							}
							
						}
						else if (k_szIrcutfilterxml=="trigger")
						{
							$("#SubTriggerState").show()
							$("#subdaytonightlevel").hide();
							$("#subdaytonight").hide();
							$("#edittime").hide();
							$("#subthreshold").hide();
							$("#subphotolevel").hide();
						}
						else if(k_szIrcutfilterxml=="time")
						{
							$("#SubTriggerState").hide()
							$("#subdaytonightlevel").hide();
							$("#subdaytonight").hide();
							$("#edittime").show();
							$("#subthreshold").hide();
							$("#subphotolevel").hide();
						}
						else{
							$("#SubTriggerState").hide()
							$("#subdaytonightlevel").hide();
							$("#subdaytonight").hide();
							$("#edittime").hide();
							$("#subthreshold").hide();
							$("#subphotolevel").hide();
						}
				});

				//触发状态{白天，夜晚}
				if($(xmlDoc).find("trigger").length > 0)
				{
					$(xmlDoc).find("trigger").each(function(i){ 
					  var g_trigger= $(this).text();
						$("#TriggerType").empty(); 
						 var g_triggers = $(this).attr('opt').split(",");
						insertOptions2Select(g_triggers, ["day", "night"], ["day", "night"], "TriggerType");
						setValueDelayIE6("TriggerType" ,"","",g_trigger);
					});
				}
				
			
				//灵敏度(高\中\低)
				/*if($(xmlDoc).find("daytonightlevel").length > 0)
				{
					$(xmlDoc).find("daytonightlevel").each(function(i){ 
						 var g_daytonightlevel= $(this).text();
						$("#daytonightlevel").empty(); 
						 var g_daytonightlevels = $(this).attr('opt').split(",");
						insertOptions2Select(g_daytonightlevels, ["hight", "middle" ,"low"], ["hight", "middle" ,"low"], "daytonightlevel");
						setValueDelayIE6("daytonightlevel" ,"","",g_daytonightlevel);
					});
				}*/
				
				if($(xmlDoc).find("daytonightlevel").length > 0)
				{
					 $(xmlDoc).find("daytonightlevel").each(function(i){ 
					 var g_szdaytonightlevel= Number($(this).text());
					 var g_szdaytonightlevelmin= Number($(this).attr('min'));
					 var g_szdaytonightlevelmax= Number($(this).attr('max'));
					 $("#daytonightlevel_value").val(g_szdaytonightlevel).attr('maxlength',$(this).attr('max').length);
					 $( "#slider_daytonightlevel" ).slider({
						  range: "min",
						  value: g_szdaytonightlevel,
						  min: g_szdaytonightlevelmin,
						  max: g_szdaytonightlevelmax,
						  slide: function( event, ui ) {
							$("#daytonightlevel_value").val(ui.value);
						  },
						stop: function( event, ui ) {
							$("#daytonightlevel_value").val($( "#slider_daytonightlevel" ).slider( "value" ));
							Setircutfilter('daytonightlevel');
						  }
						});
						
						if($.browser.msie) {
							$('#daytonightlevel_value').keydown(function(e){
							  if(e.keyCode==13)
							  {
								  if (!CheackOnlyNum($("#daytonightlevel_value").val()))
									{
										  $("#daytonightlevel_value").val($( "#slider_daytonightlevel" ).slider( "value" ))
										  return;
									}
									if (parseInt($("#daytonightlevel_value").val()) < parseInt(g_szdaytonightlevelmin) || parseInt($("#daytonightlevel_value").val()) > parseInt(g_szdaytonightlevelmax) ){
										 $("#daytonightlevel_value").val($( "#slider_daytonightlevel" ).slider( "value" ))
									}
									else
									{
										$("#slider_daytonightlevel").slider( "value", $("#daytonightlevel_value").val() );
										Setircutfilter('daytonightlevel');
									}
							  }
							});
						};
						$( "#daytonightlevel_value" ).change(function() {
							if (!CheackOnlyNum($("#daytonightlevel_value").val()))
							{
								  $("#daytonightlevel_value").val($( "#slider_daytonightlevel" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#daytonightlevel_value").val()) < parseInt(g_szdaytonightlevelmin) || parseInt($("#daytonightlevel_value").val()) > parseInt(g_szdaytonightlevelmax) ){
								 $("#daytonightlevel_value").val($( "#slider_daytonightlevel" ).slider( "value" ))
							}
							else
							{
								$("#slider_daytonightlevel").slider( "value", $("#daytonightlevel_value").val() );
								Setircutfilter('daytonightlevel');
							}
						});
					});
				};
				
				
				//光敏灵敏度
				if($(xmlDoc).find("photolevel").length > 0)
				{
					 $(xmlDoc).find("photolevel").each(function(i){ 
					 var g_szphotoleve= Number($(this).text());
					 var g_szphotolevemin= Number($(this).attr('min'));
					 var g_szphotolevemax= Number($(this).attr('max'));
					 $("#photolevel_value").val(g_szphotoleve).attr('maxlength',$(this).attr('max').length);
					 $( "#slider_photolevel" ).slider({
						  range: "min",
						  value: g_szphotoleve,
						  min: g_szphotolevemin,
						  max: g_szphotolevemax,
						  slide: function( event, ui ) {
							$("#photolevel_value").val(ui.value);
						  },
						stop: function( event, ui ) {
							$("#photolevel_value").val($( "#slider_photolevel" ).slider( "value" ));
							Setircutfilter('photolevel');
						  }
						});
						
						if($.browser.msie) {
							$('#photolevel_value').keydown(function(e){
							  if(e.keyCode==13)
							  {
								  if (!CheackOnlyNum($("#photolevel_value").val()))
									{
										  $("#photolevel_value").val($( "#slider_photolevel" ).slider( "value" ))
										  return;
									}
									if (parseInt($("#photolevel_value").val()) < parseInt(g_szphotolevemin) || parseInt($("#photolevel_value").val()) > parseInt(g_szphotolevemax) ){
										 $("#photolevel_value").val($( "#slider_photolevel" ).slider( "value" ))
									}
									else
									{
										$("#slider_photolevel").slider( "value", $("#photolevel_value").val() );
										Setircutfilter('photolevel');
									}
							  }
							});
						};
						$( "#photolevel_value" ).change(function() {
							if (!CheackOnlyNum($("#photolevel_value").val()))
							{
								  $("#photolevel_value").val($( "#slider_photolevel" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#photolevel_value").val()) < parseInt(g_szphotolevemin) || parseInt($("#photolevel_value").val()) > parseInt(g_szphotolevemax) ){
								 $("#photolevel_value").val($( "#slider_photolevel" ).slider( "value" ))
							}
							else
							{
								$("#slider_photolevel").slider( "value", $("#photolevel_value").val() );
								Setircutfilter('photolevel');
							}
						});
					});
				};
				
				
				
			
			
			//日夜转换时间灵敏度
				if($(xmlDoc).find("daytonightlevel").length > 0)
				{
					 $(xmlDoc).find("daytonighttime").each(function(i){ 
					 g_szdaytonighttime= Number($(this).text());
					 g_szdaytonighttimemin= Number($(this).attr('min'));
					 g_szdaytonighttimemax= Number($(this).attr('max'));
					 $("#daytonight_value").val(g_szdaytonighttime).attr('maxlength',$(this).attr('max').length);
					 $( "#slider_daytonight" ).slider({
						  range: "min",
						  value: g_szdaytonighttime,
						  min: g_szdaytonighttimemin,
						  max: g_szdaytonighttimemax,
						  slide: function( event, ui ) {
							$("#daytonight_value").val(ui.value);
						  },
						stop: function( event, ui ) {
							$("#daytonight_value").val($( "#slider_daytonight" ).slider( "value" ));
							Setircutfilter('daytonighttime');
						  }
						});
						
						if($.browser.msie) {
							$('#daytonight_value').keydown(function(e){
							  if(e.keyCode==13)
							  {
								  if (!CheackOnlyNum($("#daytonight_value").val()))
									{
										  $("#daytonight_value").val($( "#slider_daytonight" ).slider( "value" ))
										  return;
									}
									if (parseInt($("#daytonight_value").val()) < parseInt(g_szdaytonighttimemin) || parseInt($("#daytonight_value").val()) > parseInt(g_szdaytonighttimemax) ){
										 $("#daytonight_value").val($( "#slider_daytonight" ).slider( "value" ))
									}
									else
									{
										$("#slider_daytonight").slider( "value", $("#daytonight_value").val() );
										Setircutfilter('daytonighttime');
									}
							  }
							});
						};
						$( "#daytonight_value" ).change(function() {
							if (!CheackOnlyNum($("#daytonight_value").val()))
							{
								  $("#daytonight_value").val($( "#slider_daytonight" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#daytonight_value").val()) < parseInt(g_szdaytonighttimemin) || parseInt($("#daytonight_value").val()) > parseInt(g_szdaytonighttimemax) ){
								 $("#daytonight_value").val($( "#slider_daytonight" ).slider( "value" ))
							}
							else
							{
								$("#slider_daytonight").slider( "value", $("#daytonight_value").val() );
								Setircutfilter('daytonighttime');
							}
						});
					});
				};
			
			
			
		    //每天
			if($(xmlDoc).find("fixedtime").length > 0)
			{
				//每天
				if($(xmlDoc).find("fixedtime").find('all').length > 0)
				{
					$(xmlDoc).find("fixedtime").find('all').each(function(i){ 
					  var k_fixedtimeopt=$(this).attr('enable');
					   $("#starttimeALl").val($(this).children('starttime').text());
					   $("#endtimeALl").val($(this).children('endtime').text());
					   if (k_fixedtimeopt=="true")
					   {
							$("#AllTime").val(true).prop("checked", true).prop("disabled", false);
							$("input[name='weekday']").val(false).prop("checked", true).prop("disabled", true);//不勾选禁用
							for (i=1;i<=7;i++)
							{
							  $("#starttime0"+i).val($("#starttimeALl").val()).prop("disabled", true);
							  $("#endtime0"+i).val($("#endtimeALl").val()).prop("disabled", true);
						    };
						}
						else
						{
							$("#AllTime").val(false).prop("checked", false).prop("disabled", true);
							$("input[name='weekday']").val(false).prop("checked", false).prop("disabled", false);//不勾选启用
							for (i=1;i<=7;i++)
							{
							  $("#starttime0"+i).val($("#starttimeALl").val()).prop("disabled", false);
							  $("#endtime0"+i).val($("#endtimeALl").val()).prop("disabled", false);
						    };
						};
					});
				};
				//星期
				//weekday 
				if($(xmlDoc).find("fixedtime").find('weekday').length > 0)
				{
					$("#AllTime").val(false).prop("checked", false);
					$("input[name='weekday']").val(false).prop("checked", false).prop("disabled", false);//不勾选启用
					var weekdaylength=$(xmlDoc).find("fixedtime").find('weekday').length;
					for (i=1;i<=weekdaylength;i++)
					{
						$(xmlDoc).find("weekday[index='"+i+"']").each(function(){ 
						   var weekday_enable=$(this).attr('enable');
						   var starttime=$(this).children('starttime').text();
						   var endtime=$(this).children('endtime').text();
						   if (weekday_enable=="true")
						   {
							   $("#Week0"+i).val(true).prop("checked", true).prop("disabled", false);
						   }
						   else
						   {
							   $("#Week0"+i).val(false).prop("checked", false).prop("disabled", false);
						   }
						   $("#starttime0"+i).val(starttime).prop("disabled", false);
						   $("#endtime0"+i).val(endtime).prop("disabled", false);
						});
					}
				}
			}
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};

function GetircutfilterLevel(obj,type){
  if (obj=="photothreshold")
  {
	     $("#slider_threshold").slider({
		  range: "min",
		  value: g_photothresholdtext,
		  min: g_photothresholdmin,
		  max: g_photothresholdmax,
		  slide: function( event, ui ) {
			$("#threshold_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#threshold_value").val($( "#slider_threshold" ).slider( "value" ));
			Setircutfilter('threshold','set');
		  }
		});
		
		if($.browser.msie) {
			$('#threshold_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#threshold_value").val()))
					{
						  $("#threshold_value").val($( "#slider_threshold" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#threshold_value").val()) < parseInt(g_photothresholdmin) || parseInt($("#threshold_value").val()) > parseInt(g_photothresholdmax) ){
						 $("#threshold_value").val($( "#slider_threshold" ).slider( "value" ))
					}
					else
					{
						$("#slider_daytonight").slider( "value", $("#threshold_value").val() );
						Setircutfilter('threshold','set');
					}
			  }
			});
		};
		$( "#threshold_value" ).change(function() {
			if (!CheackOnlyNum($("#threshold_value").val()))
			{
				  $("#threshold_value").val($( "#slider_threshold" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#threshold_value").val()) < parseInt(g_photothresholdmin) || parseInt($("#threshold_value").val()) > parseInt(g_photothresholdmax) ){
				 $("#threshold_value").val($( "#slider_threshold" ).slider( "value" ))
			}
			else
			{
				$("#slider_threshold").slider( "value", $("#threshold_value").val() );
				Setircutfilter('threshold','set');
			}
		});
	  
  }
  else if(obj=="gainthreshold")
  {
	  $("#slider_threshold").slider({
		  range: "min",
		  value: g_gainthresholdtext,
		  min: g_gainthresholdmin,
		  max: g_gainthresholdmax,
		  slide: function( event, ui ) {
			$("#threshold_value").val(ui.value);
		  },
		stop: function( event, ui ) {
			$("#threshold_value").val($( "#slider_threshold" ).slider( "value" ));
			Setircutfilter('gainthreshold','set');
		  }
		});
		
		if($.browser.msie) {
			$('#threshold_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#threshold_value").val()))
					{
						  $("#threshold_value").val($( "#slider_threshold" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#threshold_value").val()) < parseInt(g_gainthresholdmin) || parseInt($("#threshold_value").val()) > parseInt(g_gainthresholdmax) ){
						 $("#threshold_value").val($( "#slider_threshold" ).slider( "value" ))
					}
					else
					{
						$("#slider_daytonight").slider( "value", $("#threshold_value").val() );
						Setircutfilter('gainthreshold','set');
					}
			  }
			});
		};
		$( "#threshold_value" ).change(function() {
			if (!CheackOnlyNum($("#threshold_value").val()))
			{
				  $("#threshold_value").val($( "#slider_threshold" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#threshold_value").val()) < parseInt(g_gainthresholdmin) || parseInt($("#threshold_value").val()) > parseInt(g_gainthresholdmax) ){
				 $("#threshold_value").val($( "#slider_threshold" ).slider( "value" ))
			}
			else
			{
				$("#slider_threshold").slider( "value", $("#threshold_value").val() );
				Setircutfilter('gainthreshold','set');
			}
		});
  };

  
}



//选中每天
function AlldayTime(obj){
		
	if($(obj).prop("checked"))
	{ 
	  $(obj).val(true).prop("checked", true).prop("disabled",false);
	  $("input[name='weekday']").val(false).prop("checked", true).prop("disabled", true);
	  for (i=1;i<=7;i++)
		{
		  $("#starttime0"+i).val($("#starttimeALl").val()).prop("disabled", true);
		  $("#endtime0"+i).val($("#endtimeALl").val()).prop("disabled", true);
	   };
	}
	else
	{
	  $(obj).val(false).prop("checked", false).prop("disabled",false);
	  $("input[name='weekday']").val(false).prop("checked", false).prop("disabled", false);
	  for (i=1;i<=7;i++)
		{
		  $("#starttime0"+i).val($("#starttimeALl").val()).prop("disabled", false);
		  $("#endtime0"+i).val($("#endtimeALl").val()).prop("disabled", false);
	   };
	}
	/*for (i=1;i<=7;i++)
    {
	  $("#starttime0"+i).val("07:00:00");
	  $("#endtime0"+i).val("18:00:00");
   };*/	
};

/***日夜切换关联****/
function ChangeIrcutfilterType(obj){
	
	var IrcutfilterType = $("#IrcutfilterType").val();
	if(IrcutfilterType=="auto")
	{
		$("#subphotolevel").hide();  //光敏灵敏度
		$("#subdaytonightlevel").show();
		$("#subdaytonight").show();
		$("#SubTriggerState").hide();
		$("#edittime").hide();
		if (g_gainthresholdShow=="true")
		{
			$("#subthreshold").show();
			$("#threshold_value").val(g_gainthresholdtext).attr('maxlength',g_gainthresholdmax.length);
			GetircutfilterLevel('gainthreshold','get');  //增益日夜转换阈值
		}
		else if(g_photothresholdShow=="true")
		{
			$("#subthreshold").show();
			$("#threshold_value").val(g_photothresholdtext).attr('maxlength',g_photothresholdmax.length);
			GetircutfilterLevel('photothreshold','get');  //光敏日夜转换阈值
		}
		else
		{
			$("#subthreshold").hide();
		}
		Setircutfilter('ircutfiltertype','set');
	}
	else if(IrcutfilterType=="auto_gain")//增益触发
	{
		$("#subphotolevel").hide();  //光敏灵敏度
		$("#subdaytonightlevel").show();
		$("#subdaytonight").show();
		$("#SubTriggerState").hide();
		$("#edittime").hide();
		if (g_gainthresholdShow=="true")
		{
			$("#subthreshold").show();
			$("#threshold_value").val(g_gainthresholdtext).attr('maxlength',g_gainthresholdmax.length);
			GetircutfilterLevel('gainthreshold','get');  //增益日夜转换阈值
		}
		
		else
		{
			$("#subthreshold").hide();
		}
		Setircutfilter('ircutfiltertype','set');
	}
	else if(IrcutfilterType=="auto_photo")//光敏触发
	{
		$("#subphotolevel").show();
		$("#subdaytonightlevel").hide();
		$("#subdaytonight").show();
		$("#SubTriggerState").hide();
		$("#edittime").hide();
		if(g_photothresholdShow=="true")
		{
			$("#subthreshold").show();
			$("#threshold_value").val(g_photothresholdtext).attr('maxlength',g_photothresholdmax.length);
			GetircutfilterLevel('photothreshold','get');  //光敏日夜转换阈值
		}
		else
		{
			$("#subthreshold").hide();
		}
		Setircutfilter('ircutfiltertype','set');
	}
	else if (IrcutfilterType=="trigger")
	{
		$("#SubTriggerState").show()
		$("#subdaytonightlevel").hide();
		$("#subdaytonight").hide();
		$("#edittime").hide();
		$("#subthreshold").hide();
		$("#subphotolevel").hide();
		Setircutfilter('ircutfiltertype','set');
	}
	else if(IrcutfilterType=="time")
	{
		$("#SubTriggerState").hide()
		$("#subdaytonightlevel").hide();
		$("#subdaytonight").hide();
		$("#edittime").show();
		$("#subthreshold").hide();
		$("#subphotolevel").hide();
	}
	else{
		$("#SubTriggerState").hide()
		$("#subdaytonightlevel").hide();
		$("#subdaytonight").hide();
		$("#edittime").hide();
		$("#subthreshold").hide();
		$("#subphotolevel").hide();
		Setircutfilter('ircutfiltertype','set');
	}
	
}
//编辑时间
function EditTime(){
	//GetIrcutfilter();
	$("#mainplugin").width(0).height(1)
	//GetIrcutfilter("EditTime");
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/ircutfilter"
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
			
		    //每天
			if($(xmlDoc).find("fixedtime").length > 0)
			{
				//每天
				if($(xmlDoc).find("fixedtime").find('all').length > 0)
				{
					$(xmlDoc).find("fixedtime").find('all').each(function(i){ 
					  var k_fixedtimeopt=$(this).attr('enable');
					   $("#starttimeALl").val($(this).children('starttime').text());
					   $("#endtimeALl").val($(this).children('endtime').text());
					   if (k_fixedtimeopt=="true")
					   {
							$("#AllTime").val(true).prop("checked", true).prop("disabled", false);
							$("input[name='weekday']").val(false).prop("checked", true).prop("disabled", true);//不勾选禁用
							for (i=1;i<=7;i++)
							{
							  $("#starttime0"+i).val($("#starttimeALl").val()).prop("disabled", true);
							  $("#endtime0"+i).val($("#endtimeALl").val()).prop("disabled", true);
						    };
						}
						else
						{
							$("#AllTime").val(false).prop("checked", false).prop("disabled", true);
							$("input[name='weekday']").val(false).prop("checked", false).prop("disabled", false);//不勾选启用
							for (i=1;i<=7;i++)
							{
							  $("#starttime0"+i).val($("#starttimeALl").val()).prop("disabled", false);
							  $("#endtime0"+i).val($("#endtimeALl").val()).prop("disabled", false);
						    };
						};
					});
				};
				//星期
				//weekday 
				if($(xmlDoc).find("fixedtime").find('weekday').length > 0)
				{
					$("#AllTime").val(false).prop("checked", false);
					$("input[name='weekday']").val(false).prop("checked", false).prop("disabled", false);//不勾选启用
					var weekdaylength=$(xmlDoc).find("fixedtime").find('weekday').length;
					for (i=1;i<=weekdaylength;i++)
					{
						$(xmlDoc).find("weekday[index='"+i+"']").each(function(){ 
						   var weekday_enable=$(this).attr('enable');
						   var starttime=$(this).children('starttime').text();
						   var endtime=$(this).children('endtime').text();
						   if (weekday_enable=="true")
						   {
							   $("#Week0"+i).val(true).prop("checked", true).prop("disabled", false);
						   }
						   else
						   {
							   $("#Week0"+i).val(false).prop("checked", false).prop("disabled", false);
						   }
						   $("#starttime0"+i).val(starttime).prop("disabled", false);
						   $("#endtime0"+i).val(endtime).prop("disabled", false);
						});
					}
				}
			}
			else
			{
				$("#AllTime").val(false).prop("checked", false).prop("disabled", false);
				$("input[name='weekday']").val(false).prop("checked", false).prop("disabled", false);//不勾选禁用
				for (i=1;i<=7;i++)
				{
				  $("#starttime0"+i).val("07:00:00").prop("disabled", false);
				  $("#endtime0"+i).val("18:00:00").prop("disabled", false);
				};
			}
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
	
	setTimeout(function (){
		$("#divTimeTable").modal(
		  {
			"close":false,
			 "position":[60]  
		  }
		); 
		$("#TitleTalbe").html("<label name='MButEditTime'>"+getNodeValue('MButEditTime')+"</label>")
	},10);
	
}
//取消弹出窗口
function CancelDlg(){
	$.modal.impl.close();	
	$("#mainplugin").width(352).height(254);
};

//日夜转换触发状态
function ChangeTriggerType(){
	Setircutfilter('trigger');
}
function weekday(index){
	if($("#Week0"+index).attr("checked")){
		 $("#Week0"+index).val(true);
		}else{
		  $("#Week0"+index).val(false);
		}
}
function daytonightlevel(){
	Setircutfilter('daytonightlevel');
}
/*************************************************
Function:		Setircutfilter
Description:	设置日夜切换			
*************************************************/
function Setircutfilter(obj,type){
	var ircutfiltertype=$("#IrcutfilterType").val();
	var trigger=$("#TriggerType").val();
	var daytonightlevel=$("#daytonightlevel_value").val();
	var daytonighttime=$("#daytonight_value").val();
	var szXml = "<ircutfilter version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	if (obj=="ircutfiltertype")
	{
		 szXml += "<ircutfiltertype>"+ircutfiltertype+"</ircutfiltertype>";
    }
	else if (obj=="threshold")
	{
		szXml += "<photothreshold>"+$("#threshold_value").val()+"</photothreshold>";
	}
	else if(obj=='gainthreshold')
	{
		szXml += "<gainthreshold>"+$("#threshold_value").val()+"</gainthreshold>";
	}
	else if(obj=='photolevel')
	{
		szXml += "<photolevel>"+$("#photolevel_value").val()+"</photolevel>";
	}
	else if (obj=='daytonightlevel')
	{
		szXml += "<daytonightlevel>"+daytonightlevel+"</daytonightlevel>";
	}
	else if(obj=='trigger')
	{
		szXml += "<trigger>"+trigger+"</trigger>";
	}
	else if(obj=='daytonighttime')
	{
		szXml += "<daytonighttime>"+daytonighttime+"</daytonighttime>";
	}
 	szXml += "</ircutfilter>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/ircutfilter"
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
						GetIrcutfilter();
						//GetIrcut();
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			// GetIrcutfilter(); 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};

function GetIrcut(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/ircutfilter"
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
				 //增益日夜转换阈值
				 if($(xmlDoc).find("gainthreshold").length > 0)
				 {
					$(xmlDoc).find("gainthreshold").each(function(i){ 
						 g_gainthresholdShow = $(this).attr('enable');
						 g_gainthresholdmin= Number($(this).attr('min'));
						 g_gainthresholdmax= Number($(this).attr('max'));
						 g_gainthresholdtext= Number($(this).text());
					})
					 
				 };
				 
				 //光敏日夜转换阈值
				 if($(xmlDoc).find("photothreshold").length > 0)
				 {
					 ($(xmlDoc).find("photothreshold")).each(function(i){ 
						 g_photothresholdShow = $(this).attr('enable');
						 g_photothresholdmin= Number($(this).attr('min'));
						 g_photothresholdmax= Number($(this).attr('max'));
						 g_photothresholdtext= Number($(this).text());
						 $("#threshold_value").val(g_photothresholdtext).attr('maxlength',$(this).attr('max').length);
						 $( "#slider_threshold" ).slider({
							  range: "min",
							  value: g_szphotoleve,
							  min: g_szphotolevemin,
							  max: g_szphotolevemax,
							  slide: function( event, ui ) {
								$("#threshold_value").val(ui.value);
							  }
							});
					 });
				 };
				 
				
				
				
				//日夜转换类型
				$(xmlDoc).find("ircutfiltertype").each(function(i){ 
				  var k_szIrcutfilterxml= $(this).text();
					$("#IrcutfilterType").empty(); 
					 var k_Ircutfiltereopts = $(this).attr('opt').split(",");
					insertOptions2Select(k_Ircutfiltereopts, ["day", "night", "auto", "auto_gain","auto_photo", "time", "trigger"], ["day", "night", "auto","autogain","autophoto", "timedaynight", "alarminspring"], "IrcutfilterType");
					setValueDelayIE6("IrcutfilterType" ,"","",k_szIrcutfilterxml);
						ChangeIrcutfilterType('get');    //日夜切换关联
				});
				
				
			
				//光敏灵敏度
				if($(xmlDoc).find("photolevel").length > 0)
				{
					 $(xmlDoc).find("photolevel").each(function(i){ 
					 var g_szphotoleve= Number($(this).text());
					 var g_szphotolevemin= Number($(this).attr('min'));
					 var g_szphotolevemax= Number($(this).attr('max'));
					 $("#photolevel_value").val(g_szphotoleve).attr('maxlength',$(this).attr('max').length);
					 $( "#slider_photolevel" ).slider({
						  range: "min",
						  value: g_szphotoleve,
						  min: g_szphotolevemin,
						  max: g_szphotolevemax,
						  slide: function( event, ui ) {
							$("#photolevel_value").val(ui.value);
						  }
						
						});
					});
				};
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};


/*************************************************
Function:		SetTimeircutfilter
Description:	日夜切换时间设置			
*************************************************/
function SetTimeircutfilter(){
		var ircutfiltertype=$("#IrcutfilterType").val();
	    var trigger=$("#TriggerType").val();
	    var daytonightlevel=$("#daytonightlevel_value").val();
	    var daytonighttime=$("#daytonight_value").val();
	
	
		var allenable=$("#AllTime").val();
		var starttimeALL=$("#starttimeALl").val();
		var endtimeALl=$("#endtimeALl").val();
		
		if (starttimeALL >= endtimeALl ){
			szRetInfo = m_szErrorState+getNodeValue('Meveryday')+getNodeValue('jsTimeSegmentErrorSegTips');
		    $("#EditTimeTips").html(szRetInfo);
			setTimeout(function(){$("#EditTimeTips").html("");},5000);  //5秒后自动清除
			return;
		}
		for (var x = 1; x<= 7; x ++){
			if ($("#starttime0"+x).val()  >= $("#endtime0"+x).val() ){
				szRetInfo = m_szErrorState+getNodeValue('MaTimeTypeOption'+(x))+getNodeValue('jsTimeSegmentErrorSegTips');
				$("#EditTimeTips").html(szRetInfo);
				setTimeout(function(){$("#EditTimeTips").html("");},5000);  //5秒后自动清除
				return;
			}
		}
		var check = $("input[name='weekday']:checked");
		if (allenable=="true"){
			var szXml = "<ircutfilter version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
				szXml += "<ircutfiltertype>"+ircutfiltertype+"</ircutfiltertype>";
				//szXml += "<trigger>"+trigger+"</trigger>";
				    szXml += "<fixedtime>"
				 	 szXml += "<all enable='"+allenable+"'>"
						 szXml += "<starttime>"+starttimeALL+"</starttime>";
						 szXml += "<endtime>"+endtimeALl+"</endtime>";
				 	 szXml += "</all>";
				 	szXml += "</fixedtime>"
				//szXml += "<daytonightlevel>"+daytonightlevel+"</daytonightlevel>";
				//szXml += "<daytonighttime>"+daytonighttime+"</daytonighttime>";
				szXml += "</ircutfilter>";
		}else if(allenable=="false"){
		var szXml = "<ircutfilter version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<ircutfiltertype>"+ircutfiltertype+"</ircutfiltertype>";
		//szXml += "<trigger>"+trigger+"</trigger>";
		szXml += "<fixedtime>"
		for (i=1;i<=7;i++)
		{
			szXml += "<weekday index='"+i+"' enable='"+$("#Week0"+i).val()+"'>"
			 szXml += "<starttime>"+$("#starttime0"+i).val()+"</starttime>";
			 szXml += "<endtime>"+$("#endtime0"+i).val()+"</endtime>";
		   szXml += "</weekday>";
		}
		szXml += "</fixedtime>"
		//szXml += "<daytonightlevel>"+daytonightlevel+"</daytonightlevel>";
		//szXml += "<daytonighttime>"+daytonighttime+"</daytonighttime>";
		szXml += "</ircutfilter>";
		}else if(check.length==0){
			var szXml = "<ircutfilter version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
				
				szXml += "<ircutfiltertype>"+ircutfiltertype+"</ircutfiltertype>";
				//szXml += "<trigger>"+trigger+"</trigger>";
				
				    szXml += "<fixedtime>"
				 	 szXml += "<all enable='true'>"
						 szXml += "<starttime>"+starttimeALL+"</starttime>";
						 szXml += "<endtime>"+endtimeALl+"</endtime>";
				 	 szXml += "</all>";
				 	szXml += "</fixedtime>"
				//szXml += "<daytonightlevel>"+daytonightlevel+"</daytonightlevel>";
				//szXml += "<daytonighttime>"+daytonighttime+"</daytonighttime>";
				szXml += "</ircutfilter>";
		}
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/ircutfilter"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		//cache:false, 缓存
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
						szRetInfo = m_szSuccessState+m_szSuccess1;
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
			
			 $.modal.impl.close();
			 $("#mainplugin").width(352).height(254)
			 GetIrcutfilter(); 
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});
}

/*************************************************
Function:		Get2dlevel
Description:	降噪2D			
*************************************************/
function Get2dlevel(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/noisereduce2d"
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
			$("#2D_value").unbind("change");
		    $("#2D_value").unbind("keydown");  
			//2d降嗓模式
			$(xmlDoc).find("mode").each(function(i){ 
		  	 	var k_modexml= $(this).text();
				$("#mode2d").empty(); 
				 var k_qualityeopts = $(this).attr('opt').split(",");
				insertOptions2Select(k_qualityeopts, ["auto", "open", "close"], ["auto", "open", "close"], "mode2d");
				setValueDelayIE6("mode2d" ,"","",k_modexml);
				if (k_modexml=="close")
				{
					$("#noisereduce2D").hide();
				}
				else
				{
					$("#noisereduce2D").show();
				}
			});
			$(xmlDoc).find("level").each(function(i){ 
		  	 k_sz2dlevel= Number($(this).text());
			 k_sz2dlevelmin = Number($(this).attr('min'));
			 k_sz2dlevelmax = Number($(this).attr('max'));
			 $("#2D_value").val(k_sz2dlevel).attr('maxlength',$(this).attr('max').length);
			 $("#slider_2D").slider({
				  range: "min",
				  value: k_sz2dlevel,
				  min: k_sz2dlevelmin,
				  max: k_sz2dlevelmax,
				  slide: function( event, ui ) {
					$("#2D_value").val(ui.value);
				  },
				stop: function( event, ui ) {
					$("#2D_value").val($( "#slider_2D" ).slider( "value" ));
					Set2DNoisereduce();
				  }
				});
			   if($.browser.msie) {
					$('#2D_value').keydown(function(e){
					  if(e.keyCode==13)
					  {
						  if (!CheackOnlyNum($("#2D_value").val()))
							{
								  $("#2D_value").val($( "#slider_2D" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#2D_value").val()) < parseInt(k_sz2dlevelmin) || parseInt($("#2D_value").val()) > parseInt(k_sz2dlevelmax) ){
								 $("#2D_value").val($( "#slider_2D" ).slider( "value" ))
							}
							else
							{
								$("#slider_2D").slider( "value", $("#2D_value").val() );
								Set2DNoisereduce();
							}
					  }
					});
				};
				$( "#2D_value" ).change(function() {
					if (!CheackOnlyNum($("#2D_value").val()))
					{
						  $("#2D_value").val($( "#slider_2D" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#2D_value").val()) < parseInt(k_sz2dlevelmin) || parseInt($("#2D_value").val()) > parseInt(k_sz2dlevelmax) ){
						 $("#2D_value").val($( "#slider_2D" ).slider( "value" ))
					}
					else
					{
						$("#slider_2D").slider( "value", $("#2D_value").val() );
						Set2DNoisereduce();
					}
				});

			}); 
			//Slider2D();
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};
/*************************************************
Function:		Set2DNoisereduce
Description:	设置2D降嗓		
*************************************************/
function Set2DNoisereduce(){
	
	var level2d=$("#2D_value").val();
    var mode2d=$("#mode2d").val();
    if (mode2d=="close")
	{
		$("#noisereduce2D").hide();
	}
	else
	{
		$("#noisereduce2D").show();
	}
	var szXml = "<noisereduce2dinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<level>"+level2d+"</level>";
	szXml += "<mode>"+mode2d+"</mode>";
 	szXml += "</noisereduce2dinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/noisereduce2d"
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
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});
};
/*************************************************
Function:		Get3dlevel
Description:	降噪3D			
*************************************************/
function Get3dlevel(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/noisereduce3d"
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
			$("#3D_value").unbind("change");
		    $("#3D_value").unbind("keydown");   
			//3d降嗓模式
			$(xmlDoc).find("mode").each(function(i){ 
		  	 	var k_modexml= $(this).text();
				$("#mode3d").empty(); 
				 var k_qualityeopts = $(this).attr('opt').split(",");
				insertOptions2Select(k_qualityeopts, ["auto", "open", "close"], ["auto", "open", "close"], "mode3d");
				setValueDelayIE6("mode3d" ,"","",k_modexml);
				if (k_modexml=="close")
				{
					$("#noisereduce3D").hide();
				}
				else
				{
					$("#noisereduce3D").show();
				}
			});
			$(xmlDoc).find("level").each(function(i){ 
		  	 k_sz3dlevel= Number($(this).text());
			 k_sz3dlevelmin = Number($(this).attr('min'));
			 k_sz3dlevelmax = Number($(this).attr('max'));
			 $("#3D_value").val(k_sz3dlevel).attr('maxlength',$(this).attr('max').length);
			 $("#slider_3D").slider({
				  range: "min",
				  value: k_sz3dlevel,
				  min: k_sz3dlevelmin,
				  max: k_sz3dlevelmax,
				  slide: function( event, ui ) {
					$("#3D_value").val(ui.value);
				  },
				stop: function( event, ui ) {
					$("#3D_value").val($( "#slider_3D" ).slider( "value" ));
					Set3DNoisereduce('level');
				  }
			   });
				if($.browser.msie) {
					$('#3D_value').keydown(function(e){
					  if(e.keyCode==13)
					  {
						  if (!CheackOnlyNum($("#3D_value").val()))
							{
								  $("#3D_value").val($( "#slider_3D" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#3D_value").val()) < parseInt(k_sz3dlevelmin) || parseInt($("#3D_value").val()) > parseInt(k_sz3dlevelmax) ){
								 $("#3D_value").val($( "#slider_3D" ).slider( "value" ))
							}
							else
							{
								$("#slider_3D").slider( "value", $("#3D_value").val() );
								Set3DNoisereduce('level');
							}
					  }
					});
				};
				$( "#3D_value" ).change(function() {
					if (!CheackOnlyNum($("#3D_value").val()))
					{
						  $("#3D_value").val($( "#slider_3D" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#3D_value").val()) < parseInt(k_sz3dlevelmin) || parseInt($("#3D_value").val()) > parseInt(k_sz3dlevelmax) ){
						 $("#3D_value").val($( "#slider_3D" ).slider( "value" ))
					}
					else
					{
						$("#slider_3D").slider( "value", $("#3D_value").val() );
						Set3DNoisereduce('level');
					}
				});
			}); 
			//Slider3D();
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};

/*************************************************
Function:		Set3DNoisereduce
Description:	设置3D降嗓		
*************************************************/
function Set3DNoisereduce(obj){
   if ($("#mode3d").val()=="close")
	{
		$("#noisereduce3D").hide();
	}
	else
	{
		$("#noisereduce3D").show();
	}
	var szXml = "<noisereduce3dinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	if (obj=='select'){
		szXml += "<mode>"+$("#mode3d").val()+"</mode>";
	}
	else if(obj=='level')
	{
		szXml += "<level>"+$("#3D_value").val()+"</level>";
	}
	szXml += "</noisereduce3dinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/noisereduce3d"
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
						//Get3dlevel();
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});
};
/*************************************************
Function:		GetIris
Description:	光圈			
*************************************************/
function GetIris(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/iris"
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
		    $("#irissize_value,#irislevel_value").unbind("change");
			$("#irissize_value,#irislevel_value").unbind("keydown");
		   $(xmlDoc).find("irismode").each(function(i){ 
				 var g_irismode= $(this).text();
				$("#IrisType").empty(); 
				 var g_irismodes = $(this).attr('opt').split(",");
				insertOptions2Select(g_irismodes, ["auto", "manual"], ["auto", "manual"], "IrisType");
				setValueDelayIE6("IrisType" ,"","",g_irismode);
				if (g_irismode=="auto")
				{
					$("#sbuirissize").hide();
					$("#subirislevel").show();
				}
				else
				{
					$("#sbuirissize").show();
					$("#subirislevel").hide()
				}
			});
			
			$(xmlDoc).find("irissize").each(function(i){ 
		  	  g_szirissize = Number($(this).text());    //光圈大小
			  g_szirissizemin = Number($(this).attr('min'));
			  g_szirissizemax = Number($(this).attr('max'));
			  $("#irissize_value").val(g_szirissize).attr('maxlength',$(this).attr('max').length);
			  $("#slider_irissize").slider({
				  range: "min",
				  value: g_szirissize,
				  min: g_szirissizemin,
				  max: g_szirissizemax,
				  slide: function( event, ui ) {
					$("#irissize_value").val(ui.value);
				  },
				stop: function( event, ui ) {
					$("#irissize_value").val($( "#slider_irissize" ).slider( "value" ));
					SetIrisType();
				  }
				});
			   if($.browser.msie) {
					$('#irissize_value').keydown(function(e){
					  if(e.keyCode==13)
					  {
						  if (!CheackOnlyNum($("#irissize_value").val()))
							{
								  $("#irissize_value").val($( "#slider_irissize" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#irissize_value").val()) < parseInt(g_szirissizemin) || parseInt($("#irissize_value").val()) > parseInt(g_szirissizemax) ){
								 $("#irissize_value").val($( "#slider_irissize" ).slider( "value" ))
							}
							else
							{
								$("#slider_irissize").slider( "value", $("#irissize_value").val() );
								SetIrisType();
							}
					  }
					});
				};
				$( "#irissize_value" ).change(function() {
					if (!CheackOnlyNum($("#irissize_value").val()))
					{
						  $("#irissize_value").val($( "#slider_irissize" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#irissize_value").val()) < parseInt(g_szirissizemin) || parseInt($("#irissize_value").val()) > parseInt(g_szirissizemax) ){
						 $("#irissize_value").val($( "#slider_irissize" ).slider( "value" ))
					}
					else
					{
						$("#slider_irissize").slider( "value", $("#irissize_value").val() );
						SetIrisType();
					}
				});
							
			  
			});
			$(xmlDoc).find("irislevel").each(function(i){ 
		  	  g_szirislevel = Number($(this).text());  //光圈灵敏度
			  g_szirislevelmin = Number($(this).attr('min'));
			  g_szirislevelmax = Number($(this).attr('max'));
			  $("#irislevel_value").val(g_szirislevel).attr('maxlength',$(this).attr('max').length);
			  $("#slider_irislevel").slider({
				  range: "min",
				  value: g_szirislevel,
				  min: g_szirislevelmin,
				  max: g_szirislevelmax,
				  slide: function( event, ui ) {
					$("#irislevel_value").val(ui.value);
				  },
				stop: function( event, ui ) {
					$("#irislevel_value").val($( "#slider_irislevel" ).slider( "value" ));
					SetIrisType();
				  }
				});
			  if($.browser.msie) {
					$('#irislevel_value').keydown(function(e){
					  if(e.keyCode==13)
					  {
						  if (!CheackOnlyNum($("#irislevel_value").val()))
							{
								  $("#irislevel_value").val($( "#slider_irislevel" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#irislevel_value").val()) < parseInt(g_szirislevelmin) || parseInt($("#irislevel_value").val()) > parseInt(g_szirislevelmax) ){
								 $("#irislevel_value").val($( "#slider_irislevel" ).slider( "value" ))
							}
							else
							{
								$("#slider_irislevel").slider( "value", $("#irislevel_value").val() );
								SetIrisType();
							}
					  }
					});
				};
				$( "#irislevel_value" ).change(function() {
					if (!CheackOnlyNum($("#irislevel_value").val()))
					{
						  $("#irislevel_value").val($( "#slider_irislevel" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#irislevel_value").val()) < parseInt(g_szirislevelmin) || parseInt($("#irislevel_value").val()) > parseInt(g_szirislevelmax) ){
						 $("#irislevel_value").val($( "#slider_irislevel" ).slider( "value" ))
					}
					else
					{
						$("#slider_irislevel").slider( "value", $("#irislevel_value").val() );
						SetIrisType();
					}
				});
			  
			});
		  //Slideriris();
		 
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};
function ChangeIrisType(){
	if ($("#IrisType").val()=="auto"){
				$("#sbuirissize").hide();
				$("#subirislevel").show();
			}else{
				$("#sbuirissize").show();
				$("#subirislevel").hide()
			}
	    SetIrisType();
}
function SetIrisType(){
   var IrisType=$("#IrisType").val();
	var irissize=$("#irissize_value").val();
	var irislevel=$("#irislevel_value").val();
	var szXml = "<irisinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<irismode>"+IrisType+"</irismode>";
  	szXml += "<irissize>"+irissize+"</irissize>";
 	szXml += "<irislevel>"+irislevel+"</irislevel>";
 	szXml += "</irisinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/iris "
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
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});	
}

/*************************************************
Function:		GetShutter121
Description:	快门			
*************************************************/
function  GetShutter121(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/shutter"
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
			$(xmlDoc).find("shutermode").each(function(i){ 
				 var g_shutermode= $(this).text();
				$("#ShuterMode").empty(); 
				 var g_shutermodes = $(this).attr('opt').split(",");
				insertOptions2Select(g_shutermodes, ["auto", "manual"], ["auto", "manual"], "ShuterMode");
				setValueDelayIE6("ShuterMode" ,"","",g_shutermode);
				
				 if (g_shutermode=="auto")
				 {
				   $("#subshutermin").show();
				   $("#sublevel").hide();
				  }
				  else
				  {
					 $("#subshutermin").hide();
					 $("#sublevel").show(); 
				 }
			});

		   //快门下限
		   $(xmlDoc).find("shutermin").each(function(i){ 
			var g_szselectopt=$(this).attr('opt').replace(new RegExp(/(_)/g),'/');  //替换_
		    var g_szshutermin=$(this).text().replace(new RegExp(/(_)/g),'/');  //替换_
			  $("#Shutermin").empty();
			   var arr = g_szselectopt.split(","); 
				for (i=0;i<arr.length;i++){
				  $("#Shutermin").append("<option value="+arr[i]+">"+arr[i]+"</option>");
					var selectCode=document.getElementById("Shutermin"); 
					if(selectCode.options[i].value==g_szshutermin){  
						selectCode.options[i].selected=true;  
					 } 
				};
		   });
		   
		  
			//快门等级
			$(xmlDoc).find("shutterlevel").each(function(i){ 
			var g_szshutterlevelselectopt=$(this).attr('opt').replace(new RegExp(/(_)/g),'/');  //替换_
			var g_szshutterlevelxml=$(this).text().replace(new RegExp(/(_)/g),'/');  //替换_
				$("#Shutterlevel").empty();
			   var arr = g_szshutterlevelselectopt.split(","); 
				for (i=0;i<arr.length;i++){
				  $("#Shutterlevel").append("<option value="+arr[i]+">"+arr[i]+"</option>");
					var selectCode=document.getElementById("Shutterlevel"); 
					if(selectCode.options[i].value==g_szshutterlevelxml){  
						selectCode.options[i].selected=true;  
					 } 
				};
		   });
		   
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
}
function ChangeShuterMode(){
	if ($("#ShuterMode").val()=="auto"){
			   $("#subshutermin").show();
			  // $("#subshutermax").show();
			   $("#sublevel").hide();
			  }else{
				 $("#subshutermin").hide();
			     //$("#subshutermax").hide();
			     $("#sublevel").show(); 
	}
	SetShutter();
}
function Chageshutter(){
	SetShutter();
};
function SetShutter(){
   var ShuterMode=$("#ShuterMode").val();
	var Shutermin=$("#Shutermin").val();
	var newShutermin=Shutermin.replace("/","_");  
	//上限
	//var Shutermax =$("#Shuttershutermax").val();
	//var newShutermax=Shutermax.replace("/","_");  
	
	var Shutterlevel=$("#Shutterlevel").val();
	var newShutterlevel=Shutterlevel.replace("/","_"); 
	var szXml = "<shutterinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<shutermode>"+ShuterMode+"</shutermode>";
  	szXml += "<shutermin>"+newShutermin+"</shutermin>";
	//szXml += "<shutermax>"+newShutermax+"</shutermax>";
 	szXml += "<shutterlevel>"+newShutterlevel+"</shutterlevel>";
 	szXml += "</shutterinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/shutter "
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
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});	
}

/*************************************************
Function:		GetGain
Description:	增益			
*************************************************/
function GetGain(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/gain"
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
			$("#gainmax_value,#gainlevel_value").unbind("change");
			$("#gainmax_value,#gainlevel_value").unbind("keydown");
			$(xmlDoc).find("gainmode").each(function(i){ 
				var g_gainmode= $(this).text();
				$("#GainMode").empty(); 
				 var g_gainmodes = $(this).attr('opt').split(",");
				insertOptions2Select(g_gainmodes, ["auto", "manual"], ["auto", "manual"], "GainMode");
				setValueDelayIE6("GainMode" ,"","",g_gainmode);
				
				 if (g_gainmode=="auto")
				 {
					$("#GainSlider").hide()
					$("#subgainmax").show()
				 }
				 else if(g_gainmode=="manual")
				 {
					$("#GainSlider").show()
					$("#subgainmax").hide()
				  }
			});
			
			$(xmlDoc).find("gainmax").each(function(i){ 
				 g_szgainmax= Number($(this).text());
				 g_szgainmaxmin= Number($(this).attr('min'));
				 g_szgainmaxmax= Number($(this).attr('max'));
				 $("#gainmax_value").val(g_szgainmax).attr('maxlength',$(this).attr('max').length);
				 $("#slider_gainmax" ).slider({
				  range: "min",
				  value: g_szgainmax,
				  min: g_szgainmaxmin,
				  max: g_szgainmaxmax,
				  slide: function( event, ui ) {
					$("#gainmax_value").val(ui.value);
				  },
				stop: function( event, ui ) {
					$("#gainmax_value").val($( "#slider_gainmax" ).slider( "value" ));
					SetGainMax();
				  }
			   });
					if($.browser.msie) {
						$('#gainmax_value').keydown(function(e){
						  if(e.keyCode==13)
						  {
							  if (!CheackOnlyNum($("#gainmax_value").val()))
								{
									  $("#gainmax_value").val($( "#slider_gainmax" ).slider( "value" ))
									  return;
								}
								if (parseInt($("#gainmax_value").val()) < parseInt(g_szgainmaxmin) || parseInt($("#gainmax_value").val()) > parseInt(g_szgainmaxmax) ){
									 $("#gainmax_value").val($( "#slider_gainmax" ).slider( "value" ))
								}
								else
								{
									$("#slider_gainmax").slider( "value", $("#gainmax_value").val() );
									SetGainMax();
								}
						  }
						});
				   };
					$( "#gainmax_value" ).change(function() {
						if (!CheackOnlyNum($("#gainmax_value").val()))
						{
							  $("#gainmax_value").val($( "#slider_gainmax" ).slider( "value" ))
							  return;
						}
						if (parseInt($("#gainmax_value").val()) < parseInt(g_szgainmaxmin) || parseInt($("#gainmax_value").val()) > parseInt(g_szgainmaxmax) ){
							 $("#gainmax_value").val($( "#slider_gainmax" ).slider( "value" ))
						}
						else
						{
							$("#slider_gainmax").slider( "value", $("#gainmax_value").val() );
							SetGainMax();
						}
					});
				
				 
			});
			//增益等级
			$(xmlDoc).find("gainlevel").each(function(i){ 
		  	 g_szgainlevel= Number($(this).text());
			 g_szgainlevelmin= Number($(this).attr('min'));
			 g_szgainlevelmax= Number($(this).attr('max'));
			  $("#gainlevel_value").val(g_szgainlevel).attr('maxlength',$(this).attr('max').length);
			  $( "#slider_gainlevel" ).slider({
				  range: "min",
				  value: g_szgainlevel,
				  min: g_szgainlevelmin,
				  max: g_szgainlevelmax,
				  slide: function( event, ui ) {
					$("#gainlevel_value").val(ui.value);
				  },
				stop: function( event, ui ) {
					$("#gainlevel_value").val($( "#slider_gainlevel" ).slider( "value" ));
					SetGainLevel();
				  }
			   });
			   if($.browser.msie) {
						$('#gainlevel_value').keydown(function(e){
						  if(e.keyCode==13)
						  {
							  if (!CheackOnlyNum($("#gainlevel_value").val()))
								{
									  $("#gainlevel_value").val($( "#slider_gainlevel" ).slider( "value" ))
									  return;
								}
								if (parseInt($("#gainlevel_value").val()) < parseInt(g_szgainlevelmin) || parseInt($("#gainlevel_value").val()) > parseInt(g_szgainlevelmax) ){
									 $("#gainlevel_value").val($( "#slider_gainlevel" ).slider( "value" ))
								}
								else
								{
									$("#slider_gainlevel").slider( "value", $("#gainlevel_value").val() );
									SetGainLevel();
								}
						  }
						});
				   };
					$( "#gainlevel_value" ).change(function() {
						if (!CheackOnlyNum($("#gainlevel_value").val()))
						{
							  $("#gainlevel_value").val($( "#slider_gainlevel" ).slider( "value" ))
							  return;
						}
						if (parseInt($("#gainlevel_value").val()) < parseInt(g_szgainlevelmin) || parseInt($("#gainlevel_value").val()) > parseInt(g_szgainlevelmax) ){
							 $("#gainlevel_value").val($( "#slider_gainlevel" ).slider( "value" ))
						}
						else
						{
							$("#slider_gainlevel").slider( "value", $("#gainlevel_value").val() );
							SetGainLevel();
						}
					});
			}); 
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};
//增益模式
function ChangeGainMode(){
	if ($("#GainMode").val()=="auto"){
		$("#GainSlider").hide()
		$("#subgainmax").show()
	}else if($("#GainMode").val()=="manual"){
		$("#GainSlider").show()
		$("#subgainmax").hide()
		}
   var GainMode=$("#GainMode").val();
  	var szXml = "<gaininfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<gainmode>"+GainMode+"</gainmode>";
 	szXml += "</gaininfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/gain"
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
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});	
}
//增益上限
function SetGainMax(){
    var gainmax=$("#gainmax_value").val();  //增益上限
	var szXml = "<gaininfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
 	
	szXml += "<gainmax>"+gainmax+"</gainmax>";
 	szXml += "</gaininfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/gain"
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
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});	
};
//增益等级
function SetGainLevel(){
    var gainlevel=$("#gainlevel_value").val();  //增益上限
	var szXml = "<gaininfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
   
    szXml += "<gainlevel>"+gainlevel+"</gainlevel>";
 	szXml += "</gaininfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/gain"
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
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});	
};
/**设置增益**/
function SetGain(){
    var GainMode=$("#GainMode").val();
    var gainmax=$("#SelectGainMax").val();  //增益上限
	var gainlevel=$("#zy_value").text();
	var szXml = "<gaininfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<gainmode>"+GainMode+"</gainmode>";
 	szXml += "<gainmax>"+gainmax+"</gainmax>";
	szXml += "<gainlevel>"+gainlevel+"</gainlevel>";
 	szXml += "</gaininfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/gain"
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
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});	
}

/*************************************************
Function:		GetCorridormode
Description:	走廊模式			
*************************************************/
function GetCorridormode(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/corridormode"
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
		  $(xmlDoc).find("corridormode").each(function(i){ 
		     	var k_corridormodeopt1=$(this).attr('opt');
		  	 	var k_corridormodexml= $(this).text();
				$("#corridormode").empty(); 
				 var k_corridormodeopts = k_corridormodeopt1.split(",");
				insertOptions2Select(k_corridormodeopts, ["close", "left", "right"], ["close", "jsleft", "jsright"], "corridormode");
				setValueDelayIE6("corridormode" ,"","",k_corridormodexml);
			}); 

		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};
/*************************************************
Function:		Setcorridormode
Description:	设置走廊模式			
*************************************************/
function Setcorridormode(){
	var szXml = "<corridormodeinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<corridormode>"+$("#corridormode").val()+"</corridormode>";
 	szXml += "</corridormodeinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/corridormode"
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
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});
};

/*************************************************
Function:		Getimagemode
Description:	镜像模式			
*************************************************/
function Getimagemode(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/imagemode"
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
				$("#imagemode").empty(); 
				 var k_modeopts = $(this).attr('opt').split(",");
				insertOptions2Select(k_modeopts, ["close", "horizont", "vertical","central"], ["close", "leftright", "updown", "center"], "imagemode");
				setValueDelayIE6("imagemode" ,"","",$(this).text());
			}); 

		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};
/*************************************************
Function:		Setimagemode
Description:	设置镜像模式			
*************************************************/
function Setimagemode(){
	var szXml = "<imagemodeinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<mode>"+$("#imagemode").val()+"</mode>";
 	szXml += "</imagemodeinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/imagemode"
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
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});
};
/*************************************************
Function:		Getlocalecho
Description:	本地回显			
*************************************************/
function Getlocalecho(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/localecho"
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
			$(xmlDoc).find("enable").each(function(i){ 
			     	//var k_modeopt1=$(this).attr('opt');
		  	 	//var k_modexml= $(this).text();
				$("#cvbsmode").empty(); 
				 var k_enableopts = $(this).attr('opt').split(",");
				insertOptions2Select(k_enableopts, ["close", "PAL", "NTSC","interleave","line" ], ["close","jspal","jsntsc","jsinterleave","jsline"], "cvbsmode");
				setValueDelayIE6("cvbsmode" ,"","",$(this).text());
			}); 

		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});
};

/*************************************************
Function:		Setlocalecho
Description:	设置本地回显			
*************************************************/
function Setlocalecho(){
	var szXml = "<localechoinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<enable>"+$("#localecho").val()+"</enable>";
 	szXml += "</localechoinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/localecho"
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
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});	
};

/*************************************************
Function:		GetPowerlinefrequency
Description:	防闪烁			
*************************************************/
function GetPowerlinefrequency(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/powerlinefrequency"
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
				$("#AntiFlickerMode").empty(); 
				 var k_modeopts = $(this).attr('opt').split(",");
				insertOptions2Select(k_modeopts, ["50hz", "60hz", "auto"], ["js50hz", "js60hz", "jsAntiFlickerModeauto"], "AntiFlickerMode");
				setValueDelayIE6("AntiFlickerMode" ,"","",$(this).text());
			});              
                   
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};
/****设置防闪烁*******/
function AntiFlickerMode(){
	var mode=$("#AntiFlickerMode").val();
	var szXml = "<powerlinefrequencyinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<mode>"+mode+"</mode>";
 	szXml += "</powerlinefrequencyinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/powerlinefrequency"
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
						GetIris();
						GetShutter121(); 
						GetGain();
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});	
}

/***降嗓选择关联**/
function ChanegNoisereduce(){
	if($("#Noisereduce").val()==0){
		$("#Level").hide()
		$("#TimeLevel").hide()
		$("#TimeLevel2").hide()
	}
	else if ($("#Noisereduce").val()==1){
		$("#Level").show()
		$("#TimeLevel").hide()
		$("#TimeLevel2").hide()
	}else if($("#Noisereduce").val()==2){
		$("#Level").hide()
		$("#TimeLevel").show()
		$("#TimeLevel2").show()
	}
}
//加载场景
function loadscn(){
	//console.log("00")
};


/*恢复默认*/
function colordef(){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;
		$("#SetResultImagsSettingsTips").html(szRetInfo);
		setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		return;
	}
	
	if (confirm(m_szAsk1)){	
	//document.getElementById("plugin0").eventWebToPlugin("image","out");
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	   //var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/imge/1/color/def"
	   var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/def/all"
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
						
						szRetInfo = m_szSuccessState+getNodeValue('MRestoredesuccess');
						$("#SetResultImagsSettingsTips").html(szRetInfo);
						setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
						 initImagegGetCap("brightness=true&contrast=true&saturation=true&hue=true&focus=true&whitebalance=true&dynamicmode=true&imageenhance=true&Iris=true&shutter=true&powerlinefrequency=true&corridormode=true&localecho=true&noisereduce2d=true&noisereduce3d=true&gain=true&ircutfilter=true&imagemode=true&wdr=true&fogthrough=true&gamma=true&laser=true&infrared=true");
   						 GetImages();    //图像信息
					}
				});
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
   }
}
//设置本地回显
function ChangeCvbsmode(){
	var szXml = "<localechoinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enable>"+$("#cvbsmode").val()+"</enable>";
 	szXml += "</localechoinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/localecho"
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
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		
	});	
};

//开始绘制
function StartImages(obj){
	if ($(obj).val()==getNodeValue('Mstartdraw')){
		$(obj).attr("name","Mstopdraw").val(getNodeValue('Mstopdraw'));
		document.getElementById("plugin0").eventWebToPlugin("image","start");   //开始绘制
		$("#Clearmages").prop("disabled",false)
		$("#SafeImages").prop("disabled",false)
	}else
	{
	    $(obj).attr("name","Mstartdraw").val(getNodeValue('Mstartdraw'));
		document.getElementById("plugin0").eventWebToPlugin("image","stop");    //停止绘制
		$("#Clearmages").prop("disabled",false)
		$("#SafeImages").prop("disabled",false)
		
	}
};

//清空全部
function Clearmages(){
	document.getElementById("plugin0").eventWebToPlugin("image","clear");
};
//设置
function SafeImages(){
	var ret=document.getElementById("plugin0").eventWebToPlugin("image","save");
	var mode=$("#backlightmode").val();  //动态调节类型
	var wdrlevel=$("#wdr_value").val();
	var hlclevel=$("#hlc_value").val();
	var blclevel=$("#autoblc_value").val();
	var sel=$("#blcmode").val();
		if (sel!="custom"){
			return
		}
		var szXml = "<dynamicmodeInfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<mode>"+mode+"</mode>";
		szXml += "<wdrlevel>"+wdrlevel+"</wdrlevel>";
		szXml += "<hlclevel>"+hlclevel+"</hlclevel>";
		szXml += "<blclevel>"+blclevel+"</blclevel>";
		szXml += "<hlcarea>"
		  szXml += "<sel>"+sel+"</sel>";
		  szXml += ret;
		szXml += "</hlcarea>"
		szXml += "</dynamicmodeInfo>";
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/dynamicmode"
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
						$("#StartImages").attr("name","Mstartdraw").val(getNodeValue('Mstartdraw'))
						$("#SafeImages").prop("disabled",true)
						$("#Clearmages").prop("disabled",true)
						szRetInfo = m_szSuccessState+m_szSuccess1;
						
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});
};


//防闪烁居中弹出消息
function help_tips(){
	$("#mainplugin").width(0).height(1);
	$("#SaveConfigBtn").hide();
	$("#divHelpTipsTable").modal(
		{
			"close":false,
			"autoResize":true,
			"position":[150]  
		 }
	   );
	$("#simplemodal-container").height("auto");
};
function help_tipsclose(){
	$.modal.impl.close();
	$("#mainplugin").width(352).height(254);
	$("#SaveConfigBtn").show();
};
//获取红外
function getinfrared(){
  var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	   var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/infrared"
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
			$(xmlDoc).find("contrlmode").each(function(i){
				$("#infraredmode").empty(); 
				insertOptions2Select($(this).attr('opt').split(","), ["close","auto","farlamp","middlelamp","nearlamp","exnearlamp"], ["close","jsauto","jsfarlamp","jsmiddlelamp","jsnearlamp","jsexnearlamp"], "infraredmode");
				setValueDelayIE6("infraredmode" ,"","",$(this).text());
			}); 
			$(xmlDoc).find("level").each(function(i){ 
				var g_szenable = $(this).attr('enable');
				if (g_szenable=="false")
				{
					$("#subinfraredlevel").hide();
				}
				else
				{
					$("#subinfraredlevel").show();
					var g_szinfraredlevel= Number($(this).text());
					var g_szinfraredmin = Number($(this).attr('min'));
					var g_szinfraredmax = Number($(this).attr('max'));
					 $("#infrared_value").val(g_szinfraredlevel).attr('maxlength',$(this).attr('max').length);
					 $("#slider_infrared").slider({
						  range: "min",
						  value: g_szinfraredlevel,
						  min: g_szinfraredmin,
						  max: g_szinfraredmax,
						  slide: function( event, ui ) {
							$("#infrared_value").val(ui.value);
						  },
						stop: function( event, ui ) {
							$("#infrared_value").val($( "#slider_infrared" ).slider( "value" ));
							SetInfraredLaser('infrared','level');
						  }
						});
					   if($.browser.msie) {
							$('#infrared_value').keydown(function(e){
							  if(e.keyCode==13)
							  {
								  if (!CheackOnlyNum($("#infrared_value").val()))
									{
										  $("#infrared_value").val($( "#slider_infrared" ).slider( "value" ))
										  return;
									}
									if (parseInt($("#infrared_value").val()) < parseInt(g_szinfraredmin) || parseInt($("#infrared_value").val()) > parseInt(g_szinfraredmax) ){
										 $("#infrared_value").val($( "#slider_infrared" ).slider( "value" ))
									}
									else
									{
										$("#slider_infrared").slider( "value", $("#infrared_value").val() );
										SetInfraredLaser('infrared','level');
									}
							  }
							});
						};
						$( "#infrared_value" ).change(function() {
							if (!CheackOnlyNum($("#infrared_value").val()))
							{
								  $("#infrared_value").val($( "#slider_infrared" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#infrared_value").val()) < parseInt(g_szinfraredmin) || parseInt($("#infrared_value").val()) > parseInt(g_szinfraredmax) ){
								 $("#infrared_value").val($( "#slider_infrared" ).slider( "value" ))
							}
							else
							{
								$("#slider_infrared").slider( "value", $("#infrared_value").val() );
								SetInfraredLaser('infrared','level');
							}
						});
				}

			}); 
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};
//获取激光
function getlaser(){
  var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/laser"
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
			$(xmlDoc).find("controlmode").each(function(i){ 
				$("#lasermode").empty(); 
				insertOptions2Select($(this).attr('opt').split(","), ["auto","open", "close"], ["auto","open", "close"], "lasermode");
				setValueDelayIE6("lasermode" ,"","",$(this).text());
			}); 
			$(xmlDoc).find("spotmode").each(function(i){ 
				$("#contrlmode").empty(); 
				insertOptions2Select($(this).attr('opt').split(","), ["def","littlefacula","bigfaxula","custom1","custom2"], ["jsdef","jslittlefacula","jsbigfaxula","jscustom1","jscustom2"], "contrlmode");
				setValueDelayIE6("contrlmode" ,"","",$(this).text());
			}); 
			$(xmlDoc).find("level").each(function(i){ 
		  	var g_szlaserlevel= Number($(this).text());
			var g_szlasermin = Number($(this).attr('min'));
			var g_szlasermax = Number($(this).attr('max'));
			 $("#laser_value").val(g_szlaserlevel).attr('maxlength',$(this).attr('max').length);
			 $("#slider_laser").slider({
				  range: "min",
				  value: g_szlaserlevel,
				  min: g_szlasermin,
				  max: g_szlasermax,
				  slide: function( event, ui ) {
					$("#laser_value").val(ui.value);
				  },
				stop: function( event, ui ) {
					$("#laser_value").val($( "#slider_laser" ).slider( "value" ));
					SetInfraredLaser('laser','level');
				  }
				});
			   if($.browser.msie) {
					$('#laser_value').keydown(function(e){
					  if(e.keyCode==13)
					  {
						  if (!CheackOnlyNum($("#laser_value").val()))
							{
								  $("#laser_value").val($( "#slider_laser" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#laser_value").val()) < parseInt(g_szlasermin) || parseInt($("#laser_value").val()) > parseInt(g_szlasermax) ){
								 $("#laser_value").val($( "#slider_laser" ).slider( "value" ))
							}
							else
							{
								$("#slider_laser").slider( "value", $("#laser_value").val() );
								SetInfraredLaser('laser','level');
							}
					  }
					});
				};
				$( "#laser_value" ).change(function() {
					if (!CheackOnlyNum($("#laser_value").val()))
					{
						  $("#laser_value").val($( "#slider_laser" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#laser_value").val()) < parseInt(g_szlasermin) || parseInt($("#laser_value").val()) > parseInt(g_szlasermax) ){
						 $("#laser_value").val($( "#slider_laser" ).slider( "value" ))
					}
					else
					{
						$("#slider_laser").slider( "value", $("#laser_value").val() );
						SetInfraredLaser('laser','level');
					}
				});

			}); 
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
	});
};
function SetInfraredLaser(type,obj){
  	if (type=="infrared")
	{
		var szXml = "<infraredinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		if (obj=="level")
		{
			szXml += "<level>"+$("#infrared_value").val()+"</level>";
		}
		else if(obj=="contrlmode")
		{
			szXml += "<contrlmode>"+$("#infraredmode").val()+"</contrlmode>";
		}
		szXml += "</infraredinfo>";
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/infrared"
	}
	else if(type=="laser")
	{
		var szXml = "<laserinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		if (obj=="level")
		{
			szXml += "<level>"+$("#laser_value").val()+"</level>";
		}
		else if(obj=="lasermode")
		{
			szXml += "<controlmode>"+$("#lasermode").val()+"</controlmode>";
		}
		else if(obj=="contrlmode")
		{
			szXml += "<spotmode>"+$("#contrlmode").val()+"</spotmode>";
		}
		szXml += "</laserinfo>";
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/laser"
	}
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
			 
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});
};


/*************************************************
Function:		GetAntishake
Description:	获取防抖
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetAntishake(){
   var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/antishake"
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
			if($(xmlDoc).find("mode").length > 0)
			{
				$(xmlDoc).find("mode").each(function(i){ 
					 $("#ModeAntishake").empty(); 
					 insertOptions2Select($(this).attr('opt').split(","), ["auto","open", "close"], ["auto","open", "close"], "ModeAntishake");
					 setValueDelayIE6("ModeAntishake" ,"","",$(this).text());
					 if ($(this).text()=="close"){
						 $('#SubAntishakeLevel').hide();
					 }
					 else
					 {
						 $('#SubAntishakeLevel').show();
					 }
				});
			};
			
			/***level str**/
			if($(xmlDoc).find("level").length > 0)
			{
				$(xmlDoc).find("level").each(function(i){ 
					var g_szantishakelevel= Number($(this).text());
					var g_szantishakemin = Number($(this).attr('min'));
					var g_szantishakemax = Number($(this).attr('max'));
					$("#antishake_value").val(g_szantishakelevel).attr('maxlength',$(this).attr('max').length);
					$("#slider_antishake").slider({
						  range: "min",
						  value: g_szantishakelevel,
						  min: g_szantishakemin,
						  max: g_szantishakemax,
						  slide: function( event, ui ) {
							$("#antishake_value").val(ui.value);
						  },
						stop: function( event, ui ) {
							$("#antishake_value").val($( "#slider_antishake" ).slider( "value" ));
							SetAntishake('level');
						  }
						});
				   if($.browser.msie) {
						$('#antishake_value').keydown(function(e){
						  if(e.keyCode==13)
						  {
							  if (!CheackOnlyNum($("#antishake_value").val()))
								{
									  $("#antishake_value").val($( "#slider_antishake" ).slider( "value" ))
									  return;
								}
								if (parseInt($("#antishake_value").val()) < parseInt(g_szantishakemin) || parseInt($("#antishake_value").val()) > parseInt(g_szantishakemax) ){
									 $("#antishake_value").val($( "#slider_antishake" ).slider( "value" ))
								}
								else
								{
									$("#slider_antishake").slider( "value", $("#antishake_value").val() );
									SetAntishake('level');
								}
						  }
						});
					};
					$( "#antishake_value" ).change(function() {
						if (!CheackOnlyNum($("#antishake_value").val()))
						{
							  $("#antishake_value").val($( "#slider_antishake" ).slider( "value" ))
							  return;
						}
						if (parseInt($("#antishake_value").val()) < parseInt(g_szantishakemin) || parseInt($("#antishake_value").val()) > parseInt(g_szantishakemax) ){
							 $("#antishake_value").val($( "#slider_antishake" ).slider( "value" ))
						}
						else
						{
							$("#slider_antishake").slider( "value", $("#antishake_value").val() );
							SetAntishake('level');
						}
					});
	
				}); 
			};
			/****lever end****/
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj,"SaveImages");
		}
	});
};


/*************************************************
Function:		SetAntishake
Description:	设置防抖
Input:			无			
Output:			无
return:			无				
*************************************************/
function SetAntishake(obj,type){
  	if (type=='show')
	{
		if ($('#ModeAntishake').val()=='close'){
			$('#SubAntishakeLevel').hide();
		}
		else
		{
			$('#SubAntishakeLevel').show();
		}
	}
	var szXml = "<antishakedinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	if (obj=="mode")
	{
		szXml += "<mode>"+$("#ModeAntishake").val()+"</mode>";
	}
	else if(obj=="level")
	{
		szXml += "<level>"+$("#antishake_value").val()+"</level>";
	}
	szXml += "</antishakedinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/image/1/antishake"
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
			$("#SetResultImagsSettingsTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveImages");
			}
		});
};

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
						$("<li id='"+g_name+"' title='"+TurnScnText(g_name)+"'  onclick='scnload(this,"+'"def"'+","+i+")'>"+"<label name='M"+g_name+"' style='cursor:pointer;'>"+TurnScnText(g_name)+"</label>"+"</option>").appendTo("#ulmode");
					}
					$("<li onclick='addscn(this)'>"+"<label name='Mscnsave' style='cursor:pointer;'>"+getNodeValue('Mscnsave')+"</label>"+"</option>").appendTo("#ulmode");
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
						$("<li id='"+g_nametitle+"' title='"+g_nametitle+"'>"+"<i class='delicon' onclick='delscn("+i+")'></i>"+"<span style='display:block;' onclick='scnload(this,"+'"custom"'+","+i+")'>"+g_name+"</span>"+"</option>").appendTo("#ulmode");
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
						szRetInfo = m_szSuccessState+m_szSuccess1;
					    initImagegGetCap("brightness=true&contrast=true&saturation=true&hue=true&focus=true&whitebalance=true&dynamicmode=true&imageenhance=true&Iris=true&shutter=true&powerlinefrequency=true&corridormode=true&localecho=true&noisereduce2d=true&noisereduce3d=true&gain=true&ircutfilter=true&imagemode=true&wdr=true&fogthrough=true&gamma=true&laser=true&infrared=true&antishake=true");
						GetImages();    //图像信息
  						Getscnlist();   //初始化场景列表 
						$('#ulmode').hide();
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
};
function scnshow(){
	$("#ulmode").show();
}
//弹出参数另存窗口
function addscn(){
	$("#mainplugin").width(1).height(1)
	$("#ScnResultTips").html('');
	if (g_custommodesize >= g_listmax){
		$("#mainplugin").height(254).width(352);
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
						szRetInfo = m_szSuccessState+m_szSuccess1;
						$.modal.impl.close();
						$('#ulmode').hide();
						$("#mainplugin").height(254).width(352);
						Getscnlist();
					}else{
						szRetInfo=  m_szErrorState+m_szError1;
					}
				});
			$("#ScnResultTips").html(szRetInfo);
			setTimeout(function(){$("#ScnResultTips").html("");},5000);  //5秒后自动清除
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
	$("#mainplugin").height(254).width(352);
}