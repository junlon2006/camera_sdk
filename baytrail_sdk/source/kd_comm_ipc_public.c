/*******************************************************************************
 *                                                                             *
 * Copyright (c) 2015 Suzhou Keda Technology Co., Ltd. http://www.kedacom.com/ *
 *                        ALL RIGHTS RESERVED                                  *
 *                                                                             *
 ******************************************************************************/

#include <stdio.h>
#include <string.h>

#include "kd_comm_ipc_public.h"
#include "kd_custom_alg_demo.h"

static TSymbolArray gtSymbolArray;

static API_STATUS kd_exter_alg_init(TAlgInitPackage *ptAlgInitPackage);
static API_STATUS kd_exter_alg_process(TAlgProcessPackage *ptAlgProcessPackage, TAlgProcessOutput *ptAlgprocessOutput);
static API_STATUS kd_exter_alg_output(TMediaCtrlIntelliAlgOutputInfo *ptOutput);
static API_STATUS kd_exter_generate_h264_string(void *pAlgOutput, char *pRetString);
static API_STATUS kd_exter_generate_jpeg_string(void *pAlgOutput, char *pRetString);
static API_STATUS kd_exter_get_jpeg_enc_data(unsigned int dwSnapIndex, char *pJpegDataBuf, unsigned int jpegDataLength);
static API_STATUS kd_exter_alg_set_param(TAlgSetParamsPackage *ptAlgSetParamsPackage);
static API_STATUS kd_exter_alg_get_param(TAlgGetParamsPackage *ptAlgGetParamsPackage);
static API_STATUS kd_exter_alg_get_status(TAlgGetStatusPackage *pStatus);
static API_STATUS kd_exter_recv_msg(TIntelliMsgParam *ptMsgHandle, void* pContext);

CONST_FUNCTION_API API_STATUS kd_exter_symbol_init(TSymbolArray *ptSymbolArray)
{
    if(ptSymbolArray != NULL)
    {
        memcpy(&gtSymbolArray, ptSymbolArray, sizeof(TSymbolArray));

        ptSymbolArray->tExterArray.PFAlgInit = kd_exter_alg_init;
        ptSymbolArray->tExterArray.PFAlgProcess = kd_exter_alg_process;
        ptSymbolArray->tExterArray.PFAlgGetParam = kd_exter_alg_get_param;
        ptSymbolArray->tExterArray.PFAlgSetParam = kd_exter_alg_set_param;
        ptSymbolArray->tExterArray.PFAlgOutput = kd_exter_alg_output;
        ptSymbolArray->tExterArray.PFGenerateH264String = kd_exter_generate_h264_string;
        ptSymbolArray->tExterArray.PFGenerateJpegString = kd_exter_generate_jpeg_string;
        ptSymbolArray->tExterArray.PFRecvExterMsg = kd_exter_recv_msg;
        ptSymbolArray->tExterArray.PFAlgGetStatus = kd_exter_alg_get_status;
        ptSymbolArray->tExterArray.PFGetJpegData = kd_exter_get_jpeg_enc_data;

        return RET_OK;
    }

    return SYMBOL_INIT_PARAM_NULL;
}

CONST_FUNCTION_API API_STATUS kd_jpeg_enc_proc(TMediaCtrlIntelliSnapParam *ptParam)
{
    if(gtSymbolArray.tInnerArray.PFSnapAPI != NULL && ptParam != NULL)
    {
        return gtSymbolArray.tInnerArray.PFSnapAPI(ptParam);
    }

    return JPEG_ENC_PROC_PARAM_NULL;
}

CONST_FUNCTION_API API_STATUS kd_send_jpeg_pic(char *pJpegData, int jpegDataLength)
{
    if(pJpegData != NULL && jpegDataLength > 0 && gtSymbolArray.tInnerArray.PFPicSendAPI != NULL)
    {
        return gtSymbolArray.tInnerArray.PFPicSendAPI(pJpegData, jpegDataLength);
    }

    return SEND_JPEG_PIC_PARAM_NULL;
}

CONST_FUNCTION_API API_STATUS kd_dpss_send_info(char *pJpegData, unsigned int jpegDataLength, unsigned int jpegInfo, unsigned int jpegInfoLength)
{
    if(pJpegData != NULL && gtSymbolArray.tInnerArray.PFDpssSendAPI != NULL)
    {
        return gtSymbolArray.tInnerArray.PFDpssSendAPI(pJpegData, jpegDataLength, jpegInfo, jpegInfoLength);
    }

    return DPSS_SEND_INFO_PARAM_NULL;
}

CONST_FUNCTION_API API_STATUS kd_send_jpeg_pic_link_add(unsigned int dstIp, unsigned int dstPort)
{
    if(gtSymbolArray.tInnerArray.PFPicSendLinkAddAPI != NULL && dstIp != 0 && dstPort != 0)
    {
        return gtSymbolArray.tInnerArray.PFPicSendLinkAddAPI(dstIp, dstPort);
    }

    return PIC_SEND_LINK_ADD_PARAM_ZERO;
}

CONST_FUNCTION_API API_STATUS kd_get_send_pic_link_status(TIpcIntelliPicSendLinkStatus *pStatus)
{
    if(gtSymbolArray.tInnerArray.PFPicSendLinkStatusAPI != NULL && pStatus != NULL)
    {
        return gtSymbolArray.tInnerArray.PFPicSendLinkStatusAPI(pStatus);
    }

    return GET_PIC_SEND_STATUS_PARAM_NULL;
}

CONST_FUNCTION_API API_STATUS kd_send_jpeg_pic_link_del(unsigned int delIp, unsigned int delPort)
{
    if(gtSymbolArray.tInnerArray.PFPicSendLinkDelAPI != NULL && delIp != 0 && delPort != 0)
    {
        return gtSymbolArray.tInnerArray.PFPicSendLinkDelAPI(delIp, delPort);
    }

    return PIC_SEND_LINK_DEL_PARAM_ZERO;
}

CONST_FUNCTION_API API_STATUS kd_get_base_msg_num(unsigned int *pBaseMsgNum)
{
    if(gtSymbolArray.tInnerArray.PFGetBaseMsgNumAPI != NULL && pBaseMsgNum != NULL)
    {
        return gtSymbolArray.tInnerArray.PFGetBaseMsgNumAPI(pBaseMsgNum);
    }

    return KD_GET_BASE_MSG_NUM_PARAM_NULL;
}

CONST_FUNCTION_API API_STATUS kd_get_base_soft_version(char *pVersionBuf, int bufLength)
{
    if(gtSymbolArray.tInnerArray.PFGetBaseSoftVersionAPI != NULL && pVersionBuf != NULL)
    {
        return gtSymbolArray.tInnerArray.PFGetBaseSoftVersionAPI(pVersionBuf, bufLength);
    }

    return KD_GET_SOFT_VER_PARAM_NULL;
}

CONST_FUNCTION_API API_STATUS kd_msg_ack(TIntelliMsgParam *ptMsgHandle, void* pContext)
{
    if(gtSymbolArray.tInnerArray.PFMsgAckAPI != NULL)
    {
        return gtSymbolArray.tInnerArray.PFMsgAckAPI(ptMsgHandle, pContext);
    }

    return KD_MSG_ACK_PARAM_NULL;
}

CONST_FUNCTION_API API_STATUS kd_call_set_param(TMediaCtrlIntelliAlgParams *ptAlgParam)
{
    if(gtSymbolArray.tInnerArray.PFCallSetParamAPI != NULL && ptAlgParam != NULL)
    {
        return gtSymbolArray.tInnerArray.PFCallSetParamAPI(ptAlgParam);
    }

    return KD_CALL_SET_PARAM_PARAM_NULL;
}

CONST_FUNCTION_API API_STATUS kd_call_get_param(TMediaCtrlIntelliAlgParams *ptAlgParam)
{
    if(gtSymbolArray.tInnerArray.PFCallGetParamAPI != NULL && ptAlgParam != NULL)
    {
        return gtSymbolArray.tInnerArray.PFCallGetParamAPI(ptAlgParam);
    }

    return KD_CALL_GET_PARAM_PARAM_NULL;
}

CONST_FUNCTION_API API_STATUS kd_call_get_status(TMediaCtrlIntelliAlgStatusInfo *ptStatusInfo)
{
    if(gtSymbolArray.tInnerArray.PFCallGetStatusAPI != NULL && ptStatusInfo != NULL)
    {
        return gtSymbolArray.tInnerArray.PFCallGetStatusAPI(ptStatusInfo);
    }

    return KD_CALL_GET_STATUS_PARAM_NULL;
}

CONST_FUNCTION_API API_STATUS kd_set_dpss_info(TDpssInfo *ptDpssInfo)
{
    if(gtSymbolArray.tInnerArray.PFSetDpssAPI != NULL && ptDpssInfo != NULL)
    {
        return gtSymbolArray.tInnerArray.PFSetDpssAPI(ptDpssInfo);
    }

    return KD_SET_DPSS_INFO_PARAM_NULL;
}

CONST_FUNCTION_API API_STATUS kd_get_dpss_info(TDpssInfo *ptDpssInfo)
{
    if(gtSymbolArray.tInnerArray.PFGetDpssAPI != NULL && ptDpssInfo != NULL)
    {
        return gtSymbolArray.tInnerArray.PFGetDpssAPI(ptDpssInfo);
    }

    return KD_GET_DPSS_INFO_PARAM_NULL;
}

CONST_FUNCTION_API static API_STATUS kd_exter_alg_init(TAlgInitPackage *ptAlgInitPackage)
{
    if(ptAlgInitPackage != NULL)
    {
        return custom_demo_alg_init(ptAlgInitPackage);
    }

    return KD_EXTER_ALG_INIT_PARAM_NULL;
}

CONST_FUNCTION_API static API_STATUS kd_exter_alg_process(TAlgProcessPackage *ptAlgProcessPackage, TAlgProcessOutput *ptAlgprocessOutput)
{
    if(ptAlgProcessPackage != NULL && ptAlgprocessOutput != NULL)
    {
        return custom_demo_alg_process(ptAlgProcessPackage, ptAlgprocessOutput);
    }

    return KD_EXTER_ALG_PROCESS_PARAM_NULL;
}

CONST_FUNCTION_API static API_STATUS kd_exter_alg_output(TMediaCtrlIntelliAlgOutputInfo *ptOutput)
{
    if(ptOutput != NULL)
    {
        return custom_demo_alg_output(ptOutput);
    }

    return KD_EXTER_ALG_OUT_PARAM_NULL;
}

CONST_FUNCTION_API static API_STATUS kd_exter_generate_h264_string(void *pAlgOutput, char *pRetString)
{
    if(pAlgOutput != NULL && pRetString != NULL)
    {
        return custom_demo_generate_h264_string(pAlgOutput, pRetString);
    }

    return KD_EXTER_H264_INFO_PARAM_NULL;
}

CONST_FUNCTION_API static API_STATUS kd_exter_generate_jpeg_string(void *pAlgOutput, char *pRetString)
{
    if(pAlgOutput != NULL && pRetString != NULL)
    {
        return custom_demo_generate_jpeg_string(pAlgOutput, pRetString);
    }

    return KD_EXTER_JPEG_INFO_PARAM_NULL;
}

CONST_FUNCTION_API static API_STATUS kd_exter_get_jpeg_enc_data(unsigned int dwSnapIndex, char *pJpegDataBuf, unsigned int jpegDataLength)
{
    if(pJpegDataBuf != NULL)
    {
        return custom_demo_get_jpeg_enc_data(dwSnapIndex, pJpegDataBuf, jpegDataLength);
    }

    return KD_EXTER_GET_JPEG_ENC_DATA_PARAM_NULL;
}

CONST_FUNCTION_API static API_STATUS kd_exter_alg_set_param(TAlgSetParamsPackage *ptAlgSetParamsPackage)
{
    if(ptAlgSetParamsPackage != NULL)
    {
        return custom_demo_alg_set_param(ptAlgSetParamsPackage);
    }

    return KD_EXTER_ALG_SET_PARAM_PARAM_NULL;
}

CONST_FUNCTION_API static API_STATUS kd_exter_alg_get_param(TAlgGetParamsPackage *ptAlgGetParamsPackage)
{
    if(ptAlgGetParamsPackage != NULL)
    {
        return custom_demo_alg_get_param(ptAlgGetParamsPackage);
    }

    return KD_EXTER_ALG_GET_PARAM_PARAM_NULL;
}

CONST_FUNCTION_API static API_STATUS kd_exter_alg_get_status(TAlgGetStatusPackage *pStatus)
{
    if(pStatus != NULL)
    {
        return custom_demo_alg_get_status(pStatus);
    }

    return KD_EXTER_ALG_GET_STATUS_PARAM_NULL;
}

CONST_FUNCTION_API static API_STATUS kd_exter_recv_msg(TIntelliMsgParam *ptMsgHandle, void *pContext)
{
    if(ptMsgHandle != NULL)
    {
        return custom_demo_msg_process(ptMsgHandle, pContext);
    }

    return KD_EXTER_RECV_MSG_PARAM_NULL;
}

