Feature: Media endpoint availability and performance

  Scenario: Media endpoint returns 200
    When I send a GET request to the media endpoint
    Then the response status code should be 200

  # Depends on network distance to the host, so it only runs against the live API.
  # Threshold and sample count: PERF_MAX_MS (default 1000) and PERF_SAMPLES (default 5).
  @live @performance
  Scenario: Median response time is within the configured threshold
    Then the median response time should be within the configured threshold
