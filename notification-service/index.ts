import amqp from "amqplib";

async function startConsumer() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const queue = "NOTIFICATION_QUEUE";
        await channel.assertQueue(queue);
        console.log("Waiting for messages in %s...", queue);
        channel.consume(queue, (message) => {
            if (message !== null) {
                const data = JSON.parse(message.content.toString());

                if (data.type === "TICKET_CREATED") {
                    console.log("---------------------------------");
                    console.log(`📧 SENDING EMAIL TO: ${data.email}`);
                    console.log(`📝 Subject: Ticket Created #${data.ticketId}`);
                    console.log(`📄 Content: Your ticket '${data.title}' has been received.`);
                    console.log("---------------------------------");

                    // Acknowledge (tell RabbitMQ we are done)
                    channel.ack(message);
                }
            }
        });

    } catch (error) {
        console.error("Error connecting to RabbitMQ", error);
    }
}

startConsumer();