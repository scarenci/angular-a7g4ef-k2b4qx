import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  }, 
  green: {
    primary: '#00ff00',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['styles.css'],
  templateUrl: 'template.html',
})
export class DemoComponent {

  //Popup
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  //Botões de delete e alterar
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();


  //Json que deveria vir da retaguarda
  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      sala: 'Sala 1',
      bloco: 'Bloco 1',
      title: 'Mesa1',
      color: colors.green,
      actions: this.actions,
      allDay: true
    },
    {
      start: startOfDay(new Date()),
      sala: 'Sala 1',
      bloco: 'Bloco 1',
      title: 'Mesa2',
      color: colors.red,
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      sala: 'Sala 1',
      bloco: 'Bloco 1',
      title: 'A long event that spans 2 months',
      color: colors.red,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      sala: 'Sala 1',
      bloco: 'Bloco 1',
      title: 'Mesa3',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: false,
        afterEnd: false,
      },
      draggable: false,
    },
       {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      sala: 'Sala 1',
      bloco: 'Bloco 1',
      title: 'Mesa4',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: false,
        afterEnd: false,
      },
      draggable: false,
    },  
     {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      sala: 'Sala 1',
      bloco: 'Bloco 1',
      title: 'Mesa5',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: false,
        afterEnd: false,
      },
      draggable: false,
    },

  ];

  activeDayIsOpen: boolean = true; //Mostra o dia atual aberto no calendário

  constructor(private modal: NgbModal) {}

  //controle para exibir o painel das mesas, quando clicado no dia
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  //Não vamos usar!!
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  //Popup ao clicar no exit, nao esta implementado delete
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
    alert("Alteração");
  }

  //Botão de "add new" cria uma mesa
  addEvent(): void { 

    alert("Nova mesa");

    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  //Deleta uma mesa, poderia ser substituida 
  deleteEvent(eventToDelete: CalendarEvent) {
    alert("Deletando elemento");
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
