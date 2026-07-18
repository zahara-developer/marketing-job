import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendApplicationEmail = async (application) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "New Job Application Received",

            html: `
        <h2>New Job Application</h2>

        <p><b>Name:</b> ${application.fullName}</p>
        <p><b>Email:</b> ${application.email}</p>
        <p><b>Phone:</b> ${application.phone}</p>
        <p><b>Role:</b> ${application.roleInterested}</p>
        <p><b>Experience:</b> ${application.experienceLevel}</p>
        <p><b>Message:</b></p>
        <p>${application.message}</p>
      `,
        });

        console.log("✅ Email sent");
    } catch (err) {
        console.error("Email Error:", err);
    }
};