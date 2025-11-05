# Resort Management System - MERN Stack

A comprehensive Resort Management System built with MongoDB, Express.js, React, and Node.js. This system manages guests, rooms, bookings, amenities, services, staff, and provides detailed analytics reports.

## Features

### Core Modules
- **Guest Management**: Add, edit, filter, and manage guest information
- **Room Management**: Manage room inventory with types, facilities, pricing, and status
- **Booking System**: Schedule bookings with clash detection and date range management
- **Amenities**: Manage resort amenities with pricing and availability schedules
- **Services**: Track guest service requests and amenity bookings
- **Staff Management**: Manage staff members, roles, and assignments
- **Reports Dashboard**: Comprehensive analytics and reporting

### Key Features
- ✅ Full CRUD operations for all entities
- ✅ Compound indexes following ESR (Equality, Sort, Range) rule
- ✅ MongoDB aggregation pipelines for analytics
- ✅ Booking clash detection
- ✅ Bulk operations (bulk booking entry, bulk status updates)
- ✅ Advanced filtering and search
- ✅ Responsive React UI
- ✅ RESTful API architecture
- ✅ Sample data seeder

## Database Schema

### Collections

**Guests**
```javascript
{
  guestId: String (unique),
  name: String,
  email: String,
  phone: String,
  address: String,
  checkinDate: Date,
  checkoutDate: Date,
  roomType: String,
  status: String ['Active', 'Checked-out', 'Cancelled', 'Pending']
}
```

**Rooms**
```javascript
{
  roomId: String (unique),
  roomNumber: String (unique),
  type: String ['Single', 'Double', 'Suite', 'Deluxe', 'Presidential'],
  capacity: Number,
  facilities: [String],
  price: Number,
  status: String ['Available', 'Occupied', 'Maintenance', 'Reserved']
}
```

**Bookings**
```javascript
{
  bookingId: String (unique),
  guestId: String (ref: Guest),
  roomId: String (ref: Room),
  checkinDate: Date,
  checkoutDate: Date,
  status: String ['Confirmed', 'Checked-in', 'Checked-out', 'Cancelled', 'Pending'],
  paidAmount: Number
}
```

**Amenities**
```javascript
{
  amenityId: String (unique),
  name: String,
  description: String,
  price: Number,
  availableDays: [String]
}
```

**Services**
```javascript
{
  serviceId: String (unique),
  guestId: String (ref: Guest),
  amenityId: String (ref: Amenity),
  bookingDate: Date,
  status: String ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
  notes: String
}
```

**Staff**
```javascript
{
  staffId: String (unique),
  name: String,
  role: String ['Manager', 'Receptionist', 'Housekeeping', 'Chef', 'Security', 'Maintenance'],
  contact: String,
  joinDate: Date,
  status: String ['Active', 'On Leave', 'Inactive']
}
```

## Compound Indexes (ESR Rule)

- **Guests**: `{status: 1, checkinDate: 1, checkoutDate: 1}`
- **Rooms**: `{status: 1, type: 1, capacity: 1}`
- **Bookings**: `{status: 1, roomId: 1, checkinDate: 1}`
- **Services**: `{status: 1, guestId: 1, bookingDate: 1}`

## API Endpoints

### Guests
- `GET /api/guests` - Get all guests with filters
- `GET /api/guests/:id` - Get single guest
- `POST /api/guests` - Create guest
- `PUT /api/guests/:id` - Update guest
- `DELETE /api/guests/:id` - Delete guest

### Rooms
- `GET /api/rooms` - Get all rooms with filters
- `GET /api/rooms/:id` - Get single room
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room
- `POST /api/rooms/bulk-update-status` - Bulk update room status

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/detailed` - Get bookings with guest/room details
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `POST /api/bookings/bulk` - Bulk create bookings
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking
- `POST /api/bookings/check-clash` - Check booking clashes

### Amenities
- `GET /api/amenities` - Get all amenities
- `GET /api/amenities/:id` - Get single amenity
- `POST /api/amenities` - Create amenity
- `PUT /api/amenities/:id` - Update amenity
- `DELETE /api/amenities/:id` - Delete amenity

### Services
- `GET /api/services` - Get all services
- `GET /api/services/detailed` - Get services with guest/amenity details
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Staff
- `GET /api/staff` - Get all staff
- `GET /api/staff/:id` - Get single staff
- `POST /api/staff` - Create staff
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff

### Reports
- `GET /api/reports/occupancy` - Get occupancy rate
- `GET /api/reports/revenue` - Get revenue by room type
- `GET /api/reports/guests-by-roomtype` - Get guest count by room type
- `GET /api/reports/top-amenities` - Get top used amenities
- `GET /api/reports/services-summary` - Get services summary
- `GET /api/reports/dashboard` - Get dashboard overview

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
cd Resort-dbms
```

2. **Install dependencies for all packages**
```bash
npm run install-all
```

Or install individually:
```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

3. **Configure environment variables**

Edit `server/.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resort_management
NODE_ENV=development
```

4. **Start MongoDB**
Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

5. **Seed the database with sample data**
```bash
npm run seed
```

6. **Run the application**

Run both server and client concurrently:
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Server
npm run server

# Terminal 2 - Client
npm run client
```

7. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Project Structure

```
Resort-dbms/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── pages/         # React pages
│   │   │   ├── Dashboard.js
│   │   │   ├── Guests.js
│   │   │   ├── Rooms.js
│   │   │   ├── Bookings.js
│   │   │   ├── Amenities.js
│   │   │   ├── Services.js
│   │   │   ├── Staff.js
│   │   │   └── Reports.js
│   │   ├── services/      # API service layer
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                # Node.js/Express backend
│   ├── config/
│   │   └── db.js         # MongoDB connection
│   ├── models/           # Mongoose models
│   │   ├── Guest.js
│   │   ├── Room.js
│   │   ├── Booking.js
│   │   ├── Amenity.js
│   │   ├── Service.js
│   │   └── Staff.js
│   ├── routes/           # API routes
│   │   ├── guests.js
│   │   ├── rooms.js
│   │   ├── bookings.js
│   │   ├── amenities.js
│   │   ├── services.js
│   │   ├── staff.js
│   │   └── reports.js
│   ├── seeders/
│   │   └── seed.js       # Sample data seeder
│   ├── .env
│   ├── server.js
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## Usage Guide

### Managing Guests
1. Navigate to **Guests** page
2. Use filters to search by status, dates, or search term
3. Click **Add New Guest** to create a guest
4. Edit or delete guests using action buttons

### Managing Rooms
1. Navigate to **Rooms** page
2. Filter by status, room type, or search
3. View room facilities and pricing
4. Add/edit rooms with facilities (comma-separated)

### Creating Bookings
1. Navigate to **Bookings** page
2. Click **Add New Booking**
3. Enter Guest ID and Room ID
4. Select check-in and check-out dates
5. System automatically checks for booking clashes

### Viewing Reports
1. Navigate to **Reports** page
2. Select date range for analytics
3. View:
   - Occupancy rate
   - Revenue by room type
   - Guest distribution
   - Top amenities usage
   - Service statistics

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **body-parser** - Request body parsing

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **CSS3** - Styling

## Best Practices Implemented

1. **ESR Index Rule**: All compound indexes follow Equality-Sort-Range pattern
2. **Aggregation Pipelines**: Complex analytics using MongoDB aggregation
3. **Referential Integrity**: Foreign key relationships via IDs
4. **RESTful API Design**: Standard HTTP methods and status codes
5. **Component-Based Architecture**: Reusable React components
6. **Error Handling**: Comprehensive error handling on backend
7. **Responsive Design**: Mobile-friendly UI
8. **Code Organization**: Separation of concerns (MVC pattern)

## Sample Data

The seeder script includes:
- 5 Sample guests
- 8 Sample rooms (various types)
- 5 Sample bookings
- 6 Sample amenities
- 6 Sample services
- 7 Sample staff members

## Future Enhancements

- Authentication and authorization
- Payment gateway integration
- Email notifications
- Inventory management
- Advanced reporting with charts
- Mobile application
- Real-time notifications with WebSockets

## License

MIT License

## Author

Pranav Doke

## Support

For issues and questions, please create an issue in the repository.
"# resort_management_system" 
