# React Pizza 🍕

Una aplicación web moderna para pedir pizzas, construida con React y TypeScript. Permite a los usuarios navegar por un menú, añadir items al carrito, crear pedidos y realizar un seguimiento de su estado.

## 🚀 Tecnologías

Este proyecto utiliza un stack moderno y robusto:

-   **Frontend**: React 18 + TypeScript
-   **Enrutamiento**: React Router v6 (Data Mode)
-   **Estado Global**: Redux Toolkit
-   **Estilos**: Tailwind CSS + PostCSS
-   **Build Tool**: Vite
-   **Validación**: Husky + Commitlint

## ✨ Características Principales

-   **Menú**: Visualización de pizzas disponibles traídas desde una API.
-   **Carrito**: Gestión de compras (añadir, eliminar, modificar cantidades).
-   **Pedidos**: Creación de nuevos pedidos y seguimiento por ID.
-   **Usuarios**: Gestión de información de usuario y geolocalización.

## 🛠️ Instalación y Uso

1.  **Instalar dependencias**

    ```bash
    pnpm install
    ```

2.  **Iniciar servidor de desarrollo**

    ```bash
    pnpm dev
    ```

3.  **Construir para producción**

    ```bash
    pnpm build
    ```

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura basada en **features**:

-   `src/features/`: Módulos independientes (cart, menu, order, user).
-   `src/ui/`: Componentes reutilizables.
-   `src/services/`: Comunicación con APIs externas.
-   `src/store/`: Configuración de Redux.

## 📝 Scripts Disponibles

-   `pnpm dev`: Inicia el servidor de desarrollo.
-   `pnpm build`: Construye la aplicación para producción.
-   `pnpm lint`: Ejecuta el linter.
-   `pnpm preview`: Previsualiza la build de producción.
