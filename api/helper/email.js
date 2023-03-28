const nodemailer = require("nodemailer");

// async function SendMail() {
exports.SendMail = async (to, subject, message, type) => {
  try {
    let messageBody = await getEmailBodyRegistrationuserId(message);
    if (type == 2) {
      messageBody = await getEmailBodyResetPassworduserId(message);
    }
    let transporter = nodemailer.createTransport({
      host: "info@exmple.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "info@exmple.com", // generated ethereal user
        pass: "example123", // generated ethereal password
      },
    });

    let info = await transporter.sendMail({
      from: "info@exmple.com", // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      html: messageBody, // html body
    });
    console.log(info);
    return info;
  } catch (err) {
    console.log(err);
    return err;
  }
};

function getEmailBodyRegistrationuserId(userId) {
  let url = process.env.URL + "uploads/admin.png";
  let site_url = `${process.env.web_url}#/verify/token/` + userId;
  let emailBody = `<tbody>
  <tr>
     <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
        <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
           <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
              <tr>
                 <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                    <div style="font-size:24px;font-weight:bold;line-height:24px;text-align:center;color:#323232;"> Verify Email </div>
                 </td>
              </tr>
              <tr>
                 <td align="left" style="font-size:0px;padding:10px 25px 0px 25px;word-break:break-word;">
                    <div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">We\'re happy to have you onboard in PitchMe App.</div>
                 </td>
              </tr>
           </table>
           <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top; margin:30px 0px;" width="100%">
              <tr>
                 <td align="left" style="font-size:0px;padding:0 25px;word-break:break-word;">
                    <div style="font-size:16px;font-weight:bold;line-height:24px;text-align:left;color:#000;">Verify Email</div>
                 </td>
              </tr>
              <tr>
                 <td align="left" style="font-size:0px;padding:0 25px;word-break:break-word;">
                    <div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                       
      <tr> <td align="left" style="font-size:0px;padding:0 25px;word-break:break-word;">
      <div style="font-size:16px;font-weight:400;line-height:24px;text-align:center;"><a href=${site_url}>Click here to verify email</a> <br/>
                       <br/><br/> If you get any kind of problem while using PitchMe app then feel free to contact us on <a href="mailto:support@pitchme.com" title="Megabox Support">support@pitchcme.com</a> 
                    </div>
                 </td>
              </tr>
           </table>
        </div>
     </td>
  </tr>
  <tr>
     <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
        <p style="border-top:solid 1px #DFE3E8;font-size:1;margin:0px auto;width:100%;"></p>
     </td>
  </tr>
</tbody>`;
  return emailBody;
}

function getEmailBodyResetPassworduserId(userId) {
  let url = process.env.URL + "uploads/logo.png";
  let site_url =
    `${process.env.web_url}#/reset-password/token/` + userId;
  let emailBody = `<tbody>
   <tr>
      <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
         <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
               <tr>
                  <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                     <div style="font-size:24px;font-weight:bold;line-height:24px;text-align:center;color:#323232;"> Reset Password </div>
                  </td>
               </tr>
               <tr>
                  <td align="left" style="font-size:0px;padding:10px 25px 0px 25px;word-break:break-word;">
                     <div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">We received a request to reset your password.</div>
                  </td>
               </tr>
               <tr>
                  <td align="left" style="font-size:0px;padding:10px 25px 0px 25px;word-break:break-word;">
                     <div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">Your Link to reset the password for this session. </div>
                  </td>
               </tr>
            </table>
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top; margin:30px 0px;" width="100%">
             
              <tr>
                 <td align="left" style="font-size:0px;padding:0 25px;word-break:break-word;">
                    <div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                       
      <tr> <td align="left" style="font-size:0px;padding:0 25px;word-break:break-word;">
      <div style="font-size:16px;font-weight:400;line-height:24px;text-align:center;"><a href=${site_url}>Click here to Reset Password</a> <br/>
                       <br/><br/> If you get any kind of problem while using PitchMe app then feel free to contact us on <a href="mailto:support@pitchme.com" title="Megabox Support">support@pitchcme.com</a> 
                    </div>
                 </td>
              </tr>
           </table>
         </div>
      </td>
   </tr>
   <tr>
      <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
         <p style="border-top:solid 1px #DFE3E8;font-size:1;margin:0px auto;width:100%;"></p>
      </td>
   </tr>
 </tbody>`;
  return emailBody;
}
