import axios from 'axios';

class AuthService {
  constructor() {
    this.googleClientId = '484011380831-p4d1tupugg26qs2jjqba0o5u9a0ul0n6.apps.googleusercontent.com';
  }

  // Method to handle Google sign-in
  async signInWithGoogle(tokenId) {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/google', {
        tokenId: tokenId
      });
      return response.data;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  // Method to handle sign-out
  signOut() {
    // Implement sign-out logic if needed
  }

  // Method to check if the user is authenticated
  isAuthenticated() {
    // Implement authentication check logic
    // For example, check if the user has a valid session or token
    return true; // Placeholder, replace with actual implementation
  }
}

const authServiceInstance = new AuthService(); // Assign instance to a variable

export default authServiceInstance; // Export the instance variable
