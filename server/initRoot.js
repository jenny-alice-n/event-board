require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const initRoot = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const rootExists = await User.findOne({ role: 'root' });
        if (rootExists) {
            console.log('Root user already exists');
            process.exit(0);
        }

        const root = new User({
            username: 'admin',
            password: 'adminpassword', // Should be changed immediately
            role: 'root',
            clubName: 'Super Admin'
        });

        await root.save();
        console.log('Root user initialized successfully');
        process.exit(0);
    } catch (e) {
        console.error('Error initializing root user:', e);
        process.exit(1);
    }
};

initRoot();
