import nodemailer from 'nodemailer';

export const sendResetEmail = async (email: string, resetToken: string) => {
  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Replace with your email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  //const resetUrl = `http://your-app-url/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: 'your-email@example.com', // Sender address
    to: email, // List of receivers
    subject: 'Password Reset Request', // Subject line
    text: `You requested a password reset. Please click on the link to reset your password: $(resetToken)`,
  };

  await transporter.sendMail(mailOptions);
};
