#!/bin/sh

OLD_PATH=$(pwd)
WORK_PATH=/usr

export LD_LIBRARY_PATH='/lib:/usr/bin/lib'

if [ -d ${WORK_PATH}/web ]; then
echo "É¾³ý/usr/webÄ¿Â¼"
rm -rf ${WORK_PATH}/web
fi

cd ${WORK_PATH}/bin/
if [ -f upgrade_tmp.tgz ]; then 
echo "ÕýÔÚ½âÑ¹Éý¼¶Ñ¹Ëõ°ü"
rm -rf ${WORK_PATH}/bin/lib/applib/*
tar -zxvf ./upgrade_tmp.tgz -C ${WORK_PATH}/
if [ $? -eq 1 ];then
echo "½âÑ¹upgrade_tmp.tgzÊ§°Ü£¬É¾³ýÑ¹Ëõ°ü£¬ÖØÆô"
rm ./upgrade_tmp.tgz
reboot
sleep 10
fi
rm -rf ./upgrade_tmp.tgz

if [ -f ${WORK_PATH}/osd/label.bmp ];then
rm -rf ${WORK_PATH}/osd_tmp/label.bmp
fi
if [ -f ${WORK_PATH}/osd/time.bmp ];then
rm -rf ${WORK_PATH}/osd_tmp/time.bmp
fi
if [ -f ${WORK_PATH}/osd/alarm0.bmp ];then
rm -rf ${WORK_PATH}/osd_tmp/alarm0.bmp
fi
if [ -f ${WORK_PATH}/osd/alarm1.bmp ];then
rm -rf ${WORK_PATH}/osd_tmp/alarm1.bmp
fi
if [ -f ${WORK_PATH}/osd/alarm2.bmp ];then
rm -rf ${WORK_PATH}/osd_tmp/alarm2.bmp
fi
if [ -f ${WORK_PATH}/osd/alarm3.bmp ];then
rm -rf ${WORK_PATH}/osd_tmp/alarm3.bmp
fi
if [ -f ${WORK_PATH}/osd/user0.bmp ];then
rm -rf ${WORK_PATH}/osd_tmp/user0.bmp
fi
if [ -f ${WORK_PATH}/osd/user1.bmp ];then
rm -rf ${WORK_PATH}/osd_tmp/user1.bmp
fi
if [ -f ${WORK_PATH}/osd/user2.bmp ];then
rm -rf ${WORK_PATH}/osd_tmp/user2.bmp
fi
if [ -f ${WORK_PATH}/osd/user3.bmp ];then
rm -rf ${WORK_PATH}/osd_tmp/user3.bmp
fi
if [ -f ${WORK_PATH}/osd/user4.bmp ];then
rm -rf ${WORK_PATH}/osd_tmp/user4.bmp
fi
if [ -f ${WORK_PATH}/osd/user5.bmp ];then
rm -rf ${WORK_PATH}/osd_tmp/user5.bmp
fi
if [ -f ${WORK_PATH}/osd/alarm.bmp ];then
rm -rf ${WORK_PATH}/osd_tmp/alarm.bmp
fi
if [ -f ${WORK_PATH}/osd/mask.bmp ];then
rm -rf ${WORK_PATH}/osd_tmp/mask.bmp
fi
if [ -f ${WORK_PATH}/osd/moving.bmp ];then
rm -rf ${WORK_PATH}/osd_tmp/moving.bmp
fi
if [ -f ${WORK_PATH}/osd/scan.bmp ];then
rm -rf ${WORK_PATH}/osd_tmp/scan.bmp
fi
cp -Lrf ${WORK_PATH}/osd_tmp ${WORK_PATH}/osd
rm -rf ${WORK_PATH}/osd_tmp

mv -f ${WORK_PATH}/bin/lib/libimagelib_linux.so /lib/
mv -f ${WORK_PATH}/bin/lib/libimageunit_linux.so /lib/
mv -f ${WORK_PATH}/bin/lib/libimf.so /lib/
mv -f ${WORK_PATH}/bin/lib/libintlc.so.5 /lib/
mv -f ${WORK_PATH}/bin/lib/libjpegenc_linux.so /lib/
mv -f ${WORK_PATH}/bin/lib/libsvml.so /lib/
mv -f ${WORK_PATH}/bin/lib/libvidcomlib_linux.so /lib/
mv -f ${WORK_PATH}/bin/lib/libvideomanage_linux.so /lib/
mv -f ${WORK_PATH}/bin/lib/libvideounit_linux.so /lib/
fi

ln -sf ${WORK_PATH}/lib/gstreamer-1.0/libgstvideo4linux2.so ${WORK_PATH}/bin/lib/libgstvideo4linux2.so
ln -sf ${WORK_PATH}/bin/lib/libintlc.so ${WORK_PATH}/bin/lib/libintlc.so.5

[ -f "./ipdt" ] && ./ipdt
if [ -f "./amixer" ];then
./amixer cset numid=6 1
./amixer cset numid=5 40
./amixer cset numid=2 1
./amixer cset numid=1 60
fi
cd ${WORK_PATH}/bin/
chmod 777 rmipdt.sh
./rmipdt.sh
rm rmipdt.sh
[ -f "./apploader" ] && ./apploader &

cd ${OLD_PATH}

exit 0
