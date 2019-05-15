/*******************************************************************************
 *                                                                             *
 * Copyright (c) 2015 Suzhou Keda Technology Co., Ltd. http://www.kedacom.com/ *
 *                        ALL RIGHTS RESERVED                                  *
 *                                                                             *
 ******************************************************************************/

#include <stdio.h>
#include <string.h>

#include "kd_custom_alg_demo.h"

//算法初始化
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_alg_init(TAlgInitPackage *ptAlgInitPackage)
{
    printf("custom demo alg init\n");

    return RET_OK;//该接口如错误返回唯一错误码: return CUSTOM_ALG_INIT_ERROR;
}

//算法调用处理
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_alg_process(TAlgProcessPackage *ptAlgProcessPackage, TAlgProcessOutput *ptAlgprocessOutput)
{
    static int callTime = 0;
    static int algOutPut = 88888888;

    ptAlgprocessOutput->tbufInfo.ptFreeBufList.dwBufNum = 1;
    ptAlgprocessOutput->tbufInfo.ptFreeBufList.qwBufTimeStamp[0] = ptAlgProcessPackage->ptAlgProcessInput->tFrameInfoEx.tFrameInfo[0].qwTimeStamp;
    ptAlgprocessOutput->pvAlgOutput = &algOutPut;
    ptAlgprocessOutput->algOutputLength = sizeof(int);

    if(callTime++ % 25 == 0)
    {
        printf("custom demo alg process, callTime %d\n", callTime);

        ptAlgprocessOutput->tbufInfo.ptSnapBufList.dwBufNum = 1;
        ptAlgprocessOutput->tbufInfo.ptSnapBufList.qwBufTimeStamp[0] = ptAlgProcessPackage->ptAlgProcessInput->tFrameInfoEx.tFrameInfo[0].qwTimeStamp;
    }

    return RET_OK;//该接口如错误返回唯一错误码: return CUSTOM_ALG_PROCESS_ERROR;
}

//算法结果输出
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_alg_output(TMediaCtrlIntelliAlgOutputInfo *ptOutput)
{  
    static int callTime = 0;
    static int index = 0;
    TMediaCtrlIntelliSnapParam snap_param;
    int i;

    for(i = 0; i < ptOutput->ptSnapBufList.dwBufNum; i++)
    {
        memset(&snap_param, 0, sizeof(TMediaCtrlIntelliSnapParam));                                 
        snap_param.dwJpegQuality = 80;
        snap_param.qwTimeStamp = ptOutput->ptSnapBufList.qwBufTimeStamp[i];
        index++;
        snap_param.dwSnapIndex = (unsigned int)&index;

        snap_param.bCorp = 1;
        snap_param.tEncRegion.wStartX = 0;                                                          
        snap_param.tEncRegion.wStartY = 0;
        snap_param.tEncRegion.wWidth = 320; 
        snap_param.tEncRegion.wHeight = 320;

        kd_jpeg_enc_proc(&snap_param);
    }

    if(callTime++ % 25 == 0)
    {
        printf("custom demo alg output, callTime %d\n", callTime);
    }

    return RET_OK;//该接口如错误返回唯一错误码: return CUSTOM_ALG_OUTPUT_ERROR;
}

//写h.264码流附加信息字符串格式
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_generate_h264_string(void *pAlgOutput, char *pRetString)
{
    static int callTime = 0;

    sprintf(pRetString, "hi, h264 alg out %d", *((int*)pAlgOutput));
    if(callTime++ % 25 == 0)
    {
        printf("custom demo generate h.264 string, pAlgOutput = %p, pRetString = %p\n", pAlgOutput, pRetString);
    }

    return RET_OK;//该接口如错误返回唯一错误码: return CUSTOM_H264_INFO_ERROR;
}

//写Jpeg图片附加信息字符串格式
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_generate_jpeg_string(void *pAlgOutput, char *pRetString)
{
    sprintf(pRetString, "hi, this is snap pic %d", *((int*)pAlgOutput));
    printf("custom demo generate jpeg string, pAlgOutput = %p, pRetString = %p\n", pAlgOutput, pRetString);

    return RET_OK;//该接口如错误返回唯一错误码: return CUSTOM_JPEG_INFO_ERROR;
}

//获取Jpeg编码码流
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_get_jpeg_enc_data(unsigned int dwSnapIndex, char *pJpegDataBuf, unsigned int jpegDataLength)
{
    printf("custom demo get jpeg enc data, pJpegDataBuf = %p, length = %d\n", pJpegDataBuf, jpegDataLength);

    kd_send_jpeg_pic(pJpegDataBuf, jpegDataLength);//获取数据启用图片发送
    return RET_OK;//该接口如错误返回唯一错误码: return CUSTOM_GET_JPEG_ENC_DATA_ERROR;
}

//配置算法参数
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_alg_set_param(TAlgSetParamsPackage *ptAlgSetParamsPackage)
{
    printf("custom demo alg set param\n");

    return RET_OK;//该接口如错误返回唯一错误码: return CUSTOM_ALG_SET_PARAM_ERROR;
}

//获取算法参数
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_alg_get_param(TAlgGetParamsPackage *ptAlgGetParamsPackage)
{
    printf("custom demo alg get param\n");

    return RET_OK;//该接口如错误返回唯一错误码: return CUSTOM_ALG_GET_PARAM_ERROR;
}

//获取算法状态
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_alg_get_status(TAlgGetStatusPackage *pStatus)
{
    printf("custom demo alg get status\n");

    return RET_OK;//该接口如错误返回唯一错误码: return CUSTOM_ALG_GET_STATUS_ERROR;
}

CUSTOM_EDIT_FUNCTION static API_STATUS custom_demo_msg_test_get(TIntelliMsgParam *ptMsgHandle, void *pContext)
{
/*
    struct TMsgTestGet tMsgTestGet;                     //与WEB端协定的结构体，用于存放该条消息的信息

    //step 1:
    对tMsgTestGet进行赋值

    //step 2:
    ptMsgHandle->msgBuf = (unsigned char*)&tMsgTestGet;
    ptMsgHandle->msgLength = sizeof(TMsgTestGet);

    //step 3:
    kd_msg_ack(ptMsgHandle, pContext);                 //GET消息，有回复消息，该接口必须调用
*/
    return RET_OK;
}

CUSTOM_EDIT_FUNCTION static API_STATUS custom_demo_msg_test_set(TIntelliMsgParam *ptMsgHandle, void *pContext)
{
/*
    struct TMsgTestSet tMsgTestSet;                     //与WEB端协定的结构体，用于存放该条消息的信息

    //step 1:
    if(sizeof(TMsgTestSet) != ptMsgHandle->msgLength)   //数据长度检测，必须一致。
    {
        printf("%s %d: msg length error\n", __FUNCTION__, __LINE__);

        return -1;
    }

    //step 2:
    memcpy(&tMsgTestSet, ptMsgHandle->msgBuf, sizeof(TMsgTestGet))

    //step 3:
    获取到tMsgTestSet数据，进行相应的操作。
*/
    return RET_OK;
}

//WEB通信透明传输消息处理
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_msg_process(TIntelliMsgParam *ptMsgHandle, void *pContext)
{
    API_STATUS ret = RET_OK;
    switch(ptMsgHandle->eMsgtype)
    {
        case EXTER_MSG_BASE:
            printf("custom_demo msg base\n");
            break;
        case MSG_TEST_GET:
            ret = custom_demo_msg_test_get(ptMsgHandle, pContext);
            break;
        case MSG_TEST_SET:
            ret = custom_demo_msg_test_set(ptMsgHandle, pContext);
            break;
        default:
            break;
    }

    return ret;//该接口如错误返回唯一错误码: return CUSTOM_MSG_PROCESS_ERROR;
}

