/* ���Դ�����ļ��ѱ�δע���SourceFormatX��ʽ���� */
/* ������벻����Ӵ�����Ϣ������ע������������  */
/* ���������Ϣ�������վ: http://cn.textrush.com  */

#ifndef __CRC32_COMMON_H__
#define __CRC32_COMMON_H__

int crc32_calc(const char *buffer, int len, int _init_crc);
/*
 * ˵��������crcֵ
 * ������buffer �� len��Ҫ����crcֵ�Ļ���ͳ���
 *	 _init_crc ��crc��ʼֵ
 * ���أ�crcֵ
 */

int crc32_cmp(const char *buffer, int len, int crc);
/*
 * ˵����Ч��crcֵ
 * ���������壬���Ⱥ�crcֵ
 * ���أ�Ч��ɹ�����0������ֵΪʧ��
 */

int crc32_file(const char *filename, int offset, int filelen, int _init_crc);

#endif

