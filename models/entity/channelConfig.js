/**
 * Channel configuration
 *
 * @class ChannelConfig
 * @author @ikechan8370
 * @since 1.0.0
 */
export class ChannelConfig {
  /**
   * 渠道类型
   * @type {ChannelType}
   */
  type

  /**
   * 代理
   * @type {string}
   */
  proxy


  /**
   * 最大重试次数
   * @type {number}
   */
  maxRetries = 3

  /**
   * Channel configuration
   * @param {ChannelType} type
   * @param {string} proxy
   * @param {number} maxRetries
   */
  constructor (type, proxy = '', maxRetries = 3) {
    this.type = type
    this.proxy = proxy
    this.maxRetries = maxRetries
  }
}

/**
 * OpenAI格式的渠道配置
 *
 * @class OpenAIChannelConfig
 * @extends ChannelConfig
 * @author @ikechan8370
 * @since 1.0.0
 */
export class OpenAIChannelConfig extends ChannelConfig {
  /**
   *
   * @param {{
   *   apiBaseUrl: string,
   *   apiKey: string,
   *   model: OpenAIModel?,
   *   temperature: number?,
   *   topP: number?,
   *   stream: boolean?,
   *   maxTokens: number?,
   *   proxy: string?,
   *   maxRetries: number?
   * }} options
   */
  constructor (options) {
    super('openai', options.proxy, options.maxRetries)
    this.apiKey = options.apiKey
    options.model && (this.model = options.model)
    options.temperature && (this.temperature = options.temperature)
    this.topP = options.topP
    options.stream && (this.stream = options.stream)
    this.maxTokens = options.maxTokens
  }

  /**
   * API key
   * @type {string}
   */
  apiKey

  /**
   * API base URL
   * @type {string}
   */
  apiBaseUrl = 'https://api.openai.com'

  /**
   * 是否开启debug
   * @type {boolean}
   */
  debug

  /**
   * @typedef {'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo-preview' | 'gpt-4-turbo' | 'gpt-4-vision-preview' | 'gpt-4-vision' | 'gpt-4-32k' | 'gpt-3.5-turbo-16k' | string } OpenAIModel
   */

  /**
   * 模型
   * @type {OpenAIModel}
   */
  model = 'gpt-3.5-turbo'

  /**
   * 温度
   * @type {number}
   */
  temperature = 0.9

  /**
   * topP
   * @type {number}
   */
  topP

  /**
   * 是否开启流模式
   * @type {boolean}
   */
  stream = false

  /**
   * 最大token数
   * @type {number}
   */
  maxTokens
}
