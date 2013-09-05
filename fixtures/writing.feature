Feature: Write a blog post
  In order to write a blog post
  As a writer
  I must enter some text

  Scenario: Post a text to the blog
    Given a markdown text like this:
      """
      Some Title, Eh?
      ===============
      Here is the first paragraph of my blog post.
      Lorem ipsum dolor sit amet, consectetur adipiscing
      elit.
      """
    When I press save
    Then it shows up on the website