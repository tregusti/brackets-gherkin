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
          allowFeature: true,
          allowScenario: false,
          allowSteps: false
        };
      },
      token: function (stream, state) {
        stream.eatSpace();

        // LINE COMMENT
        if (stream.match(/^#.*/)) {
          return "comment";

        // TAG
        } else if (stream.match(/^@\S+/)) {
          return "def";

        // FEATURE
        } else if (state.allowFeature && stream.match(/^Feature:/)) {
          state.allowScenario = true;
          state.allowSteps = false;
          return "keyword";

        // SCENARIO
        } else if (state.allowScenario && stream.match(/^Scenario:/)) {
          state.allowSteps = true;
          return "keyword";

        // STEPS
        } else if (state.allowSteps && stream.match(/^(Given|When|Then|And|But)/)) {
          return "keyword";

        // Fall through
        } else {
          stream.skipToEnd();
        }

        return null;
      }
    };
  });

  LanguageManager.defineLanguage("gherkin", {
    name: "Gherkin",
    mode: "gherkin",
    fileExtensions: ["feature"]
  });
});
