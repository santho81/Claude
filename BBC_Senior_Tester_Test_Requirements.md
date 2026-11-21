# BBC Senior Tester Take Home Test

**Team:** ACS
**Endpoint under test:** `https://testapi.io/api/RMSTest/media`
**Submission:** Return to the HR representative **5 working days** after receiving the test.
**Clarifications:** tejal.naik@bbc.co.uk

---

## 1. Overview

The task has two parts:

| Part | Description |
|------|-------------|
| Part 1 | Automation: API tests written in Gherkin (Cucumber) |
| Part 2 | Functional manual testing: three non-automated test cases in Gherkin |

The endpoint returns a list of music tracks and metadata. There are **14 tracks** in the response, each with fields such as `type`, `id`, `title_list`, etc.

---

## 2. Part 1: Automation

### 2.1 Instructions

1. Store the code in a public repository (e.g. GitHub), or send it in a format that is easy to build.
2. Use any language you are comfortable with. The team uses TypeScript/JavaScript, but the choice is not a disadvantage.
3. Write tests in **Gherkin**, ideally with **Cucumber** (can be combined with JUnit, RestAssured, etc.).
4. The project must contain:
   - Feature files
   - Step definitions
   - A runner file
   - Any other supporting code
5. Document assumptions and external dependencies needed to run the tests.
6. Scenarios may be split across as many feature files as needed.

### 2.2 Scenarios to automate

#### Scenario 1: Status code and response time
1. Make a `GET` request to `https://testapi.io/api/RMSTest/media`
2. Verify the HTTP status code is `200`
3. Verify the response time is below `1000 ms`

#### Scenario 2: Data integrity
1. Make a `GET` request to `https://testapi.io/api/RMSTest/media`
2. Verify the `id` field is never `null` or empty (`""`) for all 14 items in the `data` array
3. Verify that **only one** track has `now_playing` set to `true` within `offset`

#### Scenario 3: Response headers
1. Make a `GET` request to `https://testapi.io/api/RMSTest/media`
2. Verify the `Date` value in the response headers

### 2.3 Suggested project structure (TypeScript + Cucumber)

```
.
├── features/
│   ├── media_status_and_performance.feature
│   ├── media_data_integrity.feature
│   └── media_headers.feature
├── step-definitions/
│   └── media.steps.ts
├── support/
│   ├── world.ts
│   └── apiClient.ts
├── cucumber.js              # runner / profile config
├── package.json
├── tsconfig.json
└── README.md
```

### 2.4 Draft feature files

**`media_status_and_performance.feature`**
```gherkin
Feature: Media endpoint availability and performance

  Scenario: Media endpoint returns 200 within the response time threshold
    When I send a GET request to the media endpoint
    Then the response status code should be 200
    And the response time should be below 1000 milliseconds
```

**`media_data_integrity.feature`**
```gherkin
Feature: Media endpoint data integrity

  Background:
    When I send a GET request to the media endpoint

  Scenario: Every track has a valid id
    Then the data array should contain 14 items
    And the "id" field should not be null or empty for every item

  Scenario: Exactly one track is now playing
    Then exactly one item should have "offset.now_playing" set to true
```

**`media_headers.feature`**
```gherkin
Feature: Media endpoint response headers

  Scenario: Response contains a valid Date header
    When I send a GET request to the media endpoint
    Then the response should include a "Date" header
    And the "Date" header should be a valid HTTP-date
```

### 2.5 Assumptions and dependencies (to document in the submission)

- Node.js (LTS) and npm are installed.
- Network access to `testapi.io` is available.
- Dependencies (suggested): `@cucumber/cucumber`, `typescript`, `ts-node`, `axios` (or `supertest`), `chai`.
- The track list is in the `data` array of the JSON response, and `now_playing` lives under each item's `offset` object.
- The "14 tracks" count reflects the current state of the mock API and is treated as stable.
- "Response time" is measured client-side (request start to response received), so results vary with network conditions.
- For the `Date` header, the test checks that it exists and is a valid HTTP-date. Optionally, it checks it is close to the current time (within a tolerance, e.g. ±5 minutes), because the exact value cannot be known in advance.

### 2.6 How to run (to include in the project README)

```bash
npm install
npm test            # runs cucumber-js with the default profile
```

---

## 3. Part 2: Functional Manual Testing

Write **three non-automated test cases** for the endpoint, in Gherkin. Study the data in the API response first, and base the cases on real fields and values.

### 3.1 Draft test cases

> Refine these after inspecting the live response, so the expected values match the actual data.

**TC1: Each track exposes its core metadata**
```gherkin
Feature: Media track metadata

  Scenario: Each track contains the expected core fields
    Given I request the media endpoint
    When I inspect each track in the "data" array
    Then each track should have a non-empty "id"
    And each track should have a "type"
    And each track should have a "title_list" containing the track title and artist details
```

**TC2: Only one track is flagged as now playing**
```gherkin
Feature: Now playing indicator

  Scenario: Exactly one track is marked as now playing
    Given I request the media endpoint
    When I review the "offset" object of every track
    Then exactly one track should have "now_playing" set to true
    And all other tracks should have "now_playing" set to false
```

**TC3: Response is well-formed and complete**
```gherkin
Feature: Media response structure

  Scenario: The response is valid JSON containing all 14 tracks
    Given I request the media endpoint
    When the response is returned
    Then the response body should be valid JSON
    And the "data" array should contain 14 tracks
    And the "Content-Type" header should indicate JSON
```

---

## 4. Deliverables Checklist

- [ ] Public repository (or buildable archive) containing the project
- [ ] Feature files
- [ ] Step definitions
- [ ] Runner / config file
- [ ] Supporting code (API client, world/hooks)
- [ ] README with assumptions, dependencies and run instructions
- [ ] Three manual test cases in Gherkin (Part 2)
- [ ] Submitted to HR within 5 working days
