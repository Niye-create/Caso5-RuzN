# 📱 GUÍA DE CONEXIÓN - PayFlow con Postman

## 🚀 PASO 1: IMPORTAR LA COLECCIÓN

1. Abre **Postman**
2. Haz clic en **File → Import** (o **Collections → Import**)
3. Selecciona el archivo: `postman/PayFlow.postman_collection.json`
4. Haz clic en **Import**

✅ Ya tienes la colección de PayFlow importada

---

## ⚙️ PASO 2: CONFIGURAR VARIABLES DE ENTORNO

1. Haz clic en el **⚙️ Engranaje** (arriba a la derecha)
2. Selecciona **Manage Environments**
3. Haz clic en **Create New Environment**
4. Llámalo: `PayFlow`
5. Agrega estas variables:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `baseUrl` | `http://localhost:3000/api` | URL base de la API |
| `token` | (vacío) | Se llena después del login |
| `admin_token` | (vacío) | Se llena después del login como ADMIN |

6. Haz clic en **Save**
7. Selecciona el entorno `PayFlow` en el dropdown (arriba a la derecha)

---

## 🔧 PASO 3: INICIAR EL SERVIDOR

Abre una terminal y ejecuta:

```bash
npm install
npm run start:dev
```

Espera hasta ver:
```
🚀 Server running on http://localhost:3000/api
📖 Documentation available on http://localhost:3000/api/docs
```

---

## 🧪 PASO 4: PROBAR ENDPOINTS - FLUJO COMPLETO

### **A. AUTENTICACIÓN**

#### 1️⃣ Registrar Usuario

- Vete a **Collections → 🔐 AUTENTICACIÓN → 1. Registrar Usuario**
- Click **Send**
- Modifica el email si lo necesitas

**Respuesta esperada:**
```json
{
  "userId": 1,
  "nombre": "Juan Usuario",
  "email": "juan@example.com",
  "message": "Usuario registrado exitosamente"
}
```

#### 2️⃣ Login (Obtener Token)

- Vete a **2. Login (Obtener Token)**
- Usa las mismas credenciales del registro
- Click **Send**

**Respuesta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "juan@example.com"
}
```

✅ **El token se guarda automáticamente en la variable `{{token}}`**

---

### **B. CORREO Y MENSAJERÍA (OTP)**

#### 1️⃣ Solicitar Código OTP

- Vete a **📧 CORREO Y OTP → 1. Solicitar Código OTP**
- Modifica el email si es necesario
- Click **Send**

**Respuesta esperada:**
```json
{
  "message": "Código OTP enviado exitosamente"
}
```

✅ **Revisa tu correo o la carpeta de SPAM** - Recibirás un código de 6 dígitos válido por 5 minutos

#### 2️⃣ Verificar Código OTP

- Vete a **2. Verificar Código OTP**
- Reemplaza `"code": "123456"` con el código que recibiste
- Click **Send**

**Respuesta esperada:**
```json
{
  "message": "Código OTP verificado exitosamente."
}
```

---

### **C. TRANSFERENCIAS (RF-01 - Notificaciones en tiempo real)**

#### 1️⃣ Registrar segundo usuario (receptor)

- Vuelve a **🔐 AUTENTICACIÓN → 1. Registrar Usuario**
- Cambia el email: `receptores@example.com`
- Click **Send**

#### 2️⃣ Realizar Transferencia

- Vete a **💰 TRANSFERENCIAS → 1. Realizar Transferencia**
- Click **Send**

**Respuesta esperada:**
```json
{
  "message": "Transferencia exitosa",
  "fromAccount": {
    "id": 1,
    "saldo": 850
  }
}
```

**✅ AUTOMÁTICAMENTE:**
- 📬 Se envía correo a ambos usuarios
- 📡 Se envía notificación WebSocket a ambos en TIEMPO REAL
- 💾 Se registra en el historial de transacciones

---

### **D. DEPÓSITO (RF-02 - ADMIN ONLY)**

#### 1️⃣ Registrar usuario ADMIN

- Vete a **🔐 AUTENTICACIÓN → 1. Registrar Usuario**
- Email: `admin@example.com`
- Password: `admin123`
- Click **Send**

#### 2️⃣ Actualizar rol en la base de datos

Abre MySQL y ejecuta:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

#### 3️⃣ Login como ADMIN

- Vete a **2b. Login ADMIN**
- Usa credenciales: admin@example.com / admin123
- Click **Send**

✅ **El admin_token se guarda automáticamente en `{{admin_token}}`**

#### 4️⃣ Realizar Depósito

- Vete a **🏦 DEPÓSITO → 1. Realizar Depósito**
- Cambia `toAccountId` al ID de la cuenta que quieres depositar
- Click **Send**

**Respuesta esperada:**
```json
{
  "message": "Depósito exitoso",
  "accountId": 1,
  "saldo": 1500
}
```

**✅ AUTOMÁTICAMENTE:**
- 📬 Se envía correo de confirmación
- 📡 Se notifica al usuario en tiempo real por WebSocket

---

### **E. RETIRO (WITHDRAW)**

- Vete a **🏧 RETIRO → 1. Realizar Retiro**
- Click **Send**

**Respuesta esperada:**
```json
{
  "message": "Retiro exitoso",
  "balance": 900
}
```

---

### **F. TRANSACCIONES (Historial)**

- Vete a **📊 TRANSACCIONES → 1. Obtener Historial**
- Click **Send**

Verás todas las transacciones del usuario autenticado

---

## 📡 WEBSOCKET - CONEXIÓN EN TIEMPO REAL

Esta es la parte más importante para ver las **notificaciones en tiempo real**.

### Opción 1: En Postman

1. Vete a **📡 WEBSOCKET → Conectar a WebSocket**
2. Haz clic en **Send**
3. Postman se conectará al WebSocket

**Verás en tiempo real eventos como:**
```json
{
  "type": "transfer_sent",
  "message": "Has enviado 50.00 a Juan",
  "amount": 50,
  "recipient": "receptor@example.com"
}
```

```json
{
  "type": "transfer_received",
  "message": "Has recibido 50.00 de Juan",
  "amount": 50,
  "sender": "juan@example.com"
}
```

```json
{
  "type": "balance_updated",
  "newBalance": 850
}
```

```json
{
  "type": "session_expired",
  "message": "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
}
```

---

## 📝 CHECKLIST - QUÉ VALIDAR

✅ **Debe funcionar así:**

```
✓ Registrar usuario sin errores
✓ Login genera token JWT válido
✓ OTP se envía por correo dentro de 5 minutos
✓ Verificación de OTP funciona
✓ Transferencia actualiza saldo de ambas cuentas
✓ Se envía correo a ambos usuarios
✓ WebSocket notifica a ambos usuarios en TIEMPO REAL
✓ Solo ADMIN puede hacer depósitos
✓ Saldo se actualiza inmediatamente tras depósito
✓ Retiro valida fondos disponibles
✓ Token expira correctamente (JWT)
✓ Desconexión automática al expirar token
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### ❌ Error: "Cannot POST /api/auth/register"

**Solución:** El servidor no está corriendo
```bash
npm run start:dev
```

### ❌ Error: "Unauthorized" o "Invalid Token"

**Solución:** El token está vacío o expiró
- Ejecuta de nuevo **2. Login (Obtener Token)**
- Verifica que el token se guardó en las variables

### ❌ No recibo correo OTP

**Posibles causas:**
1. Las credenciales SMTP en `.env` son incorrectas
2. El correo está en la carpeta de SPAM
3. El proveedor de correo rechaza la conexión

**Verificar:**
```env
MAIL_HOST=smtp.gmail.com (o tu proveedor)
MAIL_PORT=587
MAIL_USER=tu-email@gmail.com
MAIL_PASSWORD=tu-contraseña-app
```

### ❌ WebSocket no conecta

**Solución:**
1. Verifica que el token sea válido
2. Revisa la consola del servidor para errores JWT
3. Intenta reconectar con un token nuevo

---

## 🎯 INSTRUCCIONES PARA EL PROFESOR

Preséntale esto:

```markdown
# DEMOSTRACIÓN PAYFLOW

## 1. AUTENTICACIÓN
✓ Registrar usuario
✓ Login genera JWT válido
✓ Token expira correctamente

## 2. CORREO Y MENSAJERÍA
✓ OTP se genera y envía por correo
✓ OTP válido por 5 minutos
✓ Verificación funciona

## 3. TRANSFERENCIAS CON NOTIFICACIONES
✓ Realiza transferencia
✓ Correo enviado a ambos usuarios
✓ WebSocket notifica en TIEMPO REAL a ambos

## 4. DEPÓSITO (ADMIN)
✓ Solo ADMIN puede hacer depósitos
✓ Saldo actualiza inmediatamente
✓ Notificación WebSocket en tiempo real

## 5. RETIRO
✓ Valida fondos disponibles
✓ Actualiza saldo
✓ Notificación en tiempo real

## 6. WEBSOCKET/SOCKET.IO
✓ Conexión con JWT
✓ Desconexión automática al expirar
✓ Eventos en tiempo real
```

---

## 📚 Documentación Swagger

Mientras el servidor esté corriendo:

👉 **http://localhost:3000/api/docs**

Aquí verás todos los endpoints documentados con Swagger UI.

---

¡Ya estás listo para probar! 🎉
