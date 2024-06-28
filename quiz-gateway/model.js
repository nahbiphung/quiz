export class Quiz {
  constructor(question, answers) {
    this.question = question;
    this.answers = answers;
  }
}

export class Option {
  constructor(text, isCorrect = false) {
    this.text = text;
    this.isCorrect = isCorrect;
  }
}

export class Answer {
  constructor(question, answer, correct) {
    this.question = question;
    this.answer = answer;
    this.correct = correct;
  }
}
