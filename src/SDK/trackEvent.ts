import Instance from "../api/axios";


interface sendMessage {
    userid?: string;
    eventType?: string;
    errorType?: string | Event;
    timestamp: number;
    event_data?: {
      elementText: string | null;
      elementTag: string;
    };
    data?: {
        source?: string | undefined;
        lineno?: number | undefined;
        colno?: number | undefined;
        error?: Error | undefined;
        stack?: string | null;
        message?: string | null;
        page_url?: string;
    }
    page_url?: string;

  }
interface TrackerConfig {
    serverUrl: string;
    batchSize: number; // 上报的事件数量
}

// 定义上报类

class Tracker {
    private queue:sendMessage[] = [];
    private config: TrackerConfig

    constructor(config: TrackerConfig) {
        this.config = config
    }


    // 添加到事件队列
    public track(eventData: sendMessage) {
        const event = eventData
        this.queue.push(event)

        // 如果上报的事件数量达到了 batchSize，就立即上报
        if (this.config.batchSize && this.queue.length >= this.config.batchSize) {
            this.flush()
        }

        if (this.queue.length > 0) {

            // 则每隔 十秒钟 上报一次，以防埋点数量不够导致看板没有数据
            setInterval(() => {
                this.flush()
            }, 10000)
        }
        // 在页面卸载前，强制上报所有数据
        window.addEventListener('beforeunload', () => {
            if (this.queue.length > 0) {
                this.flush()
                console.log('页面卸载前，强制上报所有数据')
            }
        })
    }

    // 上报事件函数
    private async flush() {
        if (this.queue.length === 0) {
            return
        }
        const toSendEvent = this.queue.slice() // 复制当前队列
        this.queue = [] // 清空队列

        // 发送事件到服务器
        try {
            await Instance.post(this.config.serverUrl, toSendEvent)
            console.log('上报事件成功', toSendEvent)

        } catch (error) {
            console.error('上报事件失败', error)
            // 如果上传失败，将事件重新添加到队列中
            this.queue.unshift(...toSendEvent)
        }
    }
}

export default Tracker