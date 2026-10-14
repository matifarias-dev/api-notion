# API Notion

Servicio para conectarse a Notion y Api de mercado libre.

## Ejecucion local

El entorno local se ejecuta con HTTP directo, sin Nginx ni certificados TLS. Levanta únicamente la API y carga las variables de [`.env`](./.env), incluida la conexión a MongoDB remoto:

```bash
cp .env.example .env
docker compose up --build
```

La API queda disponible en `http://localhost:3000`:

```bash
curl http://localhost:3000/healthCheck
```

La variable `DB_HOST` debe apuntar al host o IP de MongoDB accesible desde tu entorno. Para detener el entorno:

```bash
docker compose down
```

Tambien se puede ejecutar la API fuera de Docker, usando la misma configuracion de `.env`:

```bash
npm install
npm run dev
```

El archivo [`.env.example`](./.env.example) contiene la configuracion base local. Se deben completar las credenciales de Notion y Mercado Libre para probar las integraciones externas.

## Despliegue VPS

En produccion, `api-notion` no publica puertos al host ni levanta Nginx. Se conecta a las redes Docker externas `core-backbone` y `proxy-edge`, consume MongoDB mediante `mongo-core` y sirve HTTP interno en el puerto `3000`.

El TLS, los prefijos publicos y la exposicion son responsabilidad de `nginx-core` en `vps-project`. Este repositorio siempre atiende sus rutas desde `/`; el fragmento [nginx/api-notion.conf](./nginx/api-notion.conf) publica esas rutas bajo `/api/v1/` y debe instalarse en `vps-project/nginx/locations.d/`. Esta separacion permite enrutar una futura version (`/api/v2/`) a otro microservicio sin cambiar esta API.

El workflow [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) se ejecuta al hacer push a `master`. Genera el `.env` en el VPS desde GitHub Secrets, actualiza el contenedor y valida/recarga `nginx-core`.

Secrets requeridos:

- Infraestructura: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_PORT`, `VPS_APP_PATH`, `VPS_CORE_PATH`.
- Aplicacion: `NOTION_SECRET`, `NOTION_MELI_DB`, `APP_ID_MELI`, `CLIENT_SECRET_MELI`, `REDIRECT_MELI_URL`, `MELI_USER_ID`, `CORS_ORIGIN`.
- MongoDB autenticado, si aplica: `DB_USERNAME`, `DB_PASSWORD`.

Usar [`.env.vps.example`](./.env.vps.example) como referencia de las variables de produccion. El `.env` real no debe versionarse.

## Tecnologias utilizadas

- NodeJS
- ExpressJS
- Notion SDK

## Endpoints

### Health Check

**GET** `/healthCheck`

- **Description**: Verifica el estado del servicio.
- **Response**:
  ```json
  {
    "status": "OK",
    "version": "<project_version>"
  }
  ```

### Notion Endpoints

**Base Path**: `/notion`

1. **GET** `/getDBMeli`

   - **Description**: Obtiene los datos de la base de datos de Notion.
   - **Response**: JSON con los datos de la base de datos.

2. **GET** `/getDBMeliProperties`

   - **Description**: Obtiene las propiedades de la base de datos de Notion.
   - **Response**: JSON con las propiedades de la base de datos.

3. **GET** `/writeDataOnMeliDB`
   - **Description**: Escribe datos en la base de datos de Notion.
   - **Response**: JSON con el resultado de la operación.

### Mercado Libre Endpoints

**Base Path**: `/meli`

1. **GET** `/login`

   - **Description**: Redirige al usuario para autenticarse con Mercado Libre.

2. **GET** `/auth-success`

   - **Description**: Endpoint de callback para manejar la autenticación exitosa.
   - **Query Params**:
     - `code`: Código de autorización.

3. **GET** `/auth-token`

   - **Description**: Obtiene el token de autenticación actual.
   - **Response**: JSON con el token.

4. **GET** `/auth-time-left`

   - **Description**: Obtiene el tiempo restante de validez del token.
   - **Response**: Texto con el tiempo restante.

5. **POST** `/notifications`

   - **Description**: Recibe notificaciones de Mercado Libre.
   - **Body**: JSON con los datos de la notificación.

6. **POST** `/orders`

   - **Description**: Obtiene órdenes basadas en un filtro.
   - **Body**: JSON con los filtros de búsqueda.
   - **Response**: JSON con las órdenes encontradas.

7. **GET** `/orders/:id`

   - **Description**: Obtiene los detalles de una orden específica.
   - **Path Params**:
     - `id`: ID de la orden.

8. **GET** `/orders/:id/shipments`

   - **Description**: Obtiene los detalles de envío de una orden específica.
   - **Path Params**:
     - `id`: ID de la orden.

9. **GET** `/item/:id`

   - **Description**: Obtiene los detalles de un ítem específico.
   - **Path Params**:
     - `id`: ID del ítem.

10. **GET** `/todayOrders`
    - **Description**: Obtiene las órdenes realizadas hoy.
    - **Response**: JSON con las órdenes del día.
