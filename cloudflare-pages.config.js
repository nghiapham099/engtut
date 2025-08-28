module.exports = {
  build: {
    output: 'dist', // The directory where your built files will be located
    command: 'npm run build' // The command to build your project
  },
  routes: [
    {
      pattern: '/*',
      destination: '/index.html'
    }
  ]
};
