(function () {
  function Question(question, answers, correct) {
    this.question = question;
    this.answers = answers;
    this.correct = correct;
  }
  Question.prototype.displayQuestion = function () {
    console.log(this.question);
    for (let index = 0; index < this.answers.length; index++) {
      console.log(index + ": " + this.answers[index]);
    }
  };
  Question.prototype.checkAnswer = function (ans, callback) {
    let sc;
    if (ans === this.correct) {
      console.log("correct answer");
      sc = callback(true);
    } else {
      console.log("wrong answer");
      sc = callback(false);
    }
    this.displayScore(sc);
  };
  Question.prototype.displayScore = function (score) {
    console.log("your current score is " + score);
    console.log("--------------------------------");
  };
  const q1 = new Question(
    "Is Javascript the coolest language in the world?",
    ["yes", "No"],
    0
  );
  const q2 = new Question(
    "What is the name of this course' teacher?",
    ["John", "Micheal", "jonas"],
    1
  );
  const q3 = new Question(
    "What does best decribe coding?",
    ["Boring", "Hard", "fun"],
    2
  );
  const questions = [q1, q2, q3];
  function score() {
    let sc = 0;
    return function (correct) {
      if (correct) {
        sc++;
      }
      return sc;
    };
  }
  const keepScore = score();
  function nextQuestion() {
    let question = {};
    let n = Math.floor(3 * Math.random());

    questions[n].displayQuestion();
    var answer = prompt("Please select the correct answer.");
    // console.log(answer);
    if (answer != "exit") {
      questions[n].checkAnswer(parseInt(answer), keepScore);
      nextQuestion();
    }
  }
  nextQuestion();
})();
