import { Injectable } from '@nestjs/common';
import { emailTemplateTypes } from './entities/templates.enum';
import { createTransport, Transporter } from 'nodemailer';
import { join } from 'path';
import { readFileSync } from 'fs';
import { compile } from 'handlebars';

@Injectable()
export class MessageService {
  private transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  private async compileTemplate(
    templateName: string,
    context: { [key: string]: string },
  ): Promise<string> {
    const filePath = join(
      __dirname,
      '..',
      'mail',
      'templates',
      `${templateName}.hbs`,
    );
    const source = readFileSync(filePath, 'utf-8');
    const template = compile(source);
    return template(context);
  }

  async sendMail(
    to: string,
    templateName: emailTemplateTypes,
    context: { [key: string]: string },
  ) {
    const html = await this.compileTemplate(templateName, context);
    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject: 'New Order Created',
      html,
    });
  }
}
