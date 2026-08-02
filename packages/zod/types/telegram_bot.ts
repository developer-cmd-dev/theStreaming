export interface TelegramUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    username?: string;
    language_code?: string;
}

export interface TelegramChat {
    id: number;
    first_name?: string;
    username?: string;
    type: 'private' | 'group' | 'supergroup' | 'channel';
}

export interface TelegramMessage {
    message_id: number;
    from: TelegramUser;
    chat: TelegramChat;
    date: number;
    reply_to_message?:ReplyToMessage;
    text?: string;
}

export interface ReplyToMessage{
    message_id: number,
    from: object[],
    chat: object[],
    date: number,
    text: string,
}

export interface TelegramUpdate {
    update_id: number;
    message?: TelegramMessage;
}


export interface SendBotMessage{
    chat_id:number,
    text:string,
    reply_markup?:ReplyMarkup

}

interface ReplyMarkup{

        force_reply: boolean,
        input_field_placeholder: string,

}

