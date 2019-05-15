document.charset = "utf-8";
var m_szCurrentTab = '';
var m_TheCanvas = null;
var m_lastWindowTmp = 0;
var m_iTimePart=null;
var eventtype="";
var m_szWeekName = new Array(); //星期名称
var m_szWeekTemp = new Array(); //星期数组，用于保存时间段信息,一共7天，每天10个时间段
for (var i = 0;i < 7;i ++)
{
   m_szWeekTemp[i] = new Array();
   for(var j = 0;j < 10;j ++)
   {
       m_szWeekTemp[i][j] = new Array();
       m_szWeekTemp[i][j][0] = "00:00:00";
       m_szWeekTemp[i][j][1] = "00:00:00";
	   m_szWeekTemp[i][j][2] = "close";
	   m_szWeekTemp[i][j][3] = "false";
      
   }
}

/*************************************************
  Function:    	JugeSystemDate
  Description:	判断客户端系统日期
  Input:        无
  Output:      	无
  Return:		无
*************************************************/
function JugeSystemDate()
{	
	var myDate = new Date();
	var iYear = myDate.getFullYear();        
	if(iYear < 1971 || iYear > 2037)
	{
		if(m_bErrorDate == 1)
		{
			parent.location.href = "index.htm";
		}
		else
		{
			m_bErrorDate = 1;
		}
	}		
}
/*************************************************
Function:		CheckKeyDown
Description:	输入时按下空格时，不允许输入
Input:			iSetId: 需要验证表单Id	
				iSetValue: 需要验证的值	
Output:			无
return:			无				
*************************************************/
function CheckKeyDown(event)
{
	event = event?event:(window.event?window.event:null);
	
	if(event.keyCode == 32)   
    {
    	if(navigator.appName == "Netscape" || navigator.appName == "Opera")
		{
			event.preventDefault();
		}
		else
		{
		    event.returnValue = false;    //非ie浏览器event无returnValue属性
		}      
		return;
     }
}
/*************************************************
Function:		CheckInput
Description:	不允许中文
Input:			事件
Output:			无
return:			无				
*************************************************/
function CheckInput(event)
{
	event = event?event:(window.event?window.event:null);
	var obj = event.srcElement || event.target;
	if(!obj)
	{
		return;
	}
	if(event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 39)
	{
		var reg = /[^-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~;:,\[\]@()<>\u0022]/i;
		if($.isChinese($(obj).val())) 
		{ 
			$(obj).val($(obj).val().replace(/[^-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~;:,\[\]@()<>\u0022]/g, ""));
		}
	}
}

/**********************************
Function:		getObject
Description:	获取页面对象
Input:			无
Output:			无
return:			无		
***********************************/
function getObject(objectId,top) 
{ 
	doc = top?window.top.document:document; 
	if(typeof(objectId)!="object" && typeof(objectId)!="function") 
	{ 
	if(doc.getElementById && doc.getElementById(objectId)) 
	{ 
		// W3C DOM 
		return doc.getElementById(objectId); 
	} 
	else if(doc.getElementsByName(objectId)) 
	{ 
		return doc.getElementsByName(objectId)[0]; 
	} 
	else if (doc.all && doc.all(objectId)) 
	{ 
		// MSIE 4 DOM 
		return doc.all(objectId); 
	} 
	else if (doc.layers && doc.layers[objectId]) 
	{ 
		// NN 4 DOM.. note: this won't find nested layers 
		return doc.layers[objectId]; 
	} 
	else 
	{ 
		return false; 
	} 
	}else 
	return objectId; 
}
/*************************************************
Function:		SelectAllChanToCopy
Description:	全选/全不选复制通道
Input:			无			
Output:			无
return:			无				
*************************************************/
function SelectAllChanToCopy(iType)
{
	try
	{
		var bCheck = true;
		if($("#SelectAllBox").prop("checked") == true)
		{
		   bCheck = true;
		}
		else
		{
		   bCheck = false;
		}	    
		var temp = document.getElementsByName("SingleCheckbox"); 
		for (var i =0; i<temp.length; i++) 
		{ 
		   temp[i].checked = bCheck;
		} 
		SelectCurrentChanDis(iType);
	}
	catch(err)
	{
		//alert(err.description);
	}
}
/*************************************************
Function:		SelectCurrentChanDis
Description:	当前通道始终是选中并disabled
Input:			iType: 0 通道 1 报警量		
Output:			无
return:			无				
*************************************************/
function SelectCurrentChanDis(iType)
{
	if(iType == 0)
	{
		try
		{	
			if(m_iPicinform <= m_iAChannelNum)
			{
				document.getElementById("SingleCheckboxChan" + m_iPicinform).checked = true;
				document.getElementById("SingleCheckboxChan" + m_iPicinform).disabled = 1;
			}
		}
		catch(err)
		{
			
		}
	}
	else
	{
		try
		{	
			document.getElementById("SingleCheckboxChan" + m_iPicinform).checked = true;
			document.getElementById("SingleCheckboxChan" + m_iPicinform).disabled = 1;
		}
		catch(err)
		{
		
		}
	}
}
/*************************************************
Function:		CheackListAllSel
Description:	判断是否全选复制通道
Input:			无			
Output:			无
return:			无				
*************************************************/
function CheackListAllSel(iType)
{
	var bCheck = true;
	var temp = document.getElementsByName("SingleCheckbox"); 
	for (var i =0; i<temp.length; i++) 
	{ 
	   if (temp[i].checked == false)
	   {
		   bCheck = false;
		   break;
	   } 
	} 
	$("#SelectAllBox").prop("checked", bCheck);
	SelectCurrentChanDis(iType);
}
/**********************************
Function:		CreateAlarmOutputList
Description:	列出报警输出联动list checkbox
Input:			iAnalogChan: 模拟通道
				iTotalChan: 模拟+IP总通道数	
Output:			无
return:			无	
***********************************/   
function CreateAlarmOutputList(iAnalogChan,iTotalChan)
{
	var szDivInfo = "";
	for(var i = 0; i < iTotalChan; i ++)
	{
		if(i < iAnalogChan)
		{
			szDivInfo = szDivInfo + "<input class='checkbox' name='AlarmOutputCheckbox' id='AlarmOutputCheckboxChanO-"+ (i + 1)+"' type='checkbox'  onClick='CheackAlarmOutputAllSel()'>&nbsp;"+"A->" + (i + 1) + "&nbsp;";			
		}
		else
		{
			szDivInfo = szDivInfo + "<input class='checkbox' name='AlarmOutputCheckbox' id='AlarmOutputCheckboxChanO-"+ (i + 1)+"' type='checkbox'  onClick='CheackAlarmOutputAllSel()'>&nbsp;"+"D" + (Math.floor(parseInt(m_szAlarmOutInfo[i].split("-")[1])/100) - m_iAChannelNum) + "->" + parseInt(m_szAlarmOutInfo[i].split("-")[1])%100 + "&nbsp;";
		}
		
		if((i+1) % 9 == 0 && i != 0)
		{
			szDivInfo = szDivInfo + "<br>";	
		}
	}
	$("#DisPlayLinkageList").html(szDivInfo); 
	if(getObject("SelectAllAlarmOutputBox"))
	{
	    document.getElementById('SelectAllAlarmOutputBox').checked = false;
	}
}
/*************************************************
Function:		CheackAlarmOutputAllSel
Description:	判断是否全选复制通道-报警输出
Input:			无			
Output:			无
return:			无				
*************************************************/
function CheackAlarmOutputAllSel()
{
	var bCheck = true;
	var temp = document.getElementsByName("AlarmOutputCheckbox"); 
	if(temp.length == 0)
	{
		bCheck = false;
	}
	for (var i =0; i<temp.length; i++) 
	{ 
	   if (temp[i].checked == false)
	   {
		   bCheck = false;
		   break;
	   } 
	}
	if(getObject("SelectAllAlarmOutputBox"))
	{
		document.getElementById('SelectAllAlarmOutputBox').checked = bCheck;
	}
}
/*************************************************
Function:		CheackEveryTime
Description:	各个时间段不能有重复时间
Input:			idName:识别是验证那个表单
Output:			无
return:			1代表正确，0代表有重复				
*************************************************/
function CheackEveryTime(idName)
{
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	for(var x = 1; x<= m_iTimePart; x ++)
	{
		var StartTimeH =  idName + "StartTime" + x;
		//var StartTimeM =  idName + "StartTime" + x;
		var StopTimeH =  idName + "StopTime" + x ;
		//var StopTimeM =  idName + "StopTime" + x + "M";
		var St1 = document.getElementById(StartTimeH).value;
		//var St2 = document.getElementById(StartTimeM).innerHTML;
		var Sp1 = document.getElementById(StopTimeH).value;
		//var Sp2 = document.getElementById(StopTimeM).innerHTML;
		//var St12 = St1 * 60 + St2 * 1;
		//var Sp12 = Sp1 * 60 + Sp2 * 1;
		if((St1 + Sp1) != 0 )
		{
			for(var y = 1; y <= 10; y ++)
			{
				if(y != x)
				{
					var ComStartTimeH =  idName + "StartTime" + y ;
					//var ComStartTimeM =  idName + "StartTime" + y + "M";
					var ComStopTimeH =  idName + "StopTime" + y ;
					//var ComStopTimeM =  idName + "StopTime" + y + "M";
					var ComSt1 = document.getElementById(ComStartTimeH).value;
					//var ComSt2 = document.getElementById(ComStartTimeM).innerHTML;
					var ComSp1 = document.getElementById(ComStopTimeH).value;
					//var ComSp2 = document.getElementById(ComStopTimeM).innerHTML;
					//var ComSt12 = ComSt1 * 60 ;
					//var ComSp12 = ComSp1 * 60;
					if((ComSt1 + ComSp1) != 0 )
					{
						if(St1 <= ComSt1 && Sp1 > ComSp1)
						{
							var szErrorTips = szAreaNameInfo + getNodeValue('MTimeslot')+ y + getNodeValue('WithTimeSegmentTips') + x + getNodeValue('OverlappedTips');
							
							$("#SetResultTipsTwo").html(szErrorTips);
							setTimeout(function(){$("#SetResultTipsTwo").html("");},5000);  //5秒后自动清除
							return 0;
						}
					}
				}
			}
		}
	}
	$("#SetResultTipsTwo").html(""); 
	return 1;
}

/*************************************************
Function:		InitWeekName
Description:	初始化时间显示的信息
Input:			
Output:			无
return:					
*************************************************/
function InitWeekName()
{

	m_szWeekName[0] = getNodeValue('MMonday');
	m_szWeekName[1] = getNodeValue('MTuesday');
	m_szWeekName[2] = getNodeValue('MWednesday');
	m_szWeekName[3] = getNodeValue('MThursday');
	m_szWeekName[4] = getNodeValue('MFriday');
	m_szWeekName[5] = getNodeValue('MSaturday');
	m_szWeekName[6] = getNodeValue('MSunday');
	
}

/*************************************************
Function:		CheackIntOutTime
Description:	时间段开始时间不能大于结束时间
Input:			iDay:识别是验证那个表单
Output:			无
return:			1代表正确，0代表有错误					
*************************************************/
function CheackIntOutTime(iDay)
{
	InitWeekName();
	
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	var m_iTimePart = 10; // 布防时间段最大数
	if (eventtype=="detect"){
		m_iTimePart = 10; 
	}else if (eventtype=="shield"){
		m_iTimePart = 10; 
	}else if(eventtype=="alarmin"){
		 m_iTimePart = 10;
	}else if(eventtype=="recschedule" || eventtype=="snappic"){
		m_iTimePart = 4; 
	}else{
		m_iTimePart = 10; 
	}
	// iDay ==0 检查1～7天
	var iDayStart =  iDay;
	var iDayEnd = iDay;
	if(iDay == 0)
	{
		iDayStart =0;
	    iDayEnd =7 -1;  
	}
	
	for(var day = iDayStart; day <= iDayEnd; day++)
	{
        //console.log(day)
	    for(var x = 1; x<= m_iTimePart; x ++)
	    {
			if(m_szWeekTemp[day][x - 1][3] == "false")
				continue;
				
			//结束时间为空
			if(m_szWeekTemp[day][x - 1][1] == "00:00:00")
			{
				//console.log("结束时间为空")
				var szErrorTips = szAreaNameInfo + m_szWeekName[day] + ":" + getNodeValue('MTimeslot') + x + getNodeValue('WrongTips');
					$("#SetResultTipsTwo").html(szErrorTips); 
					setTimeout(function(){$("#SetResultTipsTwo").html("");},5000);  //5秒后自动清除  
					return 0;
			}	
			
				
			// 开始结束时间比较
			if(m_szWeekTemp[day][x - 1][1] <= (m_szWeekTemp[day][x - 1][0]))
			{
				//console.log("开始结束时间比较")
				var szErrorTips = szAreaNameInfo + m_szWeekName[day] + ":" + getNodeValue('MTimeslot') + x + getNodeValue('jsTimeSegmentErrorSegTips');
					$("#SetResultTipsTwo").html(szErrorTips); 
					setTimeout(function(){$("#SetResultTipsTwo").html("");},5000);  //5秒后自动清除  
					return 0;
			}
			
			// 判断当始时间是否在其它时间段中
			for(var x1 = m_iTimePart; x1 >= 1; x1--)
			{
				if(m_szWeekTemp[day][x1 - 1][3] == "false"  || x1 == x)
				   continue;
				 
				// 判断时间段是否相同  
				if(m_szWeekTemp[day][x - 1][0] == m_szWeekTemp[day][x1 - 1][0] &&  
				    m_szWeekTemp[day][x - 1][1] == m_szWeekTemp[day][x1 - 1][1])
				{
					var szErrorTips = szAreaNameInfo + m_szWeekName[day] + ":"+ getNodeValue('MTimeslot') + x + getNodeValue('MStartTime') + getNodeValue('WithTimeSegmentTips') + x1 +getNodeValue('MidenticalTips');
						$("#SetResultTipsTwo").html(szErrorTips);   
						setTimeout(function(){$("#SetResultTipsTwo").html("");},5000);  //5秒后自动清除  
					return 0;
				}
				   
				var bStartTimeErr = (m_szWeekTemp[day][x - 1][0] > m_szWeekTemp[day][x1 - 1][0]) &&  (m_szWeekTemp[day][x - 1][0] < m_szWeekTemp[day][x1 - 1][1]);
				var bEndTimeErr   = (m_szWeekTemp[day][x - 1][1] > m_szWeekTemp[day][x1 - 1][0]) &&  (m_szWeekTemp[day][x - 1][1] < m_szWeekTemp[day][x1 - 1][1]);
				if(bStartTimeErr)
				{
                    var szErrorTips = szAreaNameInfo + m_szWeekName[day] + ":" +  getNodeValue('MTimeslot') + x + getNodeValue('MStartTime') + getNodeValue('WithTimeSegmentTips') + x1 +getNodeValue('MConflictTips');
						$("#SetResultTipsTwo").html(szErrorTips);   
						setTimeout(function(){$("#SetResultTipsTwo").html("");},5000);  //5秒后自动清除  
					return 0;
				}
				if(bEndTimeErr)
				{
				//	console.log("bEndTimeErr")
					//var szErrorTips = szAreaNameInfo + getNodeValue('MTimeslot') + x + getNodeValue('jsTimeSegmentErrorSegTips');
					var szErrorTips = szAreaNameInfo + m_szWeekName[day] + ":" + getNodeValue('MTimeslot') + x +getNodeValue('MEndTime') + getNodeValue('WithTimeSegmentTips') + x1 +getNodeValue('MConflictTips');
						$("#SetResultTipsTwo").html(szErrorTips);   
						setTimeout(function(){$("#SetResultTipsTwo").html("");},5000);  //5秒后自动清除  
					return 0;
				}
			}
	    }
	}
	
	$("#SetResultTipsTwo").html("");   
	return 1;
}

/*************************************************
Function:		CheackAllChanneldayList
Description:	判断是否全选星期
Input:			无			
Output:			无
return:			无				
*************************************************/
function CheackAllChanneldayList()
{
	var iHaveSelect = 0; //已经选中的checkbox数目
	if(m_bHolidayEnable)
	{
		var WeekdayNum = 8;
	}
	else
	{
		var WeekdayNum = 7;
	}
	for(var i = 0;i < WeekdayNum;i ++)
    { 
	   	if((document.getElementById("ChannelplandayList" + i).checked) == true)
	   	{
			iHaveSelect ++;
	   	} 
   	}
	if(iHaveSelect == WeekdayNum)
	{
		document.getElementById("alldaylist").checked = true;
	}
	else
	{
		document.getElementById("alldaylist").checked = false;
	}	
}

/*************************************************
Function:		SelectAllplandayList
Description:	全选所有星期复制
Input:			无			
Output:			无
return:			无				
*************************************************/
function SelectAllplandayList()
{
	if(m_bHolidayEnable)
	{
		var WeekdayNum = 8;
	}
	else
	{
		var WeekdayNum = 7;
	}
	var bAll = document.getElementById("alldaylist").checked;
	for(var i = 0; i < WeekdayNum; i ++)
	{
		if(bAll)
		{
			document.getElementById("ChannelplandayList" + i).checked = true;
		}
		else
		{
			document.getElementById("ChannelplandayList" + i).checked = false;
		}
	}
	document.getElementById("ChannelplandayList" + m_iDay).checked = true;
}


/*************************************************
Function:		ClearTempWeekData
Description:	清空时间数据
Input:			无		
Output:			无
return:			无				
*************************************************/
function ClearTempWeekData(iTimePart)
{
	//console.log(m_szWeekTemp)
	for (var i = 0;i < 7; i++)
	{
		   for(var j = 0;j < iTimePart;j++)
		   {
			  
			   m_szWeek[i][j][0] = "00:00:00";
			   m_szWeek[i][j][1] = "00:00:00"; 
			   m_szWeek[i][j][2] = "00:00:00";
			   m_szWeek[i][j][3] = "false";
			   m_szWeek[i][j][4] = "";
			   m_szWeek[i][j][5] = "";
			   m_szWeek[i][j][6] = "";
		     
		   }
	}
}

/*************************************************
Function:		AnalyTimeDayInfo
Description:	根据星期几信息填入到表单中
Input:			无		
Output:			无
return:			无				
*************************************************/
function AnalyTimeDayInfo(xmlTimeDayInfo)
{
	var m_szWeekTempIndex = new Array(6,0,1,2,3,4,5); //从星期天开始
	 eventtype=$(xmlTimeDayInfo).find('eventtype').eq(0).text()
	 if($(xmlTimeDayInfo).find("alarmnum").length > 0){
		     $(xmlTimeDayInfo).find("alarmnum").each(function(i){ 
		  	 	 evenalarmnum= $(this).text();
			}); 
		}
	
	 //移动侦测if开始
	if (eventtype=="detect"){
		var m_iTimePart = 10; // 其它布防时间段最大数
		var cNodes = xmlTimeDayInfo.getElementsByTagName("week");
		ClearTempWeekData(m_iTimePart);
		
		for(var i = 0; i < cNodes.length; i++)
		{
			var dayOfWeek = cNodes[i].getAttribute("index");
			var m_szWeekTempID = m_szWeekTempIndex[i]; 
			var cTimeNodes = cNodes[i].getElementsByTagName("time");
			for(var j = 0; j < cTimeNodes.length; j++)
			{
				var timeindex = cTimeNodes[j].getAttribute("index"); 
				var starttime = $(cTimeNodes[j]).find('starttime').eq(0).text();
				var endtime = $(cTimeNodes[j]).find('endtime').eq(0).text();
				var enableTake = $(cTimeNodes[j]).find('enable').eq(0).text();
				m_szWeek[m_szWeekTempID][timeindex-1][0] = starttime;
				m_szWeek[m_szWeekTempID][timeindex-1][1] = endtime;
				m_szWeek[m_szWeekTempID][timeindex-1][3] = enableTake;
			}
			
		 }
	}  //移动侦测if结束
	//遮档报警if开始
	else if (eventtype=="shield"){
		var m_iTimePart = 10; // 其它布防时间段最大数
		var cNodes = xmlTimeDayInfo.getElementsByTagName("week");
		ClearTempWeekData(m_iTimePart);
		
		for(var i = 0; i < cNodes.length; i++)
		{
			var dayOfWeek = cNodes[i].getAttribute("index"); 
			var m_szWeekTempID = m_szWeekTempIndex[i]; 
			var cTimeNodes = cNodes[i].getElementsByTagName("time");
			for(var j = 0; j < cTimeNodes.length; j++)
			{
				var timeindex = cTimeNodes[j].getAttribute("index"); 
				var starttime = $(cTimeNodes[j]).find('starttime').eq(0).text();
				var endtime = $(cTimeNodes[j]).find('endtime').eq(0).text();
				var enableTake = $(cTimeNodes[j]).find('enable').eq(0).text();
				//m_szWeek[dayOfWeek-1][timeindex-1][0] = starttime;
				m_szWeek[m_szWeekTempID][timeindex-1][0] = starttime;
				m_szWeek[m_szWeekTempID][timeindex-1][1] = endtime;
				m_szWeek[m_szWeekTempID][timeindex-1][3] = enableTake;
			}
		 }
	}  //遮档报警结束
	//警戒线if开始
	else if (eventtype=="warningline"){
		var m_iTimePart = 10; // 其它布防时间段最大数
		var cNodes = xmlTimeDayInfo.getElementsByTagName("week");
		ClearTempWeekData(m_iTimePart);
		for(var i = 0; i < cNodes.length; i++)
		{
			var dayOfWeek = cNodes[i].getAttribute("index"); 
			var m_szWeekTempID = m_szWeekTempIndex[i]; 
			var cTimeNodes = cNodes[i].getElementsByTagName("time");
			for(var j = 0; j < cTimeNodes.length; j++)
			{
				var timeindex = cTimeNodes[j].getAttribute("index"); 
				var starttime = $(cTimeNodes[j]).find('starttime').eq(0).text();
				var endtime = $(cTimeNodes[j]).find('endtime').eq(0).text();
				var enableTake = $(cTimeNodes[j]).find('enable').eq(0).text();
				m_szWeek[m_szWeekTempID][timeindex-1][0] = starttime;
				m_szWeek[m_szWeekTempID][timeindex-1][1] = endtime;
				m_szWeek[m_szWeekTempID][timeindex-1][3] = enableTake;
			}
		 }
	}  //警戒线结束
	//场景变更if开始
	else if (eventtype=="sightchange"){
		var m_iTimePart = 10; // 其它布防时间段最大数
		var cNodes = xmlTimeDayInfo.getElementsByTagName("week");
		ClearTempWeekData(m_iTimePart);
		for(var i = 0; i < cNodes.length; i++)
		{
			var dayOfWeek = cNodes[i].getAttribute("index"); 
			var m_szWeekTempID = m_szWeekTempIndex[i]; 
			var cTimeNodes = cNodes[i].getElementsByTagName("time");
			for(var j = 0; j < cTimeNodes.length; j++)
			{
				var timeindex = cTimeNodes[j].getAttribute("index"); 
				var starttime = $(cTimeNodes[j]).find('starttime').eq(0).text();
				var endtime = $(cTimeNodes[j]).find('endtime').eq(0).text();
				var enableTake = $(cTimeNodes[j]).find('enable').eq(0).text();
				m_szWeek[m_szWeekTempID][timeindex-1][0] = starttime;
				m_szWeek[m_szWeekTempID][timeindex-1][1] = endtime;
				m_szWeek[m_szWeekTempID][timeindex-1][3] = enableTake;
			}
		 }
	}  //场景变更结束
	//报警输入if开始
	else if(eventtype=="alarmin"){
		var m_iTimePart = 10; // 其它布防时间段最大数
		var cNodes = xmlTimeDayInfo.getElementsByTagName("week");
		ClearTempWeekData(m_iTimePart);
		
		for(var i = 0; i < cNodes.length; i++)
		{
			var dayOfWeek = cNodes[i].getAttribute("index"); 
			var m_szWeekTempID = m_szWeekTempIndex[i];
			var cTimeNodes = cNodes[i].getElementsByTagName("time");
			for(var j = 0; j < cTimeNodes.length; j++)
			{
				var timeindex = cTimeNodes[j].getAttribute("index"); 
				var starttime = $(cTimeNodes[j]).find('starttime').eq(0).text();
				var endtime = $(cTimeNodes[j]).find('endtime').eq(0).text();
				var enableTake = $(cTimeNodes[j]).find('enable').eq(0).text();
				//m_szWeek[dayOfWeek-1][timeindex-1][0] = starttime;
				//m_szWeek[dayOfWeek-1][timeindex-1][1] = endtime;
				//m_szWeek[dayOfWeek-1][timeindex-1][3] = enableTake;
				m_szWeek[m_szWeekTempID][timeindex-1][0] = starttime;
				m_szWeek[m_szWeekTempID][timeindex-1][1] = endtime;
				m_szWeek[m_szWeekTempID][timeindex-1][3] = enableTake;
			}
			
		 }
	}//报警输入else结束
	//录像计划if开始
	else if(eventtype=="recschedule"){
		var m_iTimePart = 4; // 其它布防时间段最大数
		var cNodes = xmlTimeDayInfo.getElementsByTagName("week");
		ClearTempWeekData(m_iTimePart);
		
		for(var i = 0; i < cNodes.length; i++)
		{
			var dayOfWeek = cNodes[i].getAttribute("index"); 
			var m_szWeekTempID = m_szWeekTempIndex[i];
			var cTimeNodes = cNodes[i].getElementsByTagName("time");
			for(var j = 0; j < cTimeNodes.length; j++)
			{
				var timeindex = cTimeNodes[j].getAttribute("index"); 
				var starttime = $(cTimeNodes[j]).find('starttime').eq(0).text();
				var endtime = $(cTimeNodes[j]).find('endtime').eq(0).text();
				var enableTake = $(cTimeNodes[j]).find('enable').eq(0).text();
			
				m_szWeek[m_szWeekTempID][timeindex-1][0] = starttime;
				m_szWeek[m_szWeekTempID][timeindex-1][1] = endtime;
				m_szWeek[m_szWeekTempID][timeindex-1][3] = enableTake;
			}
			
		 }
	}//录像计划else结束
	//定时抓抓if开始
	else if(eventtype=="snappic"){
		
		var m_iTimePart = 4; // 其它布防时间段最大数
		var cNodes = xmlTimeDayInfo.getElementsByTagName("week");
		ClearTempWeekData(m_iTimePart);
		
		for(var i = 0; i < cNodes.length; i++)
		{
			var dayOfWeek = cNodes[i].getAttribute("index"); 
			var m_szWeekTempID = m_szWeekTempIndex[i];
			var cTimeNodes = cNodes[i].getElementsByTagName("time");
			for(var j = 0; j < cTimeNodes.length; j++)
			{
				var timeindex = cTimeNodes[j].getAttribute("index"); 
				var starttime = $(cTimeNodes[j]).find('starttime').eq(0).text();
				var endtime = $(cTimeNodes[j]).find('endtime').eq(0).text();
				var enableTake = $(cTimeNodes[j]).find('enable').eq(0).text();
			
				m_szWeek[m_szWeekTempID][timeindex-1][0] = starttime;
				m_szWeek[m_szWeekTempID][timeindex-1][1] = endtime;
				m_szWeek[m_szWeekTempID][timeindex-1][3] = enableTake;
			}
			
		 }
	}//定时抓抓else结束
	else{
		var m_iTimePart = 10; // 其它布防时间段最大数
		var cNodes = xmlTimeDayInfo.getElementsByTagName("week");
		ClearTempWeekData(m_iTimePart);
		
		for(var i = 0; i < cNodes.length; i++)
		{
			var dayOfWeek = cNodes[i].getAttribute("index"); 
			var m_szWeekTempID = m_szWeekTempIndex[i];
			var cTimeNodes = cNodes[i].getElementsByTagName("time");
			for(var j = 0; j < cTimeNodes.length; j++)
			{
				var timeindex = cTimeNodes[j].getAttribute("index"); 
				var starttime = $(cTimeNodes[j]).find('starttime').eq(0).text();
				var endtime = $(cTimeNodes[j]).find('endtime').eq(0).text();
				var modeopt = $(cTimeNodes[j]).find('mode').eq(0).text();
				var TimingTaskmodeopt = $(cTimeNodes[j]).find('mode').eq(0).attr('opt');
				
				var m_Task="Task"+parseInt(j+1);
				$("#Task"+parseInt(j+1)).empty();
				var k_TimingTaskopts = TimingTaskmodeopt.split(",");
				insertOptions2Select(k_TimingTaskopts, ["close", "hscan", "vscan", "preset", "pathcruise", "framescan","randscan", "fullviewscan", "syncscan"], ["optclose", "opthscan", "optvscan", "optpreset","optpathcruise","optframescan","optrandscan","optfullviewscan","optsyncscan"], m_Task);
				setValueDelayIE6(m_Task,"","",modeopt);
				
				var enableTake = $(cTimeNodes[j]).find('enable').eq(0).text();
				
				var preset = $(cTimeNodes[j]).find('preset').eq(0).text();
				var pathcruise = $(cTimeNodes[j]).find('pathcruise').eq(0).text();
				var syncscan = $(cTimeNodes[j]).find('syncscan').eq(0).text();
               
				m_szWeek[m_szWeekTempID][timeindex-1][0] = starttime;
				m_szWeek[m_szWeekTempID][timeindex-1][1] = endtime;
				m_szWeek[m_szWeekTempID][timeindex-1][2] = modeopt;
				m_szWeek[m_szWeekTempID][timeindex-1][3] = enableTake;
				m_szWeek[m_szWeekTempID][timeindex-1][4] = preset;
				m_szWeek[m_szWeekTempID][timeindex-1][5] = pathcruise;
				m_szWeek[m_szWeekTempID][timeindex-1][6] = syncscan;
			}
		 }
	}
}

/*************************************************
Function:		GetEveryTimeDayInfo
Description:	根据星期几信息填入到表单中
Input:			无		
Output:			无
return:			无				
*************************************************/
function GetEveryTimeDayInfo()
{
	if(getObject("StartTime1"))
	{
		//移动侦测if开始
	   if (eventtype=="detect"){ 
	        var m_iTimePart = 10; // 其它布防时间段最大数
		    for (var x =0; x < m_iTimePart; x ++)
			{
				$("#StartTime"+ parseInt(x+1)).val(m_szWeekTemp[m_iDay][x][0])
				$("#StopTime"+ parseInt(x+1)).val(m_szWeekTemp[m_iDay][x][1])
					 if (m_szWeekTemp[m_iDay][x][3]=='true'){
						$("#checkbox"+parseInt(x+1)).val(true);
						$("#checkbox"+parseInt(x+1)).prop("checked", true);
					}else{
						$("#checkbox"+parseInt(x+1)).val(false);
						$("#checkbox"+parseInt(x+1)).prop("checked", false);
					};
		  }//移动侦测if结束
		}
		//遮档报警if开始
	   else if (eventtype=="shield"){ 
	       var m_iTimePart = 10; // 其它布防时间段最大数
		    for (var x =0; x < m_iTimePart; x ++)
			{
				$("#StartTime"+ parseInt(x+1)).val(m_szWeekTemp[m_iDay][x][0])
				$("#StopTime"+ parseInt(x+1)).val(m_szWeekTemp[m_iDay][x][1])
					 if (m_szWeekTemp[m_iDay][x][3]=='true'){
						$("#checkbox"+parseInt(x+1)).val(true);
						$("#checkbox"+parseInt(x+1)).prop("checked", true);
					}else{
						$("#checkbox"+parseInt(x+1)).val(false);
						$("#checkbox"+parseInt(x+1)).prop("checked", false);
					};
		  }//遮档报警结束
		}
		//警戒线if开始
	   else if (eventtype=="warningline"){ 
	       var m_iTimePart = 10; // 其它布防时间段最大数
		    for (var x =0; x < m_iTimePart; x ++)
			{
				$("#StartTime"+ parseInt(x+1)).val(m_szWeekTemp[m_iDay][x][0])
				$("#StopTime"+ parseInt(x+1)).val(m_szWeekTemp[m_iDay][x][1])
					 if (m_szWeekTemp[m_iDay][x][3]=='true'){
						$("#checkbox"+parseInt(x+1)).val(true);
						$("#checkbox"+parseInt(x+1)).prop("checked", true);
					}else{
						$("#checkbox"+parseInt(x+1)).val(false);
						$("#checkbox"+parseInt(x+1)).prop("checked", false);
					};
		  }//警戒线结束
		}
		//场景变更if开始
	   else if (eventtype=="sightchange"){ 
	       var m_iTimePart = 10; // 其它布防时间段最大数
		    for (var x =0; x < m_iTimePart; x ++)
			{
				$("#StartTime"+ parseInt(x+1)).val(m_szWeekTemp[m_iDay][x][0])
				$("#StopTime"+ parseInt(x+1)).val(m_szWeekTemp[m_iDay][x][1])
					 if (m_szWeekTemp[m_iDay][x][3]=='true'){
						$("#checkbox"+parseInt(x+1)).val(true);
						$("#checkbox"+parseInt(x+1)).prop("checked", true);
					}else{
						$("#checkbox"+parseInt(x+1)).val(false);
						$("#checkbox"+parseInt(x+1)).prop("checked", false);
					};
		  }//场景变更结束
		}
		else if(eventtype=="alarmin"){
			var m_iTimePart = 10; // 其它布防时间段最大数
			for (var x =0; x < m_iTimePart; x ++)
			{
				$("#StartTime"+ parseInt(x+1)).val(m_szWeekTemp[m_iDay][x][0])
				$("#StopTime"+ parseInt(x+1)).val(m_szWeekTemp[m_iDay][x][1])
					 if (m_szWeekTemp[m_iDay][x][3]=='true'){
						$("#checkbox"+parseInt(x+1)).val(true);
						$("#checkbox"+parseInt(x+1)).prop("checked", true);
					}else{
						$("#checkbox"+parseInt(x+1)).val(false);
						$("#checkbox"+parseInt(x+1)).prop("checked", false);
					};
		  }//报警输入结束
		}//录像计划else开始
		else if(eventtype=="recschedule"){
			var m_iTimePart = 4; // 其它布防时间段最大数
			for (var x =0; x < m_iTimePart; x ++)
			{
				$("#StartTime"+ parseInt(x+1)).val(m_szWeekTemp[m_iDay][x][0])
				$("#StopTime"+ parseInt(x+1)).val(m_szWeekTemp[m_iDay][x][1])
					 if (m_szWeekTemp[m_iDay][x][3]=='true'){
						$("#checkbox"+parseInt(x+1)).val(true);
						$("#checkbox"+parseInt(x+1)).prop("checked", true);
					}else{
						$("#checkbox"+parseInt(x+1)).val(false);
						$("#checkbox"+parseInt(x+1)).prop("checked", false);
					};
		  }
		}//录像计划else结束
		else if(eventtype=="snappic"){
			var m_iTimePart = 4; // 其它布防时间段最大数
			for (var x =0; x < m_iTimePart; x ++)
			{
				$("#StartTime"+ parseInt(x+1)).val(m_szWeekTemp[m_iDay][x][0])
				$("#StopTime"+ parseInt(x+1)).val(m_szWeekTemp[m_iDay][x][1])
					 if (m_szWeekTemp[m_iDay][x][3]=='true'){
						$("#checkbox"+parseInt(x+1)).val(true);
						$("#checkbox"+parseInt(x+1)).prop("checked", true);
					}else{
						$("#checkbox"+parseInt(x+1)).val(false);
						$("#checkbox"+parseInt(x+1)).prop("checked", false);
					};
		  }
		}//定时抓拍else结束
		else{//定时任务else开始
		   var m_iTimePart = 10; // 其它布防时间段最大数
			for (var x =0; x < m_iTimePart; x ++)
		{
			$("#StartTime"+ parseInt(x+1)).val(m_szWeekTemp[m_iDay][x][0])
			$("#StopTime"+ parseInt(x+1)).val(m_szWeekTemp[m_iDay][x][1])
				var SelectTask=document.getElementById("Task"+parseInt(x+1))
				
				if (SelectTask!=undefined){
					 for (k=0;k<SelectTask.length;k++){
				 if(SelectTask.options[k].value==m_szWeekTemp[m_iDay][x][2]){  
					SelectTask.options[k].selected=true;  
					}
				 }
				 if (m_szWeekTemp[m_iDay][x][3]=='true'){
					$("#checkbox"+parseInt(x+1)).val(true);
					$("#checkbox"+parseInt(x+1)).prop("checked", true);
				}else{
					$("#checkbox"+parseInt(x+1)).val(false);
					$("#checkbox"+parseInt(x+1)).prop("checked", false);
				};
				
				if (m_szWeekTemp[m_iDay][x][2]=="preset" ){
					
					//console.log("presettext"+parseInt(x+1))
					$("#presettext"+parseInt(x+1)).empty();
					for (i=1;i<=256;i++){
						$("<option value='" + i + "' >" + i + "</option>").appendTo("#presettext"+parseInt(x+1));
					}
					var Selectpresettext=document.getElementById("presettext"+parseInt(x+1))
						for (k=0;k<Selectpresettext.length;k++){
							 if(Selectpresettext.options[k].value==m_szWeekTemp[m_iDay][x][4]){  
								Selectpresettext.options[k].selected=true;  
							}
					  }
					$("#presettext"+parseInt(x+1)).show();
					}else if (m_szWeekTemp[m_iDay][x][2]=="pathcruise"){
					$("#presettext"+parseInt(x+1)).empty();
					for (i=1;i<=8;i++){
						$("<option value='" + i + "' >" + i + "</option>").appendTo("#presettext"+parseInt(x+1));
					}
					  var Selectpresettext=document.getElementById("presettext"+parseInt(x+1))
						for (k=0;k<Selectpresettext.length;k++){
							 if(Selectpresettext.options[k].value==m_szWeekTemp[m_iDay][x][5]){  
								Selectpresettext.options[k].selected=true;  
						}
					  }
					$("#presettext"+parseInt(x+1)).show();
				}else if (m_szWeekTemp[m_iDay][x][2]=="syncscan"){
					$("#presettext"+parseInt(x+1)).empty();
					for (i=1;i<=4;i++){
						$("<option value='" + i + "' >" + i + "</option>").appendTo("#presettext"+parseInt(x+1));
					}
					var Selectpresettext=document.getElementById("presettext"+parseInt(x+1))
						for (k=0;k<Selectpresettext.length;k++){
							 if(Selectpresettext.options[k].value==m_szWeekTemp[m_iDay][x][6]){  
								Selectpresettext.options[k].selected=true;  
							}
					  }
					$("#presettext"+parseInt(x+1)).show();
					
					
				}else{
					$("#presettext"+parseInt(x+1)).hide()
				}
			}
	   	 }
		}//定时任务if结束
		
	}
}


/*************************************************
Function:		onChangeTime
Description:	开始时间改变
Input:			无		
Output:			无
return:			无				
*************************************************/
function onChangeTime(obj)
{
	
	var ctlName = obj.id;
	//alert(ctlName)
	if(ctlName.indexOf("StartTime", 0) != -1 )
	{
		var num = ctlName.split("StartTime")[1];
		m_szWeekTemp[m_iDay][num-1][0] = obj.value;
	}
	else if(ctlName.indexOf("StopTime", 0) != -1 )
	{
		var num = ctlName.split("StopTime")[1];
		m_szWeekTemp[m_iDay][num-1][1] = obj.value;
	}
	else if(ctlName.indexOf("Task", 0) != -1 )
	{
		var num = ctlName.split("Task")[1];
		m_szWeekTemp[m_iDay][num-1][2] = obj.value;

		if (m_szWeekTemp[m_iDay][num-1][2]=="preset" ){
				//$("#presettext"+parseInt(num)).show();
				//$("#presettext"+parseInt(num)).val(m_szWeekTemp[m_iDay][num-1][4])
				$("#presettext"+parseInt(num)).empty();
				for (i=1;i<=256;i++){
					$("<option value='" + i + "' >" + i + "</option>").appendTo("#presettext"+parseInt(num));
				}
				var Selectpresettext=document.getElementById("presettext"+parseInt(num))
			//console.log(SelectTask.length)
					for (k=0;k<Selectpresettext.length;k++){
		    			 if(Selectpresettext.options[k].value==m_szWeekTemp[m_iDay][num-1][4]){  
							Selectpresettext.options[k].selected=true;  
						}
		   		  }
				$("#presettext"+parseInt(num)).show();
				
				
				
			}else if (m_szWeekTemp[m_iDay][num-1][2]=="pathcruise"){
				//$("#presettext"+parseInt(num)).show();
				//$("#presettext"+parseInt(num)).val(m_szWeekTemp[m_iDay][num-1][5])
				
				$("#presettext"+parseInt(num)).empty();
				for (i=1;i<=8;i++){
					$("<option value='" + i + "' >" + i + "</option>").appendTo("#presettext"+parseInt(num));
				}
				var Selectpresettext=document.getElementById("presettext"+parseInt(num))
			//console.log(SelectTask.length)
					for (k=0;k<Selectpresettext.length;k++){
		    			 if(Selectpresettext.options[k].value==m_szWeekTemp[m_iDay][num-1][5]){  
							Selectpresettext.options[k].selected=true;  
						}
		   		  }
				$("#presettext"+parseInt(num)).show();
				
			}else if (m_szWeekTemp[m_iDay][num-1][2]=="syncscan"){

				$("#presettext"+parseInt(num)).empty();
				for (i=1;i<=4;i++){
					$("<option value='" + i + "' >" + i + "</option>").appendTo("#presettext"+parseInt(num));
				}
				var Selectpresettext=document.getElementById("presettext"+parseInt(num))
			//console.log(SelectTask.length)
					for (k=0;k<Selectpresettext.length;k++){
		    			 if(Selectpresettext.options[k].value==m_szWeekTemp[m_iDay][num-1][6]){  
							Selectpresettext.options[k].selected=true;  
						}
		   		  }
				$("#presettext"+parseInt(num)).show();
				
			}else{
				$("#presettext"+parseInt(num)).hide()
			}
		
		
		
		//alert("守望模式"+"   "+m_iDay+"  "+num+"  "+ obj.value)
	}
	else if(ctlName.indexOf("checkbox", 0) != -1 )
	{
		var num = ctlName.split("checkbox")[1];
		//m_szWeekTemp[m_iDay][num-1][3] = obj.value;
		if($(obj).prop("checked")){ //选中
		     m_szWeekTemp[m_iDay][num-1][3] = 'true';
			 $("#checkbox"+num).val(true);
			$("#checkbox"+num).prop("checked", true);
		}else{
		     m_szWeekTemp[m_iDay][num-1][3] = 'false';
			$("#checkbox"+num).val(false);
			$("#checkbox"+num).prop("checked", false);
		}
	}else if(ctlName.indexOf("presettext", 0) != -1 )
	{
		var num = ctlName.split("presettext")[1];
		m_szWeekTemp[m_iDay][num-1][4] = obj.value;
		
		if (m_szWeekTemp[m_iDay][num-1][2]=="preset" ){
				m_szWeekTemp[m_iDay][num-1][4] = obj.value;
	
			}else if (m_szWeekTemp[m_iDay][num-1][2]=="pathcruise"){
				
				
				m_szWeekTemp[m_iDay][num-1][5] = obj.value;
				
			}else if (m_szWeekTemp[m_iDay][num-1][2]=="syncscan"){
				
				m_szWeekTemp[m_iDay][num-1][6] = obj.value;
				
			}

		//alert("编号"+"   "+m_iDay+"  "+num+"  "+ obj.value)
	}
	
	
}

/**********************************
Function:		ListCopyChannelAlarm
Description:	根据报警量列出复制报警量checkbox
Input:			iAnalogChan: 模拟通道
				iTotalChan: 模拟+IP总通道数	
Output:			无
return:			无	
***********************************/   
function ListCopyChannelAlarm(iAnalogChan,iTotalChan)
{
	var szDivInfo = "";
	for(var i = 0; i < iTotalChan; i ++)
	{
		if(i < iAnalogChan)
		{
			szDivInfo = szDivInfo + "<input name='SingleCheckbox' id='SingleCheckboxChan"+i+"' type='checkbox'  onClick='CheackListAllSel(1)'>"+"A<-" + (i + 1) + "&nbsp;";
		}
		else
		{
			strIndex = m_szAlarmInInfo[i][0].split("-");
			szDivInfo = szDivInfo + "<input name='SingleCheckbox' id='SingleCheckboxChan"+i+"' type='checkbox'  onClick='CheackListAllSel(1)'>D"+ (Math.floor(parseInt(strIndex[1])/100) - m_iAChannelNum) + "<-" + parseInt(strIndex[1])%100 + "&nbsp;";
		}
		
		if((i+1) % 6 == 0 && i != 0)
		{
			szDivInfo = szDivInfo + "<br>";	
		}
	}
	$("#DisPlayChanList").html(szDivInfo); 
	SelectCurrentChanDis(1);
}

/*************************************************
Function:		GetDayTimeInfo	
Description:	读取时间信息到数据
Input:			无
Output:			无	
Return:			无
*************************************************/
function GetDayTimeInfo()
{
    var m_iTimePart = 10;
    if (eventtype=="recschedule" || eventtype=="snappic")
	{ 
		m_iTimePart = 4	  ; //录像计划4
	}
	
		
	for(var i = 1; i <= m_iTimePart; i++)
	if (m_szWeekTemp[m_iDay][i-1][3]=="true")
	{
		if($("#StartTime"+i).val() != "")
		{
            m_szWeekTemp[m_iDay][i-1][0] = $("#StartTime"+i).val();
		}
		if($("#StopTime"+i).val() != "")
		{
		    m_szWeekTemp[m_iDay][i-1][1] = $("#StopTime"+i).val();
		}
		//alert($("#StartTime"+i).val());
	}
	
}

/*************************************************
Function:		CopyDayTimeInfo	
Description:	复制到星期的信息 移动侦测 视频丢失==
Input:			无
Output:			无	
Return:			无
*************************************************/
function CopyDayTimeInfo()
{
	// 重新获取数据
	GetDayTimeInfo();
	
	if(CheackIntOutTime(m_iDay) == 0)
	{
		return;	
	}
	
	if(m_bHolidayEnable)
	{
		var WeekdayNum = 8;
	}
	else
	{
		var WeekdayNum = 7;
	}
	for(var i=0;i<WeekdayNum;i++)											
	{
		if(i != m_iDay)
		{
			if(document.getElementById("ChannelplandayList" + i).checked == true)
			{
				if (eventtype=="recschedule" ||  eventtype=="snappic"){ //录像计划开始
				  var m_iTimePart = 4; // 其它布防时间段最大数
				  for (var x =0; x < m_iTimePart; x ++)
				  {
					  for (j=0;j<m_iTimePart;j++)
						{	
						  //if (m_szWeekTemp[m_iDay][j][3]=="true")
						  {
							  
							  m_szWeekTemp[i][j][0] = m_szWeekTemp[m_iDay][j][0];  //开始时间				
							  m_szWeekTemp[i][j][1] = m_szWeekTemp[m_iDay][j][1];  //结束时间
							  m_szWeekTemp[i][j][2] = m_szWeekTemp[m_iDay][j][2];  //守护模式
							  m_szWeekTemp[i][j][3] = m_szWeekTemp[m_iDay][j][3];  //checkbox选择
								//m_szWeekTemp[i][j][4] = m_szWeekTemp[m_iDay][j][4];  //载入预置位
								//m_szWeekTemp[i][j][5] = m_szWeekTemp[m_iDay][j][5];  //路径巡
								//m_szWeekTemp[i][j][6] = m_szWeekTemp[m_iDay][j][6];  //花样扫描
							}			
						}
						
				  }//录像计划if结束
				}else{
				    var m_iTimePart = 10; // 其它布防时间段最大数
					  for (var x =0; x < m_iTimePart; x ++)
					  {
						  for (j=0;j<m_iTimePart;j++)
							{	
							  //if (m_szWeekTemp[m_iDay][j][3]=="true")
							  {
								  
								  m_szWeekTemp[i][j][0] = m_szWeekTemp[m_iDay][j][0];  //开始时间				
									m_szWeekTemp[i][j][1] = m_szWeekTemp[m_iDay][j][1];  //结束时间
									m_szWeekTemp[i][j][2] = m_szWeekTemp[m_iDay][j][2];  //守护模式
									m_szWeekTemp[i][j][3] = m_szWeekTemp[m_iDay][j][3];  //checkbox选择
									if(m_szWeekTemp[i][j][2]=="preset"){
										
										m_szWeekTemp[i][j][4] = m_szWeekTemp[m_iDay][j][4];  //载入预置位
										
									}else if(m_szWeekTemp[i][j][2]=="pathcruise"){
										
										m_szWeekTemp[i][j][5] = m_szWeekTemp[m_iDay][j][5];  //路径巡
										
									}else if(m_szWeekTemp[i][j][2]=="syncscan"){
										
										m_szWeekTemp[i][j][6] = m_szWeekTemp[m_iDay][j][6];  //花样扫描
										
									}
									//m_szWeekTemp[i][j][4] = m_szWeekTemp[m_iDay][j][4];  //载入预置位
									//m_szWeekTemp[i][j][5] = m_szWeekTemp[m_iDay][j][5];  //路径巡
									//m_szWeekTemp[i][j][6] = m_szWeekTemp[m_iDay][j][6];  //花样扫描
								}			
							}
							
					  }//录像计划if结束
				}	
				
				
				
			}
		}
	}
}
/*************************************************
Function:		jump_showdaytime
Description:	根据星期几获取相关显示信息  移动侦测 视频丢失..
Input:			iSet: select项的通道号			
Output:			无
return:			无				
*************************************************/
function jump_showdaytime(iSet)
{
	GetDayTimeInfo();
	//console.log(m_iDay+"   "+iSet)
	if (m_iDay != iSet){
		document.getElementById("ChannelplandayList" + m_iDay).disabled = 0;
		document.getElementById("alldaylist").checked = false;
		SelectAllplandayList();
		
		document.getElementById("ChannelplandayList" + m_iDay).checked = false;
		
		m_iDay = iSet;
		document.getElementById("ChannelplandayList" + m_iDay).disabled = 1;		
		document.getElementById("ChannelplandayList" + m_iDay).checked = true;
		GetEveryTimeDayInfo();
	}else{
		 document.getElementById("ChannelplandayList" + m_iDay).disabled = 0;
		document.getElementById("alldaylist").checked = false;
		SelectAllplandayList();
		
		document.getElementById("ChannelplandayList" + m_iDay).checked = false;
		
		m_iDay = iSet;
		document.getElementById("ChannelplandayList" + m_iDay).disabled = 1;		
		document.getElementById("ChannelplandayList" + m_iDay).checked = true;
	  GetEveryTimeDayInfo();	
	}
	
}

//保存时间事件
function TimingTaskSave(obj){ 
   var XmlScheduleDoc = new createxmlDoc();  //IE下可以
   var m_szWeekTempIndex = new Array(6,0,1,2,3,4,5); //从星期天开始
   //保存移动侦测
   if (eventtype=="detect"){
	   if (m_PreviewOCX==null)
		{
			szRetInfo = m_szErrorState + m_plugintips;
			var szRetIco=$(obj).next("span").attr("id")
			$("#"+szRetIco).html(szRetInfo);
			setTimeout(function(){$("#"+szRetIco).html("");},5000);  //5秒后自动清除
			return;
		} 
       var ret =document.getElementById("pluginMotion").eventWebToPlugin("detect","save"); 
		var Motionalarmcheckboxindex = $("input[name='Motionalarmoutckboxindex']");
		var szXml = "<detectinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
			szXml += "<enabled>"+$("#MotionCheck").val()+"</enabled>";
			szXml += "<alllevel>"+$("#Motion_value").val()+"</alllevel>";
			szXml += ret;
			szXml += "<linkmodes>";
			  szXml += "<uploadcenter>"+$("#Motionuploadcenter").val()+"</uploadcenter>";
			  szXml += "<showosd>"+$("#MotionShowosd").val()+"</showosd>";
			  szXml += "<audioout>"+$("#Motionaudioout").val()+"</audioout>";
			  szXml += "<rec>"+$("#Motionrec").val()+"</rec>";
			  szXml += "<snap>"+$("#Motionsnap").val()+"</snap>";
			szXml += "</linkmodes>";
			szXml += "<otherlinkmode>";
			  szXml += "<a1list size='"+Motionalarmcheckboxindex.length+"' >";
				  for (j=1;j<=Motionalarmcheckboxindex.length;j++){
					  szXml += "<a1>";
						szXml += "<enable>"+$("#Motionalarmout"+parseInt(j)).val()+"</enable>";
						szXml += "<index>"+j+"</index>";
					szXml += "</a1>"; 
					}
				szXml += "</a1list>";
			szXml += "</otherlinkmode>";
			szXml += "</detectinfo>";
		
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/detect/1"
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
							var xmlDoctime = GetparseXmlFromStr($.cookie('authenticationinfo'));
							 var RootXml = XmlScheduleDoc.createElement("contentroot"); 
								$(xmlDoctime).find("authenticationinfo").each(function(i){ 
								var	username=$(this).find('username').text()
								var	password=$(this).find('password').text()
								var	authenticationid=$(this).find('authenticationid').text();
								var	AuthenticationinfoList = XmlScheduleDoc.createElement("authenticationinfo");
									AuthenticationinfoList.setAttribute("type","7.0");
									usernameList = XmlScheduleDoc.createElement("username");	
									textuser = XmlScheduleDoc.createTextNode(username);
									usernameList.appendChild(textuser);
									AuthenticationinfoList.appendChild(usernameList);
									RootXml.appendChild(AuthenticationinfoList);
									
								var passwordList = XmlScheduleDoc.createElement("password");	
								var	textpass = XmlScheduleDoc.createTextNode(password);
									passwordList.appendChild(textpass);
									AuthenticationinfoList.appendChild(passwordList);
									RootXml.appendChild(AuthenticationinfoList);
									
							   var	authenticationidList = XmlScheduleDoc.createElement("authenticationid");	
								var	textauthenticationid = XmlScheduleDoc.createTextNode(authenticationid);
									authenticationidList.appendChild(textauthenticationid);
									AuthenticationinfoList.appendChild(authenticationidList);
									RootXml.appendChild(AuthenticationinfoList);
							});
							if(document.all)
							   {
								var Root = XmlScheduleDoc.createElement("eventtimeinfo");
								Root.setAttribute("version","1.0");
								Root.setAttribute("xmlns","http://www.kdvision.com/ver10/xmlschema");
							   }
						   else
							   {
								var Root = XmlScheduleDoc.createElementNS("http://www.kdvision.com/ver10/xmlschema","eventtimeinfo");
								Root.setAttribute("version","1.0");
									
							}
							
							Element = XmlScheduleDoc.createElement("eventtype");
							text = XmlScheduleDoc.createTextNode('detect');
							Element.appendChild(text);
							Root.appendChild(Element);
									
							TimeBlockList = XmlScheduleDoc.createElement("timelist");	
							
							var TIME = new Array ();
							var TimeBlock = new Array();
							for (var i=0;i<7;i++)	//封装一个XML文件，节点的值先从已经保存的数组中获得
							{		
								TimeBlock = XmlScheduleDoc.createElement("week");
								var m_szWeekTempID = m_szWeekTempIndex[i]; 
								TimeBlock.setAttribute("index",i+1);
								for (j=0;j<10;j++)
								{
										TIME[j] = XmlScheduleDoc.createElement("time");
										TIME[j].setAttribute("index",j+1);
										
										Element = XmlScheduleDoc.createElement("enable");					
										text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][3]);
										Element.appendChild(text);
										TIME[j].appendChild(Element);
										
										Element = XmlScheduleDoc.createElement("starttime");
										text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][0]);
										Element.appendChild(text);
										TIME[j].appendChild(Element);
										
										Element = XmlScheduleDoc.createElement("endtime");					
										text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][1]);
										Element.appendChild(text);
										TIME[j].appendChild(Element);
										TimeBlock.appendChild(TIME[j]);
										TimeBlockList.appendChild(TimeBlock);
								}
							}
							Root.appendChild(TimeBlockList);
							RootXml.appendChild(Root);
							XmlScheduleDoc.appendChild(RootXml);
							var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/time/1"
							$.ajax({
								type: "post",
								url:szURL,
								processData: false,//不转换
								//cache:false, 缓存
								data: XmlScheduleDoc,
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
										$("#SetResultTipsMotion").html(szRetInfo);
										setTimeout(function(){$("#SetResultTipsMotion").html("");},5000);  //5秒后自动清除
										GetMotion();
								}
							  });
						
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;
						$("#SetResultTipsMotion").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsMotion").html("");},5000);  //5秒后自动清除
					}
				});
			},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj);
			}
		});
	 }//遮档报警结束
	 else if (eventtype=="shield"){  //遮档报警
		 if (m_PreviewOCX==null)
		{
			szRetInfo = m_szErrorState + m_plugintips;  //请安装插件
			var szRetIco=$(obj).next("span").attr("id")
			$("#"+szRetIco).html(szRetInfo);
			setTimeout(function(){$("#"+szRetIco).html("");},5000);  //5秒后自动清除
			return;
		}
	     var alllevelside=$("#sensitivity_Alarm_value").val();
		var Alarmcheckboxindex = $("input[name='Alarmcheckboxindex']");
		var ret = document.getElementById("pluginAlarm").eventWebToPlugin("tampering","save");  //返回的xml结构
		var szXml = "<shieldalarminfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		
		szXml += "<enabled>"+$("#CheckAlarm").val()+"</enabled>";
		szXml += "<alllevel>"+$("#sensitivity_Alarm_value").val()+"</alllevel>";
		szXml += ret;
		szXml += "<linkmodes>";
		  szXml += "<uploadcenter>"+$("#AlarmUploadcenter").val()+"</uploadcenter>";
		  szXml += "<audioout>"+$("#AlarmAudioout").val()+"</audioout>";
		  szXml += "<snap>"+$("#AlarmSnap").val()+"</snap>";
		  szXml += "<showosd>"+$("#Alarmshowosd").val()+"</showosd>";
		  szXml += "<rec>"+$("#Alarmrec").val()+"</rec>";
		szXml += "</linkmodes>";
		
		szXml += "<otherlinkmode>";
		  szXml += "<a1list size='"+Alarmcheckboxindex.length+"' >";
			  for (j=1;j<=Alarmcheckboxindex.length;j++){
				  szXml += "<a1>";
					szXml += "<enable>"+$("#AlarmChecka"+parseInt(j)).val()+"</enable>";
					szXml += "<index>"+j+"</index>";
				szXml += "</a1>"; 
				}
			szXml += "</a1list>";
		szXml += "</otherlinkmode>";
		szXml += "</shieldalarminfo>";
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/shieldalarm/1"
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
						 var xmlDoctime = GetparseXmlFromStr($.cookie('authenticationinfo'));
							 var RootXml = XmlScheduleDoc.createElement("contentroot"); 
								$(xmlDoctime).find("authenticationinfo").each(function(i){ 
								var	username=$(this).find('username').text()
								var	password=$(this).find('password').text()
								var	authenticationid=$(this).find('authenticationid').text();
								var	AuthenticationinfoList = XmlScheduleDoc.createElement("authenticationinfo");
									AuthenticationinfoList.setAttribute("type","7.0");
									usernameList = XmlScheduleDoc.createElement("username");	
									textuser = XmlScheduleDoc.createTextNode(username);
									usernameList.appendChild(textuser);
									AuthenticationinfoList.appendChild(usernameList);
									RootXml.appendChild(AuthenticationinfoList);
									
								var passwordList = XmlScheduleDoc.createElement("password");	
								var	textpass = XmlScheduleDoc.createTextNode(password);
									passwordList.appendChild(textpass);
									AuthenticationinfoList.appendChild(passwordList);
									RootXml.appendChild(AuthenticationinfoList);
									
							   var	authenticationidList = XmlScheduleDoc.createElement("authenticationid");	
								var	textauthenticationid = XmlScheduleDoc.createTextNode(authenticationid);
									authenticationidList.appendChild(textauthenticationid);
									AuthenticationinfoList.appendChild(authenticationidList);
									RootXml.appendChild(AuthenticationinfoList);
							});
							if(document.all)
							   {
								var Root = XmlScheduleDoc.createElement("eventtimeinfo");
								Root.setAttribute("version","1.0");
								Root.setAttribute("xmlns","http://www.kdvision.com/ver10/xmlschema");
							   }
						   else
							   {
								var Root = XmlScheduleDoc.createElementNS("http://www.kdvision.com/ver10/xmlschema","eventtimeinfo");
								Root.setAttribute("version","1.0");
									
						}
						Element = XmlScheduleDoc.createElement("eventtype");
						text = XmlScheduleDoc.createTextNode('shield');
						Element.appendChild(text);
						Root.appendChild(Element);
								
						TimeBlockList = XmlScheduleDoc.createElement("timelist");	
						
						var TIME = new Array ();
						var TimeBlock = new Array();
						for (var i=0;i<7;i++)	
																//封装一个XML文件，节点的值先从已经保存的数组中获得
						{		
							TimeBlock = XmlScheduleDoc.createElement("week");
							var m_szWeekTempID = m_szWeekTempIndex[i]; 
							TimeBlock.setAttribute("index",i+1);
							for (j=0;j<10;j++)
							{
									TIME[j] = XmlScheduleDoc.createElement("time");
									TIME[j].setAttribute("index",j+1);
									
									Element = XmlScheduleDoc.createElement("enable");					
									text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][3]);
									Element.appendChild(text);
									TIME[j].appendChild(Element);
									
									Element = XmlScheduleDoc.createElement("starttime");
									text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][0]);
									Element.appendChild(text);
									TIME[j].appendChild(Element);
									
									Element = XmlScheduleDoc.createElement("endtime");					
									text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][1]);
									Element.appendChild(text);
									TIME[j].appendChild(Element);
									TimeBlock.appendChild(TIME[j]);
									TimeBlockList.appendChild(TimeBlock);
							}
						}
						Root.appendChild(TimeBlockList);
						RootXml.appendChild(Root);
						XmlScheduleDoc.appendChild(RootXml);
						var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/time/1"
						$.ajax({
							type: "post",
							url:szURL,
							processData: false,//不转换
							//cache:false, 缓存
							data: XmlScheduleDoc,
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
									$("#SetResultTipsAlarm").html(szRetInfo);
									setTimeout(function(){$("#SetResultTipsAlarm").html("");},5000);  //5秒后自动清除
									Getshieldalarm()
								},error: function(xhr, textStatus, errorThrown)
									{
										ErrStateTips(xhr);
									}
						  });
						
					}else
					{
						szRetInfo=  m_szErrorState+m_szError1;	
						$("#SetResultTipsAlarm").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsAlarm").html("");},5000);  //5秒后自动清除
					 }
				});
				//Getshieldalarm()
			},error: function(xhr, textStatus, errorThrown)
				{
					ErrStateTips(xhr);
				}
		});
	 //保存遮挡报警其它结束
	
	 }//遮档报警结束
	 //警戒线开始
	 else if (eventtype=="warningline")
	 {
		
		if (m_PreviewOCX==null)
		{
			szRetInfo = m_szErrorState + m_plugintips;  //请安装插件
			var szRetIco=$(obj).next("span").attr("id")
			$("#"+szRetIco).html(szRetInfo);
			setTimeout(function(){$("#"+szRetIco).html("");},5000);  //5秒后自动清除
			return;
		}
		var Guardslider=$("#Guard_value").val();
		var xmlDoctime = GetparseXmlFromStr($.cookie('authenticationinfo'));
		 var RootXml = XmlScheduleDoc.createElement("contentroot"); 
			$(xmlDoctime).find("authenticationinfo").each(function(i){ 
			var	username=$(this).find('username').text()
			var	password=$(this).find('password').text()
			var	authenticationid=$(this).find('authenticationid').text();
			var	AuthenticationinfoList = XmlScheduleDoc.createElement("authenticationinfo");
				AuthenticationinfoList.setAttribute("type","7.0");
				usernameList = XmlScheduleDoc.createElement("username");	
				textuser = XmlScheduleDoc.createTextNode(username);
				usernameList.appendChild(textuser);
				AuthenticationinfoList.appendChild(usernameList);
				RootXml.appendChild(AuthenticationinfoList);
				
			var passwordList = XmlScheduleDoc.createElement("password");	
			var	textpass = XmlScheduleDoc.createTextNode(password);
				passwordList.appendChild(textpass);
				AuthenticationinfoList.appendChild(passwordList);
				RootXml.appendChild(AuthenticationinfoList);
				
		   var	authenticationidList = XmlScheduleDoc.createElement("authenticationid");	
			var	textauthenticationid = XmlScheduleDoc.createTextNode(authenticationid);
				authenticationidList.appendChild(textauthenticationid);
				AuthenticationinfoList.appendChild(authenticationidList);
				RootXml.appendChild(AuthenticationinfoList);
		});
		if(document.all)
		   {
			var Root = XmlScheduleDoc.createElement("eventtimeinfo");
			Root.setAttribute("version","1.0");
			Root.setAttribute("xmlns","http://www.kdvision.com/ver10/xmlschema");
		   }
	   else
		   {
			var Root = XmlScheduleDoc.createElementNS("http://www.kdvision.com/ver10/xmlschema","eventtimeinfo");
			Root.setAttribute("version","1.0");
				
		}
		Element = XmlScheduleDoc.createElement("eventtype");
		text = XmlScheduleDoc.createTextNode('warningline');
		Element.appendChild(text);
		Root.appendChild(Element);
		TimeBlockList = XmlScheduleDoc.createElement("timelist");
		var TIME = new Array ();
		var TimeBlock = new Array();
		for (var i=0;i<7;i++)	
		{		
			TimeBlock = XmlScheduleDoc.createElement("week");
			var m_szWeekTempID = m_szWeekTempIndex[i]; 
			TimeBlock.setAttribute("index",i+1);
			for (j=0;j<10;j++)
			{
					TIME[j] = XmlScheduleDoc.createElement("time");
					TIME[j].setAttribute("index",j+1);
					
					Element = XmlScheduleDoc.createElement("enable");					
					text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][3]);
					Element.appendChild(text);
					TIME[j].appendChild(Element);
					
					Element = XmlScheduleDoc.createElement("starttime");
					text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][0]);
					Element.appendChild(text);
					TIME[j].appendChild(Element);
					
					Element = XmlScheduleDoc.createElement("endtime");					
					text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][1]);
					Element.appendChild(text);
					TIME[j].appendChild(Element);
					TimeBlock.appendChild(TIME[j]);
					TimeBlockList.appendChild(TimeBlock);
			}
		}
		Root.appendChild(TimeBlockList);
		RootXml.appendChild(Root);
		XmlScheduleDoc.appendChild(RootXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/time/1"
		$.ajax({
			type: "post",
			url:szURL,
			processData: false,//不转换
			//cache:false, 缓存
			data: XmlScheduleDoc,
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
								var ret =document.getElementById("pluginGuard").eventWebToPlugin("warningline","save"); 
								 var Guardindex = $("input[name='Guardindex']");
								var szXml = "<warninglineinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
								szXml += "<enabled>"+$("#CheckGuard").val()+"</enabled>";
								szXml += ret;
								szXml += "<linkmodes>";
								  szXml += "<uploadcenter>"+$("#GuardUploadcenter").val()+"</uploadcenter>";
								  szXml += "<audioout>"+$("#GuardAudioout").val()+"</audioout>";
								  szXml += "<rec>"+$("#Guardrec").val()+"</rec>";
								  szXml += "<snap>"+$("#GuardSnap").val()+"</snap>";
								szXml += "</linkmodes>";
								szXml += "<otherlinkmode>";
								  szXml += "<a1list size='"+Guardindex.length+"' >";
									  for (j=1;j<=Guardindex.length;j++){
										  szXml += "<a1>";
											szXml += "<enable>"+$("#Guardindex"+parseInt(j)).val()+"</enable>";
											szXml += "<index>"+j+"</index>";
										szXml += "</a1>"; 
										}
									szXml += "</a1list>";
								szXml += "</otherlinkmode>";
								szXml += "</warninglineinfo>";
								var xmlDoc = parseXmlFromStr(szXml);
								var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/1/warningline";
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
														GetGuard();
													}
													else
													{
														szRetInfo=  m_szErrorState+m_szError1;	
													}
													$("#SetResultTipsGuar").html(szRetInfo);
													setTimeout(function(){$("#SetResultTipsGuar").html("");},5000);  //5秒后自动清除
												});
											}//200
										}
									},error: function(xhr, textStatus, errorThrown)
									{
										ErrStateTips(xhr);
									}
								});
							}
							else
							{
								szRetInfo=  m_szErrorState+m_szError1;	
							}
							$("#SetResultTipsGuar").html(szRetInfo);
							setTimeout(function(){$("#SetResultTipsGuar").html("");},5000);  //5秒后自动清除
						});
					}
				}//200
			},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		  });
	 }//警戒线结束
	 
	 
	 //场景变更开始
	 else if (eventtype=="sightchange")
	 {
		var xmlDoctime = GetparseXmlFromStr($.cookie('authenticationinfo'));
			 var RootXml = XmlScheduleDoc.createElement("contentroot"); 
				$(xmlDoctime).find("authenticationinfo").each(function(i){ 
				var	username=$(this).find('username').text()
				var	password=$(this).find('password').text()
				var	authenticationid=$(this).find('authenticationid').text();
				var	AuthenticationinfoList = XmlScheduleDoc.createElement("authenticationinfo");
					AuthenticationinfoList.setAttribute("type","7.0");
					usernameList = XmlScheduleDoc.createElement("username");	
					textuser = XmlScheduleDoc.createTextNode(username);
					usernameList.appendChild(textuser);
					AuthenticationinfoList.appendChild(usernameList);
					RootXml.appendChild(AuthenticationinfoList);
					
				var passwordList = XmlScheduleDoc.createElement("password");	
				var	textpass = XmlScheduleDoc.createTextNode(password);
					passwordList.appendChild(textpass);
					AuthenticationinfoList.appendChild(passwordList);
					RootXml.appendChild(AuthenticationinfoList);
					
			   var	authenticationidList = XmlScheduleDoc.createElement("authenticationid");	
				var	textauthenticationid = XmlScheduleDoc.createTextNode(authenticationid);
					authenticationidList.appendChild(textauthenticationid);
					AuthenticationinfoList.appendChild(authenticationidList);
					RootXml.appendChild(AuthenticationinfoList);
			});
			if(document.all)
			   {
				var Root = XmlScheduleDoc.createElement("eventtimeinfo");
				Root.setAttribute("version","1.0");
				Root.setAttribute("xmlns","http://www.kdvision.com/ver10/xmlschema");
			   }
		   else
			   {
				var Root = XmlScheduleDoc.createElementNS("http://www.kdvision.com/ver10/xmlschema","eventtimeinfo");
				Root.setAttribute("version","1.0");
					
			}
		Element = XmlScheduleDoc.createElement("eventtype");
		text = XmlScheduleDoc.createTextNode('sightchange');
		Element.appendChild(text);
		Root.appendChild(Element);
		TimeBlockList = XmlScheduleDoc.createElement("timelist");
		var TIME = new Array ();
		var TimeBlock = new Array();
		for (var i=0;i<7;i++)	
		{		
			TimeBlock = XmlScheduleDoc.createElement("week");
			var m_szWeekTempID = m_szWeekTempIndex[i]; 
			TimeBlock.setAttribute("index",i+1);
			for (j=0;j<10;j++)
			{
					TIME[j] = XmlScheduleDoc.createElement("time");
					TIME[j].setAttribute("index",j+1);
					
					Element = XmlScheduleDoc.createElement("enable");					
					text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][3]);
					Element.appendChild(text);
					TIME[j].appendChild(Element);
					
					Element = XmlScheduleDoc.createElement("starttime");
					text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][0]);
					Element.appendChild(text);
					TIME[j].appendChild(Element);
					
					Element = XmlScheduleDoc.createElement("endtime");					
					text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][1]);
					Element.appendChild(text);
					TIME[j].appendChild(Element);
					TimeBlock.appendChild(TIME[j]);
					TimeBlockList.appendChild(TimeBlock);
			}
		}
		Root.appendChild(TimeBlockList);
		RootXml.appendChild(Root);
		XmlScheduleDoc.appendChild(RootXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/time/1"
		$.ajax({
			type: "post",
			url:szURL,
			processData: false,//不转换
			//cache:false, 缓存
			data: XmlScheduleDoc,
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
								var SceneIndex = $("input[name='SceneIndex']");
								var szXml = "<sightchangeinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
								szXml += "<enabled>"+$("#Scenecheck").val()+"</enabled>";
								szXml += "<alllevel>"+$("#Scene_value").val()+"</alllevel>";
								szXml += "<linkmodes>";
								  szXml += "<uploadcenter>"+$("#SceneUploadcenter").val()+"</uploadcenter>";
								  szXml += "<audioout>"+$("#SceneSoundAlarm").val()+"</audioout>";
								  szXml += "<showosd>"+$("#SceneShowosdAlarm").val()+"</showosd>";
								  szXml += "<rec>"+$("#SceneRecLink").val()+"</rec>";
								  szXml += "<snap>"+$("#SceneSnap").val()+"</snap>";
								szXml += "</linkmodes>";
								szXml += "<otherlinkmode>";
								  szXml += "<a1list size='"+SceneIndex.length+"' >";
									  for (j=1;j<=SceneIndex.length;j++){
										  szXml += "<a1>";
											szXml += "<enable>"+$("#Scenearmout"+parseInt(j)).val()+"</enable>";
											szXml += "<index>"+j+"</index>";
										szXml += "</a1>"; 
										}
									szXml += "</a1list>";
								szXml += "</otherlinkmode>";
								szXml += "</sightchangeinfo>";
								var xmlDoc = parseXmlFromStr(szXml);
								var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/1/sightchange";
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
													else
													{
														szRetInfo=  m_szErrorState+m_szError1;	
													}
													$("#SetResultTipsSightchange").html(szRetInfo);
													setTimeout(function(){$("#SetResultTipsSightchange").html("");},5000);  //5秒后自动清除
												});
											}//200
										}
									},error: function(xhr, textStatus, errorThrown)
									{
										ErrStateTips(xhr);
									}
								});
							}
							else
							{
								szRetInfo=  m_szErrorState+m_szError1;	
							}
							$("#SetResultTipsSightchange").html(szRetInfo);
							setTimeout(function(){$("#SetResultTipsSightchange").html("");},5000);  //5秒后自动清除
						});
					}
				}//200
			},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		  });
	 }//场景变更结束
	 
	 else if (eventtype=="alarmin"){  //报警输入
	   if (m_PreviewOCX==null)
		{
			szRetInfo = m_szErrorState + m_plugintips;
			var szRetIco=$(obj).next("span").attr("id")
			$("#"+szRetIco).html(szRetInfo);
			setTimeout(function(){$("#"+szRetIco).html("");},5000);  //5秒后自动清除
			return;
		}
    var alarmname=$.rtrim($.ltrim($("#Inputalarmname").val()));
	if(!CheckDeviceName(alarmname,'AlarmInNametips','JsInputName',0,16))
	{
	    return;
	}
	//SaveInput();  //保存报警输入其它信息
	var plugin= top.parent.document.getElementById("IpcCtrl")
	var videoid=1
	
	var str = plugin.eventWebToPlugin("saveosdpic",camera_hostname,camera_port.toString(),"0",videoid.toString(),$("#SelectAlarmnum").val(),alarmname,$.cookie('authenticationinfo'));
	if (str=="nopower")
	{
		alert(m_Mauthorization);  //没有权限
		return;
	}
	else if(str=="false")
	{
		szRetInfo=  m_szErrorState+m_szError1;
		$("#SetResultTipsInput").html(szRetInfo);
		setTimeout(function(){$("#SetResultTipsInput").html("");},5000);  //5秒后自动清除
		return;
	}
	var checkboxindex = $("input[name='checkboxindex']");
	
	var szXml = "<alarmininfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	    if($("#Inputcheckboxall").attr("checked")=="checked"){
		  szXml += "<copyto>"+"all"+"</copyto>";
		}
		szXml += "<enabled>"+$("#InputEnable").val()+"</enabled>";
		szXml += "<alarmnum>"+$("#SelectAlarmnum").val()+"</alarmnum>";
		szXml += "<alarmname>"+alarmname+"</alarmname>";
		szXml += "<alarmtype>"+$("#SelectAlarmtype").val()+"</alarmtype>";
		szXml += "<linkmodes>";
		   szXml += "<uploadcenter>"+$("#InputUploadcenter").val()+"</uploadcenter>";
		   szXml += "<showosd>"+$("#InputShowosd").val()+"</showosd>";
		   szXml += "<audioout>"+$("#InputAudioout").val()+"</audioout>";
		   szXml += "<rec>"+$("#InputRec").val()+"</rec>";
		   szXml += "<snap>"+$("#InputSnap").val()+"</snap>";
			 szXml += "<ptz>";
				szXml += "<enable>"+$("#InputPtz").val()+"</enable>";
				szXml += "<preset>"+$("#ptz_Input").val()+"</preset>";
			 szXml += "</ptz>";
		szXml += "</linkmodes>";
		szXml += "<otherlinkmode>";
		  szXml += "<a1list size='"+checkboxindex.length+"' >";
			  for (j=1;j<=checkboxindex.length;j++){
				  szXml += "<a1>";
					szXml += "<enable>"+$("#InputChecka"+parseInt(j)).val()+"</enable>";
					szXml += "<index>"+j+"</index>";
				szXml += "</a1>"; 
				}
			szXml += "</a1list>";
		szXml += "</otherlinkmode>";
		szXml += "</alarmininfo>";
	
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/alarmin/1"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		//async: false,  //同步
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},success: function(xmlDoc, textStatus, xhr)
		{
			
			var Docxml =xhr.responseText;
		     var xmlDoc = GetparseXmlFromStr(Docxml);
	       // 
			 $(xmlDoc).find("statuscode").each(function(i){ 
				var state= $(this).text();
				  if("0" == state)	//OK
					{
						//szRetInfo = m_szSuccessState+m_szSuccess1;
						
						var xmlDoctime = GetparseXmlFromStr($.cookie('authenticationinfo'));
							 var RootXml = XmlScheduleDoc.createElement("contentroot"); 
								$(xmlDoctime).find("authenticationinfo").each(function(i){ 
								var	username=$(this).find('username').text()
								var	password=$(this).find('password').text()
								var	authenticationid=$(this).find('authenticationid').text();
								var	AuthenticationinfoList = XmlScheduleDoc.createElement("authenticationinfo");
									AuthenticationinfoList.setAttribute("type","7.0");
									usernameList = XmlScheduleDoc.createElement("username");	
									textuser = XmlScheduleDoc.createTextNode(username);
									usernameList.appendChild(textuser);
									AuthenticationinfoList.appendChild(usernameList);
									RootXml.appendChild(AuthenticationinfoList);
									
								var passwordList = XmlScheduleDoc.createElement("password");	
								var	textpass = XmlScheduleDoc.createTextNode(password);
									passwordList.appendChild(textpass);
									AuthenticationinfoList.appendChild(passwordList);
									RootXml.appendChild(AuthenticationinfoList);
									
							   var	authenticationidList = XmlScheduleDoc.createElement("authenticationid");	
								var	textauthenticationid = XmlScheduleDoc.createTextNode(authenticationid);
									authenticationidList.appendChild(textauthenticationid);
									AuthenticationinfoList.appendChild(authenticationidList);
									RootXml.appendChild(AuthenticationinfoList);
							});
							if(document.all)
							   {
								var Root = XmlScheduleDoc.createElement("eventtimeinfo");
								Root.setAttribute("version","1.0");
								Root.setAttribute("xmlns","http://www.kdvision.com/ver10/xmlschema");
							   }
						   else
							   {
								var Root = XmlScheduleDoc.createElementNS("http://www.kdvision.com/ver10/xmlschema","eventtimeinfo");
								Root.setAttribute("version","1.0");
									
							}
						
						Element = XmlScheduleDoc.createElement("eventtype");
						text = XmlScheduleDoc.createTextNode('alarmin');
						Element.appendChild(text);
						Root.appendChild(Element);
						
						if ($("#Inputcheckboxall").attr("checked")=="checked"){
						Element = XmlScheduleDoc.createElement("copyto");
						text = XmlScheduleDoc.createTextNode("all");
						Element.appendChild(text);
						Root.appendChild(Element);
						}
						Element = XmlScheduleDoc.createElement("alarmnum");
						text = XmlScheduleDoc.createTextNode(evenalarmnum);  //报警输入号
						Element.appendChild(text);
						Root.appendChild(Element);
								
						TimeBlockList = XmlScheduleDoc.createElement("timelist");	
						
						var TIME = new Array ();
						var TimeBlock = new Array();
						for (var i=0;i<7;i++)	
																//封装一个XML文件，节点的值先从已经保存的数组中获得
						{		
							TimeBlock = XmlScheduleDoc.createElement("week");
							var m_szWeekTempID = m_szWeekTempIndex[i]; 
							TimeBlock.setAttribute("index",i+1);
							for (j=0;j<10;j++)
							{
									TIME[j] = XmlScheduleDoc.createElement("time");
									TIME[j].setAttribute("index",j+1);
									
									Element = XmlScheduleDoc.createElement("enable");					
									text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][3]);
									Element.appendChild(text);
									TIME[j].appendChild(Element);
									
									Element = XmlScheduleDoc.createElement("starttime");
									text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][0]);
									Element.appendChild(text);
									TIME[j].appendChild(Element);
									
									Element = XmlScheduleDoc.createElement("endtime");					
									text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][1]);
									Element.appendChild(text);
									TIME[j].appendChild(Element);
									TimeBlock.appendChild(TIME[j]);
									TimeBlockList.appendChild(TimeBlock);
							}
						}
						Root.appendChild(TimeBlockList);
						RootXml.appendChild(Root);
						XmlScheduleDoc.appendChild(RootXml);
						var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/time/1"
						$.ajax({
							type: "post",
							url:szURL,
							processData: false,//不转换
							//cache:false, 缓存
							data: XmlScheduleDoc,
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
							     	$("#SetResultTipsInput").html(szRetInfo);
								    setTimeout(function(){$("#SetResultTipsInput").html("");},5000);  //5秒后自动清除
							}
						  });
						
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;
						$("#SetResultTipsInput").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsInput").html("");},5000);  //5秒后自动清除
					}
				});
			
		   
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj);
		}
	});
	
	
	

	 }//遮档报警结束
	 //录像计划else开始
	 else if (eventtype=="recschedule"){  
	
	 // SaveVideoProgram();  //保存录像计划其它信息
		var esps=$("#SelectEsPs").val();
		var Selectrectype=$("#Selectrectype").val();
		var g_recschedule_reboot=false;
		if (k_rectypexml!=Selectrectype)
		{
			g_recschedule_reboot=true;
		}
		if (k_espsxml!=esps)
		{
			g_recschedule_reboot=true;
		}
		if (g_recschedule_reboot==true)
		{
			if (!confirm(getNodeValue('RestartStreamTips')))
			{
				return; 
			}
		}
		var xmlDoctime = GetparseXmlFromStr($.cookie('authenticationinfo'));
		 var RootXml = XmlScheduleDoc.createElement("contentroot"); 
			$(xmlDoctime).find("authenticationinfo").each(function(i){ 
			var	username=$(this).find('username').text()
			var	password=$(this).find('password').text()
			var	authenticationid=$(this).find('authenticationid').text();
			var	AuthenticationinfoList = XmlScheduleDoc.createElement("authenticationinfo");
				AuthenticationinfoList.setAttribute("type","7.0");
				usernameList = XmlScheduleDoc.createElement("username");	
				textuser = XmlScheduleDoc.createTextNode(username);
				usernameList.appendChild(textuser);
				AuthenticationinfoList.appendChild(usernameList);
				RootXml.appendChild(AuthenticationinfoList);
				
			var passwordList = XmlScheduleDoc.createElement("password");	
			var	textpass = XmlScheduleDoc.createTextNode(password);
				passwordList.appendChild(textpass);
				AuthenticationinfoList.appendChild(passwordList);
				RootXml.appendChild(AuthenticationinfoList);
				
		   var	authenticationidList = XmlScheduleDoc.createElement("authenticationid");	
			var	textauthenticationid = XmlScheduleDoc.createTextNode(authenticationid);
				authenticationidList.appendChild(textauthenticationid);
				AuthenticationinfoList.appendChild(authenticationidList);
				RootXml.appendChild(AuthenticationinfoList);
		});
		if(document.all)
		   {
			var Root = XmlScheduleDoc.createElement("eventtimeinfo");
			Root.setAttribute("version","1.0");
			Root.setAttribute("xmlns","http://www.kdvision.com/ver10/xmlschema");
		   }
	   else
		   {
			var Root = XmlScheduleDoc.createElementNS("http://www.kdvision.com/ver10/xmlschema","eventtimeinfo");
			Root.setAttribute("version","1.0");
				
		}
		Element = XmlScheduleDoc.createElement("eventtype");
		text = XmlScheduleDoc.createTextNode('recschedule');
		Element.appendChild(text);
		Root.appendChild(Element);
		TimeBlockList = XmlScheduleDoc.createElement("timelist");	
		
		var TIME = new Array ();
		var TimeBlock = new Array();
		for (var i=0;i<7;i++)	
												//封装一个XML文件，节点的值先从已经保存的数组中获得
		{		
			TimeBlock = XmlScheduleDoc.createElement("week");
			var m_szWeekTempID = m_szWeekTempIndex[i]; 
			TimeBlock.setAttribute("index",i+1);
			for (j=0;j<4;j++)
			{
					TIME[j] = XmlScheduleDoc.createElement("time");
					TIME[j].setAttribute("index",j+1);
					
					Element = XmlScheduleDoc.createElement("enable");					
					text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][3]);
					Element.appendChild(text);
					TIME[j].appendChild(Element);
					
					Element = XmlScheduleDoc.createElement("starttime");
					text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][0]);
					Element.appendChild(text);
					TIME[j].appendChild(Element);
					
					Element = XmlScheduleDoc.createElement("endtime");					
					text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][1]);
					Element.appendChild(text);
					TIME[j].appendChild(Element);
					TimeBlock.appendChild(TIME[j]);
					TimeBlockList.appendChild(TimeBlock);
			}
		}
		Root.appendChild(TimeBlockList);
		RootXml.appendChild(Root);
		XmlScheduleDoc.appendChild(RootXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/time/1"
		$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: XmlScheduleDoc,
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
				//save video
				var szXml = "<recscheduleinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
				szXml += "<enabled>"+$("#VideoProgramenalbled").val()+"</enabled>";
				szXml += "<preparetime>"+$("#SelectPrepareTime").val()+"</preparetime>";
				szXml += "<delaytime>"+$("#SelectDelayTime").val()+"</delaytime>";
				szXml += "<rectype>"+$("#Selectrectype").val()+"</rectype>";
				szXml += "<esps>"+esps+"</esps>";
				szXml += "</recscheduleinfo>";
				var xmlDoc = parseXmlFromStr(szXml);
				var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/recordschedule"
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
								if (k_espsxml!=esps || k_rectypexml!=Selectrectype)
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
							}
							else
							{
								szRetInfo=  m_szErrorState+m_szError1;
							}
							$("#SetResultTipsVideoProgram").html(szRetInfo);
						    setTimeout(function(){$("#SetResultTipsVideoProgram").html("");},5000);  //5秒后自动清除
						});
					},error: function(xhr, textStatus, errorThrown)
					{
						ErrStateTips(xhr,obj);
					}
				});//save video 
			 }
			 else
			 {
				 szRetInfo=  m_szErrorState+m_szError1;	
				 $("#SetResultTipsVideoProgram").html(szRetInfo);
			 	 setTimeout(function(){$("#SetResultTipsVideoProgram").html("");},5000);  //5秒后自动清除
			 }
			
			});
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj);
		}
	   });//save time
	 }//录像计划结束
	 //抓拍else开始
	 else if (eventtype=="snappic"){  
	
		//定时抓拍
		var timesnapspeed=$("#timesnapspeed").val(); //定时时间间隔
		var timesnapnum=$("#timesnapnum").val();     //定时抓拍数量
		//事件抓拍
		var eventsnapspeed=$("#eventsnapspeed").val(); //事件时间间隔
		var eventsnapnum=$("#eventsnapnum").val(); //事件抓拍数量
		
		if ($("#selectsnaptype").val()=="time"){
			if(!CheackServerIDIntNum(timesnapspeed,'timesnapspeedtips','JSsanpspid',Number(snapspeedtimemin),Number(snapspeedtimemax)))  //
			{
				return;
			}
		}
		else if($("#selectsnaptype").val()=="num")
		{
			if(!CheackServerIDIntNum(timesnapnum,'timesnapnumtips','JStimesnapnum',Number(snapnummin),Number(snapnummax)))
			{
				return;
			}
		}
		
		if(!CheackServerIDIntNum(eventsnapspeed,'eventsnapspeedTips','JSeventsnapnum',Number(snapspeedmin),Number(snapspeedmax)))
		{
			return;
		}
		if(!CheackServerIDIntNum(eventsnapnum,'eventsnapnumtips','JSeventsnapnum',Number(eventsnapnummin),Number(eventsnapnummax)))
		{
			return;
		}
		
		var xmlDoctime = GetparseXmlFromStr($.cookie('authenticationinfo'));
		 var RootXml = XmlScheduleDoc.createElement("contentroot"); 
			$(xmlDoctime).find("authenticationinfo").each(function(i){ 
			var	username=$(this).find('username').text()
			var	password=$(this).find('password').text()
			var	authenticationid=$(this).find('authenticationid').text();
			var	AuthenticationinfoList = XmlScheduleDoc.createElement("authenticationinfo");
				AuthenticationinfoList.setAttribute("type","7.0");
				usernameList = XmlScheduleDoc.createElement("username");	
				textuser = XmlScheduleDoc.createTextNode(username);
				usernameList.appendChild(textuser);
				AuthenticationinfoList.appendChild(usernameList);
				RootXml.appendChild(AuthenticationinfoList);
				
			var passwordList = XmlScheduleDoc.createElement("password");	
			var	textpass = XmlScheduleDoc.createTextNode(password);
				passwordList.appendChild(textpass);
				AuthenticationinfoList.appendChild(passwordList);
				RootXml.appendChild(AuthenticationinfoList);
				
		   var	authenticationidList = XmlScheduleDoc.createElement("authenticationid");	
			var	textauthenticationid = XmlScheduleDoc.createTextNode(authenticationid);
				authenticationidList.appendChild(textauthenticationid);
				AuthenticationinfoList.appendChild(authenticationidList);
				RootXml.appendChild(AuthenticationinfoList);
		});
		if(document.all)
		   {
			var Root = XmlScheduleDoc.createElement("eventtimeinfo");
			Root.setAttribute("version","1.0");
			Root.setAttribute("xmlns","http://www.kdvision.com/ver10/xmlschema");
		   }
	   else
		   {
			var Root = XmlScheduleDoc.createElementNS("http://www.kdvision.com/ver10/xmlschema","eventtimeinfo");
			Root.setAttribute("version","1.0");
				
		}
		Element = XmlScheduleDoc.createElement("eventtype");
		text = XmlScheduleDoc.createTextNode('snappic');
		Element.appendChild(text);
		Root.appendChild(Element);
		TimeBlockList = XmlScheduleDoc.createElement("timelist");	
		
		var TIME = new Array ();
		var TimeBlock = new Array();
		for (var i=0;i<7;i++)	
												//封装一个XML文件，节点的值先从已经保存的数组中获得
		{		
			TimeBlock = XmlScheduleDoc.createElement("week");
			var m_szWeekTempID = m_szWeekTempIndex[i]; 
			TimeBlock.setAttribute("index",i+1);
			for (j=0;j<4;j++)
			{
					TIME[j] = XmlScheduleDoc.createElement("time");
					TIME[j].setAttribute("index",j+1);
					
					Element = XmlScheduleDoc.createElement("enable");					
					text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][3]);
					Element.appendChild(text);
					TIME[j].appendChild(Element);
					
					Element = XmlScheduleDoc.createElement("starttime");
					text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][0]);
					Element.appendChild(text);
					TIME[j].appendChild(Element);
					
					Element = XmlScheduleDoc.createElement("endtime");					
					text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][1]);
					Element.appendChild(text);
					TIME[j].appendChild(Element);
					TimeBlock.appendChild(TIME[j]);
					TimeBlockList.appendChild(TimeBlock);
			}
		}
		Root.appendChild(TimeBlockList);
		RootXml.appendChild(Root);
		XmlScheduleDoc.appendChild(RootXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/time/1"
		$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: XmlScheduleDoc,
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
				Savesnappicconfigex();  //保存抓拍配置
			 }
			 else
			 {
				 szRetInfo=  m_szErrorState+m_szError1;	
				 $("#SetTipsSnap").html(szRetInfo);
			 	 setTimeout(function(){$("#SetTipsSnap").html("");},5000);  //5秒后自动清除
			 }
		   });
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj);
		}
	   });//save time
	 }//抓拍结束
	 else{//定时任务
		
	var waittimeTask=$("#waittimeTask").val();
	 if(!CheackServerIDIntNum(waittimeTask,'MaxwaittimeTaskTips','jsTimingTaskTips',Number(waittimemin),Number(waittimemax)))
		{
			return;
		}	 
		 
	var xmlDoctime = GetparseXmlFromStr($.cookie('authenticationinfo'));
	 var RootXml = XmlScheduleDoc.createElement("contentroot"); 
		$(xmlDoctime).find("authenticationinfo").each(function(i){ 
		var	username=$(this).find('username').text()
		var	password=$(this).find('password').text()
		var	authenticationid=$(this).find('authenticationid').text();
		var	AuthenticationinfoList = XmlScheduleDoc.createElement("authenticationinfo");
			AuthenticationinfoList.setAttribute("type","7.0");
			usernameList = XmlScheduleDoc.createElement("username");	
			textuser = XmlScheduleDoc.createTextNode(username);
			usernameList.appendChild(textuser);
			AuthenticationinfoList.appendChild(usernameList);
			RootXml.appendChild(AuthenticationinfoList);
			
		var passwordList = XmlScheduleDoc.createElement("password");	
		var	textpass = XmlScheduleDoc.createTextNode(password);
			passwordList.appendChild(textpass);
			AuthenticationinfoList.appendChild(passwordList);
			RootXml.appendChild(AuthenticationinfoList);
			
	   var	authenticationidList = XmlScheduleDoc.createElement("authenticationid");	
		var	textauthenticationid = XmlScheduleDoc.createTextNode(authenticationid);
			authenticationidList.appendChild(textauthenticationid);
			AuthenticationinfoList.appendChild(authenticationidList);
			RootXml.appendChild(AuthenticationinfoList);
	});
	if(document.all)
	   {
		var Root = XmlScheduleDoc.createElement("timetaskinfo");
		Root.setAttribute("version","1.0");
		Root.setAttribute("xmlns","http://www.kdvision.com/ver10/xmlschema");
	   }
   else
	   {
		var Root = XmlScheduleDoc.createElementNS("http://www.kdvision.com/ver10/xmlschema","timetaskinfo");
		Root.setAttribute("version","1.0");
			
	}
	Element = XmlScheduleDoc.createElement("enable");
	text = XmlScheduleDoc.createTextNode($("#TimeTaskCheck").val());
	Element.appendChild(text);
	Root.appendChild(Element);
	
	Element = XmlScheduleDoc.createElement("waittime");
	text = XmlScheduleDoc.createTextNode($("#waittimeTask").val());
	Element.appendChild(text);
	Root.appendChild(Element);
			
	TimeBlockList = XmlScheduleDoc.createElement("timeList");	
	
	var TIME = new Array ();
	var TimeBlock = new Array();
	for (var i=0;i<7;i++)	
											//封装一个XML文件，节点的值先从已经保存的数组中获得
	{		
		TimeBlock = XmlScheduleDoc.createElement("week");
		var m_szWeekTempID = m_szWeekTempIndex[i]; 
		TimeBlock.setAttribute("index",i+1);
		for (j=0;j<10;j++)
		{
				TIME[j] = XmlScheduleDoc.createElement("time");
				TIME[j].setAttribute("index",j+1);
				
				Element = XmlScheduleDoc.createElement("enable");					
				text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][3]);
				Element.appendChild(text);
				TIME[j].appendChild(Element);
				
				Element = XmlScheduleDoc.createElement("starttime");
				//m_szWeekTemp[m_szWeekTempID][timeindex-1][0]
				text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][0]);
				Element.appendChild(text);
				TIME[j].appendChild(Element);
				
				Element = XmlScheduleDoc.createElement("endtime");					
				text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][1]);
				Element.appendChild(text);
				TIME[j].appendChild(Element);
				
				Element = XmlScheduleDoc.createElement("mode");					
				text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][2]);
				Element.appendChild(text);
				TIME[j].appendChild(Element);
				
				//任务模式编号
				//console.log(m_szWeekTemp[i][j][2])
				if (m_szWeek[m_szWeekTempID][j][2]=="preset" ){
					Element = XmlScheduleDoc.createElement("preset");					
					text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][4]);
					Element.appendChild(text);
					TIME[j].appendChild(Element);
				}else if (m_szWeek[m_szWeekTempID][j][2]=="pathcruise"){
					Element = XmlScheduleDoc.createElement("pathcruise");					
					text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][5]);
					Element.appendChild(text);
					TIME[j].appendChild(Element);
				}else if (m_szWeek[m_szWeekTempID][j][2]=="syncscan"){
					Element = XmlScheduleDoc.createElement("syncscan");					
					text = XmlScheduleDoc.createTextNode(m_szWeek[m_szWeekTempID][j][6]);
					Element.appendChild(text);
					TIME[j].appendChild(Element);
				}
				TimeBlock.appendChild(TIME[j]);
				
				TimeBlockList.appendChild(TimeBlock);
		}
	}
	Root.appendChild(TimeBlockList);
	RootXml.appendChild(Root);
    XmlScheduleDoc.appendChild(RootXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/timetask"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		//cache:false, 缓存
		data: XmlScheduleDoc,
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
			$("#SetResultTipsTimingTask").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsTimingTask").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
		{
				ErrStateTips(xhr,obj);
		}
	  });
	}	
};
/*************************************************
Function:		SelectAllAlarmOutputToLinkage
Description:	全选/全不选复制通道-报警输出
Input:			无			
Output:			无
return:			无				
*************************************************/
function SelectAllAlarmOutputToLinkage()
{
	try
	{
		var bCheck = true;
		if(document.getElementsByName("SelectAllAlarmOutputBox")[0].checked == true)
		{
		   bCheck = true;
		}
		else
		{
		   bCheck = false;
		}	    
		var temp = document.getElementsByName("AlarmOutputCheckbox"); 
		for (var i =0; i<temp.length; i++) 
		{
			if(temp[i].disabled)
			{
				continue;
			}
			temp[i].checked = bCheck; 
		}
	}
	catch(err)
	{
		//LogErrorTips(err.description);
	}
}
/*************************************************
Function:		SelectAllAlarmOutput
Description:	全选/全不选复制通道-报警输出
Input:			无			
Output:			无
return:			无				
*************************************************/
function SelectAllAlarmOutput()
{
	try
	{
		var bCheck = true;
		if(document.getElementsByName("SelectAllAlarmOutputBox")[0].checked == true)
		{
		   bCheck = true;
		}
		else
		{
		   bCheck = false;
		}	    
		var temp = document.getElementsByName("AlarmOutputCheckbox"); 
		for (var i =0; i<temp.length; i++) 
		{ 
		   temp[i].checked = bCheck; 
		}
		document.getElementsByName("AlarmOutputCheckbox")[m_iPicinform].checked = true;
   		document.getElementsByName("AlarmOutputCheckbox")[m_iPicinform].disabled = 1;
	}
	catch(err)
	{
		//LogErrorTips(err.description);
	}
}
/*************************************************
Function:		SelectAllTriggerRecordToLinkage
Description:	全选/全不选复制通道-触发录像通道
Input:			无			
Output:			无
return:			无				
*************************************************/
function SelectAllTriggerRecordToLinkage()
{
	try
	{
		var bCheck = true;
		if(document.getElementsByName("SelectAllTriggerRecordBox")[0].checked == true)
		{
		   bCheck = true;
		}
		else
		{
		   bCheck = false;
		}	    
		var temp = document.getElementsByName("TriggerRecordCheckbox"); 
		for (var i =0; i<temp.length; i++) 
		{ 
		   temp[i].checked = bCheck; 
		} 
	}
	catch(err)
	{
		//LogErrorTips(err.description);
	}
}
function createXMLDoc11() {
  try //Internet Explorer
  {
    var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
  }catch(e) {
    try //Firefox, Mozilla, Opera, etc.
    {
      var xmlDoc = document.implementation.createDocument("","",null);
    } catch(e) {
      alert(e.message)
    }
  }
  return xmlDoc;
}
function serializeXMLDoc(doc) {
  var text;
  try {
    text = (new XMLSerializer()).serializeToString(doc);
  } catch(e) {
    text = doc.xml;
  }
  return text;
}


/*************************************************
Function:		CheckAddressingType
Description:	获取IP地址类型
Input:			strInfo: IP地址
Output:			地址类型
return:			无				
*************************************************/
function CheckAddressingType(strInfo)
{
	var strIpAddressType = "hostName";
	if(m_strIpVersion == 'v4')
    {
		if($.isIpAddress(strInfo) == true)
		{
			strIpAddressType = "ipAddress";		
		}
	}
	else if(m_strIpVersion == 'v6')
    {
		if($.isIPv6(strInfo) == true)
		{
			strIpAddressType = "ipv6Address";	
		}
	}
	else
	{
		if($.isIpAddress(strInfo) == true)
		{
			strIpAddressType = "ipAddress";
		}
		else if($.isIPv6(strInfo) == true)
		{
			strIpAddressType = "ipv6Address";
		}
	}
	return strIpAddressType;
}


/*************************************************
Function:		EditSchedule
Description:	弹出布防时间编辑框
Input:			无
Output:			无
return:			无				
*************************************************/
function EditSchedule()
{
    $("#mainplugin").width(0).height(1);
	$("#mainpluginAlarm").width(0).height(1);
	$("#mainpluginGuard").width(0).height(1);
	$("#SGuard").hide();
	$("#CGuard").hide();
	 m_iDay = 0;
	// 将临时数据保存到时间数据中
	for (var i = 0;i < 7;i ++)
		{
		   for(var j = 0;j < m_iTimePart;j ++)
		   {
			   m_szWeekTemp[i][j][0] = m_szWeek[i][j][0];
			   m_szWeekTemp[i][j][1] = m_szWeek[i][j][1];
			   m_szWeekTemp[i][j][2] = m_szWeek[i][j][2];
			   m_szWeekTemp[i][j][3] = m_szWeek[i][j][3];
			   m_szWeekTemp[i][j][4] = m_szWeek[i][j][4];
			   m_szWeekTemp[i][j][5] = m_szWeek[i][j][5];
			   m_szWeekTemp[i][j][6] = m_szWeek[i][j][6];
		   }
		}
	
	setTimeout(function (){
		$('#TimeScheduleEdit').modal({
				   "close":false   //禁用叉叉和ESC
				});
		$("#laScheduleEdit").html(getNodeValue('MButEditTime'))		
		$("#ulSchedule").tabs("", {markCurrent: false});
	},10)
	
   
    
   
}
/*************************************************
Function:		OKEditScheduleDlg
Description:	布防时间框按确定按钮
Input:			无
Output:			无
return:			无				
*************************************************/
function OKEditScheduleDlg()
{
	// 重新获取数据
	GetDayTimeInfo();
	
        if(CheackIntOutTime(m_iDay) == 0)
	{
		return;	
	}

	if(CheackIntOutTime(0) == 0)
	{
		return;	
	}
	
	// 将临时数据保存到时间数据中
	for (var i = 0;i < 7;i ++)
	{
		   for(var j = 0;j < m_iTimePart;j ++)
		   {
			   m_szWeek[i][j][0] = m_szWeekTemp[i][j][0];
			   m_szWeek[i][j][1] = m_szWeekTemp[i][j][1];
			   m_szWeek[i][j][2] = m_szWeekTemp[i][j][2];
			   m_szWeek[i][j][3] = m_szWeekTemp[i][j][3];
			   m_szWeek[i][j][4] = m_szWeekTemp[i][j][4];
			   m_szWeek[i][j][5] = m_szWeekTemp[i][j][5];
			   m_szWeek[i][j][6] = m_szWeekTemp[i][j][6];
		   }
	}
	
	$.modal.impl.close();	

	$("#mainplugin").width(352).height(254);
	$("#mainpluginAlarm").width(352).height(254);
	$("#mainpluginGuard").width(352).height(254);
	$("#SGuard").show();
	$("#CGuard").show();
}
/*************************************************
Function:		CancelScheduleDlg
Description:	布防时间按取消按钮
Input:			无
Output:			无
return:			无				
*************************************************/
function CancelScheduleDlg()
{
	$.modal.impl.close();
	$("#mainplugin").width(352).height(254)
	$("#mainpluginAlarm").width(352).height(254)
	$("#mainpluginGuard").width(352).height(254);
	$("#SGuard").show();
	$("#CGuard").show();
}
/*************************************************

 * Class TimeSegment 
 * @author chenxiangzhen

 * @version v1.0
 * @function 信息储存，存放时间片段相关信息
 *************************************************/
function TimeSegment(options)
{
	options = jQuery.extend({}, options);
	this.m_iX = 0;
	this.m_iY = 0;
	this.m_iWidth = 0;
	this.m_iHeight = 0;
	this.m_szColor = options.color?options.color:"#FFFFFF";
	this.m_szType = options.type?options.type:"disable";
	this.m_iTaskNum = options.taskNum?options.taskNum:0;
	this.m_szStartTime = options.startTime?options.startTime:"00:00";
	this.m_szStopTime = options.stopTime?options.stopTime:"00:00";
}
/*************************************************
Function:		deepCopy
Description:	深度复制
Input:			destination 目标
				source 源			
Output:			无
return:			选项				
*************************************************/
function deepCopy(destination, source) 
{
	if($.isEmptyObject(destination) || $.isEmptyObject(source))
	{
		return;
	}
	for(var property in source) 
	{ 
		var copy = source[property]; 
		if (destination === copy)
		{
			continue; 
		}
		if ( typeof copy === "object" ) 
		{ 
			destination[property] = DeepCopy(destination[property] || {}, copy); 
		} 
		else 
		{ 
			destination[property] = copy; 
		} 
	} 
	return destination; 
}

/*************************************************
Function:		Savesnappicconfigex
Description:	保存抓拍配置
Input:			无			
Output:			无
return:			无				
*************************************************/
function Savesnappicconfigex(){
	var picresolution1=$("#picresolution").val();
	var picresolution =picresolution1.split("*");
 	var picresolution_arr=picresolution[0]+"_"+picresolution[1]
	var szXml = "<snappiccfginfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<type>"+$("#pictype").val()+"</type>";
	szXml += "<resolution>"+picresolution_arr+"</resolution>";
	szXml += "<quality>"+$("#picquality").val()+"</quality>";
 	szXml += "</snappiccfginfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/snappicconfigex"
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
				Savesnappicevent();  //保存事件抓拍配置
			 }
			 else
			 {
				 szRetInfo=  m_szErrorState+m_szError1;	
				 $("#SetTipsSnap").html(szRetInfo);
			 	 setTimeout(function(){$("#SetTipsSnap").html("");},5000);  //5秒后自动清除
			 }
			
			});
			
			
			
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr);
		}
	});
};
/*************************************************
Function:		Savesnappicevent
Description:	保存事件抓拍配置
Input:			无			
Output:			无
return:			无				
*************************************************/
function Savesnappicevent(){
	//var picresolution1=$("#picresolution").val();
	//var picresolution =picresolution1.split("*");
 	//var picresolution_arr=picresolution[0]+"_"+picresolution[1]
	var szXml = "<snappiceventinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enable>"+$("#checksnapevent").val()+"</enable>";
	szXml += "<snapspeed>"+$("#eventsnapspeed").val()+"</snapspeed>";
	szXml += "<eventsnapnum>"+$("#eventsnapnum").val()+"</eventsnapnum>";
 	szXml += "</snappiceventinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/snappicevent"
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
				Savesnappictime();  //保存定时抓拍配置
			 }
			 else
			 {
				 szRetInfo=  m_szErrorState+m_szError1;	
				 $("#SetTipsSnap").html(szRetInfo);
			 	 setTimeout(function(){$("#SetTipsSnap").html("");},5000);  //5秒后自动清除
			 }
			
			});
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj);
		}
	});
};
/*************************************************
Function:		Savesnappictime
Description:	保存定时抓拍配置
Input:			无			
Output:			无
return:			无				
*************************************************/
function Savesnappictime(){
	var selectsnaptype=$("#selectsnaptype").val();
	var szXml = "<snappiccfginfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enable>"+$("#checksnappictime").val()+"</enable>";
	szXml += "<snaptype>"+selectsnaptype+"</snaptype>";
	if (selectsnaptype=="time"){
		szXml += "<snapspeed>"+$("#timesnapspeed").val()+"</snapspeed>";
	}
	else if(selectsnaptype=="num"){
		szXml += "<snapnum>"+$("#timesnapnum").val()+"</snapnum>";
	}
 	szXml += "</snappiccfginfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/snappictime"
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
			 else
			 {
				 szRetInfo=  m_szErrorState+m_szError1;	
			 }
			  $("#SetTipsSnap").html(szRetInfo);
			  setTimeout(function(){$("#SetTipsSnap").html("");},5000);  //5秒后自动清除
			});
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr);
		}
	});
};