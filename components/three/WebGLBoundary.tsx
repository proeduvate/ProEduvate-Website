"use client";

import { Component, type ReactNode } from "react";

/**
 * Catches WebGL context-creation failures (unsupported browser, no GPU,
 * driver blocklist, etc.) so the 3D hero degrades to nothing rather than
 * breaking the page — the existing 2D gradient/grid layers underneath are
 * always rendered regardless, so there's no visual gap.
 */
export class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("3D hero scene failed to render, falling back to 2D background.", error);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
