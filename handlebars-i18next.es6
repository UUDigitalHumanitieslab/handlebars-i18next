// These are options to i18n.t that may take array or object values.
const jsonKeys = ['lngs', 'fallbackLng', 'ns', 'postProcess', 'interpolation'];

// Quick polyfill for Object.assign, because IE11 doesn't have that method.
function extend(target, ...sources) {
    for (let source of sources) if (source) for (let key in source) {
        target[key] = source[key];
    }
    return target;
}

export default function(Handlebars, i18next, name = 'i18n') {
    Handlebars.registerHelper(name, function(key, {hash, data, fn}) {
        let parsed = {};
        for (let key of jsonKeys) if (hash[key]) {
            // Everything in jsonKeys is known not to belong in options.replace.
            // Everything in hash ends up in options.replace, so we limit
            // interpolation replacement polution by transferring these keys
            // to parsed.
            parsed[key] = JSON.parse(hash[key]);
            delete hash[key];
        }
        let options = extend({}, data.root.i18next, hash, parsed, {returnObjects: false});
        let replace = options.replace = extend({}, this, options.replace, hash);
        delete replace.i18next; // may creep in if this === data.root
        if (fn) options.defaultValue = fn(replace);
        return new Handlebars.SafeString(i18next.t(key, options));
    });
};
