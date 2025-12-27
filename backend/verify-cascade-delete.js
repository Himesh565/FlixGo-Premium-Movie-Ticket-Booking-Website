const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Feedback = require('./models/Feedback');
const { deleteUser } = require('./controllers/authController');

const verifyCascadeDelete = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // 1. Create Test User
        const testUser = new User({
            name: 'Cascade Test User',
            email: 'cascade@test.com',
            password: 'password123',
            role: 'user'
        });
        await testUser.save();
        console.log(`Created test user: ${testUser._id}`);

        // 2. Create Test Feedback
        const testFeedback = new Feedback({
            name: testUser.name,
            email: testUser.email,
            rating: 5,
            feedback: 'This feedback should be deleted.'
        });
        await testFeedback.save();
        console.log(`Created test feedback: ${testFeedback._id}`);

        // 3. Invoke deleteUser controller
        const req = {
            params: { id: testUser._id }
        };
        const res = {
            status: function (code) {
                console.log(`Response Status: ${code}`);
                return this;
            },
            json: function (data) {
                console.log('Response JSON:', data);
            }
        };

        console.log('Calling deleteUser controller...');
        await deleteUser(req, res);

        // 4. Verify deletions
        const userCheck = await User.findById(testUser._id);
        const feedbackCheck = await Feedback.findOne({ email: testUser.email });

        if (!userCheck) console.log('✅ User successfully deleted.');
        else console.log('❌ User STILL EXISTS.');

        if (!feedbackCheck) console.log('✅ Feedback successfully deleted.');
        else console.log('❌ Feedback STILL EXISTS.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
};

verifyCascadeDelete();
