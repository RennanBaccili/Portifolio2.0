import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
  computed,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector.component';

interface ProjectUiSection {
  id: string;
  name: string;
  imageLabel: string;
  imageSrc?: string;
  description1: string;
  description2: string;
}

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ThemeToggleComponent, LanguageSelectorComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private translation = inject(TranslationService);

  @ViewChildren('flowSlide') private flowSlides!: QueryList<ElementRef<HTMLElement>>;
  private intersectionObserver?: IntersectionObserver;

  projectId = signal<string | null>(null);
  fullscreenImageSrc = signal<string | null>(null);

  t = this.translation.t;

  architectureSections = computed(() => {
    const id = this.projectId();
    if (id === 'lifeplus') {
      return this.t().projectDetail.lifeplus.slides;
    }
    return [];
  });

  uiSections = computed<ProjectUiSection[]>(() => {
    const lang = this.translation.language();

    if (lang === 'en') {
      return [
        {
          id: 'LoginView',
          name: 'LoginView',
          imageLabel: '{LoginView}',
          imageSrc: '/life-plus/login.png',
          description1:
            'The Login screen is the entry point of LifePlus. Here, the user accesses the system using email and password, with fully customized messages in Portuguese for errors and validations. The layout was designed to be simple and straightforward, with the form centered on the page and no distractions, focusing on secure authentication via JWT in the backend.',
          description2:
            'After a successful login, the user is automatically redirected to the appointments list, with the session authenticated and the JWT token stored in the application session. The screen also offers a direct link to the registration page, making user onboarding easier.'
        },
        {
          id: 'RegisterView',
          name: 'RegisterView',
          imageLabel: '{RegisterView}',
          imageSrc: '/life-plus/register.png',
          description1:
            'The Registration screen allows new users to sign up to LifePlus in a guided and validated way. It reuses the same personal data form from the application, but in creation mode, collecting information such as name, CPF, contact details and access credentials. All the process is validated on the backend, including rules for password, email and CPF.',
          description2:
            'Once the registration is complete, the system assigns the proper role to the new user, persists the record in the database and performs an automatic login, redirecting directly to the appointments page. Errors are shown in friendly notifications, clearly explaining what needs to be fixed (for example, invalid or already registered CPF).'
        },
        {
          id: 'PatientsView',
          name: 'PatientsView',
          imageLabel: '{PatientsView}',
          imageSrc: '/life-plus/patients.png',
          description1:
            'The Patients view presents a complete list of all patients registered in the system. The table shows key information such as first name, last name, phone number, formatted CPF and person type, with a name filter field to help searching in larger datasets.',
          description2:
            'In addition to viewing data, the user can access each patient’s individual schedule through a calendar button in the grid itself. When clicking it, a schedule dialog opens already filtered to that patient’s appointments, allowing the professional to quickly schedule, review and organize consultations.'
        },
        {
          id: 'AppoitmentsView',
          name: 'AppoitmentsView',
          imageLabel: '{AppoitmentsView}',
          imageSrc: '/life-plus/appointments.png',
          description1:
            'The Appointments view is the central panel for following up consultations. It lists all appointments related to the logged-in user, showing doctor, patient, start date/time, end date/time and appointment status. A filter field by patient name helps easily find specific consultations.',
          description2:
            'One of the highlights of this screen is the Teleconsultation column, with a button that indicates whether it is possible or not to start an online call for that appointment. When the consultation is in a valid state for teleconsultation, the button is enabled and, when clicked, the system confirms with the user and redirects directly to the teleconsultation room for that specific appointment.'
        },
        {
          id: 'CalendarView',
          name: 'CalendarView',
          imageLabel: '{CalendarView}',
          imageSrc: '/life-plus/my-schedule.png',
          description1:
            'The My Schedule view provides a monthly calendar view using the FullCalendar component. In it, the professional can see all appointments distributed over the month, with period navigation and direct visual interaction with events.',
          description2:
            'The user can click on empty spaces in the calendar to create new appointments or click on existing events to view or edit details. All calendar navigation is integrated with its own toolbar, allowing the user to control the current view and reload data smoothly without leaving the screen.'
        },
        {
          id: 'DoctorView',
          name: 'DoctorView',
          imageLabel: '{DoctorView}',
          imageSrc: '/life-plus/doctor.png',
          description1:
            'The Doctors List view displays all professionals with doctor role registered in the system. The grid shows first name, last name, phone number and the person’s role, with a name filter field to quickly find a specific doctor.',
          description2:
            'Each row has a Schedule button that opens a dialog with that specific doctor’s calendar. This allows reception or other professionals to check the doctor’s availability, see occupied time slots and manage appointments directly from this list.'
        },
        {
          id: 'TeleConsultationView',
          name: 'TeleConsultationView',
          imageLabel: '{TeleConsultationView}',
          imageSrc: '/life-plus/telefeconsutation.png',
          description1:
            'The Teleconsultation view is where the online consultation actually happens. It combines real-time video, chat and access to the medical record in a single experience, organized into sections: a header with appointment information, a video area for the WebRTC call, camera/microphone controls and a tab manager with chat and medical record.',
          description2:
            'When the user enters the teleconsultation from an appointment, the view loads the appointment data and initializes all necessary components. The professional conducts the consultation while seeing the patient on video, using chat when needed and consulting or filling in medical information without leaving the screen.'
        },
        {
          id: 'ChatView',
          name: 'ChatView',
          imageLabel: '{ChatView}',
          imageSrc: '/life-plus/chat.png',
          description1:
            'The Chat view provides an experience similar to modern messaging apps. On the left, a conversation list shows all people the user can communicate with. When selecting a contact, the main area on the right is filled with a private chat between the current user and that contact.',
          description2:
            'The chat component is integrated with the Chat microservice via WebSocket/STOMP, enabling real-time message exchange. This view is designed both for conversations between doctors and patients and for internal communication between healthcare professionals, and can even be used in parallel with the teleconsultation.'
        }
      ];
    }

    return [
      {
        id: 'LoginView',
        name: 'LoginView',
        imageLabel: '{LoginView}',
        imageSrc: '/life-plus/login.png',
        description1:
          'A tela de Login é a porta de entrada do LifePlus. Nela, o usuário acessa o sistema usando e‑mail e senha, com mensagens totalmente personalizadas em português para erros e validações. O layout foi pensado para ser simples e direto, com o formulário centralizado na página e sem distrações, focando na autenticação segura via JWT no backend.',
        description2:
          'Depois do login bem-sucedido, o usuário é redirecionado automaticamente para a lista de agendamentos, já com a sessão autenticada e o token JWT armazenado na sessão da aplicação. A tela também oferece um link direto para o cadastro, facilitando o onboarding de novos usuários.'
      },
      {
        id: 'RegisterView',
        name: 'RegisterView',
        imageLabel: '{RegisterView}',
        imageSrc: '/life-plus/register.png',
        description1:
          'A tela de Registro permite que novos usuários se cadastrem no LifePlus de forma guiada e validada. Ela utiliza o mesmo formulário de dados pessoais da aplicação, mas em modo de criação, coletando informações como nome, CPF, contato e credenciais de acesso. Todo o processo é validado no backend, incluindo regras de senha, e‑mail e CPF.',
        description2:
          'Ao concluir o cadastro, o sistema já define o novo usuário com a role adequada, realiza o registro no banco e faz o login automático, redirecionando direto para a página de agendamentos. Erros são exibidos em notificações amigáveis, explicando claramente o que precisa ser corrigido (por exemplo, CPF inválido ou já cadastrado).'
      },
      {
        id: 'PatientsView',
        name: 'PatientsView',
        imageLabel: '{PatientsView}',
        imageSrc: '/life-plus/patients.png',
        description1:
          'A view de Pacientes apresenta uma lista completa dos pacientes cadastrados no sistema. A tabela exibe informações chave como nome, sobrenome, telefone, CPF formatado e o tipo de pessoa, com um campo de filtro por nome para facilitar a busca em bases maiores.',
        description2:
          'Além de visualizar os dados, o usuário consegue acessar a agenda individual de cada paciente através de um botão de calendário na própria grid. Ao clicar, um diálogo de agenda é aberto já filtrando os compromissos daquele paciente, permitindo ao profissional agendar, revisar e organizar consultas de forma rápida.'
      },
      {
        id: 'AppoitmentsView',
        name: 'AppoitmentsView',
        imageLabel: '{AppoitmentsView}',
        imageSrc: '/life-plus/appointments.png',
        description1:
          'A view de Agendamentos é o painel central de acompanhamento das consultas. Ela lista todos os compromissos relacionados ao usuário logado, mostrando médico, paciente, data/hora inicial, data/hora final e status da consulta. Um campo de filtro por nome do paciente ajuda a encontrar facilmente consultas específicas.',
        description2:
          'Um dos destaques dessa tela é a coluna de Teleconsulta, com um botão que indica se é possível ou não iniciar uma chamada online para aquele agendamento. Quando a consulta está em um estado válido para teleconsulta, o botão fica habilitado e, ao clicar, o sistema confirma com o usuário e o redireciona diretamente para a sala de teleconsulta daquela consulta específica.'
      },
      {
        id: 'CalendarView',
        name: 'CalendarView',
        imageLabel: '{CalendarView}',
        imageSrc: '/life-plus/my-schedule.png',
        description1:
          'A view Minha Agenda traz uma visão de calendário mensal usando o componente FullCalendar. Nela, o profissional consegue ver todos os compromissos distribuídos ao longo do mês, com navegação por período e interação visual direta com os eventos.',
        description2:
          'O usuário pode clicar em espaços vazios do calendário para criar novos agendamentos ou clicar em eventos existentes para visualizar ou editar os detalhes. Toda a navegação do calendário é integrada com um toolbar próprio, permitindo controlar a visão e recarregar os dados de forma fluida, sem sair da tela.'
      },
      {
        id: 'DoctorView',
        name: 'DoctorView',
        imageLabel: '{DoctorView}',
        imageSrc: '/life-plus/doctor.png',
        description1:
          'A view de Lista de Médicos exibe todos os profissionais com perfil de médico cadastrados no sistema. A grid mostra nome, sobrenome, telefone e o papel da pessoa, com um campo de filtro por nome para localizar rapidamente um médico específico.',
        description2:
          'Cada linha possui um botão de Agenda, que abre um diálogo com o calendário daquele médico em particular. Isso permite que a recepção ou outros profissionais consultem a disponibilidade do médico, vejam seus horários ocupados e gerenciem agendamentos diretamente a partir dessa lista.'
      },
      {
        id: 'TeleConsultationView',
        name: 'TeleConsultationView',
        imageLabel: '{TeleConsultationView}',
        imageSrc: '/life-plus/telefeconsutation.png',
        description1:
          'A view de Teleconsulta é onde a consulta online acontece de fato. Ela combina vídeo em tempo real, chat e acesso ao prontuário em uma única experiência, organizada por seções: um cabeçalho com informações da consulta, uma área de vídeo para a chamada WebRTC, controles de câmera/microfone e um gerenciador de abas com chat e prontuário.',
        description2:
          'Quando o usuário entra na teleconsulta a partir de um agendamento, a view carrega os dados da consulta e inicializa todos os componentes necessários. O profissional conduz a consulta olhando o paciente em vídeo, conversando pelo chat quando necessário e consultando ou preenchendo informações médicas sem sair da tela.'
      },
      {
        id: 'ChatView',
        name: 'ChatView',
        imageLabel: '{ChatView}',
        imageSrc: '/life-plus/chat.png',
        description1:
          'A view de Chat traz uma experiência semelhante a aplicativos de mensagens modernos. À esquerda, uma lista de conversas mostra todas as pessoas com quem o usuário pode se comunicar. Ao selecionar um contato, a área principal à direita é preenchida com um chat privado entre o usuário atual e aquele contato.',
        description2:
          'O componente de chat é integrado ao microserviço de Chat via WebSocket/STOMP, permitindo troca de mensagens em tempo real. Essa view é pensada tanto para conversas entre médicos e pacientes quanto para comunicação interna entre profissionais de saúde, inclusive podendo ser utilizada em paralelo com a teleconsulta.'
      }
    ];
  });

  title = computed(() => {
    const id = this.projectId();
    if (id === 'lifeplus') return this.t().projectDetail.lifeplus.title;
    return '';
  });

  subtitle = computed(() => {
    const id = this.projectId();
    if (id === 'lifeplus') return this.t().projectDetail.lifeplus.subtitle;
    return '';
  });

  openImageFullscreen(src: string): void {
    this.fullscreenImageSrc.set(src);
  }

  closeFullscreen(): void {
    this.fullscreenImageSrc.set(null);
  }

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.projectId.set(params.get('id'));
    });
  }

  ngAfterViewInit(): void {
    if (!this.flowSlides || this.flowSlides.length === 0) {
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      this.flowSlides.forEach(slide => {
        slide.nativeElement.classList.add('project-flow__slide--visible');
      });
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            element.classList.add('project-flow__slide--visible');
            this.intersectionObserver?.unobserve(element);
          }
        });
      },
      {
        threshold: 0.3
      }
    );

    this.flowSlides.forEach(slide => {
      this.intersectionObserver?.observe(slide.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }
}
