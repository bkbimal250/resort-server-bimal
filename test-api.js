const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test registration
async function testRegistration() {
  try {
    console.log('Testing registration...');
    const response = await axios.post(`${API_BASE_URL}/users/register`, {
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      phone: '1234567890',
      password: 'password123'
    });
    console.log('✅ Registration successful:', response.data.message);
    return response.data.token;
  } catch (error) {
    console.log('❌ Registration failed:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test login
async function testLogin() {
  try {
    console.log('Testing login...');
    const response = await axios.post(`${API_BASE_URL}/users/login`, {
      emailOrUsername: 'testuser',
      password: 'password123'
    });
    console.log('✅ Login successful:', response.data.message);
    return response.data.token;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test profile update
async function testProfileUpdate(token) {
  try {
    console.log('Testing profile update...');
    const response = await axios.put(`${API_BASE_URL}/users/profile`, {
      name: 'Updated Test User',
      email: 'updated@example.com',
      phone: '9876543210',
      address: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Profile update successful:', response.data.message);
  } catch (error) {
    console.log('❌ Profile update failed:', error.response?.data?.message || error.message);
  }
}

// Test get profile
async function testGetProfile(token) {
  try {
    console.log('Testing get profile...');
    const response = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Get profile successful:', response.data.user.name);
  } catch (error) {
    console.log('❌ Get profile failed:', error.response?.data?.message || error.message);
  }
}

// Test create enquiry
async function testCreateEnquiry() {
  try {
    console.log('Testing create enquiry...');
    const response = await axios.post(`${API_BASE_URL}/enquiries`, {
      name: 'Test Customer',
      email: 'customer@example.com',
      phone: '5555555555',
      dateOfPlan: '2024-12-25',
      subject: 'Hotel booking enquiry',
      message: 'I would like to book a hotel for next weekend.'
    });
    console.log('✅ Create enquiry successful:', response.data.message);
  } catch (error) {
    console.log('❌ Create enquiry failed:', error.response?.data?.message || error.message);
  }
}

// Test get enquiries (requires admin token)
async function testGetEnquiries(token) {
  try {
    console.log('Testing get enquiries...');
    const response = await axios.get(`${API_BASE_URL}/enquiries`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Get enquiries successful:', response.data.enquiries.length, 'enquiries found');
  } catch (error) {
    console.log('❌ Get enquiries failed:', error.response?.data?.message || error.message);
  }
}

// Test get user's own enquiries (for regular users)
async function testGetUserEnquiries(token) {
  try {
    console.log('Testing get user enquiries...');
    const response = await axios.get(`${API_BASE_URL}/enquiries/my-enquiries`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Get user enquiries successful:', response.data.enquiries.length, 'enquiries found');
  } catch (error) {
    console.log('❌ Get user enquiries failed:', error.response?.data?.message || error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API tests...\n');

  // Test registration
  const token = await testRegistration();
  
  if (!token) {
    // If registration failed, try login
    console.log('\nTrying login instead...');
    const loginToken = await testLogin();
    if (loginToken) {
      await testGetProfile(loginToken);
      await testProfileUpdate(loginToken);
      await testGetUserEnquiries(loginToken);
      await testGetEnquiries(loginToken);
    }
  } else {
    // Test other endpoints with the token
    await testGetProfile(token);
    await testProfileUpdate(token);
    await testGetUserEnquiries(token);
    await testGetEnquiries(token);
  }

  // Test enquiry creation (no auth required)
  await testCreateEnquiry();

  console.log('\n✨ API tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testRegistration,
  testLogin,
  testProfileUpdate,
  testGetProfile,
  testCreateEnquiry,
  testGetEnquiries
};
