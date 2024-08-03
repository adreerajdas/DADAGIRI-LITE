const apiUrl = 'https://opentdb.com/api.php?amount=10&type=multiple';

const introContainer = document.getElementById('intro');
const quizContainer = document.getElementById('quiz');
const startBtn = document.getElementById('start');
const submitBtn = document.getElementById('submit');
const usernameInput = document.getElementById('username');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');

let quizData = [];
let currentQuiz = 0;
let score = 0;

startBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        introContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        fetchQuizData();
    } else {
        alert('Please enter your name');
    }
});

async function fetchQuizData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        quizData = data.results;
        loadQuiz();
    } catch (error) {
        console.error('Error fetching quiz data:', error);
    }
}

function loadQuiz() {
    deselectAnswers();

    const currentQuizData = quizData[currentQuiz];
    const question = currentQuizData.question;
    const answers = [...currentQuizData.incorrect_answers, currentQuizData.correct_answer];

    questionEl.innerText = question;

    answersEl.innerHTML = '';
    answers.sort(() => Math.random() - 0.5).forEach((answer, index) => {
        answersEl.innerHTML += `
            <li>
                <input type="radio" name="answer" id="${index}" class="answer">
                <label for="${index}">${answer}</label>
            </li>
        `;
    });
}

function deselectAnswers() {
    document.querySelectorAll('.answer').forEach(answerEl => answerEl.checked = false);
}

function getSelected() {
    let answer;
    document.querySelectorAll('.answer').forEach(answerEl => {
        if (answerEl.checked) {
            answer = answerEl.nextElementSibling.innerText;
        }
    });
    return answer;
}

submitBtn.addEventListener('click', () => {
    const selectedAnswer = getSelected();

    if (selectedAnswer) {
        const correctAnswer = quizData[currentQuiz].correct_answer;

        if (selectedAnswer === correctAnswer) {
            score++;
        }

        currentQuiz++;

        if (currentQuiz < quizData.length) {
            loadQuiz();
        } else {
            quizContainer.innerHTML = `
                <h2>Congratulations ${usernameInput.value}, you answered ${score}/${quizData.length} questions correctly!</h2>
                <button onclick="location.reload()">Play Again</button>
            `;
        }
    } else {
        alert('Please select an answer');
    }
});
