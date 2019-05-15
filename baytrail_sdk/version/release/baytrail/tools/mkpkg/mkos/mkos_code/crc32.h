/* 这份源代码文件已被未注册的SourceFormatX格式化过 */
/* 如果您想不再添加此类信息，请您注册这个共享软件  */
/* 更多相关信息请访问网站: http://cn.textrush.com  */

#ifndef __CRC32_COMMON_H__
#define __CRC32_COMMON_H__

int crc32_calc(const char *buffer, int len, int _init_crc);
/*
 * 说明：计算crc值
 * 参数：buffer 和 len是要计算crc值的缓冲和长度
 *	 _init_crc 是crc初始值
 * 返回：crc值
 */

int crc32_cmp(const char *buffer, int len, int crc);
/*
 * 说明：效验crc值
 * 参数：缓冲，长度和crc值
 * 返回：效验成功返回0，其他值为失败
 */

int crc32_file(const char *filename, int offset, int filelen, int _init_crc);

#endif

