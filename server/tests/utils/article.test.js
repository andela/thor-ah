import { expect } from 'chai';

import articleNotification from '../../utils/articleNotify';

describe('article notification utility', () => {
  it('should have a method: sendNotificationEmail', () => {
    expect(articleNotification.sendNotificationEmail).to.be.a('function');
  });
});

describe('articleNotification()', () => {
  const msg = {
    to: 'laurangift@gmail.co',
    from: 'notifications@authorshaven.com',
    subject: 'Latest Articles based on who you follow',
    html: 'This is a test'
  };
  it('should have property to, from, subject, html', () => {
    expect(msg).to.have.a.property('to');
    expect(msg).to.have.a.property('from');
    expect(msg).to.have.a.property('subject');
    expect(msg).to.have.a.property('html');
  });
  it('should return a promise when the email is sent', () => {
    const result = articleNotification.sendNotificationEmail(msg);
    expect(result).to.be.a('promise');
  });
});
