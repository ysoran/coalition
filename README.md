please run ./init.sh where is located in coalition-python folder to start using.

there is an apikey that you need to provide, please change the expired api-key with your own up-to-date api key in ".env" file which is located on the /coalition-react root folder, the key name is REACT_APP_GEO_KEY.

if you face any problems during initialization process run following commands on your terminal and run "./init.sh" again.
docker stop dbcontainer
# Delete all containers
docker rm $(docker ps -aq)
# Delete all images
docker rmi $(docker images -q)

yasar soran