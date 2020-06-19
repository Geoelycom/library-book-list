class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;

    }

}

class UI {
    addBookToList(book) {
        const list = document.getElementById('book-list');
        //create tr element
        const row = document.createElement('tr');
        // insert cols
        row.innerHTML = `
<td>${book.title}</td>
<td>${book.author}</td>
<td>${book.isbn}</td>
<td><a href="#" class="delete">X<a></td>;
`;
        list.appendChild(row);
    }

    showAlert(message, className) {
        // create div
        const div = document.createElement('div');
        //add class
        div.className = `alert ${className}`;
        //add text
        div.appendChild(document.createTextNode(message));
        // Get parent
        const container = document.querySelector('.container');
        // Get form
        const form = document.querySelector('#book-form');
        //Insert alert
        container.insertBefore(div, form);
        // time out after 3 sec

        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 3000);

    }
    deleteBook(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }

    }
    clearfields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

}

// local storage class
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];

        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }


    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book) {
            const ui = new UI;

            // add book to UI
            ui.addBookToList(book);
        });

    }
    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach(function(book, index) {
            if (book.isbn === isbn)
                books.splice(index, 1);
        });
        localStorage.setItem('books', JSON.stringify(books));

    }
}

//DOM load Event
document.addEventListener('DOMcontentLoaded', Store.displayBooks);

// Event Listeners for add book
document.getElementById('book-form').addEventListener('submit', function(e) {
    //get form values
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value

    //instantiate book
    const book = new Book(title, author, isbn);

    //instantiate UI
    const ui = new UI;

    // validate 
    if (title === '' || author === '' || isbn === '') {
        //error alert
        ui.showAlert('please fill in all fields', 'error');
    } else {
        // add book to list
        ui.addBookToList(book);

        // add to Local storage
        Store.addBook(book);

        // Show success
        ui.showAlert('book Added!', 'success')

        // clear fields
        ui.clearfields();
    }

    e.preventDefault();
});

// Event Listener for delete
document.getElementById('book-list').addEventListener('click', function(e) {

    // Instantaite UI
    const ui = new UI();
    // Delete book
    ui.deleteBook(e.target);

    // remove From Ls
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // show message
    ui.showAlert('book removed!', 'success');

    e.preventDefault();
});