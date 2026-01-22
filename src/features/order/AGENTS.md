# Order - Feature Guide

Module for order creation and tracking in React Pizza.

## 📁 Structure

```
order/
├── CreateOrder.tsx              # Form to create order
├── Order.tsx                    # Order details and status
├── OrderItem.tsx                # Item within order
├── SearchOrder.tsx              # Search existing orders
├── UpdateOrder.tsx              # Form to update order
├── orderLoader.ts               # React Router loader
└── actions/
    ├── createOrderAction.ts     # Server action for creation
    └── updateOrderAction.ts     # Server action for update
```

## 🛣️ Routes

| Route             | Component     | Loader        | Action              | Purpose           |
| ----------------- | ------------- | ------------- | ------------------- | ----------------- |
| `/order/new`      | `CreateOrder` | -             | `createOrderAction` | Create new order  |
| `/order/:orderId` | `Order`       | `orderLoader` | `updateOrderAction` | View/update order |

## 📝 Form Actions

### [createOrderAction.ts](actions/createOrderAction.ts)

Executes when user submits form on `/order/new`:

```typescript
// Receives FormData:
{
  customer: string;
  phone: string;
  address: string;
  cart: string;        // JSON stringified
  priority?: string;
}
```

**Logic**:

1. Validates form data
2. Calls `createOrder()` API
3. Clears cart in Redux (clearCart)
4. Redirects to `/order/:orderId`

### [updateOrderAction.ts](actions/updateOrderAction.ts)

Executes when user updates an existing order:

**Allowed changes**:

- Priority (priority)
- Status (status)

## 🛣️ Data Loader

### [orderLoader.ts](orderLoader.ts)

Executes BEFORE rendering `/order/:orderId`:

- Gets `orderId` from route parameters
- Calls `getOrder(orderId)` API
- Passes data through React Router
- Shows 404 page if fails

## 🧩 Components

### [CreateOrder.tsx](CreateOrder.tsx)

Form to create new order:

- Pre-fills user name (from Redux userStore)
- Fields: customer, phone, address
- Checkbox for priority
- Cart summary
- Submit button (dispatches createOrderAction)

**Validations**:

- Name not empty
- Valid phone
- Address not empty
- Cart not empty

### [Order.tsx](Order.tsx)

Order details page:

- Receives order via `useLoaderData()`
- Shows order status (preparing, on the way, delivered)
- List of ordered items (`OrderItem`)
- Estimated delivery information
- Update button if possible
- Search for another order (`SearchOrder`)

### [OrderItem.tsx](OrderItem.tsx)

Component for each pizza in order:

- Name, quantity, price
- Ingredients information

### [SearchOrder.tsx](SearchOrder.tsx)

Search existing orders:

- Field to enter Order ID
- Navigates to `/order/:orderId` if exists

### [UpdateOrder.tsx](UpdateOrder.tsx)

Form to update order:

- Checkbox to change priority
- Submit button (dispatches updateOrderAction)
- Only available for certain statuses

## 📊 Data Structure

**Type: OrderType**

```typescript
{
  id: string;
  customer: string;
  phone: string;
  address: string;
  priority: boolean;
  status: 'preparing' | 'on the way' | 'delivered';
  estimatedDelivery: string;
  cart: CartType[];
  position: string;
  orderPrice: number;
  priorityPrice: number;
}
```

**Type: OrderFormDataType**

```typescript
{
  customer: string;
  phone: string;
  address: string;
  cart: string;
  priority?: string;
}
```

## 🔄 Complete Flow

```
User in Cart
    ↓
Clicks "Order" → navigates to /order/new
    ↓
CreateOrder.tsx loads
    ↓
User completes form
    ↓
Submit dispatches createOrderAction
    ↓
API creates order, Redux clears cart
    ↓
Redirects to /order/:orderId
    ↓
orderLoader() fetches order data
    ↓
Order.tsx renders details
    ↓
User can search another order or update
```

## 🔗 Integration

- **React Router**: Data Mode (loaders and actions)
- **Redux**: Reads cartStore in CreateOrder, clears in createOrderAction
- **API**: `createOrder()`, `getOrder()`, `updateOrder()`
- **Geocoding**: Uses apiGeocoding in CreateOrder to validate address
