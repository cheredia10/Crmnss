# 🔑 Actualizar CloudTalk API Key

## Problema
Si ves el mensaje "CloudTalk: No se encontraron llamadas" o "CloudTalk no está disponible", significa que tu API Key necesita ser actualizada en la configuración del servidor.

## Solución

### Paso 1: Obtén tu API Key de CloudTalk

1. Inicia sesión en [CloudTalk](https://www.cloudtalk.io/)
2. Ve a **Settings** → **Integrations** → **API**
3. Copia tu API Key (debería verse algo así: `HvX49;50WLkx1b6c;xK8oS17hChvX7BE8lJIOB8prPXEeout`)

### Paso 2: Actualiza la variable de entorno en Supabase

#### Opción A: Desde el Dashboard de Supabase (Recomendado)

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. En el menú lateral, ve a **Settings** (⚙️)
4. Haz clic en **Edge Functions**
5. Busca la pestaña **Secrets** o **Environment Variables**
6. Busca la variable llamada `CLOUDTALK_API_KEY`
7. Haz clic en **Edit** o en el ícono de lápiz
8. Pega tu nueva API Key
9. Haz clic en **Save** o **Update**
10. **Importante:** Espera 1-2 minutos para que los cambios se propaguen

#### Opción B: Usando Supabase CLI

Si tienes instalado Supabase CLI, puedes actualizar el secreto con este comando:

```bash
supabase secrets set CLOUDTALK_API_KEY=TU_API_KEY_AQUI
```

### Paso 3: Verifica la conexión

1. Ve a tu CRM
2. En el **menú lateral izquierdo** (barra de iconos), busca el ícono de engranaje ⚙️ (es el último icono)
3. Haz clic en el ícono de **Configuración** (Settings)
4. Se abrirá la página "Configuración de CloudTalk"
5. Haz clic en el botón azul **"Verificar Conexión"** (arriba a la derecha)
6. Deberías ver un recuadro verde con el mensaje: ✅ **CloudTalk Conectado**

**Vista del menú:**
```
┌─────────┐
│  CRM    │ ← Logo
├─────────┤
│   🔍   │ ← Búsqueda
├─────────┤
│   🏠   │ ← Dashboard
│   👥   │ ← Clientes
│   📞   │ ← Llamadas
│   📄   │ ← Documentos
│   📁   │ ← Seguimiento
│   📊   │ ← Tablero
│   ⚙️   │ ← Configuración (AQUÍ)
└─────────┘
```

## ¿Qué pasa si sigo viendo errores?

### Error: "No se encontraron llamadas"

**Posibles causas:**
- No hay llamadas en los últimos 30 días en tu cuenta de CloudTalk
- La API Key es válida pero tu cuenta está vacía
- Los permisos de la API Key no incluyen acceso a llamadas

**Solución:**
- Realiza una llamada de prueba en CloudTalk
- Verifica que tu API Key tenga permisos de lectura para llamadas
- Espera unos minutos después de la llamada y vuelve a sincronizar

### Error: "CloudTalk API no disponible"

**Posibles causas:**
- La API Key es incorrecta o ha expirado
- La API Key no está configurada en Supabase
- Hay un problema con la API de CloudTalk

**Solución:**
1. Verifica que copiaste la API Key completa (sin espacios al inicio o final)
2. Genera una nueva API Key en CloudTalk
3. Asegúrate de que la variable se llame exactamente `CLOUDTALK_API_KEY` en Supabase

## Formato correcto de la API Key

✅ **Correcto:**
```
HvX49;50WLkx1b6c;xK8oS17hChvX7BE8lJIOB8prPXEeout
```

❌ **Incorrecto:**
```
"HvX49;50WLkx1b6c;xK8oS17hChvX7BE8lJIOB8prPXEeout"  (con comillas)
 HvX49;50WLkx1b6c;xK8oS17hChvX7BE8lJIOB8prPXEeout  (con espacio al inicio)
HvX49;50WLkx1b6c;xK8oS17hChvX7BE8lJIOB8prPXEeout  (con espacio al final)
```

## Funcionalidades que requieren CloudTalk configurado

Una vez que actualices tu API Key correctamente, tendrás acceso a:

- ✓ **Click-to-Call**: Llamar directamente desde el CRM
- ✓ **Historial de Llamadas**: Ver todas tus llamadas de CloudTalk
- ✓ **Grabaciones de Llamadas**: Reproducir grabaciones directamente en el CRM
- ✓ **Estadísticas en Tiempo Real**: Métricas de llamadas en el dashboard
- ✓ **Información de Agentes**: Ver el estado de tus agentes de CloudTalk

## ¿Necesitas más ayuda?

- Revisa `CLOUDTALK_TROUBLESHOOTING.md` para problemas avanzados
- Revisa `CLOUDTALK_WEBHOOK_SETUP.md` para configurar webhooks
- Contacta al soporte de CloudTalk si tu API Key no funciona

---

**Última actualización:** Noviembre 2024
