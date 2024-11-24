import { randomUUID } from 'crypto';

import { User } from '../models/init.js';
import { generatePasswordHash, validatePassword } from '../utils/password.js';

class UserService {
  static async list() {
    try {
      const users = await User.find().select('-password');
      return users;
    } catch (err) {
      console.error(`Database error while listing users: ${err}`);
      throw err;
    }
  }

  static async get(id) {
    try {
      const user = await User.findById(id).select('-password');
      console.log('Retrieved user:', user);
      return user;
    } catch (err) {
      console.error(`Database error while getting the user by their ID: ${err}`);
      throw err;
    }
  }

  static async getByEmail(email) {
    try {
      const user = await User.findOne({ email }).select('-password');
      return user;
    } catch (err) {
      console.error(`Database error while getting the user by their email: ${err}`);
      throw err;
    }
  }

  static async update(id, data) {
    try {
      return User.findByIdAndUpdate(id, data, { new: true });
    } catch (err) {
      console.error(`Database error while updating user ${id}: ${err}`);
      throw err;
    }
  }

  static async delete(id) {
    try {
      return User.findByIdAndDelete(id);
    } catch (err) {
      console.error(`Database error while deleting user ${id}: ${err}`);
      throw err;
    }
  }

  static async authenticateWithPassword(email, password) {
    if (!email) throw 'Email is required';
    if (!password) throw 'Password is required';

    try {
      const user = await User.findOne({ email });
      if (!user) return null;

      const passwordValid = await validatePassword(password, user.password);
      if (!passwordValid) return null;

      user.lastLoginAt = new Date();
      const updatedUser = await user.save();

      return updatedUser.toObject({ versionKey: false });
    } catch (err) {
      console.error(`Database error while authenticating user ${email} with password: ${err}`);
      throw err;
    }
  }

  static async authenticateWithToken(token) {
    try {
      const user = await User.findOne({ token }).select('-password');
      return user;
    } catch (err) {
      console.error(`Database error while authenticating user with token: ${err}`);
      throw err;
    }
  }

  static async createUser({ email, password, name = '' }) {
    if (!email) throw 'Email is required';
    if (!password) throw 'Password is required';

    const existingUser = await UserService.getByEmail(email);
    if (existingUser) throw 'User with this email already exists';

    const hash = await generatePasswordHash(password);

    try {
      const user = new User({
        email,
        password: hash,
        name,
        token: randomUUID(),
      });

      await user.save();

      return user.toObject({ versionKey: false });
    } catch (err) {
      console.error(`Database error while creating new user: ${err}`);
      throw err;
    }
  }

  static async setPassword(user, password) {
    if (!password) throw 'Password is required';
    user.password = await generatePasswordHash(password);

    try {
      return user.save();
    } catch (err) {
      console.error(`Database error while setting user password: ${err}`);
      throw err;
    }
  }

  static async regenerateToken(user) {
    user.token = randomUUID();

    try {
      return user.save();
    } catch (err) {
      console.error(`Database error while generating user token: ${err}`);
      throw err;
    }
  }

  static async updateDalleApiKey(userId, dalleApiKey) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { dalleApiKey },
        { new: true, select: '-password' }
      );
      console.log('User updated with new DALL-E API key:', updatedUser);
      return updatedUser;
    } catch (err) {
      console.error(`Database error while updating DALL-E API key for user ${userId}: ${err}`);
      throw err;
    }
  }
}

export default UserService;