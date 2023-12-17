echo "Starting app, Please wait..." && concurrently "npm run dev" "gnome-terminal --tab --working-directory=./api -e 'node main.js'"
