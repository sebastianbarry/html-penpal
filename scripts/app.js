let message = [];
let startTime = Date.now();
let firstKeyPress = true;
const messageBox = document.getElementById('messagebox');

messageBox.addEventListener('input', recordKeystrokes)

// Function to record the keystrokes
function recordKeystrokes(event) {
  if (firstKeyPress) {
    // Start recording on the first keypress
    firstKeyPress = false;
    startTime = Date.now();
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
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    // Stop recording on Escape
    const encodedData = encodeURIComponent(JSON.stringify(message));
    const url = window.location.href.split('?')[0] + '?data=' + encodedData;
    navigator.clipboard.writeText(url);
    alert("Message URL copied to clipboard!");
    return;
  }
});

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

document.addEventListener('DOMContentLoaded', async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedData = urlParams.get('data');

  if (!encodedData) {
    return;
  }

  const receivedMessage = JSON.parse(decodeURIComponent(encodedData));
  console.log('received message! JSON: ', receivedMessage);

  let currentMessage = '';

  for (let i = 0; i < receivedMessage.length; i++) {
    const key = receivedMessage[i].key;
    const time = receivedMessage[i].time;

    if (key === 'backspace') {
      currentMessage = currentMessage.slice(0, -1);
    } else {
      currentMessage += key;
    }

    await sleep(time);

    messageBox.setAttribute('value', currentMessage);
  }
});
