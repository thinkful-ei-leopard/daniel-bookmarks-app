'use strict';

const BASE_URL = 'https://thinkful-list-api.herokuapp.com/daniel-fong';

const listApiFetch = function (...args) {
    let error;
    return fetch(...args)
      .then(res => {
        if (!res.ok) {
          error = { code: res.status };
  
          if (!res.headers.get('content-type').includes('json')) {
            error.message = res.statusText;
            return Promise.reject(error);
          }
        }

        return res.json();
      })
      .then(data => {
        if (error) {
          error.message = data.message;
          return Promise.reject(error);
        }
        return data;
      });
  };

  function createBookmark(title, url, desc, rating) {
    let newBookmark = JSON.stringify({
        title,
        url,
        desc,
        rating,
    });
    console.log(newBookmark);
    return listApiFetch(`${BASE_URL}/bookmarks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: newBookmark
    });
  };

  //retrieves bookmarks
  function getBookmarks() {
    return listApiFetch(`${BASE_URL}/bookmarks`)  
  };

  //deletes bookmarks
  function deleteBookmark(id) {
      return listApiFetch(`${BASE_URL}/bookmarks/${id}`, {
          method: 'DELETE',
      });
  };

  export default {
    createBookmark,
    getBookmarks,
    deleteBookmark,

  };

