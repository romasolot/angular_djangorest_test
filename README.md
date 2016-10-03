# angular_djangorest_test

Run

docker-compose build db

docker-compose build web

docker-compose up db

docker-compose run web python3 RestServer/manage.py migrate

docker-compose run web python3 RestServer/manage.py createsuperuser

docker-compose run web sh /code/seed.sh

docker-compose up web

docker-compose up client



Frontend - http://localhost:9000/

Admin area - http://localhost:8000/admin/

API - http://localhost:8000/
