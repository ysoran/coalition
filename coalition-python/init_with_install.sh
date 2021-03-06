#!/bin/bash

brew update
brew install python
brew install pipenv
pip3 install -U Flask
pip3 install -U flask-cors
pip3 install -U Flask-SQLAlchemy
pip3 install -U marshmallow
pip3 install pyyaml
pip3 install psycopg2
brew install node
brew install yarn

docker build --tag dbimage .
docker run --publish 54320:5432 --detach --name dbcontainer dbimage

until nc -z -v localhost 54320
do
  echo "Waiting for database connection..."
  # wait for 5 seconds before check again
  sleep 5
done

python3 app.py &
cd "./../coalition-react"
yarn
yarn start 