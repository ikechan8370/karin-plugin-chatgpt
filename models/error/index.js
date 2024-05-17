/**
 * Error classes for ChatGPTClient
 *
 * @class ChatGPTClientError
 * @author @ikechan8370
 * @since 1.0.0
 */
export class ChatGPTClientError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ChatGPTClientError'
  }
}
