echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker build -t eesast/docs:latest .
docker push eesast/docs:latest

