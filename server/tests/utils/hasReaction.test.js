import { expect } from 'chai';
import hasReaction from '../../utils/hasReaction';

describe('hasReaction', () => {
  it('should return a boolean', () => {
    const result = hasReaction([], 1);
    expect(result).to.be.a('boolean');
  });

  it('should return true if user has reaction for the comment', () => {
    const reactions = [
      {
        userId: 1,
        reaction: 'liked'
      },
      {
        userId: 2,
        reaction: 'liked'
      },
      {
        userId: 3,
        reaction: 'liked'
      },
    ];
    const result = hasReaction(reactions, 3);
    expect(result).to.equal(true);
  });

  it('should return false if user has no reaction for the comment', () => {
    const reactions = [
      {
        userId: 1,
        reaction: 'liked'
      },
      {
        userId: 2,
        reaction: 'liked'
      },
      {
        userId: 3,
        reaction: 'liked'
      },
    ];
    const result = hasReaction(reactions, 5);
    expect(result).to.equal(false);
  });
});
