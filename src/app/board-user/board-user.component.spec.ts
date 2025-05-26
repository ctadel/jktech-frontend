import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardUserComponent } from './board-user.component';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ConversationService } from '../_services/conversation.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BoardUserComponent', () => {
  let component: BoardUserComponent;
  let fixture: ComponentFixture<BoardUserComponent>;
  let convoServiceSpy: jasmine.SpyObj<ConversationService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: any;

  beforeEach(async () => {
    convoServiceSpy = jasmine.createSpyObj('ConversationService', [
      'getConversations', 'getMessages', 'sendMessage', 'uploadDocument', 'startConversation', 'deleteConversation'
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: () => null
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [BoardUserComponent],
      providers: [
        { provide: ConversationService, useValue: convoServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore HTML template dependencies
    }).compileComponents();

    fixture = TestBed.createComponent(BoardUserComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load conversations on init', () => {
      convoServiceSpy.getConversations.and.returnValue(of([]));
      component.ngOnInit();
      expect(convoServiceSpy.getConversations).toHaveBeenCalled();
    });
  });

  describe('sendMessage', () => {
    beforeEach(() => {
      component.selectedConversation = { id: '123' };
      component.newMessage = 'Hello';
    });

    it('should send message and push AI response', () => {
      const mockResponse = { content: 'Hi there!', created_at: new Date() };
      convoServiceSpy.sendMessage.and.returnValue(of(mockResponse));

      component.sendMessage();

      expect(component.messages.length).toBe(2); // user + AI message
      expect(component.messages[1].content).toBe(mockResponse.content);
      expect(component.newMessage).toBe('');
    });

    it('should do nothing for empty input', () => {
      component.newMessage = ' ';
      component.sendMessage();
      expect(convoServiceSpy.sendMessage).not.toHaveBeenCalled();
    });
  });

  describe('submitIngestForm', () => {
    it('should upload document and start conversation', () => {
      const file = new File(['dummy content'], 'test.txt');
      const uploadResponse = { id: 1, title: 'Test' };
      const convResponse = { id: 'conv-id', title: 'Test' };

      component.file = file;
      component.formTitle = 'Test';
      convoServiceSpy.uploadDocument.and.returnValue(of(uploadResponse));
      convoServiceSpy.startConversation.and.returnValue(of(convResponse));
      convoServiceSpy.getConversations.and.returnValue(of([]));

      component.submitIngestForm();

      expect(convoServiceSpy.uploadDocument).toHaveBeenCalledWith(file, 'Test', false);
      expect(convoServiceSpy.startConversation).toHaveBeenCalledWith(1, 'Test');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/conversation/', 'conv-id']);
    });

    it('should not upload if file or title is missing', () => {
      component.file = null;
      component.formTitle = '';
      component.submitIngestForm();
      expect(convoServiceSpy.uploadDocument).not.toHaveBeenCalled();
    });
  });

  describe('selectConversation', () => {
    it('should set selectedConversation and fetch messages', () => {
      const mockConvo = { id: '123' };
      const mockMessages = [{ content: 'Hi' }];
      convoServiceSpy.getMessages.and.returnValue(of(mockMessages));

      component.selectConversation(mockConvo);

      expect(component.selectedConversation).toEqual(mockConvo);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/conversation', '123']);
      expect(component.messages).toEqual(mockMessages);
    });
  });

  describe('deleteConversation', () => {
    it('should delete conversation and clear selection if needed', () => {
      component.conversations = [{ id: '1' }, { id: '2' }];
      component.selectedConversation = { id: '1' };
      convoServiceSpy.deleteConversation.and.returnValue(of(void 0));

      const fakeEvent = new Event('click');
      spyOn(fakeEvent, 'stopPropagation');

      component.deleteConversation(fakeEvent, '1');

      expect(component.conversations.length).toBe(1);
      expect(component.selectedConversation).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/conversation']);
    });
  });

  describe('onFileSelected', () => {
    it('should extract file and set formTitle', () => {
      const file = new File(['dummy content'], 'mydoc.pdf');
      const event = {
        target: { files: [file] }
      } as unknown as Event;

      component.onFileSelected(event);
      expect(component.file).toBe(file);
      expect(component.formTitle).toBe('mydoc');
    });
  });

  describe('handleEnter', () => {
    it('should trigger sendMessage on Enter', () => {
      const sendSpy = spyOn(component, 'sendMessage');
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.handleEnter(event);
      expect(sendSpy).toHaveBeenCalled();
    });
  });

  describe('dropFile', () => {
    it('should assign documentFile from drag event', () => {
      const file = new File(['test'], 'dragged.txt');
      const event = {
        preventDefault: () => {},
        dataTransfer: { files: [file] }
      } as unknown as DragEvent;

      component.dropFile(event);
      expect(component.documentFile).toBe(file);
    });
  });
});
