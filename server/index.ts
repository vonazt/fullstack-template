import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { DataSchema } from './graphql';

dotenv.config();

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@violet.zoqgo.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true },
    );
    console.log(`Connected to MongoDB`);
  } catch (err) {
    console.error(`Error connecting to MongoDB`, err);
  }

  const schema = await buildSchema({ resolvers: [DataSchema] });

  const server = new ApolloServer({
    schema,
  });

  const app = express();

  server.applyMiddleware({ app, path: '/graphql' });

  app.listen({ port: process.env.SERVER_PORT }, () => {
    console.log(
      `Apollo Server on http://localhost:${process.env.SERVER_PORT}/graphql`,
    );
  });
};

start();
