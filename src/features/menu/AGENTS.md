# Menu - Feature Guide

Module for displaying available pizzas in React Pizza.

## 📁 Structure

```
menu/
├── Menu.tsx         # Main container
├── MenuItem.tsx     # Individual pizza component
└── menuLoader.ts    # React Router loader
```

## 🛣️ Routes

- **Route**: `/menu`
- **Component**: [Menu.tsx](Menu.tsx)
- **Loader**: [menuLoader.ts](menuLoader.ts)
- **Purpose**: Display all available pizzas

## 📋 Data Loader

**File**: [menuLoader.ts](menuLoader.ts)

The loader executes BEFORE rendering `/menu`:

- Calls `getMenu()` from API service
- Gets pizza list from restaurant API
- Passes data through React Router

```typescript
// Loaded data
MenuType[]
```

## 🧩 Components

### [Menu.tsx](Menu.tsx)

Main container:

- Receives data from loader via `useLoaderData()`
- Renders list of pizzas
- Handles errors if loading fails

### [MenuItem.tsx](MenuItem.tsx)

Component for each individual pizza:

- Shows image, name, price, ingredients
- "Add to Cart" button
- "Sold Out" state if no stock
- Dispatches Redux actions to add to cart

**Props**:

```typescript
{
  pizza: MenuType;
}
```

## 📊 Data Structure

**Type: MenuType**

```typescript
{
  id: number;
  name: string;
  unitPrice: number;
  ingredients: string[];
  soldOut: boolean;
  imageUrl: string;
}
```

## 🔄 Data Flow

```
User navigates to /menu
    ↓
menuLoader() executes
    ↓
getMenu() API call
    ↓
MenuType[] returned
    ↓
Menu.tsx renders
    ↓
Renders MenuItem for each pizza
    ↓
User clicks "Add to Cart"
    ↓
MenuItem dispatches addItem() to Redux
```

## 🔗 Integration

- **React Router**: Uses loader for data fetching
- **Redux**: Dispatches cart actions
- **API**: Calls `apiRestaurant.getMenu()`
- **Cart**: Integration with Redux cartSlice
