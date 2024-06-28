// Add middleware / dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

const { Quiz, Option } = require("./models/quiz-model");

// Mocking question to serve
const singleChoiceQuestions = [
  new Quiz("What does 'JS' stand for?", [
    new Option("JavaSource"),
    new Option("JavaScript", true),
    new Option("JustScript"),
  ]),
  new Quiz("2 + 2 = ?", [
    new Option("1"),
    new Option("2"),
    new Option("3"),
    new Option("4", true),
  ]),
];

// Enable CORS for all request
app.use(cors());

// Use body parser to parse JSON body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define a root entry to point for the REST API
app.get("/", (req, res) => {
  res.send("Welcome to Quiz REST API: Visit /quiz to see the list");
});

// GET: Define a route to get all questions
app.get("/quizzes", (req, res) => {
  res.send(singleChoiceQuestions);
});

// Define a route to add a new question
app.post("/quizzes", (req, res) => {
  const reqQuestion = req.body;

  console.log(reqQuestion);

  const newQuestion = new Quiz(reqQuestion.question, reqQuestion.answers);

  singleChoiceQuestions.push(newQuestion);

  res.send(newQuestion);
});

// Start the REST API Server
app.listen(port, () => console.log(`Quiz App API listening on port ${port}`));
