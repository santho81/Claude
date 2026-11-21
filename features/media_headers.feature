Feature: Media endpoint response headers

  Scenario: Response contains a valid Date header
    When I send a GET request to the media endpoint
    Then the response should include a "Date" header
    And the "Date" header should be a valid HTTP-date
