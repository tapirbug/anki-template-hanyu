# Anki Template Hanyu
This is an Anki template that I use to learn Mandarin Chinese.
You can use it as a basis for your own or use it as-is.

## Usage
There are no pre-built files that you can paste into Anki yet, so for now you
can follow the steps in _Building_ and then use the resulting `front.html`,
`back.html` files as your templates in Anki.

Open your card library and configure your card types under _Cards…_ in the
menu bar. Use `front.html` as your _Front Template_ and `back.html` as your
_Back Template_. Styles are embedded into the HTML so it is not necessary to
define any styles in Anki.

The template relies on some fields being provided by your notes, which you can
customize under _Fields…_. Unless you have have customized the template during
_Building_, the template works with the following fields:
* `Deutsch`,
* `汉字`,
* `Pīnyīn`.

That's it, you are good to go and can start adding notes!

## Building
Make sure you have node.js and yarn installed and run:

    yarn build

The built templates are in a directory `anki-template-hanyu-VERSION` with a
version string like `0.0.1`.

In it you can find several sub-directories with templates for various types of
cards and a single `index.html` to give you an oveview of the available
templates. `index.html` is not needed for Anki.

You can copy/paste `front.html`/`back.html` contents into your Anki cards as
outlined above.

## Contributing
Feel free to raise a Github issue if you have any suggestions or even pull
requests to make this template better. Or fork it and make your own thing out
of it or to just copy-paste snippets from this repo. After all, the
customization part is half the fun with Anki.
