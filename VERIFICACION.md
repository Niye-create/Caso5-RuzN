# ✅ VERIFICACIÓN - PayFlow Funcionando Correctamente

## 🔍 ANTES DE PRESENTAR AL PROFESOR

Usa esta checklist para verificar que **TODAS las funcionalidades están activas**.

---

## 1️⃣ VERIFICAR SERVIDOR CORRIENDO

### Comando:
```bash
npm run start:dev
```

### Espera ver en consola:
```
[Nest] 12345  - 05/25/2026, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 05/25/2026, 10:30:01 AM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 05/25/2026, 10:30:01 AM     LOG [InstanceLoader] AuthModule dependencies initialized
[Nest] 12345  - 05/25/2026, 10:30:02 AM     LOG [InstanceLoader] MailModule dependencies initialized
[Nest] 12345  - 05/25/2026, 10:30:02 AM     LOG [InstanceLoader] NotificationsModule dependencies initialized
...
🚀 Server running on http://localhost:3000/api
📖 Documentation available on http://localhost:3000/api/docs
```

✅ **Si ves esto, el servidor está corriendo bien**

---

## 2️⃣ VERIFICAR POSTMAN IMPORTADO

### Pasos:
1. Abre Postman
2. Haz clic en **Collections**
3. Debería ver: **PayFlow API - Completa**

✅ **Si ves esto, la colección está importada**

---

## 3️⃣ PROBAR CADA FUNCIONALIDAD

### ✓ TEST 1: AUTENTICACIÓN

**Endpoint:** `POST /api/auth/register`

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Respuesta esperada:**
```json
{
  "userId": 1,
  "nombre": "Test User",
  "email": "test@example.com",
  "message": "Usuario registrado exitosamente"
}
```

✅ **Si ves esto, el registro funciona**

---

### ✓ TEST 2: LOGIN Y TOKEN JWT

**Endpoint:** `POST /api/auth/login`

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Respuesta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "test@example.com"
}
```

✅ **Si ves un token JWT, el login funciona**

**Para verificar el token es válido**, cópialo y pégalo en: **https://jwt.io/**

Deberías ver:
```
Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "email": "test@example.com", "sub": 1, "iat": 1716638400, "exp": 1716642000 }
```

✅ **Si ves esto, el JWT está bien configurado**

---

### ✓ TEST 3: CORREO Y OTP

**Endpoint:** `POST /api/mail/request-otp`

```bash
curl -X POST http://localhost:3000/api/mail/request-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Respuesta esperada:**
```json
{
  "message": "Código OTP enviado exitosamente"
}
```

**Verificación:**
- 📧 Revisa la bandeja de entrada de `test@example.com`
- Deberías recibir un email con un código de 6 dígitos
- El código es válido por 5 minutos

✅ **Si recibes el correo con código, el OTP funciona**

---

### ✓ TEST 4: VERIFICAR OTP

**Endpoint:** `POST /api/mail/verify-otp`

```bash
curl -X POST http://localhost:3000/api/mail/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456"
  }'
```

(Reemplaza `123456` con el código que recibiste)

**Respuesta esperada:**
```json
{
  "message": "Código OTP verificado exitosamente."
}
```

✅ **Si ves esto, la verificación de OTP funciona**

---

### ✓ TEST 5: TRANSFERENCIAS (Con notificaciones)

**Primero, registra un segundo usuario:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Usuario 2",
    "email": "usuario2@example.com",
    "password": "password123"
  }'
```

**Luego realiza una transferencia:**

**Endpoint:** `POST /api/transfer`

```bash
curl -X POST http://localhost:3000/api/transfer \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "toAccountId": 2,
    "amount": 50
  }'
```

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

**Verificaciones automáticas que pasan:**
- ✓ Saldo del usuario 1 disminuye
- ✓ Saldo del usuario 2 aumenta
- ✓ Se registra en historial de transacciones
- ✓ Se envía correo a ambos usuarios
- ✓ Se emiten notificaciones WebSocket a ambos

✅ **Si ves todo esto, las transferencias funcionan**

---

### ✓ TEST 6: DEPÓSITO (ADMIN)

**Primero, crea usuario ADMIN:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Admin User",
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Luego, actualiza el rol en MySQL:**

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

**Haz login como admin:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Realiza un depósito:**

**Endpoint:** `POST /api/transfer/deposit`

```bash
curl -X POST http://localhost:3000/api/transfer/deposit \
  -H "Authorization: Bearer ADMIN_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "toAccountId": 1,
    "amount": 500
  }'
```

**Respuesta esperada:**
```json
{
  "message": "Depósito exitoso",
  "accountId": 1,
  "saldo": 1350
}
```

✅ **Si ves esto, los depósitos (ADMIN) funcionan**

---

### ✓ TEST 7: WEBSOCKET (Conexión en tiempo real)

**En Postman:**
1. Vete a **Collections → 📡 WEBSOCKET → Conectar a WebSocket**
2. Haz clic en **Send**

**Deberías ver en la sección "Messages":**
```
✓ Connected
```

**Ahora, desde otra ventana de Postman:**
1. Realiza una transferencia (vuelve a TEST 5)

**En la ventana WebSocket deberías ver eventos en TIEMPO REAL:**

```json
{
  "type": "balance_updated",
  "newBalance": 1350
}
```

O si eres el que recibe:

```json
{
  "type": "transfer_received",
  "message": "Has recibido 50.00 de Test User",
  "amount": 50,
  "sender": "test@example.com"
}
```

✅ **Si ves eventos en tiempo real, WebSocket funciona**

---

## 📊 TABLA DE VERIFICACIÓN COMPLETA

| Funcionalidad | Comando Test | Status | Notas |
|---------------|-------------|--------|-------|
| 🔐 Registro | POST /auth/register | ✓ | Usuario creado |
| 🔐 Login | POST /auth/login | ✓ | JWT generado |
| 📧 OTP Solicitar | POST /mail/request-otp | ✓ | Correo recibido |
| 📧 OTP Verificar | POST /mail/verify-otp | ✓ | Código válido |
| 💰 Transferencia | POST /transfer | ✓ | Saldo actualizado |
| 💰 Transferencia - Correo | - | ✓ | Email enviado |
| 💰 Transferencia - WebSocket | WebSocket connect | ✓ | Notificación en tiempo real |
| 🏦 Depósito (ADMIN) | POST /transfer/deposit | ✓ | Solo ADMIN |
| 🏧 Retiro | POST /transfer/withdraw | ✓ | Fondos validados |
| 📡 WebSocket | ws://localhost:3000/notifications | ✓ | Conectado |

---

## 🎯 PRESENTACIÓN AL PROFESOR

Cuando todo esté verde (✓), muéstrale esto:

### Pantalla 1: Servidor corriendo
```
🚀 Server running on http://localhost:3000/api
```

### Pantalla 2: Swagger Docs
Abre: **http://localhost:3000/api/docs**
- Muestra todos los endpoints documentados
- Interactivos con Swagger UI

### Pantalla 3: Postman - Ejecutar endpoints
1. **Registrar usuario** → 201 ✓
2. **Login** → token generado ✓
3. **OTP** → correo recibido ✓
4. **Transferencia** → ambos usuarios notificados ✓
5. **WebSocket** → eventos en tiempo real ✓

### Pantalla 4: Correo recibido
Muestra el correo que llegó de:
- Solicitud de OTP
- Comprobante de transferencia
- Confirmación de depósito

### Pantalla 5: WebSocket en tiempo real
Muestra cómo los eventos llegan instantáneamente cuando se realiza una transferencia

---

## 🚨 SOLUCIÓN RÁPIDA DE PROBLEMAS

| Problema | Causa | Solución |
|----------|-------|----------|
| ❌ Cannot POST /api/auth/register | Servidor no corriendo | `npm run start:dev` |
| ❌ "Invalid Token" | Token vacío o expirado | Ejecuta login de nuevo |
| ❌ No recibo correo | SMTP mal configurado | Revisa .env MAIL_* |
| ❌ WebSocket no conecta | JWT inválido | Verifica token en jwt.io |
| ❌ Error 403 en depósito | Usuario no es ADMIN | Actualiza rol en BD |

---

## 📝 NOTAS IMPORTANTES

1. **El `.env` debe estar configurado correctamente:**
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=1234
   DB_DATABASE=payflow
   JWT_SECRET=una_clave_secreta
   MAIL_HOST=smtp.gmail.com (o tu proveedor)
   MAIL_PORT=587
   MAIL_USER=tu-email@gmail.com
   MAIL_PASSWORD=tu-contraseña-app
   ```

2. **La base de datos debe estar corriendo:**
   ```bash
   # En MySQL Workbench o línea de comandos
   mysql -u root -p
   CREATE DATABASE payflow;
   ```

3. **NestJS migra las tablas automáticamente** con TypeORM

---

¡Cuando todos los tests sean ✓, estás listo para el profesor! 🚀
