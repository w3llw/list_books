// Выбираем элементы DOM
const form = document.querySelector('#bookForm');  // Форма для добавления новой книги
const bookList = document.querySelector('#bookList');  // Список, в котором отображаются книги
const noBooksMessage = document.querySelector('#noBooksMessage');  // Сообщение, которое показывается, если нет книг

// Массив для хранения книг
const books = [];

// Получаем сохраненные книги из localStorage
const savedBooks = localStorage.getItem('books');
if (savedBooks) {
    // Если книги найдены в localStorage, парсим их и добавляем в массив books
    const booksFromLS = JSON.parse(savedBooks);
    books.push(...booksFromLS);
    // Отображаем каждую книгу из localStorage
    booksFromLS.forEach((book) => {
        renderBook(book);
    });
}

// Слушаем событие отправки формы для добавления новой книги
form.addEventListener('submit', addBook);

function addBook(evt) {
    evt.preventDefault();  // Предотвращаем стандартное поведение формы

    // Получаем значения из полей ввода для названия книги и автора
    const titleInput = document.querySelector('#titleInput');
    const authorInput = document.querySelector('#authorInput');

    // Проверяем, что название и автор не пустые
    if (titleInput.value.trim() === '' || authorInput.value.trim() === '') {
        titleInput.value = '';
        authorInput.value = '';
        titleInput.focus();
        authorInput.focus();
        return;  // Прерываем выполнение, если поля пустые
    }

    // Создаем объект книги
    const book = {
        id: crypto.randomUUID(),  // Генерируем уникальный ID для книги
        title: titleInput.value.trim(),
        author: authorInput.value.trim(),
        status: false,  // Изначально книга не помечена как прочитанная
    };

    // Добавляем новую книгу в массив books
    books.push(book);

    // Сохраняем обновленный массив книг в localStorage
    localStorage.setItem('books', JSON.stringify(books));

    // Отображаем новую книгу в списке
    renderBook(book);

    // Очищаем поля ввода и фокусируемся на поле с названием
    titleInput.value = '';
    authorInput.value = '';
    titleInput.focus();
    authorInput.focus();
}

// Слушаем события клика на элементы списка книг (для переключения статуса прочтения или удаления)
bookList.addEventListener('click', toggleComplete);
bookList.addEventListener('click', deleteBook);

function renderBook(book) {
    // HTML-шаблон для отображения книги
    const bookHTML = `
        <li data-book-id="${book.id}" data-book-status="${book.status}" class="flex items-center justify-between p-4 rounded-md shadow-md">
                <div>
                    <h2 class="text-lg font-semibold">${book.title}</h2>
                    <p class="text-sm text-gray-600">${book.author}</p>
                </div>
                <div class="flex items-center space-x-2">
                <label class="flex items-center space-x-1">
                    <input type="checkbox" data-action="complete" class="h-5 w-5 text-green-600">
                    <span class="text-sm">Прочитано</span>
                </label>
                    <button data-action="delete" class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">Удалить</button>
                </div>
            </li>
    `;

    // Добавляем HTML книги в список книг
    bookList.insertAdjacentHTML('beforeend', bookHTML);

    // Если в списке есть книги, скрываем сообщение о том, что книг нет
    if (bookList.children.length >= 1) {
        noBooksMessage.classList.add('hidden');
    }
}

function toggleComplete(evt) {
    // Срабатывает только если кликнут элемент с атрибутом "complete"
    if (evt.target.dataset.action !== 'complete') {
        return;
    }

    const completeButton = evt.target;
    const book = completeButton.closest('li');  // Получаем <li> элемент книги
    book.classList.toggle('bg-green-300');  // Переключаем фон для статуса "прочитано"

    // Переключаем статус книги (прочитана/не прочитана)
    const bookStatus = book.dataset.bookStatus === 'false' ? false : true;
    book.dataset.bookStatus = !bookStatus;

    // Находим книгу в массиве и обновляем ее статус
    const bookId = book.dataset.bookId;
    const foundBook = books.find((book) => book.id === bookId);
    foundBook.done = !bookStatus;  // Обновляем статус завершения книги

    // Сохраняем обновленный массив книг в localStorage
    localStorage.setItem('books', JSON.stringify(books));
}


function deleteBook(evt) {
    // Срабатывает только если кликнут элемент с атрибутом "delete"
    if (evt.target.dataset.action !== 'delete') {
        return;
    }

    const deleteButton = evt.target;
    const book = deleteButton.closest('li');  // Получаем <li> элемент книги
    const bookId = book.dataset.bookId;  // Получаем ID книги
    const bookIndex = books.findIndex((book) => book.id === bookId);  // Находим индекс книги в массиве

    // Удаляем книгу из массива books
    books.splice(bookIndex, 1);

    // Сохраняем обновленный массив книг в localStorage
    localStorage.setItem('books', JSON.stringify(books));

    // Удаляем книгу из DOM
    book.remove();

    // Если в списке нет книг, показываем сообщение о том, что книг нет
    if (bookList.children.length === 0) {
        noBooksMessage.classList.remove('hidden');
    }
}
