# Autosuggest de búsquedas

Este documento resume el comportamiento del nuevo componente `CityAutocomplete` y las mejoras de sugerencias en la barra de búsqueda.

## Resumen funcional

- El campo de ciudad ofrece autocompletado que consulta `/api/cities` conforme el usuario escribe y permite seleccionar opciones tanto con el teclado como con el mouse/touch.
- El campo de texto principal de la búsqueda muestra sugerencias rápidas de categorías y productos gracias a un `<datalist>` generado dinámicamente.

## Gestión del foco

- El input de ciudad abre la lista en cuanto recibe foco y se cierra cuando el foco abandona el contenedor completo.
- Al seleccionar una ciudad con el mouse/touch o con Enter, el foco vuelve inmediatamente al input para favorecer la interacción continua.
- Existe un botón de limpieza accesible que devuelve el foco al input después de borrar la selección.

## Interacción por teclado

- `ArrowDown`/`ArrowUp` rotan la opción resaltada dentro del listado (se ignora la pulsación si no hay resultados).
- `Enter` selecciona la opción resaltada y completa el campo.
- `Escape` cierra el listado sin modificar el valor actual.
- El componente soporta navegación lineal y permite reiniciar la selección escribiendo un nuevo término.

## Accesibilidad (ARIA)

- El input se declara como `role="combobox"` con `aria-autocomplete="list"`, `aria-expanded` y `aria-controls` apuntando al listado activo.
- Cada opción se marca con `role="option"` y `aria-selected` en la fila resaltada, mientras que `aria-activedescendant` mantiene sincronizado el estado de foco virtual.
- El estado de carga se anuncia mediante un elemento con `role="status"` y los errores con `role="alert"`.
- El botón de limpieza expone una etiqueta accesible (`aria-label`) para lectores de pantalla.

## Sugerencias de categorías/productos

- Se obtienen hasta 15 sugerencias combinadas (sin duplicados) usando los endpoints de categorías y productos aleatorios.
- Las sugerencias se ofrecen mediante un `<datalist>` enlazado al campo de texto principal, de forma que navegadores móviles y de escritorio muestran menús contextuales nativos.

## Pruebas manuales

| Plataforma | Resultado | Observaciones |
|------------|-----------|---------------|
| Chrome 128 (Windows, desktop) | ✅ | Navegación con teclado, selección con mouse y limpieza funcionan según lo esperado. |
| Chrome 128 (modo responsive Pixel 7) | ✅ | Interacción táctil comprobada: la lista permanece legible y el foco vuelve al input tras seleccionar. |

Además, se ejecutó `npm run build` para asegurar que la nueva lógica compila correctamente.
