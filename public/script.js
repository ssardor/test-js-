function updateResponse(message, isError = false) {
  const responseDiv = document.getElementById('response');
  
  if (typeof message === 'string' && message.startsWith('{')) {
    try {
      // Парсим JSON
      const data = JSON.parse(message);
      // Создаем красивую таблицу
      let html = '<table style="width: 100%; border-collapse: collapse;">';
      for (const [key, value] of Object.entries(data)) {
        html += `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold;">${key}</td>
            <td style="padding: 8px;">${value}</td>
          </tr>
        `;
      }
      html += '</table>';
      responseDiv.innerHTML = html;
      responseDiv.style.color = 'black';
      return;
    } catch (e) {    }
  }
  
  // Для ошибок и обычных сообщений
  responseDiv.innerHTML = message;
  responseDiv.style.color = isError ? 'red' : 'green';
}

// Функция проверки полей
function validateFields() {
  const idInstance = document.getElementById("idInstance").value;
  const apiTokenInstance = document.getElementById("apiTokenInstance").value;

  if (!idInstance || !apiTokenInstance) {
    updateResponse('Ошибка: idInstance и apiTokenInstance обязательны', true);
    return false;
  }
  return { idInstance, apiTokenInstance };
}

// Обработчик для кнопки Get Settings
document.getElementById("getSettings").addEventListener("click", () => {
  const fields = validateFields();
  if (!fields) return;

  fetch(`http://localhost:3000/green-api?idInstance=${fields.idInstance}&apiTokenInstance=${fields.apiTokenInstance}`)
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Ошибка запроса: ${response.status}`);
      }
      // Создаем красивую таблицу для настроек
      let html = '<table style="width: 100%; border-collapse: collapse;">';
      for (const [key, value] of Object.entries(data)) {
        html += `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold;">${key}</td>
            <td style="padding: 8px;">${value}</td>
          </tr>
        `;
      }
      html += '</table>';
      document.getElementById('response').innerHTML = html;
    })
    .catch(error => {
      updateResponse(`Ошибка: ${error.message}`, true);
    });
});

// Обработчик для кнопки Get State Instance
document.getElementById("getStateInstance").addEventListener("click", () => {
  const idInstance = document.getElementById("idInstance").value.trim();
  const apiTokenInstance = document.getElementById("apiTokenInstance").value.trim();

  if (!idInstance || !apiTokenInstance) {
    updateResponse('Ошибка: idInstance и apiTokenInstance обязательны', true);
    return;
  }

  fetch(`https://7103.api.greenapi.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`)
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Ошибка запроса: ${response.status}`);
      }
      // Создаем красивую таблицу для состояния
      let html = '<table style="width: 100%; border-collapse: collapse;">';
      for (const [key, value] of Object.entries(data)) {
        html += `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold; background-color: #f5f5f5; width: 30%;">${key}</td>
            <td style="padding: 8px; color: ${value === 'authorized' ? 'green' : 'black'};">${value}</td>
          </tr>
        `;
      }
      html += '</table>';
      document.getElementById('response').innerHTML = html;
    })
    .catch(error => {
      updateResponse(`Ошибка: ${error.message}`, true);
    });
});

// Функция для форматирования и отображения ответа
function formatResponse(data) {
  let html = '<table style="width: 100%; border-collapse: collapse;">';
  for (const [key, value] of Object.entries(data)) {
    html += `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 8px; font-weight: bold;">${key}</td>
        <td style="padding: 8px;">${value}</td>
      </tr>
    `;
  }
  html += '</table>';
  return html;
}

// Обработчик для кнопки Send Message
document.getElementById("sendMessage").addEventListener("click", () => {
  const fields = validateFields();
  if (!fields) return;

  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!phone || !message) {
    updateResponse('Ошибка: номер телефона и сообщение обязательны', true);
    return;
  }

  const url = `https://7103.api.greenapi.com/waInstance${fields.idInstance}/sendMessage/${fields.apiTokenInstance}`;
  const payload = {
    chatId: `${phone}@c.us`,
    message: message
  };

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Ошибка запроса: ${response.status}`);
      }
      document.getElementById('response').innerHTML = formatResponse(data);
    })
    .catch(error => {
      updateResponse(`Ошибка: ${error.message}`, true);
    });
});

// Обработчик для кнопки Send File
document.getElementById("sendFileByUrl").addEventListener("click", () => {
  const fields = validateFields();
  if (!fields) return;

  const phone = document.getElementById("phone").value.trim();
  const fileUrl = document.getElementById("fileUrl").value.trim();

  if (!phone || !fileUrl) {
    updateResponse('Ошибка: номер телефона и URL файла обязательны', true);
    return;
  }

  const url = `https://7103.api.greenapi.com/waInstance${fields.idInstance}/sendFileByUrl/${fields.apiTokenInstance}`;
  const payload = {
    chatId: `${phone}@c.us`,
    urlFile: fileUrl,
    fileName: fileUrl,
    caption: fileUrl
  };

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Ошибка запроса: ${response.status}`);
      }
      document.getElementById('response').innerHTML = formatResponse(data);
    })
    .catch(error => {
      updateResponse(`Ошибка: ${error.message}`, true);
    });
});
