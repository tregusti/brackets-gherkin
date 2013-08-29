/*jslint
  vars: true,
  plusplus: true,
  devel: true,
  nomen: true,
  regexp: true,
  indent: 2,
  maxerr: 50
*/
/*global
  define,
  brackets,
  CodeMirror
*/
define(function (require, exports, module) {
  'use strict';

  var LanguageManager = brackets.getModule("language/LanguageManager");

  var regex = {
    keywords: /^(Feature| {2}(Scenario|In order to|As|I)| {4}(Given|When|Then|And))/
  };

  CodeMirror.defineMode("gherkin", function () {
    return {
      startState: function () {
        return {
        };
      },
      token: function (stream, state) {
        if (stream.sol()) {
          if (stream.match(regex.keywords)) {
            stream.eatSpace();
            return "keyword";
          } else {
            stream.skipToEnd();
          }
        } else {
          stream.skipToEnd();
          return null;
        }

        return null;
      }
    };
  });

  LanguageManager.defineLanguage("gherkin", {
    name: "Gherkin",
    mode: "gherkin",
    fileExtensions: ["feature"],
    blockComment: ["//", "//"],
    lineComment: ["//-", "//"]
  });
});
