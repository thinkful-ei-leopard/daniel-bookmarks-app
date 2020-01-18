'use strict';

import store from './store.js';
import api from './api.js';


//renders DOM
const render = function () {
    renderError();
    console.log('rendered');
    const bookmarksListString = generateBookmarkString(store.bookmarks);
    $('.bookmark-section').html(bookmarksListString);
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
    $('#add-bookmark-form').on('click', '.open-form', function(event) {

    });
};

//handles click of close button on new bookmark form
const handleFormCloseClick = function() {
    $('#add-bookmark-form').on('click', '.close-form', function(event) {

    });
};

//handles submission of new bookmark
const handleNewBookmarkSubmission = function() {
    console.log('handled');
    $('#add-bookmark-form').on('click', '.submit', function (event) {
        const newBookmarkTitle = $('#add-title').val();
        const newBookmarkDescription = $('#add-description').val();
        const newBookmarkUrl = $('#add-url').val();
        const newBookmarkRating = $('#add-rating').val();
        api.createBookmark(newBookmarkTitle, newBookmarkUrl, newBookmarkDescription, newBookmarkRating)
            .then((newBookmark) => {
                store.addBookmark(newBookmark)
            render();
            })
            .catch(err => {
                store.setError(err.message);
                renderError();
            });
    });
};

//handles click of delete button of bookmark
const handleBookmarkDeleteClick = function() {
    $('#add-bookmark-form').on('click', '.delete', function (event) {
        store.findAndDelete();
        render();
    });
};

//displays bookmarks filtered by rating
const handleBookmarkFilter = function() {
    $('.filter-section').on('click', '.filter-button', function(event) {
        filterBookmarks()
    });
};

//filters Bookmarks based on rating
const filterBookmarks = function () {

};

//generates bookmark element
const generateBookmarkElement = function(bookmark) {
    return `
    <div class='bookmark'>
    <h2>${bookmark.title}</h2>
    <ul>
        <li class='url'>${bookmark.url}</li>
        <li class='description'>${bookmark.description}</li class='description'>
        <li class='rating'>${bookmark.rating}</li>
    </ul>
    <button class='delete' type='button'>Delete</button>
</div>`
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