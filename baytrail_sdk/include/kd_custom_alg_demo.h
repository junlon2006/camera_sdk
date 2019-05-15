/*******************************************************************************
 *                                                                             *
 * Copyright (c) 2015 Suzhou Keda Technology Co., Ltd. http://www.kedacom.com/ *
 *                        ALL RIGHTS RESERVED                                  *
 *                                                                             *
 ******************************************************************************/

#ifndef __KD_CUSTOM_ALG_DEMO_H__
#define __KD_CUSTOM_ALG_DEMO_H__
#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#include "kd_comm_ipc_public.h"

CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_alg_init(TAlgInitPackage *ptAlgInitPackage);
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_alg_process(TAlgProcessPackage *ptAlgProcessPackage, TAlgProcessOutput *ptAlgprocessOutput);
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_alg_output(TMediaCtrlIntelliAlgOutputInfo *ptOutput);
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_generate_h264_string(void *pAlgOutput, char *pRetString);
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_generate_jpeg_string(void *pAlgOutput, char *pRetString);
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_get_jpeg_enc_data(unsigned int dwSnapIndex, char *pJpegDataBuf, unsigned int jpegDataLength);
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_alg_set_param(TAlgSetParamsPackage *ptAlgSetParamsPackage);
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_alg_get_param(TAlgGetParamsPackage *ptAlgGetParamsPackage);
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_alg_get_status(TAlgGetStatusPackage *pStatus);
CUSTOM_EDIT_FUNCTION API_STATUS custom_demo_msg_process(TIntelliMsgParam *ptMsgHandle, void* pContext);

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* __KD_CUSTOM_ALG_DEMO_H__ */

