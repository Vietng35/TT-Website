import "reflect-metadata";
import { ApolloServer } from '@apollo/server';
import { myDataSource } from "./app-data-source";
import cors from "cors";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


const schema = makeExecutableSchema({ typeDefs, resolvers })

const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql'
})

const wsServerCleanup = useServer({ schema }, wsServer)

async function startServer() {
  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      {
        async serverWillStart() {
          return {
            async drainServer() {
              await wsServerCleanup.dispose();
            }
          }
        }
      }
    ]
  });

  await apolloServer.start();

  app.use("/graphql", expressMiddleware(apolloServer));

  await myDataSource.initialize();
  console.log("Data Source has been initialized!");

  httpServer.listen(PORT, () => {
    console.log(`Admin Server is running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) =>
  console.log("Error during server initialization:", error)
);
