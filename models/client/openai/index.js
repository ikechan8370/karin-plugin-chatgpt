import { AbstractClient } from '../client.js'
import OpenAI from 'openai'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { Bot } from '#Karin'

/**
 * OpenAI格式Client
 *
 * @class OpenAIClient
 * @extends AbstractClient
 * @author @ikechan8370
 * @since 1.0.0
 */
export class OpenAIClient extends AbstractClient {
  /**
   * OpenAI Config
   * @type {OpenAIChannelConfig}
   */
  config

  /**
   * @type {import('openai').OpenAI}
   * @private
   */
  _client

  /**
   * debug
   * @type {boolean}
   */
  debug = false

  /**
   *
   * @param {OpenAIChannelConfig} config
   * @param {KarinMessage} e
   * @param {string} userId
   * @param {GetMessageById} getMessageById
   * @param {UpsertMessage} upsertMessage
   * @param {DeleteMessageById} deleteMessageById
   */
  constructor (config, e, userId, getMessageById = null, upsertMessage = null, deleteMessageById = null) {
    super(e, userId, getMessageById, upsertMessage, deleteMessageById)
    this._client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.apiBaseUrl,
      httpAgent: config.proxy ? new HttpsProxyAgent(config.proxy) : undefined,
      maxRetries: config.maxRetries
    })
    this.config = config
  }

  /**
   * @override
   * @param {string} userId 可选，例如 QQ 号码
   * @param {string?} parentMessageId 如果为空，则没有历史记录
   * @param {*?} opt 可选，其他选项
   * @return {Promise<Array<import('openai/resources/chat').ChatCompletionMessageParam>>}
   */
  // eslint-disable-next-line no-unused-vars
  async getHistory (parentMessageId, userId = this.userId, opt = {}) {
    const history = []
    let cursor = parentMessageId
    if (!cursor) {
      return history
    }
    do {
      let parentMessage = await this.getMessageById(cursor)
      if (!parentMessage) {
        break
      } else {
        history.push(parentMessage)
        cursor = parentMessage.parentMessageId
        if (!cursor) {
          break
        }
      }
    } while (true)
    return history.reverse()
  }

  /**
   * @override
   * @param {string} msg - 要发送的消息。
   * @param {{conversationId: string?, parentMessageId: string?, stream: boolean?, onProgress: function?}} opt - 其他选项。可选字段：[conversationId, parentMessageId]。如果未设置，将使用随机 UUID。
   * @returns {Promise<ChatResponse>}
   */
  async sendMessage (msg, opt = {}) {
    let config = this.config
    !opt.conversationId && (opt.conversationId = crypto.randomUUID())
    /**
     * @type {Array<import('openai/resources/chat').ChatCompletionMessageParam>}
     */
    const history = opt.parentMessageId ? await this.getHistory(opt.parentMessageId) : []
    let thisMessage = {
      content: msg,
      role: 'user'
    }
    history.push(thisMessage)
    const chatCompletion = await this._client.chat.completions.create({
      model: config.model,
      temperature: config.temperature,
      top_p: config.topP,
      max_tokens: config.maxTokens,
      stream: opt.stream,
      messages: history,
      tools: this.supportFunction ? this.tools.map(tool => {
        return {
          type: 'function',
          function: tool
        }
      }) : []
    })
    let userMessageId = crypto.randomUUID()
    await this.upsertMessage(Object.assign(thisMessage, {
      id: userMessageId,
      conversationId: opt.conversationId
    }))
    let respMessage = chatCompletion.choices[0].message
    await this.upsertMessage(Object.assign(respMessage, {
      conversationId: opt.conversationId,
      id: chatCompletion.id
    }))
    if (respMessage.tool_calls?.length > 0) {
      let function_ = respMessage.tool_calls[0]
      let toolId = function_.id
      const { name, arguments: arguments_ } = function_.function
      let chosenTool = this.tools.find(t => t.name === name)
      /**
       * @type {import('openai/resources/chat').ChatCompletionToolMessageParam}
       */
      let functionResponse = {
        content: '',
        role: 'tool',
        tool_call_id: toolId
      }
      if (!chosenTool) {
        // 根本没有这个工具！
        functionResponse.content = `Error: Tool ${name} doesn't exist`
      } else {
        // execute function
        try {
          let groupInfo = await this.e.bot.GetGroupInfo(parseInt(this.e.group_id))
          let args = Object.assign(JSON.parse(arguments_), {
            isAdmin: this.e.isAdmin,
            isOwner: this.e.sender.uin === groupInfo.owner + '',
            sender: this.e.sender,
            mode: 'openai'
          })
          functionResponse.content = await chosenTool.func(args, this.e)
          if (this.debug) {
            logger.info(JSON.stringify(functionResponse.content))
          }
        } catch (err) {
          logger.error(err)
          functionResponse.content = `Error: Tool execute error: ${err.message}`

        }
      }
    }
    return {
      parentMessageId: userMessageId,
      id: chatCompletion.id,
      conversationId: opt.conversationId,
      text: respMessage.content,
      raw: respMessage
    }
  }
}
