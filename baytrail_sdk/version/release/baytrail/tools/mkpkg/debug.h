/* ���Դ�����ļ��ѱ�δע���SourceFormatX��ʽ���� */
/* ������벻����Ӵ�����Ϣ������ע������������  */
/* ���������Ϣ�������վ: http://cn.textrush.com  */

#ifndef __COMMON_NAND_FLASH_H__
#define __COMMON_NAND_FLASH_H__

#define ARGUMENT_CMP(argc, str)	(0 == strcmp(argv[argc], str))
#define DEBUG

/* debug macro define */
#ifdef DEBUG
#define dprintf(fmt, args...) 	do{							\
					printf("%s(%d)@",				\
					__FUNCTION__, __LINE__);			\
					printf(fmt, ##args); 				\
				}while(0)

#define dprintfbin(buf, size)	do{	int i;						\
					printf("size is %d:", size);			\
					for(i = 0; i < size - 1; i++){			\
						if(0 == i % 16)				\
							printf("\n0x%04x: ", i);	\
						printf("%02x ", ((unsigned char*)buf)[i]);	\
					}						\
					printf("%02x\n", ((unsigned char*)buf)[i]);		\
				}while(0)

#define HALT			do{							\
					dprintf("HALT......\n");			\
					sleep(99999999);				\
				}while(0)
#else
#define dprintf(fmt, args...)
#define dprintfbin(buf, size)
#define HALT
#endif

#endif

