// Configuración de entorno. apiUrl apunta al backend Spring Boot + GraphQL.
export const environment = {
  production: true,
  apiUrl: 'http://rrhh-prod.eba-p8y8badt.us-east-2.elasticbeanstalk.com',
  graphqlPath: '/graphql',
  loginPath: '/api/v1/auth/login',
  refreshPath: '/api/v1/auth/refresh',
  fastapiGql: 'http://localhost:8001/graphql',
};
