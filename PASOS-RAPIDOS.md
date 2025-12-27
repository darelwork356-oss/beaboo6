# 🚀 PASOS PARA CONFIGURAR TODO (5 minutos)

## 1️⃣ Conectar GitHub a Vercel

1. Ve a: https://vercel.com/new
2. Click en "Import Git Repository"
3. Busca: `darelwork356-oss/beaboo6`
4. Click "Import"
5. Click "Deploy" (no configures nada aún)

## 2️⃣ Crear Base de Datos PostgreSQL

1. En Vercel, ve a tu proyecto
2. Click en "Storage" (menú lateral)
3. Click "Create Database"
4. Selecciona "Postgres"
5. Nombre: `beaboo-db`
6. Click "Create"

## 3️⃣ Ejecutar el Schema SQL

1. En la base de datos que creaste, click en "Query"
2. Abre el archivo `schema.sql` de tu proyecto
3. Copia TODO el contenido
4. Pégalo en el Query editor de Vercel
5. Click "Run Query"

## 4️⃣ Configurar Variables de Entorno

1. Ve a Settings > Environment Variables
2. Agrega estas variables (una por una):

```
DATABASE_URL
(Vercel ya lo configuró automáticamente, verifica que esté)

MY_AWS_REGION
us-east-2

MY_AWS_ACCESS_KEY_ID
(Usa tu Access Key de AWS)

MY_AWS_SECRET_ACCESS_KEY
(Usa tu Secret Key de AWS)

MY_AWS_S3_BUCKET_NAME
libros-de-glam-2025

NODE_ENV
production
```

3. Click "Save" en cada una

## 5️⃣ Re-desplegar

1. Ve a "Deployments"
2. Click en los 3 puntos del último deployment
3. Click "Redeploy"

## ✅ LISTO!

Tu app estará en: `https://tu-proyecto.vercel.app`

---

## 🧪 Probar las APIs:

```bash
# Ver notas
https://tu-proyecto.vercel.app/api?action=get-notes

# Ver historias
https://tu-proyecto.vercel.app/api?action=get-stories

# Ver usuario
https://tu-proyecto.vercel.app/api?action=get-user-data&userId=test123

# Ver capítulos de una historia
https://tu-proyecto.vercel.app/api?action=get-chapters&storyId=story123
```

---

## ⚠️ Si algo falla:

1. Ve a Deployments > Click en el último > "View Function Logs"
2. Busca errores en rojo
3. Avísame qué dice el error
