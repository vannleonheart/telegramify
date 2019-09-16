const request = require('superagent');

module.exports = function (options = {}) {
    const t = this;

    t.baseUrl = 'https://api.telegram.org/bot';

    if (options && options.baseUrl) {
        t.baseUrl = options.baseUrl.trim();

        if (!t.baseUrl.length) {
            throw new Error('ERROR:BASE_URL_UNDEFINED');
        }

        if (!/^https?\:\/\/(([a-zA-Z0-9])+\.)?[a-zA-Z0-9\-\_]+\.[a-zA-Z]+/.test(t.baseUrl)) {
            throw new Error('ERROR:INVALID_BASE_URL');
        }
    }

    if (options && options.token) {
        t.token = options.token.trim();
    }

    t.validateToken = function (token) {
        return /^\d+\:[a-z0-9\_\-]+$/i.test(token);
    }

    t.sendChat = function (chatId, message, token = null) {
        if (token) {
            t.token = token;
        }

        if (!t.validateToken(t.token)) {
            throw new Error('ERROR:INVALID_TOKEN');
        }

        return new Promise((resolve, reject) => {
            request
                .post(`${t.baseUrl}${t.token}/sendMessage`)
                .send({
                    chat_id: chatId,
                    text: message
                })
                .end((err, resp) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(resp.body);
                });
        });
    }
}