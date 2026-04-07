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
2. **Formulario de contacto** que inserta leads en Supabase.
3. **Edge Function `notify-lead`** que envía notificaciones por email usando Resend.
4. **Login administrativo** con Supabase Auth.
5. **Panel `/admin`** para consultar leads registrados.

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
  hooks/                   hooks custom
  i18n/                    contexto y diccionario ES/EN
  integrations/supabase/   cliente tipado de Supabase
  lib/                     utilidades compartidas
  pages/                   páginas por ruta
  test/                    setup y tests básicos
supabase/
  functions/notify-lead/   Edge Function para avisos por email
  migrations/              esquema y políticas RLS
public/                    assets públicos
README.md                  contexto operativo del proyecto
```

## Internacionalización

El sitio tiene soporte bilingüe básico:

- `src/i18n/LanguageContext.tsx` maneja el idioma activo.
- `src/i18n/translations.ts` concentra el contenido ES/EN.
- El idioma cambia desde la navbar.

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

### Base de datos

Migraciones detectadas en `supabase/migrations/`:

- creación de tabla `public.leads`
- RLS habilitado
- inserción pública permitida
- lectura restringida a usuarios autenticados

Campos actuales de `leads`:

- `id`
- `name`
- `email`
- `phone`
- `country`
- `interest`
- `message`
- `created_at`

### Edge Function

Archivo: `supabase/functions/notify-lead/index.ts`

Responsabilidad:

- valida payload con Zod
- lee secrets desde Supabase
- envía email por Resend

Secrets requeridos:

```bash
supabase secrets set RESEND_API_KEY=tu_api_key
supabase secrets set NOTIFY_FROM_EMAIL="Tu Nombre <no-reply@tudominio.com>"
supabase secrets set NOTIFY_TO_EMAIL="destino1@tudominio.com,destino2@tudominio.com"
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

### Puntos a revisar luego

- **Lint**: ya quedó limpio tras ajustar ESLint para archivos utilitarios/UI y corregir dependencias del hook `useScrollAnimation`.
- **React Query**: sigue montado globalmente, pero aún no se usa para queries/mutations reales.
- **Datos placeholder**: hay enlaces y datos de contacto temporales, por ejemplo `https://wa.me/1234567890` y teléfonos genéricos en componentes/páginas.
- Hay varios componentes `ui/` generados que no necesariamente están en uso activo; se puede depurar más adelante.

## Observaciones operativas

- `/login` autentica con email + password vía Supabase Auth.
- `/admin` consulta `leads` ordenados por fecha.
- Si se cambia el modelo de datos de leads, hay que actualizar:
  - migraciones
  - tipos generados de Supabase
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
