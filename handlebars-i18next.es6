const jsonKeys = ['lngs', 'fallbackLng', 'ns', 'postProcess', 'interpolation'];

function extend(target, ...sources) {
    for (let source of sources) if (source) for (let key in source) {
        target[key] = source[key];
    }
    return target;
}

export default function(Handlebars, i18next, name = 'i18n') {
    Handlebars.registerHelper(name, function(key, {hash, data, fn}) {
        let final = {returnObjects: false};
        for (let key of jsonKeys) if (hash[key]) {
            final[key] = JSON.parse(hash[key]);
            delete hash[key];
        }
        let options = extend({}, data.root.i18next, hash, final);
        let replace = options.replace = extend({}, this, options.replace, hash);
        delete replace.i18next; // may creep in if this === data.root
        if (fn) options.defaultValue = fn(replace);
        return new Handlebars.SafeString(i18next.t(key, options));
    });
};
