export PATH=$(pwd)/node_modules/node/bin:$PATH
yarn
yarn pm2 stop 0 && yarn pm2 delete 0
yarn build && yarn start && yarn pm2 logs