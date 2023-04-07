/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/dom.js
class Dom {
  constructor() {
    this.body = null;
    this.container = null;
    this.columns = [];
    this.newCard = null;
    this.col = 1;
  }
  drawContainer() {
    this.body = document.querySelector('body');
    this.container = document.createElement('div');
    this.container.classList.add('container');
    this.body.appendChild(this.container);
  }
  drawColumn(name) {
    const column = document.createElement('div');
    column.classList.add('column');
    column.dataset.col = this.col;
    this.col += 1;

    // column title
    const title = document.createElement('h3');
    title.classList.add('column-title');
    title.textContent = name;
    column.appendChild(title);
    const span = document.createElement('span');
    span.classList.add('title-el');
    span.innerHTML = '&middot;&middot;&middot;';
    title.appendChild(span);

    // container for cards
    const content = document.createElement('div');
    content.classList.add('column-content');
    column.appendChild(content);

    // add card button
    const button = document.createElement('button');
    button.classList.add('add-button');
    button.textContent = '+ Add another card';
    column.appendChild(button);

    // add field for new card -hidden
    const formForCard = document.createElement('form');
    formForCard.classList.add('hidden');
    formForCard.innerHTML = `<textarea class="card-textarea" type="textarea" placeholder="Enter a title for this card..."></textarea>
    <button class="submit-card-button">Add Card</button>
    <button class="new-card-delete-button">&#10006;</button>`;
    column.appendChild(formForCard);
    this.container.appendChild(column);
    this.columns.push(column);
  }

  // eslint-disable-next-line class-methods-use-this
  addCard(parent, text) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = text;

    // delete card button
    const delCardBtn = document.createElement('button');
    delCardBtn.classList.add('card-button-delete', 'hidden');
    delCardBtn.innerHTML = '<button class="card-button-delete">&#10006;</button>';
    card.appendChild(delCardBtn);
    parent.appendChild(card);
  }
}
;// CONCATENATED MODULE: ./src/js/widget.js
class Widget {
  constructor(dom, state) {
    this.dom = dom;
    this.state = state;
  }
  init() {
    this.dom.drawContainer();
    this.dom.drawColumn('Todo');
    this.dom.drawColumn('In Progress');
    this.dom.drawColumn('Done');
    if (this.state.storage.getItem('data') !== null) {
      this.loadState();
    }
    this.dom.columns.forEach(item => {
      const addCardBtn = item.querySelector('.add-button');
      addCardBtn.addEventListener('click', this.onAddButtonClick.bind(this));
      const submitAddBtn = item.querySelector('.submit-card-button');
      submitAddBtn.addEventListener('click', this.onSubmitAddButtonClick.bind(this));
      const closeFormBtn = item.querySelector('.new-card-delete-button');
      closeFormBtn.addEventListener('click', this.onCancelAddClick.bind(this));
    });
    this.bindDnDEvents();
  }

  // eslint-disable-next-line class-methods-use-this
  bindDnDEvents() {
    let draggedEl = null;
    let ghostEl = null;
    let lastCol = null;
    let lastPos = null;
    const container = document.querySelector('.container');

    // mousedown
    container.addEventListener('mousedown', e => {
      if (e.target.classList.contains('card')) {
        lastCol = e.target.closest('.column').dataset.col;
        lastPos = e.target.nextSibling;
        e.preventDefault();
        draggedEl = e.target;
        this.coordinates = draggedEl.getBoundingClientRect();
        this.shiftX = e.clientX - this.coordinates.left;
        this.shiftY = e.clientY - this.coordinates.top;
        ghostEl = e.target.cloneNode(true);
        ghostEl.classList.add('dragged');
        document.body.appendChild(ghostEl);
        ghostEl.style.width = `${e.target.offsetWidth}px`;
        ghostEl.style.left = `${e.pageX - this.shiftX}px`;
        ghostEl.style.top = `${e.pageY - this.shiftY}px`;
        container.classList.add('moving');
      }
    });
    this.placeForEl = document.createElement('div');
    this.placeForEl.classList.add('place');

    // mousemove
    container.addEventListener('mousemove', e => {
      e.preventDefault();
      if (draggedEl) {
        if (this.placeForEl !== null) {
          this.placeForEl.remove();
        }
        ghostEl.style.left = `${e.pageX - this.shiftX}px`;
        ghostEl.style.top = `${e.pageY - this.shiftY}px`;
        const current = document.elementFromPoint(e.clientX, e.clientY);
        if (current.classList.contains('column-content')) {
          if (!current.hasChildNodes()) {
            current.appendChild(this.placeForEl);
          }
        }
        if (current.classList.contains('card')) {
          const currentMid = current.offsetTop - current.offsetHeight / 2;
          if (ghostEl.offsetTop >= currentMid) {
            current.parentNode.insertBefore(this.placeForEl, current);
          }
        }
        if (current.classList.contains('column')) {
          current.querySelector('.column-content').appendChild(this.placeForEl);
        }
        if (current.classList.contains('add-button')) {
          current.parentNode.querySelector('.column-content').appendChild(this.placeForEl);
        }
        draggedEl.remove();
      }
    });

    // mouseleave
    container.addEventListener('mouseleave', e => {
      e.preventDefault();
      if (draggedEl) {
        lastCol = this.dom.columns.find(item => item.dataset.col === lastCol).querySelector('.column-content');
        if (lastPos) {
          lastCol.insertBefore(draggedEl, lastPos);
        } else {
          lastCol.appendChild(draggedEl);
        }
        document.body.removeChild(ghostEl);
        ghostEl = null;
        draggedEl = null;
      }
    });

    // mouseup
    container.addEventListener('mouseup', () => {
      if (draggedEl) {
        container.classList.remove('moving');
        this.placeForEl.insertAdjacentElement('afterend', draggedEl);
        this.placeForEl.remove();
        ghostEl.remove();
        this.state.toStorage(this.dom.container);
        draggedEl = null;
        ghostEl = null;
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  onAddButtonClick(e) {
    e.preventDefault();
    const cardValue = e.target.parentNode.querySelector('.card-textarea');
    cardValue.value = '';
    e.target.classList.toggle('hidden');
    e.target.parentNode.querySelector('form').classList.toggle('hidden');
  }
  onSubmitAddButtonClick(e) {
    e.preventDefault();
    const curColumn = e.target.parentNode.parentNode;
    const parentContent = curColumn.querySelector('.column-content');
    const cardValue = e.target.parentNode.querySelector('.card-textarea').value;
    if (cardValue !== '') {
      this.dom.addCard(parentContent, cardValue);
      this.state.toStorage(this.dom.container);
      curColumn.querySelector('form').classList.add('hidden');
      curColumn.querySelector('.add-button').classList.remove('hidden');

      // create events listener for every card
      this.bindCardEvents(parentContent.lastChild);
    } else {
      alert('You can not add empty card!');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onCancelAddClick(e) {
    e.preventDefault();
    e.target.parentNode.classList.add('hidden');
    e.target.parentNode.parentNode.querySelector('.add-button').classList.remove('hidden');
  }

  // eslint-disable-next-line class-methods-use-this
  onDeleteCardClick(e) {
    e.preventDefault();
    e.target.closest('.card').remove();
    this.state.toStorage(this.dom.container);
  }
  bindCardEvents(card) {
    const cardDelButton = card.querySelector('.card-button-delete');
    card.addEventListener('mouseover', () => {
      cardDelButton.classList.remove('hidden');
    });
    card.addEventListener('mouseout', () => {
      cardDelButton.classList.add('hidden');
    });
    cardDelButton.addEventListener('click', this.onDeleteCardClick.bind(this));
  }
  loadState() {
    const load = this.state.load();
    for (let i = 0; i < this.dom.columns.length; i += 1) {
      for (let j = 0; j < load[i].length; j += 1) {
        this.dom.addCard(this.dom.columns[i].querySelector('.column-content'), load[i][j]);
        this.bindCardEvents(this.dom.columns[i].querySelector('.column-content').lastChild);
      }
    }
  }
}
;// CONCATENATED MODULE: ./src/js/state.js
class State {
  constructor(storage) {
    this.storage = storage;
    this.data = [];
  }
  save(data) {
    this.storage.setItem('data', JSON.stringify(data));
  }
  toStorage(container) {
    this.data = [];
    const cols = Array.from(container.querySelectorAll('.column'));
    const colsData = [];
    cols.forEach(item => {
      const cardArr = Array.from(item.querySelectorAll('.card'));
      colsData.push(cardArr);
    });
    colsData.forEach(item => {
      const contentArr = [];
      for (const value of item) {
        contentArr.push(value.textContent.slice(0, -1));
      }
      this.data.push(contentArr);
    });
    this.save(this.data);
  }
  load() {
    try {
      return JSON.parse(this.storage.getItem('data'));
    } catch (e) {
      throw new Error('Error');
    }
  }
}
;// CONCATENATED MODULE: ./src/js/app.js



const dom = new Dom();
const state = new State(localStorage);
const widget = new Widget(dom, state);
widget.init();
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;