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

## Instalación

```bash
npm install
```

## Ejecutar el proyecto

```bash
npm run start:dev
```

## Funcionalidades

- ✅ Registro e inicio de sesión (JWT)
- ✅ Gestión de usuarios
- ✅ Gestión de cuentas
- ✅ Transacciones (depósito, retiro, transferencia)
- ✅ Notificaciones en tiempo real (WebSocket/Socket.IO)
- ✅ Correo automático (OTP + Comprobantes)
- ✅ Autenticación segura con JWT
- ✅ Control de roles (USER, ADMIN)

## 📱 Conectar con Postman

### Opción rápida - Ver guía completa:

**Documentación disponible:**

| Documento | Descripción |
|-----------|-------------|
| 📋 **[POSTMAN_QUICK_START.md](./POSTMAN_QUICK_START.md)** | Guía rápida paso a paso (5 minutos) |
| 📖 **[POSTMAN_SETUP.md](./POSTMAN_SETUP.md)** | Guía detallada con todos los endpoints |
| 📡 **[WEBSOCKET_GUIDE.md](./WEBSOCKET_GUIDE.md)** | Cómo funciona WebSocket en tiempo real |
| ✅ **[VERIFICACION.md](./VERIFICACION.md)** | Checklist de validación antes de presentar |

### Pasos resumidos:

1. **Importar colección en Postman:**
   - File → Import → `postman/PayFlow.postman_collection.json`

2. **Iniciar servidor:**
   ```bash
   npm run start:dev
   ```

3. **Ejecutar endpoints:**
   - 🔐 Registrar usuario y hacer login
   - 📧 Probar OTP (solicitar y verificar código)
   - 💰 Realizar transferencia (con notificaciones)
   - 🏦 Depositar dinero (ADMIN)
   - 📡 Conectar WebSocket (ver eventos en tiempo real)

### URLs importantes:

- 🌐 **API:** http://localhost:3000/api
- 📚 **Swagger Docs:** http://localhost:3000/api/docs
- 📡 **WebSocket:** ws://localhost:3000/notifications

