import { expect } from 'chai';

import commentNotification from '../../utils/commentNotify';

describe('article notification utility', () => {
  it('should have a method: sendNotificationEmail', () => {
    expect(commentNotification.sendNotificationEmail).to.be.a('function');
  });
});

describe('articleNotification()', () => {
  const msg = {
    to: 'laurangift@gmail.com',
    from: 'notifications@authorshaven.com',
    subject: 'New Reply from Author\'s Haven!',
    html: 'This is a test'
  };
  it('should have property to, from, subject, html', () => {
    expect(msg).to.have.a.property('to');
    expect(msg).to.have.a.property('from');
    expect(msg).to.have.a.property('subject');
    expect(msg).to.have.a.property('html');
  });
  it('should return a promise when the email is sent', () => {
    const result = commentNotification.sendNotificationEmail(msg);
    expect(result).to.be.a('promise');
  });
});
