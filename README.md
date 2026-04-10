# Iveth Coll Realtor

Sitio inmobiliario bilingüe construido con **Vite + React + TypeScript + Tailwind + shadcn/ui**, conectado a **Supabase** para autenticación, catálogo de proyectos y captación de leads.

## Estado del proyecto

- Build: `npm run build` ✅
- Tests: `npm run test`
- Lint: `npm run lint`
- Soporte bilingüe ES/EN ✅
- Panel admin protegido con Supabase Auth ✅
- Catálogo de proyectos conectado a Supabase ✅
- Sección Team con compañías aliadas y modal de detalle ✅

## Regla de documentación del proyecto

A partir de este momento, **cada funcionalidad o cambio implementado debe registrarse también en este `README.md`**.

Convención para futuras actualizaciones:
- actualizar la estructura si cambia el repo
- documentar nuevas rutas, funciones, integraciones o migraciones
- añadir una línea en la sección **Bitácora de cambios**
- mantener el archivo en **UTF-8**

## Stack principal

- Vite 5
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI
- React Router DOM
- TanStack React Query
- Supabase
- Vitest
- Playwright

## Scripts útiles

```bash
npm run dev
npm run build
npm run test
npm run test:watch
npm run lint
npm run preview
```

## Variables de entorno

Archivo `.env`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

## Arquitectura general

### Frontend

- `src/main.tsx` monta la aplicación
- `src/App.tsx` configura providers, router, lazy loading y rutas
- `src/components/Layout.tsx` compone navbar, contenido, footer y botón de WhatsApp
- `src/features/` contiene la lógica por dominio
- `src/i18n/` centraliza idioma, rutas localizadas y traducciones

### Backend / Supabase

- `supabase/functions/submit-lead` recibe leads públicos con validación y anti-bot
- `supabase/functions/notify-lead` envía notificaciones por email
- `supabase/functions/delete-project` elimina proyectos y recursos asociados
- `supabase/migrations/` contiene esquema y cambios de base de datos

## Rutas principales

Rutas públicas localizadas desde `src/App.tsx`:

- `/` / Home
- `/sobre-iveth`
- `/equipo`
- `/proyectos`
- `/invertir-en-florida`
- `/financiamiento`
- `/guias`
- `/testimonios`
- `/contacto`
- `/login`
- `/admin`

## Estructura del proyecto

```text
.
├─ public/
├─ src/
│  ├─ assets/                    # imágenes, logos y recursos visuales
│  ├─ components/                # layout, navbar, footer y componentes compartidos
│  │  └─ ui/                     # componentes base de shadcn/ui
│  ├─ config/                    # configuración pública del sitio
│  ├─ features/
│  │  ├─ auth/                   # auth con Supabase
│  │  ├─ leads/                  # envío y consulta de leads
│  │  └─ projects/               # catálogo de proyectos
│  ├─ hooks/                     # hooks custom
│  ├─ i18n/                      # idioma, rutas localizadas y traducciones
│  │  └─ translations/           # namespaces ES/EN por sección
│  ├─ integrations/
│  │  └─ supabase/               # cliente y tipos de Supabase
│  ├─ lib/                       # utilidades compartidas
│  ├─ pages/                     # páginas por ruta
│  ├─ test/                      # setup y tests base
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ supabase/
│  ├─ functions/
│  │  ├─ delete-project/
│  │  ├─ notify-lead/
│  │  └─ submit-lead/
│  ├─ migrations/
│  └─ config.toml
├─ package.json
└─ README.md
```

## Módulos importantes

### `src/features/auth`

Maneja:
- sesión actual
- login
- logout
- sincronización con Supabase Auth

### `src/features/leads`

Maneja:
- creación de leads desde contacto
- consulta de leads para admin
- integración con Edge Functions

### `src/features/projects`

Maneja:
- lectura del catálogo de proyectos
- tipado y hooks del catálogo
- soporte para campo `price_from`

## Internacionalización

- Idiomas soportados: **español** e **inglés**
- Contexto principal: `src/i18n/LanguageContext.tsx`
- Traducciones por sección: `src/i18n/translations/`
- Rutas localizadas: `src/i18n/routes.ts`

## Integración con Supabase

### Frontend

Archivo principal:
- `src/integrations/supabase/client.ts`

### Edge Functions activas

- `submit-lead`: valida formulario, filtra bots e inserta leads
- `notify-lead`: envía email interno
- `delete-project`: elimina proyectos desde flujo administrativo

### Migraciones relevantes

- creación y seguridad de leads
- creación del catálogo de proyectos
- seed inicial del catálogo
- campo `price_from` en proyectos
- backfill de precios

## Convenciones de mantenimiento

- mantener `README.md` actualizado con cada cambio funcional
- no dejar texto o branding heredado de proyectos externos
- usar UTF-8 en archivos con contenido ES/EN
- si cambia el modelo de datos, actualizar también:
  - migraciones
  - tipos de Supabase
  - hooks de dominio
  - páginas afectadas
  - este README

## Bitácora de cambios

### 2026-04-09

- Se agregó el campo `price_from` al catálogo de proyectos y se mostraron precios desde en la UI.
- Se aplicaron migraciones y backfill para precios de proyectos en Supabase.
- Se ajustó el logo del header para mejorar presencia visual.
- Se creó la sección de compañías aliadas en Team.
- Se agregaron logos y descripciones para:
  - ACMM Consulting
  - First Title Group
  - Fortex Realty
  - Home Financing Experts
- Se implementó truncado de descripciones a 3 líneas con modal `View more`.
- Se alinearon y refinaron badges, logos, títulos y botones de las tarjetas de partners.
- Se corrigió encoding UTF-8 en textos de Team.
- Se habilitó división silábica para mejorar la justificación del texto.
- La grilla de partners se ajustó a 4 columnas en pantallas grandes.
- Se amplió el ancho útil de la sección de partners para que las tarjetas se vean más anchas sin solaparse.
- Se creó la nueva página pública `Guías` con ruta localizada (`/guias` / `/guides`).
- Se integró `Guías` en navbar y footer.
- La nueva sección resume contenido editorial basado en fuentes oficiales del IRS, CFPB, HUD, DBPR y herramientas públicas de property appraisers.
- Se corrigió el encoding visible del footer al tocar esa navegación.
- Se refinó el hero de `Guías` para mover la nota editorial a una tarjeta horizontal debajo del texto principal.
- Se expandió el hero de `Guías` para que el bloque principal y la tarjeta editorial ocupen todo el ancho útil de la página.
- Se apiló la tarjeta editorial de `Guías` con el título arriba y la descripción debajo.
- Se transformó el hero de `Guías` en una sección visual con una nueva imagen licenciable de Miami, overlay editorial y mejor legibilidad.
- Se reforzó el contraste del hero de `Guías` con overlays más oscuros y tipografía blanca para asegurar legibilidad sobre la imagen.
- Se dejó el subtítulo principal del hero de `Guías` explícitamente en blanco para mejorar la lectura sobre la imagen.
- Se mejoró la calidad visual del hero de `Guías` aumentando la calidad del asset y reduciendo la opacidad del overlay para recuperar detalle.
- Se corrigió el encoding de textos en español en traducciones de Invertir, Financiamiento, Testimonios y Contacto.

## Próximo criterio de actualización

Cada vez que se implemente algo nuevo, agregar al menos:

1. **Qué se cambió**
2. **Qué archivos se tocaron**
3. **Si hubo migraciones o variables nuevas**
4. **Una línea en la Bitácora de cambios**

## Nota sobre encoding

Este archivo fue regrabado intencionalmente en **UTF-8** para evitar caracteres corruptos en español e inglés.







