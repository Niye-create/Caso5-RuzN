## Integrantes

- Harold Jessid Andrade Meneses
- Belladira Oliveira Ramirez
- Maria del carmen Guerra Ruiz
- Vanya Catalina Portilla Sánchez
- Niyireth Fernanda Ruiz Solarte
- Andrés Alirio Burbano

# PayFlow - Wallet Digital

Sistema de gestión de billetera digital que permite a los usuarios administrar su dinero, realizar transacciones y consultar su historial.

## Tecnologías

- NestJS
- TypeORM
- MySQL
- JWT (Autenticación)
- Passport
- Bcrypt
- Swagger
- WebSocket/Socket.IO
- Nodemailer (Correo)

## Instalación

```bash
npm install
```

## Ejecutar el proyecto

```bash
npm run start:dev
```

## Funcionalidades

- Registro e inicio de sesión (JWT)
- Gestión de usuarios
- Gestión de cuentas
- Transacciones (depósito, retiro, transferencia)
- Notificaciones en tiempo real (WebSocket/Socket.IO)
- Correo automático (OTP + Comprobantes)
- Control de roles (USER, ADMIN)

## 🗄️ Base de Datos

Script SQL incluido: **`database.sql`**

Para crear la base de datos:
```bash
mysql -u root -p < database.sql
```

O manualmente en MySQL:
```sql
source database.sql;
```

## 📱 Postman

Colección actualizada: **`postman/PayFlow.postman_collection.json`**

Pasos:
1. Abre Postman
2. File → Import → `postman/PayFlow.postman_collection.json`
3. Configura variable `baseUrl = http://localhost:3000/api`
4. Ejecuta los endpoints desde la colección

## URLs

- **API:** http://localhost:3000/api
- **Swagger Docs:** http://localhost:3000/api/docs
- **WebSocket:** ws://localhost:3000/notifications

## Configuración `.env`

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=1234
DB_DATABASE=payflow
JWT_SECRET=una_clave_secreta
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu-email@gmail.com
MAIL_PASSWORD=tu-contraseña-app
```
