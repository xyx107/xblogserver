
const NodeEmail = require('nodemailer');
const transporter = NodeEmail.createTransport({
  host: 'smtp.qq.com',
  service: 'qq',
  port: 465,
  secureConnection: true, 
  auth: {
    　　user: '1297184665@qq.com', // 邮箱账号
    　　pass: 'xavfftgdgvbjgccj' // 邮箱的授权码
    }
})

// class Email {

//   static async getEmailCode(email) {
//     const user = await UserModel.findUser(email);
//     if (user) throw new EmailExistHttpException();
//     const db = await EmailModel.findEmail(email);
    
//     // 生成验证码
//     let code = Math.random().toString().slice(-6);
    
//     if (!db) { // 当前email不存在，既没有给该email发送过验证码
//       await EmailModel.inster(email, code);
//     } else { // 当前email，已经发送了验证码
//       const startTime = new Date(db.createdAt).getTime();
//       const intervalTime = 1000 * 60 * 60; // 过期时间
//       if (new Date().getTime() - startTime > intervalTime ){
//         await EmailModel.updateCode(email, code);
//       }else{
//         code = db.email_code;
//       }
//     }
//     const subject = "账号注册";
//     const text = "text";
//     const html = `<div><span>验证码：</span><b>${code}</b></div>`;
//     await Email.SendEmail(email, subject, text, html);
//     return { message: '邮件已发送' };
//   }

//   static async SendEmail(email, subject, text, html) {
//     return await transporter.sendMail({
//       from: emailConfig.auth.user, // 发送者邮箱地址
//       to: email,                   // 接收这邮箱地址
//       subject,                     // 邮件主题
//       html,                        // html模板
//       text                         // 文本内容
//     })
//   }
// }
// module.exports = Email;

module.exports = async function fn(email, code){
  let status = null
  await new Promise((resolve, reject) => {
      transporter.sendMail({
          from: '1297184665@qq.com',
          to: email, 
          subject: '网站账户注册验证码',
          html: `
          <p>网站账户注册验证码：</p>
      <span style="font-size: 18px; color: red">` + code + `</span>`

      }, function (err, info) {
          if (err) {
              status = 5
              console.log(err)
              reject()
          } else {
              status = 1
              console.log(info)
              resolve()
          }
      });
  })
  return status
}



