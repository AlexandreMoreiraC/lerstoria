import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
        library: resolve(__dirname, 'library.html'),
        book: resolve(__dirname, 'book.html'),
        quiz: resolve(__dirname, 'quiz.html'),
      },
    },
  },
});