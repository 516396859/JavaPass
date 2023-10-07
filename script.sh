#!/bin/bash
cd /home/cheney/development/dev/web/
# 删除本地仓库目录
rm -rf github
# mkdir github
# 配置本地目录
LOCAL_DIR=/home/cheney/development/dev/web/github/
# 执行克隆操作
echo Cloning dev branch from GitHub...
# 进入本地仓库目录
mkdir github
cd "${LOCAL_DIR}"


git init
git remote add origin https://github.com/516396859/JavaPass.git 
# 拉取最新的代码更新
echo "Pulling latest changes from dev branch..."
git pull origin dev

echo "Dev branch pull completed."
# 将下载后的文件复制到上级目录pass下
echo "Copying files to pass directory..."
cp -r ./src  ../pass
cp -r ./package.json  ../pass

cd ../pass
pnpm docs:dev
echo "Starting project... , please visit http://localhost:8080"


 