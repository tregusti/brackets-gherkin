Feature: Quotes in "title"
  In order to use quotes in the title
  As any user
  I want bug #16 to be fixed

  Scenario: Using a "quoted" word
    Given I have a quoted word
    When I open the file
    Then Brackets should not crash
