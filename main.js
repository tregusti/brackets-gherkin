/*jslint
  vars: true,
  plusplus: true,
  devel: true,
  nomen: true,
  regexp: true,
  indent: 2,
  bitwise: true,
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

  var State = {
    None: 0,
    Feature: 1,
    Background: 2,
    Scenario: 4,
    ScenarioOutline: 8,
    Steps: 16,
    Table: 32,
    MultilineString: 64
  };

  function setDefaultState(container) {
    container = container || {};

    container.allowFeature         = false;
    container.allowScenario        = false;
    container.allowScenarioOutline = false;
    container.allowBackground      = false;
    container.allowTags            = true;
    container.allowExamples        = false;
    container.allowPlaceholders    = false;

    return container;
  }

  function setState(container, state) {
    /*jslint white:true*/ // crappy jslint rules. jshint is much better
    switch (state) {
      case State.None:
        setDefaultState(container);
        container.allowFeature = true;
        break;

      case State.Feature:
        setDefaultState(container);
        container.allowScenario   = true;
        container.allowBackground = true;
        break;

      case State.Scenario:
      case State.Background:
        setDefaultState(container);
        container.allowScenario        = true;
        container.allowSteps           = true;
        container.allowScenarioOutline = true;
        break;

      case State.ScenarioOutline:
        setDefaultState(container);
        container.allowScenario     = true;
        container.allowExamples     = true;
        container.allowSteps        = true;
        container.allowPlaceholders = true;
        break;
    }
    /*jslint white:false*/

    return container;
  }

  CodeMirror.defineMode("gherkin", function () {
    return {
      startState: function () {
        var state = setDefaultState();
        setState(state, State.None);

        state.lineNumber = 0;
        state.tableHeaderLine = null;
        return state;
//        return {
//          lineNumber: 0,
//          tableHeaderLine: null,
//          allowFeature: true,
//          allowBackground: false,
//          allowScenario: false,
//          allowSteps: false,
//          allowPlaceholders: false,
//          inMultilineArgument: false,
//          inMultilineString: false,
//          inMultilineTable: false
//        };
      },
      indent: function (state, textAfter) {
        return CodeMirror.Pass;
      },
      token: function (stream, state) {
        if (stream.sol()) {
          state.lineNumber++;
        }
        stream.eatSpace();

        // INSIDE OF MULTILINE ARGUMENTS
//        if (state.inMultilineArgument) {
//
//          // STRING
//          if (state.inMultilineString) {
//            if (stream.match('"""')) {
//              state.inMultilineString = false;
//              state.inMultilineArgument = false;
//            } else {
//              stream.match(/.*/);
//            }
//            return "string";
//          }
//
//          // TABLE
//          if (state.inMultilineTable) {
//            // New table, assume first row is headers
//            if (state.tableHeaderLine === null) {
//              state.tableHeaderLine = state.lineNumber;
//            }
//
//            if (stream.match(/\|\s*/)) {
//              if (stream.eol()) {
//                state.inMultilineTable = false;
//              }
//              return "bracket";
//            } else {
//              stream.match(/[^\|]*/);
//              return state.tableHeaderLine === state.lineNumber ? "property" : "string";
//            }
//          }
//
//          // DETECT START
//          if (stream.match('"""')) {
//            // String
//            state.inMultilineString = true;
//            return "string";
//          } else if (stream.match("|")) {
//            // Table
//            state.inMultilineTable = true;
//            return "bracket";
//          } else {
//            // Or abort
//            state.inMultilineArgument = false;
//            state.tableHeaderLine = null;
//          }
//
//
//          return null;
//        }

        // LINE COMMENT
        if (stream.match(/#.*/)) {
          return "comment";

        // TAG
        } else if (stream.match(/@\S+/)) {
          return "def";

        // FEATURE
        } else if (stream.match("Feature:")) {
          if (!state.allowFeature) return "error";
          
          setState(state, State.Feature);
          return "keyword";
          
        // BACKGROUND
        } else if (stream.match("Background:")) {
          if (!state.allowBackground) return "error";
          
          setState(state, State.Background);
          return "keyword";

        // SCENARIO OUTLINE
        } else if (stream.match("Scenario Outline:")) {
          if (!state.allowScenarioOutline) return "error";
          
          setState(state, State.ScenarioOutline);
          return "keyword";

        // EXAMPLES
        } else if (stream.match("Examples:")) {
          if (!state.allowExamples) return "error";
          
          setState(state, State.Examples);
          return "keyword";

        // SCENARIO
        } else if (stream.match("Scenario:")) {
          if (!state.allowScenario) return "error";

          setState(state, State.Scenario);
          return "keyword";

        // STEPS
        } else if (stream.match(/(Given|When|Then|And|But)/)) {
          if (!state.allowSteps) return "error";

          setState(state, State.Steps);
          return "keyword";
        
        // INLINE STRING
        } else if (state.allowSteps && stream.match(/"/)) {
          stream.match(/.*?"/);
          return "string";

        } else if (stream.match("<")) {
          if (stream.match(/.*?>/)) {
            return state.allowPlaceholders ? "property" : null;
          } else {
            return null;
          }
          
//        } else if (!state.inMultilineArgument && ) {
//          stream.match(/.*?"/);
//          return "string";
//
//        // MULTILINE ARGUMENTS
//        } else if (state.allowSteps && stream.eat(":")) {
//          if (stream.match(/\s*$/)) {
//            state.inMultilineArgument = true;
//            return "keyword";
//          } else {
//            return null;
//          }
//
//        } else if (state.allowSteps && stream.match("<")) {
//          if (stream.match(/.*?>/)) {
//            return "property";
//          } else {
//            return null;
//          }

        // Fall through
        } else {
          // stream.skipToEnd();
          // stream.eatWhile(/[^":<]/);
          stream.eatWhile(/[^"<]/);
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
