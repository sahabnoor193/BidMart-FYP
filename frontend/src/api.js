// // src/api.js
// export const registerUser = async (userData) => {
//     const response = await fetch('http://localhost:5000/api/auth/register', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(userData)
//     });
//     return await response.json();
//   };

// export const registerUser = async (userData) => {
//   try {
//     const response = await fetch('http://localhost:5000/api/auth/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(userData)
//     });
//     if (!response.ok) {
//       throw new Error('Failed to register');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('API Error:', error);
//     return { error: error.message };
//   }
// };
