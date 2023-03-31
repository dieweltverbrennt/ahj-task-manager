export default class Dom {
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
