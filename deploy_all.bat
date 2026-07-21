@echo off
echo Deploying Unified StreamVista Media OS to Vercel...
cd frontend-next
vercel --prod --yes
cd ..
echo Deployment complete!
