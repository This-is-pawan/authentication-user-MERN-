const EMAIL_VERIFY_TEMPLATE =({name,email,otp})=> `
<div style="max-width:600px;margin:auto;padding:20px;border:1px solid #ccc;font-family:sans-serif;">
  <h2 style="color:#333;">Hello, ${name}</h2>
  <p>We received a request for your account:</p>
  <p><strong>Email:</strong> ${email}</p>
  <p>Your One-Time Password (OTP) is:</p>
  <h3 style="background:#f4f4f4;padding:10px;text-align:center;border-radius:4px;">${otp}</h3>
  <p style="margin-top:20px;color:#666;font-size:12px;">If you didn’t request this, you can ignore this message.</p>
</div>
`;
 const PASSWORD_RESET_TEMPLATE =({name,email,otp})=> `
<div style="max-width:600px;margin:auto;padding:20px;border:1px solid #ccc;font-family:sans-serif;">
  <h2 style="color:#333;">Hello, ${name}</h2>
  <p>We received a request for your account:</p>
  <p><strong>Email:</strong> ${email}</p>
  <p>Your One-Time Password ${otp} is:</p>
  <h3 style="background:#f4f4f4;padding:10px;text-align:center;border-radius:4px;">${otp}</h3>
  <p style="margin-top:20px;color:#666;font-size:12px;">If you didn’t request this, you can ignore this message.</p>
</div>
`;
module.exports = {
 EMAIL_VERIFY_TEMPLATE,
 PASSWORD_RESET_TEMPLATE,
};