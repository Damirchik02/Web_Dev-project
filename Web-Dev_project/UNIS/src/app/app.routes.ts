import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UniversitiesComponent } from './components/universities/universities.component';
import { UniversityDetailComponent } from './components/university-detail/university-detail.component';
import { LoginComponent } from './components/login/login.component';
import { ConsultationComponent } from './components/consultation/consultation.component';
import { DataFlowTestComponent } from './components/data-flow-test/data-flow-test.component';
import { AdminConsultationsComponent } from './components/admin/admin-consultations.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Главная страница
  { path: 'login', component: LoginComponent },  // Страница входа в систему
  { path: 'universities', component: UniversitiesComponent },  // Список всех университетов
  { path: 'universities/:id', component: UniversityDetailComponent },  // Детальная информация об университете с указанным ID
  { path: 'consultation', component: ConsultationComponent },  // Страница для отправки заявки на консультацию
  { path: 'data-flow-test', component: DataFlowTestComponent },  // Тестовая страница для проверки потока данных
  { path: 'admin/consultations', component: AdminConsultationsComponent },  // Административная панель для управления заявками на консультацию
  { path: '**', redirectTo: '' }  // Перенаправление на главную страницу при неизвестном маршруте
];
