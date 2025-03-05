document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const questions = document.querySelectorAll('.question');
    const submitAns = document.getElementsByClassName('submitQuiz');
    const modalContent = document.getElementById('modal-content');
    const results = document.getElementById('results'); // Added for displaying results
    const questionsBox = document.querySelector('.questions'); // Get the questions box element
    const resultBox = document.getElementById('quiz-results');
    const progressBar = document.querySelector('.progress');

    let currentQuestionIndex = 0;
    let prompt; 
    questionsBox.style.display ="none";
    resultBox.style.display="none";

    let value =0;
    function setProgress(value) {
        progressBar.style.width = value + '%';
      }

    function showNextQuestion() {
        questions[currentQuestionIndex].style.display = 'none';
        currentQuestionIndex++;
        value+=20;
        setProgress(value);
        if (currentQuestionIndex < questions.length) {
            questions[currentQuestionIndex].style.display = 'block';
        }
    }

    function startQuiz() {
        questions[currentQuestionIndex].style.display = 'block';
        startButton.style.display = 'none';
        questionsBox.style.display ="block";
        resultBox.style.display="none";
        setProgress(value);

    }
    startButton.addEventListener('click', function() {
        // Select the quiz container element
        var quizContainer = document.getElementById('quizContainer');

        // Add a class to hide the quiz container
        quizContainer.classList.add('hidden');
    });

    function displayScore() {
        questions.forEach(question => {
            question.style.display = 'none'; // Hides all questions
        });
        
        results.style.display = 'block'; // Display the result box
        questionsBox.style.display = 'none'; // Hide the questions box
    
        const answers = {};
        document.querySelectorAll('.question input').forEach((input, index) => {
            answers['question' + (index + 1)] = input.value; // Match the key format of correctAnswers
        });
    
        const score = calculateScore(answers);
        printPage(score);

        
    resultBox.style.display="block";
    }
    
    function printPage(score) {
        const scoreContainer = document.createElement('div');
        scoreContainer.textContent = 'Your score is: ' + score + '. Use the points for your next purchase!';
        scoreContainer.style.position = 'fixed';
        scoreContainer.style.top = '50%';
        scoreContainer.style.left = '50%';
        scoreContainer.style.transform = 'translate(-50%, -50%)';
        scoreContainer.style.backgroundColor = 'rgba(0, 255, 255, 0.9)';
        scoreContainer.style.padding = '20px';
        scoreContainer.style.borderRadius = '10px';
        document.body.appendChild(scoreContainer);
    
        // Hide the result box after a certain duration (e.g., 5 seconds)
        setTimeout(() => {
            scoreContainer.style.display = 'none';
            results.style.display = 'none'; // Hide the result box
        }, 5000); // 5000 milliseconds = 5 seconds
    }
    
    

    // Function to calculate the score
     function calculateScore(answers) {
        
        value+=20;
        setProgress(value);

        const correctAnswers = {
            question1: "60",
            question2: "hypertension",
            question3: "obesity",
            question4: "A",
            question5: "insulin"
        };

        console.log('User Answers:', answers);
        console.log('Correct Answers:', correctAnswers);

        let score = 0;

        for (let question in correctAnswers) {
            if (correctAnswers.hasOwnProperty(question) && answers.hasOwnProperty(question)) {
                if (answers[question] === correctAnswers[question]) {
                    score += 2;
                } else {
                    score -= 1;
                }
            }
        }
        
        alert("Thank you for taking the quiz. Your score is "+ score);
        localStorage.setItem('quizScore', score.toString());
        return score;
    }

    startButton.addEventListener('click', startQuiz);

    const nextButtons = document.querySelectorAll('.nextButton');
    nextButtons.forEach(button => {
        button.addEventListener('click', showNextQuestion);
    });

    for (let i = 0; i < submitAns.length; i++) {
        submitAns[i].addEventListener('click', displayScore);
    }

    class SmartPrompt {
        constructor(opts) {
            return new Promise((res, rej) => {
                setTimeout(() => {
                    res({ getForm: () => document.querySelector('.modal-template') });
                }, 500); // Mocking delay for SmartPrompt creation
            });
        }
    }

    new SmartPrompt().then(instance => {
        prompt = instance;
    });
    submitButton.addEventListener('click', function() {
        // Display the results box
        resultsBox.style.display = 'block';
    });
});
