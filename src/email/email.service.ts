import { Injectable, Logger } from '@nestjs/common';
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

  async userVerify(emailAddress: string, VerifyToken: string) {
    const frontUrl: string = process.env.FRONT_URL;

    const mailOptions: EmailOptions = {
      from: MAIL,
      to: emailAddress,
      subject: 'GCMS 가입 인증 메일',
      html: EmailHtml(`${frontUrl}/auth?token=${VerifyToken}`),
    };

    const result: { accepted: string[] } = await this.transporter.sendMail(
      mailOptions,
    );
    Logger.log(`Send mail to ${result.accepted[0]}`);
  }
}
