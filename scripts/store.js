'use strict';

const bookmarks = [];
let error = null;

  //adds bookmark object to store
const addBookmark = function(bookmark) {
  this.bookmarks.push(bookmark);
};

//finds id of bookmark object in store
const findById = function (id) {
  return bookmarks.find(currentBookmark => currentBookmark.id ===id);
};

//finds bookmark in store and deletes
const findAndDelete = function (id) {
  this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id !==id);
};

const setError = function(error) {
  this.error=error;
};

  export default {
    bookmarks,
    addBookmark,
    findById,
    findAndDelete,
    setError,
    error,
  }