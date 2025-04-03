@echo off

:: Start Laravel (PHP Artisan Serve)
echo Starting Laravel project...
cd /d "D:\programmation2\my prived shool project\project\private_school\PrivateSchoolManagement\LaravelBackEnd"
start php artisan serve

:: Start Node.js (Express Server)
echo Starting Express project...
cd /d "D:\programmation2\my prived shool project\project\private_school\PrivateSchoolManagement\ExpressBackEnd"
start node ./src/server.js

:: Start React (npm run dev)
echo Starting React project...
cd /d "D:\programmation2\my prived shool project\project\private_school\PrivateSchoolManagement\ReactFrontEnd"
start npm run dev

:: Start Tailwind watcher
echo Starting Tailwind CSS watcher...
cd /d "D:\programmation2\my prived shool project\project\private_school\PrivateSchoolManagement\ReactFrontEnd"
start npm run tailwind:watch

echo All projects started.
pause
