import { initializeDatabase } from './db'

// Variável para controlar se a inicialização já foi feita
let isInitialized = false
let initializationPromise: Promise<boolean> | null = null

// Função para garantir que o banco seja inicializado apenas uma vez
export async function ensureDatabaseInitialized() {
  if (isInitialized) {
    return true
  }
  
  if (initializationPromise) {
    return initializationPromise
  }
  
  initializationPromise = initializeDatabase()
  
  try {
    const result = await initializationPromise
    isInitialized = result
    return result
  } catch (error) {
    console.error('Erro na inicialização do banco:', error)
    initializationPromise = null
    return false
  }
}

// Função para resetar o estado de inicialização (útil para testes)
export function resetInitializationState() {
  isInitialized = false
  initializationPromise = null
} 