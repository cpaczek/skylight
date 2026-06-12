import { describe, expect, it } from "vitest";
import {
  GEO_INSECURE_CONTEXT_MESSAGE,
  GEO_UNSUPPORTED_MESSAGE,
  geoAvailability,
  geoErrorMessage,
} from "../src/lib/geolocation.js";

describe("geoAvailability", () => {
  it("allows geolocation in secure contexts when the API is present", () => {
    expect(
      geoAvailability({ hasGeolocation: true, isSecureContext: true, hostname: "skylight.local" }),
    ).toEqual({ ok: true });
  });

  it("blocks insecure LAN hosts with actionable fallback guidance", () => {
    expect(
      geoAvailability({ hasGeolocation: true, isSecureContext: false, hostname: "192.168.1.25" }),
    ).toEqual({
      ok: false,
      reason: "insecure-context",
      message: GEO_INSECURE_CONTEXT_MESSAGE,
    });
  });

  it("allows localhost over HTTP as a secure browser context", () => {
    expect(
      geoAvailability({ hasGeolocation: true, isSecureContext: true, hostname: "localhost" }),
    ).toEqual({ ok: true });
  });

  it("also treats loopback hostnames as local when context flags are unavailable", () => {
    expect(
      geoAvailability({ hasGeolocation: true, isSecureContext: false, hostname: "localhost" }),
    ).toEqual({ ok: true });
    expect(
      geoAvailability({ hasGeolocation: true, isSecureContext: false, hostname: "127.0.0.1" }),
    ).toEqual({ ok: true });
  });

  it("blocks insecure LAN hosts even when browsers hide the API", () => {
    expect(
      geoAvailability({ hasGeolocation: false, isSecureContext: false, hostname: "192.168.1.25" }),
    ).toEqual({
      ok: false,
      reason: "insecure-context",
      message: GEO_INSECURE_CONTEXT_MESSAGE,
    });
  });

  it("reports unsupported devices in secure contexts", () => {
    expect(
      geoAvailability({ hasGeolocation: false, isSecureContext: true, hostname: "skylight.local" }),
    ).toEqual({
      ok: false,
      reason: "unsupported",
      message: GEO_UNSUPPORTED_MESSAGE,
    });
  });
});

describe("geoErrorMessage", () => {
  it("turns insecure permission denial into HTTP guidance", () => {
    expect(geoErrorMessage(1, true)).toBe(GEO_INSECURE_CONTEXT_MESSAGE);
  });

  it("keeps the existing secure-context permission denial message", () => {
    expect(geoErrorMessage(1, false)).toBe("Location permission denied");
  });

  it("keeps timeout and generic unavailable messages", () => {
    expect(geoErrorMessage(3, false)).toBe("Location request timed out");
    expect(geoErrorMessage(2, false)).toBe("Location unavailable");
  });
});
