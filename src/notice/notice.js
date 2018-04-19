import './notice.scss';

class Notice {
  constructor (title, text) {
    this.state = 'appearing';
    this.title = title;
    this.text = text;
    this.notice = this.createNotice();
    this.addListeners();
  }

  createNotice () {
    const notice = document.createElement('section');
    notice.classList.add('notice');
    notice.classList.add('notice-appearing');
    const title = document.createElement('h3');
    title.classList.add('notice-title');
    title.textContent = this.title;
    const text = document.createElement('p');
    text.classList.add('notice-text');
    text.textContent = this.text;
    notice.appendChild(title);
    notice.appendChild(text);
    return notice;
  }

  addListeners () {
    this.notice.addEventListener('animationend', (e) => {
      if (this.state === 'appearing') {
        this.notice.classList.add('notice-hiding');
        this.state = 'hiding';
      }
      else {
        this.notice.parentElement.removeChild(this.notice);
        this.notice = null;
      }
    });
  }
}

export { Notice };