import type { FontConfig, ResolvedFontOptions } from "../types/fontConfig.ts";
import { withUserConfig } from "../utils/config-overlay.ts";
import { resolveFontOptions as resolve } from "../utils/font-options.ts";

export const fontConfig: FontConfig = withUserConfig("font", {
mode: "system",

fontFamilies: [],

subsetting: {
enable: false,
includeContent: false,
includeI18n: false,
includeConfig: false,
includeCommon: false,
allowRemoteText: false,
},

budget: {
maxTotalBytes: 1,
maxFamilyBytes: 1,
},
});

export const resolvedFontOptions: ResolvedFontOptions = resolve(fontConfig);

export const resolveFontOptions: (config: FontConfig) => ResolvedFontOptions =
resolve;

