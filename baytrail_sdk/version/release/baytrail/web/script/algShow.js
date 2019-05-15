var UserNameLogin=$.cookie('UserNameLogin');   //
var UserPassLogin=$.cookie('UserPassLogin');   //
var m_viewaudio= null;
/*************************************************
Function:       Load_algViewer
Description:    初始化智能展示界面
Input:          无
Output:         无
return:         无
*************************************************/
function Load_algViewer(){
 
 window.parent.ChangeMenu(5);
 ChangeLanguage(parent.translator.szCurLanguage);
 
 if(document.all)
 {
    document.getElementById("mianAlgplugin").innerHTML ='<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="plugin0" width="100%" height="100%" ></object>';
}
 else
 {
    document.getElementById("mianAlgplugin").innerHTML = '<embed type="application/x-ipcwebui" id = "plugin0" width="100%" height="100%"></embed>';
}
 StartRealPlay();
}

/*************************************************
Function:       StartRealPlay
Description:    开始预览
Output:         无
return:         无
*************************************************/
function StartRealPlay() {
	Plugin();
    var videoid="1";  //视频源ID
	var chnid = "1";
	//setTimeout("",1000);
	if(Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject)
	 {
	   setTimeout(function(){
			document.getElementById("plugin0").creatFrameAss1("assframe1");
			m_viewaudio="both";
			//var ret=document.getElementById("plugin0").eventWebToPluginAss1("view", "start", camera_hostname,camera_port.toString(),videoid,chnid,$.cookie('authenticationinfo'),$.cookie('UserNameLogin'),$.cookie('UserPassLogin'),m_viewaudio);
			var ret=document.getElementById("plugin0").eventWebToPlugin("view", "start", camera_hostname,camera_port.toString(),videoid,chnid,$.cookie('authenticationinfo'),$.cookie('UserNameLogin'),$.cookie('UserPassLogin'),m_viewaudio);
		}, 100);
	 }
	 else
	 {
		    setTimeout(function(){
			document.getElementById("plugin0").creatFrameAss1("assframe1");
			document.getElementById("plugin0").getPluginVersion()
			m_viewaudio="both";
			//var ret=document.getElementById("plugin0").eventWebToPluginAss1("view", "start", camera_hostname,camera_port.toString(),videoid,chnid,$.cookie('authenticationinfo'),$.cookie('UserNameLogin'),$.cookie('UserPassLogin'),m_viewaudio);
			var ret=document.getElementById("plugin0").eventWebToPlugin("view", "start", camera_hostname,camera_port.toString(),videoid,chnid,$.cookie('authenticationinfo'),$.cookie('UserNameLogin'),$.cookie('UserPassLogin'),m_viewaudio);
		}, 100);
	 }
	
	
	
	
}