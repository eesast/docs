yarn && yarn build
scp -o StrictHostKeyChecking=no -r build/* "${SERVER_USR}@${SERVER_IP}":"${DOC_DIR}"
git config --global user.name "${GH_NAME}"
git config --global user.email "${GH_EMAIL}"
echo "machine github.com login ${GH_NAME} password ${GH_TOKEN}" > ~/.netrc
GIT_USER="${GH_NAME}" yarn deploy
