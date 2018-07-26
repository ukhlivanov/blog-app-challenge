var blogItemTemplate = (
  '<li class="js-blog-item">' +
  '<p><span class="blog-item js-blog-item-title"></span></p>' +
  '<p><span class="blog-item js-blog-item-author"></span></p>' +
  '<p><span class="blog-item js-blog-item-content"></span></p>' +
  '<p><span class="blog-item js-blog-item-publishDate"></span></p>' +
  '<div class="blog-item-controls">' +
  '<button class="js-blog-item-toggle">' +
  '<span class="button-label">check</span>' +
  '</button>' +
  '<button class="js-blog-item-delete">' +
  '<span class="button-label">delete</span>' +
  '</button>' +
  '</div>' +
  '</li>'
);
var BLOG_LIST_URL = '/blog-list';

function getAndDisplayBlogList() {
  console.log('Retrieving blog list');
  $.getJSON(BLOG_LIST_URL, function(items) {
    console.log('Rendering blog list');

    var itemElements = items.map(function(item) {
    console.log(item);
    var element = $(blogItemTemplate);
    element.attr('id', item.id);

    var itemTitle = element.find('.js-blog-item-title');
    itemTitle.text(item.title);

    var itemAuthor = element.find('.js-blog-item-author');
    itemAuthor.text(item.author);

    var itemContent = element.find('.js-blog-item-content');
    itemContent.text(item.content);

    var itemPublishDate = element.find('.js-blog-item-publishDate');
    itemPublishDate.text(item.publishDate);

      element.attr('data-checked', item.checked);
      if (item.checked) {
        itemName.addClass('blog-item__checked');
      }
      return element;
    });
    $('.js-blog-list').html(itemElements);
  });
}


function deleteBlog(blogId) {
  console.log('Deleting blog `' + blogId + '`');
  $.ajax({
    url: BLOG_LIST_URL + '/' + blogId,
    method: 'DELETE',
    success: getAndDisplayBlogList
  });
}

function handleBlogDelete() {
  $('main').on('click','.js-blog-item-delete', function(e) {
    e.preventDefault();
    deleteBlog(
      $(e.currentTarget).closest('.js-blog-item').attr('id'));
  });
}

function addBlogItem(item) {
  console.log('Adding blog item: ' + item);
  $.ajax({
    method: 'POST',
    url: BLOG_LIST_URL,
    data: JSON.stringify(item),
    success: function(data) {
      getAndDisplayBlogList();
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}

function handleShoppingListAdd() {
  $('#js-blog-list-form').submit(function(e) {
    e.preventDefault();
    addBlogItem({
      title: $(e.currentTarget).find('#js-new-title').val(),
      author: $(e.currentTarget).find('#js-new-author').val(),
      content: $(e.currentTarget).find('#js-new-textArea').val(),
      publishDate: $(e.currentTarget).find('#js-new-publishDate').val()
    });
  });
}


/*function updateShoppingListitem(item) {
  console.log('Updating blog list item `' + item.id + '`');
  $.ajax({
    url: BLOG_LIST_URL + '/' + item.id,
    method: 'PUT',
    data: JSON.stringify(item),
    success: function(data) {
      getAndDisplayBlogList()
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}
function handleShoppingCheckedToggle() {
  $('.js-shopping-list').on('click', '.js-shopping-item-toggle', function(e) {
    e.preventDefault();
    var element = $(e.currentTarget).closest('.js-shopping-item');

    var item = {
      id: element.attr('id'),
      checked: !JSON.parse(element.attr('data-checked')),
      name: element.find('.js-shopping-item-name').text()
    }
    updateShoppingListitem(item);
  });
}*/


$(function() {
  getAndDisplayBlogList();
  handleBlogDelete();
  handleShoppingListAdd();
})
