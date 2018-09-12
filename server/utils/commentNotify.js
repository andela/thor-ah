import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import emailTemplate from './services/commentTemplate';

dotenv.config();

const baseURL = process.env.BASE_URL;

/**
 * @description class for sending email notification
 */
class commentNotification {
  /**
   * @description sends email notifications with sendgrid's API
   * @param {array} emails
   * @param {string} slug
   * @returns {object} The body of the response message
   */
  static sendNotificationEmail(emails, slug) {
    try {
      sgMail.setApiKey(process.env.SENDGRID_KEY);

      const link = `${baseURL}/${slug}/comments`;
      const msg = {
        to: emails,
        from: 'notifications@authorshaven.com',
        subject: 'New Reply from Author\'s Haven!',
        html: emailTemplate.commentTemplate(link),
        asm: {
          groupId: 28262
        },
      };
      return sgMail.sendMultiple(msg);
    } catch (error) {
      return error;
    }
  }
}
export default commentNotification;
