const express = require('express');
const app = express();
const { ServerConfig, Logger } = require('./config');
const apiRoutes = require('./routes')

const mailsender = require('./config/email-config');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`Sucessfully started the server on PORT: ${ServerConfig.PORT}`);
    try {
        const response = await mailsender.sendMail({
            from: ServerConfig.GMAIL_EMAIL,
            to: 'amanjotsingh2309@gmail.com',
            subject: 'is this working',
            text: 'yes'
        })
    } catch (error) {
        console.log(error)
    }
    Logger.info("Successfully started the server", "root", {});
});
