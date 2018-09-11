import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import emailTemplate from './services/articleTemplate';

dotenv.config();

const baseURL = process.env.BASE_URL;

/**
 * @description class for sending email notification
 */
class articleNotification {
  /**
   * @description sends email notifications with sendgrid's API
   * @param {array} emails
   * @param {string} name
   * @param {string} slug
   * @returns {object} The body of the response message
   */
  static sendNotificationEmail(emails, name, slug) {
    try {
      sgMail.setApiKey(process.env.SENDGRID_KEY);

      const url = `${baseURL}/${slug}`;

      const msg = {
        to: emails,
        from: 'notifications@authorshaven.com',
        subject: 'Latest Articles based on who you follow',
        html: emailTemplate.articleTemplate(url, name),
        asm: {
          groupId: 28241
        },
      };
      return sgMail.send(msg);
    } catch (error) {
      return error;
    }
  }
}
export default articleNotification;
