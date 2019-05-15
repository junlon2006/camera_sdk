
/*************************************************
  Function:    	CheckTypeA A类校验
  Description:	检测只能输入用户名,提示只能输入数字英文和"-、_、@、."
*************************************************/
//strInfo,tipsId,szName,iNull
function CheckUserName(strName, tipid,szName,iNull)
{
	 var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	 setTimeout(function(){$("#" + tipid).html("");},5000);  //5秒后自动清除
	 if (strName==""){
			//szAreaNameInfo += "用户名不能为空";
			szAreaNameInfo += getNodeValue(szName) + getNodeValue("NullTips");
			$("#" + tipid).html(szAreaNameInfo);    
      		return false;
		}
	 
	 if(!strName) return false;
	 
	/* var strName1 = strName.substr(0, 1);
	 var strP=/^[0-9-_@.]$/; 			
	 if(strP.test(strName1))
	 {
		 if(tipid)
         { 
			szAreaNameInfo += getNodeValue(szName) + getNodeValue("UserNumTips");
			$("#" + tipid).html(szAreaNameInfo); 
			return false;
         }
		// return false;
	 }*/
	 
	// var strP1=/^[a-zA-Z0-9-_@.]$/; 
	 var strP1=/^[a-zA-Z0-9-_@.]{1,}$/; 	
	 if(!strP1.test(strName))
	 {
		 if(tipid)
         {
			szAreaNameInfo += getNodeValue(szName) + getNodeValue("UserTips");
			$("#" + tipid).html(szAreaNameInfo); 
			return false;
         }
		// return false;
	 }
	 
	 
	 
	 $("#" + tipid).html("");    
	 return true;
}
/*************************************************
  Function:    	CheckTypeA 
  Description:	A类校验,提示只能输入数字英文和"-、_、@、."
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
				szName:名称
				iMin最小值
				iMax最大值
				iNull:是否可以为空 0不能为空
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckTypeA(strName, tipid,szName,iMin,iMax,iNull){
	 var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	 setTimeout(function(){$("#" + tipid).html("");},5000);  //5秒后自动清除
	if(iNull == 0)
	{
		if($.isEmpty(strName))//为空时提示     
		{
			szAreaNameInfo += getNodeValue("NullTips");
			$("#" + tipid).html(szAreaNameInfo);    
			return false;
		}
	}
	 var strP1=/^[a-zA-Z0-9-_@.]{1,}$/; 	
	 if(!strP1.test(strName))
	 {
		 if(tipid)
         {
			szAreaNameInfo +=  getNodeValue("UserTips");
			$("#" + tipid).html(szAreaNameInfo); 
			return false;
         }
	 }
	 $("#" + tipid).html("");    
	 return true;
};

/*************************************************
  Function:    	CheckTypeB 
  Description:	B类校验密码类,提示只能输入数字英文和"-_@.,#$*~!"
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
				szName:名称
				iMin最小值
				iMax最大值
				iNull:是否可以为空 0不能为空
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckTypeB(strName, tipid,szName,iMin,iMax,iNull){
	 var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	 setTimeout(function(){$("#" + tipid).html("");},5000);  //5秒后自动清除
	if(iNull == 0)
	{
		if($.isEmpty(strName))//为空时提示     
		{
			szAreaNameInfo += getNodeValue("NullTips");
			$("#" + tipid).html(szAreaNameInfo);    
			return false;
		}
	}
	 var strP=/^[A-Za-z0-9-_@.,#$*~!]+$/;  	
	 if(!strP.test(strName))
	 {
		 if(tipid)
         {
			szAreaNameInfo +=  getNodeValue("UserTips")+",#$*~!";;
			$("#" + tipid).html(szAreaNameInfo); 
			return false;
         }
	 }
	 $("#" + tipid).html("");    
	 return true;
};

/*************************************************
  Function:    	CheckTypeC 
  Description:	C类校验密码类,除' & < > / % \\ " 空格 外其余都可输入
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
				szName:名称
				iMin最小值
				iMax最大值
				iNull:是否可以为空 0不能为空
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckTypeC(strName, tipid,szName,iMin,iMax,iNull){
	 var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	 setTimeout(function(){$("#" + tipid).html("");},5000);  //5秒后自动清除
	if(iNull == 0)
	{
		if($.isEmpty(strName))//为空时提示     
		{
			szAreaNameInfo += getNodeValue("NullTips");
			$("#" + tipid).html(szAreaNameInfo);    
			return false;
		}
	}
	var forbidChar = new Array("'","&","<",">", "/", "%","\\",'"'," "); //包含特殊字符时提示
	for(var i = 0;i < forbidChar.length ; i++)
	{ 
  		if(strName.indexOf(forbidChar[i]) >= 0)
		{ 
			szAreaNameInfo += getNodeValue("DevNameWrongCharTips") + " ' & < > / % \\ &quot; " + getNodeValue("DevSpace");
			$("#" + tipid).html(szAreaNameInfo);    
      		return false;
	  	} 
	} 
	if(strName.length > iMax)
	{
		szAreaNameInfo += getNodeValue("DevNameLengthTips") + iMax;
		$("#" + tipid).html(szAreaNameInfo);    
		return false;
	}
	$("#" + tipid).html("");    
	return true;
};

/*************************************************
  Function:    	CheckTypeD 
  Description:	D类校验密码类,入网ID,仅英文,数字
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
				szName:名称
				iMax最大值
				iNull:是否可以为空 0不能为空
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckTypeD(strName, tipid,szName,iMax,iNull){
	 var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	 setTimeout(function(){$("#" + tipid).html("");},5000);  //5秒后自动清除
	if(iNull == 0)
	{
		if($.isEmpty(strName))//为空时提示     
		{
			szAreaNameInfo += getNodeValue("NullTips");
			$("#" + tipid).html(szAreaNameInfo);    
			return false;
		}
	}
	var re  = /^[a-zA-Z0-9]{1,}$/; 	
	if (!strName.match(re))
    {
		szAreaNameInfo += getNodeValue("CheckLetterNumber");
		$("#" + tipid).html(szAreaNameInfo); 
		return false;
    }
	if(strName.length > iMax)
	{
		szAreaNameInfo += getNodeValue(szName) + getNodeValue("UserNameLengthTips") +iMax;
		$("#" + tipid).html(szAreaNameInfo);    
		return false;
	}
	$("#" + tipid).html("");   
	return true;
};

/*************************************************
  Function:    	CheckTypePort 
  Description:	端口校验类
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
				szName:名称
				iMax最小值
				iMax最大值
				iNull:是否可以为空 0不能为空
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckTypePort(strName, tipid,szName,iMin,iMax,iNull){
	 var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	 setTimeout(function(){$("#" + tipid).html("");},5000);  //5秒后自动清除
	if($.isEmpty(strName))//为空时提示     
		{
			szAreaNameInfo += getNodeValue("NullTips");
			$("#" + tipid).html(szAreaNameInfo);    
			return false;
		}
	if($.isCosinaIntNum(strName,iMin,iMax) == false)
	{
		/*if(!iNull)
		{
		    iNull = "";	
		}*/
		szAreaNameInfo += m_szError13;//参数错误
		$("#" + tipid).html(szAreaNameInfo); 
		return false;
	}
	$("#" + tipid).html(""); 
	return true;
};


/*************************************************
  Function:    	IsURL
  Description:	域名校验
*************************************************/
function IsURL(strName, tipid,szName,iNull){
      //  + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
	 var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	 setTimeout(function(){$("#" + tipid).html("");},5000);  //5秒后自动清除
	 if (strName=="")
	 {
		 szAreaNameInfo +=  getNodeValue("NullTips");
		$("#" + tipid).html(szAreaNameInfo); 
		return false;   
	}
	 if(!strName) return false;
	 if($.lengthw(strName) > 64)
	{
		szAreaNameInfo += getNodeValue("DevNameLengthTips")+iNull;
		$("#" + tipid).html(szAreaNameInfo);    
		return false;
	}
	
	 var strP = /^((https|http|ftp|rtsp|mms)?:\/\/)?([\w\-]+\.)+([a-z]+)(:\d{1,5})?(\/[a-z0-9]*)?(\/[a-z0-9]*)?(\/[a-z0-9]*)?(\/[a-z0-9]*)?(\/[a-z0-9]*)?$/i;  //正确
	 if(!strP.test(strName))
	 {
		 if(tipid)
         {
		    //szAreaNameInfo += m_szError99;  //域名错误
			szAreaNameInfo += m_szError13;  //参数错误
			$("#" + tipid).html(szAreaNameInfo); 
			return false;
         }
	 }
   $("#" + tipid).html("");    
	
	 return true;
}
/*************************************************
  Function:    	IsURL
  Description:	IP或域名都可以输入
*************************************************/
function IsURLIP(strName, tipid,szName,iNull){
	 var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	 setTimeout(function(){$("#" + tipid).html("");},5000);  //5秒后自动清除
	 if (strName=="")
	 {
		 szAreaNameInfo +=  getNodeValue("NullTips");
		$("#" + tipid).html(szAreaNameInfo); 
		return false;   
	}
	
	var strP= /^([\w-]+\.)+((com)|(cn)|(net)|(org)|(gov)|(me)|(biz)|(name)|(info)|(cc)|(tv)|(com\.cn)|(org\.cn)|(net\.cn)|(gov\.cn)|(me\.uk)|(org\.uk)|(ltd\.uk)|(plc\.uk)|(eu)|(it))$/;
	if ($.isIpAddress(strName) ||  strP.test(strName) )
	{
	}
	else
	{
		if(tipid)
         {
		    szAreaNameInfo += m_szError13;  //参数错误
			$("#" + tipid).html(szAreaNameInfo); 
			return false;
         }	
	}
	
   $("#" + tipid).html("");    
	
	 return true;
}


/*************************************************
  Function:    	isPassword
  Description:	检测只能输入用户名,提示只能输入数字英文和"-_@.,#$*~!"
*************************************************/
function CheckUserPassword(strName, tipid,szName,iNull)
{
	 var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	 setTimeout(function(){$("#" + tipid).html("");},5000);  //5秒后自动清除
	 if (strName==""){
		 szAreaNameInfo += getNodeValue("MPasswordTips");  //请输入密码
		$("#" + tipid).html(szAreaNameInfo); 
		return false;   
		// setTimeout(function(){$("#" + tipid).html("");},5000);  //5秒后自动清
		// $("#" + tipid).html("密码不能为空");
		}
		
	 if(!strName) return false;
	 //  英文和数字和"-"、"_""@"
	 var strP=/^[A-Za-z0-9-_@.,#$*~!]+$/;  
	 if(!strP.test(strName))
	 {
		 if(tipid)
         {
		   // szAreaNameInfo += "密码只能输入英文数字和-_@.,#$*~!";
		   szAreaNameInfo += getNodeValue("UserTips")+",#$*~!";
		   $("#" + tipid).html(szAreaNameInfo); 
		   return false;
			// setTimeout(function(){$("#" + tipid).html("");},5000);  //5秒后自动清
		    // $("#" + tipid).html("只能输入英文数字和-_@.,#$*~!");
         }
		// return false;
	 }
   $("#" + tipid).html("");    
	
	 return true;
}


/*************************************************
  Function:    	CheckPassword
  Description:	密码检测对象
*************************************************/
var oCheckPassword = new CheckPassword();
function CheckPassword()
{
    this.m_szDefaultPassword = "\177\177\177\177\177\177";
	this.m_szUserNmaeTag = "";
	this.checkUserName = function(szUserName, objPassword, objPasswordConfirm)
	{
		this.m_szUserNmaeTag = szUserName;
		if(szUserName == "")
		{
			objPassword.val("");
			objPasswordConfirm.val("");
		}
		else
		{
			objPassword.val(this.m_szDefaultPassword);
			objPasswordConfirm.val(this.m_szDefaultPassword);
		}
	}
	this.focusPassword = function(objPassword, objPasswordConfirm)
	{
		if(this.m_szUserNmaeTag != "")
		{
			if(objPassword.val() != "" && objPasswordConfirm.val() != "")
	        {
				objPassword.val("");
		        objPasswordConfirm.val("");
	        }
		}
	}
    this.blurPassword = function(objUserName, objPassword, objPasswordConfirm)
    {
		if(this.m_szUserNmaeTag != "")
		{
		    if(objPassword.val() == "" && objPasswordConfirm.val() == "")
	        {
				if(this.m_szUserNmaeTag == objUserName.val())
				{
					objPassword.val(this.m_szDefaultPassword);
					objPasswordConfirm.val(this.m_szDefaultPassword);
				}
	        }
		}
    }
}
<!--设备基本信息表单验证-->
/*************************************************
  Function:    	CheckDeviceNameSnmp
  Description:	检查设备名称是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
				szName:名称
				iMin最小值
				iMax最大值
				iNull:是否可以为空 0不能为空
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckDeviceNameSnmp(strInfo,tipsId,szName,iMin,iMax,iNull){
   var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(iNull == 0)
	{
		if($.isEmpty(strInfo))//为空时提示     
		{
			szAreaNameInfo += getNodeValue("NullTips");;
			$("#" + tipsId).html(szAreaNameInfo);    
			return false;
		}
	}
	var forbidChar = new Array("'","&","<",">", "/", "%","\\",'"'," "); //包含特殊字符时提示
	for(var i = 0;i < forbidChar.length ; i++)
	{ 
  		if(strInfo.indexOf(forbidChar[i]) >= 0)
		{ 
			szAreaNameInfo += getNodeValue("DevNameWrongCharTips") + " ' & < > / % \\ &quot; " + getNodeValue("DevSpace");
			$("#" + tipsId).html(szAreaNameInfo);    
      		return false;
	  	} 
	} 
	if($.lengthw(strInfo) > iMax)
	{
		szAreaNameInfo += getNodeValue("DevNameLengthTips") + iMax;
		$("#" + tipsId).html(szAreaNameInfo);    
		return false;
	}
	$("#" + tipsId).html("");    
	return true;
};
/*************************************************
  Function:    	CheckDeviceName
  Description:	检查设备名称是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
				iNull:是否可以为空
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckDeviceName(strInfo,tipsId,szName,iNull)
{
	
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(iNull == 0)
	{
		if($.isEmpty(strInfo))//为空时提示     
		{
			szAreaNameInfo += getNodeValue("NullTips");;
			$("#" + tipsId).html(szAreaNameInfo);    
			return false;
		}
	}
	var forbidChar = new Array("'","&","<",">", "/", "%","\\",'"'," "); //包含特殊字符时提示
	for(var i = 0;i < forbidChar.length ; i++)
	{ 
  		if(strInfo.indexOf(forbidChar[i]) >= 0)
		{ 
			szAreaNameInfo += getNodeValue("DevNameWrongCharTips") + " ' & < > / % \\ &quot; " + getNodeValue("DevSpace");
			$("#" + tipsId).html(szAreaNameInfo);    
      		return false;
	  	} 
	} 
	if($.lengthw(strInfo) > 64)
	{
		szAreaNameInfo += getNodeValue("DevNameLengthTips");
		$("#" + tipsId).html(szAreaNameInfo);    
		return false;
	}
	$("#" + tipsId).html("");    
	return true;
}


function checkDeviceNameValidity(szInfo, szTipsId, iNull)
{
		var szAreaNameInfo = "<img src='../images/config/tips.png'  class='imgmiddle'>&nbsp;";
		setTimeout(function(){$("#" + szTipsId).html("");},5000);  //5秒后自动清除
		if(iNull == 0)
		{
			if($.isEmpty(szInfo))//为空时提示     
			{
				szAreaNameInfo += getNodeValue("DevNameNullTips");
				$("#" + szTipsId).html(szAreaNameInfo);    
				return false;
			}
		}
		//+ - ./
		if (/['+\-\.\/\"]/.test(szInfo))
		{ // 包含特殊字符时提示
			szAreaNameInfo += getNodeValue("DevNameWrongCharTips") + " + - . /"  + '"';
			$("#" + szTipsId).html(szAreaNameInfo);
			return false;
		}
		if ($.lengthw(szInfo) > 64)
		{
			szAreaNameInfo += getNodeValue("DevNameLengthTips");
			$("#" + szTipsId).html(szAreaNameInfo);
			return false;
		}
		$("#" + szTipsId).html("");
		return true;
	}


//可输入中英文特殊符号，允许为空
function checkDeviceNameNull(strInfo,tipsId,szName,iNull)
{
	
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	
	var forbidChar = new Array("'","&","<",">", "/", "%","\\",'"'," "); //包含特殊字符时提示
	for(var i = 0;i < forbidChar.length ; i++)
	{ 
  		if(strInfo.indexOf(forbidChar[i]) >= 0)
		{ 
			szAreaNameInfo += getNodeValue("DevNameWrongCharTips") + " ' & < > / % \\ " + '"';
			$("#" + tipsId).html(szAreaNameInfo);    
      		return false;
	  	} 
	} 
	
	if($.lengthw(strInfo) > 64)
	{
		szAreaNameInfo += getNodeValue("DevNameLengthTips");
		$("#" + tipsId).html(szAreaNameInfo);    
		return false;
	}
	$("#" + tipsId).html("");    
	return true;
}

//C类地址除去以下字符，其他都可以输入：' & < > / % \\ " 空格，允许为空
function CheckEditC(strInfo,tipsId,szName,iLen)
{
	
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	
	var forbidChar = new Array("'","&","<",">", "/", "%","\\",'"'," "); //包含特殊字符时提示
	for(var i = 0;i < forbidChar.length ; i++)
	{ 
  		if(strInfo.indexOf(forbidChar[i]) >= 0)
		{ 
			szAreaNameInfo += getNodeValue("DevNameWrongCharTips") + " ' & < > / % \\ " + '"';
			$("#" + tipsId).html(szAreaNameInfo);    
      		return false;
	  	} 
	} 
	if($.lengthw(strInfo) > iLen)
	{
		szAreaNameInfo += getNodeValue("DevNameLengthTips")+iLen;
		$("#" + tipsId).html(szAreaNameInfo);    
		return false;
	}
	$("#" + tipsId).html("");    
	return true;
}
/*************************************************
  Function:    	CheackServerIDIntNum
  Description:	//只能输入数字，允许为空
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
				iMin:最小数
				iMax:最大数
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheackIDIntNum(strInfo,tipsId,szName,iMin,iMax)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	//console.log("value"+strInfo+"  "+tipsId+"  "+szName+"    "+iMin+"    "+iMax)
	
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("NullTips"); 
		$("#" + tipsId).html(szTipsInfo); 
		
		return false;
	}	
	
	if ($.lengthw(strInfo) > iMax)
		{
			szTipsInfo += getNodeValue("DevNameLengthTips") + iMax;
			$("#" + tipsId).html(szTipsInfo);
			return false;
		}
	var strP=/^^[0-9]*$/; 
	//"^[0-9]*$"。 
	//if(strP(strInfo) == false)
	if(!strP.test(strInfo))
	{
		szTipsInfo += getNodeValue("Mnumbers"); //只能输入数字
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	
	$("#" + tipsId).html(""); 
	return true;
}

/*************************************************
  Function:    	CheackOnlyNum
  Description:	//只能输入数字，允许为空
  
*************************************************/
function CheackOnlyNum(strInfo)
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


/*************************************************
Function:    	CheackIDIntNumgb
Description:	检查输入是否合法,只能输入数字和字母，
Input:          strInfo:传入的参数
			    tipsId:提示信息ID
				szName:名称
				iMin最小值
				iMax最大值
				iNull:是否可以为空 0不能为空
Output:      	无
Return:			bool:true false
*************************************************/
function CheackIDIntNumgb(strInfo,tipsId,szName,iMin,iMax,iNull)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(iNull == 0)
	{
		if($.isEmpty(strInfo))//为空时提示     
		{
			szTipsInfo += getNodeValue("NullTips");;
			$("#" + tipsId).html(szTipsInfo);    
			return false;
		}
	}
	
	var strP=/^[A-Za-z0-9]*$/; 
	if(!strP.test(strInfo))
	{
		szTipsInfo += getNodeValue(szName) + getNodeValue("CheckLetterNumber");  //只能包含字母和数字
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	if ($.lengthw(strInfo) > iMax)
	{
		szTipsInfo += getNodeValue("DevNameLengthTips") + iMax;
		$("#" + tipsId).html(szTipsInfo);
		return false;
	}
	
	$("#" + tipsId).html(""); 
	return true;
}


//只是设备名称
function checkDeviceNameValidiDevice(szInfo, szTipsId,szName, iNull)
{
		var szAreaNameInfo = "<img src='../images/config/tips.png'  class='imgmiddle'>&nbsp;";
		setTimeout(function(){$("#" + szTipsId).html("");},5000);  //5秒后自动清除
		if(szInfo=="")
		{
			//为空时提示     
			
				szAreaNameInfo += getNodeValue("NullTips");
				$("#" + szTipsId).html(szAreaNameInfo);    
				return false;
			
		}
		//+ - ./
		var forbidChar = new Array("'","&","<",">", "/", "%","\\",'"'," "); //包含特殊字符时提示
		for(var i = 0;i < forbidChar.length ; i++)
		{ 
			if(szInfo.indexOf(forbidChar[i]) >= 0)
			{ 
				szAreaNameInfo += getNodeValue("DevNameWrongCharTips") + " ' & < > / % \\ &quot; " + getNodeValue("DevSpace");
				$("#" + szTipsId).html(szAreaNameInfo);    
				return false;
			} 
		} 
		if ($.lengthw(szInfo) > iNull)
		{
			szAreaNameInfo += getNodeValue("DevNameLengthTips")+iNull;
			$("#" + szTipsId).html(szAreaNameInfo);
			return false;
		}
		$("#" + szTipsId).html("");
		return true;
	}


/*************************************************
  Function:    	CheackServerIDIntNum
  Description:	检查设备号是否合法
  Input:       
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheackServerIDIntNum(strInfo,tipsId,szName,iMin,iMax,Unit)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	//console.log("value"+strInfo+"  "+tipsId+"  "+szName+"    "+iMin+"    "+iMax+"    "+Unit)
	
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("NullTips");  //不能为空
		$("#" + tipsId).html(szTipsInfo); 
		
		return false;
	}	
	if($.isCosinaIntNum(strInfo,iMin,iMax) == false)
	{
		if(!Unit)
		{
		    Unit = "";	
		}
		//szTipsInfo += getNodeValue("RangeTips")+ iMin + "-" + iMax + " " + Unit;
		szTipsInfo += m_szError13;//参数错误
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}


/*************************************************
  Function:    	CheackServerIDIntNum
  Description:	检测输入是否正确,界面上没有范围
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
				iMin:最小数
				iMax:最大数
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheackIDNORange(strInfo,tipsId,szName,iMin,iMax,Unit)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	//console.log("value"+strInfo+"  "+tipsId+"  "+szName+"    "+iMin+"    "+iMax+"    "+Unit)
	
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("NullTips");  //不能为空
		$("#" + tipsId).html(szTipsInfo); 
		
		return false;
	}	
	if($.isCosinaIntNum(strInfo,iMin,iMax) == false)
	{
		if(!Unit)
		{
		    Unit = "";	
		}
		szTipsInfo += getNodeValue("RangeTips")+ iMin + "-" + iMax + " " + Unit;
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}



/*************************************************
  Function:    	CheackStringLenthPTZ
  Description:	PTZ定位合法性
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
				iLen:长度
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheackStringLenthPTZ(strInfo,tipsId,szName,iMin,iMax)
{
	//console.log(strInfo+"   "+tipsId+"   "+szName+"   "+iMin+"   "+iMax)
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("NullTips"); 
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	
	if(strInfo < iMin )
	{
		szTipsInfo += getNodeValue("RangeTips") + iMin + "~" +iMax;
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	
	
   if(strInfo > iMax )
	{
		szTipsInfo += getNodeValue("RangeTips") + iMin + "~" +iMax;
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}	
	
	//var usern =/^\-?([1-9]\d*|0)(\.[1-9]{1,5})?$/;
	//var usern=/^-?[0-9]*(\.\d*)?$|^-?0(\.\d*)?$/;
	var usern=/^[-]?[0-9]+(\.[0-9]+)?$/;
	if (!strInfo.match(usern))
    {
		//console.log("aa")
		szTipsInfo += getNodeValue("PTZCheckLetter");
		$("#" + tipsId).html(szTipsInfo); 
		return false;
    }
		
	$("#" + tipsId).html(""); 
	return true;
}



/*************************************************
  Function:    	CheackStringLenth
  Description:	检查设备号是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
				iLen:长度
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheackStringLenth(strInfo,tipsId,szName,iLen)
{
	
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo != "")
	{
		//console.log($.getStr(strInfo))
		if($.lengthw(strInfo) > iLen)
		{
			szTipsInfo += getNodeValue("LengthTips") + iLen;
			$("#" + tipsId).html(szTipsInfo); 
			return false;
		}
	}	
	$("#" + tipsId).html(""); 
	return true;
}
/*************************************************
  Function:    	CheackStringgetStr
  Description:	按字节获取
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
				iLen:长度
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheackStringgetStr(strInfo,tipsId,szName,iLen)
{
	//console.log(strInfo+"   "+tipsId+"   "+szName+"   "+iLen)
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		if($.isEmpty(strInfo))//为空时提示     
		{
			szTipsInfo += getNodeValue("NullTips");
			$("#" + tipsId).html(szTipsInfo);    
			return false;
		}
	}
	
	if(strInfo != "")
	{
		if($.lengthw(strInfo) > 32)
		{
			szTipsInfo += getNodeValue("LengthTips") + iLen;
			$("#" + tipsId).html(szTipsInfo); 
			//console.log("aa")
			return false;
		}
		
		/*if($.getStr(strInfo,8) > 8)
			{
				//strInfo = $.getStr(strInfo, 8);
				szTipsInfo += getNodeValue(szName) + getNodeValue("LengthTips") + iLen +"个字符";
				$("#" + tipsId).html(szTipsInfo); 
				//console.log("bb")
				return false;
			}
		*/
	}	
	$("#" + tipsId).html(""); 
	return true;
}
//只报警输入
/*************************************************
  Function:    	CheackStringgetinput
  Description:	按字节获取
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
				iLen:长度
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheackStringgetinput(strInfo,tipsId,szName,iLen)
{
	//console.log(strInfo+"   "+tipsId+"   "+szName+"   "+iLen)
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		if($.isEmpty(strInfo))//为空时提示     
		{
			szTipsInfo += getNodeValue("NullTips");
			$("#" + tipsId).html(szTipsInfo);    
			return false;
		}
	}
	
	if(strInfo != "")
	{
		if($.lengthw(strInfo) > 32)
		{
			szTipsInfo += getNodeValue("LengthTips") + iLen;
			$("#" + tipsId).html(szTipsInfo); 
			//console.log("aa")
			return false;
		}
		
		/*if($.getStr(strInfo,8) > 8)
			{
				//strInfo = $.getStr(strInfo, 8);
				szTipsInfo += getNodeValue(szName) + getNodeValue("LengthTips") + iLen +"个字符";
				$("#" + tipsId).html(szTipsInfo); 
				//console.log("bb")
				return false;
			}
		*/
	}	
	$("#" + tipsId).html(""); 
	return true;
}

/*************************************************
  Function:    	CheckIPadd
  Description:	检查设备号是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckIPadd(strInfo,tipsId,szName,iNull)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if (iNull == 0)    //为空时不判断
	{
		if(strInfo == "")
		{
			return true;
		}
		else
		{
			if($.isIpAddress(strInfo) == false)
			{
				szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
				$("#" + tipsId).html(szTipsInfo); 
				return false;
			}
		}	
	}
	else
	{
		if(strInfo == "")
		{
			szTipsInfo += getNodeValue("NullTips");
			$("#" + tipsId).html(szTipsInfo); 
			return false;
		}	
		if($.isIpAddress(strInfo) == false)
		{
			szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
			$("#" + tipsId).html(szTipsInfo); 
			return false;
		}
	}
	$("#" + tipsId).html(""); 
	return true;
}

/*************************************************
  Function:    	CheckIPFilter 0.0.0.0或224~225开头都错误,255.255.255.255也错误
  Description:	黑/白名单IP
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckIPFilter(strInfo,tipsId,szName,iNull)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("NullTips");
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}	
	//isIpAddress  isDIpAddress
	if ($.isIpAddress(strInfo) == false) {
		szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo);
		return false;
	}
	if ($.isDIpAddress(strInfo) == false) {
		szTipsInfo += getNodeValue("DIPAddInvalidTips");
		$("#" + tipsId).html(szTipsInfo);
		return false;
	}
	if($.ip_IPFilterdate(strInfo) == false)
	{
		szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}



/*************************************************
  Function:    	CheckIPaddErr  0.0.0.0或255.255.255.255也错误
  Description:	检查设备号是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckIPaddErr(strInfo,tipsId,szName)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("NullTips");
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}	
	if($.ip_validate(strInfo) == false)
	{
		szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}

/*************************************************
  Function:    	CheckIPaddErr  0.0.0.0或255.255.255.255也错误
  Description:	检查设备号是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckMaskaddErr(strInfo,tipsId,szName)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("NullTips");
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}	
	if($.ipmask_validate(strInfo) == false)
	{
		szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}


/*************************************************
 Function:        CheckDIPadd
 Description:    检查是否D类地址
 Input:        strInfo:传入的参数
 tipsId:提示信息
 szName:标题
 Output:          无
 Return:        bool:true false
 *************************************************/
function CheckDIPadd(strInfo, tipsId, szName) {
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function () {
		$("#" + tipsId).html("");
	}, 5000);  //5秒后自动清除
	if (strInfo == "") {
		szTipsInfo += getNodeValue("NullTips");
		$("#" + tipsId).html(szTipsInfo);
		return false;
	}
	if ($.isIpAddress(strInfo) == false) {
		szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo);
		return false;
	}
	if ($.isDIpAddress(strInfo) == false) {
		szTipsInfo += getNodeValue("DIPAddInvalidTips");
		$("#" + tipsId).html(szTipsInfo);
		return false;
	}
	$("#" + tipsId).html("");
	return true;
}
/*************************************************
  Function:    	CheckEmail
  Description:	检查Email地址是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckEmail(strInfo,tipsId,szName)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo != "")
	{
		if($.isEmail(strInfo) == false)
		{
			szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
			$("#" + tipsId).html(szTipsInfo); 
			return false;
		}
	}	
	
	$("#" + tipsId).html(""); 
	return true;
}

/*************************************************
Function:		CheckMacadd
Description:	验证Mac地址输入是否正确
Input:			iSetId: 需要验证的密码表单ID
				iSetValue：需要验证的表单的值
				tipsId:提示信息
Output:			无
return:			无				
*************************************************/
function CheckMacadd(iSetId,iSetValue,tipsId)
{
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	chkstr = iSetValue;
   	if(chkstr.length == 0)     
   	{
	  	document.getElementById(iSetId).value = "00:00:00:00:00:00";     
      	$("#" + tipsId).html(""); 
		return true;
    }
	var szTipsInfo = "<img src='../images/tips.png' class='imgmiddle'>&nbsp;";
    var pattern="/^([0-9A-Fa-f]{2})(-[0-9A-Fa-f]{2}){5}|([0-9A-Fa-f]{2})(:[0-9A-Fa-f]{2}){5}/";
    eval("var pattern=" + pattern);
    var add_p1 = pattern.test(chkstr);
    if(add_p1 == false)
    {
		szTipsInfo += getNodeValue("MacAddInvalidTips");
		$("#" + tipsId).html(szTipsInfo); 
		return false;
    }
	$("#" + tipsId).html(""); 
	return true;
}



/*************************************************
  Function:    	Checkfloat
  Description:	验证Checkfloat地址输入是否正确
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
				iMin:最小数
				iMax:最大数
  Output:      	无
  Return:		bool:true false
*************************************************/
function Checkfloat(strInfo,tipsId,szName,iMin,iMax,Unit)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	var re=/^(0{1,2}[1-9]|[1-2]\d{1,2})(.0[1-9]|.[1-9]\d){0,1}$/;
	//console.log(strInfo.replace(re,'$1'))
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("NullTips"); 
		$("#" + tipsId).html(szTipsInfo); 
		
		return false;
	}	
	//console.log("strInfo"+"  "+strInfo)
	
	if($.isCosinaIntNum(strInfo,iMin,iMax) == false)
	{
		if(!Unit)
		{
		    Unit = "";	
		}
		
		szTipsInfo += getNodeValue(szName) + getNodeValue("RangeTips") + iMin + "-" + iMax + " " + Unit;
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}





/*************************************************
  Function:    	CheckDevUserName
  Description:	检查设备登录名称是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
				iNull:是否可以为空
				szName:提示名词
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckDevUserName(strInfo,tipsId,szName,iNull)
{
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	if(iNull == 0)
	{
		if($.isEmpty(strInfo))//为空时提示     
		{
			szAreaNameInfo += getNodeValue("NullTips");
			$("#" + tipsId).html(szAreaNameInfo);    
			return false;
		}
	}
	var forbidChar = new Array("'",":","*","?","<",">","|", "/", "%","\\",'"', "\""); //包含特殊字符时提示
	for(var i = 0;i < forbidChar.length ; i++)
	{ 
  		if(strInfo.indexOf(forbidChar[i]) >= 0)
		{
			szAreaNameInfo += getNodeValue("DevNameWrongCharTips") + " / \\ : * ? ' \" < > | % ";
			$("#" + tipsId).html(szAreaNameInfo);    
      		return false;
	  	}
	} 
	if($.lengthw(strInfo) > 32)
	{
		szAreaNameInfo +=  getNodeValue("UserNameLengthTips");
		$("#" + tipsId).html(szAreaNameInfo);    
		return false;
	}
	$("#" + tipsId).html("");    
	return true;
}
/*************************************************
  Function:    	CheckCharName
  Description:	检查字符叠加字符串是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckCharName(strInfo,tipsId)
{
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	if($.lengthw(strInfo) > 44)
	{
		szAreaNameInfo += getNodeValue("CharNameLengthTips");
		$("#" + tipsId).html(szAreaNameInfo);
		setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除   
		return false;
	}
	$("#" + tipsId).html("");    
	return true;
}
/*************************************************
  Function:    	CheckMaskIP
  Description:	检查掩码
  Input:        strInfo:传入的参数
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckMaskIP(strInfo, tipsId, szName) {
	setTimeout(function () {$("#" + tipsId).html("");}, 5000);  //5秒后自动清除
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	if ($.isEmpty(strInfo))//为空时提示
	{
		szAreaNameInfo += getNodeValue("NullTips");
		$("#" + tipsId).html(szAreaNameInfo);
		return false;
	}
	if ($.isIpAddress(strInfo) == false) {
		szAreaNameInfo += getNodeValue("WrongTips") + getNodeValue(szName);
		$("#" + tipsId).html(szAreaNameInfo);
		return false;
	}
	var IPArray = strInfo.split(".");
	var ip1 = parseInt(IPArray[0]);
	var ip2 = parseInt(IPArray[1]);
	var ip3 = parseInt(IPArray[2]);
	var ip4 = parseInt(IPArray[3]);

	var ip_binary = _checkIput_fomartIP(ip1) + _checkIput_fomartIP(ip2) + _checkIput_fomartIP(ip3) + _checkIput_fomartIP(ip4);
	if (-1 != ip_binary.indexOf("01") || ip_binary == "11111111111111111111111111111111" || ip_binary == "00000000000000000000000000000000" || ip_binary == "11111111111111111111111111111110") {
		szAreaNameInfo += getNodeValue("WrongTips")+ getNodeValue(szName);
		$("#" + tipsId).html(szAreaNameInfo);
		return false;
	}
	$("#" + tipsId).html("");
	return true;
}
/*************************************************
  Function:    	_checkIput_fomartIP
  Description:	返回传入参数对应的
  Input:         ip:点分十进制的值(0~255),int类型的值，
  Output:      	 ip对应的二进制值(如：传入255，返回11111111;传入1,返回00000001)
*************************************************/
function _checkIput_fomartIP(ip)
{
	return (ip+256).toString(2).substring(1); //格式化输出(补零)
}
/*************************************************
  Function:    	CheckDevFileName
  Description:	检查文件名称是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
				iNull:是否可以为空
				szName:提示名词
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckDevFileName(strInfo,tipsId,szName,iNull)
{
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(iNull == 0)
	{
		if($.isEmpty(strInfo))//为空时提示     

		{
			szAreaNameInfo += getNodeValue(szName) + getNodeValue("NullTips");
			$("#" + tipsId).html(szAreaNameInfo);    
			return false;
		}
	}
	var forbidChar = new Array("'",":","*","?","<",">","|", "/", "%","\\",'"', "\""); //包含特殊字符时提示
	for(var i = 0;i < forbidChar.length ; i++)
	{ 
  		if(strInfo.indexOf(forbidChar[i]) >= 0)
		{ 
			szAreaNameInfo += getNodeValue("DevNameWrongCharTips") + " / \\ : * ? ' \" < > | % ";
			$("#" + tipsId).html(szAreaNameInfo);    
      		return false;
	  	} 
	} 
	if($.lengthw(strInfo) > 255)
	{
		szAreaNameInfo += getNodeValue(szName) + getNodeValue("DevFileNameLengthTips");
		$("#" + tipsId).html(szAreaNameInfo);    
		return false;
	}
	$("#" + tipsId).html("");    
	return true;
}
/*************************************************
  Function:    	CheckDNSIPadd
  Description:	检查设备号是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckDNSIPadd(strInfo,tipsId,szName)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("NullTips");
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}	
	if($.isIpAddress(strInfo) == false)
	{
		szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}
/*************************************************
  Function:    	CheackStringLenthNull
  Description:	检查设备号是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
				iLen:长度
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheackStringLenthNull(strInfo,tipsId,szName,iLen)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if($.isEmpty(strInfo))//为空时提示     
	{
		szTipsInfo += getNodeValue(szName) + getNodeValue("NullTips");
		$("#" + tipsId).html(szTipsInfo);    
		return false;
	}
	if(strInfo != "")
	{
		if($.lengthw(strInfo) > iLen)
		{
			//szTipsInfo += szName + "长度不超过" + iLen  +"！";
			szTipsInfo += getNodeValue(szName) + getNodeValue("LengthTips") + iLen;
			$("#" + tipsId).html(szTipsInfo); 
			return false;
		}
	}	
	$("#" + tipsId).html(""); 
	return true;
}
/*************************************************
  Function:    	CheckFilePathStrLen
  Description:	检查NFS配置文件路径长度是否合法
  Input:        szFilePath:文件路径
  				tipsID:显示提示信息ID
				szName:标题
				iDiskNo:虚拟磁盘号
				iLen:长度
  Output:      	无
  Return:		true:合法；false:非法
*************************************************/
function CheckFilePathStrLen(szFilePath, tipsID, szName, iDiskNo, iLen)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsID).html("");},5000);  //5秒后自动清除
	if(szFilePath == "")
	{
		szTipsInfo += getNodeValue("laDiskNumer") + iDiskNo + getNodeValue(szName) + getNodeValue("NullTips");
		$("#" + tipsID).html(szTipsInfo); 
		return false;
	}
	
	if($.lengthw(szFilePath) > iLen)
	{
		szTipsInfo += getNodeValue("laDiskNumer") + iDiskNo + getNodeValue(szName) + getNodeValue("LengthTips") + iLen;
		$("#" + tipsID).html(szTipsInfo); 
		return false;
	}
	
	$("#" + tipsID).html(""); 
	return true;
}
/*************************************************
  Function:    	CheckUserNamePlus
  Description:	检查用户名是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
				iNull:是否可以为空
				szName:提示名词
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckUserNamePlus(strInfo,tipsId,szName,iNull)
{
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(iNull == 0)
	{
		if($.isEmpty(strInfo))//为空时提示     
		{
			szAreaNameInfo += getNodeValue(szName) + getNodeValue("NullTips");
			$("#" + tipsId).html(szAreaNameInfo);    
			return false;
		}
	}
	var usern = /^[a-zA-Z0-9_]{1,}$/; 	
	if (!strInfo.match(usern))
    {
		szAreaNameInfo += getNodeValue("UserNameCharTips");
		$("#" + tipsId).html(szAreaNameInfo); 
		return false;
    }
	if($.lengthw(strInfo) > 16)
	{
		szAreaNameInfo += getNodeValue(szName) + getNodeValue("UserNameLengthTips");
		$("#" + tipsId).html(szAreaNameInfo);    
		return false;
	}
	$("#" + tipsId).html("");   
	return true;
}


/*************************************************
  Function:    	CheckLetterNumber
  Description:	只允许输入字母和数字
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
				iNull:是否可以为空
				szName:提示名词
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckLetterNumber(strInfo,tipsId,szName,iMin,iMax)
{
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if($.isEmpty(strInfo))//为空时提示     
	{
		szAreaNameInfo +=  getNodeValue("NullTips");
		$("#" + tipsId).html(szAreaNameInfo);    
		return false;
	}
	
	var usern = /^[a-zA-Z0-9]{1,}$/; 	
	if (!strInfo.match(usern))
    {
		szAreaNameInfo += getNodeValue("CheckLetterNumber");
		$("#" + tipsId).html(szAreaNameInfo); 
		return false;
    }
	if($.lengthw(strInfo) > iMax)
	{
		szAreaNameInfo += getNodeValue(szName) + getNodeValue("UserNameLengthTips") +iMax;
		$("#" + tipsId).html(szAreaNameInfo);    
		return false;
	}
	$("#" + tipsId).html("");   
	return true;
}

/*************************************************
  Function:    	CheckIPV6add
  Description:	检查是否有效的IPV6地址
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckIPV6add(strInfo,tipsId,szName)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("NullTips");
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}	
	if($.isIPv6(strInfo) == false)
	{
		szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}
/*************************************************
  Function:    	CheckIPAddress
  Description:	检查是否有效的D类IPV4或者IPV6地址
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckIPAddress(strInfo,tipsId,szName)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("NullTips");
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}	
	if($.isIPv6(strInfo) == false &&　($.isIpAddress(strInfo) == false || $.isDIpAddress(strInfo) == false))
	{
		szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}
/*************************************************
  Function:    	CheckMulticastIP
  Description:	检查是否多播地址
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckMulticastIP(strInfo,tipsId,szName)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("NullTips");
		$("#" + tipsId).html(szTipsInfo); 
		return false;
		//console.log("aaa")
		//return true;
	}
	else
	{
	  if($.isIpAddress(strInfo) == false)
		{
			szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
			$("#" + tipsId).html(szTipsInfo); 
			return false;
		}
		if($.isMulticastIP(strInfo) == false)
		{
			szTipsInfo += getNodeValue(szName) + getNodeValue("MMulticastRange");
			$("#" + tipsId).html(szTipsInfo); 
			return false;
		}
		$("#" + tipsId).html(""); 
		return true;
	}
	
}
//只能输入数字
 function InputIsNum(e) {
	var k = window.event ? e.keyCode : e.which;
	if (((k >= 48) && (k <= 57)) || k == 8 || k == 0) {
	} else {
		if (window.event) {
			window.event.returnValue = false;
		}
		else {
			e.preventDefault(); //for firefox 
		}
	}
} 