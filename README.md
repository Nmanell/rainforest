# rainforest
E-Commerce website utilizing Angular, Express and MongoDB. Site retrieves products from MongoDB, stores selected items locally, takes customer information, and uploads order data to MongoDB.

### Requirements:
macOS:
```
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

Linux:
```
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Running the program:
```
./start.sh
```
