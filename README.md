# Initialize project
please run ./init.sh where is located in coalition-python folder to start using.<br /><br />

# Some notes
there is an apikey that you need to provide, please change the expired api-key with your own up-to-date api key in ".env" file which is located on the /coalition-react root folder, the key name is REACT_APP_GEO_KEY.<br />
for api key: https://developer.here.com/products/geocoding-and-search<br /><br />

if you face any problems during initialization process run following commands on your terminal and run "./init.sh" again.<br />
docker stop dbcontainer<br />
docker rm $(docker ps -aq)<br />
docker rmi $(docker images -q)<br /><br />

node_modules are not added to .gitignore on purpose, just in case.

yasar soran