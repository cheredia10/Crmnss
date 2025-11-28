# Configuración de Webhooks de CloudTalk

Este documento explica cómo configurar los webhooks de CloudTalk para recibir notificaciones en tiempo real de las llamadas en tu CRM.

## URL del Webhook

La URL de tu webhook es:
```
https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-d03ded2a/cloudtalk/webhook
```

Reemplaza `YOUR_PROJECT_ID` con tu ID de proyecto de Supabase.

## Pasos para Configurar el Webhook en CloudTalk

1. **Inicia sesión en CloudTalk**
   - Ve a https://www.cloudtalk.io/
   - Inicia sesión con tu cuenta

2. **Accede a la Configuración de Webhooks**
   - Navega a `Settings` (Configuración)
   - Busca la sección `Integrations` o `Webhooks`
   - Haz clic en `Add Webhook` o `New Webhook`

3. **Configura el Webhook**
   - **URL**: Ingresa la URL del webhook mencionada arriba
   - **Método**: Selecciona `POST`
   - **Eventos**: Selecciona los siguientes eventos:
     - `call.started` - Cuando una llamada inicia
     - `call.answered` - Cuando una llamada es contestada
     - `call.ended` - Cuando una llamada termina
     - `call.missed` - Cuando una llamada es perdida

4. **Configura la Autenticación (Opcional)**
   - Si CloudTalk requiere autenticación, puedes usar:
     - **Header**: `Authorization`
     - **Value**: `Bearer YOUR_SUPABASE_ANON_KEY`

5. **Guarda la Configuración**
   - Haz clic en `Save` o `Create Webhook`
   - Verifica que el webhook esté activo

## Eventos que se Procesan

El webhook procesa los siguientes eventos y actualiza automáticamente el CRM:

### call.started
- Se crea un nuevo registro de llamada con estado "En Progreso"
- Se almacena la información del contacto y números involucrados

### call.answered
- Se actualiza el estado de la llamada a "Completada"
- Se registra el tiempo de respuesta

### call.ended
- Se actualiza el estado final de la llamada
- Se guarda la duración total de la llamada

### call.missed
- Se marca la llamada como "Perdida"
- Se registra para seguimiento

## Estructura del Payload

El webhook espera recibir un payload con la siguiente estructura:

```json
{
  "event": "call.started | call.answered | call.ended | call.missed",
  "data": {
    "id": "call-id",
    "direction": "inbound | outbound",
    "from": "+34612345678",
    "to": "+34987654321",
    "contact_id": "contact-id",
    "contact_name": "Nombre del Contacto",
    "duration": 120,
    "started_at": "2024-11-28T10:30:00Z",
    "ended_at": "2024-11-28T10:32:00Z",
    "status": "answered | missed | completed"
  }
}
```

## Verificar que el Webhook Funciona

1. **Realiza una llamada de prueba**
   - Haz una llamada a través de CloudTalk
   - El webhook debería recibir las notificaciones automáticamente

2. **Revisa los logs del servidor**
   - Ve a Supabase Dashboard
   - Navega a `Edge Functions` > `Logs`
   - Busca los logs del webhook con el prefijo "CloudTalk Webhook Event:"

3. **Verifica en el CRM**
   - Ve a la sección "Gestión de Llamadas" en el CRM
   - Las llamadas de CloudTalk deberían aparecer automáticamente
   - Los IDs de CloudTalk comenzarán con el prefijo "cloudtalk-"

## Solución de Problemas

### El webhook no recibe eventos
- Verifica que la URL sea correcta
- Comprueba que los eventos estén seleccionados en CloudTalk
- Revisa los logs del servidor para ver si hay errores

### Las llamadas no aparecen en el CRM
- Verifica que el webhook esté guardando en el KV store
- Revisa los logs del servidor para ver mensajes de error
- Comprueba que el formato del payload sea correcto

### Error de autenticación
- Verifica que la API Key de CloudTalk esté configurada correctamente
- Asegúrate de que el SUPABASE_ANON_KEY sea correcto si usas autenticación

## Notas Importantes

- Las llamadas sincronizadas desde CloudTalk tendrán un ID con el formato `cloudtalk-{id}`
- La información completa de la llamada se guarda en el campo `cloudtalkData`
- Las grabaciones de llamadas se pueden reproducir directamente desde el CRM
- El webhook es totalmente automático y no requiere acción manual

## Soporte

Si tienes problemas con la configuración del webhook:
1. Revisa la documentación oficial de CloudTalk: https://www.cloudtalk.io/help/api-documentation
2. Contacta al soporte de CloudTalk para verificar tu configuración
3. Revisa los logs del servidor en Supabase para diagnosticar problemas
