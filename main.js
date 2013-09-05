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
  var Quotes = {
    SINGLE: 1,
    DOUBLE: 2
  };

  var regex = {
    keywords: /(Feature| {2}(Scenario|In order to|As|I)| {4}(Given|When|Then|And))/
  };

  CodeMirror.defineMode("gherkin", function () {
    return {
      startState: function () {
        return {
          allowFeature: true,
          allowBackground: false,
          allowScenario: false,
          allowSteps: false,
          inMultilineArgument: false,
          inMultilineString: false,
          inMultilineTable: false
        };
      },
      token: function (stream, state) {
        stream.eatSpace();

        // INSIDE OF MULTILINE ARGUMENTS
        if (state.inMultilineArgument) {

          // STRING
          if (state.inMultilineString) {
            if (stream.match('"""')) {
              state.inMultilineString = false;
              state.inMultilineArgument = false;
            } else {
              stream.match(/.*/);
            }
            return "string";
          }

          // TABLE
          if (state.inMultilineTable) {
            if (stream.match(/\|\s*/)) {
              if (stream.eol()) {
                state.inMultilineTable = false;
              }
              return null;
            } else {
              stream.match(/[^\|]/);
              return "string";
            }
          }

          // DETECT START
          if (stream.match('"""')) {
            // String
            state.inMultilineString = true;
            return "string";
          } else if (stream.match("|")) {
            // Table
            state.inMultilineTable = true;
            return null;
          } else {
            state.inMultilineArgument = false;
          }


          return null;
        }

        // LINE COMMENT
        if (stream.match(/#.*/)) {
          return "comment";

        // TAG
        } else if (stream.match(/@\S+/)) {
          return "def";

        // FEATURE
        } else if (state.allowFeature && stream.match(/Feature:/)) {
          state.allowScenario = true;
          state.allowBackground = true;
          state.allowSteps = false;
          return "keyword";

        // BACKGROUND
        } else if (state.allowBackground && stream.match(/Background:/)) {
          state.allowSteps = true;
          state.allowBackground = false;
          return "keyword";

        // SCENARIO
        } else if (state.allowScenario && stream.match(/Scenario:/)) {
          state.allowSteps = true;
          state.allowBackground = false;
          return "keyword";

        // STEPS
        } else if (state.allowSteps && stream.match(/(Given|When|Then|And|But)/)) {
          return "keyword";

        // INLINE STRING
        } else if (!state.inMultiline && stream.match(/"/)) {
          stream.match(/.*?"/);
          return "string";

        // MULTILINE ARGUMENTS
        } else if (stream.match(/:\s*$/)) {
          state.inMultilineArgument = true;
          return "keyword";

        // Fall through
        } else {
          stream.eatWhile(/[^":]/);
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
