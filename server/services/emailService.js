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
        console.log("Checking Gmail connection...");

        await transporter.verify();

        console.log("✅ Gmail Connected");

        const info = await transporter.sendMail({
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
        <p><b>Message:</b> ${application.message}</p>
      `,
        });

        console.log("✅ Email Sent Successfully");
        console.log(info);

    } catch (error) {
        console.error("EMAIL ERROR:");
        console.error(error);
    }
};