/*
 * auth: wangyuantao@kedacom.com
 * date: Tue Jan 16 14:46:02 CST 2007
 * description: 打包工具
 */
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <getopt.h>
#include <errno.h>
#include "debug.h"
#include "crc32.h"
//#include "parttable.h"

#undef dprintf
#define dprintf(fmt, args...)

/* 和升级程序中的数据结构统一 */
typedef struct _part_pos
{
	 /* 文件表项 */
	char partname[20];
	int start;
	int length;
	int crc;
} part_pos_t;

#define BUFFER_SIZE	(128)
typedef struct _pack_file_head
{
	 /* 文件头 */
	int filecrc;
	char verbose[BUFFER_SIZE];
	part_pos_t part[4];
} pack_file_head_t;
pack_file_head_t head = { 0 };

typedef struct _input_args
{
	int count;
	char content[BUFFER_SIZE];
} input_args_t;

/* 文件头crc大小 */
#define HEAD_FILECRC_SIZE		4

/* 升级文件中分区名 */
#define PART_NAME_BOOT			"BOOT"
#define PART_TABLE_NAME			"PART_TABLE"
#define PART_NAME_IOS			"IOS"
#define PART_NAME_APP			"APP"
#define PART_NAME_APPS			"APPS"
#define PART_NAME_USER			"USER"

#define ARGS_NUM            8
#define UNPACK_IMG_MAX         4

int mkos(const char *bootfile, const char *iosfile, const char *appfile, 
		const char *appsfile, const char *outfile);
int do_unpack(char *pkgfile);

int main(int argc, char *argv[])
{
	printf("version: %s %s\n", __DATE__, __TIME__);
	static struct option long_options[] =
	{
		{ "ios", required_argument, 0, 'i' } ,  /* ios */
		{ "app", required_argument, 0, 'a' } ,  /* app */
		{ "boot", required_argument, 0, 'b' } ,  /* boot */
		{ "apps", optional_argument, 0, 's' } ,  /* apps */
		{ "output", required_argument, 0, 'o' } ,  /* 输出 */
		{ "verbose", required_argument, 0, 'h' } ,  /* 包头校验信息 */
		{ "unpack", required_argument, 0, 'x' } ,  /* 解包 */
		{ "versioninfo", required_argument, 0, 'v' } ,  /* 业务版本信息，打包到pkg中,紧跟在verbose后面，两者间'\0'分割 */
		{ 0, 0, 0, 0 }
	};
	int param_error = 0; /* 解析过程中参数是否错误 */
	int char_option; /* 解析的名称缩写 */
	input_args_t inargs[ARGS_NUM];
       int unpack = 0;  /*解包处理*/
       
	memset(inargs, 0, sizeof(input_args_t) * ARGS_NUM);

	opterr = 0; /* 屏蔽getopt 的错误输出 */
	while (1)
	{
		char_option = getopt_long(argc, argv, "i:a:b:s:o:h:x:v:", long_options, NULL);
		if ( - 1 == char_option)
			break;

		switch (char_option)
		{
			case 'i':
				inargs[0].count++;
				strncpy(inargs[0].content, optarg, BUFFER_SIZE - 1);
				break;
			case 'a':
				inargs[1].count++;
				strncpy(inargs[1].content, optarg, BUFFER_SIZE - 1);
				break;
			case 'b':
				inargs[2].count++;
				strncpy(inargs[2].content, optarg, BUFFER_SIZE - 1);
				break;
			case 's':
				inargs[3].count++;
				strncpy(inargs[3].content, optarg, BUFFER_SIZE - 1);
				break;
			case 'o':
				inargs[4].count++;
				strncpy(inargs[4].content, optarg, BUFFER_SIZE - 1);
				break;
			case 'h':
				inargs[5].count++;
				printf("size: %d, string: %s\n", BUFFER_SIZE, optarg);
				strncpy(inargs[5].content, optarg, BUFFER_SIZE - 1);
				break;
	          case 'x':
                 inargs[6].count++;
                 printf("unpack file %s\n", optarg);
                 strncpy(inargs[6].content, optarg, BUFFER_SIZE - 1);
                 break;
			case 'v':
                 inargs[7].count++;
                 printf("version info %s\n", optarg);
                 strncpy(inargs[7].content, optarg, BUFFER_SIZE - 1);
				break;
						
			case '?':
				param_error = 1;
				break;
			default:
				param_error = 1;
				break;
		}
	}

	if (argc - optind)
	{
		param_error = 1;
	}

       if(inargs[6].count == 1 && argc == 3)//解包
            unpack++;
	else if (1 == inargs[0].count && 1 == inargs[1].count && 1 == inargs[2].count 
			&& inargs[3].count < 2 && 1 == inargs[4].count && 1 == inargs[5].count)//参数无误，-V(版本信息)参数不作限制，可有可无，V5版本没有相应的参数，V7有
			{}
	else // 参数错误
	{     
	       param_error = 1;
	}
	// 包头信息
	strncpy(head.verbose, inargs[5].content, BUFFER_SIZE - 1);
	printf("verbose is %s\n", head.verbose);
	// 版本信息
	strncpy((char*)head.verbose + strlen(head.verbose) + 1, inargs[7].content, strlen(inargs[7].content) + 1);
	printf("version info is %s\n", (char*)head.verbose + strlen(head.verbose) + 1);

	if (param_error)
	{
	        printf("===pack file===\n");
	        printf("usage: ./mkos -i ios -a app -b boot -s apps -v verbose -o output\n" \
			"       ./mkos --ios iosfile --app appfile --boot bootfile\n" \
			"              --apps appsfile --verbose info --output outputfile\n");
               printf("===or unpack file ===\n");
               printf("usage: ./mkos -x file.pkg\n");
		return  - 1;
	}

       if(unpack > 0){  //unpack file,
            if(do_unpack(inargs[6].content) != 0){
                printf("unpack file %s failed!\n", inargs[6].content);
                return -1;
            }else{
                printf("unpack file %s sucess!\n", inargs[6].content);
                return 0;
            }
       }
       
	if (0 != access(inargs[0].content, R_OK))
	{
		printf("file: %s not exist\n", inargs[0].content);
		return  - 1;
	}

	if (0 != access(inargs[1].content, R_OK))
	{
		printf("file: %s not exist\n", inargs[1].content);
		return  - 1;
	}

	if (0 != access(inargs[2].content, R_OK))
	{
		printf("file: %s not exist\n", inargs[2].content);
		return  - 1;
	}

	if (inargs[3].count)
	{
		if (0 != access(inargs[3].content, R_OK))
		{
			printf("file: %s not exist\n", inargs[3].content);
			return  - 1;
		}

		return mkos(inargs[2].content, inargs[0].content, inargs[1].content, 
				inargs[3].content, inargs[4].content);
	}
	else
	{
		return mkos(inargs[2].content, inargs[0].content, inargs[1].content, 
				NULL, inargs[4].content);
	}

	return 0;
}

int mkos(const char *bootfile, const char *iosfile, const char *appfile, 
		const char *appsfile, const char *outfile)
{
	//int crc = 0;
	struct stat filestat;

	dprintf("bootfile: %s, iosfile: %s, appfile: %s\n", bootfile, iosfile, appfile);
	if (appsfile)
		dprintf("appsfile exist: %s\n", appsfile);

	if ( - 1 == stat(bootfile, &filestat))
		return  - 1;
	strcpy(head.part[0].partname, PART_NAME_BOOT);
	head.part[0].start = sizeof(pack_file_head_t);
	head.part[0].length = filestat.st_size;
	head.part[0].crc = crc32_file(bootfile, 0,  - 1, 0);

	if ( - 1 == stat(iosfile, &filestat))
		return  - 1;
	strcpy(head.part[1].partname, PART_NAME_IOS);
	head.part[1].start = head.part[0].start + head.part[0].length;
	head.part[1].length = filestat.st_size;
	head.part[1].crc = crc32_file(iosfile, 0,  - 1, 0);

	if ( - 1 == stat(appfile, &filestat))
		return  - 1;
	strcpy(head.part[2].partname, PART_NAME_APP);
	head.part[2].start = head.part[1].start + head.part[1].length;
	head.part[2].length = filestat.st_size;
	head.part[2].crc = crc32_file(appfile, 0,  - 1, 0);

	if (appsfile)
	{
		if ( - 1 == stat(appsfile, &filestat))
			return  - 1;
		strcpy(head.part[3].partname, PART_NAME_APPS);
		head.part[3].start = head.part[2].start + head.part[2].length;
		head.part[3].length = filestat.st_size;
		head.part[3].crc = crc32_file(appsfile, 0,  - 1, 0);
	}
	{
		/* debug */
		int i;

		for (i = 0; i < 4; i++)
		{
			printf("partname: %s, start: %d, length: %d, crc: 0x%08x\n", 
					head.part[i].partname, head.part[i].start, 
					head.part[i].length, head.part[i].crc);
		}
	}

	printf("------------------------\n");
	{
		/* 计算文件头crc */
		char temp[1024];

		memset(temp, 0x00, 1024);
		memcpy(temp, &head, sizeof(head));
		printf("head size: %d, init crc: %d\n", sizeof(pack_file_head_t) - 4, head.filecrc);
		// dprintfbin(temp + 4, 256);
		head.filecrc = crc32_calc(temp + 4, sizeof(pack_file_head_t) - 4, 0);
	}
	printf("init file(after head calc) crc is 0x%08x\n", head.filecrc);
	head.filecrc = crc32_file(bootfile, 0,  - 1, head.filecrc);
	printf("total file(after bootfile) crc is 0x%08x\n", head.filecrc);
	head.filecrc = crc32_file(iosfile, 0,  - 1, head.filecrc);
	printf("total file(after iosfile) crc is 0x%08x\n", head.filecrc);
	head.filecrc = crc32_file(appfile, 0,  - 1, head.filecrc);
	printf("total file(after appfile) crc is 0x%08x\n", head.filecrc);
	if (appsfile)
	{
		head.filecrc = crc32_file(appsfile, 0,  - 1, head.filecrc);
		printf("total file(after appsfile) crc is 0x%08x\n", head.filecrc);
	}
	printf("result: total file crc is 0x%08x\n", head.filecrc);
	printf("------------------------\n");

	{
		int fd;
		char buffer[BUFFER_SIZE];
		int readlen;
		int fd_r;
		int filelen;
		int totallen = 0;

		if (0 == access(outfile, R_OK))
		{
			printf("file %s exist already, delete it now!\n", outfile);
			printf("------------------------\n");
			remove(outfile);
		}
		if ( - 1 == (fd = open(outfile, O_CREAT | O_RDWR, 0777)))
		{
			printf("can not create file: %s\n", outfile);
			return  - 1;
		}

		/* write head */
		filelen = 0;
		if ( - 1 == write(fd, &head, sizeof(pack_file_head_t)))
			goto write_err;
		filelen = sizeof(pack_file_head_t);
		totallen += filelen;
		printf("write head succ, len is %d(%d)\n", filelen, totallen);

		/* write bootfile */
		filelen = 0;
		if ( - 1 == (fd_r = open(bootfile, O_RDONLY)))
			goto write_err;
		while (1)
		{
			readlen = read(fd_r, buffer, BUFFER_SIZE);
			if (0 == readlen)
				break;
			if ( - 1 == readlen)
				goto write_err;
			if ( - 1 == write(fd, buffer, readlen))
				goto write_err;
			filelen += readlen;
		}
		close(fd_r);
		totallen += filelen;
		printf("write boot succ, len is %d(%d)\n", filelen, totallen);

		/* write iosfile */
		filelen = 0;
		if ( - 1 == (fd_r = open(iosfile, O_RDONLY)))
			goto write_err;
		while (1)
		{
			readlen = read(fd_r, buffer, BUFFER_SIZE);
			if (0 == readlen)
				break;
			if ( - 1 == readlen)
				goto write_err;
			if ( - 1 == write(fd, buffer, readlen))
				goto write_err;
			filelen += readlen;
		}
		close(fd_r);
		totallen += filelen;
		printf("write ios succ, len is %d(%d)\n", filelen, totallen);

		/* write appfile */
		filelen = 0;
		if ( - 1 == (fd_r = open(appfile, O_RDONLY)))
			goto write_err;
		while (1)
		{
			readlen = read(fd_r, buffer, BUFFER_SIZE);
			/*
			dprintfbin(buffer, 32);
			HALT;
			 */
			if (0 == readlen)
				break;
			if ( - 1 == readlen)
				goto write_err;
			if ( - 1 == write(fd, buffer, readlen))
				goto write_err;
			filelen += readlen;
		}
		close(fd_r);
		totallen += filelen;
		printf("write app succ, len is %d(%d)\n", filelen, totallen);

		/* write appsfile */
		filelen = 0;
		if (appsfile)
		{
			if ( - 1 == (fd_r = open(appsfile, O_RDONLY)))
				goto write_err;
			while (1)
			{
				readlen = read(fd_r, buffer, BUFFER_SIZE);
				if (0 == readlen)
					break;
				if ( - 1 == readlen)
					goto write_err;
				if ( - 1 == write(fd, buffer, readlen))
					goto write_err;
				filelen += readlen;
			}
			close(fd_r);
			totallen += filelen;
			printf("write apps succ, len is %d(%d)\n", filelen, totallen);
		}

		/* end write */
		close(fd);
		return 0;
		write_err: printf("write error: %d\n", errno);
	}

	return 0;
}

#define BUFSIZE         1024
int do_unpack(char *pkgfile)
{
    int pkg_fd, img_fd, length, img_index, crc, i;
    pack_file_head_t head = { 0 };
    char bootfile[] = "u-boot.bin";
    char iosfile[] = "update.linux";
    char appfile[] = "app.img";
    char appsfile[] = "apps.bin";
    char buff[BUFSIZE];
    char *img_file = NULL;
    if(pkgfile == NULL || 0 != access(pkgfile, R_OK)){
        printf("Input param invalid!");
        return -1;
    }
    memset(&head, 0 ,sizeof(pack_file_head_t));

    pkg_fd = open(pkgfile, O_RDONLY);
    if(pkg_fd < 0){
        printf("open file %s failed!\n", pkgfile);
        return -1;
    }

    length = read(pkg_fd, &head, sizeof(pack_file_head_t ));

    if (length  != sizeof(pack_file_head_t )){
    	printf("read file head error : %s\n", strerror(errno));
    	close(pkg_fd);
    	return -1;
    }

    printf("\n============================\n");
    if(head.verbose[0] != 0)
        printf("verbose : %s\n", head.verbose);

    printf("filecrc = %x", head.filecrc);

    printf("\n-----bootfile ----\n");
    //printf("%s\n", head.part[0].partname);
    printf("length = %u\n", head.part[0].length);
    printf("start = %u\n", head.part[0].start);

    printf("\n------iosfile-----\n");
    //printf("%s\n", head.part[1].partname);
    printf("length = %u\n", head.part[1].length);
    printf("start = %u\n", head.part[1].start);


    printf("\n-----appfile -------\n");
    //printf("%s\n", head.part[2].partname);
    printf("length = %u\n", head.part[2].length);
    printf("start = %u\n", head.part[2].start);

    if(head.part[3].partname[0] != 0){
        printf("\n------appsfile------\n");
        //printf("%s\n", head.part[3].partname);
        printf("length = %u\n", head.part[3].length);
        printf("start = %u\n", head.part[3].start);
    }
    printf("\n============================\n");

    crc = 0;
    for(img_index = 0; img_index < UNPACK_IMG_MAX; img_index++){
        if(head.part[img_index].partname[0] == 0)
            break;
        img_file = NULL;
        switch(img_index){
        case 0: // uboot
            img_file = bootfile;
            printf("unpack bootfile start\n");
            break;
        case 1: // update.linux
            img_file = iosfile;
            printf("unpack ios start\n");
            break;
        case 2: //app.img
            img_file = appfile;
            printf("unpack app start\n");
            break;
        case 3:
            img_file = appsfile;
            printf("unpack apps start\n");
            break;
        default:
            goto error;
        }

        if(0 == access(img_file, R_OK)){
		printf("file: %s already exist, remove it!\n", img_file);
		remove(img_file);
	 }
        img_fd = open(img_file, O_CREAT|O_TRUNC|O_WRONLY, 0744);
        if (img_fd < 0){
            printf("create %s error: %s\n", img_file, strerror(errno));
            goto error;
        }
        
        length = head.part[img_index].length;
        if( - 1 == lseek(pkg_fd, head.part[img_index].start, SEEK_SET)){
            printf("img %d file lseek failed!\n", img_index);
            goto err2;
        }
        // write img file
        for(i = 0; i < (length /BUFSIZE); i++){
		memset(buff, 0 , BUFSIZE);
        
		if(read(pkg_fd, buff, BUFSIZE) != BUFSIZE){
			printf("read error: %d\n", __LINE__);
			goto err2;
		}
        
		if(write(img_fd , buff, BUFSIZE) != BUFSIZE){
			printf("write error: %d\n", __LINE__);
			goto err2;
		}
	}

	if(length % BUFSIZE != 0){
		memset(buff, 0, BUFSIZE);
		if(read(pkg_fd, buff, length % BUFSIZE) != (length % BUFSIZE)){
			printf("read error :%d\n", __LINE__);
			goto err2;
		}
		if (write(img_fd, buff, length % BUFSIZE) != length % BUFSIZE){
			printf("write error: %d\n", __LINE__);
			goto err2;
		}
	}

	close(img_fd);
	crc = crc32_file(img_file, 0,  - 1, 0);

	if (crc == head.part[img_index].crc){
		printf("unpack img %d complete\n", img_index);
	}else{
		printf("img %d crc error\n", img_index);
		goto error;
	}         
    }


    printf("unpack file %s complete!\n", pkgfile);
    close(pkg_fd);
    return 0;

err2:
    close(img_fd);
error:
    close(pkg_fd);
    return -1;
}

