# 📡 GUÍA WEBSOCKET/SOCKET.IO EN POSTMAN

## 🎯 ¿QUÉ ES WEBSOCKET?

WebSocket es una conexión **bidireccional en tiempo real** entre el cliente (Postman) y el servidor (PayFlow). Permite que el servidor envíe notificaciones al cliente **sin necesidad de que el cliente pregunta** (eventos push).

```
Normal HTTP:
Cliente → Pregunta al servidor → Respuesta
(cliente siempre tiene que preguntar)

WebSocket:
Cliente ← Conexión abierta → Servidor
(servidor puede enviar mensajes cuando quiera)
```

---

## 🔌 PASO 1: CONECTAR A WEBSOCKET EN POSTMAN

### 1. Abre Postman
### 2. Ve a **Collections → 📡 WEBSOCKET → Conectar a WebSocket**
### 3. Haz clic en **Send**

**Verás:**
```
Connected
```

En verde significa que **estás conectado al servidor en tiempo real**.

---

## 📨 PASO 2: RECIBIR EVENTOS EN TIEMPO REAL

Una vez conectado, el WebSocket permanece abierto escuchando eventos.

### Los eventos que puedes recibir son:

#### 1️⃣ **balance_updated** (Actualización de saldo)
```json
{
  "type": "balance_updated",
  "newBalance": 1350,
  "timestamp": "2026-05-25T10:30:00Z"
}
```
**Cuándo:** Después de cualquier transferencia, depósito o retiro

#### 2️⃣ **transfer_sent** (Enviaste dinero)
```json
{
  "type": "transfer_sent",
  "message": "Has enviado 50.00 a usuario2@example.com",
  "amount": 50,
  "recipientEmail": "usuario2@example.com",
  "timestamp": "2026-05-25T10:30:00Z"
}
```

#### 3️⃣ **transfer_received** (Recibiste dinero)
```json
{
  "type": "transfer_received",
  "message": "Has recibido 50.00 de test@example.com",
  "amount": 50,
  "senderEmail": "test@example.com",
  "timestamp": "2026-05-25T10:30:00Z"
}
```

#### 4️⃣ **deposit_received** (Recibiste depósito de ADMIN)
```json
{
  "type": "deposit_received",
  "message": "Has recibido un depósito de 500.00",
  "amount": 500,
  "timestamp": "2026-05-25T10:30:00Z"
}
```

#### 5️⃣ **withdraw_completed** (Tu retiro se completó)
```json
{
  "type": "withdraw_completed",
  "message": "Retiro exitoso de 100.00",
  "amount": 100,
  "timestamp": "2026-05-25T10:30:00Z"
}
```

#### 6️⃣ **session_expired** (Tu sesión expiró)
```json
{
  "type": "session_expired",
  "message": "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
}
```
**Cuándo:** Tu JWT token expira (después de cierto tiempo)

---

## 🔄 DEMOSTRACIÓN PRÁCTICA - PASO A PASO

### Escenario: Ver notificaciones en tiempo real cuando alguien envía dinero

#### PASO 1: Abre 2 ventanas de Postman

**Ventana 1 - Usuario A:**
- Collections → 📡 WEBSOCKET → Conectar a WebSocket
- Haz clic en **Send**
- Deja esta ventana abierta (esperando eventos)

**Ventana 2 - Usuario B:**
- Collections → 🔐 AUTENTICACIÓN → 2. Login
- Usa credenciales de Usuario B
- Haz clic en **Send**
- Se guarda el token de Usuario B

#### PASO 2: Realiza una transferencia desde Usuario B

**Ventana 2:**
- Collections → 💰 TRANSFERENCIAS → 1. Realizar Transferencia
- Haz clic en **Send**

#### PASO 3: Observa la Ventana 1

**En la Ventana 1 (WebSocket) verás automáticamente:**

```json
{
  "type": "transfer_received",
  "message": "Has recibido 50.00 de usuario2@example.com",
  "amount": 50,
  "senderEmail": "usuario2@example.com"
}
```

```json
{
  "type": "balance_updated",
  "newBalance": 900
}
```

✅ **¡Así funciona WebSocket en tiempo real!**

---

## 🎮 ESCENARIOS DE PRUEBA

### Escenario 1: Transfer Notifications

**Objetivo:** Verificar que ambos usuarios reciben notificaciones al hacer una transferencia

**Pasos:**
1. Conecta WebSocket para Usuario A
2. Conecta WebSocket para Usuario B (en otra ventana)
3. Usuario A realiza transferencia a Usuario B
4. **Resultado esperado:**
   - Usuario A recibe: `transfer_sent`
   - Usuario B recibe: `transfer_received`
   - Ambos reciben: `balance_updated`

---

### Escenario 2: Admin Deposit Notifications

**Objetivo:** Verificar que el usuario recibe notificación cuando ADMIN hace depósito

**Pasos:**
1. Usuario conecta WebSocket
2. Admin realiza depósito
3. **Resultado esperado:**
   - Usuario recibe: `deposit_received`
   - Usuario recibe: `balance_updated`

---

### Escenario 3: Session Expiration

**Objetivo:** Verificar que la sesión expira correctamente

**Pasos:**
1. Conecta WebSocket con token
2. Espera a que el token expire (JWT_EXPIRY tiempo)
3. **Resultado esperado:**
   - Usuario recibe: `session_expired`
   - WebSocket se desconecta automáticamente

---

## 🔐 AUTENTICACIÓN DEL WEBSOCKET

### ¿Cómo se autentica el WebSocket?

El servidor valida el JWT token del usuario al conectar.

**URL de conexión:**
```
ws://localhost:3000/notifications
```

**Con token (en body o como query parameter):**
```
ws://localhost:3000/notifications?token=eyJhbGciOiJIUzI1NiI...
```

**O en Postman:**
1. En el request de WebSocket
2. Agrega header: `Authorization: Bearer {{token}}`
3. Postman automáticamente lo envía como parámetro

---

## ⚙️ CONFIGURACIÓN TÉCNICA DEL WEBSOCKET

### En el servidor (PayFlow):

**Archivo:** `src/modules/notifications/notifications.gateway.ts`

```typescript
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // Valida JWT al conectar
  // Emite eventos a usuarios específicos
  // Desconecta automáticamente si token expira
}
```

### Eventos que emite:

```typescript
// Envía notificación de transferencia
this.server.to(socketId).emit('transfer_received', data);

// Actualiza saldo en tiempo real
this.server.to(socketId).emit('balance_updated', data);

// Notifica expiración de sesión
socket.emit('session_expired', { message: '...' });
```

---

## 🛠️ SOLUCIÓN DE PROBLEMAS - WEBSOCKET

### ❌ "Connection failed" o no conecta

**Causa:** El servidor no está corriendo
```bash
npm run start:dev
```

### ❌ "Authentication failed" o desconexión inmediata

**Causa:** Token inválido o no enviado

**Solución:**
1. Verifica que el `{{token}}` no está vacío
2. Ejecuta login de nuevo
3. Copia el nuevo token

### ❌ No recibo eventos después de conectar

**Posibles causas:**
1. La operación (transferencia, depósito) no se ejecutó
2. El socket no está escuchando al usuario correcto
3. El namespace es incorrecto

**Verificar:**
- En la terminal del servidor verás logs:
  ```
  [Notifications] Usuario conectado: usuário_id
  [Notifications] Emitiendo evento: balance_updated
  ```

### ❌ WebSocket desconecta aleatoriamente

**Causa:** Token expiró o hubo error en servidor

**Solución:**
- Haz login nuevamente para obtener token fresco
- Reconecta el WebSocket

---

## 📊 TABLA DE EVENTOS

| Evento | Tipo | Descripción | Cuándo ocurre |
|--------|------|-------------|---------------|
| `balance_updated` | DATA | Actualización de saldo | Después de cualquier operación |
| `transfer_sent` | NOTIFICATION | Transferencia enviada | Cuando envías dinero |
| `transfer_received` | NOTIFICATION | Transferencia recibida | Cuando alguien te envía dinero |
| `deposit_received` | NOTIFICATION | Depósito recibido | Cuando ADMIN hace depósito |
| `withdraw_completed` | NOTIFICATION | Retiro completado | Cuando completas un retiro |
| `session_expired` | ALERT | Sesión expirada | Cuando tu JWT expira |

---

## 🎯 CÓMO EXPLICAR AL PROFESOR

> "Profesor, cuando un usuario realiza una transferencia, **ambos usuarios reciben notificaciones en TIEMPO REAL** a través de WebSocket. No hay que refrescar la página o consultar manualmente - el servidor envía la notificación automáticamente y aparece instantáneamente en el cliente."

**Demostración:**
1. Abre 2 WebSocket (Usuario A y Usuario B)
2. Usuario B realiza transferencia
3. **Al instante**, Usuario A recibe notificación `transfer_received`
4. Ambos reciben actualización de saldo

---

## 📱 ARQUITECTURA COMPLETA

```
┌─────────────────────────────────┐
│         POSTMAN A               │
│    (Usuario A)                  │
│                                 │
│  HTTP: POST /auth/login ──┐    │
│  WebSocket: Conectado ✓   │    │
│  (escuchando eventos)     │    │
└────────────────┬──────────┘    │
                 │                │
        ┌────────▼────────┐      │
        │   HTTP LAYER    │      │
        │ (Autenticación) │      │
        └────────┬────────┘      │
                 │                │
    ┌────────────▼────────────┐  │
    │   SERVIDOR PAYFLOW      │  │
    │   (NestJS)              │  │
    │                         │  │
    │  ┌──────────────────┐  │  │
    │  │ Auth Controller  │  │  │
    │  └──────────────────┘  │  │
    │  ┌──────────────────┐  │  │
    │  │ Transfer Service │  │  │
    │  └────────┬─────────┘  │  │
    │           │            │  │
    │  ┌────────▼──────────┐ │  │
    │  │ Mail Service      │ │  │
    │  │ (correos)         │ │  │
    │  └───────────────────┘ │  │
    │  ┌───────────────────┐ │  │
    │  │WebSocket Gateway  │ │  │
    │  │ (Notificaciones)  │ │  │
    │  └────────┬──────────┘ │  │
    │           │            │  │
    └───────────┼────────────┘  │
                │                │
        ┌───────▼────────┐      │
        │  WEBSOCKET     │      │
        │  (tiempo real) │      │
        └───────┬────────┘      │
                │                │
┌───────────────▼──────────────┐│
│      POSTMAN B               ││
│    (Usuario B)               ││
│                              ││
│  HTTP: POST /auth/login      ││
│  HTTP: POST /transfer ──┐    ││
│  WebSocket: Escuchando  │    ││
│  (recibe eventos)       │    ││
└──────────────────────────┘   │
                               │
┌──────────────────────────────┘
│
└─► Cuando POST /transfer se completa:
    1. Servidor actualiza BD
    2. Emite "transfer_sent" a Usuario B
    3. Emite "transfer_received" a Usuario A
    4. Emite "balance_updated" a ambos
    5. Envía correos por MailService
    6. ⚡ Todo en tiempo real
```

---

## ✅ VALIDACIÓN FINAL

Cuando todo funcione, muéstrale esto al profesor:

```
✓ WebSocket conectado y autenticado
✓ Eventos llegan en TIEMPO REAL
✓ Ambos usuarios reciben notificaciones
✓ No hay retrasos
✓ La conexión se mantiene durante toda la sesión
✓ Se desconecta automáticamente al expirar token
```

---

¡WebSocket activado! 📡🚀
