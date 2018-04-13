'use strict';

import { Requests } from '../request/request.js';
import './canvas.scss';

const requestUrl = 'http://localhost:3000/rooms';
const imageUrl = 'https://neto-api.herokuapp.com/pic';
const wsUrl = 'wss://neto-api.herokuapp.com/pic';

export class Canvas {
  constructor(editorElement, host, users, userName, isHost, roomId, imageId = null, background = '#fff') {
    this.editor = editorElement;
    this.host = host;
    this.users = users;
    this.userName = userName;
    this.isHost = isHost;
    this.ableToDraw = isHost;
    this.roomId = roomId;
    this.imageId = imageId;
    this.image = this.editor.querySelector('.editor__image');
    this.canvas = this.editor.querySelector('#canvas');
    this.ctx = canvas.getContext('2d');
    this.drawOpts = {
      isFirstPoint: true,
      isLastPoint: false
    }
    this.tool = {
      current: 'pen'
    };
    this.coords = {
      x1: null,
      y1: null,
      x2: null,
      y2: null,
      xCur: null,
      yCur: null
    };
    this.options = {
      lineJoin: 'round',
      lineCap: 'round',
      lineWidth: 10,
      strokeStyle: '#000',
      fillStyle: '#999',
      backgroundColor: background
    }

    this.init();
    this.editor.querySelector('#pen').classList.add('selected');
  }

  canvasToImage(self = this) {
    return new Promise((resolve) => {
      self.canvas.toBlob((blob) => {
        self.image.src = URL.createObjectURL(blob);
        resolve(blob);
      });
    });
    //self.image.src = self.canvas.toDataURL('image/png');
  }

  init() {
    this.buildUsersPanel();
    this.buildAsideMenu();
    this.initCanvas();
    this.editor.classList.remove('hidden');
  }

  buildUsersPanel() {
    const panel = this.editor.querySelector('.users');
    panel.textContent = '';
    const usersWrapper = document.createElement('div');

    this.users.forEach(el => {
      usersWrapper.appendChild(buildUser(el, this));
    });

    const userPanelControlls = document.createElement('div');
    userPanelControlls.classList.add('users__control-btns--wrapper');
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('users__control-btn');
    closeBtn.textContent = 'exit';
    closeBtn.dataset.btn = 'close';
    const clearBtn = document.createElement('button');
    clearBtn.classList.add('users__control-btn');
    clearBtn.textContent = 'clear';
    clearBtn.dataset.btn = 'clear';

    userPanelControlls.appendChild(clearBtn);
    userPanelControlls.appendChild(closeBtn);

    panel.appendChild(usersWrapper);
    panel.appendChild(userPanelControlls);

    userPanelControlls.addEventListener('click', (e, self) => onControllBtnClick(e, this));

    function onControllBtnClick(e, self) {
      switch (e.target.dataset.btn) {
        case 'close':
          console.log('close');
          document.querySelector('.rooms').classList.remove('hidden');
          document.querySelector('.controlls').classList.remove('hidden');
          document.querySelector('.editor').classList.add('hidden');
          console.log('roomId: ' + self.roomId);
          if (!self.isHost) {
            ws.connection.close();
            Requests.disconnectRoom(requestUrl, self.userName, self.roomId);
          }
          else {
            ws.connection.close();
            Requests.deleteRoom(requestUrl, self.roomId);
          }
          self = null;
          // Если закрыл хост, запрос на сервер с id комнаты, данные о ней удаляются
          // Реализовать
          break;
        case 'clear':
          // Нажимается только хостом. Очищает canvas
          // Реализовать
          if (this.isHost) {
            self.clearCanvas();
            self.canvasToImage();
          }
          break;
      }
    }

    function buildUser(user, self) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('user');

      const title = document.createElement('h3');
      title.classList.add('user__title');
      title.textContent = user.isHost ? 'Host: ' : 'Guest: '

      const userName = document.createElement('div');
      userName.classList.add('user__name');
      userName.textContent = user.name;

      const controlls = document.createElement('div');
      controlls.classList.add('user__controls');
      const togglePermission = document.createElement('button');
      togglePermission.classList.add('user__btn');
      togglePermission.textContent = 'D';
      const removeGuest = document.createElement('button');
      removeGuest.classList.add('user__btn');
      removeGuest.textContent = 'X';
      controlls.appendChild(togglePermission);
      controlls.appendChild(removeGuest);

      const permissions = document.createElement('div');
      permissions.classList.add('user__permissions');
      const permissionTitle = document.createElement('div');
      permissionTitle.classList.add('user__permission-title');
      permissionTitle.textContent = 'Drawing';
      const permissionStatus = document.createElement('div');
      permissionStatus.classList.add('user__permission-status');
      permissions.appendChild(permissionTitle);
      permissions.appendChild(permissionStatus);
      // Заполнить и показывать в зависимости хост или гость

      wrapper.appendChild(title);
      wrapper.appendChild(userName);
      wrapper.appendChild(self.isHost ? controlls : permissions);
      if (user.isHost) {
        controlls.style.opacity = 0;
        permissions.style.opacity = 0;
      }

      return wrapper;
    }
  }

  buildAsideMenu() {
    const aside = this.editor.querySelector('.editor__menu');
    const tools = [
      'pen',        'line',
      'rectangle',  'ellipse',
      '',           '',
      'erase'
    ];

    const settings = [
      'lineWidth',
      'fillStyle',  
      'strokeStyle',
      'backgroundColor'
    ];

    const toolsWrapper = document.createElement('div');
    toolsWrapper.classList.add('users__tools-wrapper');
    const settingsWrapper = document.createElement('div');
    settingsWrapper.classList.add('users__settings-wrapper');

    aside.textContent = '';
    tools.forEach(el => {
      addAsideElement(toolsWrapper, el, this);
    });
    settings.forEach(el => {
      addSettingElement(settingsWrapper, el, this);
    });

    aside.appendChild(toolsWrapper);
    aside.appendChild(settingsWrapper);

    function addAsideElement(wrapper, tool, self) {
      const element = document.createElement('div');
      if (tool === '') {
        element.classList.add('hidden-tool');
      }
      else {
        element.classList.add('tool');
        element.id = tool;
        element.textContent = tool;
        element.addEventListener('click', (e) => {
          onToolClick(e, self);
        });
      }
      wrapper.appendChild(element);
    }

    function addSettingElement(wrapper, element, self) {
      const settingElement = document.createElement('div');

      settingElement.classList.add('setting');
      settingElement.id = element;
      settingElement.addEventListener('click', (e) => {
        onSettingClick(e, self);
      });
      const title = document.createElement('div');
      const name = document.createElement('div');
      name.classList.add('setting__name')
      const value = document.createElement('div');
      value.classList.add('setting__value');
      name.textContent = element + ': ';
      switch (element) {
        case 'lineWidth':
          const widthInput = document.createElement('input');
          widthInput.classList.add('setting__input');
          widthInput.value = self.options.lineWidth;
          widthInput.addEventListener('input', (e) => {
            self.options.lineWidth = e.currentTarget.value;
          });
          value.appendChild(widthInput);
          break;
        case 'strokeStyle':
          value.textContent = self.options.strokeStyle;
          break;
        case 'fillStyle':
          value.textContent = self.options.fillStyle;
          break;
        case 'backgroundColor':
          value.textContent = self.options.backgroundColor;
          break;
        default:
      }
      title.appendChild(name);
      title.appendChild(value);
      settingElement.appendChild(title);
      wrapper.appendChild(settingElement);
    }

    function onToolClick(e, self) {
      self.editor.querySelector('.selected').classList.remove('selected');
      self.tool.current = e.currentTarget.id;
      e.currentTarget.classList.add('selected');
    }

    function onSettingClick(e, self) {
      switch (e.currentTarget.id) {
        case 'lineWidth':
          const lineWidthInput = aside.querySelector('#lineWidth').querySelector('.setting__input');
          lineWidthInput.focus();
          break;
        case 'strokeStyle':
        case 'fillStyle':
        case 'backgroundColor':
          if (self.editor.querySelector('.option-menu'))
            aside.removeChild(self.editor.querySelector('.option-menu'));
          aside.appendChild(self.showOptionMenu(e.currentTarget.id));
          break;
        default:
          if (self.editor.querySelector('.option-menu'))
            aside.removeChild(self.editor.querySelector('.option-menu'));
      }
    }
  }

  showOptionMenu(option) {
    const self = this;
    const currentOptionBtn = document.getElementById(option);
    const usersMenu = document.querySelector('.users');

    const colors = [
      'white', 'black', 'red', 'orange', 
      'yellow', 'green', 'blue', 'purple'
    ]
    const wrapper = document.createElement('div');
    wrapper.classList.add('option-menu');
    const title = document.createElement('h3');
    const colorsWrapper = document.createElement('div');
    colorsWrapper.classList.add('option-menu__colors');
    setColors(this);
    const optionInput = document.createElement('input');
    optionInput.classList.add('option-menu__input');
    optionInput.value = this.options[option];
    const cansel = document.createElement('button');
    cansel.textContent = 'Cansel';
    cansel.dataset.btn = 'cansel';

    switch (option) {
      case 'strokeStyle':
        title.textContent = 'Stroke Color:';
        wrapper.dataset.type = 'strokeStyle';
        break;
      case 'fillStyle':
        title.textContent = 'Fill Color:';
        wrapper.dataset.type = 'fillStyle';
        break;
      case 'backgroundColor':
        title.textContent = 'Background Color:';
        wrapper.dataset.type = 'backgroundColor';
        break;
    }

    wrapper.addEventListener('click', (e) => onBtnClick(e, self));
    wrapper.addEventListener('input', (e) => onOptionInput(e, self));

    wrapper.appendChild(title);
    wrapper.appendChild(colorsWrapper);
    wrapper.appendChild(optionInput);
    wrapper.appendChild(cansel);
    console.log(currentOptionBtn.getBoundingClientRect().y, parseFloat(getComputedStyle(usersMenu).height), currentOptionBtn.offsetHeight);
    // wrapper.style.bottom = window.innerHeight - currentOptionBtn.getBoundingClientRect().height - currentOptionBtn.getBoundingClientRect().y + 'px';

    return wrapper;

    function onBtnClick(e, self) {
      switch (e.target.dataset.btn) {
        case 'cansel':
          e.currentTarget.parentElement.removeChild(e.currentTarget);
          break;
      }
    }

    function onOptionInput(e, self) {
      setOption(e.currentTarget.dataset.type, optionInput.value, self);
      currentOptionBtn.querySelector('.setting__value').textContent = optionInput.value;
    }

    function setOption(type, value, self) {
      switch (type) {
        case 'strokeStyle':
          self.options.strokeStyle = value;
          break;
        case 'fillStyle':
          self.options.fillStyle = value;
          break;
        case 'backgroundColor':
          self.options.backgroundColor = value;
          self.canvas.style.backgroundColor = value;
          self.clearCanvas();
          console.log(self.options.backgroundColor);
          self.ctx.drawImage(self.image, 0, 0);
          break;
      }
    }

    function setColors(self) {
      colors.forEach(el => {
        const color = document.createElement('div');
        color.classList.add('option-menu__color');
        color.style.backgroundColor = el;
        color.dataset.color = el;
        color.addEventListener('click', (e) => {
          optionInput.value = e.target.dataset.color;
          currentOptionBtn.querySelector('.setting__value').textContent = optionInput.value;
          setOption(option, e.target.dataset.color, self);
        });
        colorsWrapper.appendChild(color);
      });
    }
  }

  initCanvas() {
    const canvas = this.canvas;
    const coords = this.coords;
    const tool = this.tool;
    const drawOpts = this.drawOpts;
    const self = this;
    const draw = this.draw;
    const ws = {
      url: null,//`wss://neto-api.herokuapp.com/pic/${this.roomId}`,
      connection: null
    };
    const setWsListeners = () => {
      ws.connection.addEventListener('open', e => console.log('connection opened'));
      ws.connection.addEventListener('message', e => console.log(`new ws message: ${e.data}`));
      ws.connection.addEventListener('close', e => console.log('connection closed'));
      ws.connection.addEventListener('error', e => console.log(`some ws error: ${e.data}`));
      window.addEventListener('beforeunload', e => ws.connection.close());
    }
    // Посылаем POST запрос на сервер http://neto-api.herokuapp.com/pic
    // Content-Type: multipart/form-data
    // Тело запроса - формдата, с полями title, image(название, изображение)
    // В ответе приходит id изображения, записать в imageId конкретной комнаты
    this.canvasToImage()
      .then(res => Requests.newImage(imageUrl, res, this.host)
      .then(res => {
        this.imageId = res.id;
        Requests.setImageId(requestUrl, this.roomId, this.imageId)
          .then(console.log)
          .catch(console.log);
        ws.url = `wss://neto-api.herokuapp.com/pic/${this.imageId}`;
        ws.connection = new WebSocket(ws.url);
        setWsListeners();
      }))
      .catch(console.log);
    // Размеры  канвы, за вычетом верхней и боковой панелей
    canvas.width = window.innerWidth * 4.3 / 5;
    canvas.height = window.innerHeight * 91.3 / 100;
    this.clearCanvas();
    this.canvasToImage();
    canvas.style.backgroundColor = this.options.backgroundColor;
    
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);

    function onMouseDown(e) {
      canvas.addEventListener('mousemove', onMouseMove);
      drawOpts.isLastPoint = false;
      drawOpts.isFirstPoint = true;

      const canvasBoundingRect = canvas.getBoundingClientRect();
      coords.x1 = Math.round(e.pageX - canvasBoundingRect.x);
      coords.y1 = Math.round(e.pageY - canvasBoundingRect.y);

      draw(tool.current, self);
      drawOpts.isFirstPoint = false;
    }

    function onMouseMove(e) {
      const canvasBoundingRect = canvas.getBoundingClientRect();
      coords.xCur = Math.round(e.pageX - canvasBoundingRect.x);
      coords.yCur = Math.round(e.pageY - canvasBoundingRect.y);
      draw(tool.current, self);
    }

    function onMouseUp(e) {
      canvas.removeEventListener('mousemove', onMouseMove);
      const canvasBoundingRect = canvas.getBoundingClientRect();
      coords.x2 = Math.round(e.pageX - canvasBoundingRect.x);
      coords.y2 = Math.round(e.pageY - canvasBoundingRect.y);

      drawOpts.isLastPoint = true;
      draw(tool.current, self);
      // Через ws отсылаем изменения на сервер
    }
  }

  clearCanvas() {
    const ctx = this.ctx;
    const canvas = this.canvas;

    // ctx.save();
    // ctx.fillStyle = this.options.backgroundColor;
    // console.log(this.options.backgroundColor);
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ctx.restore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  draw(tool, self) {
    if (self.ableToDraw) {
      switch(tool) {
        case 'pen':
          self.drawPoint();
          break;
        case 'line':
          self.drawLine();
          break;
        case 'rectangle':
          self.drawRect();
          break;
        case 'ellipse':
          self.drawEllipse();
          break;
        case 'erase':
          self.erase();
          break;
      }
    }
  }

  drawPoint() {
    const ctx = this.ctx;
    const coords = this.coords;
    const options = this.options;

    if (this.drawOpts.isFirstPoint) {
      coords.xCur = coords.x1 + options.strokeWidth;
      coords.yCur = coords.y1 + options.strokeWidth;
      ctx.beginPath();
      ctx.strokeStyle = this.options.strokeStyle;
      ctx.lineWidth = this.options.lineWidth;
      ctx.lineCap = this.options.lineCap;
      ctx.lineJoin = this.options.lineJoin;
      ctx.moveTo(coords.x1, coords.y1);
      this.clearCanvas();
      this.ctx.drawImage(this.image, 0, 0);
    }
    else if (!this.drawOpts.isLastPoint) {
      ctx.lineTo(coords.xCur, coords.yCur);
      ctx.stroke();
    }
    else {
      ctx.lineTo(coords.x2, coords.y2);
      ctx.stroke();

      this.canvasToImage();

      coords.x1 = coords.xCur;
      coords.y1 = coords.yCur;
    }
  }

  drawLine() {
    const ctx = this.ctx;
    const coords = this.coords;
    const options = this.options;

    if (this.drawOpts.isFirstPoint) {
      coords.xCur = coords.x1 + options.strokeWidth;
      coords.yCur = coords.y1 + options.strokeWidth;
      ctx.strokeStyle = this.options.strokeStyle;
      ctx.lineWidth = this.options.lineWidth;
      ctx.lineCap = this.options.lineCap;
      ctx.lineJoin = this.options.lineJoin;
      this.clearCanvas();
      this.ctx.drawImage(this.image, 0, 0);
    }
    else if (!this.drawOpts.isLastPoint) {
      this.clearCanvas();
      this.ctx.drawImage(this.image, 0, 0);
      ctx.beginPath();
      ctx.moveTo(coords.x1, coords.y1);
      ctx.lineTo(coords.xCur, coords.yCur);
      ctx.stroke();
    }
    else {
      ctx.moveTo(coords.x1, coords.y1);
      ctx.lineTo(coords.x2, coords.y2);
      ctx.stroke();
      this.canvasToImage();
    }
  }

  drawRect() {
    const ctx = this.ctx;
    const coords = this.coords;
    const options = this.options;
    const actions = this.actions;

    if (this.drawOpts.isFirstPoint) {
      coords.xCur = coords.x1 + options.strokeWidth;
      coords.yCur = coords.y1 + options.strokeWidth;
      ctx.fillStyle = this.options.fillStyle;
      ctx.strokeStyle = this.options.strokeStyle;
      ctx.lineWidth = this.options.lineWidth;
      this.clearCanvas();
      ctx.drawImage(this.image, 0, 0);
    }
    else if (!this.drawOpts.isLastPoint) {
      this.clearCanvas();
      ctx.drawImage(this.image, 0, 0);
      ctx.beginPath();
      ctx.rect(coords.x1, coords.y1, coords.xCur - coords.x1, coords.yCur - coords.y1);
      ctx.stroke();
      ctx.fill();
    }
    else {
      ctx.rect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1);
      ctx.stroke();
      ctx.fill();
      this.canvasToImage();
    }
  }

  drawEllipse() {
    const ctx = this.ctx;
    const coords = this.coords;
    const options = this.options;
    const actions = this.actions;

    if (this.drawOpts.isFirstPoint) {
      coords.xCur = coords.x1 + options.strokeWidth;
      coords.yCur = coords.y1 + options.strokeWidth;
      ctx.fillStyle = this.options.fillStyle;
      ctx.strokeStyle = this.options.strokeStyle;
      ctx.lineWidth = this.options.lineWidth;
      this.clearCanvas();
      ctx.drawImage(this.image, 0, 0);
    }
    else if (!this.drawOpts.isLastPoint) {
      this.clearCanvas();
      ctx.drawImage(this.image, 0, 0);
      ctx.beginPath();
      ctx.ellipse(coords.x1, coords.y1, Math.abs(coords.xCur - coords.x1), 
                  Math.abs(coords.yCur - coords.y1), 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    }
    else {
      ctx.ellipse(coords.x1, coords.y1, Math.abs(coords.x2 - coords.x1), 
                  Math.abs(coords.y2 - coords.y1), 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      this.canvasToImage();
    }
  }

  erase() {
    const ctx = this.ctx;
    const coords = this.coords;
    const options = this.options;

    if (this.drawOpts.isFirstPoint) {
      coords.xCur = coords.x1 + options.strokeWidth;
      coords.yCur = coords.y1 + options.strokeWidth;
      ctx.beginPath();
      ctx.moveTo(coords.x1, coords.y1);
    }
    else if (!this.drawOpts.isLastPoint) {
      ctx.lineTo(coords.xCur, coords.yCur);
      ctx.save();
      ctx.strokeStyle = '#000';
      ctx.globalCompositeOperation = 'destination-out';
      console.log(this.options.lineWidth);
      ctx.lineWidth = options.lineWidth;
      ctx.stroke();
      ctx.restore();
    }
    else {
      ctx.lineTo(coords.x2, coords.y2);
      ctx.save();
      ctx.strokeStyle = '#000';
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = options.lineWidth;
      ctx.stroke();
      ctx.restore();

      this.canvasToImage();

      coords.x1 = coords.xCur;
      coords.y1 = coords.yCur;
    }
  }
}