# custom-link-utm
Передача UTM-меток через "произвольные ссылки"


Возможность передавать произвольный набор переменных и utm-меток с помощью "Произвольных ссылок"

1. В файле dl.php необходимо указать данные доступа к Вашей MySQL базе данных

2. В базу данных импортировать файл deepLinkData.sql Это создаст таблицу с нужной структурой данных

3. Добавьте на страницу Вашего сайта следующий код

-- пример ссылки/кнопки
```html
<a href="https://t.me/namebot?start=custom_link" class="ss-btn">Telegram</a>
```

-- сам код
```html
<script src="https://example.com/dl.js"></script>
<script>
ssCustomLink('ss-btn', 'https://example.com/dl.php', true, {
variables: {
name: 'value',
}
});
</script>
```

где:
- https://t.me/namebot?start=custom_link - "Произвольная ссылка" на Ваш бот
- https://example.com/dl.js - ссылка на файл dl.js из этого репозитория на Вашем хостинге
- ss-btn - Клас елементов с "произвольний ссылкой" Вашего бота
- https://example.com/dl.php - ссылка на файл dl.php из этого репозитория на Вашем хостинге
- true - Автоматически добавлять в переменные все query-параметры из ссылки сайта
- name - название переменной
- value - записываемое значение
P.S. Строку name: 'value', (переменная и ее значение) можно указать необходимое количество раз (на каждую отдельную переменную)

4. В воронке, которая запускается по "произвольной ссылке" добавить действие > Внешний запрос на файл dl.php из этого репозитория на Вашем хостинге
- на вкладке запрос указать dataId > переменная, в которую сохраняется произвольный параметр https://image.mufiksoft.com/chrome_F3r68wKCOw.jpg
- на вкладке соответствия указать набор необходимых соответствий согласно передаваемым переменныи из сайта https://image.mufiksoft.com/chrome_fvm5vCABO3.jpg
- также есть несколько дополнительных значений, которые вычисляются автоматически https://image.mufiksoft.com/chrome_IBx23kXQAJ.jpg https://image.mufiksoft.com/chrome_E7o7Jrnzgl.jpg


Если Вы не можете управлять класами ссылок в Вашем редакторе страниц, используйте код ниже (вместо предыдущего). Он сам дополнительно присваивает всем кнопкам мессенджеров дополнительный класс;

```html
<script src="https://example.com/dl.js"></script>
<script>
    const links = document.querySelectorAll('a');
    if( links ) {
        for( const link of links ) {
            if (
                link.href.includes("tg://resolve") || 
                link.href.includes("https://t.me/") ||
                link.href.includes("https://direct.smartsender.com/redirect") || 
                link.href.includes("viber://pa") ||
                link.href.includes("https://vk.com/app") || 
                link.href.includes("vk://vk.com/app") ||
                link.href.includes("https://m.me") ||
                link.href.includes("https://wa.me") || 
                link.href.includes("whatsapp://send")
            ) {
                link.classList.add('ss-btn');
            }
        }
    }
</script>
<script>
ssCustomLink('ss-btn', 'https://example.com/dl.php', true, {
variables: {
name: 'value',
}
});
</script>
```



ВНИМАНИЕ!!! Код должен находится ниже кнопок по структуре страницы, чтобы на момент его выполнения, кнопки уже были загружены на странице, иначе код не "увидит" этих кнопок
