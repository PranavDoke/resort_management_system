const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Guest = require('../models/Guest');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Amenity = require('../models/Amenity');
const Service = require('../models/Service');
const Staff = require('../models/Staff');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const guests = [
  {
    guestId: 'G001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1234567890',
    address: '123 Main St, New York, NY',
    checkinDate: new Date('2025-11-01'),
    checkoutDate: new Date('2025-11-05'),
    roomType: 'Deluxe',
    status: 'Active'
  },
  {
    guestId: 'G002',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1234567891',
    address: '456 Oak Ave, Los Angeles, CA',
    checkinDate: new Date('2025-11-02'),
    checkoutDate: new Date('2025-11-07'),
    roomType: 'Suite',
    status: 'Active'
  },
  {
    guestId: 'G003',
    name: 'Michael Johnson',
    email: 'michael.j@email.com',
    phone: '+1234567892',
    address: '789 Pine Rd, Chicago, IL',
    checkinDate: new Date('2025-10-28'),
    checkoutDate: new Date('2025-11-02'),
    roomType: 'Double',
    status: 'Checked-out'
  },
  {
    guestId: 'G004',
    name: 'Emily Brown',
    email: 'emily.brown@email.com',
    phone: '+1234567893',
    address: '321 Elm St, Houston, TX',
    checkinDate: new Date('2025-11-05'),
    checkoutDate: new Date('2025-11-10'),
    roomType: 'Presidential',
    status: 'Pending'
  },
  {
    guestId: 'G005',
    name: 'David Wilson',
    email: 'david.w@email.com',
    phone: '+1234567894',
    address: '654 Maple Dr, Phoenix, AZ',
    checkinDate: new Date('2025-11-03'),
    checkoutDate: new Date('2025-11-06'),
    roomType: 'Single',
    status: 'Active'
  }
];

const rooms = [
  {
    roomId: 'R001',
    roomNumber: '101',
    type: 'Single',
    capacity: 1,
    facilities: ['WiFi', 'TV', 'Air Conditioning'],
    price: 100,
    status: 'Available'
  },
  {
    roomId: 'R002',
    roomNumber: '102',
    type: 'Double',
    capacity: 2,
    facilities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
    price: 150,
    status: 'Occupied'
  },
  {
    roomId: 'R003',
    roomNumber: '201',
    type: 'Suite',
    capacity: 4,
    facilities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi', 'Ocean View'],
    price: 300,
    status: 'Occupied'
  },
  {
    roomId: 'R004',
    roomNumber: '202',
    type: 'Deluxe',
    capacity: 3,
    facilities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony'],
    price: 250,
    status: 'Occupied'
  },
  {
    roomId: 'R005',
    roomNumber: '301',
    type: 'Presidential',
    capacity: 6,
    facilities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi', 'Ocean View', 'Private Pool', 'Butler Service'],
    price: 800,
    status: 'Reserved'
  },
  {
    roomId: 'R006',
    roomNumber: '103',
    type: 'Single',
    capacity: 1,
    facilities: ['WiFi', 'TV', 'Air Conditioning'],
    price: 100,
    status: 'Occupied'
  },
  {
    roomId: 'R007',
    roomNumber: '104',
    type: 'Double',
    capacity: 2,
    facilities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
    price: 150,
    status: 'Available'
  },
  {
    roomId: 'R008',
    roomNumber: '203',
    type: 'Suite',
    capacity: 4,
    facilities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi'],
    price: 300,
    status: 'Maintenance'
  }
];

const bookings = [
  {
    bookingId: 'B001',
    guestId: 'G001',
    roomId: 'R004',
    checkinDate: new Date('2025-11-01'),
    checkoutDate: new Date('2025-11-05'),
    status: 'Checked-in',
    paidAmount: 1000
  },
  {
    bookingId: 'B002',
    guestId: 'G002',
    roomId: 'R003',
    checkinDate: new Date('2025-11-02'),
    checkoutDate: new Date('2025-11-07'),
    status: 'Checked-in',
    paidAmount: 1500
  },
  {
    bookingId: 'B003',
    guestId: 'G003',
    roomId: 'R002',
    checkinDate: new Date('2025-10-28'),
    checkoutDate: new Date('2025-11-02'),
    status: 'Checked-out',
    paidAmount: 750
  },
  {
    bookingId: 'B004',
    guestId: 'G004',
    roomId: 'R005',
    checkinDate: new Date('2025-11-05'),
    checkoutDate: new Date('2025-11-10'),
    status: 'Confirmed',
    paidAmount: 4000
  },
  {
    bookingId: 'B005',
    guestId: 'G005',
    roomId: 'R006',
    checkinDate: new Date('2025-11-03'),
    checkoutDate: new Date('2025-11-06'),
    status: 'Checked-in',
    paidAmount: 300
  }
];

const amenities = [
  {
    amenityId: 'A001',
    name: 'Spa Treatment',
    description: 'Relaxing full body massage and spa treatment',
    price: 150,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  {
    amenityId: 'A002',
    name: 'Pool Access',
    description: 'Access to Olympic-sized swimming pool',
    price: 25,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  {
    amenityId: 'A003',
    name: 'Gym Membership',
    description: '24/7 access to state-of-the-art fitness center',
    price: 30,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  {
    amenityId: 'A004',
    name: 'Restaurant Dining',
    description: 'Fine dining experience at resort restaurant',
    price: 100,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  {
    amenityId: 'A005',
    name: 'Golf Course',
    description: '18-hole championship golf course access',
    price: 200,
    availableDays: ['Saturday', 'Sunday']
  },
  {
    amenityId: 'A006',
    name: 'Tennis Court',
    description: 'Professional tennis court with equipment',
    price: 50,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }
];

const services = [
  {
    serviceId: 'S001',
    guestId: 'G001',
    amenityId: 'A001',
    bookingDate: new Date('2025-11-02'),
    status: 'Completed',
    notes: 'Requested evening slot'
  },
  {
    serviceId: 'S002',
    guestId: 'G002',
    amenityId: 'A004',
    bookingDate: new Date('2025-11-03'),
    status: 'Confirmed',
    notes: 'Table for 2, vegetarian menu'
  },
  {
    serviceId: 'S003',
    guestId: 'G001',
    amenityId: 'A003',
    bookingDate: new Date('2025-11-01'),
    status: 'Completed',
    notes: 'Morning session preferred'
  },
  {
    serviceId: 'S004',
    guestId: 'G005',
    amenityId: 'A002',
    bookingDate: new Date('2025-11-04'),
    status: 'Pending',
    notes: 'Bring own swimming gear'
  },
  {
    serviceId: 'S005',
    guestId: 'G002',
    amenityId: 'A005',
    bookingDate: new Date('2025-11-06'),
    status: 'Confirmed',
    notes: 'Golf club rental needed'
  },
  {
    serviceId: 'S006',
    guestId: 'G004',
    amenityId: 'A001',
    bookingDate: new Date('2025-11-07'),
    status: 'Pending',
    notes: 'Couples massage'
  }
];

const staff = [
  {
    staffId: 'ST001',
    name: 'Sarah Johnson',
    role: 'Manager',
    contact: '+1234567800',
    joinDate: new Date('2023-01-15'),
    status: 'Active'
  },
  {
    staffId: 'ST002',
    name: 'Robert Garcia',
    role: 'Receptionist',
    contact: '+1234567801',
    joinDate: new Date('2023-03-20'),
    status: 'Active'
  },
  {
    staffId: 'ST003',
    name: 'Maria Lopez',
    role: 'Housekeeping',
    contact: '+1234567802',
    joinDate: new Date('2023-02-10'),
    status: 'Active'
  },
  {
    staffId: 'ST004',
    name: 'James Chen',
    role: 'Chef',
    contact: '+1234567803',
    joinDate: new Date('2023-04-05'),
    status: 'Active'
  },
  {
    staffId: 'ST005',
    name: 'Ahmed Hassan',
    role: 'Security',
    contact: '+1234567804',
    joinDate: new Date('2023-05-12'),
    status: 'Active'
  },
  {
    staffId: 'ST006',
    name: 'Linda Martinez',
    role: 'Housekeeping',
    contact: '+1234567805',
    joinDate: new Date('2023-06-18'),
    status: 'On Leave'
  },
  {
    staffId: 'ST007',
    name: 'Kevin Brown',
    role: 'Maintenance',
    contact: '+1234567806',
    joinDate: new Date('2023-07-22'),
    status: 'Active'
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Guest.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});
    await Amenity.deleteMany({});
    await Service.deleteMany({});
    await Staff.deleteMany({});

    console.log('Existing data cleared');

    // Insert new data
    await Guest.insertMany(guests);
    console.log('Guests seeded');

    await Room.insertMany(rooms);
    console.log('Rooms seeded');

    await Booking.insertMany(bookings);
    console.log('Bookings seeded');

    await Amenity.insertMany(amenities);
    console.log('Amenities seeded');

    await Service.insertMany(services);
    console.log('Services seeded');

    await Staff.insertMany(staff);
    console.log('Staff seeded');

    console.log('All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
