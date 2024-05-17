/**
 * Abstract class for clients
 *
 * @class AbstractClient
 * @author @ikechan8370
 * @since 1.0.0
 */
export class AbstractClient {
  /**
   * create a new client
   * @param {KarinMessage} e
   * @param {string} userId
   * @param {GetMessageById} getMessageById
   * @param {UpsertMessage} upsertMessage
   * @param {DeleteMessageById} deleteMessageById
   */
  constructor (e, userId, getMessageById, upsertMessage, deleteMessageById) {
    this.supportFunction = false
    this.tools = []
    this.e = e
    this.getMessageById = getMessageById
    this.upsertMessage = upsertMessage
    this.deleteMessageById = deleteMessageById || (() => {
    })
    this.userId = userId
  }

  /**
   * @type {KarinMessage}
   */
  e

  /**
   * userId
   * @type {string}
   */
  userId

  /**
   * tools
   * @type {Array<AbstractTool>}
   */
  tools

  /**
   * 是否支持函数调用
   * @type {boolean}
   */
  supportFunction = false
  /**
   * @callback GetMessageById
   * @param {string} id - The ID of the message.
   * @returns {Promise<object>} The message.
   */

  /**
   * get a message according to the id. note that conversationId is not needed
   *
   * @type {GetMessageById}
   */
  getMessageById

  /**
   * @callback UpsertMessage
   * @param {Object} message - The message.
   * @returns {Promise<void>}
   */

  /**
   * insert or update a message with the id
   *
   * @type UpsertMessage
   */
  upsertMessage

  /**
   * @callback DeleteMessageById
   * @param {string} id - The id of the message.
   * @returns {Promise<void>}
   */

  /**
   * delete a message with the id
   *
   * @type DeleteMessageById
   */
  deleteMessageById

  /**
   * @typedef {{
   *   text: string,
   *   conversationId: string,
   *   parentMessageId: string,
   *   id: string,
   *   raw: *?
   * }} ChatResponse
   */

  /**
   * 发送带有历史记录的提示消息并返回响应消息。
   * 如果调用该函数，则在内部处理。
   * 重写此方法以实现发送和接收消息的逻辑。
   *
   * @param {string} msg - 要发送的消息。
   * @param {{conversationId: string?, parentMessageId: string?, stream: boolean?, onProgress: function?}} opt - 其他选项。可选字段：[conversationId, parentMessageId]。如果未设置，将使用随机 UUID。
   * @returns {Promise<ChatResponse>} - 一个 promise，解析为包含必需字段的对象：[text, conversationId, parentMessageId, id]。
   */
  // eslint-disable-next-line no-unused-vars
  async sendMessage (msg, opt = {}) {
    throw new Error('not implemented in abstract client')
  }

  /**
   * 获取用户和助手之间的聊天历史记录
   * 重写此方法以实现获取历史记录的逻辑。
   * 建议使用 Keyv 结合本地文件或 Redis。
   *
   * @param {string} userId 可选，例如 QQ 号码
   * @param {string?} parentMessageId 如果为空，则没有历史记录
   * @param {*?} opt 可选，其他选项
   * @returns {Promise<*[]>}
   */
  // eslint-disable-next-line no-unused-vars
  async getHistory (parentMessageId, userId = this.userId, opt = {}) {
    throw new Error('not implemented in abstract client')
  }

  /**
   * 销毁聊天历史记录
   * @param conversationId 聊天历史记录的 conversationId
   * @param opt 其他选项
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line no-unused-vars
  async destroyHistory (conversationId, opt = {}) {
    throw new Error('not implemented in abstract client')
  }

  /**
   * 增加tools
   * @param {[AbstractTool]} tools
   */
  addTools (tools) {
    if (!this.isSupportFunction) {
      throw new Error('function not supported')
    }
    if (!this.tools) {
      this.tools = []
    }
    this.tools.push(...tools)
  }

  getTools () {
    if (!this.isSupportFunction) {
      throw new Error('function not supported')
    }
    return this.tools || []
  }

  get isSupportFunction () {
    return this.supportFunction
  }
}
