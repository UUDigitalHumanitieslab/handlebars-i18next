# handlebars-i18next

[Handlebars][1] helper that lets you translate with [i18next][2] inside your templates.

[1]: https://handlebarsjs.com
[2]: https://www.i18next.com


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

See [the i18next documentation][3] for available options.

[3]: https://www.i18next.com/translation-function/essentials#overview-options

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

 - The options `lngs`, `fallbackLng`, `ns`, `postProcess` and `interpolation` must be JSON-encoded strings when passed as keyword arguments.
 - The `returnObjects` option is forced to be `false`, since Handlebars helpers must return a string. You can pass another value, but it will be ignored.
 - The `replace` option is not supported as keyword argument. Pass the interpolation values individually as keyword arguments instead, as described in the previous section.


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
