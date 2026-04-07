# Miami Lux Advisor

Frontend inmobiliario construido con **Vite + React + TypeScript + Tailwind + shadcn/ui**, conectado a **Supabase** para captación y gestión de leads.

## Estado actual del proyecto

- `npm run build` ✅
- `npm run test` ✅
- `npm run lint` ✅
- Búsqueda interna de referencias heredadas de constructores externos en el código del proyecto (`src`, `supabase`, configs, docs) ✅ sin resultados

> Regla del proyecto: no debe existir branding, copy o configuración heredada de constructores externos.

## Stack principal

- **Vite 5**
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui + Radix UI**
- **React Router DOM**
- **TanStack React Query**
- **Supabase** (Auth, DB y Edge Functions)
- **Vitest**
- **Playwright** (configurado, no auditado a fondo en esta revisión)

## Qué hace el sitio

El sitio funciona como una landing/site comercial para captación de clientes interesados en invertir en Florida, especialmente en Miami y Orlando.

### Flujos principales

1. **Navegación pública** con varias páginas de contenido.
2. **Formulario de contacto** que env?a leads a la Edge Function `submit-lead`.
3. **Edge Function `submit-lead`** que valida, filtra bots, inserta en Supabase y delega notificaci?n.
4. **Edge Function `notify-lead`** que env?a notificaciones por email usando Resend.
5. **Login administrativo** con Supabase Auth.
6. **Panel `/admin`** para consultar leads registrados.

## Arquitectura de frontend

### Entrada principal

- `src/main.tsx` monta la app.
- `src/App.tsx` configura:
  - `QueryClientProvider`
  - `TooltipProvider`
  - `LanguageProvider`
  - `BrowserRouter`
  - `Suspense` para carga diferida de rutas
  - toast único (`Toaster`)

### Layout compartido

- `src/components/Layout.tsx`
  - `Navbar`
  - contenido principal
  - `Footer`
  - `WhatsAppButton`

### Rutas actuales

Definidas en `src/App.tsx`:

- `/` → Home
- `/sobre-iveth`
- `/equipo`
- `/proyectos`
- `/invertir-en-florida`
- `/financiamiento`
- `/testimonios`
- `/contacto`
- `/login`
- `/admin`
- `*` → `NotFound`

## Estructura del repositorio

```text
src/
  assets/                  imágenes del sitio
  components/              layout, navegación, footer y componentes UI
    ui/                    componentes base de shadcn/ui
  config/                  configuración pública compartida del sitio
  features/                módulos por dominio (auth, leads)
  hooks/                   hooks custom
  i18n/                    contexto y namespaces ES/EN
  integrations/supabase/   cliente tipado de Supabase
 lib/                     utilidades compartidas
  pages/                   páginas por ruta
  test/                    setup y tests básicos
supabase/
  functions/notify-lead/   Edge Function interna para avisos por email
  functions/submit-lead/   Edge Function segura para crear leads
  migrations/              esquema y políticas RLS
public/                    assets públicos
README.md                  contexto operativo del proyecto
```

## Internacionalización

El sitio tiene soporte bilingüe básico:

- `src/i18n/LanguageContext.tsx` maneja el idioma activo.
- `src/i18n/translations/` divide el contenido ES/EN por namespace/p?gina.
- `src/i18n/translations.ts` queda como ?ndice de compatibilidad.
- El idioma cambia desde la navbar.
- El idioma activo se persiste en `localStorage` con la clave `miami-lux-advisor:language`.

## Integración con Supabase

### Variables de entorno

Usar `.env` con:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

### Cliente frontend

Archivo: `src/integrations/supabase/client.ts`

- usa `localStorage`
- persiste sesión
- auto refresca tokens

### Capa frontend de dominio

La lógica de datos ya no vive directamente en las páginas principales.

- `src/features/auth/api.ts` y `src/features/auth/hooks.ts`
  - sesión actual
  - login
  - logout
  - sincronización con cambios de auth

- `src/features/leads/api.ts` y `src/features/leads/hooks.ts`
  - consulta de leads
  - creación de lead vía `submit-lead`
  - notificación interna mediante `notify-lead`

React Query ahora sí se usa para:

- sesión de auth
- lectura de leads
- mutaciones de login
- mutaciones de creación de leads

### Base de datos

Migraciones detectadas en `supabase/migrations/`:

- creaci?n de tabla `public.leads`
- RLS habilitado
- lectura permitida solo a usuarios autenticados
- inserci?n p?blica cerrada; ahora la creaci?n pasa por `submit-lead`

### Flujo seguro de contacto

El formulario `/contacto` ya no inserta directo desde el navegador.

Flujo actual:

1. el frontend valida campos requeridos
2. el frontend env?a a `submit-lead`:
   - datos del lead
   - `honeypot`
   - `startedAt`
3. `submit-lead` valida:
   - campos
   - honeypot vac?o
   - tiempo m?nimo de llenado
4. `submit-lead` inserta el lead con `SUPABASE_SERVICE_ROLE_KEY`
5. `submit-lead` llama internamente a `notify-lead`
6. `notify-lead` valida autorizaci?n interna y env?a email por Resend
7. el frontend recibe ?xito o error

### Funcionamiento detallado de las Edge Functions

#### `submit-lead`

Archivo:

- `supabase/functions/submit-lead/index.ts`

Responsabilidades:

- aceptar el request p?blico del formulario
- validar el payload con Zod
- aplicar filtros anti-bot
- insertar el lead en `public.leads` usando service role
- llamar internamente a `notify-lead`

Controles implementados:

- `honeypot`: si viene lleno, responde ?xito gen?rico y no guarda lead
- `startedAt`: si el formulario se env?a demasiado r?pido, responde ?xito gen?rico y no guarda lead
- validaci?n server-side de:
  - `name`
  - `email`
  - `phone`
  - `country`
  - `interest`
  - `message` opcional

Notas operativas:

- est? desplegada como funci?n p?blica (`--no-verify-jwt`) para que el frontend pueda invocarla con la publishable key
- el navegador ya no tiene permiso para insertar directo en la tabla `leads`

#### `notify-lead`

Archivo:

- `supabase/functions/notify-lead/index.ts`

Responsabilidades:

- recibir internamente los datos ya validados del lead
- verificar que la llamada venga autorizada con `SUPABASE_SERVICE_ROLE_KEY`
- validar el body con Zod
- construir el email HTML
- enviarlo por Resend

Protecci?n:

- si no recibe credenciales internas v?lidas, responde `401`
- no debe usarse como endpoint p?blico del formulario

Relaci?n entre ambas:

1. el frontend llama a `submit-lead`
2. `submit-lead` decide si el request es v?lido
3. si pasa, guarda el lead
4. luego invoca `notify-lead`
5. `notify-lead` manda el correo

Si falla `notify-lead`:

- el lead ya qued? guardado
- el error se registra en logs
- la notificaci?n funciona en modo *best effort*

Esto reduce abuso directo del endpoint p?blico de la tabla `leads`.

Campos actuales de `leads`:

- `id`
- `name`
- `email`
- `phone`
- `country`
- `interest`
- `message`
- `created_at`

Secrets requeridos:

```bash
supabase secrets set RESEND_API_KEY=tu_api_key
supabase secrets set NOTIFY_FROM_EMAIL="Tu Nombre <no-reply@tudominio.com>"
supabase secrets set NOTIFY_TO_EMAIL="destino1@tudominio.com,destino2@tudominio.com"
```

Adem?s, `submit-lead` y `notify-lead` requieren que Supabase provea:

```bash
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

## Configuración local

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear entorno local:

   ```bash
   copy .env.example .env
   ```

3. Completar variables de Supabase.

4. Levantar frontend:

   ```bash
   npm run dev
   ```

## Comandos útiles

```bash
npm run dev
npm run build
npm run test
npm run lint
npm run preview
```

## Hallazgos de auditoría

### Bien resuelto

- La estructura general del proyecto es clara y mantenible.
- Las rutas públicas están separadas por página.
- El flujo de leads está bien definido: formulario → tabla `leads` → notificación por Edge Function.
- El acceso al panel admin depende de sesión de Supabase.
- La documentación ahora refleja mejor la arquitectura real del repo.
- Las rutas ya se cargan de forma diferida (`lazy` + `Suspense`), reduciendo el peso inicial.
- La configuración pública visible del sitio quedó centralizada en `src/config/site.ts`.
- La lógica de auth y leads quedó desacoplada de las páginas mediante `features/` + React Query.`r`n- El acceso a `/admin` ya está encapsulado en un `ProtectedRoute` reutilizable.

### Puntos a revisar luego

- **Lint**: ya quedó limpio tras ajustar ESLint para archivos utilitarios/UI y corregir dependencias del hook `useScrollAnimation`.
- **Datos placeholder**: hay enlaces y datos de contacto temporales, por ejemplo `https://wa.me/1234567890` y teléfonos genéricos en componentes/páginas.
- Hay varios componentes `ui/` generados que no necesariamente están en uso activo; se puede depurar más adelante.

## Observaciones operativas

- `/login` autentica con email + password vía Supabase Auth.
- `/admin` consulta `leads` ordenados por fecha usando React Query.
- Si se cambia el modelo de datos de leads, hay que actualizar:
  - migraciones
  - tipos generados de Supabase
  - `src/features/leads/api.ts`
  - formulario de contacto
  - panel admin
  - Edge Function `notify-lead`

## Política interna de documentación

Si se actualiza este proyecto más adelante, mantener este README alineado con:

- rutas reales
- estructura de carpetas
- variables de entorno vigentes
- flujo de Supabase
- restricciones del proyecto

Y recordar siempre:

- No agregar branding heredado de constructores externos
- **No dejar placeholders de contacto en producción**


