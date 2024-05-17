import { plugin, segment } from '#Karin'

export class hello extends plugin {
  constructor () {
    super({
      // 必选 插件名称
      name: 'hello',
      // 插件描述
      dsc: '发送你好回复hello',
      // 监听消息事件 默认message
      event: 'message',
      // 优先级
      priority: 5000,
      // 以下rule、task、button、handler均为可选，如键入，则必须为数组
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#aaa$',
          /** 执行方法 */
          fnc: 'hello',
          //  是否显示操作日志 true=是 false=否
          log: true,
          // 权限 master,owner,admin,all
          permission: 'all'
        }
      ]
    })
  }

  async hello () {
    // 调用 this.reply 方法回复 hello 关于参数2，请看下文
    let g = await this.e.bot.GetGroupInfo(181986905)
    console.log(g)
    let fl = await this.e.bot.GetFriendList()
    this.reply(JSON.stringify(fl))
  }

  async taskHello () {
    console.log('hello')
  }

  async buttonTest () {
    // 构建一个连接按钮
    const data = segment.button({ link: 'https://www.baidu.com', text: '百度一下' })
    return {
      stop: true, // 停止循环，不再遍历后续按钮
      data
    }
  }

  async handlerMessage (e, args, reject) {
    // ...
  }
}
