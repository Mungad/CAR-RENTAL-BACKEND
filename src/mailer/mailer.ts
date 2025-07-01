// mailer.ts
import nodemailer from 'nodemailer';
import 'dotenv/config';

export const sendEmail = async (
    email: string,
    subject: string,
    message: string,
    html: string
) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Verify connection config
        await transporter.verify();

        const mailOptions: nodemailer.SendMailOptions = {
            from: `"Car Rental Service" <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            text: message,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);

        return 'Email sent successfully';
    } catch (error: any) {
        console.error("Email sending failed:", error.message);
        throw new Error("Email could not be sent. " + error.message);
    }
};
