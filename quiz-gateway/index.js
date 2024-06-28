import { Answer, Option, Quiz } from "./model.js";

let singleChoiceQuestions = [];
const singleChoiceAnswers = [];

// ====== Initial =========
displaySingleChoicesQuestion();
onSubmitSingleChoice();

// ====== Action listener =========
onAddAnOption();
onAddSingleChoiceOption();

// ====== Functions =========
async function displaySingleChoicesQuestion() {
  const singleChoiceElement = document.getElementById("single-choice");

  await fetch("http://localhost:3000/quizzes")
    .then((response) => response.json())
    .then((questions) => {
      if (!questions || questions.length === 0) {
        return;
      }

      singleChoiceQuestions = [];
      questions.forEach((q) => {
        singleChoiceQuestions.push(new Quiz(q.question, q.answers));
      });

      displayQuestions();
    })
    .catch((err) => alert(err));

  singleChoiceQuestions.forEach((singleChoiceQuest, qIndex) => {
    const question = document.createElement("div");
    question.innerHTML = `Question ${qIndex + 1}: ${
      singleChoiceQuest.question
    }`;
    singleChoiceElement.appendChild(question);

    // Add an answer object to the singleChoiceAnswers array
    singleChoiceAnswers.push(new Answer(qIndex, null, false));

    // Create DOM for the answers
    const answers = document.createElement("div");
    singleChoiceQuest.answers.forEach((answer, aIndex) => {
      const answerElement = document.createElement("input");
      const labelElement = document.createElement("label");
      const uniqueId = `question-${qIndex}-answer-${aIndex}`;
      answerElement.type = "radio";
      answerElement.value = answer.text;
      answerElement.id = uniqueId;
      answerElement.name = `question-${qIndex}`;
      labelElement.innerHTML = answer.text;
      labelElement.htmlFor = uniqueId;

      answers.appendChild(answerElement);
      answers.appendChild(labelElement);

      // Add event listener to update the answer element per questions
      answerElement.addEventListener("change", (event) => {
        trackingAnswer(singleChoiceQuest, qIndex, event.target, aIndex);
      });
    });

    singleChoiceElement.appendChild(answers);
  });
}

function trackingAnswer(question, questionIndex, answer, answerIndex) {
  singleChoiceAnswers[questionIndex].answer = answer.value;
  singleChoiceAnswers[questionIndex].correct =
    answer.checked && question.answers[answerIndex].isCorrect;
}

function displayQuestions() {
  const questionsElement = document.getElementById("questions");
  singleChoiceQuestions.forEach((singleChoiceQuest) => {
    const question = document.createElement("div");
    question.innerHTML = singleChoiceQuest.question;
    questionsElement.appendChild(question);

    const answers = document.createElement("ul");
    singleChoiceQuest.answers.forEach((answer) => {
      const answerElement = document.createElement("li");
      answerElement.innerHTML = answer.text + (answer.isCorrect ? "*" : "");
      answers.appendChild(answerElement);
    });

    questionsElement.appendChild(answers);
  });
}

function addAnOption() {
  const optionsElement = document.getElementById("options");

  const optionBlock = document.createElement("div");

  const questionLength = optionsElement.querySelectorAll("div").length;

  const inputElement = document.createElement("input");
  const labelElement = document.createElement("label");
  const radioElement = document.createElement("input");

  labelElement.innerHTML = `Option ${questionLength + 1}`;
  labelElement.htmlFor = `add-option-${questionLength + 1}`;

  inputElement.type = "text";
  inputElement.required = true;
  inputElement.id = `add-option-${questionLength + 1}`;
  inputElement.name = `add-option-${questionLength + 1}`;

  radioElement.type = "radio";
  radioElement.id = `add-option-${questionLength + 1}`;
  radioElement.name = "add-option";

  optionBlock.appendChild(labelElement);
  optionBlock.appendChild(inputElement);
  optionBlock.appendChild(radioElement);

  optionsElement.appendChild(optionBlock);

  adaptDeleteButtonForLastOption();
}

async function addSingleChoiceOption() {
  const question = document.getElementById("question");

  const newOptions = document.getElementById("options").querySelectorAll("div");

  const options = [];
  newOptions.forEach((option, index) => {
    const input = option.querySelector("input[type=text]");
    const radio = option.querySelector("input[type=radio]");

    options.push(new Option(input.value, radio.checked));
  });

  const bodyData = new Quiz(question.value, options);
  await fetch("http://localhost:3000/quizzes", {
    method: "POST",
    body: JSON.stringify(bodyData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((question) => {
      if (!question) {
        return;
      }

      singleChoiceQuestions.push(new Quiz(question.value, options));

      // Clean the question
      question.value = null;

      // Reset DOM
      const singleChoiceElement = document.getElementById("single-choice");
      while (singleChoiceElement.firstChild) {
        singleChoiceElement.removeChild(singleChoiceElement.firstChild);
      }

      const optionsElement = document.getElementById("options");
      while (optionsElement.firstChild) {
        optionsElement.removeChild(optionsElement.firstChild);
      }

      const questionsElement = document.getElementById("questions");
      while (questionsElement.firstChild) {
        questionsElement.removeChild(questionsElement.firstChild);
      }
    })
    .then(() => displaySingleChoicesQuestion())
    .catch((err) => alert(err));
}

function adaptDeleteButtonForLastOption() {
  const newOptions = document.getElementById("options").querySelectorAll("div");

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.innerHTML = "Delete This Option";
  deleteBtn.id = "delete-btn";

  const existedDeleteBtn = document.getElementById("delete-btn");
  if (existedDeleteBtn) {
    existedDeleteBtn.parentNode.removeChild(existedDeleteBtn);
  }

  if (newOptions.length > 0) {
    newOptions[newOptions.length - 1].appendChild(deleteBtn);
  }

  deleteBtn.addEventListener("click", () => {
    newOptions[newOptions.length - 1].remove();

    adaptDeleteButtonForLastOption();
  });
}

// ====== Action on DOM =========
function onSubmitSingleChoice() {
  const submitButton = document.getElementById("submit-single-choice");

  submitButton.addEventListener("click", () => {
    const correctAnswers = singleChoiceAnswers.filter(
      (answer) => answer.correct
    );

    const point = 100 / singleChoiceQuestions.length;
    const finalPoint = Math.floor(point * correctAnswers.length);

    alert(
      `You got ${finalPoint} point | ${correctAnswers.length} / ${singleChoiceQuestions.length} correct`
    );
  });
}

function onAddAnOption() {
  const addOptionBtn = document.getElementById("add-option");

  addOptionBtn.addEventListener("click", () => {
    addAnOption();
  });
}

function onAddSingleChoiceOption() {
  const addOptionBtn = document.getElementById("add-single-choice-question");

  addOptionBtn.addEventListener("click", () => {
    addSingleChoiceOption();
  });
}
