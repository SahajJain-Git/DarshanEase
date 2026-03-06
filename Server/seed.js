/**
 * Seed Script
 * Clears existing data and populates the DB with:
 *   - 1 admin user
 *   - 6 sample temples
 *   - 336 darshan slots (8 slots × 6 temples × 7 future days)
 *
 * Usage:  node seed.js
 */
require('dotenv').config();
const connectDB   = require('./config/db');
const User        = require('./models/User');
const Temple      = require('./models/Temple');
const DarshanSlot = require('./models/DarshanSlot');

// ── Sample temple data ────────────────────────────────────────
const TEMPLES = [
  {
    name: 'Tirupati Balaji Temple',
    location: 'Tirumalai, Andhra Pradesh',
    deity: 'Lord Venkateswara',
    description: 'One of the most visited religious sites in the world.',
    emoji: '🛕',
    darshanStartTime: '05:00',
    darshanEndTime: '21:00',
    pricePerDevotee: 300,
  },
  {
    name: 'Kashi Vishwanath Temple',
    location: 'Varanasi, Uttar Pradesh',
    deity: 'Lord Shiva',
    description: 'Ancient temple on the banks of the river Ganges.',
    emoji: '⛩️',
    darshanStartTime: '03:00',
    darshanEndTime: '23:00',
    pricePerDevotee: 250,
  },
  {
    name: 'Golden Temple',
    location: 'Amritsar, Punjab',
    deity: 'Waheguru',
    description: 'The holiest Gurdwara and spiritual centre of Sikhism.',
    emoji: '🕌',
    darshanStartTime: '04:00',
    darshanEndTime: '22:00',
    pricePerDevotee: 0,
  },
  {
    name: 'Meenakshi Amman Temple',
    location: 'Madurai, Tamil Nadu',
    deity: 'Goddess Meenakshi',
    description: 'Historic Dravidian temple dedicated to Goddess Meenakshi.',
    emoji: '🏛️',
    darshanStartTime: '05:00',
    darshanEndTime: '21:00',
    pricePerDevotee: 150,
  },
  {
    name: 'Siddhivinayak Temple',
    location: 'Mumbai, Maharashtra',
    deity: 'Lord Ganesha',
    description: 'Famous Ganesha temple built in 1801.',
    emoji: '🕍',
    darshanStartTime: '05:30',
    darshanEndTime: '22:00',
    pricePerDevotee: 200,
  },
  {
    name: 'Jagannath Temple',
    location: 'Puri, Odisha',
    deity: 'Lord Jagannath',
    description: 'One of the sacred Char Dhams of Hinduism.',
    emoji: '🛕',
    darshanStartTime: '05:00',
    darshanEndTime: '22:00',
    pricePerDevotee: 100,
  },
];

// ── Daily slot time windows ───────────────────────────────────
const SLOT_TIMES = [
  { start: '05:30', end: '07:00' },
  { start: '07:00', end: '08:30' },
  { start: '09:00', end: '10:30' },
  { start: '11:00', end: '12:30' },
  { start: '14:00', end: '15:30' },
  { start: '16:00', end: '17:30' },
  { start: '18:00', end: '19:30' },
  { start: '20:00', end: '21:30' },
];

/** Build slot docs for all temples × next 7 days */
const buildSlots = (temples) => {
  const slots = [];
  for (let d = 1; d <= 7; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];

    temples.forEach((temple) => {
      SLOT_TIMES.forEach(({ start, end }) => {
        slots.push({
          temple:          temple._id,
          date:            dateStr,
          startTime:       start,
          endTime:         end,
          totalSeats:      Math.floor(Math.random() * 31) + 20, // 20–50
          bookedSeats:     0,
          pricePerDevotee: temple.pricePerDevotee,
          isActive:        true,
        });
      });
    });
  }
  return slots;
};

const seed = async () => {
  await connectDB();
  console.log('\n🌱 Starting database seed...\n');

  // Wipe existing data
  await User.deleteMany({});
  await Temple.deleteMany({});
  await DarshanSlot.deleteMany({});
  console.log('🗑️  Existing data cleared');

  // Admin user
  const admin = await User.create({
    name:     process.env.ADMIN_NAME || 'Administrator',
    email:    process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role:     'admin',
  });
  console.log(`👤 Admin created: ${admin.email}`);

  // Temples
  const temples = await Temple.insertMany(
    TEMPLES.map((t) => ({ ...t, createdBy: admin._id }))
  );
  console.log(`🛕 ${temples.length} temples created`);

  // Slots
  const slots = buildSlots(temples);
  await DarshanSlot.insertMany(slots);
  console.log(`⏰ ${slots.length} darshan slots created`);

  console.log('\n✅ Seed complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Email:    ${admin.email}`);
  console.log(`Password: ${process.env.ADMIN_PASSWORD}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});