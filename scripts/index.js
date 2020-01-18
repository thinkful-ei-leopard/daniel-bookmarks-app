'use strict';

import store from './store.js';
import bookmark from './bookmark.js';
import api from './api.js';

const main = function() {
    api.getBookmarks()
        .then((bookmarks) => {
            bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
            bookmark.render();
        });
        bookmark.bindEventListeners();
        bookmark.render();
};

$(main);