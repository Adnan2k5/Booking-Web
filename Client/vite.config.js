import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      '4f93-2405-201-a423-5801-702b-aa6e-bdc3-2a08.ngrok-free.app'
    ]
  }
});
