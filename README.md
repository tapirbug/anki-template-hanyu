# Anki Template Hanyu
This is an Anki template that I use to learn Mandarin Chinese.
You can use it as a basis for your own or use it as-is.

## Usage
Easiest to get started is to download the template from the
[Releases](https://github.com/tapirbug/anki-template-hanyu/releases) section
on the GitHub repo. You can also follow the steps in _Building_ if you want to
customize the template instead or want to build yourself for some other reason.
Either way, you will end up with a directory like `anki-template-hanyu-1.2.3`,
with a `template` directory in it, in turn containing one sub-directory for
each type of template.

To use a template in Anki you will need to copy the contents of the contained
`front.html` and `back.html` into Anki. Styles are embedded into the HTML
during build so it is not necessary to define any styles in Anki itself.

Note that the template relies on some fields being provided by your notes,
which you can customize under _Fields…_. Unless you have have customized the
template yourself during _Building_, the template works with the following
fields:
* `Deutsch`,
* `汉字` (chinese characters to learn, also used for text-to-speech),
* `Pīnyīn`.

`index.html` is not necessary for use with Anki, just for previewing in your
browser.

That's it, you are good to go and can start adding notes!

## Building
Read this section if you want to customize the template, e.g. to change the
name of the fields to match your pre-existing notes.

Once you have checked out the repo, make sure that you have node.js and yarn
installed and run a dev server at https://localhost:1234/

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
`anki-template-hanyu-1.2.3` with your freshly baked templates.

Don't worry if the build "script" failed. It was inevitable. I only tested this
on Arch Linux and it is one line of rushed shell stuff. Just do the following
manually you should end up with pretty much the same result:
1. run `yarn run parcel build`
2. rename `dist` to something nice like `anki-template-hanyu`

One way or the other you are going to find a `templates` directory in your
build, with several sub-directories for each type of templates with
`front.html`/`back.html` in it. You can copy/paste `front.html`/`back.html`
contents into your Anki cards as outlined above.

There is also a single `index.html` for overview next to the templates
directory.

## Contributing
Feel free to raise a Github issue if you have any suggestions or even pull
requests to make this template better. Or fork it and make your own thing out
of it or to just copy-paste snippets from this repo. After all, the
customization part is half the fun with Anki.
