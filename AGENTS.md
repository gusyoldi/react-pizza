# React Pizza - Guide for AI Agents

This is a navigation guide for language models that need to understand the structure, architecture, and components of the React Pizza project.

## 📋 Overview

**React Pizza** is a pizza ordering web application built with:

- **Frontend Framework**: React 18 + TypeScript
- **Routing**: React Router v6 (Data Mode)
- **Estado Global**: Redux Toolkit
- **Build Tool**: Vite
- **Estilos**: Tailwind CSS + PostCSS
- **Validación de Commits**: Husky + Commitlint

The application allows users to browse a pizza menu, add items to cart, create orders, and track their status.

## 📁 Directory Structure

```
src/
├── features/          # Módulos de características (slice-based)
│   ├── cart/         # Gestión del carrito de compras
│   ├── menu/         # Visualización del menú de pizzas
│   ├── order/        # Creación y seguimiento de pedidos
│   └── user/         # Información del usuario
├── ui/               # Componentes de UI reutilizables
├── services/         # Llamadas a APIs externas
├── store/            # Configuración de Redux
├── types/            # Definiciones de tipos TypeScript
├── utils/            # Funciones utilidades
├── assets/           # Recursos estáticos
├── App.tsx           # Configuración del router principal
├── main.tsx          # Entry point
├── index.css         # Estilos globales
└── vite-env.d.ts     # Tipos de Vite
```

## 🛣️ Application Routes

Routes are configured in [src/App.tsx](src/App.tsx) using `createBrowserRouter`:

| Route             | Component     | Purpose                  | Loader        | Action              |
| ----------------- | ------------- | ------------------------ | ------------- | ------------------- |
| `/`               | `Home`        | Home page                | -             | -                   |
| `/menu`           | `Menu`        | List of available pizzas | `menuLoader`  | -                   |
| `/cart`           | `Cart`        | Shopping cart            | -             | -                   |
| `/order/new`      | `CreateOrder` | Create new order         | -             | `createOrderAction` |
| `/order/:orderId` | `Order`       | Order details and update | `orderLoader` | `updateOrderAction` |

## 🏗️ Main Features

The project is organized into independent modules. Each feature has its own `AGENTS.md`:

| Feature   | Location              | Purpose                     | Documentation                             |
| --------- | --------------------- | --------------------------- | ----------------------------------------- |
| **Cart**  | `src/features/cart/`  | Shopping cart management    | [AGENTS.md](src/features/cart/AGENTS.md)  |
| **Menu**  | `src/features/menu/`  | Display available pizzas    | [AGENTS.md](src/features/menu/AGENTS.md)  |
| **Order** | `src/features/order/` | Order creation and tracking | [AGENTS.md](src/features/order/AGENTS.md) |
| **User**  | `src/features/user/`  | User information            | [AGENTS.md](src/features/user/AGENTS.md)  |

**Each feature includes its own detailed guide** with structure, components, data, and specific flows.

---

## 🎨 UI Components

**Location**: `src/ui/`

Reusable UI components like AppLayout, Header, Button, Loader, and special pages (Home, NotFound).

## 📡 API Services

**Location**: `src/services/`

- `apiRestaurant.js` - Restaurant API calls (menu, orders)
- `apiGeocoding.js` - Address validation and geocoding

---

## 🏪 Redux Store

**Configuration**: [src/store/store.ts](src/store/store.ts)

```typescript
Store Root State:
{
  userStore: UserState,      // Current user information
  cartStore: CartState       // Shopping cart
}
```

**Custom Hooks**: [src/store/hooks.ts](src/store/hooks.ts)

- `useAppDispatch()` - Typed dispatch
- `useAppSelector()` - Typed selector with RootState

---

## 🔧 TypeScript Types

**Location**: `src/types/`

Defines types for menu, cart, and order. Check each feature for specific details.

---

## 📝 Purchase Flow

```
Home → Menu (menuLoader) → Cart → CreateOrder (createOrderAction)
→ Order (orderLoader) → SearchOrder → Order (updateOrderAction)
```

---

## 🔍 Getting Started

1. Read the project's README.md
2. Review [src/App.tsx](src/App.tsx) to understand the routes
3. Go to the folder of the feature you need to work on
4. Read the corresponding AGENTS.md in that folder

---

---

## 🎯 Project Conventions

- **Components**: PascalCase, .tsx files
- **Types**: "Type" suffix, defined in `src/types/`
- **Redux Slices**: In corresponding feature folder
- **APIs**: Centralized in `src/services/`
- **Utilities**: In `src/utils/`
- **UI Components**: In `src/ui/` (reusable across features)
- **Feature Structure**: Each feature is independent and self-contained

---

## 🚀 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Lint TypeScript and code
npm run preview      # Preview the build
npm run ts-check     # Check types without emitting
npm run prepare      # Setup Husky
```

---

**Last updated**: 2026-01-22
**Project Version**: 0.0.0
