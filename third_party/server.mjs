import Fastify from 'fastify'
const fastify = Fastify({
    logger: true
});

fastify.post('/deposit', async function handler(request, reply) {
    return request.body;
});

try {
    await fastify.listen({ port: 3001});
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}