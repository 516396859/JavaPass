cd Q:\web\java-pass\pass
rmdir /s /q src
cd ../dev 
xcopy Q:\web\java-pass\dev\src Q:\web\java-pass\pass\src /s /e /y

cd ../pass
pnpm docs:dev