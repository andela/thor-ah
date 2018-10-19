/**
 * Check if an array of reactions includes a reaction by a user
 *
 * @param {*} reactions
 * @param {*} userId
 *
 * @returns {bool} retrurns true/false
 */
const hasReaction = (reactions, userId) => reactions.some(
  reaction => reaction.userId === userId
);

export default hasReaction;
