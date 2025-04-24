export interface ConsultationRequest {
  id?: number;       // Уникальный идентификатор заявки (опционально при создании)
  message: string;   // Сообщение пользователя с вопросом
  date: Date;        // Дата создания заявки
  status: 'pending' | 'completed' | 'rejected';  // Статус заявки: ожидает, выполнена, отклонена
  userId: number;    // ID пользователя, создавшего заявку
  user?: {           // Информация о пользователе (опционально, может прийти с сервера)
    id: number;
    username: string;
  };
} 