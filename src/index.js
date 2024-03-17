const express = require('express');
const app = express();
const amqplib  = require("amqplib");
const { EmailService } = require('./services')

async function connectQueue() { 
    try {
        const connection = await amqplib.connect("amqp://localhost");
        const channel = await connection.createChannel();
        await channel.assertQueue("noti-queue");
        channel.consume("noti-queue", async (data) => {
            console.log(`${Buffer.from(data.content)}`);
            const object = JSON.parse(`${Buffer.from(data.content)}`);
            await EmailService.sendEmail("amanjotsingh2309@gmail.com", object.recepientEmail, object.subject, object.text);
            channel.ack(data);
        })
    } catch(error) {

    }
}
const { ServerConfig, Logger } = require('./config');
const apiRoutes = require('./routes')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`Sucessfully started the server on PORT: ${ServerConfig.PORT}`);
    Logger.info("Successfully started the server", "root", {});
    await connectQueue();
    console.log("queue is up")
});
