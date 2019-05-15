#include "stdio.h"
#include "stdlib.h"
#include "string.h"
#include "sys/types.h"
#include "sys/stat.h"
#include "getopt.h"
#define BUFFER_SIZE 128
#define ARGS_NUM 4 
#define FILE_BUFFER_SIZE 40*1024*1024
typedef struct _input_args
{
	int count;
	char content[BUFFER_SIZE];
}input_args_t;

typedef struct _pkg_head
{
	int dwcrc;
	char chHeadinfo[BUFFER_SIZE];
}pkg_head_info;

int main(int argc,char *argv[])
{
	printf("mkpkg version : %s ,%s \n",__DATE__,__TIME__);
//	printf("argc :%d \n",argc);
	FILE *fp = NULL;
	char *pchFileBuffer = NULL;
	char *pTemp = NULL;
	int dwFileLen = 0;
	input_args_t args_list[ARGS_NUM];
	int dwRtn_getopt = 0;
	int dwParam_error = 0;
	pkg_head_info  head = {0};
	static struct option long_options[]=
	{
		{"pkghead",required_argument,0,'h'},
		{"output",required_argument,0,'o'},
		{"bin",required_argument,0,'b'},
		{"version", required_argument, 0, 'v'},
		{0,0,0,0}
	};
	while(1)
	{
		dwRtn_getopt = getopt_long(argc, argv, "h:o:b:v:",long_options,NULL);
		if( -1 == dwRtn_getopt )
		{
			break;
		}
		switch (dwRtn_getopt)
		{
			case 'h': args_list[0].count++;//pkgåŒ…å¤´ä¿¡æ¯
				strncpy(args_list[0].content,optarg,BUFFER_SIZE-1);
				printf("content0 : %s \n",args_list[0].content);
				break;
			case 'o':
				args_list[1].count++;//è¦ç”Ÿæˆçš„æ–‡ä»¶å
				strncpy(args_list[1].content,optarg,BUFFER_SIZE-1);
				printf("content1 : %s \n",args_list[1].content);
				break;
			case 'b':
				args_list[2].count++;//è¢«æ‰“åŒ…çš„æ–‡ä»¶
				strncpy(args_list[2].content,optarg,BUFFER_SIZE-1);
				printf("content2 : %s \n",args_list[2].content);
				break;
			case 'v':// Í·²¿ÐÅÏ¢ÓÐÁ½²¿·Ö×é³É£¬-h²ÎÊýÀïµÄE2PROMÐÅÏ¢ + ÒµÎñÈí¼þ°æ±¾ºÅ
				args_list[3].count ++;
				strncpy(args_list[3].content,optarg,BUFFER_SIZE-1);
				printf("content3 : %s \n",args_list[3].content);
				break;
			default:
				dwParam_error = 1; 
				printf("arg param error\n");
				break;
		}	
	}
	if (argc - optind)
	{
		dwParam_error = 1;
	}
	if( 0 != dwParam_error)
	{
		printf("make pkg param error\n");
		return -1;
	}
	// E2PROMÐÅÏ¢ + ÒµÎñÈí¼þ°æ±¾ºÅ³¤¶È¹ý´ó
	if( strlen(args_list[0].content) + strlen(args_list[3].content) > BUFFER_SIZE - 2 )
	{
		printf("make pkg -h and -v params error\n");
		return -1;
	}
	strncpy(head.chHeadinfo,args_list[0].content,BUFFER_SIZE-1); // E2PROMÐÅÏ¢
	strncpy((char*)head.chHeadinfo + strlen(head.chHeadinfo) + 1, args_list[3].content, strlen(args_list[3].content)+1);// ÒµÎñ°æ±¾ºÅ

	// ½«&Ìæ»»³É\0
	pTemp = (char*)head.chHeadinfo + strlen(head.chHeadinfo) + 1;
	while(*pTemp != '\0')
	{
		if(*pTemp == '&')
			*pTemp = '\0';

		pTemp ++;
	}
	
	head.dwcrc = crc32_file(args_list[2].content,0,-1,0); 
	printf("chHeadinfo :%s crc :0x%x \n",head.chHeadinfo,head.dwcrc);
	fp = fopen(args_list[2].content,"rb+");
	if (NULL == fp)
	{
		printf("open :%s file failed\n",args_list[2].content);
		return -1;
	}
	pchFileBuffer = (char*)malloc(FILE_BUFFER_SIZE*sizeof(char));
	if (NULL == pchFileBuffer)
	{
		printf("pchFileBuffer malloc failed\n");
		return -1;
	}
	dwFileLen = fread(pchFileBuffer,sizeof(char),FILE_BUFFER_SIZE,fp);
	fclose(fp);
	fp = fopen(args_list[1].content,"wb+");
	if (NULL == fp)
	{
		printf("open file :%s failed\n",args_list[1].content);
		return -1;
	}
	fwrite(&head,sizeof(char),sizeof(head),fp);
	fwrite(pchFileBuffer,sizeof(char),dwFileLen,fp);
	fclose(fp);
	fp = NULL;
	return 0;
}
