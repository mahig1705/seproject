# Habitat Society Management Frontend

A modern, responsive frontend for the Habitat Society Management system built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Role-based Access Control**: Different interfaces for Admin, Committee, Members, Tenants, Security, and Technicians
- **Complete CRUD Operations**: Manage users, issues, tickets, visitors, bills, payments, notices, amenities, bookings, and technicians
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Authentication**: Secure login/logout with token management
- **Real-time Updates**: Dynamic data fetching and updates

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on port 3001

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd habitat-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update environment variables in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_NAME=Habitat Society Management
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── users/            # User management
│   ├── issues/           # Issue management
│   ├── tickets/          # Ticket management
│   ├── visitors/         # Visitor management
│   ├── bills/            # Bill management
│   ├── payments/         # Payment management
│   ├── notices/          # Notice management
│   ├── amenities/        # Amenity management
│   ├── bookings/         # Booking management
│   ├── technicians/      # Technician management
│   ├── profile/          # User profile
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components (Button, Input, etc.)
│   └── layout/           # Layout components (Sidebar, Header)
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── services/             # API services
│   └── api.ts            # API client
├── types/                # TypeScript type definitions
│   └── index.ts          # All types and interfaces
├── lib/                  # Utility functions
│   └── utils.ts          # Helper functions
└── middleware.ts         # Route protection middleware
```

## Features by Role

### Admin
- Full system access
- User management (create, update, delete users)
- Bill generation and management
- All reports and analytics

### Committee
- User management (limited)
- Issue and ticket management
- Notice creation and management
- Amenity and booking management
- Technician management

### Member/Tenant
- View and pay bills
- Report issues
- Book amenities
- Log visitors
- View notices

### Security
- Log visitor entries and exits
- View visitor history
- View notices

### Technician
- View assigned tickets
- Update ticket status
- Add resolution notes

## API Integration

The frontend integrates with the backend API through the `apiService` class in `src/services/api.ts`. All API calls are handled with:

- Automatic token management
- Request/response interceptors
- Error handling
- Type safety

## Authentication

Authentication is handled through:

1. **Login**: Email/password authentication
2. **Token Management**: Automatic token refresh
3. **Route Protection**: Middleware-based route protection
4. **Role-based Access**: Component-level permission checks

## Styling

The project uses Tailwind CSS with:

- Custom color palette
- Responsive design utilities
- Component-based styling
- Dark/light mode support (ready for implementation)

## State Management

- **Authentication**: React Context for user state
- **API State**: Component-level state with React hooks
- **Form State**: React Hook Form for form management

## Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Environment Variables for Production

Make sure to set the following environment variables:

```
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
NEXT_PUBLIC_APP_NAME=Habitat Society Management
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.
