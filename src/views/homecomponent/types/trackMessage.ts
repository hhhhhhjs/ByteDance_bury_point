interface sendMessage {
    userid: string;
    eventType: string;
    timestamp: number;
    event_type?: string;
    event_data: {
      elementText: string | null;
      elementTag: string;
    };
    page_url: string;
  }

  export type {
    sendMessage
  }