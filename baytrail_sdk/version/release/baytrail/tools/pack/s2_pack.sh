#!/bin/sh

THIS_TOP=$(dirname $(pwd)/$0)
#THIS_TOP=$(cd "$(dirname "$0")"; pwd)

board=fixipc
plat=a5s
filesys=yaffs2
RELEASE_PATH=${THIS_TOP}/..

if [ $# = 4 ]; then
	plat=$1
	filesys=$2
	board=$3
	RELEASE_PATH=$4
	echo "platform=${plat} filesys=${filesys} board=${board} release_path=${RELEASE_PATH}"
fi

AMBOOT_DIR=${THIS_TOP}/amboot
OS_IMG_PATH=${THIS_TOP}/../../os/${plat}/${filesys}/${board}


if [ "${plat}" = "a5s" ]; then
#	ELF_TOOLCHAIN_PREFIX=/opt/ambarella/toolchain/arm-elf-4.4.2
#	LINUX_TOOLCHAIN_PREFIX=/opt/ambarella/toolchain
	ELF_TOOLCHAIN_PREFIX=/opt/toolchain/arm-elf-4.4.2
	LINUX_TOOLCHAIN_PREFIX=/opt/toolchain
	
	LINUX_TOOLCHAIN_NAME=arm-none-linux-gnueabi
	
	export ARM_LINUX_TOOLCHAIN_DIR=$LINUX_TOOLCHAIN_PREFIX/arm-2011.09
	export LINUX_TOOLCHAIN_VERSION=4.6.1
	
	export ARM_ELF_TOOLCHAIN_DIR=$ELF_TOOLCHAIN_PREFIX/arm-elf
	export ARM_ELF_CROSS_COMPILE=arm-elf-
	
	if [ -d $ARM_ELF_TOOLCHAIN_DIR/lib/gcc/arm-elf/4.4.2 ]; then
	ARM_ELF_VERSION=4.4.2
	else
	ARM_ELF_VERSION="Unknown version"
	fi
	
	export CROSS_COMPILE=$LINUX_TOOLCHAIN_NAME-
	export TOOLCHAIN_PATH=$ARM_LINUX_TOOLCHAIN_DIR/bin
	export SYS_LIB_DIR=$ARM_LINUX_TOOLCHAIN_DIR/$LINUX_TOOLCHAIN_NAME/libc/lib
	export PREBUILD_DIR=$LINUX_TOOLCHAIN_NAME
	export CPP_INCLUDE_DIR=$ARM_LINUX_TOOLCHAIN_DIR/$LINUX_TOOLCHAIN_NAME/include/c++/$LINUX_TOOLCHAIN_VERSION
	export CPP_INCLUDE_DIR_TOOLCHAIN=$ARM_LINUX_TOOLCHAIN_DIR/$LINUX_TOOLCHAIN_NAME/include/c++/$LINUX_TOOLCHAIN_VERSION/$LINUX_TOOLCHAIN_NAME
	
	unset ELF_TOOLCHAIN_PREFIX
	unset LINUX_TOOLCHAIN_PREFIX
	
	echo "======================= a5s ========================"
	echo "ELF TOOLCHAIN PATH: $ARM_ELF_TOOLCHAIN_DIR"
	echo "ELF TOOLCHAIN NAME: $ARM_ELF_CROSS_COMPILE"
	echo "ELF TOOLCHAIN VERSION: $ARM_ELF_VERSION"
	echo "TOOLCHAIN PATH: $ARM_LINUX_TOOLCHAIN_DIR"
	echo "TOOLCHAIN NANE: $LINUX_TOOLCHAIN_NAME"
	echo "TOOLCHAIN VERSION: $LINUX_TOOLCHAIN_VERSION"
	echo "==============================================="

	MAKE_OPT="AMBARELLA_ARCH=${plat} RELEASEDIR=${OS_IMG_PATH} APP=${OS_IMG_PATH}/${board}.${filesys} AMB_TOPDIR=${RELEASE_PATH}"
elif [ "${plat}" = "s2" ]; then
	ELF_TOOLCHAIN_PREFIX=/opt/ambarella/s2/toolchain
	export ARM_ELF_TOOLCHAIN_DIR=$ELF_TOOLCHAIN_PREFIX/arm-elf
	export ARM_ELF_CROSS_COMPILE=arm-elf-
	unset ELF_TOOLCHAIN_PREFIX
	
	echo "===================== S2 ============================"
	echo "ELF TOOLCHAIN PATH: $ARM_ELF_TOOLCHAIN_DIR"
	echo "ELF TOOLCHAIN NAME: $ARM_ELF_CROSS_COMPILE"
	echo "======================================================"

	MAKE_OPT="AMBARELLA_ARCH=${plat} RELEASEDIR=${OS_IMG_PATH} APP=${OS_IMG_PATH}/${board}.img"
else
	echo "[ERROR] : can find plat"
	exit 0
fi

#PRV_IMG_RELEASE_PATH=${THIS_TOP}
#
#AMBOOT_DIR=${THIS_TOP}/amboot
#OS_IMG_PATH=${THIS_TOP}/../../os/${plat}/${filesys}/${board}
#
#MAKE_OPT="AMBARELLA_ARCH=${plat} RELEASEDIR=${OS_IMG_PATH} APP=${OS_IMG_PATH}/${board}.${filesys}"
##MAKE_OPT="AMBARELLA_ARCH=${plat} RELEASEDIR=${OS_IMG_PATH} AMB_TOPDIR=${THIS_TOP}"
#
#echo "###############################"
#echo "get os image from ${OS_IMG_PATH}"
#echo "###############################"
#
#echo "amboot dir : ${AMBOOT_DIR}"
##echo "this top dir :${TOP_DIR}"
#echo "${PRV_IMG_RELEASE_PATH}"
#
#ln -sf ${OS_IMG_PATH}/.config  ${PRV_IMG_RELEASE_PATH}/.config
#ln -sf ${OS_IMG_PATH}/config.h ${PRV_IMG_RELEASE_PATH}/config.h
#
#make -s AMBARELLA_ARCH=${plat} -C ${AMBOOT_DIR}/build clean
#make -s ${MAKE_OPT} -C ${AMBOOT_DIR}/build build_fw
#


#MAKE_OPT="AMBARELLA_ARCH=${plat} RELEASEDIR=${OS_IMG_PATH} APP=${OS_IMG_PATH}/${board}.${filesys}"

echo "###############################"
echo "get os image from  : ${OS_IMG_PATH}"
echo "amboot dir         : ${AMBOOT_DIR}"
echo "release package to : ${RELEASE_PATH}"
echo "###############################"


cp -rf ${AMBOOT_DIR} ${RELEASE_PATH}/

cp -rf ${OS_IMG_PATH}/.config  ${RELEASE_PATH}/.config
cp -rf ${OS_IMG_PATH}/config.h ${RELEASE_PATH}/config.h

make -s AMBARELLA_ARCH=${plat} -C ${RELEASE_PATH}/amboot/build clean
make -s ${MAKE_OPT} -C ${RELEASE_PATH}/amboot/build build_fw
