import Fastify from 'fastify'
const fastify = Fastify({
    logger: true
});

fastify.post('/deposit', async function handler(request, reply) {
    return reply.code(200).header('Content-Type', 'application/json; charset=utf-8').send({
        order_id: request.body.order_id,
        amount: request.body.amount,
        status: 1
    });
});

try {
    await fastify.listen({ port: 3001});
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}