# User - Feature Guide

Module for managing the current user in React Pizza.

## 📁 Structure

```
user/
├── userSlice.ts      # Redux state for user
├── CreateUser.tsx    # Form to create user
└── Username.tsx      # Show user name
```

## 🏪 Redux State

**File**: [userSlice.ts](userSlice.ts)

The slice contains:

- Current user name
- Actions to set the name

**Main Reducers**:

- `setUsername()` - Saves the user name

**State**:

```typescript
{
  username: string;
}
```

## 🧩 Components

### [CreateUser.tsx](CreateUser.tsx)

Form to create/edit user profile:

- Input field for name
- Submit button
- Dispatches `setUsername()` to Redux
- Saves name locally in global state

**Use cases**:

- New user needs to create profile
- Change username anytime

### [Username.tsx](Username.tsx)

Component to display current name:

- Gets name from Redux (selectUsername)
- Renders name in header or forms
- Pre-fills name in forms (CreateOrder)

## 🔄 Integration

### With CreateOrder

- Username is obtained from Redux `userStore`
- Pre-fills "customer" field in order form
- User can change name if wanted

### In Header

- Shows current user name
- Access to edit profile

## 📊 Data Structure

**Redux State: userStore**

```typescript
{
  username: string;
}
```

## 🔗 Usage in Other Modules

- **Order**: CreateOrder gets `username` to pre-fill
- **UI**: Header/AppLayout can show current user
- **Persistence**: Consider localStorage to save name

## 💡 Notes

- User is local/temporary (not persisted to DB)
- Used mainly to pre-fill forms
- Ideal for future features like order history or preferences
