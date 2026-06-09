export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  timestamp: Date
  agentId: string
}

export interface AgentChats {
  [agentId: string]: Chat[]
}

const STORAGE_KEY = 'agentChats'

/**
 * Save a chat conversation for a specific agent
 */
export function saveChat(agentId: string, chatId: string, messages: Message[], title?: string): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const agentChats: AgentChats = stored ? JSON.parse(stored) : {}
    
    if (!agentChats[agentId]) {
      agentChats[agentId] = []
    }
    
    // Find existing chat or create new one
    const existingIndex = agentChats[agentId].findIndex(chat => chat.id === chatId)
    
    // If chat exists, preserve original title but update timestamp to show last activity
    let chatTitle: string
    let chatTimestamp: Date
    
    if (existingIndex >= 0) {
      // Preserve original title from existing chat, but update timestamp to show last activity
      const existingChat = agentChats[agentId][existingIndex]
      chatTitle = title || existingChat.title || messages.find(m => m.role === 'user')?.content.substring(0, 50) || 'New Chat'
      // Update timestamp to show when conversation was last active
      chatTimestamp = new Date()
    } else {
      // Generate title from first user message for new chat
      chatTitle = title || messages.find(m => m.role === 'user')?.content.substring(0, 50) || 'New Chat'
      chatTimestamp = new Date()
    }
    
    const chatData: Chat = {
      id: chatId,
      title: chatTitle,
      messages: messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
      })),
      timestamp: chatTimestamp,
      agentId
    }
    
    if (existingIndex >= 0) {
      // Update existing chat - preserve title and original timestamp
      agentChats[agentId][existingIndex] = chatData
    } else {
      // Add new chat (prepend to show newest first)
      agentChats[agentId].unshift(chatData)
    }
    
    // Limit to last 50 chats per agent to prevent localStorage quota issues
    if (agentChats[agentId].length > 50) {
      agentChats[agentId] = agentChats[agentId].slice(0, 50)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agentChats))
  } catch (error) {
    console.error('Error saving chat:', error)
    // Handle quota exceeded or other storage errors
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      // Try to clean up old chats
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const agentChats: AgentChats = JSON.parse(stored)
        // Remove oldest chats for this agent
        if (agentChats[agentId] && agentChats[agentId].length > 10) {
          agentChats[agentId] = agentChats[agentId].slice(0, 10)
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(agentChats))
          } catch (e) {
            console.error('Failed to clean up old chats:', e)
          }
        }
      }
    }
  }
}

/**
 * Load a specific chat by agentId and chatId
 */
export function loadChat(agentId: string, chatId: string): Chat | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    
    const agentChats: AgentChats = JSON.parse(stored)
    if (!agentChats[agentId]) return null
    
    const chat = agentChats[agentId].find(c => c.id === chatId)
    if (!chat) return null
    
    // Convert timestamp strings back to Date objects
    return {
      ...chat,
      messages: chat.messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
      })),
      timestamp: chat.timestamp instanceof Date ? chat.timestamp : new Date(chat.timestamp)
    }
  } catch (error) {
    console.error('Error loading chat:', error)
    return null
  }
}

/**
 * Load all chats for a specific agent
 */
export function loadAllChats(agentId: string): Chat[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const agentChats: AgentChats = JSON.parse(stored)
    if (!agentChats[agentId]) return []
    
    // Convert timestamp strings back to Date objects
    return agentChats[agentId].map(chat => ({
      ...chat,
      messages: chat.messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
      })),
      timestamp: chat.timestamp instanceof Date ? chat.timestamp : new Date(chat.timestamp)
    }))
  } catch (error) {
    console.error('Error loading all chats:', error)
    return []
  }
}

/**
 * Load all chats from all agents (for analytics)
 */
export function loadAllChatsFromAllAgents(): Chat[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const agentChats: AgentChats = JSON.parse(stored)
    const allChats: Chat[] = []
    
    Object.keys(agentChats).forEach(agentId => {
      agentChats[agentId].forEach(chat => {
        allChats.push({
          ...chat,
          messages: chat.messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
          })),
          timestamp: chat.timestamp instanceof Date ? chat.timestamp : new Date(chat.timestamp)
        })
      })
    })
    
    // Sort by timestamp, newest first
    return allChats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  } catch (error) {
    console.error('Error loading all chats:', error)
    return []
  }
}

/**
 * Delete a specific chat
 */
export function deleteChat(agentId: string, chatId: string): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return false
    
    const agentChats: AgentChats = JSON.parse(stored)
    if (!agentChats[agentId]) return false
    
    const initialLength = agentChats[agentId].length
    agentChats[agentId] = agentChats[agentId].filter(chat => chat.id !== chatId)
    
    if (agentChats[agentId].length < initialLength) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(agentChats))
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error deleting chat:', error)
    return false
  }
}

/**
 * Delete all chats for a specific agent
 */
export function deleteAllChatsForAgent(agentId: string): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return false
    
    const agentChats: AgentChats = JSON.parse(stored)
    if (!agentChats[agentId]) return false
    
    delete agentChats[agentId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agentChats))
    return true
  } catch (error) {
    console.error('Error deleting all chats for agent:', error)
    return false
  }
}

/**
 * Generate a unique chat ID
 */
export function generateChatId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
