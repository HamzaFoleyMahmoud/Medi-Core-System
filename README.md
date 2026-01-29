# MediCore Hospital Management System

A production-ready React + TypeScript hospital management system built with clean architecture principles.

## 🏗️ Architecture

This project follows a **feature-based folder structure** with strict separation of concerns:

```
src/
├── components/          # Shared UI components
│   ├── ui/             # Reusable UI elements (Button, Input, Modal, etc.)
│   ├── auth/           # Authentication components (ProtectedRoute)
│   └── layout/         # Layout components (MainLayout, Sidebar)
├── features/           # Feature modules
│   ├── patients/       # Patient management
│   │   ├── components/ # Feature-specific components
│   │   ├── hooks/      # React Query hooks
│   │   ├── pages/      # Page components
│   │   └── validation/ # Zod schemas
│   └── appointments/   # Appointment scheduling
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       └── validation/
├── services/           # API layer
│   └── api/           # API services and client
├── store/             # Global state (Zustand)
├── hooks/             # Shared hooks
├── types/             # TypeScript types
├── routes/            # Routing configuration
└── pages/             # Standalone pages
```

## 🚀 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety (strict mode)
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **date-fns** - Date utilities

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔐 Authentication

The system supports role-based access control with 4 roles:

- **Admin** - Full system access
- **Doctor** - Patient records, appointments, medical records
- **Nurse** - Patient care, appointments
- **Receptionist** - Patient registration, appointments, billing

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medicore.com | password123 |
| Doctor | doctor@medicore.com | password123 |
| Nurse | nurse@medicore.com | password123 |
| Receptionist | receptionist@medicore.com | password123 |

## 🎯 Features

### ✅ Implemented

- **Authentication & Authorization**
  - Login/logout
  - Role-based access control
  - Protected routes
  - Token management

- **Patient Management**
  - List patients with search and pagination
  - Add/edit patient records
  - View patient details
  - Delete patients
  - Comprehensive patient information (demographics, emergency contact, medical history)

- **Appointment Scheduling**
  - List appointments with status filtering
  - Book new appointments
  - Edit/cancel appointments
  - Patient and doctor selection
  - Date/time scheduling
  - Duration management

- **UI Components**
  - Reusable components (Button, Input, Select, Modal, etc.)
  - Loading states
  - Error handling
  - Empty states
  - Responsive design
  - Accessibility features

### 🚧 Coming Soon

- Medical Records
- Prescriptions
- Billing & Payments
- Doctor Management
- Department Management
- Reports & Analytics

## 🏛️ Architecture Principles

### Clean Architecture

1. **Separation of Concerns**
   - UI components are dumb (presentation only)
   - Business logic lives in hooks
   - API calls are centralized in services

2. **Feature-Based Organization**
   - Each feature is self-contained
   - Easy to locate and modify code
   - Scalable structure

3. **Type Safety**
   - Strict TypeScript mode
   - Comprehensive type definitions
   - Runtime validation with Zod

4. **State Management**
   - Server state: React Query (caching, invalidation)
   - Client state: Zustand (auth, UI state)
   - No prop drilling

### Best Practices

- ✅ Functional components only
- ✅ Custom hooks for reusable logic
- ✅ React Query for server state
- ✅ Proper error boundaries
- ✅ Loading and empty states
- ✅ Accessibility (ARIA labels, semantic HTML)
- ✅ Responsive design
- ✅ Form validation
- ✅ Code splitting (lazy loading ready)

## 📁 Project Structure Details

### `/components/ui`
Reusable UI components used across the application:
- `Button` - Multiple variants and sizes
- `Input` - Form input with validation
- `Select` - Dropdown with error states
- `Modal` - Accessible dialog
- `LoadingSpinner` - Loading indicator
- `ErrorMessage` - Error display
- `EmptyState` - Empty data placeholder

### `/features`
Feature modules following the same structure:
- `components/` - Feature-specific UI components
- `hooks/` - React Query hooks for data fetching
- `pages/` - Page-level components
- `validation/` - Zod schemas for forms

### `/services/api`
Centralized API layer:
- `client.ts` - Axios instance with interceptors
- `*.service.ts` - Service files for each entity

### `/store`
Global state management:
- `auth.store.ts` - Authentication state (Zustand)

## 🔄 Data Flow

1. **User Action** → Component
2. **Component** → Custom Hook (React Query)
3. **Hook** → API Service
4. **Service** → Backend API
5. **Response** → Hook (cache update)
6. **Hook** → Component (re-render)

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- Custom color palette for medical theme
- Responsive breakpoints (sm, md, lg)
- Custom scrollbar styles
- Consistent spacing and typography

## 🔒 Security

- Token-based authentication
- Automatic token injection
- Token refresh handling
- Role-based route protection
- XSS protection (React default)
- CSRF protection (to be implemented)

## 📈 Scalability

### Current Scalability Features

- Feature-based architecture
- Code splitting ready
- Lazy loading ready
- Optimistic updates
- Query caching
- Pagination support

### Future Enhancements

- Virtual scrolling for large lists
- Infinite scroll
- Service workers for offline support
- Real-time updates (WebSockets)
- Advanced caching strategies
- Performance monitoring

## 🧪 Testing (To Be Added)

```bash
npm run test        # Run unit tests
npm run test:e2e    # Run E2E tests
npm run test:coverage # Coverage report
```

## 📝 Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 🤝 Contributing

1. Follow the existing folder structure
2. Use TypeScript strict mode
3. Add proper types for all data
4. Include loading/error states
5. Write accessible components
6. Follow naming conventions

## 📄 License

MIT License - feel free to use this project for learning or production.

---

Built with ❤️ using React + TypeScript
