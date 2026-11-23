Feature: Media endpoint data integrity

  Background:
    When I send a GET request to the media endpoint

  Scenario: Every track has a valid id
    Then the "data" array should contain exactly 14 tracks
    And the "id" field should not be null or empty for every item

  Scenario: Exactly one track is now playing
    Then exactly one track should have "now_playing" set to true
