#!/bin/bash

echo "Waiting for mysql"
until mysql -h db -uroot -proot -e ';' restauth
do
  printf "."
  sleep 1
done

echo -e "\nmysql ready"

bower install --allow-root
python3 RestServer/manage.py migrate
python3 RestServer/manage.py initadmin
nohup npm start &
echo -e "\nhttp-server ready"
python3 RestServer/manage.py runserver 0.0.0.0:8000