# handlebars-i18next

[![npm](https://img.shields.io/npm/dt/handlebars-i18next)](https://badge.fury.io/js/handlebars-i18next) [![npm version](https://badge.fury.io/js/handlebars-i18next.svg)](https://badge.fury.io/js/handlebars-i18next)

[Handlebars][handlebars] helper that lets you translate with [i18next][i18next] inside your templates.

*New!* Need to automatically collect the `{{i18n}}` tags from your Handlebars templates for your translation JSON? Look no further than our sister package [handlebars-i18next-parser][parser].

[handlebars]: https://handlebarsjs.com
[i18next]: https://www.i18next.com
[parser]: https://www.npmjs.com/package/handlebars-i18next-parser


## Quickstart

Installation

```console
$ npm i handlebars-i18next
```

Glue code

```js
import Handlebars from 'handlebars';  // runtime also possible
import i18next from 'i18next';
import registerI18nHelper from 'handlebars-i18next';

// Prepare your i18next instance (can be a custom instance)
i18next.init({
    resources: {
        en: {
            translation: {
                greeting: 'Hello, {{name}}!',
            }
        },
        fr: {...},
    },
    ...
}, function(error, t) {
    // Once this callback is called, you can start rendering templates
    // that depend on the helper (if `error` is undefined).
});

registerI18nHelper(Handlebars, i18next);
```

Template

```hbs
{{i18n 'greeting'}}
```

Template call

```js
template({name: 'Alice'});
```

Result

```
Hello, Alice!
```

Properties in the context of the helper are automatically available as interpolation values to i18next. It just works!


## Advanced usage

### Block helper: templated default value

You can use the helper as a section. The nested template block will be rendered as usual with the same context and passed to `i18next.t` as the `defaultValue` option.

```hbs
{{#i18n 'greeting'}}Please be welcome, {{name}}!{{/i18n}}
```

So if the `greeting` key is not found in any of the selected languages in the current namespace, this will be rendered:

```
Please be welcome, Alice!
```

Otherwise, the following or one of its translations.

```
Hello, Alice!
```


### Providing explicit interpolation values

You can pass an `i18next.replace` property in the root context of the template call in order to provide interpolation values for all helpers in the template.

```js
template({
    name: Alice,
    i18next: {
        replace: {
            name: 'Bob',
        },
    },
});
```

will result in

```
Hello, Bob!
```

You can also pass arbitrary keyword arguments to the helper. These will be passed as options to `i18next.t` and be available as interpolation values.

```hbs
{{i18n 'greeting' name='Cynthia'}}
```

will result in

```
Hello, Cynthia!
```

Keyword arguments take precedence over `root.i18next.replace`, which in turn takes precedence over the current context of the helper.


### Passing other options to `i18next.t`

See [the i18next documentation][i18n-doc] for available options.

[i18n-doc]: https://www.i18next.com/translation-function/essentials#overview-options

In order to provide default options for **all** occurrences of the helper in your template, pass the options hash as the `i18next` property of the root context to the template call.

```js
template({name: 'Alice', i18next: {
    lng: 'fr',
    interpolate: {...},
    ...
}});
```

In order to override options for a **single** occurrence of the helper, pass them directly as keyword arguments to the helper.

```hbs
{{i18n 'greeting' lng='fr' interpolate='{...}'}}
```

Some notes:

 - The options `lngs`, `fallbackLng`, `ns`, `postProcess`, `formatParams` and `interpolation` must be JSON-encoded strings when passed as keyword arguments.
 - The `returnObjects` option is forced to be `false`, since Handlebars helpers must return a string. You can pass another value, but it will be ignored.
 - The `replace` option is not supported as keyword argument. Pass the interpolation values individually as keyword arguments instead, as described in the previous section.

### Formatting dates, numbers and currencies
i18next can be used to format dates, numbers and currencies. This is described [here](https://www.i18next.com/translation-function/formatting). In this chapter the principles for using formatting with handlebars will be explained using dates, but the same principle will also work for numbers and currencies.

A simple date format can be achieved by adding a string to the template file, as well as an entry in your translationfile:

<sub>Template:</sub>
```hbs {data-filename="test.py"}
{{i18n 'TranslationKey' dateKey=dateObject}}
```
<sub>Translation:</sub>
```json
"TranslationKey": "On {{dateKey, datetime}}",
```
This will result in "On 12/20/2012" for 'en'.

##### Formatting
You can futher customise the formatting of the date by providing the `formatParams` in your template file.  

<sub>Template:</sub>
```hbs
{{i18n 'TranslationKey' dateKey=DateObject formatParams='{"dateKey":{"weekday":  "long",  "year":  "numeric",  "month":  "long",  "day":  "numeric"}}'}}
```
Will result in "On Thursday, December 20, 2012" for 'en'

**Please note that opposed to the documentation of i18next, the formatParams should be a json encoded string!**

### Changing the name of the helper

You can override the helper name by passing the name of your choice as the optional third argument to the exported helper registering function.

```js
import registerI18nHelper from 'handlebars-i18next';

// ...

registerI18nHelper(Handlebars, i18next, 't');
```

```hbs
{{t 'greeting'}}
```


*Made by*

[![Digital Humanities Lab](http://dhstatic.hum.uu.nl/logo-lab/png/dighum-logo.png)](https://dig.hum.uu.nl)
