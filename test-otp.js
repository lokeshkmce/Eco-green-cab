async function test(payload) {
  const res = await fetch('http://localhost:5173/ecogreencab/send-otp/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  console.log('Payload:', payload, 'Response:', data);
}

async function run() {
  await test({ mobile: '9999999999' });
  await test({ phone: '9999999999' });
  await test({ mobile_number: '9999999999' });
  await test({ phone_number: '9999999999' });
}

run();
