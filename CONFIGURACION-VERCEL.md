# 🚀 Guía de Configuración BeaBoo en Vercel

## ❌ Problemas que tenías:

1. **No había archivo .env** - Las APIs no podían conectarse a AWS ni a la base de datos
2. **like-note.js usaba formato Netlify** - No funcionaba en Vercel
3. **like-note.js usaba S3 en lugar de PostgreSQL** - Arquitectura incorrecta
4. **Faltaban variables de entorno configuradas**

## ✅ Soluciones aplicadas:

1. ✅ Creado archivo `.env` para desarrollo local
2. ✅ Convertido `like-note.js` al formato de Vercel
3. ✅ Cambiado `like-note.js` para usar PostgreSQL
4. ✅ Todas las APIs ahora usan el formato correcto de Vercel

---

## 📋 Pasos para configurar en Vercel:

### 1️⃣ Crear Base de Datos PostgreSQL

**Opción A - Vercel Postgres (Recomendado):**
```bash
1. Ve a tu proyecto en Vercel
2. Click en "Storage" en el menú lateral
3. Click en "Create Database"
4. Selecciona "Postgres"
5. Copia el DATABASE_URL que te proporciona
```

**Opción B - AWS RDS PostgreSQL:**
```bash
1. Ve a AWS Console > RDS
2. Crea una instancia PostgreSQL
3. Configura acceso público (o VPC si prefieres)
4. Copia el connection string
```

### 2️⃣ Ejecutar el Schema SQL

Conecta a tu base de datos y ejecuta el schema:

```bash
# Si usas Vercel Postgres
psql "postgresql://usuario:password@host:5432/database" -f schema.sql

# O desde la consola de Vercel
# Ve a Storage > Tu base de datos > Query
# Copia y pega el contenido de schema.sql
```

### 3️⃣ Configurar Variables de Entorno en Vercel

Ve a tu proyecto en Vercel > Settings > Environment Variables y agrega:

```
DATABASE_URL=postgresql://usuario:password@host:5432/database
MY_AWS_REGION=us-east-2
MY_AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
MY_AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MY_AWS_S3_BUCKET_NAME=libros-de-glam-2025
NODE_ENV=production
```

### 4️⃣ Configurar AWS S3

1. Ve a AWS Console > S3
2. Crea un bucket llamado `libros-de-glam-2025` (o el nombre que prefieras)
3. Configura CORS en el bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

4. Ve a IAM > Users > Create User
5. Asigna permisos de S3 (AmazonS3FullAccess o permisos específicos)
6. Crea Access Keys y cópialas

### 5️⃣ Desplegar en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# O conecta tu repositorio de GitHub en vercel.com
```

---

## 🧪 Probar Localmente

### 1. Edita el archivo `.env` con tus credenciales reales:

```bash
DATABASE_URL=postgresql://tu_usuario:tu_password@tu_host:5432/tu_database
MY_AWS_REGION=us-east-2
MY_AWS_ACCESS_KEY_ID=tu_access_key_real
MY_AWS_SECRET_ACCESS_KEY=tu_secret_key_real
MY_AWS_S3_BUCKET_NAME=libros-de-glam-2025
NODE_ENV=development
```

### 2. Instala dependencias:

```bash
npm install
```

### 3. Ejecuta el schema en tu base de datos:

```bash
psql $DATABASE_URL -f schema.sql
```

### 4. Prueba con Vercel Dev:

```bash
vercel dev
```

Esto iniciará un servidor local en `http://localhost:3000`

---

## 🔍 Verificar que todo funciona:

### Probar API de notas:
```bash
# GET notas
curl http://localhost:3000/api/get-notes

# POST nota (necesitas un userId válido)
curl -X POST http://localhost:3000/api/upload-note \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user","content":"Hola mundo"}'
```

### Probar API de likes:
```bash
curl -X POST http://localhost:3000/api/like-note \
  -H "Content-Type: application/json" \
  -d '{"noteId":"note_123","userId":"user_456"}'
```

---

## 📁 Arquitectura Final:

```
Frontend (HTML/CSS/JS)
    ↓
Vercel Serverless Functions (/api)
    ↓
PostgreSQL (metadata: usuarios, notas, likes)
    ↓
AWS S3 (imágenes y archivos)
```

---

## ⚠️ IMPORTANTE:

1. **Nunca subas el archivo `.env` a Git** - Ya está en `.gitignore`
2. **Configura las variables en Vercel** - Usa el dashboard de Vercel
3. **Ejecuta el schema.sql** - Sin esto, las tablas no existen
4. **Verifica las credenciales de AWS** - Deben tener permisos de S3

---

## 🆘 Si algo no funciona:

1. Verifica los logs en Vercel: `vercel logs`
2. Revisa que las variables de entorno estén configuradas
3. Confirma que el schema SQL se ejecutó correctamente
4. Verifica que el bucket S3 existe y tiene CORS configurado
5. Prueba las credenciales de AWS con AWS CLI: `aws s3 ls`
