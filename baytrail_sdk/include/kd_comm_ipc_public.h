/*******************************************************************************
 *                                                                             *
 * Copyright (c) 2015 Suzhou Keda Technology Co., Ltd. http://www.kedacom.com/ *
 *                        ALL RIGHTS RESERVED                                  *
 *                                                                             *
 ******************************************************************************/

#ifndef __KD_COMM_IPC_PUBLIC_H__
#define __KD_COMM_IPC_PUBLIC_H__
#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#define CUSTOM_EDIT_FUNCTION   
#define CONST_FUNCTION_API
#define ALG_MAX_VID_DAT_PLANES                  (3)
#define ALG_MAX_VID_SUB_CAP_NUM                 (2)
#define ALG_MAX_INTELLI_BUF_NUM                 (50)         
#define MSG_BASE_NUM                            (4000)   

typedef enum
{
    RET_OK = 0,
    RET_ERROR,

    SYMBOL_INIT_PARAM_NULL,
    JPEG_ENC_PROC_PARAM_NULL,
    SEND_JPEG_PIC_PARAM_NULL,
    DPSS_SEND_INFO_PARAM_NULL,
    PIC_SEND_LINK_ADD_PARAM_ZERO,
    GET_PIC_SEND_STATUS_PARAM_NULL,
    PIC_SEND_LINK_DEL_PARAM_ZERO,
    KD_GET_BASE_MSG_NUM_PARAM_NULL,
    KD_GET_SOFT_VER_PARAM_NULL,
    KD_MSG_ACK_PARAM_NULL,
    KD_CALL_SET_PARAM_PARAM_NULL,
    KD_CALL_GET_PARAM_PARAM_NULL,
    KD_CALL_GET_STATUS_PARAM_NULL,
    KD_SET_DPSS_INFO_PARAM_NULL,
    KD_GET_DPSS_INFO_PARAM_NULL,
    KD_EXTER_ALG_INIT_PARAM_NULL,
    KD_EXTER_ALG_PROCESS_PARAM_NULL,
    KD_EXTER_ALG_OUT_PARAM_NULL,
    KD_EXTER_H264_INFO_PARAM_NULL,
    KD_EXTER_JPEG_INFO_PARAM_NULL,
    KD_EXTER_GET_JPEG_ENC_DATA_PARAM_NULL,
    KD_EXTER_ALG_SET_PARAM_PARAM_NULL,
    KD_EXTER_ALG_GET_PARAM_PARAM_NULL,
    KD_EXTER_ALG_GET_STATUS_PARAM_NULL,
    KD_EXTER_RECV_MSG_PARAM_NULL,

    CUSTOM_ALG_INIT_ERROR,
    CUSTOM_ALG_PROCESS_ERROR,
    CUSTOM_ALG_OUTPUT_ERROR,
    CUSTOM_H264_INFO_ERROR,
    CUSTOM_JPEG_INFO_ERROR,
    CUSTOM_GET_JPEG_ENC_DATA_ERROR,
    CUSTOM_ALG_SET_PARAM_ERROR,
    CUSTOM_ALG_GET_PARAM_ERROR,
    CUSTOM_ALG_GET_STATUS_ERROR,
    CUSTOM_MSG_PROCESS_ERROR,
}EIntelliExterErrorType;
#define API_STATUS EIntelliExterErrorType

typedef enum
{
    ALG_LOCAL_DSP = 0, 
    ALG_REMOTE_DSP,
    ALG_LOCAL_X86,
}EMediaType;  

typedef enum
{
    ALG_DF_YUV422I_UYVY = 0x0000,
    ALGL_DF_YUV422I_YUYV,
    ALG_DF_YUV422I_YVYU,
    ALGL_DF_YUV422I_VYUY,
    ALG_DF_YUV422SP_UV,
    ALG_DF_YUV422SP_VU,
    ALG_DF_YUV422P,
    ALG_DF_YUV420SP_UV,
    ALG_DF_YUV420SP_VU,
    ALG_DF_YUV420P,
    ALG_DF_YUV444P,
    ALG_DF_YUV444I,
}EAlgVidDateFormat;

typedef enum
{
    EXTER_MSG_BASE = MSG_BASE_NUM,                              //����ϢΪƫ���������ɸ���

    //add new msg from here, such as
    MSG_TEST_GET = MSG_BASE_NUM + 1,                            //����demo��ʾ��GET��ϢΪWEB��ȡIPC��Ϣ��GET��Ϣ�лظ���
    MSG_TEST_SET = MSG_BASE_NUM + 2,                            //����demo��ʾ��SET��ϢΪWEB����IPC��Ϣ��SET��Ϣ�޻ظ���
}EIntelliMsgType;                                               //��һ����Ч��Ϣ�������MSG_BASE_NUM + 1��ʼ��������Ч��

typedef struct
{
    int nSubCapChn;                                             //�ɼ���ͨ���ţ�0 ������ͼ��1����Сͼ
    unsigned int dwOffsetX;                                     //��Ч���ݵ�Xƫ��
    unsigned int dwOffsetY;                                     //��Ч���ݵ�Yƫ��
    unsigned int dwWidth;                                       //��Ч���ݿ��
    unsigned int dwPicth[ALG_MAX_VID_DAT_PLANES];               //��������������
    unsigned int dwHeight;                                      //��Ч���ݸ߶�
    EAlgVidDateFormat eDateFormat;                              //�ɼ���������
    unsigned char *pbyPhyAddr[ALG_MAX_VID_DAT_PLANES];          //���ݴ洢�����ַ
    unsigned char *pbyVirAddr[ALG_MAX_VID_DAT_PLANES];          //���ݴ洢�����ַ
    void *pvExternSei;                                          //��չsei��Ϣָ��
    unsigned int dwExternSeiLen;                                //��չSei��Ϣ����
    unsigned long long qwTimeStamp;                             //ʱ���
}TAlgVidCapFrameInfo;                                           //�ɼ�֡������Ϣ

typedef struct
{
    TAlgVidCapFrameInfo tFrameInfo[ALG_MAX_VID_SUB_CAP_NUM];
    unsigned int dwFrameNum;                                    //ʵ����Ч֡��//
}TAlgVidCapFrameInfoEx;

typedef struct
{
    unsigned long long qwBufTimeStamp[ALG_MAX_INTELLI_BUF_NUM]; //����buf��������ʱ�������ʾ
    unsigned int dwBufNum;                                      //buf��
}TAlgBufList;

typedef struct
{
    TAlgBufList ptFreeBufList;                                  //�����㷨�������ͷŵ�buffer
    TAlgBufList ptSnapBufList;                                  //�����㷨�������Ҫץ�ĵ�buffer
}TAlgBufInfo;

typedef struct
{
    EMediaType eMediaType;                                      //�㷨����������ı�ʶ
    void *pvAlgHandle;                                          //�㷨Handle
    void *pvAlgInitParams;                                      //�㷨��ʼ���������ָ��
    int l32AlgInitParamsSize;                                   //�㷨��ʼ�������������
}TAlgInitPackage;

typedef struct
{
    TAlgVidCapFrameInfoEx tFrameInfoEx;                         //�ɼ�֡��Ϣ
    void *pvAttachInfo;                                         //�㷨���븽����Ϣ
    int l32AttachInfoLength;                                    //�㷨���븽����Ϣ����
}TAlgProcessInput;

typedef struct
{
   	TAlgBufInfo tbufInfo;                                       //������Ϣ����Ҫý����Ʋ㶨��
    void *pvAlgOutput;                                          //pvAlgOutput = NULL;ʱ��ý����Ʋ㲻��Ҫ�ش����
    int algOutputLength;                                        //algOutputLength = 0;ʱ��ý����Ʋ㲻��Ҫ�ش����
}TAlgProcessOutput;

typedef struct
{
    EMediaType eMediaType;                                      //�㷨����������ı�ʶ
    void *pvAlgHandle;                                          //�㷨Handle
    TAlgProcessInput *ptAlgProcessInput;                        //�㷨����ָ��
}TAlgProcessPackage;

typedef struct
{
    EMediaType eMediaType;                                      //�㷨����������ı�ʶ
    void *pvAlgHandle;                                          //�㷨Handle
    void *pvAlgGetParams;                                       //��ȡ�㷨����ָ��
    int l32AlgGetParamsSize;                                    //��������
}TAlgGetParamsPackage;

typedef struct
{
    EMediaType eMediaType;                                      //�㷨����������ı�ʶ
    void *pvAlgHandle;                                          //�㷨Handle
    void *pvAlgSetParams;                                       //�����㷨����ָ�� 
    int l32AlgSetParamsSize;                                    //�����㷨��������
}TAlgSetParamsPackage;           

typedef struct
{
    EMediaType eMediaType;                                      //�㷨����������ı�ʶ
    void *pvAlgHandle;                                          //�㷨Handle
    void *pvAlgGetStatus;                                       //��ȡ�㷨״ָ̬�� 
    int l32AlgGetStatusSize;                                    //״̬��Ϣ����
}TAlgGetStatusPackage;

typedef struct
{
    unsigned long long qwBufTimeStamp[ALG_MAX_INTELLI_BUF_NUM]; //����buf��������ʱ�������ʾ
    unsigned int dwBufNum;                                      //buf��
}TMediaCtrlIntelliAlgBufList;

typedef struct
{
    TMediaCtrlIntelliAlgBufList ptSnapBufList;                  //�����㷨�������Ҫץ�ĵ�buffer
    void *pvAlgOutput;                                          //�㷨����Ľ��
    unsigned int dwAlgOutputLength;                             //�㷨�������
}TMediaCtrlIntelliAlgOutputInfo;

typedef struct
{
    void *pvAlgHandle;                                          //�㷨Handle
    void *pvAlgStatus;                                          //��ȡ�㷨״ָ̬��
    unsigned int dwAlgStatusLen;                                //״̬��Ϣ����
}TMediaCtrlIntelliAlgStatusInfo;

typedef struct
{
    unsigned short wStartX;                                     //ͼƬ������Ͻ�ˮƽ����
    unsigned short wStartY;                                     //ͼƬ������ϽǴ�ֱ����
    unsigned short wWidth;                                      //ͼƬ���
    unsigned short wHeight;                                     //ͼƬ�߶�
}TMediaCtrlRectRegion;

typedef struct
{
    int bCorp;                                                  //�Ƿ���Ҫ����ü����� TUREʱ�����������Ч
    TMediaCtrlRectRegion tEncRegion;                            //��������
    unsigned int dwJpegQuality;                                 //ͼƬ����0-99
    unsigned long long qwTimeStamp;                             //ʱ���
    unsigned int dwSnapIndex;                                   //ץ�������ţ���������ͬһ���ݵĲ�ͬ��ץ��
    int bBufCanFree;                                            //���buffer�Ƿ��Ѿ�������б��룬���ͷ�
}TMediaCtrlIntelliSnapParam;

typedef struct
{
    int supportMaxLinkNum;                                      //��ͼ֧�ֵ����������
    int usedLinkNum;                                            //��ͼ��ʹ�õ�������
    int unusedLinkNum;                                          //��ͼδʹ�õ�������
}TIpcIntelliPicSendLinkStatus;

typedef struct
{
    void *pvAlgHandle;                                          //�㷨Handle
    void *pvParams;                                             //�����㷨����ָ��
    unsigned int dwParamsLen;                                   //�����㷨��������
}TMediaCtrlIntelliAlgParams;

typedef struct
{
    EIntelliMsgType eMsgtype;                                   //��Ϣ����
    unsigned char* msgBuf;                                      //͸����ϢBUF��ָ��
    unsigned int msgLength;                                     //͸����Ϣ����
}TIntelliMsgParam;

typedef struct
{
    char s8Ip[16];                                              //DPSS��������ַ
    unsigned int u32Port;                                       //DPSS�������˿�
    int status;                                                 //DPSS����״̬
}TDpssInfo;

typedef struct
{
    API_STATUS(*PFSnapAPI)(TMediaCtrlIntelliSnapParam*);
    API_STATUS(*PFPicSendAPI)(char*, unsigned int);
    API_STATUS(*PFDpssSendAPI)(char*, unsigned int, unsigned int, unsigned int);
    API_STATUS(*PFPicSendLinkAddAPI)(unsigned int, unsigned int);
    API_STATUS(*PFPicSendLinkDelAPI)(unsigned int, unsigned int);
    API_STATUS(*PFPicSendLinkStatusAPI)(TIpcIntelliPicSendLinkStatus*);
    API_STATUS(*PFGetBaseMsgNumAPI)(unsigned int*);
    API_STATUS(*PFGetBaseSoftVersionAPI)(char*, int);
    API_STATUS(*PFMsgAckAPI)(TIntelliMsgParam*, void*);
    API_STATUS(*PFCallSetParamAPI)(TMediaCtrlIntelliAlgParams*);
    API_STATUS(*PFCallGetParamAPI)(TMediaCtrlIntelliAlgParams*);
    API_STATUS(*PFCallGetStatusAPI)(TMediaCtrlIntelliAlgStatusInfo*);
    API_STATUS(*PFSetDpssAPI)(TDpssInfo*);
    API_STATUS(*PFGetDpssAPI)(TDpssInfo*);
}TInnerSymbolArray;

typedef struct
{
    API_STATUS(*PFAlgInit)(TAlgInitPackage*);
    API_STATUS(*PFAlgProcess)(TAlgProcessPackage*, TAlgProcessOutput *);
    API_STATUS(*PFAlgSetParam)(TAlgSetParamsPackage*);
    API_STATUS(*PFAlgGetParam)(TAlgGetParamsPackage*);
    API_STATUS(*PFAlgGetStatus)(TAlgGetStatusPackage*);
    API_STATUS(*PFAlgOutput)(TMediaCtrlIntelliAlgOutputInfo*);
    API_STATUS(*PFGenerateH264String)(void*, char*);
    API_STATUS(*PFGenerateJpegString)(void*, char*);
    API_STATUS(*PFGetJpegData)(unsigned int, char*, unsigned int);
    API_STATUS(*PFRecvExterMsg)(TIntelliMsgParam*, void*);
}TExterSymbolArray;

typedef struct
{
    TExterSymbolArray tExterArray;
    TInnerSymbolArray tInnerArray;
}TSymbolArray;

API_STATUS kd_jpeg_enc_proc(TMediaCtrlIntelliSnapParam *ptParam);
API_STATUS kd_send_jpeg_pic(char *pJpegData, int jpegDataLength);
API_STATUS kd_dpss_send_info(char *pJpegData, unsigned int jpegDataLength, 
                             unsigned int jpegInfo, unsigned int jpegInfoLength);
API_STATUS kd_send_jpeg_pic_link_add(unsigned int dstIp, unsigned int dstPort);
API_STATUS kd_get_send_pic_link_status(TIpcIntelliPicSendLinkStatus *pStatus);
API_STATUS kd_send_jpeg_pic_link_del(unsigned int delIp, unsigned int delPort);
API_STATUS kd_get_base_msg_num(unsigned int *pBaseMsgNum);
API_STATUS kd_get_base_soft_version(char *pVersionBuf, int bufLength);
API_STATUS kd_call_set_param(TMediaCtrlIntelliAlgParams *ptAlgParam);
API_STATUS kd_call_get_param(TMediaCtrlIntelliAlgParams *ptAlgParam);
API_STATUS kd_set_dpss_info(TDpssInfo *ptDpssInfo);
API_STATUS kd_get_dpss_info(TDpssInfo *ptDpssInfo);
API_STATUS kd_msg_ack(TIntelliMsgParam *ptMsgHandle, void* pContext);

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* __KD_COMM_IPC_PUBLIC_H__ */

