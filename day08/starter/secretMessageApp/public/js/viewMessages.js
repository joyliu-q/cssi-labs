console.log("viewMessages script running")

const MAX_ATTEMPTS = 3;
let numOfIncorrectAttempts = 0;

async function getMessages() {
    const messagesRef = firebase.database().ref();
    const submitButton = document.querySelector("#viewMsg");

    // If exceeded maximum attempts, alert and disable button
    if (numOfIncorrectAttempts >= MAX_ATTEMPTS) {
        alert("Too many incorrect attempts. Try again later.");
        submitButton.disabled = "disabled";
        submitButton.innerHTML = "Try again later";
        await new Promise(r => setTimeout(r, 5000));

        submitButton.removeAttribute("disabled");
        submitButton.innerHTML = "Click here";
        numOfIncorrectAttempts = 0
        return
    }
    // Validate message & show messages that has the input password
    messagesRef.on('value', (snapshot) => {
        const messages = snapshot.val();
        const isValid = validateMessages(messages);
        if (!isValid) {
            numOfIncorrectAttempts++;
        }
    });
}

function validateMessages(messages) {
    const passcodeAttempt = document.querySelector("#passcode").value;
    let isFound = false;
    // For each message, if the password matches with input, show message and set isFound to true
    for (message in messages) {
        const messageData = messages[message];
        if (messageData.password == passcodeAttempt) {
            renderMessageAsHtml(messageData.message, messageData.username)
            isFound = true;
        }
    }
    // If no messages with passcode found, raise alert
    if (!isFound) {
        document.getElementById('passcode').value = "";
        alert("Invalid passcode!")
    }
    return isFound
}

const renderMessageAsHtml = (message, sender) => {
    // Hide Input Form
    const passcodeInput = document.querySelector("#passcodeInput");
    passcodeInput.style.display = "none";
    // Render messageas HTML
    const messageDiv = document.querySelector("#message");
    // Wrap message in string
    messageDiv.innerHTML += `<div class="notification is-primary ${sender === "joii" ? "isMessageSelf" : "is-light isMessageOther"}"><p><b>${sender}</b></p><p>${message}</p></div>`;
    console.log(message)
}