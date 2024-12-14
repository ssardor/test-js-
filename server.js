const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.json()); 

// Прокси для запросов к Green API
app.get("/green-api", async (req, res) => {
  const { idInstance, apiTokenInstance } = req.query;
  if (!idInstance || !apiTokenInstance) {
    return res
      .status(400)
      .json({ error: "idInstance и apiTokenInstance обязательны" });
  }

  const url = `https://7103.api.greenapi.com/waInstance${idInstance}/getSettings/${apiTokenInstance}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {},
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Ошибка при запросе к Green API" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Ошибка при запросе к Green API:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Получение состояния инстанса
app.get('/green-api/state', async (req, res) => {
  try {
    const { idInstance, apiTokenInstance } = req.query;
    
    if (!idInstance || !apiTokenInstance) {
      return res.status(400).json({ error: 'idInstance и apiTokenInstance обязательны' });
    }

    // Изменяем формат URL
    const url = `https://7103.api.greenapi.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`;
    
    console.log('Making request to:', url);

    const response = await fetch(url, { 
      method: 'GET'
    });
    
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response text:', responseText);

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Ошибка при запросе к Green API',
        details: responseText
      });
    }

    const data = JSON.parse(responseText);
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: error.message 
    });
  }
});

// Отправка текстового сообщения
app.post("/green-api/send-message", async (req, res) => {
  const { idInstance, apiTokenInstance, phone, message } = req.body;
  if (!idInstance || !apiTokenInstance || !phone || !message) {
    return res
      .status(400)
      .json({
        error: "idInstance, apiTokenInstance, phone и message обязательны",
      });
  }

  const url = `https://7103.api.greenapi.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
  const body = { phone, message };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Ошибка при отправке сообщения" });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Ошибка при отправк�� сообщения:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Отправка файла по URL
app.post("/green-api/send-file", async (req, res) => {
  const { idInstance, apiTokenInstance, phone, fileUrl } = req.body;
  if (!idInstance || !apiTokenInstance || !phone || !fileUrl) {
    return res
      .status(400)
      .json({
        error: "idInstance, apiTokenInstance, phone и fileUrl обязательны",
      });
  }

  const url = `https://7103.api.greenapi.com/waInstance${idInstance}/sendFileByUrl/${apiTokenInstance}`;
  const body = { phone, fileUrl };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Ошибка при отправке файла" });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Ошибка при отправке файла:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});
