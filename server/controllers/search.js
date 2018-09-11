import { Article, User, Tag } from '../models';

/**
 * article search class
 */
class Search {
  /**
     * @param {tag} tag
     * @return {List} tags
     * @description splits space or comma separated tags string into an array of tags
     */
  static tokenize(tag) {
    const tags = tag.split(' ').map(tg => tg.replace(/,+/g, ''));
    return tags;
  }

  /**
     * @param {list} tag
     * @param {object} res
     * @param {object} next
     * @return {object} jsonResponse
     */
  static byTags(tag, res, next) {
    // treats each word as separate tag
    const tags = Search.tokenize(tag);

    Tag.findAll({
      where: {
        $or: [
          {
            tag: tags
          }
        ]
      },
      include:
          [{
            model: Article,
            as: 'articles',
            through: {
              attributes: []
            },
            include: [{
              model: User,
              as: 'author',
              attributes: ['username', 'email', 'bio', 'image']
            },
            {
              model: Tag,
              as: 'tags',
              attributes: ['tag'],
              through: {
                attributes: [],
              }
            }
            ]
          }
          ],
      attributes: ['id', 'tag']
    }).then(articles => res.status(200).json({
      status: 'success',
      articles
    })).catch(next);
  }

  /**
     * @param {list} keywords
     * @param {object} res
     * @param {object} next
     * @return {object} jsonResponse
     */
  static byKeywords(keywords, res, next) {
    Article.findAll({
      where: {
        $or: [
          {
            title: { like: `%${keywords}%` }
          },
          {
            description: { like: `%${keywords}%` }
          }
        ]
      },
      include: [{
        model: User,
        as: 'author',
        attributes: ['username', 'email', 'bio', 'image']
      },
      {
        model: Tag,
        as: 'tags',
        attributes: ['tag'],
        through: {
          attributes: [],
        }
      }
      ]
    }).then(articles => res.status(200).json({
      status: 'success',
      articles
    })).catch(next);
  }

  /**
     * @param {String} author
     * @param {object} res
     * @param {object} next
     * @return {object} jsonResponse
     */
  static byAuthor(author, res, next) {
    User.findAll({
      where: {
        $or: [
          {
            username: { like: `%${author}%` }
          },
          {
            firstName: { like: `%${author}%` }
          },
          {
            lastName: { like: `%${author}%` }
          }
        ]
      },
      include:
            [{
              model: Article,
              as: 'authored',

              include: [{
                model: Tag,
                as: 'tags',
                attributes: ['tag'],
                through: {
                  attributes: [],
                }
              },
              {
                model: User,
                as: 'author',
                attributes: ['username', 'email', 'bio', 'image']
              }
              ]
            }],
      attributes: ['id', 'username']
    }).then(articles => res.status(200).json({
      status: 'success',
      articles
    })).catch(next);
  }
}

export default Search;
