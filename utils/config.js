const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const SECRET_KEY = 'PUT_YOUR_SECRET_KEY_HERE';
const URL_MONGO = 'mongodb://127.0.0.1:27017/mestodb';

module.exports.URL_REGEX = URL_REGEX;
module.exports.SECRET_KEY = SECRET_KEY;
module.exports.URL_MONGO = URL_MONGO;
