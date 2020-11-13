openssl aes-256-cbc -K $encrypted_2d8c63ef40a5_key -iv $encrypted_2d8c63ef40a5_iv -in id_rsa.enc -out id_rsa -d
yarn && yarn build
scp -i id_rsa -r build/* "${SERVER_IP}":"${DOC_DIR}"
git config --global user.name "${GH_NAME}"
git config --global user.email "${GH_EMAIL}"
echo "machine github.com login ${GH_NAME} password ${GH_TOKEN}" > ~/.netrc
GIT_USER="${GH_NAME}" yarn deploy
