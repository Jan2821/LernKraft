import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Lädt Umgebungsvariablen basierend auf dem Modus (z.B. production)
  // Fix: Property 'cwd' does not exist on type 'Process'. Using '.' as envDir resolves to the current directory.
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Ersetzt process.env.API_KEY im Code durch den Wert aus den Umgebungsvariablen
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});