# Simplified Authentication System

## Overview

This is a clean, simple authentication system that replaces the complex previous structure. It's designed to be:

- **Easy to debug** - Clear error flow, no complex abstractions
- **Maintainable** - Simple functions, no unnecessary generics
- **Organized** - Clear file structure and responsibilities

## File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Main auth context with all auth logic
├── lib/
│   └── api.ts                   # Simple API utility functions
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx   # Route protection component
└── app/
    ├── login/page.tsx           # Login page
    ├── register/page.tsx        # Register page
    ├── profile/page.tsx         # Protected profile page
    └── admin/page.tsx           # Admin-only page
```

## How It Works

### 1. AuthContext (`src/contexts/AuthContext.tsx`)

- **Purpose**: Central auth state management
- **What it does**:
  - Manages user state (logged in/out, user data)
  - Provides simple auth functions (login, register, logout)
  - Handles token storage and API calls
- **Usage**: Wrap your app with `<AuthProvider>` and use `useAuth()` hook

### 2. API Utility (`src/lib/api.ts`)

- **Purpose**: Simple HTTP requests
- **What it does**:
  - Makes API calls with automatic token attachment
  - Simple error handling (just throws errors)
  - No complex generics or abstractions

### 3. Protected Routes (`src/components/auth/ProtectedRoute.tsx`)

- **Purpose**: Protect pages that require authentication
- **What it does**:
  - Checks if user is logged in
  - Optionally checks user role
  - Redirects to login if not authenticated

## Usage Examples

### Basic Auth Usage

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, login, logout, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login("user@example.com", "password");
      console.log("Logged in successfully!");
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  };

  if (isAuthenticated) {
    return <div>Welcome, {user?.username}!</div>;
  }

  return <button onClick={handleLogin}>Login</button>;
}
```

### Protected Routes

```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function ProfilePage() {
  return (
    <ProtectedRoute>
      <div>This page requires login</div>
    </ProtectedRoute>
  );
}

function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div>This page requires admin role</div>
    </ProtectedRoute>
  );
}
```

### Simple API Calls

```tsx
import { api } from "@/lib/api";

// GET request
const data = await api.get("/users");

// POST request
const result = await api.post("/users", { name: "John" });
```

## Key Simplifications

### Before (Complex)

- Multiple files with complex generics
- Error handling passed through multiple layers
- Complex type definitions
- Hard to debug error flow
- Over-engineered abstractions

### After (Simple)

- Single context file for auth logic
- Direct error handling
- Simple types
- Clear error flow
- Straightforward functions

## Error Handling

Errors are handled simply:

1. API functions throw errors directly
2. Context catches errors and sets error state
3. Components show errors from context state
4. No complex error propagation

## Authentication Flow

1. **App starts** → AuthContext checks for existing token
2. **Register** → User creates account → Email verification required
3. **Email Verification** → User clicks link → Verification page → API call → Success/Error
4. **Login** → User enters credentials → API call → Store tokens → Update state
5. **Protected route** → Check auth state → Redirect if needed
6. **API calls** → Automatically attach token from localStorage
7. **Logout** → Clear tokens → Clear state

## Email Verification Flow

1. **User registers** → Gets verification email
2. **User clicks link** → Goes to `/verify-email/[token]` page
3. **Page loads** → Automatically calls verification API
4. **Success** → Shows success message → Redirect to login
5. **Error** → Shows error message → Options to resend or register again

## Benefits

✅ **Easy to debug** - Error happens in one place, easy to trace
✅ **Simple to understand** - No complex abstractions
✅ **Easy to modify** - Change auth logic in one file
✅ **Clear responsibilities** - Each file has one job
✅ **No over-engineering** - Simple solutions for simple problems

## Limitations

- **File scope**: All auth logic is in `AuthContext.tsx`
- **Component scope**: Used only in React components
- **API scope**: Works with any REST API that returns JSON
- **Browser scope**: Uses localStorage for token storage
