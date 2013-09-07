Feature:
  In order to keep track of all users
  As an administrator
  I want to be able to manage users

  Scenario:
    Given the following people exist:
      | name   | email            | phone |
      | Aslak  | aslak@email.com  | 123   |
      | Glenn  | glenn@email.com  | 234   |
      | Miliam | miliam@email.org | 456   |
    When I remove "Aslak"
    Then I should see:
      | name   |
      | Glenn  |
      | Miliam |
    And I should not see a user named "Aslak"

  Scenario Outline: Creating users
    Given there are user database
    When I create a new user named <user>
    Then I should see a list of <count> users

  Examples:
    | user  | count |
    | Glenn | 1     |
    | Sigyn | 2     |