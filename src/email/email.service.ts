import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private Google = new google.auth.OAuth2(
    this.configService.get('CLIENT_ID'),
    this.configService.get('CLIENT_PW'),
  );

  constructor(private configService: ConfigService) {
    this.Google.setCredentials({
      refresh_token: this.configService.get('REFRESH'),
    });
  }

  async userVerify(emailAddress: string, code: string) {
    const accessToken = await this.Google.getAccessToken();
    const transporter = this.getTransporter(accessToken);
    const mailOptions = {
      from: this.configService.get('CLIENT_EMAIL'),
      to: emailAddress,
      subject: 'Hello, GSM test 메일',
      html: `${code}`,
    };

    const result = await transporter.sendMail(mailOptions);
    Logger.log(`Send mail to ${result.accepted[0]}`);
  }

  private getTransporter(accessToken: any) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('CLIENT_EMAIL'),
        clientId: this.configService.get('CLIENT_ID'),
        clientSecret: this.configService.get('CLIENT_PW'),
        refreshToken: this.configService.get('REFRESH'),
        accessToken,
      },
    });
  }
}
