export default defineEventHandler(({ res }) => {
  res.setHeader('Content-Type', 'text/plain')

  const config = useRuntimeConfig()

  return `
User-agent: *
Sitemap: ${config.public.baseUrl}/sitemap.xml
  `.trim()
})
