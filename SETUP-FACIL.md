# CONFIGURACIÓN SÚPER SIMPLE

## PASO 1: Subir a Vercel
1. Ve a https://vercel.com
2. Click "Add New" > "Project"
3. Importa tu repositorio de GitHub
4. Click "Deploy"

## PASO 2: Crear Base de Datos
1. En tu proyecto de Vercel, ve a "Storage"
2. Click "Create Database" > "Postgres"
3. Dale un nombre cualquiera
4. Click "Create"

## PASO 3: Conectar la Base de Datos
1. Vercel conectará automáticamente la base de datos
2. Ve a "Settings" > "Environment Variables"
3. Verifica que exista `DATABASE_URL`

## PASO 4: Ejecutar SQL
1. Ve a tu base de datos en Vercel
2. Click en "Query"
3. Copia y pega TODO el contenido de `schema.sql`
4. Click "Execute"

## PASO 5: Redesplegar
1. Ve a "Deployments"
2. Click en los 3 puntos del último
3. Click "Redeploy"

## ¿FUNCIONA?
Abre: `https://tu-proyecto.vercel.app`

Si no funciona, mándame:
1. La URL de tu proyecto
2. Screenshot del error
3. Screenshot de tus Environment Variables

YO TE AYUDO A ARREGLARLO.
