document.addEventListener('DOMContentLoaded', () => {
  
  const username = document.getElementById('username');
  const id = document.getElementById('id');
  const ul = document.getElementById('usersUl');

  const socket = io();

  socket.emit('users-online', {
    username: username.value,
    id: id.value
  });

  socket.on('update-online-users', onlineUsers => {
    console.log(onlineUsers)
    ul.innerHTML = '';
    if (onlineUsers.length !== 0) {
      onlineUsers.forEach(user => {
        const li = document.createElement('li')
        const p = document.createElement('p')
        li.classList.add('nav-item');
        p.classList.add('nav-link');
        p.innerText = "🔸 " + user.username;
        li.append(p);
        ul.append(li);
      });
    }
  });
});
