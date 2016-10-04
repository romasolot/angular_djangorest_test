FROM ubuntu

ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y nodejs npm supervisor python3-pip python3 python3-dev libmysqlclient-dev nodejs-legacy mysql-client git

RUN mkdir /code
COPY ./RestServer /code
WORKDIR /code

ADD requirements.txt /code/
RUN pip3 install -r requirements.txt

COPY ./client /code

ADD package.json /code/

RUN npm install
RUN npm install -g http-server bower

ADD bower.json /code/
ADD .bowerrc /code/

ADD runserver.sh /code/
RUN chmod +x runserver.sh

#RUN python3 manage.py makemigrations
#RUN python3 manage.py makemigrations RestServer
#RUN python3 manage.py migrate