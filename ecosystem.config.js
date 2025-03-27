module.exports = {
  apps: [
    {
      name: "next-app",
      script: "npm",
      args: "start",
      env: {
        PORT: 4001,
        NODE_ENV: "production",
      },
    },
  ],
};
