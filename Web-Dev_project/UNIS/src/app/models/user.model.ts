export interface User {
  id: number;           // Уникальный идентификатор пользователя
  username: string;     // Имя пользователя
  email?: string;       // Email пользователя (опционально)
  token: string;        // Токен авторизации для API-запросов
  isAuthenticated: boolean; // Флаг авторизации
} 