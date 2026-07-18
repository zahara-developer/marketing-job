import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendApplicationEmail = async (application) => {
    try {
        // Email to YOU
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "f2907743@gmail.com",
            subject: `New Job Application - ${application.roleInterested}`,
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

        // Auto reply to applicant
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: application.email,
            subject: "Application Received - HireFlow",
            html: `
        <h2>Thank you for applying!</h2>

        <p>Dear ${application.fullName},</p>

        <p>We have successfully received your application for the <b>${application.roleInterested}</b> position.</p>

        <p>Our recruitment team will review your application carefully.</p>

        <p>If your profile matches our requirements, we will contact you for the next stage of the recruitment process.</p>

        <br>

        <p>Best Regards,</p>
        <h3>HireFlow Recruitment Team</h3>
      `,
        });

        console.log("✅ Emails sent successfully");
    } catch (error) {
        console.error("❌ Resend Error:", error);
    }
};