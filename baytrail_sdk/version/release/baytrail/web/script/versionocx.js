/*****************************************************
FileName: versionocx.js
Description: 插件管理类
*****************************************************/
var Version="7.1.2.249607";
var WebDate="2015-06-01";
var m_PreviewOCX=null;
top.document.getElementById("WebVersion").innerHTML = WebDate;
top.document.getElementById("WebVersion1").innerHTML = WebDate;
function Plugin(){
	if(document.all){
		 try { var comActiveX = new ActiveXObject("v7.ipcwebui"); 
		  // alert("插件已安装")
		    $.cookie('versionocx',0);
			m_PreviewOCX=0;
			if($.cookie('VersionSession')!=0){  
					  if (top.document.getElementById("IpcCtrl").getPluginVersion()<Version+"("+WebDate+")"){
					    var r=confirm(getNodeValue('jsUpdatePlugin'));
						if (r==true)
						{
							location.href='../IPCWebSetup.exe';
						}
						else
						{
							$.cookie('VersionSession',0);
					   }
				    }
					/*else if(top.document.getElementById("IpcCtrl").getPluginVersion()>Version+"("+WebDate+")")
					{
						 var r=confirm(getNodeValue('jsPluginNotcompatible'));
							if (r==true)
							{
								location.href='../IPCWebSetup.exe';
							}
							else
							{
								$.cookie('VersionSession',0);
						   }
					}*/
			};
		 }
		catch(e) { 
		   //alert("插件未安装")
		    $("#mainplugin").html("<div class='plagndiv'><A href='javascript:void(0)' onclick='openWin(this)' class='mycls' onfocus='blur()'>"+"<label name='MPlugin'>"+getNodeValue("MPlugin")+"</label>"+"</a></div>")			
  		return false;
		}
	}else{
	   num = navigator.plugins.length;
   // alert("现共有"+num+"个插件");   //获取所有插件数
   // mime = "application/npipcmonitor"
    mime = "application/x-ipcwebui"
	 if(navigator.mimeTypes && navigator.mimeTypes[mime] &&   navigator.mimeTypes[mime].enabledPlugin) {
		$.cookie('versionocx',0);
		m_PreviewOCX=0;
		if($.cookie('VersionSession')!=0){  
		
				if (top.document.getElementById("IpcCtrl").getPluginVersion()<Version+"("+WebDate+")"){
				var r=confirm(getNodeValue('jsUpdatePlugin'));
					if (r==true)
					{
						location.href='../IPCWebSetup.exe';
					}
					else
					{
						$.cookie('VersionSession',0);
				   }
			 }
			 /* else if(top.document.getElementById("IpcCtrl").getPluginVersion()>Version+"("+WebDate+")")
				{
					 var r=confirm(getNodeValue('jsPluginNotcompatible'));
						if (r==true)
						{
							location.href='../IPCWebSetup.exe';
						}
						else
						{
							$.cookie('VersionSession',0);
					   }
				}*/
		  };
		}
		else{
			$("#mainplugin").html("<div class='plagndiv'><A href='javascript:void(0)' onclick='openWin(this)' class='mycls' onfocus='blur()'>"+"<label name='MPlugin'>"+getNodeValue("MPlugin")+"</label>"+"</a></div>")
		}
	}
}
//调用下载文件
function openWin(obj)
 {
	 obj.target="_self";
	 obj.href = "../IPCWebSetup.exe"
	 obj.click();
 }




