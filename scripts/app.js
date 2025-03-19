let message = [];
let startTime = Date.now();
let firstKeyPress = true;
const messageBox = document.getElementById('messagebox');
const sendButton = document.getElementById('send');
const replyButton = document.getElementById('reply');

// Sleep function to delay the typing
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))


document.addEventListener('DOMContentLoaded', async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedData = urlParams.get('data');

  if (!encodedData) {
    return;
  }

  const receivedMessage = JSON.parse(decodeURIComponent(encodedData));
  console.log('received message! JSON: ', receivedMessage);

  messageText = '';

  for (let i = 0; i < receivedMessage.length; i++) {
    const key = receivedMessage[i].key;
    const time = receivedMessage[i].time;

    if (key === 'backspace') {
      messageText = messageText.slice(0, -1);
    } else {
      messageText += key;
    }

    await sleep(time);

    messageBox.setAttribute('value', messageText);
  }
  replyButton.style.display = 'block';
});


// Record keypresses
messageBox.addEventListener('input', function (event) {
  if (firstKeyPress) {
    // Start recording on the first keypress
    firstKeyPress = false;
    startTime = Date.now() - 500; // Initial pause before playback
    sendButton.style.display = 'block';
  }
  const currentTime = Date.now();
  const timeElapsed = currentTime - startTime;

  const inputChar = event.data;  // `event.data` holds the character that was just typed

  if (inputChar === null) {
    // If backspace is pressed, record it as 'backspace'
    message.push({ key: "backspace", time: timeElapsed });
  } else {
    message.push({ key: inputChar, time: timeElapsed });
  }

  startTime = currentTime;
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    send();
  }
});


document.addEventListener('click', function (event) {
  if (event.target.id === 'send') {
    send();
  }
  else if (event.target.id === 'reply') {
    reply();
  }
});

function send() {
  const encodedData = encodeURIComponent(JSON.stringify(message));
  const url = window.location.href.split('?')[0] + '?data=' + encodedData;
  navigator.clipboard.writeText(url);
  alert("Message URL copied to clipboard!");
}

function reply() {
  // Clear the message box
  message = [];
  messageBox.value = '';
  firstKeyPress = true;
  startTime = Date.now();
  replyButton.style.display = 'none';
}