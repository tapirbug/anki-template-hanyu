# skeleton.apkg
This file serves as a skeleton anki package for the build. It contains
vocabulary and bare-minimum templates described in more detail below.

## Customizing Vocabulary
If you want to customize the vocabulary in the skeleton file, you can apply
your changes to the apkg file you got from a recent release, e.g.
`hanyu-0.5.0.apkg` or `hanyu-0.5.0-skeleton.apkg`. Export your collection as
apkg and use the resulting file to replace the old `vocabulary.apkg`. Next run
`yarn build` and you should have a freshly built template with your changes to
the source code in the repo, but also with your new vocabulary.

### Contribution Note
If you want to contribute the new vocabulary back to the project, use
`hanyu-0.5.0-skeleton.apkg` from your fresh build to once again replace
`vocabulary.apkg`.

## Bare-minimum templates
The skeleton file has exactly these contents for the templates that will be
patched.

## Sprechen
Front:
```
anki-template-hanyu-speak-front {{Deutsch}}
```
Back:
```
anki-template-hanyu-speak-back {{Pīnyīn}}
```

## Schreiben
Front:
```
anki-template-hanyu-write-front {{Deutsch}}
```
Back:
```
anki-template-hanyu-write-back {{汉字}}
```

## Lesen (汉字)
Front:
```
anki-template-hanyu-read-hanzi-front {{汉字}}
```
Back:
```
anki-template-hanyu-read-hanzi-back {{Deutsch}}
```

## Lesen (Pīnyīn)
Front:
```
anki-template-hanyu-read-pinyin-front {{Pīnyīn}}
```
Back:
```
anki-template-hanyu-read-pinyin-back {{Deutsch}}
```
## Hören
Front:
```
anki-template-hanyu-hear-front {{汉字}}
```
Back:
```
anki-template-hanyu-hear-back {{Deutsch}}
```

### Customization Note
If you have customized `vocabulary.apkg`, then the templates do not need to
be an exact match to the stuff above. It's good enough to have the first word
present on the respective template for the build to work. For example, using
`<span class="anki-template-hanyu-speak-front">` on the front is good enough
for the `speak` template to be patched in, which normally contains
just`anki-template-hanyu-write-front {{Deutsch}}`.

Note that the templates are checked in the order specified here. If this is
giving you trouble, you can fiddle with the patterns in `build/apkg.py` and
customize them to your new skeleton.

The final output template is a suitable replacement for `vocabulary.apkg` if
you want to customize the vocabulary. Just be sure to follow the contribution
note above if you want to contribute your changes back to this template.
