/* eslint-env browser */

class diagnosticTest {
  constructor(form) {
    this.form = form;
    this.currentQuestion = 0;
    this.answers = [];
  }

  loadQuestion() {
    fetch(`/diagnostic-tool/question/${this.currentQuestion}`)
      .then(res => res.json())
      .then((q) => {
        this.form.querySelector('#questionNumber').innerHTML = this.currentQuestion + 1;
        this.form.querySelector('.card-question').innerHTML = q.question;
        q.choices.forEach((choice, i) => {
          this.form.querySelector(`button[value="${i}"] .choice-text`).innerHTML = choice;
        });
      });
  }

  init() {
    this.loadQuestion();
  }
}

export default diagnosticTest;
