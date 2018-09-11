import { expect } from 'chai';
import calculateTimeToRead from '../../utils/calculateTimeToRead';

describe('calculateTimeToRead', () => {
  it('should calculate time to read an article', () => {
    const article = {
      body: 'Some short article',
    };

    const timeToRead = calculateTimeToRead(article);
    expect(timeToRead).to.be.a('number');
  });
});
