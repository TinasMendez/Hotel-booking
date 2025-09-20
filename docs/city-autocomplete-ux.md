# City autocomplete UX

El componente `CityAutocomplete` ofrece sugerencias a medida que la persona usuaria escribe. A continuación se resume el comportamiento previsto para ratón y teclado y cómo se gestiona el foco para mantener la accesibilidad.

## Interacciones con teclado

- **Escritura**: al teclear se filtran las ciudades retornadas por `/api/cities`. El menú de sugerencias se abre automáticamente y la primera opción queda resaltada.
- **Flecha abajo / arriba**: desplazan el resaltado dentro de la lista. Al llegar al final/inicio vuelve a la primera/última opción.
- **Enter**: selecciona la opción resaltada, cierra la lista y devuelve el `id` de la ciudad al formulario de búsqueda.
- **Escape**: cierra el menú sin modificar la selección actual.
- **Tab**: mueve el foco fuera del campo. El menú se cierra automáticamente para evitar que las sugerencias interfieran con el flujo.
- **Esc / botón “×”**: permiten limpiar la selección y devolver el campo a su estado inicial.

## Interacciones con ratón

- **Clic en el campo**: abre la lista de sugerencias. Mientras el campo esté enfocado se seguirán mostrando sugerencias actualizadas.
- **Clic (o pulsación) en una opción**: selecciona la ciudad correspondiente incluso si el input pierde el foco, gracias a la prevención del blur en `onMouseDown`.
- **Clic fuera del componente**: cierra el menú de sugerencias.

## Accesibilidad

- El `input` se expone como `role="combobox"` con `aria-autocomplete="list"`, `aria-expanded`, `aria-controls` y `aria-activedescendant`, siguiendo el patrón de [combobox con lista desplegable](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).
- La lista usa `role="listbox"` y cada opción `role="option"` + `aria-selected` para comunicar el resaltado a los lectores de pantalla.
- El botón de limpiar cuenta con `aria-label` y es alcanzable por teclado.
- Cuando hay errores de carga se anuncia mediante un elemento asociado vía `aria-describedby`.
- El foco se mantiene en el campo de texto; las opciones no roban el foco y se puede navegar únicamente con flechas.
- El componente cierra el menú al detectar clics fuera o al pulsar Escape para evitar estados bloqueados.

Este comportamiento garantiza que la integración en `SearchBar.jsx` ofrezca una experiencia consistente y accesible para todos los usuarios.
