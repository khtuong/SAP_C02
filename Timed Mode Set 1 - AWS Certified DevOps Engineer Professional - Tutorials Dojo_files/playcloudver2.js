document.addEventListener("DOMContentLoaded", (function() {
  return function() {
  class AjaxHandler {
      async startLab() {
          const requestData = {
              'action':'start_lab'
          };
      return this.makeRequest('POST', requestData);
      }
      async endLab() {
          const requestData = {
              'action':'end_lab'
          };
          return this.makeRequest('POST', requestData);
      }
      async hasActiveLab() {
          const requestData = {
              'action':'has_lab'
          };
          return this.makeRequest('POST', requestData);
      }
      async makeRequest(method, requestData) {
          const response = await fetch(ajaxurl, {
              method: method,
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: new URLSearchParams(requestData).toString()
          });
          return response;
      }
  }
  class SessionHandler {
        constructor(ui, timerHandler, ajaxhandler){
          this.ui = ui;
          this.timerHandler = timerHandler;
          this.ajaxHandler = ajaxhandler;
    }
    async init() {
      let labSession = await this.checkSession();
      if (labSession) {
        try {
            this.ui.onSuccessStartRequest(labSession['lab_info']);
            this.timerHandler.runTimer(labSession['lab_info']['expiration']);
            } catch(e){
                return
        }
      } 
      this.ui.enableLaunchBtn();
    }
    async checkSession() {
      let response = await this.ajaxHandler.hasActiveLab();
      let data = await response.json();
      if (data['status'] === 'active') {
          return data;
      } 
    }
  }
  class UIController {
      constructor() {
          this.launchButton = new Button('#pc-launch-btn');
          this.errorHandler = new ErrorHandler();
          this.SessionInfoComponent = new SessionInfoComponent();
      }
      onSuccessStartRequest(responseData) {
          this.errorHandler.clearMessages();
          this.SessionInfoComponent.create();
          this.SessionInfoComponent.display(responseData);
          this.launchButton.hide();
      }
      onFailedStartRequest(responseData) {
          this.errorHandler.clearMessages();
          this.launchButton.showDefault();
          this.errorHandler.displayMessage(this.errorHandler.getErrorMsg(responseData));
      }
      onSuccessEndRequest() {
          this.SessionInfoComponent.refresh();
          this.launchButton.showDefault();
      }
      onFailedEndRequest(responseData) {
          this.SessionInfoComponent.refresh();
          this.launchButton.showDefault();
          this.errorHandler.clearMessages();
          this.errorHandler.displayMessage(this.errorHandler.getErrorMsg(responseData));
      }
      enableLaunchBtn(){
          this.launchButton.enable();
      }
//   hasSession(responseData) {
//     this.errorHandler.clearMessages();
//           this.SessionInfoComponent.create();
//           this.SessionInfoComponent.display(responseData);
//           this.launchButton.hide();
//   }
  }
  class TimerHandler {
      constructor() {
        this.timerIntervalId = null;
      }
      runTimer(expires_in) {
// 			let timestamp = in_minutes ? this._toEpoch(expires_in) : expires_in * 1000;
    let timestamp = expires_in * 1000; //convert to milliseconds
          this.timerIntervalId = setInterval(() => {
              var now = new Date().getTime();
              var remainingTime = timestamp - now;
              if (remainingTime < 0) {
                this.resetTimer();
                this._emitTimerEndEvent();
                return; // early exit
              }
              var hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              var minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
              var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
              var hoursElement = document.getElementById("hours");
              var minutesElement = document.getElementById("minutes");
              var secondsElement = document.getElementById("seconds");
              if (hoursElement && minutesElement && secondsElement) {
                hoursElement.innerHTML = hours;
                minutesElement.innerHTML = minutes;
                secondsElement.innerHTML = seconds;
              } else {
                this.resetTimer();
//                   this._emitTimerEndEvent();
              }
            }, 1000);
      }
      resetTimer() {
        clearInterval(this.timerIntervalId);
        this.timerIntervalId = null;
        // this.timestamp = this._createTimeStamp(180);
      }
//         _toEpoch(expires_in) {
//           var currentDate = new Date();
//           var futureDate = new Date(currentDate.getTime() + expires_in * 60000);
//           var timestamp = futureDate.getTime();
//           return timestamp;
//         }
      _emitTimerEndEvent() {
        const event = new CustomEvent("timerend", {
            detail: {
                message: "Timer has ended"
            }
        });
        document.dispatchEvent(event);
    }
  }
  class Button {
      constructor(id) {
          this.button = document.querySelector(id)
          this.defaultButtontext = this.button.textContent
      }
      showLoading(loadingText) {
          this.button.disabled = true;
          this.button.classList.toggle('loading', true);
          this.button.textContent = loadingText;
          this._show();
      }
      showDefault(){
        this.button.disabled = false;
        this.button.textContent = this.defaultButtontext
        this.button.classList.toggle('loading', false);
        this._show();
    }
      hide() {
        if (this.button) {
          this.button.classList.add('hide');
        }
      }
      _show() {
        if (this.button) {
          this.button.classList.remove('hide');
        }
      }
     enable(){
        this.button.disabled = false;
     }
  }
  class AccountInfo {
      constructor() {
          this.elem = null;
          this.create();
      }
      create() {
          this.elem = document.createElement('div');
          this.elem.id = 'pc-lab-account-info-container';
          // this.accountInfoContainer.style.display = 'none';
          this.elem.innerHTML = `
                  <h2>Your AWS Account Info:</h2>
                  <button id="pc-end-btn">End Lab</button>  
              `;
          return this.elem;
      }
     display(responseData) {
          const { username, password, landing_url } = responseData;
          const parentDiv = document.getElementById('pc-lab-account-info-container');
          const h2Elem = parentDiv.querySelector('h2');
          const infoFields = [
              { label: 'Username:', value: username },
              { label: 'Password:', value: password },
              { label: 'Launch URL:', value: landing_url }
          ];
          let lastInsertedElem = h2Elem;
          infoFields.forEach(field => {
              const infoSectionHTML = `
                  <div class="info-section">
                      <label>${field.label}</label>
                      <div class="input-icon-wrapper">
                          <input type="text" value="${field.value}">
                          <i class="fas fa-copy copy-icon"></i>
                      </div>
                  </div>
              `;
              lastInsertedElem.insertAdjacentHTML('afterend', infoSectionHTML);
              lastInsertedElem = lastInsertedElem.nextElementSibling;
        });
      }
  }
  class TimerBox {
      constructor() {
        this.elem = null;
        this.create();
      }
      create() {
        this.elem = document.createElement('div');
        this.elem.id = 'timer-box';
        const timeParts = [
          { id: 'hours', text: 'Hours' },
          { id: 'minutes', text: 'Minutes' },
          { id: 'seconds', text: 'Seconds' }
        ];
        let timerBoxHTML = '';
        timeParts.forEach((timePart) => {
          timerBoxHTML += `
            <div class="time-part">
              <span id="${timePart.id}"></span>
              <small>${timePart.text}</small>
            </div>
          `;
        });
        this.elem.innerHTML = timerBoxHTML;
        // const pcBtnContainer = document.querySelector('#pc-lab-account-info-container');
        // pcBtnContainer.parentNode.insertBefore(this.timerBox, pcBtnContainer.nextSibling);
        return this.elem;
      }
  }
  class ErrorHandler {
      constructor() {}
      getErrorMsg(responseData) {
          if (responseData && responseData.error) {
              return responseData.error.message;
          } else{
       return 'Request Failed. Please <a href="#" onclick="location.reload()">reload</a> the page and contact support.';
    }
          
      }
      clearMessages() {
          const errorMessages = document.querySelectorAll('.error-message');
          errorMessages.forEach(errorMessage => {
              errorMessage.remove();
          });
      }
      displayMessage(message) {
          const errorMessage = document.createElement('p');
          const errorContainer = document.querySelector('#pc-err-container');
          errorMessage.innerHTML = message;
          errorMessage.classList.add('error-message');
          errorContainer.appendChild(errorMessage);
      }
  }
  class Modal {
      constructor() {
        this.elem = null;
        this.create();
      }
      create() {
        this.elem = document.createElement('div');
        this.elem.id = 'myModal';
        this.hide();
        this.elem.classList.add('modal');
        this.elem.innerHTML = `
          <div class="modal-content">
            <span class="close">&times;</span>
            <p>You're about to end your lab session. All resources that you created will be deleted. Do you want to proceed?</p>
            <div class="modal-button">
              <button id="modal-end-btn">Okay</button>
            </div>
          </div>
        `;
        return this.elem;
      }
      hide() {
        if (this.elem) {
          this.elem.classList.add('hide');
        }
      }
      show() {
        if (this.elem) {
          this.elem.classList.remove('hide');
        }
      }
      showButtonLoading() {
        const endBtn = new Button('#modal-end-btn')
        endBtn.showLoading('Ending...')
      }
  }
  class SessionInfoComponent {
      constructor() {
        this.sessionInfoContainer = null;
        this.accountInfo = null;
        this.timerBox = null;
        this.modal = null;
      }
      create() {
        this.accountInfo = new AccountInfo();
        this.timerBox = new TimerBox();
        this.modal = new Modal();
        const reference = document.querySelector('.pc-btn-container');
        this.sessionInfoContainer = document.createElement('div');
        this.sessionInfoContainer.id = 'session-info-container';
        this.sessionInfoContainer.appendChild(this.accountInfo.elem);
        this.sessionInfoContainer.appendChild(this.timerBox.elem);
        this.sessionInfoContainer.appendChild(this.modal.elem);
        reference.insertAdjacentElement('afterend', this.sessionInfoContainer);
      }
      refresh() {
        if (this.sessionInfoContainer) {
          this.sessionInfoContainer.parentNode.removeChild(this.sessionInfoContainer);
        }
        this.accountInfo = null;
        this.timerBox = null;
        this.modal = null; 
        this.sessionInfoContainer = null;
      }
      display(responseData) {
        this.accountInfo.display(responseData);
      }
  }
  class ClickEvents {
      constructor() {}
      StartPlaycloud(event){
        return event.target.id === 'pc-launch-btn';
      }
      EndPlaycloud(event){
        return event.target.id === 'modal-end-btn';
      }
      ShowModal(event){
        return event.target.id === 'pc-end-btn';
      }
      CloseModal(event){
        return event.target.classList.contains('close');
      }
      CopyInfo(event){
        return event.target.classList.contains('copy-icon');
      }
  }
  class EventHandler {
        constructor(ui, ajaxHandler, clickEvents, timerHandler) {
//               this.timerHandler = new TimerHandler(ui, ajaxHandler)
            this.timerHandler = timerHandler
            this.events = clickEvents
            this.ui = ui;
            this.ajaxHandler = ajaxHandler;
            this.closeSpan = document.querySelector(".modal .close");
            document.addEventListener("timerend", this.handleTimerEnd.bind(this));
            document.addEventListener('click', this.delegateClickEvents.bind(this));
        }
        async delegateClickEvents(event) {
            if (this.events.StartPlaycloud(event)) { 
                try {
                    this.ui.launchButton.showLoading("Loading...");
                    let response = await this.ajaxHandler.startLab();
                    let data = await response.json();
                    if (!response.ok) {
                        this.ui.onFailedStartRequest(data);
                        return; //early exit
                    }
                    this.ui.onSuccessStartRequest(data['lab_info']);
                    this.timerHandler.runTimer(data['lab_info']['expiration']);
                } catch (error) {
                    this.ui.onFailedStartRequest(error);
                }
            }
            if (this.events.EndPlaycloud(event)) {
                this.ui.SessionInfoComponent.modal.showButtonLoading('Ending...');
                try {
                    let response = await this.ajaxHandler.endLab();
                    let data = await response.json(); 
                    if (!response.ok) {
                        this.ui.onFailedEndRequest(data);
                        return; //early exit
                    }
                    this.ui.onSuccessEndRequest();
                } catch (error) {
                    this.ui.onFailedEndRequest(error);
                } finally {
                    this.timerHandler.resetTimer();
                }
            }
            if (this.events.ShowModal(event)) {
                this.ui.SessionInfoComponent.modal.show();      
            }
            if (this.events.CloseModal(event)) {
                this.ui.SessionInfoComponent.modal.hide();   
            }
            if (this.events.CopyInfo(event)) {
                const copyIcons = document.querySelectorAll('.copy-icon');
                copyIcons.forEach(function(icon) {
                    icon.addEventListener('click', function(event) {
                        const wrapper = event.target.closest('.input-icon-wrapper');
                        const inputValue = wrapper.querySelector('input').value;
                        navigator.clipboard.writeText(inputValue).then(function() {
                            wrapper.classList.add('copied');
                            setTimeout(() => {
                                wrapper.classList.remove('copied');
                            }, 2000);
                        }, function(err) {
                            console.error('Could not copy text:', err);
                        });
                    });
                });
            }
        }
        async handleTimerEnd() {
              this.ui.onSuccessEndRequest();
              this.ui.SessionInfoComponent.refresh();
      }
  }

  const entryElement = document.querySelector('#pc-launch-btn');
  if (entryElement) {
  const ui = new UIController();
  const ajaxHandler = new AjaxHandler();
  const clickEvents = new ClickEvents();
  const timerHandler = new TimerHandler();
  const shandler = new SessionHandler(ui, timerHandler, ajaxHandler);
  const listener = new EventHandler(ui, ajaxHandler, clickEvents, timerHandler);
  shandler.init();
  } else {
  return;
  }
}
})());