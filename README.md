# Sistema de Gestión de Recursos Humanos (RRHH) — Frontend Angular

Aplicación cliente (**SPA**) del sistema RRHH, desarrollada con **Angular 16**. Se conecta a tres microservicios backend:

| Microservicio | Tecnología | URL por defecto (local) |
|---|---|---|
| Core HR & Auth | Spring Boot (AWS EB) | `https://rrhh-prod.eba-p8y8badt.us-east-2.elasticbeanstalk.com` |
| Seguridad / Bitácora | NestJS | `http://localhost:3000` |
| Asistencia / IA | FastAPI (DuckDNS) | `https://hr-fastapi.duckdns.org` |

---

## Funcionalidades

- **Empleados** — CRUD completo del personal de la organización.
- **Departamentos** — Estructura organizacional y asignación de áreas.
- **Asistencia** — Control de entradas/salidas con reconocimiento facial.
- **Preplanillas** — Cálculo preliminar de nómina basado en asistencia.
- **Bitácora de Auditoría** — Logs de seguridad desde NestJS/DynamoDB vía GraphQL.
- **Reportes con IA** — Generación de reportes con Gemini y exportación CSV/PDF.

---

## Tecnologías

| Paquete | Versión |
|---|---|
| Angular | `16.2.0` |
| Node.js | `18.x` — `20.x` |
| Bootstrap | `5.3.2` |
| RxJS | `7.8.0` |
| Chart.js | `4.5.1` |
| face-api.js | `0.22.2` |

---

## Requisitos previos

1. [Node.js 18+](https://nodejs.org/) instalado.
2. Angular CLI 16 instalado globalmente:
   ```bash
   npm install -g @angular/cli@16
   ```

---

## 🖥️ Inicio en local (desarrollo)

### 1. Instalar dependencias

```bash
cd rrhh_front_angular
npm install
```

> Si hay conflictos de versiones entre paquetes usa: `npm install --legacy-peer-deps`

### 2. Configurar variables de entorno (desarrollo)

El archivo [`src/environments/environment.ts`](src/environments/environment.ts) controla las URLs en desarrollo.  
No necesitas tocarlo si usas los servicios cloud del equipo, pero si levantas backends locales ajusta los valores:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',          // Spring Boot local
  graphqlPath: '/graphql',
  loginPath: '/api/v1/auth/login',
  refreshPath: '/api/v1/auth/refresh',
  nestUrl: 'http://localhost:3000',          // NestJS local
  fastapiUrl: 'http://localhost:8000',       // FastAPI local
  fastapiGql: 'http://localhost:8000/graphql',
};
```

### 3. Levantar el servidor de desarrollo

```bash
npm start
```

> Internamente ejecuta `ng serve`. El servidor escucha en **http://localhost:4200** con *Live Reload* activo.

### 4. Abrir en el navegador

[http://localhost:4200](http://localhost:4200)

---

## 🐳 Inicio con Docker (local)

El [`Dockerfile`](Dockerfile) incluido levanta el servidor de desarrollo dentro de un contenedor (útil para reproducir el entorno en cualquier máquina).

```bash
# Construir la imagen
docker build -t rrhh-frontend .

# Ejecutar el contenedor
docker run -p 4200:4200 rrhh-frontend
```

Accede en: [http://localhost:4200](http://localhost:4200)

> El servidor corre con `--host 0.0.0.0 --disable-host-check` para aceptar conexiones desde el host.

---

## 🚀 Build y despliegue en producción

### 1. Configurar variables de entorno (producción)

Edita [`src/environments/environment.prod.ts`](src/environments/environment.prod.ts) con las URLs reales de tus servicios:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://rrhh-prod.eba-p8y8badt.us-east-2.elasticbeanstalk.com',
  graphqlPath: '/graphql',
  loginPath: '/api/v1/auth/login',
  refreshPath: '/api/v1/auth/refresh',
  nestUrl: 'https://<tu-nest-en-produccion>.com',   // ← reemplazar
  fastapiUrl: 'https://hr-fastapi.duckdns.org',
  fastapiGql: 'https://hr-fastapi.duckdns.org/graphql',
};
```

> **Importante:** nunca uses `environment.ts` para cambios de producción; Angular lo reemplaza automáticamente con `environment.prod.ts` al compilar con `--configuration production`.

### 2. Generar el bundle de producción

```bash
npm run build
```

> Equivale a `ng build --configuration production`. Los archivos optimizados y minificados se generan en `dist/code-prueba/`.

### 3. Opciones de despliegue

#### Netlify (recomendado — configuración ya incluida)

El proyecto incluye `netlify.toml` (o ajustes equivalentes en el dashboard de Netlify):

| Campo | Valor |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist/code-prueba` |

Conecta el repositorio en [app.netlify.com](https://app.netlify.com) y el despliegue es automático en cada `git push` a `master`.

#### Servidor estático (Nginx / Apache)

Copia el contenido de `dist/code-prueba/` a la raíz del servidor web.  
Para que el enrutamiento de Angular (HTML5 history API) funcione correctamente, redirige todas las rutas a `index.html`.

**Ejemplo para Nginx:**
```nginx
server {
    listen 80;
    root /var/www/rrhh-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Docker (producción)

Construye una imagen que sirva el build con Nginx:

```bash
docker build \
  --build-arg CONFIGURATION=production \
  -t rrhh-frontend:prod .
```

> El `Dockerfile` actual levanta el servidor de desarrollo (`ng serve`). Para producción se recomienda usar una imagen multi-stage con Nginx — consulta con el equipo de DevOps.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor de desarrollo (`ng serve`) en `localhost:4200` |
| `npm run build` | Genera el bundle de producción en `dist/` |
| `npm run watch` | Build en modo watch (reconstruye al guardar cambios) |
| `npm test` | Ejecuta los tests unitarios con Karma + Jasmine |

---

## Estructura de archivos relevante

```
rrhh_front_angular/
├── src/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── auth/          # Login, guards, JWT
│   │   │   └── core-hr/       # Empleados, Departamentos, Asistencia
│   │   ├── pages/
│   │   │   └── dashboard/     # Dashboard principal con reportes
│   │   └── _metronic/
│   │       └── shared/
│   │           └── interceptors/
│   │               └── auth.interceptor.ts  # Adjunta JWT a microservicios propios
│   └── environments/
│       ├── environment.ts      # Configuración LOCAL (desarrollo)
│       └── environment.prod.ts # Configuración PRODUCCIÓN (nube)
├── Dockerfile
└── package.json
```

---

## Solución de problemas frecuentes

### `npm error Missing script: "dev"`
Este proyecto usa `npm start` (no `npm run dev`). Ejecuta:
```bash
npm start
```

### `Property 'fastapiUrl' does not exist`
Asegúrate de que `src/environments/environment.ts` contenga la propiedad `fastapiUrl`. Ver sección [Configurar variables de entorno](#2-configurar-variables-de-entorno-desarrollo).

### Conflictos de dependencias en `npm install`
```bash
npm install --legacy-peer-deps
```
