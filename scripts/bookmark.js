'use strict';

import store from './store.js';
import api from './api.js';

let isUsingFilter = false;
let minRating = $('#rating-select').val();

//renders DOM
const render = function () {
    renderError();
    let bookmarksListString = "";
    if (isUsingFilter) {
        let bookmarks = store.bookmarks.filter(function(bookmark) {
            return bookmark.rating >= minRating;
        });
        bookmarksListString = generateBookmarkString(bookmarks);
    }
    else {
        bookmarksListString = generateBookmarkString(store.bookmarks);
    };
    $('.bookmark-ul').html(bookmarksListString);
};

//generates error html
const generateError = function (message) {
    return `
          <button id="cancel-error">X</button>
          <p>${message}</p>
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

const clearError = function () {
    $('.error-container').empty();
};

const handleCancelErrorClick = function() {
    $('.error-container').on('click', '#cancel-error', function() {
        clearError();
    });
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
        console.log(newBookmarkRating);
        console.log(newBookmarkDescription);
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
        filterBookmarks();
    });
};

//handles click on bookmark-li element
const handleClickOnBookmarkElement = function() {
    $('.bookmark-ul').on('click', '.bookmark-li', function() {
        event.preventDefault();
        let url = $(this).find('.url');
        reveal(url);
        let description = $(this).find('.description');
        reveal(description);
    });
    render();
};

const reveal =  function(element) {
    element.removeClass('hidden');
}

//filters Bookmarks based on rating
const filterBookmarks = function () {
    isUsingFilter=true;
    minRating = $('#rating-select').val();
    render();
};

const makeStars = function(rating) {
    if (rating === 1) {
        return '&starf;';
    }
    else if (rating === 2) {
        return '&starf;&starf;';
    }
    else if (rating === 3) {
        return '&starf;&starf;&starf;';
    }
    else if (rating === 4) {
        return '&starf;&starf;&starf;&starf;';
    }
    else if (rating === 5) {
        return '&starf;&starf;&starf;&starf;&starf;';
    }
}

//generates bookmark element
const generateBookmarkElement = function(bookmark) {
    let stars = makeStars(bookmark.rating);
    return `
<li class='bookmark-li' data-item-id="${bookmark.id}">
    <h2>${bookmark.title}</h2>
        <a class='url hidden' href=${bookmark.url}>Visit Site</a>
        <p class='description hidden'>${bookmark.desc}</p>
        <p class='rating'>${stars}</p>
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
    handleClickOnBookmarkElement();
    handleCancelErrorClick();
};

export default {
    render,
    generateBookmarkElement,
    generateBookmarkString,
    bindEventListeners
}