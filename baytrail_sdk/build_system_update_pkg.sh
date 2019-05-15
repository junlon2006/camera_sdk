#!/bin/bash

echo "*******************************************"
echo "         kedacom sdk for baytrail          "
echo "*******************************************"
cd ./prj_linux
/opt/baytrail/build_sdk.sh sdk

echo "*******************************************"
echo "              update pack baytrail	    	 "
echo "*******************************************"

cd ../version/release/baytrail/

rm -rf ./pkg/fixipc/*.tgz
rm -rf ./pkg/fixipc/*.pkg
rm -rf ./pkg/fixipc/*.bz2
rm -rf ./pkg/ptzipc/*.tgz
rm -rf ./pkg/ptzipc/*.pkg
rm -rf ./pkg/ptzipc/*.bz2
rm -rf ./../../*.pkg

if [ ! -f ./bin/ipcsrv ];then
echo "ipcsrv not exist!"
exit 0
fi

if [ ! -d lib/ ]; then mkdir ./lib/;fi
rm -rf ./lib/*.so
rm -rf ./lib/applib/*.so
cp -L -r -f ./../../../lib/*.so ./lib/
cp -L -r -f ./../../../lib/applib/*.so ./lib/applib/

if [ ! -d tmp/ ]; then mkdir ./tmp/;fi
rm -rf ./tmp/*
cp -L -r -f bin ./tmp/bin
cp -L -r -f config ./tmp/config
cp -L -r -f lib ./tmp/bin/lib
cp -L -r -f osd ./tmp/osd_tmp
cp -L -r -f web ./tmp/bin/web
cp -L -r -f bin/apploader ./tmp/bin/apploader
cp -L -r -f os/update.linux ./tmp/

cd ./tmp
chmod -R 777 * 
mv ./bin/ipcrun.sh ./
tar -zcvf upgrade_tmp.tgz bin osd_tmp config
tar -zcvf ./../pkg/fixipc/upgrade.tgz ipcrun.sh upgrade_tmp.tgz update.linux
rm -rf upgrade_tmp.tgz
cd ../

if [ ! -d imgmnt/ ]; then mkdir ./imgmnt/;fi
bunzip2 -k os/baytraili-release.img.bz2
mv os/baytraili-release.img ./
loopdev=`sudo kpartx -av ./baytraili-release.img | awk  'NR==2 { print $3 }' | awk '/loop*/'`
sudo mount /dev/mapper/$loopdev ./imgmnt
sudo cp -L -r -f ./tmp/bin/* ./imgmnt/usr/bin/
sudo cp -L -r -f ./tmp/ipcrun.sh ./imgmnt/usr/bin/
sudo cp -L -r -f ./tmp/config ./imgmnt/usr/config
sudo cp -L -r -f ./tmp/osd_tmp ./imgmnt/usr/osd
sudo umount /dev/mapper/$loopdev
sudo kpartx -d ./baytraili-release.img
bzip2 ./baytraili-release.img
mv ./baytraili-release.img.bz2 ./pkg/fixipc/
rm -rf ./baytraili-release.img
rm -rf imgmnt
rm -rf tmp

tools/mkpkg/mkpkg -b ./pkg/fixipc/upgrade.tgz -h E3845_185  -v "${PKG_VERSION}" -o ./pkg/fixipc/IPC121-Ei7N-X100.pkg
rm -rf ./pkg/fixipc/upgrade.tgz
rm -rf ./lib/*.so
rm -rf ./lib/applib/*.so
cp ./pkg/fixipc/IPC121-Ei7N-X100.pkg ./../../IPC121-Ei7N-X100.pkg

