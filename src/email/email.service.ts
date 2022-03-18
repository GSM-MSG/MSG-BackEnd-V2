import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { EmailOptions } from 'src/types/EmailOptions';
import { EmailHtml } from 'src/lib/EmailHtml';
import { MAIL, PASS } from 'src/lib/EmailLib';

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'naver',
      host: 'smtp.naver.com',
      port: 587,
      auth: {
        user: MAIL,
        pass: PASS,
      },
      from: MAIL,
    });
  }

  async userVerify(emailAddress: string, signupVerifyToken: string) {
    const baseUrl: string = process.env.BASE_URL;
    const frontUrl: string = process.env.FRONT_URL;

    const mailOptions: EmailOptions = {
      from: MAIL,
      to: emailAddress,
      subject: 'GCMS 가입 인증 메일',
      html: EmailHtml(baseUrl, signupVerifyToken, frontUrl),
    };

    const result = await this.transporter.sendMail(mailOptions);
    console.log(result);
  }
}
