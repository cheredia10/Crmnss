# Solución de Problemas - CloudTalk Integration

## 🚨 Problema Común: "No se encontraron llamadas"

**Si ves este mensaje, probablemente necesitas actualizar tu API Key.**

👉 **[Ver guía completa de actualización de API Key](./CLOUDTALK_API_KEY_UPDATE.md)**

Resumen rápido:
1. Ve a Supabase Dashboard → Settings → Edge Functions → Secrets
2. Actualiza `CLOUDTALK_API_KEY` con tu nueva clave
3. Espera 1-2 minutos
4. Verifica la conexión desde el CRM

---

## Error 404: Endpoints no encontrados

Si estás viendo errores 404 de la API de CloudTalk, esto significa que la API no está respondiendo o los endpoints no están disponibles.

### Posibles Causas:

1. **API Key no válida o expirada** ⭐ CAUSA MÁS COMÚN
   - Verifica que tu API Key de CloudTalk sea correcta
   - Comprueba que no haya expirado
   - Asegúrate de que tenga los permisos necesarios
   - **[Sigue esta guía para actualizar](./CLOUDTALK_API_KEY_UPDATE.md)**

2. **Cuenta de CloudTalk no configurada**
   - Necesitas una cuenta activa de CloudTalk
   - La cuenta debe tener acceso a la API
   - Verifica tu plan de CloudTalk (la API puede requerir un plan específico)

3. **Endpoints de API diferentes**
   - CloudTalk puede usar diferentes versiones de API
   - Los endpoints pueden variar según tu región o plan

### Soluciones:

#### 1. Verificar tu API Key de CloudTalk

1. Inicia sesión en CloudTalk: https://www.cloudtalk.io/
2. Ve a Settings → Integrations → API
3. Verifica o regenera tu API Key
4. Actualiza la API Key en Supabase:
   - Ve a tu proyecto en Supabase
   - Settings → Edge Functions → Secrets
   - Actualiza CLOUDTALK_API_KEY

#### 2. Verificar Documentación de CloudTalk

La API de CloudTalk puede variar. Consulta la documentación oficial:
- https://www.cloudtalk.io/help/api-documentation
- https://docs.cloudtalk.io/

Los endpoints comunes son:
```
GET /api/v1/calls
POST /api/v1/calls
GET /api/v1/users
```

#### 3. Usar Modo Limitado (Sin CloudTalk)

Si CloudTalk no está disponible o no tienes acceso, el CRM funcionará de forma limitada:

**✅ Funcionalidades Disponibles:**
- Gestión de clientes
- Registro manual de llamadas
- Documentos
- Seguimiento
- Tareas

**❌ Funcionalidades No Disponibles:**
- Click-to-Call automático
- Sincronización de llamadas
- Grabaciones de CloudTalk
- Estadísticas de CloudTalk en tiempo real

#### 4. Configuración Alternativa

Si los endpoints estándar no funcionan, puedes necesitar ajustar la URL base de la API.

Edita `/supabase/functions/server/cloudtalk.tsx`:

```typescript
// Cambia de:
const CLOUDTALK_API_BASE = 'https://api.cloudtalk.io/v1';

// A tu URL específica (consulta con CloudTalk):
const CLOUDTALK_API_BASE = 'https://api.cloudtalk.io/api/v1';
// O la región específica:
const CLOUDTALK_API_BASE = 'https://eu-api.cloudtalk.io/v1';
```

## Comportamiento Actual del Sistema

El sistema ahora está configurado para **fallar de forma elegante**:

### Sin CloudTalk configurado:
- ✅ El dashboard NO mostrará estadísticas de CloudTalk
- ✅ El botón de sincronizar mostrará un mensaje informativo
- ✅ Click-to-Call mostrará un error amigable
- ✅ El resto del CRM funciona normalmente

### Con CloudTalk configurado pero sin llamadas:
- ✅ El dashboard muestra las estadísticas solo si hay llamadas
- ✅ La sincronización retorna un mensaje de "0 llamadas encontradas"
- ✅ No se muestran errores en consola

## Verificar si CloudTalk está Funcionando

### Test Manual:

1. **Probar la API Key:**
```bash
curl -H "Authorization: Bearer TU_API_KEY" \
  https://api.cloudtalk.io/v1/calls
```

Si recibes:
- **200 OK con datos**: ✅ API funcionando
- **401 Unauthorized**: ❌ API Key incorrecta
- **404 Not Found**: ⚠️ Endpoint incorrecto o API no disponible
- **403 Forbidden**: ❌ Sin permisos

2. **Revisar Logs en Supabase:**
   - Ve a tu proyecto en Supabase
   - Edge Functions → Logs
   - Busca mensajes de "CloudTalk"

## Contacto con Soporte

Si necesitas ayuda adicional:

1. **Soporte de CloudTalk:**
   - Email: support@cloudtalk.io
   - Chat: https://www.cloudtalk.io/help

2. **Documentación:**
   - API Docs: https://docs.cloudtalk.io/
   - Help Center: https://www.cloudtalk.io/help

## Checklist de Configuración

- [ ] Cuenta de CloudTalk activa
- [ ] API Key generada en CloudTalk
- [ ] API Key configurada en Supabase (CLOUDTALK_API_KEY)
- [ ] Plan de CloudTalk incluye acceso a API
- [ ] Endpoint URL correcta para tu región
- [ ] Permisos de API correctos en CloudTalk

## Alternativas si CloudTalk no está Disponible

1. **Registro Manual de Llamadas**: El CRM permite registrar llamadas manualmente
2. **Integración Futura**: El código está preparado para cuando CloudTalk esté disponible
3. **Otras Integraciones**: El sistema puede adaptarse a otras plataformas de telefonía

## Notas Importantes

- El CRM funciona completamente SIN CloudTalk
- CloudTalk es una funcionalidad OPCIONAL que añade automatización
- Todas las funcionalidades core del CRM están disponibles sin CloudTalk
- La integración puede activarse en cualquier momento cuando CloudTalk esté disponible
