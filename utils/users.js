const users = [];

// Join user to chat
function userJoin(id, username, channel_id) {
    const user = { id, username, channel_id };
    users.push(user);
    return user;
}

// Get current
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

module.exports = { 
    userJoin, 
    getCurrentUser
}