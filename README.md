# aitmo client

Приложение для удобного проведения вебинаров, совместной работы,
экзаменации, собеседований.

- Установить зависимости `npm install`
- Запустить сначала сервер, затем клиент `npm start`

## Инструкция

1. Перейдите по ссылке, нажмите кнопку "Create Room", чтобы создать комнату
2. Введите Ваше имя и нажмите "Ок"
3. Скопируйте текущий адрес и отправьте ссылку друзьям
4. Начните общаться, стримить или писать код вместе с другими участниками вашей комнаты

### Справка

По умолчанию порт сервера 5000, порт клиента 3000.

Приложение использует библиотеки Socket.io и Peer.js для коммуникации между участниками.

В файле `src/config/servers.js` можно задать адрес сервера.

Имя пользователя хранится в localStorage, поэтому
с новой вкладки браузера подключения не будет. Для проверки используйте режим инкогнито, другой браузер или компьютер.

Если нужно будет сменить имя, нажмите на него мышью вверху после слова Welcome )

![Скриншот приложения](screenshots/1.png)
