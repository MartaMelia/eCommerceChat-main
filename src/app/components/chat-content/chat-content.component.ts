import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ChatModel } from 'src/app/shared/models/chat.model';
import { FormBuilder, Validators } from '@angular/forms';
import { ChatService } from 'src/app/shared/services/chat.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-chat-content',
  templateUrl: './chat-content.component.html',
  styleUrls: ['./chat-content.component.scss'],
})
export class ChatContentComponent implements OnInit {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('textareaElement', { static: false }) textareaElement!: ElementRef;
  typingInProgress: boolean = false;
  text: string = '';
  isLoading: boolean = false;

  chatList: ChatModel[] = [];
  constructor(
    private _location: Location,
    private builder: FormBuilder,
    private _chatService: ChatService,
    private _sanitizer: DomSanitizer
  ) {}

  chatForm = this.builder.group({
    text: this.builder.control(``, Validators.required),
  });

  ngOnInit(): void {
    this.typeResponse('Hi, how can I help you?');
  }

  backClicked() {
    this._location.back();
  }

  scrollToBottom(): void {
    this.chatContainer.nativeElement.scrollTop =
      this.chatContainer.nativeElement.scrollHeight;
  }

  send() {
    if (this.isLoading) return;
    this.isLoading = true;

    const textValue = this.chatForm.value.text;

    this.chatForm.controls.text.setValue('');

    if (textValue === '' && textValue?.trim() === '') {
      this.isLoading = false;
      return;
    }

    let userQuestion: ChatModel = { text: textValue!, isChat: false };

    this.chatList.push(userQuestion);

    this._chatService.askQuestion({ question: textValue }).subscribe(
      (result: any) => {
        this.typeResponse(result.answer);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  formatResponse(response: string) {
    response = response.replace(/\*|Image Link|\[|\]/g, ' ');
    response = response.replace(/\n/g, '<br>');


    const imageRegex = /https?:\/\/[^\s]+?\.(png|jpg)/g;
    const urlRegex = /https?:\/\/[^\s]+/g;

    const convertToImageTag = (url: string) => {
      if (url.match(imageRegex)) {
        return `<span class="image-span"><img src='${url}' alt="Image" class="response-image" onerror="this.style.display='none'" /></span>`;
      } else {
        return `<a href="${url}" target="_blank">Buy Now</a>`;
      }
    };

    let formattedResponse = response.replace(urlRegex, convertToImageTag);

    formattedResponse = formattedResponse.replace(/\(|\)/g, ' ');

    return this._sanitizer.bypassSecurityTrustHtml(formattedResponse);
  }

  typeResponse(responseText: string) {
    this.typingInProgress = true;
    let i = 0;
    let model: ChatModel = { text: '', isChat: true };
    this.chatList.push(model);
    setTimeout(() => this.scrollToBottom(), 100);

    let len = this.chatList.length;
    const typingInterval = setInterval(() => {
      if (i < responseText.length) {
        this.chatList[len - 1].text += responseText.charAt(i);
        i++;
      } else {
        clearInterval(typingInterval);
        this.typingInProgress = false;
      }
    }, 10);
  }

  adjustTextareaHeight() {
    if (this.textareaElement && this.textareaElement.nativeElement) {
      const textarea = this.textareaElement
        .nativeElement as HTMLTextAreaElement;
      textarea.style.height = '28px';
      let scHeight = textarea.scrollHeight;
      textarea.style.height = scHeight > 28 ? `${scHeight}px` : '28px';
    }
  }

  onEnterPressed(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.send();
    }
  }
}
