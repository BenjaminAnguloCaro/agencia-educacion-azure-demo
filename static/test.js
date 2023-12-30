let lastClickedPromptText = '';

function sendQuestion() {
    const questionInput = document.getElementById('input_chatbot_chile');
    const question = questionInput.value;

    const fullQuestion = question + ' ' + lastClickedPromptText;
  
    const url = "https://agencia-educacion-s.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=agencia-eduacion-talleres&api-version=2021-10-01&deploymentName=production";
    const headers = {
      "Ocp-Apim-Subscription-Key": "PUT THE SECRET KEY HERE",
      "Content-Type": "application/json",
    };
  
    const data = {
      top: 3,
      question: fullQuestion,
      includeUnstructuredSources: true,
      confidenceScoreThreshold: 0,
    };
  
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(responseData => displayResponse(responseData))
      .catch(error => console.error(error));
  }
  
  function displayResponse(data) {
    const conversationElement = document.getElementById('conversation');
    const questionInput = document.getElementById('input_chatbot_chile');
    const question = questionInput.value;

    if (question) {
        const messageRow = document.createElement('tr');
        messageRow.classList.add('message');

        const userMessageCell = document.createElement('td');
        const userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('message_chatbot_chile');
        userMessageDiv.innerHTML = `${question}`;
        userMessageCell.appendChild(userMessageDiv);
        messageRow.appendChild(userMessageCell);

        const tbody = document.getElementById('single_message_chatbot_chile');
        tbody.appendChild(messageRow);
    }

    if (!data.answers || data.answers.length === 0 || !data.answers[0].answer) {
        const botMessageCell = document.createElement('td');
        const botMessageDiv = document.createElement('div');
        botMessageDiv.classList.add('message_bot_chatbot_chile');
        botMessageDiv.innerHTML = `No se ha encontrado respuesta. Intente preguntando nuevamente.`;
        botMessageCell.appendChild(botMessageDiv);

        const lastRow = document.querySelector('#single_message_chatbot_chile tr:last-child');
        if (lastRow) {
            lastRow.appendChild(botMessageCell);
        }
        console.error('Error: Respuesta no válida recibida.');
    } else {
        const botMessageCell = document.createElement('td');
        const botMessageDiv = document.createElement('div');
        botMessageDiv.classList.add('message_bot_chatbot_chile');

        const answerSource = data.answers[0].source;
        let answerMetadata = 'https://' + data.answers[0].metadata.source
        answerMetadata = answerMetadata.replace(/upper([a-z])/g, (match, p1) => p1.toUpperCase());
        answerMetadata = answerMetadata.replace(/upper/g, '');
        const formattedAnswer = data.answers[0].answer.replace(/\n/g, '<br>');

        const boldFormattedAnswer = formattedAnswer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        botMessageDiv.innerHTML = `${boldFormattedAnswer}`;

        const prompts = data.answers[0].dialog && data.answers[0].dialog.prompts;
        if (prompts && prompts.length > 0) {
            const promptsList = document.createElement('ul');
            prompts.forEach(prompt => {
                const listItem = document.createElement('li');
                const button = document.createElement('button');
                button.textContent = prompt.displayText;
                button.addEventListener('click', () => {
                    sendPromptQuestion(prompt.qnaId, prompt.displayText);
                });
                listItem.appendChild(button);
                promptsList.appendChild(listItem);
            });

            const botMessagePromptDiv = document.createElement('div');
            botMessagePromptDiv.appendChild(promptsList);
            botMessageDiv.appendChild(botMessagePromptDiv);
        }

        if (answerSource) {
            const infoMessage = document.createElement('div');
            infoMessage.innerHTML = `<br>Información obtenida de: ${answerSource}<br>Para más información haga clic <a href="${answerMetadata}" target="_blank">aquí</a>`;
            botMessageDiv.appendChild(infoMessage);
        }

        botMessageCell.appendChild(botMessageDiv);

        const botMessageRow = document.createElement('tr');
        botMessageRow.appendChild(botMessageCell);

        const tbody = document.getElementById('single_message_chatbot_chile');
        tbody.appendChild(botMessageRow);

        console.log(JSON.stringify(data.answers[0]));
    }

    questionInput.value = '';
    lastClickedPromptText = '';
}

  
function sendPromptQuestion(promptId, promptText) {
    const url = "https://agencia-educacion-s.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=agencia-eduacion-talleres&api-version=2021-10-01&deploymentName=production";
    const headers = {
        "Ocp-Apim-Subscription-Key": "PUT THE SECRET KEY HERE",
        "Content-Type": "application/json",
    };

    const data = {
        top: 3,
        qnaId: promptId,
        includeUnstructuredSources: true,
        confidenceScoreThreshold: 0,
    };

    fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(responseData => {
            const questionInput = document.getElementById('input_chatbot_chile');
            questionInput.value = promptText;

            displayResponse(responseData);
        })
        .catch(error => console.error(error));
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendQuestion();
    }
}
