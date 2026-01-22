# Cart - Feature Guide

Shopping cart management module for React Pizza.

## 📁 Structure

```
cart/
├── cartSlice.ts           # Redux state
├── Cart.tsx               # Main view
├── CartItem.tsx           # Individual item
├── CartOverview.tsx       # Summary in header
├── UpdateItemQuantity.tsx # Quantity controls
├── DeleteItem.tsx         # Remove item
└── EmptyCart.tsx          # Empty state
```

## 🏪 Redux State

**File**: [cartSlice.ts](cartSlice.ts)

The slice contains:

- Cart state (items, quantities, totals)
- Actions to add, update, and delete items
- Price calculations

**Main Reducers**:

- `addItem()` - Add pizza to cart
- `deleteItem()` - Remove item from cart
- `updateItemQuantity()` - Change item quantity
- `clearCart()` - Empty cart (used after creating order)

## 📊 Data Structure

**Type: CartType**

```typescript
{
  pizzaId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
```

## 🧩 Components

### [Cart.tsx](Cart.tsx)

Main cart view. Renders:

- List of items (`CartItem`)
- Price summary (`CartOverview`)
- Action buttons (checkout, clear)
- Empty message if needed (`EmptyCart`)

### [CartItem.tsx](CartItem.tsx)

Component for each pizza in cart:

- Name, price, quantity
- Quantity update controls (`UpdateItemQuantity`)
- Remove button (`DeleteItem`)

### [CartOverview.tsx](CartOverview.tsx)

Cart summary in header:

- Total items
- Total price
- Link to cart page

### [UpdateItemQuantity.tsx](UpdateItemQuantity.tsx)

+/- buttons to change quantity:

- Dispatches `updateItemQuantity` action to Redux
- Validates min/max quantity

### [DeleteItem.tsx](DeleteItem.tsx)

Button to remove item:

- Dispatches `deleteItem` action to Redux

### [EmptyCart.tsx](EmptyCart.tsx)

Message when no items in cart:

- Link back to menu

## 🔄 Data Flow

```
MenuItem (in Menu)
    ↓
Dispatches addItem() → Redux cartSlice
    ↓
CartOverview (in header) updates
    ↓
User navigates to /cart
    ↓
Cart.tsx renders CartItems
    ↓
UpdateItemQuantity/DeleteItem buttons → Redux
```

## 🔗 Integration

- **Redux Store**: Accesses `cartStore` state
- **Other features**: MenuItem (menu feature) dispatches cart actions
- **Actions**: CreateOrder clears cart after order creation
