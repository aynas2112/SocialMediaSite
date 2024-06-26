import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql', // Replace with your GraphQL endpoint
  });
  
  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
  
  export default client;