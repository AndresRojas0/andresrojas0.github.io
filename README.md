# Blog Minimalista | Tecnologías: Eleventy 3 + Github Pages

> ⚠⚠⚠
> En construcción

## Instrucciones

1. Clona este repositorio.
   ```bash
   git clone https://github.com/AndresRojas0/andresrojas0.github.io.git
   ```
2. Instala las dependencias.
   ```bash
   npm install
   ```
3. Iniciar el ambiente de desarrollo.
   ```bash
   npm start
   ```
4. Edita **`_data/metadata.js`** con la información de tu proyecto.
   ```js
   export default {
     siteUrl: "https://example.com",
     pathPrefix: "/nombre-repositorio/",
     language: "es",
     title: "Eleventy 3 & Github Pages Starter Project",
     description:
       "Este es un starter project para gestionar y desplegar proyectos web minimalistas con Eleventy 3 y Github Pages.",
   };
   ```
5. Comienza a crear el contenido de tu proyecto web.
6. Cuando termines de desarrollar tu proyecto, limpia la carpeta docs y ejecuta el despliegue:
   ```bash
   npm run clean
   npm run build
   ```
7. Crea un repositorio en tu cuenta de _GitHub_.
8. Vincula la carpeta local con el repositorio remoto.
9. Modifica la propiedad **`pathPrefix`** con el nombre del repositorio de _GitHub_ en el archivo **`_data/metadata.js`**.
10. Sube el contenido a _GitHub_.
11. Asegura que el repositorio tenga activado _**GitHub Pages**_ en la rama _**main**_, para desplegar la carpeta _**docs**_.
12. ¡Listo! Lo haz logrado. Felíz despliegue 🥳 🦡🎈.

[Aquí](https://andresrojas0.github.io/) puedes ver la demo de este _starter project_.

Para más información revisa la sección [Acerca](https://andresrojas0.github.io/acerca) de la demo.
