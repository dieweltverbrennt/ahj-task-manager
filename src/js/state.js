export default class State {
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
    cols.forEach((item) => {
      const cardArr = Array.from(item.querySelectorAll('.card'));
      colsData.push(cardArr);
    });
    colsData.forEach((item) => {
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
