import { ProjectDefinition } from '../project-content.model';

export const LIFEPLUS: ProjectDefinition = {
  id: 'lifeplus',
  icon: '🏥',
  stack: [
    'Java 21',
    'Spring Boot 3.x',
    'Spring Cloud Gateway',
    'Vaadin 24',
    'OAuth2 / JWT',
    'RabbitMQ',
    'WebRTC',
    'WebSocket / STOMP',
    'PostgreSQL'
  ],
  content: {
    pt: {
      name: 'LifePlus',
      tagline:
        'Sistema de gestão médica com teleconsulta — seis microsserviços Spring Boot com segurança centralizada e mensageria assíncrona.',
      subtitle:
        'Sistema de Gestão Médica com Teleconsulta — arquitetura de microsserviços em Spring Boot e Vaadin',
      role: 'Arquitetura e desenvolvimento full stack',
      summary:
        'Plataforma para gestão de consultas, agendamentos e teleconsulta por vídeo. O sistema é dividido em seis serviços independentes atrás de um API Gateway, com autenticação centralizada em um Authorization Server OAuth2, comunicação assíncrona via RabbitMQ e canais de tempo real via WebSocket e WebRTC.',
      architecture: [
        {
          title: 'Decomposição em serviços',
          content:
            'Seis serviços com responsabilidades isoladas: API Gateway (8080) como ponto único de entrada com roteamento e validação de JWT; OAuth2 Authorization Server (8090) para emissão de tokens; LifePlus (8082) com a UI Vaadin de agenda, prontuários e teleconsulta; Chat (8085) para mensageria em tempo real; Notification API (8083) para notificações e consumo de filas; e Spring Boot Admin (8081) para monitoramento de saúde e métricas dos demais.'
        },
        {
          title: 'Roteamento pelo Gateway',
          content:
            'Todo o tráfego entra pela porta 8080. As rotas /oauth/** vão para o Authorization Server, /notification/** para a Notification API e /app/** junto da raiz para a UI Vaadin. O Gateway valida o JWT antes de encaminhar, o que mantém a lógica de autenticação fora de cada serviço de negócio.'
        },
        {
          title: 'Segurança centralizada',
          content:
            'O Authorization Server implementa OAuth2 Client Credentials (RFC 6749) para comunicação máquina a máquina. O LifePlus obtém o token no Gateway e usa Bearer nas chamadas à Notification API. Concentrar a emissão e a validação de token em dois pontos evita espalhar regra de autenticação por todos os serviços.'
        },
        {
          title: 'Mensageria assíncrona',
          content:
            'O LifePlus publica eventos JSON na fila notification-queue. A Notification API consome com @RabbitListener e persiste a notificação. Uma segunda fila, notification-ui-update-queue, devolve o evento para atualizar a interface. O padrão Producer/Consumer desacopla o registro do prontuário da entrega da notificação — se a notificação falhar, a consulta não é perdida.'
        },
        {
          title: 'Tempo real',
          content:
            'O microsserviço de Chat expõe WebSocket com STOMP e endpoints REST para conversas e mensagens, com entidades Chat e Message em JPA. A teleconsulta usa WebRTC para o vídeo ponto a ponto, com o chat rodando em paralelo na mesma tela.'
        },
        {
          title: 'Domínio médico',
          content:
            'O modelo cobre User, Person, Doctor, Patient, Appointment, MedicalRecord, LifestyleHabits, FamilyHistory, Diagnosis e Exam. Isso sustenta prontuário eletrônico, hábitos de vida, histórico familiar e atendimento a paciente externo, com Person separado de User para que uma pessoa exista no domínio sem precisar de credencial de acesso.'
        }
      ],
      diagrams: [],
      flows: [
        {
          title: 'Autenticação e entrada',
          content:
            'O usuário envia credenciais pelo Gateway, que delega ao Authorization Server. O token JWT emitido volta para a sessão e passa a acompanhar cada chamada. A partir daí o Gateway valida o token e encaminha para o serviço de destino.'
        },
        {
          title: 'Agendamento até a consulta',
          content:
            'A UI Vaadin consulta os Appointments do usuário logado e monta a grid com médico, paciente, horários e status. O botão de teleconsulta só habilita quando a consulta está em estado válido, o que evita entrada em sala de consulta já encerrada ou ainda não iniciada.'
        },
        {
          title: 'Teleconsulta e prontuário',
          content:
            'Ao iniciar a teleconsulta, o serviço valida o status do agendamento, abre o canal WebSocket com o Chat e monta a sala WebRTC. O profissional conduz o atendimento vendo o paciente em vídeo e preenchendo o prontuário na mesma tela, sem trocar de contexto.'
        },
        {
          title: 'Notificação assíncrona',
          content:
            'Gravado o prontuário, o LifePlus publica na notification-queue e devolve a resposta ao usuário imediatamente. A Notification API consome a fila em outro processo, persiste a notificação e emite o evento de atualização da UI. O caminho crítico não espera a notificação.'
        }
      ],
      ai: {
        title: 'Onde a IA entra nesta arquitetura',
        summary:
          'O LifePlus não embarca modelos de IA no código — e é importante dizer isso com clareza. O que ele oferece é a base sobre a qual IA se conecta sem reescrita: eventos assíncronos, serviços isolados e um domínio clínico já modelado. Abaixo estão os pontos de extensão que a arquitetura atual já suporta.',
        points: [
          {
            title: 'A fila como ponto de extensão',
            content:
              'Um serviço de inferência plugado na notification-queue consome os mesmos eventos que a Notification API, sem alterar o LifePlus. É o ganho concreto de ter escolhido mensageria em vez de chamada direta: novos consumidores entram sem tocar no produtor.'
          },
          {
            title: 'Transcrição e sumarização da teleconsulta',
            content:
              'O áudio da sala WebRTC e as mensagens do Chat são as entradas naturais para transcrição e para um resumo estruturado que pré-preenche o MedicalRecord. O modelo de domínio já tem os campos de destino — Diagnosis, Exam, LifestyleHabits —, então a saída do modelo teria onde aterrissar.'
          },
          {
            title: 'RAG sobre o prontuário',
            content:
              'MedicalRecord, FamilyHistory e LifestyleHabits formam um corpus por paciente. Indexá-lo em um vector store permitiria consulta em linguagem natural pelo profissional, com o Gateway aplicando o mesmo controle de acesso já existente — o dado sensível não sai do perímetro autenticado.'
          },
          {
            title: 'Por que isso importa na avaliação',
            content:
              'A decisão relevante aqui não é ter chamado uma API de LLM: é ter deixado o sistema em um estado onde IA entra por acoplamento fraco. Arquitetura orientada a eventos, limites de serviço bem definidos e domínio explícito são pré-requisitos para IA aplicada — sem eles, cada integração vira uma gambiarra pontual.'
          }
        ]
      },
      decisions: [],
      challenges: [
        {
          title: 'Uma sessão, três canais simultâneos',
          content:
            'A tela de teleconsulta mantém vídeo WebRTC, chat via STOMP e formulário de prontuário ativos ao mesmo tempo, cada um com ciclo de vida próprio. Coordenar inicialização e encerramento desses canais sem vazar conexão ao sair da sala é a parte mais delicada do sistema.'
        },
        {
          title: 'Consistência entre serviços sem transação distribuída',
          content:
            'Prontuário e notificação vivem em processos diferentes. A escolha foi consistência eventual pela fila em vez de transação distribuída, aceitando uma janela curta de defasagem em troca de simplicidade operacional e menor acoplamento.'
        },
        {
          title: 'Estado válido para teleconsulta',
          content:
            'A regra que habilita o botão de teleconsulta depende de status e janela de horário do agendamento. Concentrar essa validação no serviço, e não na UI, foi o que impediu que a regra se duplicasse entre a grid de agendamentos e a entrada na sala.'
        }
      ],
      metrics: [
        { label: 'Microsserviços', value: '6' },
        { label: 'Entidades de domínio', value: '10' },
        { label: 'Filas RabbitMQ', value: '2' },
        { label: 'Telas principais', value: '8' }
      ],
      screenshots: [
        {
          id: 'LoginView',
          name: 'LoginView',
          src: '/life-plus/login.png',
          description1:
            'A tela de Login é a porta de entrada do LifePlus. Nela, o usuário acessa o sistema usando e‑mail e senha, com mensagens totalmente personalizadas em português para erros e validações. O layout foi pensado para ser simples e direto, com o formulário centralizado na página e sem distrações, focando na autenticação segura via JWT no backend.',
          description2:
            'Depois do login bem-sucedido, o usuário é redirecionado automaticamente para a lista de agendamentos, já com a sessão autenticada e o token JWT armazenado na sessão da aplicação. A tela também oferece um link direto para o cadastro, facilitando o onboarding de novos usuários.'
        },
        {
          id: 'RegisterView',
          name: 'RegisterView',
          src: '/life-plus/register.png',
          description1:
            'A tela de Registro permite que novos usuários se cadastrem no LifePlus de forma guiada e validada. Ela utiliza o mesmo formulário de dados pessoais da aplicação, mas em modo de criação, coletando informações como nome, CPF, contato e credenciais de acesso. Todo o processo é validado no backend, incluindo regras de senha, e‑mail e CPF.',
          description2:
            'Ao concluir o cadastro, o sistema já define o novo usuário com a role adequada, realiza o registro no banco e faz o login automático, redirecionando direto para a página de agendamentos. Erros são exibidos em notificações amigáveis, explicando claramente o que precisa ser corrigido (por exemplo, CPF inválido ou já cadastrado).'
        },
        {
          id: 'PatientsView',
          name: 'PatientsView',
          src: '/life-plus/patients.png',
          description1:
            'A view de Pacientes apresenta uma lista completa dos pacientes cadastrados no sistema. A tabela exibe informações chave como nome, sobrenome, telefone, CPF formatado e o tipo de pessoa, com um campo de filtro por nome para facilitar a busca em bases maiores.',
          description2:
            'Além de visualizar os dados, o usuário consegue acessar a agenda individual de cada paciente através de um botão de calendário na própria grid. Ao clicar, um diálogo de agenda é aberto já filtrando os compromissos daquele paciente, permitindo ao profissional agendar, revisar e organizar consultas de forma rápida.'
        },
        {
          id: 'AppoitmentsView',
          name: 'AppoitmentsView',
          src: '/life-plus/appointments.png',
          description1:
            'A view de Agendamentos é o painel central de acompanhamento das consultas. Ela lista todos os compromissos relacionados ao usuário logado, mostrando médico, paciente, data/hora inicial, data/hora final e status da consulta. Um campo de filtro por nome do paciente ajuda a encontrar facilmente consultas específicas.',
          description2:
            'Um dos destaques dessa tela é a coluna de Teleconsulta, com um botão que indica se é possível ou não iniciar uma chamada online para aquele agendamento. Quando a consulta está em um estado válido para teleconsulta, o botão fica habilitado e, ao clicar, o sistema confirma com o usuário e o redireciona diretamente para a sala de teleconsulta daquela consulta específica.'
        },
        {
          id: 'CalendarView',
          name: 'CalendarView',
          src: '/life-plus/my-schedule.png',
          description1:
            'A view Minha Agenda traz uma visão de calendário mensal usando o componente FullCalendar. Nela, o profissional consegue ver todos os compromissos distribuídos ao longo do mês, com navegação por período e interação visual direta com os eventos.',
          description2:
            'O usuário pode clicar em espaços vazios do calendário para criar novos agendamentos ou clicar em eventos existentes para visualizar ou editar os detalhes. Toda a navegação do calendário é integrada com um toolbar próprio, permitindo controlar a visão e recarregar os dados de forma fluida, sem sair da tela.'
        },
        {
          id: 'DoctorView',
          name: 'DoctorView',
          src: '/life-plus/doctor.png',
          description1:
            'A view de Lista de Médicos exibe todos os profissionais com perfil de médico cadastrados no sistema. A grid mostra nome, sobrenome, telefone e o papel da pessoa, com um campo de filtro por nome para localizar rapidamente um médico específico.',
          description2:
            'Cada linha possui um botão de Agenda, que abre um diálogo com o calendário daquele médico em particular. Isso permite que a recepção ou outros profissionais consultem a disponibilidade do médico, vejam seus horários ocupados e gerenciem agendamentos diretamente a partir dessa lista.'
        },
        {
          id: 'TeleConsultationView',
          name: 'TeleConsultationView',
          src: '/life-plus/telefeconsutation.png',
          description1:
            'A view de Teleconsulta é onde a consulta online acontece de fato. Ela combina vídeo em tempo real, chat e acesso ao prontuário em uma única experiência, organizada por seções: um cabeçalho com informações da consulta, uma área de vídeo para a chamada WebRTC, controles de câmera/microfone e um gerenciador de abas com chat e prontuário.',
          description2:
            'Quando o usuário entra na teleconsulta a partir de um agendamento, a view carrega os dados da consulta e inicializa todos os componentes necessários. O profissional conduz a consulta olhando o paciente em vídeo, conversando pelo chat quando necessário e consultando ou preenchendo informações médicas sem sair da tela.'
        },
        {
          id: 'ChatView',
          name: 'ChatView',
          src: '/life-plus/chat.png',
          description1:
            'A view de Chat traz uma experiência semelhante a aplicativos de mensagens modernos. À esquerda, uma lista de conversas mostra todas as pessoas com quem o usuário pode se comunicar. Ao selecionar um contato, a área principal à direita é preenchida com um chat privado entre o usuário atual e aquele contato.',
          description2:
            'O componente de chat é integrado ao microserviço de Chat via WebSocket/STOMP, permitindo troca de mensagens em tempo real. Essa view é pensada tanto para conversas entre médicos e pacientes quanto para comunicação interna entre profissionais de saúde, inclusive podendo ser utilizada em paralelo com a teleconsulta.'
        }
      ]
    },
    en: {
      name: 'LifePlus',
      tagline:
        'Medical management system with teleconsultation — six Spring Boot microservices with centralized security and asynchronous messaging.',
      subtitle:
        'Medical Management System with Teleconsultation — microservices architecture in Spring Boot and Vaadin',
      role: 'Architecture and full stack development',
      summary:
        'Platform for managing appointments, scheduling and video teleconsultation. The system is split into six independent services behind an API Gateway, with authentication centralized in an OAuth2 Authorization Server, asynchronous communication over RabbitMQ, and real-time channels over WebSocket and WebRTC.',
      architecture: [
        {
          title: 'Service decomposition',
          content:
            'Six services with isolated responsibilities: API Gateway (8080) as the single entry point handling routing and JWT validation; OAuth2 Authorization Server (8090) issuing tokens; LifePlus (8082) with the Vaadin UI for calendar, records and teleconsultation; Chat (8085) for real-time messaging; Notification API (8083) for notifications and queue consumption; and Spring Boot Admin (8081) for health and metrics monitoring of the others.'
        },
        {
          title: 'Gateway routing',
          content:
            'All traffic enters through port 8080. Routes /oauth/** go to the Authorization Server, /notification/** to the Notification API, and /app/** along with the root to the Vaadin UI. The Gateway validates the JWT before forwarding, which keeps authentication logic out of each business service.'
        },
        {
          title: 'Centralized security',
          content:
            'The Authorization Server implements OAuth2 Client Credentials (RFC 6749) for machine-to-machine communication. LifePlus obtains its token at the Gateway and sends Bearer credentials when calling the Notification API. Concentrating token issuance and validation in two places avoids spreading authentication rules across every service.'
        },
        {
          title: 'Asynchronous messaging',
          content:
            'LifePlus publishes JSON events to notification-queue. The Notification API consumes them with @RabbitListener and persists the notification. A second queue, notification-ui-update-queue, sends the event back to refresh the interface. The Producer/Consumer pattern decouples saving the medical record from delivering the notification — if notification fails, the consultation is not lost.'
        },
        {
          title: 'Real time',
          content:
            'The Chat microservice exposes WebSocket with STOMP plus REST endpoints for conversations and messages, backed by Chat and Message JPA entities. Teleconsultation uses WebRTC for peer-to-peer video, with chat running alongside it on the same screen.'
        },
        {
          title: 'Medical domain',
          content:
            'The model covers User, Person, Doctor, Patient, Appointment, MedicalRecord, LifestyleHabits, FamilyHistory, Diagnosis and Exam. This supports electronic records, lifestyle habits, family history and external patient care, with Person kept separate from User so a person can exist in the domain without needing login credentials.'
        }
      ],
      diagrams: [],
      flows: [
        {
          title: 'Authentication and entry',
          content:
            'The user submits credentials through the Gateway, which delegates to the Authorization Server. The issued JWT returns to the session and accompanies every subsequent call. From there the Gateway validates the token and forwards to the target service.'
        },
        {
          title: 'From scheduling to consultation',
          content:
            'The Vaadin UI queries the logged-in user Appointments and builds the grid with doctor, patient, times and status. The teleconsultation button only enables when the appointment is in a valid state, which prevents entering a room for a consultation already finished or not yet started.'
        },
        {
          title: 'Teleconsultation and medical record',
          content:
            'When teleconsultation starts, the service validates the appointment status, opens the WebSocket channel with Chat and sets up the WebRTC room. The professional runs the appointment seeing the patient on video and filling in the record on the same screen, without switching context.'
        },
        {
          title: 'Asynchronous notification',
          content:
            'Once the record is saved, LifePlus publishes to notification-queue and returns to the user immediately. The Notification API consumes the queue in another process, persists the notification and emits the UI update event. The critical path never waits on notification.'
        }
      ],
      ai: {
        title: 'Where AI fits into this architecture',
        summary:
          'LifePlus does not embed AI models in its code — and that is worth stating plainly. What it does provide is a foundation AI can plug into without a rewrite: asynchronous events, isolated services and an already modelled clinical domain. Below are the extension points the current architecture already supports.',
        points: [
          {
            title: 'The queue as an extension point',
            content:
              'An inference service subscribed to notification-queue consumes the same events as the Notification API, with no change to LifePlus. That is the concrete payoff of choosing messaging over direct calls: new consumers join without touching the producer.'
          },
          {
            title: 'Teleconsultation transcription and summarization',
            content:
              'Audio from the WebRTC room and messages from Chat are the natural inputs for transcription and for a structured summary that pre-fills the MedicalRecord. The domain model already has the destination fields — Diagnosis, Exam, LifestyleHabits — so model output would have somewhere to land.'
          },
          {
            title: 'RAG over the medical record',
            content:
              'MedicalRecord, FamilyHistory and LifestyleHabits form a per-patient corpus. Indexing it in a vector store would allow natural-language querying by the professional, with the Gateway applying the same access control that already exists — sensitive data never leaves the authenticated perimeter.'
          },
          {
            title: 'Why this matters when evaluating the work',
            content:
              'The relevant decision here is not having called an LLM API: it is having left the system in a state where AI enters through loose coupling. Event-driven architecture, well-defined service boundaries and an explicit domain are prerequisites for applied AI — without them, every integration becomes a one-off hack.'
          }
        ]
      },
      decisions: [],
      challenges: [
        {
          title: 'One session, three simultaneous channels',
          content:
            'The teleconsultation screen keeps WebRTC video, STOMP chat and the medical record form active at once, each with its own lifecycle. Coordinating startup and teardown of those channels without leaking a connection when leaving the room is the most delicate part of the system.'
        },
        {
          title: 'Cross-service consistency without distributed transactions',
          content:
            'Medical record and notification live in different processes. The choice was eventual consistency through the queue rather than a distributed transaction, accepting a short lag window in exchange for operational simplicity and looser coupling.'
        },
        {
          title: 'Valid state for teleconsultation',
          content:
            'The rule enabling the teleconsultation button depends on the appointment status and time window. Concentrating that validation in the service rather than the UI is what stopped the rule from being duplicated between the appointments grid and room entry.'
        }
      ],
      metrics: [
        { label: 'Microservices', value: '6' },
        { label: 'Domain entities', value: '10' },
        { label: 'RabbitMQ queues', value: '2' },
        { label: 'Main screens', value: '8' }
      ],
      screenshots: [
        {
          id: 'LoginView',
          name: 'LoginView',
          src: '/life-plus/login.png',
          description1:
            'The Login screen is the entry point of LifePlus. Here, the user accesses the system using email and password, with fully customized messages in Portuguese for errors and validations. The layout was designed to be simple and straightforward, with the form centered on the page and no distractions, focusing on secure authentication via JWT in the backend.',
          description2:
            'After a successful login, the user is automatically redirected to the appointments list, with the session authenticated and the JWT token stored in the application session. The screen also offers a direct link to the registration page, making user onboarding easier.'
        },
        {
          id: 'RegisterView',
          name: 'RegisterView',
          src: '/life-plus/register.png',
          description1:
            'The Registration screen allows new users to sign up to LifePlus in a guided and validated way. It reuses the same personal data form from the application, but in creation mode, collecting information such as name, CPF, contact details and access credentials. All the process is validated on the backend, including rules for password, email and CPF.',
          description2:
            'Once the registration is complete, the system assigns the proper role to the new user, persists the record in the database and performs an automatic login, redirecting directly to the appointments page. Errors are shown in friendly notifications, clearly explaining what needs to be fixed (for example, invalid or already registered CPF).'
        },
        {
          id: 'PatientsView',
          name: 'PatientsView',
          src: '/life-plus/patients.png',
          description1:
            'The Patients view presents a complete list of all patients registered in the system. The table shows key information such as first name, last name, phone number, formatted CPF and person type, with a name filter field to help searching in larger datasets.',
          description2:
            'In addition to viewing data, the user can access each patient’s individual schedule through a calendar button in the grid itself. When clicking it, a schedule dialog opens already filtered to that patient’s appointments, allowing the professional to quickly schedule, review and organize consultations.'
        },
        {
          id: 'AppoitmentsView',
          name: 'AppoitmentsView',
          src: '/life-plus/appointments.png',
          description1:
            'The Appointments view is the central panel for following up consultations. It lists all appointments related to the logged-in user, showing doctor, patient, start date/time, end date/time and appointment status. A filter field by patient name helps easily find specific consultations.',
          description2:
            'One of the highlights of this screen is the Teleconsultation column, with a button that indicates whether it is possible or not to start an online call for that appointment. When the consultation is in a valid state for teleconsultation, the button is enabled and, when clicked, the system confirms with the user and redirects directly to the teleconsultation room for that specific appointment.'
        },
        {
          id: 'CalendarView',
          name: 'CalendarView',
          src: '/life-plus/my-schedule.png',
          description1:
            'The My Schedule view provides a monthly calendar view using the FullCalendar component. In it, the professional can see all appointments distributed over the month, with period navigation and direct visual interaction with events.',
          description2:
            'The user can click on empty spaces in the calendar to create new appointments or click on existing events to view or edit details. All calendar navigation is integrated with its own toolbar, allowing the user to control the current view and reload data smoothly without leaving the screen.'
        },
        {
          id: 'DoctorView',
          name: 'DoctorView',
          src: '/life-plus/doctor.png',
          description1:
            'The Doctors List view displays all professionals with doctor role registered in the system. The grid shows first name, last name, phone number and the person’s role, with a name filter field to quickly find a specific doctor.',
          description2:
            'Each row has a Schedule button that opens a dialog with that specific doctor’s calendar. This allows reception or other professionals to check the doctor’s availability, see occupied time slots and manage appointments directly from this list.'
        },
        {
          id: 'TeleConsultationView',
          name: 'TeleConsultationView',
          src: '/life-plus/telefeconsutation.png',
          description1:
            'The Teleconsultation view is where the online consultation actually happens. It combines real-time video, chat and access to the medical record in a single experience, organized into sections: a header with appointment information, a video area for the WebRTC call, camera/microphone controls and a tab manager with chat and medical record.',
          description2:
            'When the user enters the teleconsultation from an appointment, the view loads the appointment data and initializes all necessary components. The professional conducts the consultation while seeing the patient on video, using chat when needed and consulting or filling in medical information without leaving the screen.'
        },
        {
          id: 'ChatView',
          name: 'ChatView',
          src: '/life-plus/chat.png',
          description1:
            'The Chat view provides an experience similar to modern messaging apps. On the left, a conversation list shows all people the user can communicate with. When selecting a contact, the main area on the right is filled with a private chat between the current user and that contact.',
          description2:
            'The chat component is integrated with the Chat microservice via WebSocket/STOMP, enabling real-time message exchange. This view is designed both for conversations between doctors and patients and for internal communication between healthcare professionals, and can even be used in parallel with the teleconsultation.'
        }
      ]
    }
  }
};
