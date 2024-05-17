/**
 * @typedef {'openai' | 'gemini' | 'bing' | 'chatgpt' | 'qwen'} ChannelType 渠道类型
 */

import { OpenAIClient } from '../client/openai/index.js'
import { ChatGPTClientError } from '../error/index.js'

/**
 * 渠道
 *
 * @author @ikechan8370
 * @since 1.0.0
 */
export class LLMChannel {
  /**
   * 渠道类型
   * @type {ChannelType}
   */
  channelType

  /**
   * 渠道名称
   * @type {string}
   */
  channelName

  /**
   * 渠道配置
   * @type {ChannelConfig}
   */
  channelConfig

  /**
   * 获取渠道对应的client
   *
   * @param {KarinMessage} e
   * @param {string} userId
   * @return {AbstractClient}
   * @throws {ChatGPTClientError}
   */
  getClient (e, userId = e.user_id) {
    switch (this.channelName) {
      case 'openai':
        return new OpenAIClient(/** @type {OpenAIChannelConfig} */ this.channelConfig, e, userId)
      // case 'gemini':
      //   return new GeminiClient(this.channelConfig)
      // case 'bing':
      //   return new BingClient(this.channelConfig)
      // case 'chatgpt':
      //   return new ChatGPTClient(this.channelConfig)
      // case 'qwen':
      //   return new QwenClient(this.channelConfig)
      default:
        throw new ChatGPTClientError('不支持的渠道')
    }
  }
}
