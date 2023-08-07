import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default ({ mode }) => {
  //Get env in vite config
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [tsconfigPaths(), react()],
    server: {
      port: parseInt(process.env.VITE_WEB_APP_PORT ?? "4001"),
    },
  });
}