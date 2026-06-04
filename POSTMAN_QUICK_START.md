# CONEXIÓN PAYFLOW + POSTMAN - RESUMEN RÁPIDO

## 📋 TODO EN UNA IMAGEN

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                   FLUJO DE CONEXIÓN PAYFLOW                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1️⃣  INICIAR SERVIDOR                                          │
│  ────────────────────────                                       │
│  $ npm run start:dev                                           │
│  ✓ http://localhost:3000/api                                  │
│                                                                 │
│                              ↓                                  │
│                                                                 │
│  2️⃣  ABRIR POSTMAN                                             │
│  ──────────────────                                             │
│  ✓ Import → PayFlow.postman_collection.json                   │
│  ✓ Seleccionar Environment: PayFlow                           │
│                                                                 │
│                              ↓                                  │
│                                                                 │
│  3️⃣  EJECUTAR EN ORDEN                                         │
│  ──────────────────────                                         │
│                                                                 │
│  ┌──────────────────────────────────────────────┐            │
│  │ 🔐 AUTENTICACIÓN                            │            │
│  ├──────────────────────────────────────────────┤            │
│  │ 1. Registrar Usuario      → status 201 ✓   │            │
│  │ 2. Login                  → token guardado ✓│            │
│  │                                             │            │
│  │ 📧 CORREO Y OTP                             │            │
│  │ 1. Solicitar OTP          → revisar correo ✓│            │
│  │ 2. Verificar OTP          → código válido ✓ │            │
│  │                                             │            │
│  │ 💰 TRANSFERENCIAS                           │            │
│  │ 1. Realizar Transferencia → saldo actualizado│            │
│  │    ↳ 📬 Correo enviado                      │            │
│  │    ↳ 📡 WebSocket notificación              │            │
│  │                                             │            │
│  │ 🏦 DEPÓSITO (ADMIN)                         │            │
│  │ 1. Login como ADMIN       → admin_token ✓  │            │
│  │ 2. Realizar Depósito      → saldo actualizado│            │
│  │    ↳ 📬 Correo enviado                      │            │
│  │    ↳ 📡 WebSocket notificación              │            │
│  │                                             │            │
│  │ 📡 WEBSOCKET                                │            │
│  │ Conectar a WebSocket      → eventos en tiempo real │      │
│  └──────────────────────────────────────────────┘            │
│                                                                 │
│                              ↓                                  │
│                                                                 │
│  ✅ LISTO PARA PRESENTAR AL PROFESOR                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 PASO A PASO RÁPIDO

### 1. ABRIR POSTMAN

- Haz clic en **File → Import**
- Selecciona: `postman/PayFlow.postman_collection.json`
- Haz clic en **Import**

### 2. CONFIGURAR VARIABLES

- Haz clic en ⚙️ (arriba a la derecha)
- Selecciona **Manage Environments**
- Crea un nuevo environment llamado `PayFlow`
- Agrega:
  ```
  baseUrl = http://localhost:3000/api
  token = (vacío)
  admin_token = (vacío)
  ```

### 3. INICIAR SERVIDOR

En terminal:
```bash
cd c:\Users\Usuario\OneDrive\Backend\Caso5\Caso-5
npm run start:dev
```

Espera ver: `🚀 Server running on http://localhost:3000/api`

### 4. PROBAR ENDPOINTS EN ORDEN

**Haz clic en "Send" para cada uno:**

1. 🔐 **Registrar Usuario** → Click Send
2. 🔐 **Login** → Click Send (token se guarda automáticamente)
3. 📧 **Solicitar OTP** → Click Send (revisa correo)
4. 📧 **Verificar OTP** → Click Send (con código recibido)
5. 💰 **Transferencia** → Click Send
6. 🏦 **Login ADMIN** → Click Send (admin_token guardado)
7. 🏦 **Depósito** → Click Send
8. 📡 **Conectar WebSocket** → Click Send (recibirás eventos en tiempo real)

---

## 🌐 CONEXIÓN WEBSOCKET EXPLICADA

```
┌──────────────────┐
│   USUARIO A      │
│  (Postman)       │
│                  │
│  WebSocket       │
│  Conectado ✓     │
└────────┬─────────┘
         │
         │  ws://localhost:3000/notifications
         │
    ┌────▼──────────────┐
    │   SERVIDOR        │
    │   NestJS          │
    │                   │
    │  WebSocket Server │
    │  Socket.IO        │
    └────┬──────────────┘
         │
         │
    ┌────▼──────────────┐
    │   USUARIO B      │
    │  (Postman otra   │
    │   ventana)       │
    │                  │
    │  WebSocket       │
    │  Conectado ✓     │
    └──────────────────┘

CUANDO USUARIO A TRANSFIERE DINERO A USUARIO B:

1. Postman A envía: POST /transfer
2. Servidor procesa transferencia
3. Servidor emite evento: "transfer_sent" → Postman A
4. Servidor emite evento: "transfer_received" → Postman B
5. Ambos reciben notificaciones EN TIEMPO REAL ⚡
6. Se envían correos automáticamente 📧
```

---

## 📌 VARIABLES QUE SE GUARDAN AUTOMÁTICAMENTE

| Variable | Se llena en | Se usa en |
|----------|------------|----------|
| `{{token}}` | Login | Transferencias, OTP, Notificaciones |
| `{{admin_token}}` | Login ADMIN | Depósitos |
| `{{baseUrl}}` | Manual | Todos los endpoints |

---

## ✅ CÓMO SABER QUE TODO FUNCIONA

### Respuestas esperadas:

```json
// Login exitoso - verás esto:
{
  "access_token": "eyJhbGciOiJIUzI1NiI...",
  "userId": 1,
  "email": "juan@example.com"
}

// Transferencia exitosa - verás esto:
{
  "message": "Transferencia exitosa",
  "fromAccount": {
    "id": 1,
    "saldo": 850
  }
}

// WebSocket conectado - verás esto en tiempo real:
{
  "type": "balance_updated",
  "newBalance": 850
}
```

---

## 🔗 URLS IMPORTANTES

| Recurso | URL |
|---------|-----|
| **API Base** | `http://localhost:3000/api` |
| **Swagger Docs** | `http://localhost:3000/api/docs` |
| **WebSocket** | `ws://localhost:3000/notifications` |

---

## 📞 CONTACTO PROFESOR

Cuando le muestres, prepara esto:

> "Profesor, te muestro PayFlow funcionando con:
> 
> ✓ **Autenticación JWT** - Usuarios registrados y login seguro
> ✓ **OTP por correo** - Código de 6 dígitos válido 5 minutos  
> ✓ **Transferencias** - Con notificación simultánea a ambos usuarios
> ✓ **Depósitos ADMIN** - Actualización inmediata de saldo
> ✓ **WebSocket/Socket.IO** - Notificaciones en TIEMPO REAL
> ✓ **Correo automático** - Comprobantes de transacciones
> 
> Todo se conecta desde Postman y funcionando en http://localhost:3000"

---

¡Eso es todo! 🚀
