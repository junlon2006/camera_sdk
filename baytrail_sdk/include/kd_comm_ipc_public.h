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
    EXTER_MSG_BASE = MSG_BASE_NUM,                              //该消息为偏移量，不可更改

    //add new msg from here, such as
    MSG_TEST_GET = MSG_BASE_NUM + 1,                            //用于demo演示，GET消息为WEB获取IPC信息，GET消息有回复。
    MSG_TEST_SET = MSG_BASE_NUM + 2,                            //用于demo演示，SET消息为WEB设置IPC信息，SET消息无回复。
}EIntelliMsgType;                                               //第一个有效消息，必须从MSG_BASE_NUM + 1开始，否则无效。

typedef struct
{
    int nSubCapChn;                                             //采集子通道号，0 主流大图，1副流小图
    unsigned int dwOffsetX;                                     //有效数据的X偏移
    unsigned int dwOffsetY;                                     //有效数据的Y偏移
    unsigned int dwWidth;                                       //有效数据宽度
    unsigned int dwPicth[ALG_MAX_VID_DAT_PLANES];               //整个数据区域宽度
    unsigned int dwHeight;                                      //有效数据高度
    EAlgVidDateFormat eDateFormat;                              //采集数据类型
    unsigned char *pbyPhyAddr[ALG_MAX_VID_DAT_PLANES];          //数据存储物理地址
    unsigned char *pbyVirAddr[ALG_MAX_VID_DAT_PLANES];          //数据存储虚拟地址
    void *pvExternSei;                                          //扩展sei信息指针
    unsigned int dwExternSeiLen;                                //扩展Sei信息长度
    unsigned long long qwTimeStamp;                             //时间戳
}TAlgVidCapFrameInfo;                                           //采集帧数据信息

typedef struct
{
    TAlgVidCapFrameInfo tFrameInfo[ALG_MAX_VID_SUB_CAP_NUM];
    unsigned int dwFrameNum;                                    //实际有效帧数//
}TAlgVidCapFrameInfoEx;

typedef struct
{
    unsigned long long qwBufTimeStamp[ALG_MAX_INTELLI_BUF_NUM]; //缓存buf的链表，用时间戳做标示
    unsigned int dwBufNum;                                      //buf数
}TAlgBufList;

typedef struct
{
    TAlgBufList ptFreeBufList;                                  //本次算法输出后可释放的buffer
    TAlgBufList ptSnapBufList;                                  //本次算法输出后需要抓拍的buffer
}TAlgBufInfo;

typedef struct
{
    EMediaType eMediaType;                                      //算法处理物理核心标识
    void *pvAlgHandle;                                          //算法Handle
    void *pvAlgInitParams;                                      //算法初始化输入参数指针
    int l32AlgInitParamsSize;                                   //算法初始化输入参数长度
}TAlgInitPackage;

typedef struct
{
    TAlgVidCapFrameInfoEx tFrameInfoEx;                         //采集帧信息
    void *pvAttachInfo;                                         //算法输入附加信息
    int l32AttachInfoLength;                                    //算法输入附加信息长度
}TAlgProcessInput;

typedef struct
{
   	TAlgBufInfo tbufInfo;                                       //交互信息，需要媒体控制层定义
    void *pvAlgOutput;                                          //pvAlgOutput = NULL;时，媒体控制层不需要回传结果
    int algOutputLength;                                        //algOutputLength = 0;时，媒体控制层不需要回传结果
}TAlgProcessOutput;

typedef struct
{
    EMediaType eMediaType;                                      //算法处理物理核心标识
    void *pvAlgHandle;                                          //算法Handle
    TAlgProcessInput *ptAlgProcessInput;                        //算法输入指针
}TAlgProcessPackage;

typedef struct
{
    EMediaType eMediaType;                                      //算法处理物理核心标识
    void *pvAlgHandle;                                          //算法Handle
    void *pvAlgGetParams;                                       //获取算法参数指针
    int l32AlgGetParamsSize;                                    //参数长度
}TAlgGetParamsPackage;

typedef struct
{
    EMediaType eMediaType;                                      //算法处理物理核心标识
    void *pvAlgHandle;                                          //算法Handle
    void *pvAlgSetParams;                                       //设置算法参数指针 
    int l32AlgSetParamsSize;                                    //设置算法参数长度
}TAlgSetParamsPackage;           

typedef struct
{
    EMediaType eMediaType;                                      //算法处理物理核心标识
    void *pvAlgHandle;                                          //算法Handle
    void *pvAlgGetStatus;                                       //获取算法状态指针 
    int l32AlgGetStatusSize;                                    //状态信息长度
}TAlgGetStatusPackage;

typedef struct
{
    unsigned long long qwBufTimeStamp[ALG_MAX_INTELLI_BUF_NUM]; //缓存buf的链表，用时间戳做标示
    unsigned int dwBufNum;                                      //buf数
}TMediaCtrlIntelliAlgBufList;

typedef struct
{
    TMediaCtrlIntelliAlgBufList ptSnapBufList;                  //本次算法输出后需要抓拍的buffer
    void *pvAlgOutput;                                          //算法输出的结果
    unsigned int dwAlgOutputLength;                             //算法输出长度
}TMediaCtrlIntelliAlgOutputInfo;

typedef struct
{
    void *pvAlgHandle;                                          //算法Handle
    void *pvAlgStatus;                                          //获取算法状态指针
    unsigned int dwAlgStatusLen;                                //状态信息长度
}TMediaCtrlIntelliAlgStatusInfo;

typedef struct
{
    unsigned short wStartX;                                     //图片相对左上角水平距离
    unsigned short wStartY;                                     //图片相对左上角垂直距离
    unsigned short wWidth;                                      //图片宽度
    unsigned short wHeight;                                     //图片高度
}TMediaCtrlRectRegion;

typedef struct
{
    int bCorp;                                                  //是否需要编码裁剪编码 TURE时下面的区域有效
    TMediaCtrlRectRegion tEncRegion;                            //编码区域
    unsigned int dwJpegQuality;                                 //图片质量0-99
    unsigned long long qwTimeStamp;                             //时间戳
    unsigned int dwSnapIndex;                                   //抓拍索引号，用于区分同一数据的不同次抓拍
    int bBufCanFree;                                            //标记buffer是否已经完成所有编码，可释放
}TMediaCtrlIntelliSnapParam;

typedef struct
{
    int supportMaxLinkNum;                                      //发图支持的最大链接数
    int usedLinkNum;                                            //发图已使用的链接数
    int unusedLinkNum;                                          //发图未使用的链接数
}TIpcIntelliPicSendLinkStatus;

typedef struct
{
    void *pvAlgHandle;                                          //算法Handle
    void *pvParams;                                             //设置算法参数指针
    unsigned int dwParamsLen;                                   //设置算法参数长度
}TMediaCtrlIntelliAlgParams;

typedef struct
{
    EIntelliMsgType eMsgtype;                                   //消息类型
    unsigned char* msgBuf;                                      //透传消息BUF首指针
    unsigned int msgLength;                                     //透传消息长度
}TIntelliMsgParam;

typedef struct
{
    char s8Ip[16];                                              //DPSS服务器地址
    unsigned int u32Port;                                       //DPSS服务器端口
    int status;                                                 //DPSS服务状态
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

