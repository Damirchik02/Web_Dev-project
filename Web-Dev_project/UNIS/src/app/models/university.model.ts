export interface University {
  id: number;          // Уникальный идентификатор университета
  name: string;        // Название университета
  country: string;     // Страна расположения
  city: string;        // Город расположения
  description: string; // Описание университета
  faculties?: Faculty[]; // Список факультетов (опционально)
}

export interface Faculty {
  id: number;         // Уникальный идентификатор факультета
  name: string;       // Название факультета
  university?: number | University; // Связь с университетом (может быть ID или объектом)
  programs?: Program[]; // Список программ обучения (опционально)
}

export interface Program {
  id: number;        // Уникальный идентификатор программы
  name: string;      // Название программы
  duration: string;  // Продолжительность обучения (например, "4 года")
  cost: number;      // Стоимость обучения
  faculty: number;   // ID факультета, к которому относится программа
} 