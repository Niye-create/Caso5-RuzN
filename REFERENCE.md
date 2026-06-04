# 🚀 PAYFLOW + POSTMAN - REFERENCIA RÁPIDA

## En 60 segundos:

```bash
# 1. Abre terminal
npm run start:dev

# 2. Abre Postman
# File → Import → postman/PayFlow.postman_collection.json

# 3. Selecciona environment: PayFlow

# 4. Ejecuta en orden:
# 🔐 Registrar → 🔐 Login → 📧 OTP → 💰 Transfer → 📡 WebSocket
```

---

## 📋 ENDPOINTS DISPONIBLES

### 🔐 AUTENTICACIÓN
| Método | Endpoint | Token | Descripción |
|--------|----------|-------|-------------|
| POST | `/auth/register` | ❌ | Crear nuevo usuario |
| POST | `/auth/login` | ❌ | Obtener JWT token |

### 📧 CORREO & OTP
| Método | Endpoint | Token | Descripción |
|--------|----------|-------|-------------|
| POST | `/mail/request-otp` | ❌ | Enviar código OTP |
| POST | `/mail/verify-otp` | ❌ | Verificar código OTP |

### 💰 TRANSFERENCIAS
| Método | Endpoint | Token | Descripción |
|--------|----------|-------|-------------|
| POST | `/transfer` | ✅ | Transferencia entre usuarios |
| POST | `/transfer/deposit` | ✅ ADMIN | Depósito a cuenta |
| POST | `/transfer/withdraw` | ✅ | Retiro de cuenta |

### 📊 DATOS
| Método | Endpoint | Token | Descripción |
|--------|----------|-------|-------------|
| GET | `/accounts` | ✅ | Mis cuentas |
| GET | `/transaction` | ✅ | Historial transacciones |
| GET | `/notifications` | ✅ | Mis notificaciones |

### 📡 WEBSOCKET
| Protocolo | Endpoint | Token | Descripción |
|-----------|----------|-------|-------------|
| WS | `/notifications` | ✅ | Eventos en tiempo real |

---

## 🎯 FLUJO TÍPICO

```
START
  │
  ├─► 🔐 POST /auth/register
  │    └─► Crear usuario (status 201)
  │
  ├─► 🔐 POST /auth/login
  │    └─► Obtener token JWT (guardar en {{token}})
  │
  ├─► 📧 POST /mail/request-otp
  │    └─► Código enviado a correo
  │
  ├─► 📧 POST /mail/verify-otp
  │    └─► Verificar código recibido
  │
  ├─► 💰 POST /transfer
  │    ├─► Saldo actualizado ✓
  │    ├─► Correo enviado ✓
  │    └─► WebSocket notificado ✓
  │
  ├─► 📡 WS /notifications
  │    └─► Conectado (escuchando eventos)
  │
  └─► ✅ LISTO PARA MOSTRAR AL PROFESOR
```

---

## 📥 CUERPOS DE SOLICITUD (Request Body)

### Registrar
```json
{
  "nombre": "Juan Usuario",
  "email": "juan@example.com",
  "password": "password123"
}
```

### Login
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

### OTP
```json
{
  "email": "juan@example.com"
}
```

### Verificar OTP
```json
{
  "email": "juan@example.com",
  "code": "123456"
}
```

### Transferencia
```json
{
  "toAccountId": 2,
  "amount": 50
}
```

### Depósito (ADMIN)
```json
{
  "toAccountId": 1,
  "amount": 500
}
```

### Retiro
```json
{
  "fromAccountId": 1,
  "amount": 100
}
```

---

## 📨 EVENTOS WEBSOCKET

Cuando estás conectado al WebSocket, recibirás:

| Evento | Estructura | Cuándo |
|--------|-----------|--------|
| `balance_updated` | `{ type, newBalance }` | Cualquier operación |
| `transfer_sent` | `{ type, message, amount }` | Enviar dinero |
| `transfer_received` | `{ type, message, amount }` | Recibir dinero |
| `deposit_received` | `{ type, message, amount }` | ADMIN deposita |
| `withdraw_completed` | `{ type, message, amount }` | Completar retiro |
| `session_expired` | `{ type, message }` | Token expira |

---

## 🔑 VARIABLES EN POSTMAN

```
baseUrl = http://localhost:3000/api
token = (se llena después de login)
admin_token = (se llena después de login como admin)
```

---

## ⚡ RESPUESTAS ESPERADAS

### Login exitoso
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiI...",
  "userId": 1,
  "email": "juan@example.com"
}
```

### Transferencia exitosa
```json
{
  "message": "Transferencia exitosa",
  "fromAccount": {
    "id": 1,
    "saldo": 850
  }
}
```

### WebSocket conectado
```
Connected ✓
```

---

## 🎮 DEMOSTRACIÓN PARA EL PROFESOR

**Abre estas 3 ventanas:**

### Ventana 1: Servidor corriendo
```bash
npm run start:dev
```
**Ver:** `🚀 Server running on http://localhost:3000/api`

### Ventana 2: Postman - Usuario A (WebSocket)
```
Collections → 📡 WEBSOCKET → Conectar
Click: Send
Ver: "Connected"
```

### Ventana 3: Postman - Usuario B (Transferencia)
```
Collections → 💰 TRANSFERENCIAS → Realizar Transferencia
Click: Send
Ver: "Transferencia exitosa"
```

**Resultado:** En la Ventana 2, verás eventos llegando en TIEMPO REAL:
```json
{
  "type": "transfer_received",
  "message": "Has recibido 50.00 de usuario2@example.com",
  "amount": 50
}
```

---

## 🛠️ SOLUCIONAR PROBLEMAS RÁPIDAMENTE

| Error | Solución |
|-------|----------|
| Cannot POST /api/... | `npm run start:dev` |
| Unauthorized | Ejecuta login de nuevo |
| No WebSocket connection | Verifica token con `jwt.io` |
| Token expirado | Haz login nuevamente |
| No recibo correo | Revisa .env MAIL_* |

---

## 📚 DOCUMENTACIÓN COMPLETA

- 📖 **[POSTMAN_SETUP.md](./POSTMAN_SETUP.md)** - Guía detallada
- 📋 **[POSTMAN_QUICK_START.md](./POSTMAN_QUICK_START.md)** - Guía rápida
- 📡 **[WEBSOCKET_GUIDE.md](./WEBSOCKET_GUIDE.md)** - WebSocket explicado
- ✅ **[VERIFICACION.md](./VERIFICACION.md)** - Validar todo funciona

---

## 🌐 URLs

| Recurso | URL |
|---------|-----|
| API | `http://localhost:3000/api` |
| Swagger Docs | `http://localhost:3000/api/docs` |
| WebSocket | `ws://localhost:3000/notifications` |
| Colección | `./postman/PayFlow.postman_collection.json` |

---

## ✅ CHECKLIST FINAL

```
✓ Servidor corriendo (npm run start:dev)
✓ Postman instalado y colección importada
✓ Variables de entorno configuradas
✓ Registro de usuario exitoso
✓ Login genera token JWT
✓ OTP enviado y verificado
✓ Transferencia actualiza saldos
✓ Correo recibido
✓ WebSocket conecta y recibe eventos
✓ Depósito ADMIN funciona
✓ Retiro funciona
```

**Cuando todo esté ✓, estás listo!** 🎉

---

## 📞 PRESENTACIÓN

"Profesor, conecté PayFlow con Postman para mostrarle:

1. **Autenticación JWT** - Usuarios seguros
2. **OTP por correo** - Códigos de 6 dígitos
3. **Transferencias** - Con notificación a ambos usuarios
4. **WebSocket** - Eventos en TIEMPO REAL
5. **Depósitos ADMIN** - Control de roles
6. **Todo funcionando localmente** - Sin deploy

¿Lo demostramos?"
