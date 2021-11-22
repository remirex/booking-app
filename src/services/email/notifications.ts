import { Service, Inject } from 'typedi';

import { EmailTemplates } from '../../helpers/enums/enums';
import config from '../../config';
import { verifyUser } from './templates/verifyUser';
import { alreadyRegistered } from './templates/alreadyRegistered';

@Service()
export default class Notifications {
  constructor(@Inject('emailClient') private emailClient) {}

  private async sendEmail(to: string, subject: string, content: string) {
    const emailData = {
      from: config.emails.from,
      to: to,
      subject: subject,
      html: content,
    };

    await this.emailClient.sendMail(emailData);

    return { delivered: 1, status: 'ok' };
  }

  public sendTemplateEmail(to: string, subject: string, template: string, data) {
    //this.logger.info(`send template email to ${to}`);
    let content = '';
    switch (template) {
      case EmailTemplates.VERIFY_EMAIL:
        content = verifyUser(data);
        break;
      case EmailTemplates.ALREADY_REGISTERED:
        content = alreadyRegistered(data);
        break;
      case EmailTemplates.RESET_PASSWORD:
        //content = passwordResetEmail(data);
        break;
      default:
    }
    return this.sendEmail(to, subject, content);
  }
}
