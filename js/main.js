const Render = {
  scrollToElement: function(id) {

    const index = $('#' + id).index();
    const messages = $(`.message:lt(${index})`);
    let offsetTop = 0;

    // Calculating total height of new messages
    messages.each((n, el) => offsetTop += $(el).outerHeight(true));

    $('#messagesBlock').scrollTop(offsetTop);
  },
  _tpl: (template, data) => {

    $.each(data, (key, val) => {
      template = template.split('{' + key + '}').join(val || '');
    });

    return template.replace(/{[^}]+}/g, '');
  },
  createItem: function(el) {
    const tpl = $('#messageTpl').html().trim();
    el.type = (el.username === Chat.username) ? 'me' : '';
    return this._tpl(tpl, el);
  },
  add: function(el) {

    const messagesBlock = $('#messagesBlock');
    const html = this.createItem(el);

    messagesBlock.append(html);
    messagesBlock.scrollTop(messagesBlock[0].scrollHeight);
    this.pencil(false);
  },
  reset: () => $('#message').val(''),
  _activity: null,
  pencil: function(data) {

    const toggle = function(status, text) {
      $('#preview').toggle(status).text(text || '');
      $('.pencil').toggle(status);
    };

    const hide = function() {
      clearTimeout(this._activity);
      this._activity = {};
      toggle(false);
    };

    if (!data) return hide();

    clearTimeout(this._activity);
    this._activity = setTimeout(hide, 3000);
    toggle(true, data.username + ' : ' + data.message);
  },
  init: (username) => $('h1').text('User: ' + username)
};

const Chat = (function() {

  const username = prompt('What\'s your username?');
  const socket = io.connect('http://172.28.180.48:8080');
  const Player = document.getElementById('player');

  const input = (obj) => {
    socket.emit('put', {
      username: username,
      message: obj.value.trim()
    });
  };

  const keyup = (obj) => {
    const message = obj.value.trim();
    if (event.keyCode == 13 && message.length) {
      socket.emit('message', message);
      Render.reset();
    }
  };

  const messagesAdd = (data) => {
    if (data.username !== username) {
      Player.play();
    }
    Render.add(data);
  };

  const init = () => {
    socket.on('message', messagesAdd);
    socket.on('put', Render.pencil);
    socket.emit('login', username);
    Render.init(username);
  };

  return {
    username,
    input,
    keyup,
    init
  }
})();

$(Chat.init);