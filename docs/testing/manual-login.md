# Prueba manual — Login con parámetros separados

- **Fecha**: 2024-11-24
- **Entorno**: Frontend `npm run dev` + backend local (`docker-compose up`)
- **Cuenta utilizada**: `qa.user@example.com` / `QaUser123*`

## Pasos
1. Iniciar `docker-compose up` y `npm run dev`.
2. Abrir `http://localhost:5173/login`.
3. Abrir la consola del navegador y ejecutar:
   ```js
   const originalLogin = window.fetch;
   window.__lastLoginPayload = null;
   window.fetch = async (input, init) => {
     if (typeof input === 'string' && input.endsWith('/auth/login')) {
       window.__lastLoginPayload = JSON.parse(init.body);
     }
     return originalLogin(input, init);
   };
   ```
4. Completar el formulario con `" qa.user@example.com "` (con espacios) y la contraseña válida.
5. Enviar el formulario.
6. Verificar que la app redirige al Home mostrando el menú de usuario (sesión activa) y que `localStorage.getItem('token')` contiene un JWT.
7. Revisar la consola y ejecutar `window.__lastLoginPayload`.
8. Restaurar `window.fetch = originalLogin;`.

## Resultados
- `window.__lastLoginPayload` devuelve `{ email: 'qa.user@example.com', password: 'QaUser123*' }`, confirmando que `AuthContext.login` recibió ambos parámetros y el email se trimmeó antes de llamar a la API.
- El token queda guardado y las rutas protegidas son accesibles → **PASS**.
