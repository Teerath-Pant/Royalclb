import Fastify from 'fastify'

const app = Fastify({ logger: true })

app.get('/api/health', async () => ({ status: 'ok' }))

await app.listen({ port: Number(process.env.PORT ?? 3000) })
