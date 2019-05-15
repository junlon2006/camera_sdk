#!/bin/sh

THIS_TOP=$(dirname $(pwd)/$0)
#THIS_TOP=$(cd "$(dirname "$0")"; pwd)

board=fixipc_v1r0
plat=netra
filesys=ubi
RELEASE_PATH=${THIS_TOP}/..
head=dm814x
name=netra_814x.pkg

if [ $# = 6 ]; then
	plat=$1
	filesys=$2
	board=$3
	RELEASE_PATH=$4
	head=$5
	name=$6
	echo "platform=${plat} filesys=${filesys} board=${board} release_path=${RELEASE_PATH} pkghead=${head}"
fi

OS_IMG_PATH=${THIS_TOP}/../../os/${plat}/${filesys}/${board}
PACK_BIN_TOOLS=${THIS_TOP}/../../tools/mkpkg/mkos

echo "###############################"
echo "get os image from  : ${OS_IMG_PATH}"
echo "release package to : ${RELEASE_PATH}"
echo "###############################"

if [ "${plat}" = "netra" ]; then
	${PACK_BIN_TOOLS}/mkos -b ${OS_IMG_PATH}/u-boot.bin -i ${OS_IMG_PATH}/update.linux -a ${OS_IMG_PATH}/${board}.${filesys} -v"$5&v7" -o ${RELEASE_PATH}/$6
else
	echo "[ERROR] : can find plat"
	exit 0
fi
