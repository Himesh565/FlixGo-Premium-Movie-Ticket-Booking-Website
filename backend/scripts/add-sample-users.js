const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB Connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/moviebooking';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log(`✅ Connected to MongoDB at ${uri}`))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Sample Users Data
const sampleUsers = [
    {
        name: 'Raj Patel',
        email: 'raj.patel@example.com',
        password: 'password123'
    },
    {
        name: 'Priya Shah',
        email: 'priya.shah@example.com',
        password: 'password123'
    },
    {
        name: 'Amit Desai',
        email: 'amit.desai@example.com',
        password: 'password123'
    },
    {
        name: 'Neha Mehta',
        email: 'neha.mehta@example.com',
        password: 'password123'
    },
    {
        name: 'Karan Joshi',
        email: 'karan.joshi@example.com',
        password: 'password123'
    }
];

// Sample Feedback Data
const sampleFeedback = [
    {
        name: 'Raj Patel',
        email: 'raj.patel@example.com',
        rating: 5,
        feedback: 'Excellent movie booking experience! The website is very user-friendly and the seat selection is smooth. Highly recommend FlixGo!'
    },
    {
        name: 'Priya Shah',
        email: 'priya.shah@example.com',
        rating: 4,
        feedback: 'Great service and easy to use platform. Love the interface design. Only improvement would be faster payment processing.'
    },
    {
        name: 'Amit Desai',
        email: 'amit.desai@example.com',
        rating: 5,
        feedback: 'Best movie ticket booking app I have used! The gold and black theme looks premium. Keep up the good work!'
    },
    {
        name: 'Neha Mehta',
        email: 'neha.mehta@example.com',
        rating: 3,
        feedback: 'Good overall experience but sometimes the app is a bit slow. Otherwise, the seat selection and payment is smooth.'
    },
    {
        name: 'Karan Joshi',
        email: 'karan.joshi@example.com',
        rating: 4,
        feedback: 'Very convenient and hassle-free booking. Love the movie selection and show timings. Would use again!'
    }
];

// Function to create sample data
async function createSampleData() {
    try {
        console.log('\n🚀 Starting sample data creation...\n');

        // Clear existing sample users and feedback
        console.log('🧹 Clearing existing sample data...');
        const sampleEmails = sampleUsers.map(u => u.email);
        await User.deleteMany({ email: { $in: sampleEmails } });
        await Feedback.deleteMany({ email: { $in: sampleEmails } });
        console.log('✅ Cleared existing sample data\n');

        // Create Users
        console.log('👤 Creating sample users...');
        const hashedPassword = await bcrypt.hash('password123', 10);

        const usersToCreate = sampleUsers.map(user => ({
            ...user,
            password: hashedPassword
        }));

        const createdUsers = await User.insertMany(usersToCreate);
        console.log(`✅ Created ${createdUsers.length} users:\n`);
        createdUsers.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.name} (${user.email})`);
        });

        // Create Feedback
        console.log('\n💬 Creating sample feedback...');
        const createdFeedback = await Feedback.insertMany(sampleFeedback);
        console.log(`✅ Created ${createdFeedback.length} feedback entries:\n`);
        createdFeedback.forEach((fb, index) => {
            console.log(`   ${index + 1}. ${fb.name} - ${fb.rating}⭐ - "${fb.feedback.substring(0, 50)}..."`);
        });

        console.log('\n✨ Sample data creation completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Total Users: ${createdUsers.length}`);
        console.log(`   - Total Feedback: ${createdFeedback.length}`);
        console.log(`   - Password for all users: password123`);
        console.log('\n🎯 You can now check:');
        console.log('   - Admin Users page: http://localhost:5173/admin/users');
        console.log('   - Admin Feedback page: http://localhost:5173/admin/feedback\n');

    } catch (error) {
        console.error('❌ Error creating sample data:', error);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
    }
}

// Run the script
createSampleData();
