function setupProxy({ tls }) {
  const conf = [
    {
      context: ['/api', '/services', '/management', '/v3/api-docs', '/h2-console', '/oauth2', '/login', '/auth', '/health'],
      target:  'https://orbi-gateway.cloud.settysas.net/',
      secure: true,
      changeOrigin: tls,
    },
  ];
  return conf;
}

module.exports = setupProxy;
