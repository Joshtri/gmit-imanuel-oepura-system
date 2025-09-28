const fetch = require('node-fetch');

const testApi = async () => {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcl9lMjEyOGZjMC1jZjBlLTQ3ZDMtODMyNS00ZWVmMzBmNmMzZGIiLCJlbWFpbCI6ImdpbGJlcnRoQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiZ2lsYmVydGgiLCJyb2xlIjoiSkVNQUFUIiwiaWF0IjoxNzU5MDEzMDI4LCJleHAiOjE3NTk2MTc4Mjh9.9WXYcaaMeLzJMT47_Sgpa6srKDcZTcf8yvPfwiFAKm0';

    console.log('Testing API with token...');
    console.log('Authorization header:', `Bearer ${token}`);

    const response = await fetch('http://192.168.1.143:3000/api/dokumen/jemaat/jmt_d25e42f1-e838-40ed-9619-48e9d0cbb6c2', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
};

testApi();