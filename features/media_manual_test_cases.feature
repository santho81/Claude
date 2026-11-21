Feature: Manual test cases for the media endpoint

  Scenario: TC1 - Each track exposes core metadata
    Given I request https://testapi.io/api/RMSTest/media
    When I inspect each track in the "data" array
    Then each track should expose a non-empty "id"
    And each track should expose a "type"
    And each track should expose a "title_list" containing primary and, where applicable, secondary title details

  Scenario: TC2 - Only one track is marked as now playing
    Given I request https://testapi.io/api/RMSTest/media
    When I review the "offset" object of every track
    Then exactly one track should have "now_playing" set to true
    And all remaining tracks should have "now_playing" set to false
    And the sole true result should be track "p002d7bc"

  Scenario: TC3 - The response is well formed and complete
    Given I request https://testapi.io/api/RMSTest/media
    When the response is returned
    Then the body should be valid JSON
    And the "data" array should contain exactly 14 tracks
    And the "Content-Type" header should indicate application/json
