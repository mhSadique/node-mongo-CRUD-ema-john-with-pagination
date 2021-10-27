const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
app.use(cors());
app.use(express.json());

const dbPassword = process.env.DB_PASS;
const dbUser = process.env.DB_USER;

const { MongoClient } = require('mongodb');
const uri = `mongodb://${dbUser}:${dbPassword}@cluster0-shard-00-00.0gjnb.mongodb.net:27017,cluster0-shard-00-01.0gjnb.mongodb.net:27017,cluster0-shard-00-02.0gjnb.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-6k9h56-shard-0&authSource=admin&retryWrites=true&w=majority`;
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run () {
    try {
        await mongoClient.connect();
        const database = mongoClient.db('emmaJohnShop');
        const productsCollection = database.collection('products');
        
        // GET API
        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let products;
            const productsCount = await cursor.count();
            if (page) {
                products = await cursor.skip(page * size).limit(size).toArray();
            } else {
                products = await cursor.toArray();
            }
            res.send({
                productsCount,
                products
            });
        })
    
    } finally {
        // mongoClient.close(); 
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log('listering to port ' , port);
})