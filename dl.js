// creates closure
var ssCustomLink = function (selector, scriptUrl, query = false, params = {})  {
    // retrieve base configuration
    let config = {
        context: {
            variables: {},
        },
        messengers: [
            {
                key: '?',
                name: 'telegram',
                parameter: 'start',
                prefixes: ['tg://', 'https://t.me/'],
            },
            {
                key: '?',
                name: 'facebook',
                parameter: 'ref',
                prefixes: ['https://m.me/'],
            },
            {
                key:'?',
                name:'instagram',
                parameter:'ref',
                prefixes:['https://ig.me/'],
            },
            {
                key: '#',
                name: 'vkontakte',
                parameter: 'r',
                prefixes: ['https://vk.com/', 'vk://'],
            },
            {
                key: '?',
                name: 'viber',
                parameter: 'context',
                prefixes: ['viber://'],
            },
        ],
        delimiter: '-',
    };

    // iterate through matched elements
    Array.from(document.getElementsByClassName(selector)).forEach(function (element) {
        // add event listener
        element.addEventListener('click', function (event) {
            // prevent default
            event.preventDefault();
            // resolve redirect based on url
            resolve(element.getAttribute('href'));
        });
    });

    // resolve store
    function resolve(url) {
        // creates request object
        let xhr = new XMLHttpRequest();

        // configure sending of request
        xhr.open('POST', scriptUrl);

        // on ready state
        xhr.onreadystatechange = function () {
            // if ready and has success status
            if (this.readyState === 4 && this.status === 200) {
                // retrieve store
                let store = JSON.parse(this.responseText);

                // resolve redirect
                location.href = redirectTo(url, store);
            }
        };

        // sends given request
        xhr.send(createContext(params));
    }

    /**
     * Creates context object.
     *
     * @return {String}
     */
    function createContext(params) {
        // iterate through context keys
        Object.keys(config.context).forEach(function (key) {
            // if key does not exist
            if (Object.keys(params).includes(key)) {
                return;
            }

            // setup empty
            params[key] = {};
        });

        return JSON.stringify(query ? withQueryParameters(params) : params);
    }

    /**
     * Retrieve redirect url.
     *
     * @param {String} url
     * @param {Object} store
     *
     * @return {String}
     */
    function redirectTo(url, store) {
        if (url.indexOf('https://direct.smartsender.com') === 0 || url.indexOf('https://direct.smartsender.com') === 1) {
            url = decodeURIComponent(url.split('continue=')[1].split('&')[0]);
        }
        // retrieve messenger
        let messenger = config.messengers.find(function (messenger) {
            // retrieve by search
            return messenger.prefixes.find(function (prefix) {
                // retrieve by first letters
                return (0 === url.indexOf(prefix) || 1 === url.indexOf(prefix));
            });
        });
        
        // Мессенджер не обнаружен, редиректим на "чистый" url
        if (!messenger) return url;

        // retrieve parts
        let context = url.split(messenger.key);

        // retrieve query pairs
        let parts = context[1].split('&');

        // iterate through parts
        parts.forEach(function (value, index) {
            // retrieve pair
            let pair = value.split('=');

            // if parameter match
            if (messenger.parameter === pair[0]) {
                
                // retrieve new value
                let formattedValue = (pair[1] + config.delimiter + store.insertId).replace(/=/g, '');
                // replace part
                parts.splice(index, 1, [messenger.parameter, formattedValue].join('='));
            }
        });

        return context[0] + messenger.key + parts.join('&');
    }

    /**
     * Append query parameters.
     *
     * @param {Object} scope
     *
     * @return {Object}
     */
    function withQueryParameters(scope) {
        // retrieve params
        let params = new URLSearchParams(window.location.search);

        // iterate through parameters
        params.forEach(function (value, key) {
            // if already defined
            if (scope.variables.hasOwnProperty(key)) {
                return;
            }

            // setup context
            scope.variables[key] = value;
        });

        return scope;
    }
};
