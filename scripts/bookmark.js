'use strict';

import store from './store.js';
import api from './api.js';


//renders DOM
const render = function () {
    renderError();
    let bookmarks = [...store.bookmarks];
    const bookmarksListString = generateBookmarkString(bookmarks);
    $('.bookmark-ul').html(bookmarksListString);
};

//generates error html
const generateError = function (message) {
    return `
        <section class="error-content">
          <button id="cancel-error">X</button>
          <p>${message}</p>
        </section>
      `;
  };

//gets id from bookmark
const getItemIdFromBookmark = function(bookmark) {
    return $(bookmark)
        .closest('.bookmark-li')
        .data('item-id');
};

//renders error 
const renderError = function () {
    if (store.error) {
      const err = generateError(store.error);
      $('.error-container').html(err);
    } else {
      $('.error-container').empty();
    }
  };

//handles click of new bookmark button
const handleFormOpenClick = function() {
    $('.add-bookmark-form-section').on('click', '.open-form', function(event) {
        event.preventDefault();
        $('#add-bookmark-form').removeClass('hidden');
    });
};

//handles click of close button on new bookmark form
const handleFormCloseClick = function() {
    $('#add-bookmark-form').on('click', '.close-form', function(event) {
        event.preventDefault();
        $('#add-bookmark-form').addClass('hidden');
    });
};

//handles submission of new bookmark
const handleNewBookmarkSubmission = function() {
    $('#add-bookmark-form').on('click', '.submit', function (event) {
        event.preventDefault();
        const newBookmarkTitle = $('#add-title').val();
        const newBookmarkUrl = $('#add-url').val();
        const newBookmarkDescription = $('#add-description').val();
        const newBookmarkRating = $("input[name='add-rating']:checked").val();
        api.createBookmark(newBookmarkTitle, newBookmarkUrl, newBookmarkDescription, newBookmarkRating)
            .then((newBookmark) => {
                console.log(newBookmark)
                store.addBookmark(newBookmark)
                $('#add-bookmark-form').addClass('hidden');
            render();
            })
            .catch(err => {
                store.setError(err.message);
                renderError();
            });
            $("#add-bookmark-form")[0].reset();
    });
};

//handles click of delete button of bookmark
const handleBookmarkDeleteClick = function() {
    $('.bookmark-section').on('click', '.delete', function (event) {
        event.preventDefault();
        const id = getItemIdFromBookmark(event.currentTarget);
        console.log(id);
        api.deleteBookmark(id)
        .then (() => {
            store.findAndDelete(id);
        render();
    })
    .catch(err => {
        store.setError(err.message);
        renderError();
    });
    });
};

//displays bookmarks filtered by rating
const handleBookmarkFilter = function() {
    $('.filter-section').on('click', '.filter-button', function(event) {
        console.log(store.bookmarks);
        store.bookmarks.forEach(bookmark => filterBookmarks(bookmark));
    });
};

//filters Bookmarks based on rating
const filterBookmarks = function (bookmark) {
    let minRating = $('#rating-select').val();
    console.log(bookmark);
    if (bookmark.rating < minRating) {
        console.log('oooweee');
        $('.bookmark-li').addClass('hidden');
    };
};

//generates bookmark element
const generateBookmarkElement = function(bookmark) {
    return `
<li class='bookmark-li' data-item-id="${bookmark.id}">
    <h2>${bookmark.title}</h2>
    <ul>
        <li class='url'>${bookmark.url}</li>
        <li class='description'>${bookmark.description}</li>
        <li class='rating'>${bookmark.rating}</li>
    </ul>
    <button class='delete' type='button'>Delete</button>
</li>`
};

//creates strings for bookmarks
const generateBookmarkString= function(bookmarksList) {
    const bookmarks = bookmarksList.map((bookmark) => generateBookmarkElement(bookmark));
    return bookmarks.join('');
};

const bindEventListeners = function () {
    handleBookmarkFilter();
    handleBookmarkDeleteClick();
    handleNewBookmarkSubmission();
    handleFormOpenClick();
    handleFormCloseClick();
};

export default {
    render,
    generateBookmarkElement,
    generateBookmarkString,
    bindEventListeners
}