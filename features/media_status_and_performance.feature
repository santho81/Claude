Feature: Media endpoint availability and performance

  Scenario: Media endpoint returns 200 within the response time threshold
    When I send a GET request to the media endpoint
    Then the response status code should be 200
    And the response time should be below 1000 milliseconds
