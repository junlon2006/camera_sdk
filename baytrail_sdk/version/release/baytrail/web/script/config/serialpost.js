//system.xml
var SerialPost = {
	tabs: null   // t
};
/*************************************************
*************************************************/
function RS485() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(RS485);
pr(RS485).update = function() {
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["system", "Serial"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initRS485();
	autoResizeIframe();
}
/*************************************************
Function:		initRS485
Description:	初始化串口
Input:			无			
Output:			无
return:			无				
*************************************************/
function initRS485()
{
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/rs"
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
			//var RsModeType=$(xmlDoc).find('mode').eq(0).text()
			$(xmlDoc).find("mode").each(function(i){ 
			 var k_modeopt=$(this).attr('opt');
		  	 var k_szmodexml= $(this).text();
			  
			  $("#RsModeType").empty();
				var arr = k_modeopt.split(","); 
				for (i=0;i<arr.length;i++){
				  $("#RsModeType").append("<option   value="+arr[i]+">"+"RS"+arr[i]+"</option>");
					var selectCode=document.getElementById("RsModeType"); 
					if(selectCode.options[i].value==k_szmodexml){  
						selectCode.options[i].selected=true;  
					 } 
				};
			  
			  
			}); 
			
		     
			 $(xmlDoc).find("baudrate").each(function(i){ 
			 var baudrateopt=$(this).attr('opt');	
		  	 var g_szbaudrate= $(this).text();
			 $("#baudrateType").empty();
				var arrbaudrate = baudrateopt.split(","); 
				for (var i=0;i<arrbaudrate.length;i++){
			   $("#baudrateType").append( "<option value="+arrbaudrate[i]+">"+arrbaudrate[i]+"</option>")
					var selectCode=document.getElementById("baudrateType"); 
					if(selectCode.options[i].value==g_szbaudrate){  
						selectCode.options[i].selected=true;  
					 } 
				};
			});
			
				
			$(xmlDoc).find("databit").each(function(i){ 
			 databitopt=$(this).attr('opt');	
		  	  g_szdatabit= $(this).text();
			});
			$("#databitType").empty();
				var arrdatabi = databitopt.split(","); 
				for (var i=0;i<arrdatabi.length;i++){
			   $("#databitType").append( "<option value="+arrdatabi[i]+">"+arrdatabi[i]+"</option>")
					var selectCode=document.getElementById("databitType"); 
					if(selectCode.options[i].value==g_szdatabit){  
						selectCode.options[i].selected=true;  
					 } 
				};
				
				
		   $(xmlDoc).find("stopbit").each(function(i){ 
			 stopbittopt=$(this).attr('opt');	
		  	  g_szstopbit= $(this).text();
			});
			$("#stopbitType").empty();
				var arrstopbit = stopbittopt.split(","); 
				for (var i=0;i<arrstopbit.length;i++){
			   $("#stopbitType").append( "<option value="+arrstopbit[i]+">"+arrstopbit[i]+"</option>")
					var selectCode=document.getElementById("stopbitType"); 
					if(selectCode.options[i].value==g_szstopbit){  
						selectCode.options[i].selected=true;  
					 } 
				};
			//$("#domainName").val($(xmlDoc).find('addressnum').eq(0).text() )//设备域名
			
			
		
			
			$(xmlDoc).find("paritybit").each(function(i){ 
		     	var paritybitopt1=$(this).attr('opt');
		  	 	var g_szparitybit= $(this).text();
				$("#paritybitType").empty(); 
				 var paritybitopts = paritybitopt1.split(",");
				insertOptions2Select(paritybitopts, ["none", "even", "odd"], ["Manone", "Maeven", "Maodd"], "paritybitType");
				setValueDelayIE6("paritybitType" ,"","",g_szparitybit);
			});
			
			$(xmlDoc).find("streamcontrol").each(function(i){ 
		     	var streamcontrolopt1=$(this).attr('opt');
		  	 	var g_szstreamcontrol= $(this).text();
				$("#streamcontrolType").empty(); 
				 var streamcontrolopts = streamcontrolopt1.split(",");
				insertOptions2Select(streamcontrolopts, ["none", "hardctrl", "softctrl"], ["Manone", "Mahardctrl", "Masoftctrl"], "streamcontrolType");
				setValueDelayIE6("streamcontrolType" ,"","",g_szstreamcontrol);
			}); 
			
			
			$(xmlDoc).find("addressnum").each(function(i){ 
		     	 addressnumopt1=$(this).attr('enable');
		  	 	var g_addressnum= $(this).text();
				if (addressnumopt1=="false"){
					$("#addressnum").hide()
			   }else{
				   $("#addressnum").show();
				   // $("#addressnum").val(g_addressnum)
				  
				  
					addressnumvaluemin=$(this).attr('min');
					addressnumvaluemax=$(this).attr('max');
					$("#addressnum").val($(this).text()).attr('maxlength',addressnumvaluemax.length); 
					$("#fixedaddressnumTips").html(addressnumvaluemin+"~"+addressnumvaluemax)
				  }
				
			});
			 
			 
			 
			 
			 $(xmlDoc).find("controlprotocol").each(function(i){ 
			  var controlprotocolopt=$(this).attr('opt');
			    controlprotocolenable=$(this).attr('enable');
			  	if(controlprotocolenable=="false"){
					$("#controlprotocol").hide()
				}else{
					$("#controlprotocol").show();
					 var g_szcontrolprotocol = $(this).text();
				  $("#controlprotocol").empty();
					var controlprotocolarr = controlprotocolopt.split(","); 
					for (var i=0;i<controlprotocolarr.length;i++){
				   $("#controlprotocol").append( "<option value="+controlprotocolarr[i]+">"+controlprotocolarr[i]+"</option>")
						var selectCode=document.getElementById("controlprotocol"); 
						if(selectCode.options[i].value==g_szcontrolprotocol){  
							selectCode.options[i].selected=true;  
						 } 
					};
				}
		  	 
			});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

function ChangeRsModeType(){
	initRS485();
};


//保存串口
function SaveRS485(obj){
	var RsModeType=$("#RsModeType").val();
	var codelevel=$("#codelevel").val();
	var szXml = "<rsinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<mode>"+RsModeType+"</mode>";
		szXml += "<baudrate>"+$("#baudrateType").val()+"</baudrate>";
		szXml += "<databit>"+$("#databitType").val()+"</databit>";
		szXml += "<stopbit>"+$("#stopbitType").val()+"</stopbit>";
		szXml += "<paritybit>"+$("#paritybitType").val()+"</paritybit>";
		szXml += "<streamcontrol>"+$("#streamcontrolType").val()+"</streamcontrol>";
		if(addressnumopt1=="true"){
			var addressnum=$("#addressnum").val();
			if(!CheackServerIDIntNum(addressnum,'addressnumTips','jsaddressnum',Number(addressnumvaluemin),Number(addressnumvaluemax)))
			{
				return;
			}
			szXml += "<addressnum>"+addressnum+"</addressnum>";
		}
		if(controlprotocolenable=="true"){
			szXml += "<controlprotocol>"+$("#controlprotocol").val()+"</controlprotocol>";
		}
 		szXml += "</rsinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/rs"
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
		}
	});
}

function RS232() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(RS232);
pr(RS232).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["OsdSet", "OsdSetMain"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initRS232();
}
/*************************************************
Function:		initRS232
Description:	初始化日志页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initRS232()
{
	autoResizeIframe();
}
