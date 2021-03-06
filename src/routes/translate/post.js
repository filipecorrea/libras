/**
 * @swagger
 * path:
 *  /translate/{language}:
 *    post:
 *      summary: Insert translation
 *      tags: [Translate]
 *      parameters:
 *        - in: path
 *          name: language
 *          schema:
 *            type: string
 *          required: true
 *          description: Signed language
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Translation'
 *      responses:
 *        "200":
 *          description: Translation created
 */

const joi = require('joi')
const translations = require('src/controllers/translations')
const BadRequestError = require('src/errors/bad-request')

const schema = joi.object({
  params: {
    language: joi.string().required()
  },
  body: {
    signed: joi.string().required(),
    spoken: joi.string().required()
  }
}).unknown(true)

module.exports = (req, res, next) => {
  const { error, value } = schema.validate(req)

  if (error) throw new BadRequestError(error.message)

  translations.create(value.params.language, value.body.signed, value.body.spoken)
    .then(_ => { next(null, req, res) })
    .catch(error => next(error))
}
