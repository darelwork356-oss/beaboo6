# CONFIGURAR AWS S3 (ÚLTIMO PASO)

## En Vercel:

1. Ve a tu proyecto en Vercel
2. Click "Settings" > "Environment Variables"
3. Agrega estas 4 variables (una por una):

### Variable 1:
- Name: `MY_AWS_REGION`
- Value: `us-east-2`
- Click "Save"

### Variable 2:
- Name: `MY_AWS_ACCESS_KEY_ID`
- Value: (Tu Access Key de AWS - la tienes en AWS Console)
- Click "Save"

### Variable 3:
- Name: `MY_AWS_SECRET_ACCESS_KEY`
- Value: (Tu Secret Key de AWS - la tienes en AWS Console)
- Click "Save"

### Variable 4:
- Name: `MY_AWS_S3_BUCKET_NAME`
- Value: `libros-de-glam-2025`
- Click "Save"

## ¿No tienes las credenciales de AWS?

1. Ve a https://console.aws.amazon.com
2. Busca "IAM" en el buscador
3. Click "Users" > Tu usuario
4. Click "Security credentials"
5. Click "Create access key"
6. Copia el Access Key ID y Secret Access Key

## Después de agregar las 4 variables:

1. Ve a "Deployments"
2. Click los 3 puntos del último
3. Click "Redeploy"

¡LISTO! Todo funcionará.
