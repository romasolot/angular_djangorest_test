FROM ubuntu

ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y nodejs npm supervisor python3-pip python3 python3-dev libmysqlclient-dev

RUN mkdir /code
COPY ./RestServer /code
WORKDIR /code

ADD requirements.txt /code/
RUN pip3 install -r requirements.txt

#RUN python3 manage.py makemigrations
#RUN python3 manage.py makemigrations RestServer
#RUN python3 manage.py migrate

COPY ./client /code

ADD package.json /code/

RUN npm install

ADD bower.json /code/
ADD .bowerrc /code/

RUN apt-get install -y git
RUN npm install -g http-server

RUN nodejs node_modules/bower/bin/bower install --allow-root
RUN apt-get install -y nodejs-legacy
RUN apt-get install -y mysql-client
ADD seed.sql /code/
ADD seed.sh /code/
RUN chmod +x seed.sh