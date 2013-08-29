# This is an example feature
Feature: Serve coffee
  In order to earn money
  As a customer
  I should be able to buy coffee at all times

  # This is an example scenario
  Scenario: Buy last coffee
    Given there are 1 coffees left in the machine
      And I have deposited 1 dollar
     When I press the coffee button
     Then I should be served a coffee