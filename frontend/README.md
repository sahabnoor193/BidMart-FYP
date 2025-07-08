# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Deployment on Render

1. Create a `.env` file in the root of the frontend directory:

   ```env
   VITE_API_URL=https://your-backend.onrender.com
   ```

2. On Render, set the same environment variable in the dashboard for your static site.

3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
