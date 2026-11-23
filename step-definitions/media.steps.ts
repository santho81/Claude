import { expect } from "chai";
import { Given, Then, When } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { getMediaResponse } from "../support/apiClient";

interface MediaTrack {
  type?: unknown;
  id?: unknown;
  title_list?: {
    primary?: unknown;
    secondary?: unknown;
  } | null;
  offset?: {
    now_playing?: unknown;
  } | null;
}

interface MediaPayload {
  data: MediaTrack[];
}

function payload(world: CustomWorld): MediaPayload {
  expect(world.apiResponse, "A media API response has not been captured").to.exist;
  expect(world.apiResponse?.body, "The response body is missing").to.be.an("object");

  const body = world.apiResponse?.body as Partial<MediaPayload>;
  expect(body.data, 'The response must contain a "data" array').to.be.an("array");
  return body as MediaPayload;
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nowPlayingValue(track: MediaTrack): unknown {
  return isRecord(track.offset) ? track.offset.now_playing : undefined;
}

Given(
  /^I request (https:\/\/testapi\.io\/api\/RMSTest\/media)$/,
  async function (this: CustomWorld, _documentedEndpoint: string) {
    // The URL in the scenario documents the live endpoint; the actual target comes from config.
    this.apiResponse = await getMediaResponse(this.config.endpoint);
  }
);

When(
  "I send a GET request to the media endpoint",
  async function (this: CustomWorld) {
    this.apiResponse = await getMediaResponse(this.config.endpoint);
  }
);

Then(
  "the response status code should be 200",
  function (this: CustomWorld) {
    expect(this.apiResponse?.status).to.equal(200);
  }
);

Then(
  "the median response time should be within the configured threshold",
  async function (this: CustomWorld) {
    const { perfSamples, perfMaxMs, endpoint } = this.config;
    await getMediaResponse(endpoint); // warm-up: excludes DNS/TLS setup from the measurement

    const samples: number[] = [];
    for (let i = 0; i < perfSamples; i++) {
      samples.push((await getMediaResponse(endpoint)).durationMs);
    }
    const sorted = [...samples].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const rounded = samples.map((ms) => Math.round(ms));

    this.attach(`samples(ms)=${rounded.join(", ")} median=${Math.round(median)} threshold=${perfMaxMs}`, "text/plain");
    expect(median, `median of [${rounded.join(", ")}] ms vs threshold ${perfMaxMs} ms`).to.be.at.most(perfMaxMs);
  }
);

Then(
  'the response should include a {string} header',
  function (this: CustomWorld, headerName: string) {
    expect(this.apiResponse?.headers).to.have.property(headerName.toLowerCase());
  }
);

Then(
  'the {string} header should be a valid HTTP-date',
  function (this: CustomWorld, headerName: string) {
    expect(headerName).to.equal("Date");

    const dateValue = this.apiResponse?.headers[headerName.toLowerCase()];
    expect(dateValue, "Date header value is missing").to.be.a("string");

    const httpDatePattern =
      /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} GMT$/;
    expect(dateValue).to.match(httpDatePattern);
    expect(new Date(dateValue as string).toString()).not.to.equal("Invalid Date");
  }
);

When(
  'I inspect each track in the {string} array',
  function (this: CustomWorld, arrayName: string) {
    expect(arrayName).to.equal("data");
    expect(payload(this).data).to.be.an("array");
  }
);

Then(
  'each track should expose a non-empty {string}',
  function (this: CustomWorld, fieldName: string) {
    expect(fieldName).to.equal("id");
    const invalidTracks = payload(this).data.filter(
      (track) => !nonEmptyString(track.id)
    );
    expect(invalidTracks, "Every track must have a non-empty id").to.have.lengthOf(0);
  }
);

Then(
  'each track should expose a {string}',
  function (this: CustomWorld, fieldName: string) {
    expect(fieldName).to.equal("type");
    const invalidTracks = payload(this).data.filter((track) => !nonEmptyString(track.type));
    expect(invalidTracks, "Every track must have a non-empty type").to.have.lengthOf(0);
  }
);

Then(
  'each track should expose a {string} containing primary and, where applicable, secondary title details',
  function (this: CustomWorld, fieldName: string) {
    expect(fieldName).to.equal("title_list");
    const invalidTracks = payload(this).data.filter((track) => {
      const titleList = track.title_list;
      if (!isRecord(titleList)) return true;
      return (
        !nonEmptyString(titleList.primary) ||
        (titleList.secondary != null && !nonEmptyString(titleList.secondary))
      );
    });

    expect(invalidTracks, "Every track must have valid title details").to.have.lengthOf(0);
  }
);

When(
  'I review the {string} object of every track',
  function (this: CustomWorld, fieldName: string) {
    expect(fieldName).to.equal("offset");
    const invalidTracks = payload(this).data.filter((track) => {
      return typeof nowPlayingValue(track) !== "boolean";
    });
    expect(invalidTracks, "Every track must have an offset with a boolean now_playing value")
      .to.have.lengthOf(0);
  }
);

Then(
  'exactly one track should have {string} set to true',
  function (this: CustomWorld, fieldName: string) {
    expect(fieldName).to.equal("now_playing");
    expect(payload(this).data.filter((track) => nowPlayingValue(track) === true)).to.have.lengthOf(1);
  }
);

Then(
  'all remaining tracks should have {string} set to false',
  function (this: CustomWorld, fieldName: string) {
    expect(fieldName).to.equal("now_playing");
    const tracks = payload(this).data;
    const falseCount = tracks.filter((track) => nowPlayingValue(track) === false).length;
    expect(falseCount).to.equal(tracks.length - 1);
  }
);

Then(
  'the sole true result should be a track with a valid id',
  function (this: CustomWorld) {
    const nowPlayingTracks = payload(this).data.filter((track) => nowPlayingValue(track) === true);
    expect(nowPlayingTracks).to.have.lengthOf(1);
    expect(nonEmptyString(nowPlayingTracks[0].id), "now-playing track must have an id").to.equal(true);
    const expectedId = this.config.expectedNowPlayingId;
    if (expectedId) {
      expect(nowPlayingTracks[0].id).to.equal(expectedId);
    }
  }
);

When("the response is returned", function (this: CustomWorld) {
  expect(this.apiResponse, "The media API response has not been captured").to.exist;
});

Then("the body should be valid JSON", function (this: CustomWorld) {
  expect(this.apiResponse?.body, "The response body must be valid parsed JSON")
    .to.be.an("object")
    .and.not.to.be.null;
  expect(payload(this).data).to.be.an("array");
});

Then('the "data" array should contain the expected number of tracks', function (this: CustomWorld) {
  expect(payload(this).data).to.have.lengthOf(this.config.expectedTrackCount);
});

Then('the "id" field should not be null or empty for every item', function (this: CustomWorld) {
  const invalidIds = payload(this).data.filter(
    ({ id }) => id === null || id === undefined || (typeof id === "string" && id.trim() === "")
  );
  expect(invalidIds, "Track IDs must not be null or empty").to.have.lengthOf(0);
});

Then(
  /^the "([^"]+)" header should indicate application\/json$/,
  function (this: CustomWorld, headerName: string) {
    expect(headerName.toLowerCase()).to.equal("content-type");
    const contentType = this.apiResponse?.headers[headerName.toLowerCase()];
    expect(contentType, "Content-Type header is missing").to.be.a("string");
    expect(contentType).to.match(/^application\/json(?:\s*;|$)/i);
  }
);
