#!/bin/bash

PRE_DIR=$(pwd)
PRE_DIR_1=`echo "$PRE_DIR" | awk -F "ipc_vob" '{print $1}'`
PRE_DIR_2=`echo "$PRE_DIR" | awk -F "ipc_vob" '{print $2}'`
CUR_DIR=$(cd `dirname $0` && pwd -P)


IMGMOUNTPOINT=$CUR_DIR/imgmnt
SRCMODEL=$1
echo "src model:$SRCMODEL"

function do_build
{
 #       sudo -S mount -o bind /proc $IMGMOUNTPOINT/proc
 #       sudo -S mount -o bind /proc $IMGMOUNTPOINT/proc
 #       sudo -S mount -o bind /dev $IMGMOUNTPOINT/dev
 #       sudo -S mount -o bind /dev/pts $IMGMOUNTPOINT/dev/pts
 #       sudo -S mount -o bind /sys $IMGMOUNTPOINT/sys
        
	sudo -S mkdir -p  $IMGMOUNTPOINT/src
	sudo -S mount -o bind $PRE_DIR_1"ipc_vob" $IMGMOUNTPOINT/src

	if [ "${SRCMODEL}" = "ipcapploader" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/apploader.txt"
		MAKEFILE="makefile_apploader_baytrail"
	elif [ "${SRCMODEL}" = "ipccore" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/ipccore.txt"
		MAKEFILE="makefile_baytrail"
	elif [ "${SRCMODEL}" = "ipcuser" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/ipcuser.txt"
		MAKEFILE="makefile_user_baytrail"
	elif [ "${SRCMODEL}" = "ipcuser_ipdt" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/ipcuser.txt"
		MAKEFILE="makefile_user_ipdt_baytrail"
	elif [ "${SRCMODEL}" = "ipctest" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/ipcsrv_baytrail.txt"
		MAKEFILE="makefile_ipctest_baytrail"
	elif [ "${SRCMODEL}" = "ipcsrv" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/ipcsrv_baytrail.txt"
		MAKEFILE="makefile_baytrail"
	elif [ "${SRCMODEL}" = "kdsnmp" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/kdsnmp.txt"
		MAKEFILE="makefile_baytrail"
	elif [ "${SRCMODEL}" = "kdvsys" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/kdvsys.txt"
		MAKEFILE="makefile_baytrail"
	elif [ "${SRCMODEL}" = "irpdata" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/rpdatabaytrail.txt"
		MAKEFILE="makefile_linux_baytrail_r"
	elif [ "${SRCMODEL}" = "irpstream" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/rpstreambaytrail.txt"
		MAKEFILE="makefile_linux_baytrail_r"
	elif [ "${SRCMODEL}" = "osp_small" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/osp_smallbaytrail.txt"
		MAKEFILE="makefile_linux_baytrail_r"
	elif [ "${SRCMODEL}" = "ipdt" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/ipdt_baytrail_r.txt"
		MAKEFILE="makefile_baytrail_release"
	elif [ "${SRCMODEL}" = "appbase" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/appbase_baytrail_release.txt"
		MAKEFILE="makefile_appbase_baytrail_release"
	elif [ "${SRCMODEL}" = "onvifapp" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/onvifapp_baytrail_release.txt"
		MAKEFILE="makefile_onvifapp_baytrail_release"
	elif [ "${SRCMODEL}" = "rtspapp" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/rtspapp_baytrail_release.txt"
		MAKEFILE="makefile_rtspapp_baytrail_release"
	elif [ "${SRCMODEL}" = "goahead" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/goahead_baytrail_r.txt"
		MAKEFILE="goahead-baytrail-default.mk"
	elif [ "${SRCMODEL}" = "rtsp" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/rtsp_baytrail_release.txt"
		MAKEFILE="makefile_linux_baytrail_r"
	elif [ "${SRCMODEL}" = "mxml" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/mxml_baytrail_r.txt"
		MAKEFILE="makefile_mxml_baytrail_release"
	elif [ "${SRCMODEL}" = "exosip2" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/exosip2_baytrail_r.txt"
		MAKEFILE="makefile_exosip2_baytrail_release"
	elif [ "${SRCMODEL}" = "sip" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/sip_baytrail_r.txt"
		MAKEFILE="makefile_sip_baytrail_release"
	elif [ "${SRCMODEL}" = "gb28181app" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/gb28181app_baytrail_r.txt"
		MAKEFILE="makefile_gb28181app_baytrail_release"
	elif [ "${SRCMODEL}" = "netpacket" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/netpacket_baytrail_r.txt"
		MAKEFILE="makefile_baytrail_r"
	elif [ "${SRCMODEL}" = "medianet" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/medianet_baytrail_r.txt"
		MAKEFILE="makefile_baytrail_r"
	elif [ "${SRCMODEL}" = "vsipstack" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/vsipstack.txt"
		MAKEFILE="makefile_linux_baytrail_r"
	elif [ "${SRCMODEL}" = "vsipapp" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/vsipapp.txt"
		MAKEFILE="makefile_baytrail_r"
	elif [ "${SRCMODEL}" = "cgiapp" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/cgiapp_a5s_release.txt"
		MAKEFILE="makefile_cgiapp_baytrail_release"
	elif [ "${SRCMODEL}" = "kdvdns" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/kdvdns_baytrail_release.txt"
		MAKEFILE="makefile_linux_baytrail_r"
	elif [ "${SRCMODEL}" = "ipdtagentapp" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/ipdtagentapp_baytrail_r.txt"
		MAKEFILE="makefile_ipdtagentapp_baytrail_release"
	elif [ "${SRCMODEL}" = "sipapp" ]; then
		LOG_PATH="/src/10-common/version/compileinfo/sipapp_baytrail_r.txt"
		MAKEFILE="makefile_sipapp_baytrail_release"
	else
		LOG_PATH="/src/10-common/version/compileinfo/apploader.txt"
		MAKEFILE="makefile_apploader_baytrail"
	fi

	sudo -S chroot $IMGMOUNTPOINT /bin/bash <<EOFBASHINSTALL
	/bin/bash <<EOFFILE1	
	whoami 

	cd /src$PRE_DIR_2
	make -e DEBUG=0 -f $MAKEFILE clean
	if [ "${SRCMODEL}" = "ipccore" ]; then
		make -e DEBUG=0 -f $MAKEFILE $ple 2>> $LOG_PATH
	else
		make -e DEBUG=0 -f $MAKEFILE 2>&1 |tee $LOG_PATH
	fi

	exit
EOFFILE1
	exit
EOFBASHINSTALL
	sleep 1
 #      sudo -S umount  $IMGMOUNTPOINT/proc
 #      sudo -S umount  $IMGMOUNTPOINT/proc
 #      sudo -S umount  $IMGMOUNTPOINT/dev/pts
 #      sudo -S umount  $IMGMOUNTPOINT/dev
 #      sudo -S umount  $IMGMOUNTPOINT/sys
        sudo -S umount  $IMGMOUNTPOINT/src
 #      sudo -S rm $IMGMOUNTPOINT/src -rf
}

do_build
