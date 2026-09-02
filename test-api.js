import api from './src/api.js';

async function testLogin() {
  try {
    const res = await api.post('/users/login', {
      username: 'admin',
      password: '1234'
    });
    console.log('Login success:', res.data);
  } catch (err) {
    console.error('Login failed:', err.response?.data || err.message);
  }
}

async function testProducts() {
  try {
    const res = await api.get('/app/get-products');
    console.log('Products success:', res.data);
  } catch (err) {
    console.error('Products failed:', err.response?.data || err.message);
  }
}

async function run() {
  await testLogin();
  await testProducts();
}

run();
