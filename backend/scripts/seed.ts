import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../src/models/user.model';
import { Organization } from '../src/models/organization.model';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sevasetu');
  console.log('Connected to DB');

  // Clear existing
  await User.deleteMany({});
  await Organization.deleteMany({});

  // Create admin user
  const admin = await User.create({
    name: 'Super Admin',
    email: 'admin@sevasetu.org',
    password: 'Admin@123',
    role: 'admin',
  });
  console.log('Admin created:', admin.email);

  // Create org user
  const orgUser = await User.create({
    name: 'Demo NGO Manager',
    email: 'demo@ngo.org',
    password: 'Demo@123',
    role: 'organization',
  });

  // Create sample organizations
  const orgs = [
    {
      name: 'Akshaya Patra Foundation',
      type: 'NGO',
      description: 'The Akshaya Patra Foundation is a non-profit organization providing mid-day meals to government school children. We believe no child should be deprived of education due to hunger.',
      address: '72/1, 3rd Floor, Sampige Road, Malleshwaram',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560003',
      contactEmail: 'contact@akshayapatra.org',
      phone: '9876543210',
      logo: 'https://placehold.co/400x400/saffron/white?text=AP',
      images: ['https://placehold.co/800x500/saffron/white?text=Akshaya+Patra'],
      razorpayAccountId: 'acc_sample1',
      status: 'approved',
      isVerified: true,
      createdBy: orgUser._id,
    },
    {
      name: 'Shri Siddhivinayak Temple Trust',
      type: 'Temple',
      description: 'Shri Siddhivinayak Ganapati Temple is one of the most visited temples in Maharashtra. The trust runs charitable activities including free meals and medical camps.',
      address: 'S.K. Bole Marg, Prabhadevi',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400028',
      contactEmail: 'info@siddhivinayak.org',
      phone: '9988776655',
      logo: 'https://placehold.co/400x400/orange/white?text=SST',
      images: ['https://placehold.co/800x500/orange/white?text=Temple'],
      razorpayAccountId: 'acc_sample2',
      status: 'approved',
      isVerified: true,
      createdBy: orgUser._id,
    },
    {
      name: 'Smile Foundation',
      type: 'Education',
      description: 'Smile Foundation works to empower under-privileged children, youth and women in India through education, healthcare and livelihood programs.',
      address: '11/7, Kishangarh, Vasant Kunj',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110070',
      contactEmail: 'info@smilefoundationindia.org',
      phone: '9112233445',
      logo: 'https://placehold.co/400x400/blue/white?text=SF',
      images: ['https://placehold.co/800x500/blue/white?text=Education'],
      razorpayAccountId: 'acc_sample3',
      status: 'approved',
      isVerified: false,
      createdBy: orgUser._id,
    },
    {
      name: 'Helpage India',
      type: 'Health',
      description: 'HelpAge India is a leading charity in India working with and for disadvantaged elderly since 1978. We help the elderly to live full, dignified and active lives.',
      address: 'C-14, Qutub Institutional Area',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016',
      contactEmail: 'contact@helpageindia.org',
      phone: '9223344556',
      logo: 'https://placehold.co/400x400/green/white?text=HI',
      images: ['https://placehold.co/800x500/green/white?text=Health'],
      razorpayAccountId: 'acc_sample4',
      status: 'approved',
      isVerified: true,
      createdBy: orgUser._id,
    },
    {
      name: 'Feeding India',
      type: 'Food',
      description: 'Feeding India by Zomato is working towards eliminating hunger and food waste in India by creating a smarter food system. We collect surplus food and distribute to those in need.',
      address: '12th Floor, Tower B, Unitech Cyber Park',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      contactEmail: 'hello@feedingindia.org',
      phone: '9334455667',
      logo: 'https://placehold.co/400x400/red/white?text=FI',
      images: ['https://placehold.co/800x500/red/white?text=Food'],
      status: 'approved',
      isVerified: false,
      createdBy: orgUser._id,
    },
  ];

  await Organization.insertMany(orgs);
  console.log(`✅ Seeded ${orgs.length} organizations`);
  console.log('\n📋 Login Credentials:');
  console.log('Admin:  admin@sevasetu.org / Admin@123');
  console.log('Org:    demo@ngo.org / Demo@123');

  await mongoose.disconnect();
  console.log('\n✅ Seed complete!');
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
