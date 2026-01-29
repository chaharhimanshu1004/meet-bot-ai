export type MeetBotResponse = {
    success: boolean
    message: string
    data?: any
}

export interface MeetBotRequest {
    action: string
    parameters: Record<string, any>
}

export interface User {
    id: string
    name: string
    email: string
}

export interface Meeting {
    id: string
    title: string
    participants: User[]
    startTime: Date
    endTime: Date
}
