var g_szVideoInfoXml = "";
var m_RefreshVideoXml="";
var g_modetext=false,g_aactext=false;
//var g_xmpCap;
var video = {
	tabs: null   // 保存音视频配置页面的tabs对象引用
};

function Video() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Video);
pr(Video).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["video", "Video"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initVideoGetCap("powerlinefrequency=true");
	initVideoSetting();
	//setTimeout(function() {initVideoSetting() },  10);//防止获取视频能力集及xml未完全获取
	autoResizeIframe();
}

/*************************************************
Function:		initVideoSetting
Description:	初始化视频配置页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initVideoSetting()
{
	//GetMultivideo();//  获取多码流  
	//setTimeout(function() {GetMultivideo() },  10);//获取多码流,防止获取视频能力集未完全获取
	GetMultivideo();
	//Getflicker(); 
	//GetStreamTypeIn();
	
}
function initVideoGetCap(obj){
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
			//防闪烁
			if($(xmlDoc).find("powerlinefrequency").length > 0){
				$(xmlDoc).find("powerlinefrequency").each(function(i){ 
				  if($(this).text()!="true")
					{
						$("#flickertips").hide();
					}else{
						$("#flickertips").show();
					}
				});
			}
		}
	});
}

//获取多码流
function GetMultivideo(){
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
			$(xmlDoc).find("multivideo").each(function(i,data) {
				 k_videoopt=$(this).attr("opt")
				 m_MultiVideo= $(this).text();
				 $("#multivideoType").empty();
				var arr = k_videoopt.split(","); 
				for (i=0;i<arr.length;i++){
					   $("#multivideoType").append("<option id='"+'VideoTypeOpt'+(i + 1)+"' name='"+'VideoTypeOpt'+(i + 1)+"'  value="+arr[i]+">"+getNodeValue('VideoTypeOpt'+(i + 1))+"</option>");
							var selectCode=document.getElementById("multivideoType"); 
							if(selectCode.options[i].value==m_MultiVideo){  
								selectCode.options[i].selected=true;  
							 } 
				};
				if (m_MultiVideo==1){
					$("#StreamTypeIn").empty();
					$("<option id='"+'StreamTypeInOpt1'+"' name='"+'StreamTypeInOpt1'+"' value='1'>"+getNodeValue('StreamTypeInOpt1')+"</option>").appendTo("#StreamTypeIn");
				}
				else if(m_MultiVideo==2){
					$("#StreamTypeIn").empty();
					for (i=0; i < m_MultiVideo; i++){
						$("<option id='"+'StreamTypeInOpt'+(i + 1)+"' name='"+'StreamTypeInOpt'+(i + 1)+"' value='"+(i + 1)+"'>"+getNodeValue('StreamTypeInOpt'+(i + 1))+"</option>").appendTo("#StreamTypeIn");
					}
				}
				else if(m_MultiVideo==3){
					$("#StreamTypeIn").empty();
					//$("#StreamTypeIn option[value='2']").remove(); 
					for (i=0; i < m_MultiVideo; i++){
						$("<option id='"+'StreamTypeInOpt'+(i + 1)+"' name='"+'StreamTypeInOpt'+(i + 1)+"' value='"+(i + 1)+"'>"+getNodeValue('StreamTypeInOpt'+(i + 1))+"</option>").appendTo("#StreamTypeIn");
					}
				}
				else if(m_MultiVideo==4){
					$("#StreamTypeIn").empty();
					//$("#StreamTypeIn option[value='2']").remove(); 
					for (i=0; i < m_MultiVideo; i++){
						$("<option id='"+'StreamTypeInOpt'+(i + 1)+"' name='"+'StreamTypeInOpt'+(i + 1)+"' value='"+(i + 1)+"'>"+getNodeValue('StreamTypeInOpt'+(i + 1))+"</option>").appendTo("#StreamTypeIn");
					}
					
					
				}
				GetStreamTypeIn();//获取视频信息
				
			});
			
		  
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//获取视频信息
function GetStreamTypeIn(){
	 enctype=$("#StreamTypeIn").val();
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/enc/"+enctype
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
			m_RefreshVideoXml=xmlDoc;
		    RefreshVideoFilterXML()
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		
	});
	autoResizeIframe();
};
//解析视频编码XML
function RefreshVideoFilterXML(){
	 var g_multivideoType=$("#multivideoType").val();  //多码流
	 var g_StreamTypeIn=$("#StreamTypeIn").val();  //码流类型
	
	//分辨率
	var  g_resolution = $(m_RefreshVideoXml).find("resolution").eq(0).text().replace(new RegExp(/(_)/g),'*');
	//编码格式
	$(m_RefreshVideoXml).find("videocodetype").each(function(i){
		var g_videocodetypeopt = $(this).attr('opt').split(",");
		 g_videocodetypetext = $(this).text();
		$("#videoCodecType").empty();
		for (i=0;i<g_videocodetypeopt.length;i++){
		 $("#videoCodecType").append( "<option value="+g_videocodetypeopt[i]+">"+g_videocodetypeopt[i]+"</option>")
		 $("#videoCodecType").val(g_videocodetypetext)	
		};
		if (g_videocodetypetext=="MJPEG")
		{
			$("#constantBitRate").prop("disabled",true)  // 禁用
		}
		else 
		{
			$("#constantBitRate").prop("disabled",false)  // 启用
	    }
	});
	//视频编码结束
	
	//码率类型
	$(m_RefreshVideoXml).find("dataratetype").each(function(i){
	   var g_encordercomplexitycapopt = $(this).attr('opt').split(",");
		var g_encordercomplexitycaptext = $(this).text();
		$("#videoQualityControlType").empty(); 
		insertOptions2Select(g_encordercomplexitycapopt, ["fix","var"], ["optfix","optvar"], "videoQualityControlType");
		setValueDelayIE6("videoQualityControlType" ,"","",g_encordercomplexitycaptext);
	});
	//码率类型结束
	
	//图像质量
	$(m_RefreshVideoXml).find("quality").each(function(i){
	   var g_qualityopt = $(this).attr('opt').split(",");
		var g_qualitytext = $(this).text();
		$("#fixedQuality").empty(); 
		insertOptions2Select(g_qualityopt, ["lowest", "lower", "low", "middle", "hight", "highest"], ["maqualitylowest", "maqualitylower", "maqualitylow", "maqualitymiddle","maqualityhight","maqualityhighest"], "fixedQuality");
		setValueDelayIE6("fixedQuality" ,"","",g_qualitytext);
	});
	//图像质量结束
	//码率上限
	$(m_RefreshVideoXml).find("maxdatarate").each(function(i){
		maxdataratevaluemin = $(this).attr('min');
		maxdataratevaluemax = $(this).attr('max');
		var g_g_maxdataratetext = $(this).text();
		$("#constantBitRate").val(g_g_maxdataratetext).attr('maxlength' , maxdataratevaluemax.length); 
		$("#fixedconstantBitRateTips").html(maxdataratevaluemin+"~"+maxdataratevaluemax)
	});
	//视频帧率结束
	
	//视频帧率
	 $(m_RefreshVideoXml).find("framerate").each(function(i,data) {
		g_framerate= $(this).text();
	});
	
	//编码复杂度
	$(m_RefreshVideoXml).find("encordercomplexity").each(function(i,data) {
	    g_encordercomplexitytext = $(this).text();
	});
	//I帧间隔
	$(m_RefreshVideoXml).find("iframespeed").each(function(i,data) {
		iframespeedvaluemin = $(this).attr('min');
		iframespeedvaluemax = $(this).attr('max');
		var g_iframespeedtext = $(this).text();
		$("#IntervalFrameI").val(g_iframespeedtext).attr('maxlength' , iframespeedvaluemax.length); 
		$("#fixedIntervalFrameITips").html(iframespeedvaluemin+"~"+iframespeedvaluemax)
	});
	//多码流
	$(m_RefreshVideoXml).find("caplist").each(function(i){
		var m_changecap=$(this).find('cap').length;
		var m_changehtml=$(this).find('cap');
		for (var j = 0; j < m_changecap; j++){
			   
			   var g_steamtype=$(this).find('cap').eq(j).attr('steamtype');   //多码流
			   var g_streamid=$(this).find('cap').eq(j).attr('streamid');   //码率类型
			    if (g_steamtype==g_multivideoType && g_streamid==g_StreamTypeIn )
			   {
				   /*
				    编码复杂度根据编码格式显示其下拉列表
				   */
				 //  console.log($(m_changehtml).eq(j).html())
				   var m_enccomplexitycap=$(this).find('cap').find("enccomplexitylist").find('enccomplexitycap').length / m_changecap;
				   for (var m = 0; m < m_enccomplexitycap; m++)
				   {
					   var m_enccomplexityarrt=$(this).find('cap').find("enccomplexitylist").find('enccomplexitycap').eq(j * m_enccomplexitycap + m).attr('codetype');  // h.264，mjpeg
					  // console.log(m_enccomplexityarrt+"   "+g_videocodetypetext)
					   if (m_enccomplexityarrt==g_videocodetypetext)
					   {
						   var m_enccomplexitytexts=$(this).find('cap').find("enccomplexitylist").find('enccomplexitycap').eq(j * m_enccomplexitycap + m).text().split(",");
						   $("#selectCodecComplexity").empty();
						   insertOptions2Select(m_enccomplexitytexts, ["low", "middle", "high"], ["optlow", "optmiddle", "opthigh"], "selectCodecComplexity");
						   setValueDelayIE6("selectCodecComplexity" ,"","",g_encordercomplexitytext);
						   break;
					   }
					  
				   }//编码复杂度根据编码格式显示其下拉列表结束
				   
				   /**
				   分辨率下拉列表
				   **/
				    var g_resolutioncapopt=$(this).find('cap').find('resolutioncap').eq(j).attr('opt').replace(new RegExp(/(_)/g),'*');
					$("#videoResolution").empty();
					var arrresolution = g_resolutioncapopt.split(","); 
					for (var i=0;i<arrresolution.length;i++){
						$("#videoResolution").append( "<option value="+arrresolution[i]+">"+arrresolution[i]+"</option>")
						$("#videoResolution").val(g_resolution);
					};
					
					
					/***
					视频帧率根据编码格式分辨率取值
					**/
					var m_changeframeratecap=$(m_changehtml).eq(j).find('frameratelist').length;
					
					for (var n=0; n < m_changeframeratecap; n++)
					{
						var g_resolutionattr=$(m_changehtml).eq(j).find('frameratelist').eq(n).attr('resolution').replace(new RegExp(/(_)/g),'*');  //得到 属于 多码流,码流类型,分辨率的属性值
						if (g_resolutionattr == g_resolution)
						{
						   var g_gframeratecap=$(m_changehtml).eq(j).find('frameratelist').eq(n).find('frameratecap');
						   for (var k=0; k<g_gframeratecap.length; k++)
						   {
							   var g_frameratecaptype=$(m_changehtml).eq(j).find('frameratelist').eq(n).find('frameratecap').eq(k).attr('type');
							   if (g_frameratecaptype==g_videocodetypetext)
							   {
								   encchnsmin=g_frameratecaptype=$(m_changehtml).eq(j).find('frameratelist').eq(n).find('frameratecap').eq(k).children('min').text()
								   encchnmax=g_frameratecaptype=$(m_changehtml).eq(j).find('frameratelist').eq(n).find('frameratecap').eq(k).children('max').text()
								   encchnsdef=g_frameratecaptype=$(m_changehtml).eq(j).find('frameratelist').eq(n).find('frameratecap').eq(k).children('def').text()
								  $("#maxFrameRate").attr('maxlength', encchnmax.length);
								  $("#fixedmaxFrameRateTips").html(encchnsmin+"~"+encchnmax);
								  if (Number(g_framerate) > Number(encchnmax))
								  {
									  $("#maxFrameRate").val(encchnmax);
								  }
								  else 
								  {
									  $("#maxFrameRate").val(g_framerate);
								  } 
								   
								  break;
							   }
						   }
						   break;	
						}
					}//视频帧率根据编码格式分辨率取值
					
			   }
		}
	  //分辨率能力集
		//分辨率能力集结束
	});

   QualityControlType();
};

/*************************************************
Function:		ChangeResolution
Description:	分辨率
Input:			无			
Output:			无
return:			无				
*************************************************/
function ChangeResolution(){
   var videoResolution=$("#videoResolution").val();
   var g_multivideoType=$("#multivideoType").val();  //多码流
	 var g_StreamTypeIn=$("#StreamTypeIn").val();  //码流类型
	 var g_videoCodecType=$("#videoCodecType").val();  //h.264,MJPEG
	 var g_videoQualityControlTypechange=$("#videoQualityControlType").val();  //fix,var

	
	$(m_RefreshVideoXml).find("caplist").each(function(i){
		//console.log($(this).html())
		var m_changehtml=$(this).find('cap');
		for (var j=0; j < m_changehtml.length; j++)
		{
			var g_steamtype=$(this).find('cap').eq(j).attr('steamtype');   //多码流
			var g_streamid=$(this).find('cap').eq(j).attr('streamid');   //码率类型
			if (g_steamtype==g_multivideoType && g_streamid==g_StreamTypeIn )
			{
					var m_changeframeratecap=$(m_changehtml).eq(j).find('frameratelist').length;
					for (var n=0; n < m_changeframeratecap; n++)
					{
						var g_resolutionattr=$(m_changehtml).eq(j).find('frameratelist').eq(n).attr('resolution').replace(new RegExp(/(_)/g),'*');  //得到 属于 多码流,码流类型,分辨率的属性值
						if (g_resolutionattr == videoResolution)
						{
						   var g_gframeratecap=$(m_changehtml).eq(j).find('frameratelist').eq(n).find('frameratecap');
						   for (var k=0; k<g_gframeratecap.length; k++)
						   {
							   var g_frameratecaptype=$(m_changehtml).eq(j).find('frameratelist').eq(n).find('frameratecap').eq(k).attr('type');
							   if (g_frameratecaptype==g_videoCodecType)
							   {
								   encchnsmin=g_frameratecaptype=$(m_changehtml).eq(j).find('frameratelist').eq(n).find('frameratecap').eq(k).children('min').text()
								   encchnmax=g_frameratecaptype=$(m_changehtml).eq(j).find('frameratelist').eq(n).find('frameratecap').eq(k).children('max').text()
								   encchnsdef=g_frameratecaptype=$(m_changehtml).eq(j).find('frameratelist').eq(n).find('frameratecap').eq(k).children('def').text()
								  $("#maxFrameRate").attr('maxlength', encchnmax.length);
								  $("#fixedmaxFrameRateTips").html(encchnsmin+"~"+encchnmax);
								  if (Number(g_framerate) > Number(encchnmax))
								  {
									  $("#maxFrameRate").val(encchnmax);
								  }
								  else 
								  {
									  $("#maxFrameRate").val(g_framerate);
								  } 
								   
								  break;
							   }
						   }
						   break;	
						}
					}//视频帧率根据编码格式分辨率取值
			}
		}
	});
	
	 
	QualityControlType();
};


//选择
function changevideotype(){
	var g_multivideoType=$("#multivideoType").val();  //多码流
	 var g_StreamTypeIn=$("#StreamTypeIn").val();  //码流类型
	 var g_videoCodecType=$("#videoCodecType").val();  //h.264,MJPEG
	 var g_videoQualityControlTypechange=$("#videoQualityControlType").val();  //fix,var

	//var  g_resolution = $(m_RefreshVideoXml).find("resolution").eq(0).text().replace(new RegExp(/(_)/g),'*');
	//多码流
	$(m_RefreshVideoXml).find("caplist").each(function(i){
		var m_changecap=$(this).find('cap').length;
		var m_changehtml=$(this).find('cap');
		for (var j = 0; j < m_changecap; j++){
			   
			   var g_steamtype=$(this).find('cap').eq(j).attr('steamtype');   //多码流
			   var g_streamid=$(this).find('cap').eq(j).attr('streamid');   //码率类型
				
			    if (g_steamtype==g_multivideoType && g_streamid==g_StreamTypeIn )
			   {
				   
				   /*
				   选择编码格式,改变编码复杂度列表
				   */
				   var m_enccomplexitycap=$(this).find('cap').find("enccomplexitylist").find('enccomplexitycap').length / m_changecap;
				   for (var m = 0; m < m_enccomplexitycap; m++)
				   {
					   var m_enccomplexityarrt=$(this).find('cap').find("enccomplexitylist").find('enccomplexitycap').eq(j * m_enccomplexitycap + m).attr('codetype');  // h.264，mjpeg
					  // console.log(m_enccomplexityarrt+"   "+g_videocodetypetext)
					   if (m_enccomplexityarrt==g_videoCodecType)
					   {
						   var m_enccomplexitytexts=$(this).find('cap').find("enccomplexitylist").find('enccomplexitycap').eq(j * m_enccomplexitycap + m).text().split(",");
						   $("#selectCodecComplexity").empty();
						   insertOptions2Select(m_enccomplexitytexts, ["low", "middle", "high"], ["optlow", "optmiddle", "opthigh"], "selectCodecComplexity");
						   setValueDelayIE6("selectCodecComplexity" ,"","",g_videoCodecType);
						   break;
					   }
					  
				   }//编码复杂度根据编码格式显示其下拉列表结束
				   
				   
				   
				   
				   /**
				   分辨率下拉列表
				   **/
				  /*  var g_resolutioncapopt=$(this).find('cap').find('resolutioncap').eq(j).attr('opt').replace(new RegExp(/(_)/g),'*');
					$("#videoResolution").empty();
					var arrresolution = g_resolutioncapopt.split(","); 
					for (var i=0;i<arrresolution.length;i++){
						$("#videoResolution").append( "<option value="+arrresolution[i]+">"+arrresolution[i]+"</option>")
						$("#videoResolution").val(g_resolution);
					};//分辨率下拉列表
					*/
					
					/***
					视频帧率根据编码格式分辨率取值
					**/
					var m_changeframeratecap=$(m_changehtml).eq(j).find('frameratelist').length;
					
					for (var n=0; n < m_changeframeratecap; n++)
					{
						var g_resolutionattr=$(m_changehtml).eq(j).find('frameratelist').eq(n).attr('resolution').replace(new RegExp(/(_)/g),'*');  //得到 属于 多码流,码流类型,分辨率的属性值
						if (g_resolutionattr == $("#videoResolution").val())
						{
						   var g_gframeratecap=$(m_changehtml).eq(j).find('frameratelist').eq(n).find('frameratecap');
						   for (var k=0; k<g_gframeratecap.length; k++)
						   {
							   var g_frameratecaptype=$(m_changehtml).eq(j).find('frameratelist').eq(n).find('frameratecap').eq(k).attr('type');
							   if (g_frameratecaptype==g_videoCodecType)
							   {
								   encchnsmin=g_frameratecaptype=$(m_changehtml).eq(j).find('frameratelist').eq(n).find('frameratecap').eq(k).children('min').text()
								   encchnmax=g_frameratecaptype=$(m_changehtml).eq(j).find('frameratelist').eq(n).find('frameratecap').eq(k).children('max').text()
								   encchnsdef=g_frameratecaptype=$(m_changehtml).eq(j).find('frameratelist').eq(n).find('frameratecap').eq(k).children('def').text()
								  $("#maxFrameRate").attr('maxlength', encchnmax.length);
								  $("#fixedmaxFrameRateTips").html(encchnsmin+"~"+encchnmax);
								  if (Number(g_framerate) > Number(encchnmax))
								  {
									  $("#maxFrameRate").val(encchnmax);
								  }
								  else 
								  {
									  $("#maxFrameRate").val(g_framerate);
								  } 
								   
								  break;
							   }
						   }
						   break;	
						}
					}//视频帧率根据编码格式分辨率取值
			   }
		}
	  //分辨率能力集
		//分辨率能力集结束
	});
	
	 
	QualityControlType();
};


//选择多码流
function ChangemultivideoType(){
	 var g_multivideoType=$("#multivideoType").val();  //多码流
	 var g_StreamTyp=$("#StreamTypeIn").val();  //码流类型
	 var g_videoCodecType=$("#videoCodecType").val();  //h.264,MJPEG
	 var g_videoQualityControlTypechange=$("#videoQualityControlType").val();  //fix,var
	if (g_multivideoType==1){
		$("#StreamTypeIn").empty();
		$("<option id='"+'StreamTypeInOpt1'+"' name='"+'StreamTypeInOpt1'+"' value='1'>"+getNodeValue('StreamTypeInOpt1')+"</option>").appendTo("#StreamTypeIn"); 
	}
	else if(g_multivideoType==2){
		$("#StreamTypeIn").empty();
		for (i=0; i < g_multivideoType; i++){
			$("<option id='"+'StreamTypeInOpt'+(i + 1)+"' name='"+'StreamTypeInOpt'+(i + 1)+"' value='"+(i + 1)+"'>"+getNodeValue('StreamTypeInOpt'+(i + 1))+"</option>").appendTo("#StreamTypeIn");
		}
	}
	else if(g_multivideoType==3){
		$("#StreamTypeIn").empty();
		for (i=0; i < g_multivideoType; i++){
			$("<option id='"+'StreamTypeInOpt'+(i + 1)+"' name='"+'StreamTypeInOpt'+(i + 1)+"' value='"+(i + 1)+"'>"+getNodeValue('StreamTypeInOpt'+(i + 1))+"</option>").appendTo("#StreamTypeIn");
		}
	}
	else if(g_multivideoType==4){
		$("#StreamTypeIn").empty();
		for (i=0; i < g_multivideoType; i++){
			$("<option id='"+'StreamTypeInOpt'+(i + 1)+"' name='"+'StreamTypeInOpt'+(i + 1)+"' value='"+(i + 1)+"'>"+getNodeValue('StreamTypeInOpt'+(i + 1))+"</option>").appendTo("#StreamTypeIn");
		}
	}
	GetStreamTypeIn();
}
//选择多码流
function multivideoType(){
	var multivideo=$("#multivideoType").val();
	var szXml = "<multivideoinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<multivideo>"+multivideo+"</multivideo>";
 	szXml += "</multivideoinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/multivideo"
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
			/* var s_szmultivideo =xhr.responseText;
			 var xmlDocstate = parseXmlFromStr(s_szmultivideo);
			 $(xmlDocstate).find("statuscode").each(function(i){ 
				 state= $(this).text();
				});
			
			  if("0" == state)	//OK
				{
					szRetInfo = m_szSuccessState+m_szSuccess1;
				}else{
					szRetInfo=  m_szErrorState+m_szError1;	
				}
			$("#SetResultTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
			*/
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}


//改视频编码
function ChangevideoCodecType(){
	
 var changevideoCode=$("#videoCodecType").val();
 
 
 //视频帧率大小
		$(g_szVideoInfoXml).find("frameratelist").each(function(i,data) {
				var framerateNodes=$(this).find('framerate')
				for (var j = 1; j <=framerateNodes.length; j++){
					   var streammodeopt=$(g_szVideoInfoXml).find('framerate').eq(j-1).attr('streammode');  //多码流  1,2,3
					 //  var presentlinktypea=$(g_szVideoInfoXml).find("frameratelist").find('framerate').eq(j-1).attr('type');
				       var frameratetype=$(g_szVideoInfoXml).find('framerate').eq(j-1).attr('type');   //视频编码 h.264，mjpeg
					   
					  // var encchnsmin = $(g_szVideoInfoXml).find('framerate').find('min').eq(j-1).text();
					   //var encchnmax = $(g_szVideoInfoXml).find('max').eq(j-1).text();
					   //var encchnsdef = $(g_szVideoInfoXml).find('def').eq(j-1).text();
				
					if (streammodeopt==m_MultiVideo  &&  frameratetype==changevideoCode ){
						 encchnsmin=$(g_szVideoInfoXml).find("framerate").find('min').eq(j-1).text();
					     encchnmax=$(g_szVideoInfoXml).find("framerate").find('max').eq(j-1).text();
						 encchnsdef = $(g_szVideoInfoXml).find('framerate').find('def').eq(j-1).text();
					     $("#maxFrameRate").val(encchnsdef).attr('maxlength' , encchnmax.length); 
					     $("#fixedmaxFrameRateTips").html(encchnsmin+"~"+encchnmax)
						return false
					}
				}

			});	 
 
 
   if (changevideoCode=="H.264" || changevideoCode=="H.265"){
	  // $("#videoQualityControlType").empty(); 
	  // $("#CodecComplexity_tr").show();
	  $("#selectCodecComplexity").prop("disabled",false);
	  // $("<option value='var'>变码率</option>").appendTo("#videoQualityControlType") 
	   
	    $(g_szVideoInfoXml).find("dataratetype").each(function(i){ 
			var m_DataRateType= $(this).text();
			$("#videoQualityControlType").empty(); 
			 var k_szdataratetypeops = $(this).attr('opt').split(",");
			insertOptions2Select(k_szdataratetypeops, ["fix","var"], ["optfix","optvar"], "videoQualityControlType");
			setValueDelayIE6("videoQualityControlType" ,"","",m_DataRateType);
			//图像质量
			QualityControlType();
		}); 
	   
	}else if(changevideoCode=="MJPEG"){
		//$("#CodecComplexity_tr").hide();
		 $("#selectCodecComplexity").prop("disabled",true);
		//$("#videoQualityControlType option[value='var']").remove(); 
		
		
		$(g_szVideoInfoXml).find("dataratetype").each(function(i){ 
			var m_DataRateType= $(this).text();
			$("#videoQualityControlType").empty(); 
			 var k_szdataratetypeops = $(this).attr('opt').split(",");
			insertOptions2Select(k_szdataratetypeops, ["fix"], ["optfix"], "videoQualityControlType");
			setValueDelayIE6("videoQualityControlType" ,"","",m_DataRateType);
			//图像质量
			QualityControlType();
		}); 
		
	}else if(videoCodecType=="MPEG4"){
		//$("#videoQualityControlType option[value='var']").remove();
		$(g_szVideoInfoXml).find("dataratetype").each(function(i){ 
			var m_DataRateType= $(this).text();
			$("#videoQualityControlType").empty(); 
			 var k_szdataratetypeops = $(this).attr('opt').split(",");
			insertOptions2Select(k_szdataratetypeops, ["fix"], ["optfix"], "videoQualityControlType");
			setValueDelayIE6("videoQualityControlType" ,"","",m_DataRateType);
			//图像质量
			QualityControlType();
		});  
	}
  }
function QualityControlType(){
	// 定码率和非MJPEG编码禁用
	
	var g_Fix=$("#videoQualityControlType").val();  //码率类型 fix定码率  var变码率
	var g_fixedQuality=$("#fixedQuality").val();  //图像质量 middle中等
	var g_Mjpeg=$("#videoCodecType").val();  //视频编码 MJPEG H.264中等
	var g_selectCodecComplexity=$("#selectCodecComplexity").val();  //编码复杂度
	var g_FrameI=$("#IntervalFrameI").val();  //I帧间隔
	
	if (g_Mjpeg=="MJPEG"){
		$("#videoQualityControlType").val("fix").prop("disabled",true)  // 禁用
		$("#selectCodecComplexity").prop("disabled",true)  // 禁用
		$("#IntervalFrameI").prop("disabled",true)  // 禁用
		$("#constantBitRate").prop("disabled",true)  // 禁用
	}
	else{
		$("#videoQualityControlType").prop("disabled",false)   //启用
		$("#selectCodecComplexity").prop("disabled",false)   //启用
		$("#IntervalFrameI").prop("disabled",false)   //启用
		$("#constantBitRate").prop("disabled",false)  // 禁用
	}
	
	if (g_Mjpeg=="MJPEG"  || ( g_Mjpeg!="MJPEG" && g_Fix=="var")){
		$("#fixedQuality").prop("disabled",false)   //启用
	}else{
		$("#fixedQuality").val("middle").prop("disabled",true)  // 禁用
	}
	
 }


/*************************************************
Function:		SaveConfigVideo
Description:	保存视频编码
Input:			无			
Output:			无
return:			无				
*************************************************/
function SaveConfigVideo(obj){
  var multivideo=$("#multivideoType").val();
  var maxFrameRate=$("#maxFrameRate").val();
  var videoQualityControlType=$("#videoQualityControlType").val();
  var v_videoResolution=$("#videoResolution").val();
  var constantBitRate=$("#constantBitRate").val();
  var IntervalFrameI=$("#IntervalFrameI").val();
  var StreamTypeIn=$("#StreamTypeIn").val();
  var videoCodecType=$("#videoCodecType").val();  //视频编码
 
  if (videoCodecType=="H.264"  || videoCodecType=="H.265"){
	 
	  if(!CheackServerIDIntNum(maxFrameRate,'VideoFrameRatetips','MVideoFrameRate',Number(encchnsmin),Number(encchnmax)))
		{
			return;
		}
	 }else if(videoCodecType=="MJPEG"){
		
		 if(!CheackServerIDIntNum(maxFrameRate,'VideoFrameRatetips','MVideoFrameRate',Number(encchnsmin),Number(encchnmax)))
		{
			return;
		} 
	} else if(videoCodecType=="MPEG4"){
		
		 if(!CheackServerIDIntNum(maxFrameRate,'VideoFrameRatetips','MVideoFrameRate',Number(encchnsmin),Number(encchnmax)))
		{
			return;
		} 
	}
  

  if(!CheackServerIDIntNum(constantBitRate,'MaxBitRatetips','MMaxDataRate',Number(maxdataratevaluemin),Number(maxdataratevaluemax)))
	{
	    return;
	}
  if(!CheackServerIDIntNum(IntervalFrameI,'IntervalFrameItips','MIntervalFrameI',Number(iframespeedvaluemin),Number(iframespeedvaluemax)))
	{
	    return;
	}
 var videoResolution =  v_videoResolution.split("*");
 var videoResolution_arr=videoResolution[0]+"_"+videoResolution[1];
 if (multivideo != m_MultiVideo)
 {
	 if (confirm(m_szRestartParameters))
	 {
	    Setvideoenc(obj,'reboot');
	 }
	 
 }
 else
 {
	 Setvideoenc(obj);
 }
};
/*************************************************
Function:		Setmultivideo
Description:	保存多码流			
*************************************************/
function Setmultivideo(obj){
	var multivideo=$("#multivideoType").val();
	var maxFrameRate=$("#maxFrameRate").val();
	var videoQualityControlType=$("#videoQualityControlType").val();
	var v_videoResolution=$("#videoResolution").val();
	var constantBitRate=$("#constantBitRate").val();
	var IntervalFrameI=$("#IntervalFrameI").val();
	var StreamTypeIn=$("#StreamTypeIn").val();
	var videoCodecType=$("#videoCodecType").val();  //视频编码
	var videoResolution =  v_videoResolution.split("*");
    var videoResolution_arr=videoResolution[0]+"_"+videoResolution[1];
	var szXml = "<multivideoinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<multivideo>"+multivideo+"</multivideo>";
	szXml += "</multivideoinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/multivideo"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		async: false,//同步
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},success: function(xmlDoc, textStatus, xhr)
		{
			if (xhr.readyState == 4) 
			{
				if (xhr.status == 200) 
				{
					var Docxml =xhr.responseText;
					var xmlDoc = GetparseXmlFromStr(Docxml);
					 $(xmlDoc).find("statuscode").each(function(i){ 
					  var state= $(this).text();
					  if("0" == state)	//OK
					  {
						  szRetInfo = m_szSuccessState+m_szSuccess1;
					  }
					  else if("3" == state)	//OK   
					  {
						szRetInfo = m_szSuccessState+m_szSuccess1;
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
					  $("#SetResultVideoTips").html(szRetInfo);
					  setTimeout(function(){$("#SetResultVideoTips").html("");},5000);  //5秒后自动清除
					});
				}//200
			}//4
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj);
		}
	  });//保存多码流
};
/*************************************************
Function:		Setvideoenc
Description:	获取保存码流类型
Input:			无			
Output:			无
return:			无				
*************************************************/
function Setvideoenc(obj,reb){
	var multivideo=$("#multivideoType").val();
	var maxFrameRate=$("#maxFrameRate").val();
	var videoQualityControlType=$("#videoQualityControlType").val();
	var v_videoResolution=$("#videoResolution").val();
	var constantBitRate=$("#constantBitRate").val();
	var IntervalFrameI=$("#IntervalFrameI").val();
	var StreamTypeIn=$("#StreamTypeIn").val();
	var videoCodecType=$("#videoCodecType").val();  //视频编码
	var videoResolution =  v_videoResolution.split("*");
    var videoResolution_arr=videoResolution[0]+"_"+videoResolution[1];
	var szXml = "<videoencinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<resolution>"+videoResolution_arr+"</resolution>";
	szXml += "<dataratetype>"+videoQualityControlType+"</dataratetype>";
	szXml += "<maxdatarate>"+constantBitRate+"</maxdatarate>";
	szXml += "<quality>"+$("#fixedQuality").val()+"</quality>";
	szXml += "<framerate>"+maxFrameRate+"</framerate>";
	szXml += "<videocodetype>"+$("#videoCodecType").val()+"</videocodetype>";
	szXml += "<encordercomplexity>"+$("#selectCodecComplexity").val()+"</encordercomplexity>";
	szXml += "<iframespeed>"+IntervalFrameI+"</iframespeed>";
	szXml += "</videoencinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/enc/"+StreamTypeIn
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		cache:false,
		async: false,//同步
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{
			if (xhr.readyState == 4) 
			{
				if (xhr.status == 200) 
				{
					var Docxml =xhr.responseText;
					var xmlDoc = GetparseXmlFromStr(Docxml);
					$(xmlDoc).find("statuscode").each(function(i){ 
						var state= $(this).text();
						if ("0" == state)
						 {
							if (reb=="reboot")
							{
								Setmultivideo(obj);
							}
							else
							{
								szRetInfo = m_szSuccessState+m_szSuccess1;
								GetStreamTypeIn(); //获取视频信息
							}
						 }
						 else if("3" == state)	//OK   
						 {
							szRetInfo = m_szSuccessState+m_szSuccess1;
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
						 $("#SetResultVideoTips").html(szRetInfo);
					    setTimeout(function(){$("#SetResultVideoTips").html("");},5000);  //5秒后自动清除
					});
				}//200
			}//4
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj);
		}//保存码流类型
 });
}

/*************************************************
Function:		Getflicker
Description:	防闪烁			
*************************************************/
function Getflicker(){
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
				$("#videoAntiFlickerMode").empty(); 
				 var k_modeopts = $(this).attr('opt').split(",");
				insertOptions2Select(k_modeopts, ["50hz", "60hz", "auto"], ["mjs50hz", "mjs60hz", "mjsAntiFlickerModeauto"], "videoAntiFlickerMode");
				setValueDelayIE6("videoAntiFlickerMode" ,"","",$(this).text());
			});              
                   
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
/*************************************************
Function:		SaveConfigflicker
Description:	防闪烁			
*************************************************/
function SaveConfigflicker(obj){
	var szXml = "<powerlinefrequencyinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<mode>"+$("#videoAntiFlickerMode").val()+"</mode>";
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
						$.modal.impl.close();
						GetStreamTypeIn();
					}
					else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
					$("#SetResultflashTips").html(szRetInfo);
					setTimeout(function(){$("#SetResultflashTips").html("");},5000);  //5秒后自动清除
				});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		});	
};
function videohelp_tips(){
	$("#divHelpTipsTable").modal(
		{
			"close":false,
			"autoResize":true,
			"position":[150]  
		 }
	   );
	$("#simplemodal-container").height("auto");
};

//音频编码
function Audiocode() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Audiocode);
pr(Audiocode).update = function() {
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["audio", "Audiocode"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initAudiocode();
};
/*************************************************
Function:		initAudiocode
Description:	初始化音频编码页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initAudiocode()
{
	GetAudiocode()
	autoResizeIframe();
	
}
//获取音频编码
function GetAudiocode(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/audio/1/enc/1"
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
			AudioxmlDoc = xmlDoc
			$(xmlDoc).find("audioencinfo").children("type").each(function(i){ 
			  k_opt=$(this).attr('opt');
		  	  k_sztype= $(this).text();
			  $("#AudiocodeType").empty();
				var arr = $(this).attr('opt').split(","); 
				for (i=0;i<arr.length;i++){
						// console.log(arr[i])
					   $("#AudiocodeType").append( "<option value="+arr[i]+">"+arr[i]+"</option>")
							var selectCode=document.getElementById("AudiocodeType"); 
							if(selectCode.options[i].value==k_sztype){  
								selectCode.options[i].selected=true;  
							 } 
					};
			  if(k_sztype=="G.711u(PCMU)" || k_sztype=="AACLC")
				{
					$("#AudiocodeTypetips").html("GB"+" "+"<label name='MDoesnotsupport'>"+getNodeValue('MDoesnotsupport')+"</label>")
				}
				else if(k_sztype=="ADPCM" || k_sztype=="G722.1.C" || k_sztype=="G.722")
				{
					$("#AudiocodeTypetips").html("GB"+" "+"<label name='MDoesnotsupport'>"+getNodeValue('MDoesnotsupport')+"</label>"+"  "+"ONVIF"+" "+"<label name='MDoesnotsupport'>"+getNodeValue('MDoesnotsupport')+"</label>")
				}
				else{
					$("#AudiocodeTypetips").html("")
				}
			}); 
			
		$(xmlDoc).find("volume").each(function(i){ 
			  var k_szvolume= Number($(this).text());
			  var k_min= Number($(this).attr('min'));
			  var k_max= Number($(this).attr('max'));
			  $("#encVol_value").val(k_szvolume).attr('maxlength',$(this).attr('max').length);
			  $( "#slider_encVol" ).slider({
				  range: "min",
				  value: k_szvolume,
				  min: k_min,
				  max: k_max,
				  slide: function( event, ui ) {
					$("#encVol_value").val(ui.value);
				  },
				change: function( event, ui ) {
					$("#encVol_value").val($( "#slider_encVol" ).slider( "value" ))
				  }
			  });
			 if($.browser.msie) {
				$('#encVol_value').keydown(function(e){
				  if(e.keyCode==13)
				  {
					  if (!CheackOnlyNum($("#encVol_value").val()))
						{
							  $("#encVol_value").val($( "#slider_encVol" ).slider( "value" ))
							  return;
						}
						if (parseInt($("#encVol_value").val()) < parseInt(k_min) || parseInt($("#encVol_value").val()) > parseInt(k_max) ){
							 $("#encVol_value").val($( "#slider_encVol" ).slider( "value" ))
						}
						else
						{
							$("#slider_encVol").slider( "value", $("#encVol_value").val() );
						}
				  }
				});
			};
			$( "#encVol_value" ).change(function() {
				if (!CheackOnlyNum($("#encVol_value").val()))
				{
					  $("#encVol_value").val($( "#slider_encVol" ).slider( "value" ))
					  return;
				}
				if (parseInt($("#encVol_value").val()) < parseInt(k_min) || parseInt($("#encVol_value").val()) > parseInt(k_max) ){
					 $("#encVol_value").val($( "#slider_encVol" ).slider( "value" ))
				}
				else
				{
					$("#slider_encVol").slider( "value", $("#encVol_value").val() );
				}
			});
		}); 	

		//音频编码格式
		$(xmlDoc).find("typecaplist").each(function(i,data) {
				var typecaplistNodes=$(this).find('type')
				for (var j = 0; j <=typecaplistNodes.length; j++){
					   var streammodeopt=$(xmlDoc).find('type').eq(j+1).attr('opt');  //多码流  1,2,3
					 //  var presentlinktypea=$(g_szVideoInfoXml).find("frameratelist").find('framerate').eq(j-1).attr('type');
					if (streammodeopt==k_sztype  ){
						 enableaectext=$(AudioxmlDoc).find("type").find('enableaec').eq(j).text();
						 if (enableaectext!="true"){
							 $("#subaec").hide();
							 $("#aec").prop("disabled", true);
							}else{
							 $("#subaec").show();	
							$("#aec").prop("disabled", false);
							}
						   
						return false
					}
				}

			});	 
		
		$(xmlDoc).find("aec").each(function(i){ 
			 var k_mixrerec= $(this).text();
			 if (k_mixrerec=="true"){
				$("#aec").val(true).prop("checked", true);
			}else{
			   $("#aec").val(false).prop("checked", false);
			};
		}); 
		
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//改变音频格式
function ChangeAudiocodeType(){
	var AudiocodeType=$("#AudiocodeType").val();
	if(AudiocodeType=="G.711u(PCMU)" || AudiocodeType=="AACLC")
	{
		$("#AudiocodeTypetips").html("GB"+" "+"<label name='MDoesnotsupport'>"+getNodeValue('MDoesnotsupport')+"</label>")
	}
	else if(AudiocodeType=="ADPCM" || AudiocodeType=="G722.1.C" || AudiocodeType=="G.722")
	{
		
		$("#AudiocodeTypetips").html("GB"+" "+"<label name='MDoesnotsupport'>"+getNodeValue('MDoesnotsupport')+"</label>"+"  "+"ONVIF"+" "+"<label name='MDoesnotsupport'>"+getNodeValue('MDoesnotsupport')+"</label>")
	}
	else
	{
		$("#AudiocodeTypetips").html("")
	}
	
	$(AudioxmlDoc).find("typecaplist").each(function(i,data) {
				var typecaplistNodes=$(this).find('type')
				for (var j = 0; j <=typecaplistNodes.length; j++){
					   var streammodeopt=$(AudioxmlDoc).find('type').eq(j+1).attr('opt');  //多码流  1,2,3
					 //  var presentlinktypea=$(g_szVideoInfoXml).find("frameratelist").find('framerate').eq(j-1).attr('type');
					if (streammodeopt==AudiocodeType  ){
						// var streammodeopt=$(AudioxmlDoc).find('type').eq(j).attr('opt');  //多码流  1,2,3
						 enableaectext=$(AudioxmlDoc).find("type").find('enableaec').eq(j).text();
						// console.log(enableaectext+"  "+j)
						 if (enableaectext!="true"){
							  $("#subaec").hide();
							  $("#aec").prop("disabled", true).val(false);
							  $("#aec").prop("checked", false);
							}else{
							  $("#subaec").show();
							  $("#aec").prop("disabled", false).val(false);
							  //$("#aec").prop("checked", true);
							  $("#aec").prop("checked", false);
							}
						   
						//return false
					}
				}

			});	 
	
};
//音频编码保存
function SaveAudiocode(obj){
	var type=$("#AudiocodeType").val();
	var volume=$("#encVol_value").val();
	var mixrerec=$("#aec").val();
	var szXml = "<audioencinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<type>"+type+"</type>";
	szXml += "<volume>"+volume+"</volume>";
	szXml += "<aec>"+mixrerec+"</aec>";
 	szXml += "</audioencinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/audio/1/enc/1"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		//cache:false, 缓存
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},complete:function(xhr, textStatus)
		{
			SaveStateTips(xhr,obj);
		}
	});
};
function Audiodecoder() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Audiodecoder);
pr(Audiodecoder).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["audio", "Audiodecoder"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initAudiodecoder();
};
/*************************************************
Function:		initAudiodecoder
Description:	初始化音频解码页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initAudiodecoder()
{
	GetAudiodecoder(); //获取音频解码参数
	autoResizeIframe();
}
//获取音频解码参数
function GetAudiodecoder(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/audio/1/dec/1"
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
			 $(xmlDoc).find("volume").each(function(i){ 
		  	     var k_szdecvol= Number($(this).text());
				 var k_szdecmin= Number($(this).attr('min'));
				 var k_szdecman= Number($(this).attr('max'));
				 $("#decVol_value").val(k_szdecvol).attr('maxlength',$(this).attr('max').length);
				$( "#slider_decVol" ).slider({
				  range: "min",
				  value: k_szdecvol,
				  min: k_szdecmin,
				  max: k_szdecman,
				  slide: function( event, ui ) {
					$("#decVol_value").val(ui.value);
				  },
				change: function( event, ui ) {
					$("#decVol_value").val($( "#slider_decVol" ).slider( "value" ))
				  }
				});
				if($.browser.msie) {
					$('#decVol_value').keydown(function(e){
					  if(e.keyCode==13)
					  {
						  if (!CheackOnlyNum($("#decVol_value").val()))
							{
								  $("#decVol_value").val($( "#slider_decVol" ).slider( "value" ))
								  return;
							}
							if (parseInt($("#decVol_value").val()) < parseInt(k_szdecmin) || parseInt($("#decVol_value").val()) > parseInt(k_szdecman) ){
								 $("#decVol_value").val($( "#slider_decVol" ).slider( "value" ))
							}
							else
							{
								$("#slider_decVol").slider( "value", $("#decVol_value").val() );
							}
					  }
					});
				};
				$( "#decVol_value" ).change(function() {
					if (!CheackOnlyNum($("#decVol_value").val()))
					{
						  $("#decVol_value").val($( "#slider_decVol" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#decVol_value").val()) < parseInt(k_szdecmin) || parseInt($("#decVol_value").val()) > parseInt(k_szdecman) ){
						 $("#decVol_value").val($( "#slider_decVol" ).slider( "value" ))
					}
					else
					{
						$("#slider_decVol").slider( "value", $("#decVol_value").val() );
					}
				});

				
			}); 
			
		$(xmlDoc).find("mixerrec").each(function(i){ 
		  k_szmixerrec= $(this).text();
		  if (k_szmixerrec=="true"){
			    $("#mixerrec").val(true);
				$("#mixerrec").prop("checked", true);
			}else{
			   $("#mixerrec").val(false);
			   $("#mixerrec").prop("checked", false);
			};
		}); 
		
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//保存音频解码
function SaveConfigAudiodecoder(obj){
	var volume=$("#decVol_value").val();
	var mixerrec=$("#mixerrec").val();
	var szXml = "<audiodecinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<volume>"+volume+"</volume>";
	szXml += "<mixerrec>"+mixerrec+"</mixerrec>";
 	szXml += "</audiodecinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/audio/1/dec/1"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		//cache:false, 缓存
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},complete:function(xhr, textStatus)
		{
			SaveStateTips(xhr,obj);
		}
	});
};






function cropping() {
	SingletonInheritor.implement(this);
	//this.initCSS();	
}
SingletonInheritor.declare(cropping);
pr(cropping).update = function() {
	g_transStack.clear();
	VideoPluginNull();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["video", "cropping"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
   initCropping();	
   autoResizeIframe();
};
function initCropping(){
	if(document.all)
	   {
			 $("#mainplugincropping").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="plugincropping"  width="100%" height="100%" ></object>')
		   }
	   else
		   {
			$("#mainplugincropping").html('<embed id="plugincropping" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
		  }
		  
   Plugin();
   if (m_PreviewOCX==null)
	{
		 $("#mainplugincropping").html("<div class='plagndiv'><A href='javascript:void(0)' onclick='openWin(this)' class='mycls' onfocus='blur()'>"+"<label name='MPlugin'>"+getNodeValue("MPlugin")+"</label>"+"</a></div>")
	}
	else
	{
		 var plugincropping=document.getElementById("plugincropping")
	   plugincropping.setPluginType("encode");
	   if ($.cookie('authenticationinfo')==null || $.cookie('authenticationinfo')==''){
			//alert("匿名")
			var ret=plugincropping.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),'','',''); //开始播放
			//alert("过插件")
		}else{
			//alert("用户")
		    var ret=plugincropping.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'),UserNameLogin,UserPassLogin);  //开始播放	
		 //  alert("过用户")
		}
		plugincropping.eventWebToPlugin("changelanguage",parent.translator.szCurLanguage)
		loadBackPlay(document.getElementById("plugincropping"));
	}
	//$("#Selectedcropping").attr("name","")
   Getcropping();
};

//开启编码裁剪
function checkcropping(obj){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;  //安装插件	
		$("#SetResultTipscropping").html(szRetInfo);
		setTimeout(function(){$("#SetResultTipscropping").html("");},5000);  //5秒后自动清除
		return;
	}
	
  if($(obj).prop("checked")){ //选中
		$(obj).val(true);
		$("#Selectedcropping").prop("disabled", false);
		$("#ClearAllcropping").prop("disabled", false);
		document.getElementById("plugincropping").eventWebToPlugin("encode","enable", "true"); 
		
	}else{
		$("#Selectedcropping").prop("disabled" ,true).val(getNodeValue('MStartdraw'))
		 $("#ClearAllcropping").prop("disabled", true);
		 $(obj).val(false);
		 document.getElementById("plugincropping").eventWebToPlugin("encode","enable", "false"); 
	}
}
/*************************************************
Function:		Getcropping
Description:	获取编码裁剪
Input:			无			
Output:			无
return:			无				
*************************************************/
function Getcropping(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/enccut"
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
		   $("#Selectedcropping").val(getNodeValue('MStartdraw'))
		  if (m_PreviewOCX!=null)
		  {
			   var ct= document.getElementById("plugincropping").eventWebToPlugin("encode","setparam",Docxml);   
		  }
		
		  $(xmlDoc).find("enabled").each(function(i,data) {
				var k_croppingenabled= $(this).text(); 
				if (k_croppingenabled=="true"){
					$("#checkobjcropping").val(true);
					$("#checkobjcropping").prop("checked", true);
					$("#Selectedcropping").prop("disabled", false).val(getNodeValue('MStartdraw'));
					$("#ClearAllcropping").prop("disabled", false);
				}else{
					$("#checkobjcropping").val(false);
					$("#checkobjcropping").prop("checked", false);
					$("#Selectedcropping").prop("disabled" ,true).val(getNodeValue('MStartdraw'));
					$("#ClearAllcropping").prop("disabled", true);
				}; 
			});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//绘制编码裁剪
function Selectedcropping(obj){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;  //安装插件	
		$("#SetResultTipscropping").html(szRetInfo);
		setTimeout(function(){$("#SetResultTipscropping").html("");},5000);  //5秒后自动清除
		return;
	}
	//document.getElementById("plugincropping").eventWebToPlugin("roi","start");
	if ($(obj).val()==getNodeValue('MStartdraw'))
	{
		$(obj).val(getNodeValue('MStopdraw'));
		 document.getElementById("plugincropping").eventWebToPlugin("encode","start");
	}
	else
	{
	    $(obj).val(getNodeValue('MStartdraw'));	
		document.getElementById("plugincropping").eventWebToPlugin("encode","stop");
	}
};
//清除全部编码裁剪
function ClearAllcropping(){
	document.getElementById("plugincropping").eventWebToPlugin("encode","clear"); 
};
//保存编码裁剪
function SaveConfigcropping(obj){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;  //安装插件	
		$("#SetResultTipscropping").html(szRetInfo);
		setTimeout(function(){$("#SetResultTipscropping").html("");},5000);  //5秒后自动清除
		return;
	}
    var ret =	document.getElementById("plugincropping").eventWebToPlugin("encode","save"); 
	if (ret.substring(0,5)=="false"){
		$("#SetResultTipscropping").html(m_szError1);  //保存失败
		return;
	}
	var enable=$("#checkobjcropping").val();
	var szXml = "<enccutinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enabled>"+enable+"</enabled>";
	if (enable=="true"){
		szXml += ret;
	}
 	szXml += "</enccutinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/enccut"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},complete:function(xhr, textStatus)
		{
			// console.log("aaa")
			SaveStateTips(xhr,obj);
			document.getElementById("plugincropping").eventWebToPlugin("encode","saveresult", "true"); 
			Getcropping();
		}
	});
}



function ROI() {
	SingletonInheritor.implement(this);
	//this.initCSS();	
}
SingletonInheritor.declare(ROI);
pr(ROI).update = function() {
	g_transStack.clear();
	VideoPluginNull();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["video", "ROI"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initROI();
	autoResizeIframe();
};
/*************************************************
Function:		initROI
Description:	初始化Roi			
*************************************************/
function initROI(){
	
 
   if(document.all)
	   {
			 $("#mainpluginRoi").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="pluginRoi"  width="100%" height="100%" ></object>')
		   }
	   else
		   {
			$("#mainpluginRoi").html('<embed id="pluginRoi" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
	 }	  
   Plugin();
   if (m_PreviewOCX==null)
	{
		 $("#mainpluginRoi").html("<div class='plagndiv'><A href='javascript:void(0)' onclick='openWin(this)' class='mycls' onfocus='blur()'>"+"<label name='MPlugin'>"+getNodeValue("MPlugin")+"</label>"+"</a></div>");
	}
	else
	{
		var pluginRoi=document.getElementById("pluginRoi")
	   pluginRoi.setPluginType("roi");
	   
	   if ($.cookie('authenticationinfo')==null || $.cookie('authenticationinfo')==''){
			//alert("匿名")
			var ret= pluginRoi.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),'','',''); //开始播放
			//alert("过插件")
		}else{
			//alert("用户")
		    var ret= pluginRoi.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'),UserNameLogin,UserPassLogin);  //开始播放	
		 //  alert("过用户")
		}
		pluginRoi.eventWebToPlugin("changelanguage",parent.translator.szCurLanguage)
		loadBackPlay(document.getElementById("pluginRoi"));
	}
    GetRoi();		
}

function checkRoi(obj){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;  //安装插件	
		$("#SetResultTipsRoi").html(szRetInfo);
		setTimeout(function(){$("#SetResultTipsRoi").html("");},5000);  //5秒后自动清除
		return;
	}
  if($(obj).prop("checked")){ //选中
		$(obj).val(true);
		$("#SelectedRoi").prop("disabled", false);
		$("#ClearAllRoi").prop("disabled", false);
		$("#codelevel").prop("disabled", false);
	}else{
		$("#SelectedRoi").prop("disabled" ,true)
		 $("#ClearAllRoi").prop("disabled", true);
		 $("#codelevel").prop("disabled", true);
		 $(obj).val(false);
		 document.getElementById("pluginRoi").eventWebToPlugin("roi","stop"); 
	}
}
/*************************************************
Function:		ChangeROIlevel
Description:	切换ROI等级
Input:			无			
Output:			无
return:			无				
*************************************************/
function ChangeROIlevel(){
	//var codelevel=$("#codelevel").val();
	//document.getElementById("pluginRoi").eventWebToPlugin("roi","level",codelevel);   
};



/*************************************************
Function:		GetRoi
Description:	获取roi(敏感区编码)
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetRoi(){
	
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/roi"
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
		  //var v_szRoi =xhr.responseText;
		  //var kd_szRoixml = parseXmlFromStr(v_szRoi);
		   var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			if (m_PreviewOCX!=null)
			{
				 var ct= document.getElementById("pluginRoi").eventWebToPlugin("roi","setparam",Docxml); 
			}
			
		     
			
			if("true" == $(xmlDoc).find('enabled').eq(0).text())
		    {
			    $("#checkobjroi").val(true).prop("checked", true);
				$("#SelectedRoi").prop("disabled", false);
				$("#ClearAllRoi").prop("disabled", false);
				$("#codelevel").prop("disabled", false);
		    }else{
				$("#checkobjroi").val(false).prop("checked", false);
				$("#SelectedRoi").prop("disabled" ,true)
			    $("#ClearAllRoi").prop("disabled", true);
				$("#codelevel").prop("disabled", true);
			}
			
			//ROI等级
			$(xmlDoc).find("codelevel").each(function(i){ 
		  	 	var k_szcodelevel= $(this).text();
				$("#codelevel").empty(); 
				 var k_szcodelevelops = $(this).attr('opt').split(",");
				insertOptions2Select(k_szcodelevelops, ["low","middle", "high"], ["optlow","optmiddle", "opthigh"], "codelevel");
				setValueDelayIE6("codelevel" ,"","",k_szcodelevel);
			}); 
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//Roi选择区域
function SelectedRoi(){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;  //安装插件	
		$("#SetResultTipsRoi").html(szRetInfo);
		setTimeout(function(){$("#SetResultTipsRoi").html("");},5000);  //5秒后自动清除
		return;
	}
	document.getElementById("pluginRoi").eventWebToPlugin("roi","start"); 
};
//Roi选择区域清除
function ClearAllRoi(){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;  //安装插件	
		$("#SetResultTipsRoi").html(szRetInfo);
		setTimeout(function(){$("#SetResultTipsRoi").html("");},5000);  //5秒后自动清除
		return;
	}
	document.getElementById("pluginRoi").eventWebToPlugin("roi","clear"); 
};
//Roi保存
function SaveConfigRoi(obj){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;  //安装插件	
		$("#SetResultTipsRoi").html(szRetInfo);
		setTimeout(function(){$("#SetResultTipsRoi").html("");},5000);  //5秒后自动清除
		return;
	}
	var ret =	document.getElementById("pluginRoi").eventWebToPlugin("roi","save"); 
	if (ret.substring(0,5)=="false"){
		return;
	}
	var enable=$("#checkobjroi").val();
	var codelevel=$("#codelevel").val();
	var szXml = "<roiinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enabled>"+enable+"</enabled>";
	szXml += "<codelevel>"+codelevel+"</codelevel>";
	szXml += ret;
 	szXml += "</roiinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/roi"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},complete:function(xhr, textStatus)
		{
			SaveStateTips(xhr,obj);
			GetRoi();
		}
	});
}
/*************************************************
Function:		initdisplaysettings
Description:	初始化initdisplaysettings页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initdisplaysettings()
{
	autoResizeIframe();
}


function privacymasks() {
	SingletonInheritor.implement(this);
	//this.initCSS();	
}
SingletonInheritor.declare(privacymasks);
pr(privacymasks).update = function() {
	g_transStack.clear();
	VideoPluginNull();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["video", "shield"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	$("#shieldstr").attr("name","MStartdraw");
   initprivacymasks();
   autoResizeIframe();
}
function initprivacymasks(){
  
  if(document.all)
	   {
			 $("#mainpluginPrivacymasks").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="pluginPrivacymasks"  width="100%" height="100%" ></object>')
		   }
	   else
		   {
			$("#mainpluginPrivacymasks").html('<embed id="pluginPrivacymasks" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
		  }
		  
   Plugin();
   if (m_PreviewOCX==null)
	{
		 $("#mainpluginPrivacymasks").html("<div class='plagndiv'><A href='javascript:void(0)' onclick='openWin(this)' class='mycls' onfocus='blur()'>"+"<label name='MPlugin'>"+getNodeValue("MPlugin")+"</label>"+"</a></div>");
	}
	else
	{
	plugin= top.parent.document.getElementById("IpcCtrl")
	   var pluginPrivacymasks=document.getElementById("pluginPrivacymasks")
	   pluginPrivacymasks.setPluginType("imageshiled");

  		 if ($.cookie('authenticationinfo')==null || $.cookie('authenticationinfo')==''){
			//alert("匿名")
			var ret=pluginPrivacymasks.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),'','',''); //开始播放
			//alert("过插件")
		}else{
			//alert("用户")
		    var ret=pluginPrivacymasks.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'),UserNameLogin,UserPassLogin);  //开始播放	
		 //  alert("过用户")
		}
		pluginPrivacymasks.eventWebToPlugin("changelanguage",parent.translator.szCurLanguage)
		 loadBackPlay(document.getElementById("pluginPrivacymasks"));
	}
  
   
   Getprivacymasks();
}
//选择视频遮蔽
function checkprivacymasks(obj){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;  //安装插件	
		$("#SetResultTipsprivacymasks").html(szRetInfo);
		setTimeout(function(){$("#SetResultTipsprivacymasks").html("");},5000);  //5秒后自动清除
		return;
	}
	if($(obj).prop("checked")){ //选中
		$(obj).val(true);
		$("#shieldstr").prop("disabled", false);
		$("#shieldclear").prop("disabled", false);
		$("#shieldcolortype").prop("disabled", false);
	}else{
		$(obj).val(false);
		 $("#shieldstr").attr("name","MStartdraw").prop("disabled" ,true).val(getNodeValue('MStartdraw'));	
		 $("#shieldclear").prop("disabled", true);
		 $("#shieldcolortype").prop("disabled", true);
		 document.getElementById("pluginPrivacymasks").eventWebToPlugin("shiled","stop"); 
	}
}
//开始绘制视频遮蔽
function shiledpluginPrivacymasks(obj){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;  //安装插件	
		$("#SetResultTipsprivacymasks").html(szRetInfo);
		setTimeout(function(){$("#SetResultTipsprivacymasks").html("");},5000);  //5秒后自动清除
		return;
	}
	if ($(obj).val()==getNodeValue('MStartdraw'))
	{
		$(obj).attr("name","MStopdraw").val(getNodeValue('MStopdraw'));	
		document.getElementById("pluginPrivacymasks").eventWebToPlugin("shiled","start");
	}
	else
	{
	    $(obj).attr("name","MStartdraw").val(getNodeValue('MStartdraw'));	
		document.getElementById("pluginPrivacymasks").eventWebToPlugin("shiled","stop");
	}
}
//清空绘制视频遮蔽
function ClearAllpluginPrivacymasks(){
	document.getElementById("pluginPrivacymasks").eventWebToPlugin("shiled","clear");
};

//获取视频遮蔽
function Getprivacymasks(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/shield"
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
		  //console.log(v_szprivacymasks)
		   $("#shieldstr").attr("name","MStartdraw").val(getNodeValue('MStartdraw'));
		   
		   if (m_PreviewOCX!=null)
			{
				document.getElementById("pluginPrivacymasks").eventWebToPlugin("shiled","setparam",Docxml);  //获取的xml设置给插件
			}
		   $(xmlDoc).find("allcolor").each(function(i){ 
		  	 	var k_allcolorxml= $(this).text();
				$("#shieldcolortype").empty(); 
				 var k_allcoloropts = $(this).attr('opt').split(",");
				insertOptions2Select(k_allcoloropts, ["gray", "red","black", "yellow", "blue", "orange", "green", "transparent", "half-transparent", "mosaic","white"], ["optgray", "optred", "optblack", "optyellow", "optblue", "optorange", "optgreen", "opttransparent", "opthalf-transparent", "optmosaic","optwhite"], "shieldcolortype");
				setValueDelayIE6("shieldcolortype" ,"","",k_allcolorxml);
			}); 
		  
		  $(xmlDoc).find("enabled").each(function(i,data) {
				k_shieldenabled= $(this).text();  
				if (k_shieldenabled=="true"){
					$("#checkprivacymasks").val(true);
					$("#checkprivacymasks").prop("checked", true);
					$("#shieldstr").prop("disabled", false);
					$("#shieldclear").prop("disabled", false);
					$("#shieldcolortype").prop("disabled", false);
				}else{
					$("#checkprivacymasks").val(false);
					$("#checkprivacymasks").prop("checked", false);
					$("#shieldstr").prop("disabled" ,true)
					$("#shieldclear").prop("disabled", true);
					$("#shieldcolortype").prop("disabled", true);
				};
			});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//保存视频遮蔽
function SaveConfigprivacymasks(obj){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;  //安装插件	
		$("#SetResultTipsprivacymasks").html(szRetInfo);
		setTimeout(function(){$("#SetResultTipsprivacymasks").html("");},5000);  //5秒后自动清除
		return;
	}
    var ret =	document.getElementById("pluginPrivacymasks").eventWebToPlugin("shiled","save"); 
	if (ret.substring(0,5)=="false"){
		return;
	}
	var enable=$("#checkprivacymasks").val();
	var codelevel=$("#codelevel").val();
	var szXml = "<shieldinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<enabled>"+enable+"</enabled>";
	szXml += "<allcolor>"+$("#shieldcolortype").val()+"</allcolor>";
  	szXml += ret;
 	szXml += "</shieldinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/1/shield"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},complete:function(xhr, textStatus)
		{
			SaveStateTips(xhr,obj);
			Getprivacymasks();
		}
	});
}



/*
  高级性能
*/
function mtcf() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(mtcf);
pr(mtcf).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["aadcap", "Mtcf"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initAdcap();
	//setTimeout(function() {initVideoSetting() },  10);//防止获取视频能力集及xml未完全获取
	autoResizeIframe();
}

/*************************************************
Function:		initVideoSetting
Description:	初始化视频配置页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initAdcap()
{
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
				 if($(xmlDoc).find("mode").length > 0)
				 {
					$(xmlDoc).find("mode").each(function(i){ 
					   var g_enable = $(this).attr('enable');
					   if (g_enable=="true")
					   {
							$("#submodechange").show();
							 g_modetext= $(this).text();
							$("#portmapmodeType").empty(); 
							 var g_modes = $(this).attr('opt').split(",");
							insertOptions2Select(g_modes, ["hdr","fps60","stream4","4k","div4","normal","hdsdi"], ["Mhdr","Mfps60","Mstream4","M4K","Mdiv4","Mnormal","Mhdsdi"], "modechange");
							setValueDelayIE6("modechange" ,"","",g_modetext);
							 if(g_modetext=="hdsdi")
							  {
								  $("#subnormaltext").hide();
								  $("#subhdsditext").show();
							  }
							  else
							  {
								  $("#subnormaltext").hide();
								  $("#subhdsditext").hide();
							  }
					   }
					   else
					   {
							$("#submodechange").hide();
					   }
					}); 
				 }
				
			if($(xmlDoc).find("aac").length > 0)
			{
				$(xmlDoc).find("aac").each(function(i)
				 {
					var g_enable = $(this).attr('enable');
					if (g_enable=="true")
					{
						$("#subaac").show();
						$("#subacctext").show();
						g_aactext=$(this).text();
						if (g_aactext=="autolow")
						{
							$("input[name='mtcf'][value='autolow']").attr("checked",true);
						}
						else if(g_aactext=="normal")
						{
							$("input[name='mtcf'][value='normal']").attr("checked",true);
						}
						else
						{
							$("input[name='mtcf'][value='low']").attr("checked",true);
						}
					}
					else
					{
						$("#subaac").hide();
						$("#subacctext").hide();
					}
				 });
			}
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
//选择工作模式
function modechange(obj){
  if($(obj).val()=="hdsdi")
  {
	  $("#subnormaltext").hide();
	  $("#subhdsditext").show();
  }
  else
  {
	  $("#subnormaltext").hide();
	  $("#subhdsditext").hide();
  }
};




function Savemtcf(obj){
	var adcapmode=$("input[name='mtcf']:checked").val();
	var modechange=$("#modechange").val();
	if (g_modetext!=false)
	{
		if (g_modetext!=modechange)
		{
			if (confirm(m_szAsk))
			{
				SetSavemtcf();
			}
		}
		else
		{
			SetSavemtcf();
		}
	}
	else
	{
		if (g_aactext!=false)
		{
			SetSavemtcf();
		}
	}
	
};

function SetSavemtcf(obj){
	var adcapmode=$("input[name='mtcf']:checked").val();
	var modechange=$("#modechange").val();
	var szXml = "<mtcfinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	if (g_modetext!=false)
	{
		szXml += "<mode>"+modechange+"</mode>";
	}
	if (g_aactext!=false)
	{
		szXml += "<aac>"+adcapmode+"</aac>";
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
				$("#SetResultTipsmtcf").html(szRetInfo);
				setTimeout(function(){$("#SetResultTipsmtcf").html("");},5000);  //5秒后自动清除
			});
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj);
		}
	});
};
//切换TAB清空插件窗口
function VideoPluginNull(){
   $("#mainplugincropping").html("");
   $("#plugincropping").html("");
   $("#mainpluginRoi").html(""); 
   $("#pluginRoi").html("");
   $("#mainpluginPrivacymasks").html("");
   $("#pluginPrivacymasks").html("");
};

function flickerwin(){
	//Getflicker();
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
				$("#videoAntiFlickerMode").empty(); 
				 var k_modeopts = $(this).attr('opt').split(",");
				insertOptions2Select(k_modeopts, ["50hz", "60hz", "auto"], ["mjs50hz", "mjs60hz", "mjsAntiFlickerModeauto"], "videoAntiFlickerMode");
				setValueDelayIE6("videoAntiFlickerMode" ,"","",$(this).text());
			});  
			
			
			$("#SetResultflashTips").html("");
			$("#divHelpTipsTable").modal(
				{
					"close":false,
					"autoResize":true,
					"position":[60]  
				 }
			   );
			$("#simplemodal-container").height("auto");
			           
                   
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
	
	
	
	
};
