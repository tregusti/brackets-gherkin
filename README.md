# Gherkin syntax highlighting

This is an extension to the code editor [Brackets][1], and adds syntax
highlighting for Gherkin files with the extension `.feature`.

## Install from URL

1. Open the the Extension Manager from the File menu.
2. Search for `gherkin` and press install.

## Generating new zip

When releasing a new version a zip of the code is needed for upload at the
[extension registry][2]. Generate it with the following snippet:

```bash
git archive --format zip -o brackets-gherkin.zip master
```

  [1]: http://brackets.io/ "Brackets — Open source code editor built with the web for the web"
  [2]: https://brackets-registry.aboutweb.com/ "Brackets registry"
