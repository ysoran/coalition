# Initialize project
Node, yarn, python, flask, flask-cors, Flask-SQLAlchemy, marshmallow, psycopg2, docker should be available on your machiene
please run ./init.sh which is located in coalition-python folder to start using.<br /><br />
# Update
With this update you will need only docker installed on your local machiene if you are using a mac pc
please run ./init_with_install.sh which is located in coalition-python folder to install all required packages <br /><br/>
# Some notes
There is an apikey that you need to provide, please change the expired api-key with your own up-to-date api key in ".env" file which is located on the /coalition-react root folder, the key name is REACT_APP_GEO_KEY.<br />
for api key: https://developer.here.com/products/geocoding-and-search<br /><br />
if you face any problems during initialization or you get any network on frontend please run following commands on your terminal and run "./init.sh" again.<br />
docker stop dbcontainer<br />
docker rm $(docker ps -aq)<br />
docker rmi $(docker images -q)<br /><br />

yasar soran