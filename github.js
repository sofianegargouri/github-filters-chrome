const closeButton = '<button class="SelectMenu-closeButton" type="button" data-toggle-for="filters-select-menu">' +
  '<svg aria-label="Close menu" aria-hidden="false" class="octicon octicon-x" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>' +
'</button>'

function addSaveButton() {
  $('#filters-select-menu .SelectMenu-list')
    .append(
      '<a class="SelectMenu-item" id="save-filter" role="menuitemradio" href="#">' +
        '<svg class="octicon octicon-bookmark mr-2" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M9 0H1C.27 0 0 .27 0 1v15l5-3.09L10 16V1c0-.73-.27-1-1-1zm-.78 4.25L6.36 5.61l.72 2.16c.06.22-.02.28-.2.17L5 6.6 3.12 7.94c-.19.11-.25.05-.2-.17l.72-2.16-1.86-1.36c-.17-.16-.14-.23.09-.23l2.3-.03.7-2.16h.25l.7 2.16 2.3.03c.23 0 .27.08.09.23h.01z"></path></svg>' +
        '<strong>Save current filter</strong>' +
      '</a>'
    );
}

function addLinkToFilters(savedFilter) {
  const basePath = window.location.href.match(/.+github.com\/([^\/]+)\/([^\/]+)\/([^\/?]+)/g)

  $('#filters-select-menu .SelectMenu-list')
    .prepend(
      '<a class="SelectMenu-item" role="menuitemradio" aria-checked="false" href="'+ basePath +'?q='+ _.escape(savedFilter) +'" data-extension="true" data-filter="'+ _.escape(savedFilter) +'">' +
        closeButton + '&nbsp;&nbsp;' + savedFilter +
      '</a>'
    );
}

function addFiltersToSavedFilters() {
  chrome.storage.sync.get(['savedFilters'], function(result) {
    _.forEach(result.savedFilters, function(savedFilter) {
      addLinkToFilters(savedFilter);
    })
  })
}

function init() {
  addSaveButton();
  addFiltersToSavedFilters();
}

$(document).on('click', '#save-filter', function() {
  try {
    const newFilter = $('#js-issues-search').val();

    chrome.storage.sync.get(['savedFilters'], function(result) {
      chrome.storage.sync.set({
        savedFilters: _.uniq(_.concat(result.savedFilters, newFilter))
      }, function() {
        addLinkToFilters(newFilter);
      })
    })
  } catch(err) {
    console.error(err)
  }
});

$(document).on('click', '.SelectMenu-item[data-extension="true"] .SelectMenu-closeButton', function(a,b,c) {
  try {
    const value = $(this).parent().data('filter');

    chrome.storage.sync.get(['savedFilters'], function(result) {
      chrome.storage.sync.set({
        savedFilters: _.filter(result.savedFilters, function(savedFilter) {
          return savedFilter !== value;
        }),
      }, function() {
        $(this).parent().remove();
      })
    })
  } catch(err) {
    console.error(err)
  }
});

window.addEventListener('pjax:end', init)
window.addEventListener('load', init)
