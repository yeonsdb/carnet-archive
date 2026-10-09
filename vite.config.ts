import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // the native watcher missed some quick successive edits on this Windows machine (stale modules served);
    // polling the small src tree is reliable
    watch: { usePolling: true, interval: 200 },
  },
});
