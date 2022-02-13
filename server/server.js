const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files');
const cloudinary = require('cloudinary');
const cors = require('cors');
const bodyParser = require('body-parser');
const { authCheckMiddleware } = require('./helpers/auth');

require('dotenv').config();

// express server
const app = express();

// db setup
const db = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CLOUD, {});
    console.log('DB connected');
  } catch (e) {
    console.log('DB connection error:', e);
  }
}

// execute db connection
db();

// middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

// typeDefs
const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './typeDefs')));
// resolvers
const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers')));

// graphql server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});


// applyMiddleware method connects ApolloServer to a specific HTTP framework, ie: express
apolloServer.applyMiddleware({ app });

// server
const httpserver = http.createServer(app);

app.get('/rest', authCheckMiddleware, (req, res) => {
  res.json({ data: 'you hit rest endpoint great' });
});

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload
app.post('/uploadImage', authCheckMiddleware, (req, res) => {
  cloudinary.v2.uploader.upload(
    req.body.image,
    {
      public_id: `${Date.now()}`,
      resource_type: 'auto'
    })
    .then((result) => {
      console.log('cloudinary upload result===', result);

      return res.send({
        url: result.secure_url,
        public_id: result.public_id,
      });
    })
    .catch(error => {
       return res.json({ success: false, error });
    });
});

app.post('/removeImage', authCheckMiddleware, (req, res) => {
  let image_id = req.body.public_id;

  cloudinary.v2.uploader.destroy(image_id, {}, (error, result) => {
    if (error) return res.json({ success: false, error });
    res.send('OK');
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is ready at http://localhost:${process.env.PORT}`);
  console.log(`GraphQL server is ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
});
