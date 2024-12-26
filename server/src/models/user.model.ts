import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';  // We'll use this for password hashing

// First, we define an interface that describes what a User document looks like
interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    firstName?: string;  // Optional fields marked with ?
    lastName?: string;
    createdAt: Date;
    updatedAt: Date;
    // We'll add a method to check passwords
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Now we create the schema that tells MongoDB how to store our user data
const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        // We can add email validation using a regular expression
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    }
}, {
    // This automatically creates and manages createdAt and updatedAt fields
    timestamps: true
});

// Let's add some important functionality to our schema
// This runs before saving the user and hashes the password
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Method to compare passwords for login
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Create and export the model
const User = mongoose.model<IUser>('User', userSchema);
export default User;