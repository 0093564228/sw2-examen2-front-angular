// Entorno de DESARROLLO LOCAL.
// Estas URLs apuntan a los servicios corriendo en tu máquina con docker-compose o de forma manual.
// Al compilar con `ng build --configuration production`, Angular reemplaza este archivo por environment.prod.ts.
export const environment = {
  production: false,
  // Spring Boot local (Módulos 1/2). En la nube (Abel) sería, p.ej.:
  // 'http://beanstalk-rrhh-app-prod.eba-rvkrzdtv.us-east-2.elasticbeanstalk.com'
  apiUrl: 'https://rrhh-prod.eba-p8y8badt.us-east-2.elasticbeanstalk.com',
  graphqlPath: '/graphql',
  loginPath: '/api/v1/auth/login',
  refreshPath: '/api/v1/auth/refresh',

  // NestJS — URL pública de tu servidor NestJS en producción.
  nestUrl: 'https://tomorrow-pictures-guidelines-applicable.trycloudflare.com/graphql',

  // FastAPI — Servicio Biométrico e IA (DuckDNS)
  fastapiUrl: 'https://hr-fastapi.duckdns.org',
  // fastapiGql mantiene compatibilidad con el código existente que apunta al endpoint GraphQL.
  fastapiGql: 'https://hr-fastapi.duckdns.org/graphql',
};
