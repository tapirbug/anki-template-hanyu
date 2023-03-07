# Anki Template Hanyu
This is an Anki template that I use to learn Mandarin Chinese.
You can use it as a basis for your own or use it as-is.

## Usage
Easiest to get started is to download the latest apkg release from the
[Releases](https://github.com/tapirbug/anki-template-hanyu/releases) section
on the GitHub repo. You can import such a file on Anki desktop and start using
the template.

## Customization
Many customizations to this template can be done right in Anki. For example,
you can change the vocabulary or add new words, change the names of templates
(e.g. "Lesen (Pīnyīn)" to something else). You can also add extra CSS for minor
optical tweaks. Changing the HTML will be a bit more involved, but if you want
to do some deeper customization or add new features, you can follow the steps
in _Building_ to generate customized HTML.

### Fields
Anki also allows customizing the kinds of fields your notes have under
_Fields…_.

Before customizing them, note that the template assumes that you have some
fields present that come with the `apkg`. The following fields are expected:
* `Deutsch`,
* `汉字` (chinese characters to learn, also used for text-to-speech),
* `Pīnyīn`.

Changing their names would require customizing the HTML to match which can be
a bit tedious.

## Building
Read this section if you want to make a customized version of the template,
e.g. to change the name of the fields to match your pre-existing notes, or if
you want to add entirely new features.

Once you have checked out the repo, make sure that you have node.js, yarn,
python and pip installed and run a dev server at https://localhost:1234/

    git clone git@github.com:tapirbug/anki-template-hanyu.git
    cd anki-template-hanyu
    yarn run parcel serve

If you are seeing a collection of links to the various templates at
https://localhost:1234/, it worked. You can modify the templates by playing
with the HTML, CSS and JS files in the `src` directory. Any changes should be
visible without refreshing your tab during development.

When you are happy with your changes, run:

    yarn build

If everything worked out, you should have a directory like
`anki-template-hanyu-1.2.3` with your freshly baked templates and an `apkg`
package to import into anki.

If you get errors, you can still configure the templates manually as described
below.

### Manually Configuring the Templates in Anki
Don't worry if the build "script" failed. It was inevitable. I only tested this
on Arch Linux and it is one line of rushed shell stuff. Just do the following
manually you should end up with pretty much the same result as importing the
apkg:
1. run `yarn run parcel build`
2. rename `dist` to something nice like `anki-template-hanyu`

One way or the other you are going to find a `templates` directory in your
build, with several sub-directories for each type of templates with
`front.html`/`back.html` in it. You can create one note type for each
subdirectory of templates you are interested in and copy/paste `front.html`/
`back.html` into your Anki card templates.

## Contributing
Feel free to raise a Github issue if you are experiencing issues or have any
suggestions or even pull requests to make this template better.

If you want to contribute new words but are not that technical, just open an
issue and post the new words there as an Anki collection or some other format
of your choice.

