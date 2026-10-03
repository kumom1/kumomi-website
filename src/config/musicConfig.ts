import { musicTracks } from "../data/music.ts";
import type {
	MetingMusicConfig,
	MusicConfig,
	MusicProvider,
	PlaybackMode,
	TrackDescriptor,
} from "../types/musicConfig.ts";
import { withUserConfig } from "../utils/config-overlay.ts";

/**
 * 渚ф爮闊充箰閰嶇疆鍗曚竴鐪熸簮銆?
 * 閬靛惊銆岄浂棰濆璐熸媴銆嶅師鍒欙細绂佺敤鏃朵笉浜х敓浠讳綍缃戠粶璇锋眰涓庨澶?DOM銆?
 *
 * 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
 * 銆愬洓绉嶅伐浣滄ā寮忥紙Provider锛変娇鐢ㄦ寚鍗椼€?
 * 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
 * 1. "local"锛堟湰鍦扮嫭绔嬫ā寮忥紝榛樿锛夛細
 *    - 鏁版嵁婧愶細src/data/music.ts
 *    - 鐗圭偣锛氶浂澶栭儴 API 渚濊禆锛岄灞忔绉掔骇灏辩华锛岄潤鎬佹墦鍖呯洿鍑猴紝鏂綉涔熻兘姝ｅ父鎾斁銆?
 *    - 绀轰緥锛?
 *      provider: "local"
 *
 * 2. "custom"锛堣嚜瀹氫箟鍒楄〃妯″紡锛夛細
 *    - 鏁版嵁婧愶細鐩存帴鍦?tracks 瀛楁鏄惧紡浼犲叆鏇茬洰鏁扮粍锛堟敮鎸佸閾鹃煶棰戜笌灏侀潰锛?
 *    - 鐗圭偣锛氱伒娲昏嚜瀹氫箟锛屾棤闇€淇敼閫氱敤鏁版嵁鏂囦欢銆?
 *    - 绀轰緥锛?
 *      provider: "custom",
 *      tracks: [
 *        { id: "song-1", title: "Song", artist: "Artist", source: "https://.../a.mp3", cover: "https://.../c.jpg" }
 *      ]
 *
 * 3. "meting"锛堜簯绔瓕鍗曟ā寮忥級锛?
 *    - 鏁版嵁婧愶細Meting API 杩滅姝屽崟锛堢綉鏄撲簯 / QQ闊充箰 / 閰风嫍绛夛級
 *    - 鐗圭偣锛氬鎴风寮傛鎸夐渶鎷夊彇锛屾捣閲忔洸搴撲笌灏侀潰鑷姩瑙ｆ瀽銆?
 *    - 鍙€?`preload: "metadata"`锛氱粍浠惰繘鍏ヨ鍙ｅ嵆棰勫彇姝屽崟鍏冩暟鎹紙涓嶅惈闊抽娴侊級锛?
 *      棣栧睆鐩存帴鏄剧ず绗竴棣栨洸鐩紱榛樿 "none"锛堜笉棰勫彇锛屼氦浜掑悗鎵嶈姹傦級銆?
 *    - 绀轰緥锛?
 *      provider: "meting",
 *      meting: { server: "netease", type: "playlist", id: "14164869977" }
 *
 * 4. "mixed"锛堟贩鍚堝寮烘ā寮忥紝鎺ㄨ崘锛夛細
 *    - 鏁版嵁婧愶細鏈湴鏇茬洰锛坰rc/data/music.ts锛? Meting API 杩滅姝屽崟鑷姩鍚堝苟
 *    - 鐗圭偣锛氶灞忕珛鍗冲彲鎾湰鍦伴煶涔愶紝鍚庡彴鏃犳劅鎷夊彇杩滅姝屽崟骞跺湪灏辩华鍚庢棤缂濇墿瀹癸紱
 *            鑻ラ亣鏂綉鎴栦簯绔帴鍙ｆ晠闅滐紝鑷姩闈欓粯闄嶇骇涓烘湰鍦版洸鐩挱鏀撅紝缁濅笉鎶ョ孩鐮寸増銆?
 *    - 绀轰緥锛?
 *      provider: "mixed",
 *      meting: { server: "netease", type: "playlist", id: "14164869977" }
 * 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
 */
export const musicConfig: MusicConfig = withUserConfig("music", {
	enable: true,
	provider: "meting",
	// tracks: [
	// 	{
	// 		id: "custom-1",
	// 		title: "绀轰緥鏇茬洰",
	// 		artist: "鑹烘湳瀹?,
	// 		cover: "/assets/music/cover/example.webp",
	// 		source: "/assets/music/url/example.mp3",
	// 		duration: 240,
	// 	},
	// ],
	meting: {
        server: "netease",
        type: "album",
        id: "376435141",
        api: "https://api.mxin.moe/api/v1/meting",
        preload: "none",
},
	defaultVolume: 0.7,
	defaultMode: "sequence",
});

export interface ResolvedMusicOptions {
	readonly provider: MusicProvider;
	readonly playlist: readonly TrackDescriptor[];
	readonly meting?: MetingMusicConfig;
	readonly defaultVolume: number;
	readonly defaultMode: PlaybackMode;
}

const ABSOLUTE_MEDIA_SOURCE = /^(?:https?:)?\/\//i;
const UNSAFE_SCHEME = /^[a-z][a-z\d+.-]*:/i;

function normalizeMediaSource(value: string): string | null {
	const source = value.trim();
	if (!source) return null;
	if (ABSOLUTE_MEDIA_SOURCE.test(source) || source.startsWith("/")) {
		return source;
	}
	if (UNSAFE_SCHEME.test(source)) return null;
	return `/${source.replace(/^\.\//, "")}`;
}

function normalizeTrack(
	track: TrackDescriptor,
	usedIds: Set<string>,
): TrackDescriptor | null {
	const id = track.id.trim();
	const title = track.title.trim();
	const source = normalizeMediaSource(track.source);
	if (!id || !title || !source || usedIds.has(id)) return null;

	usedIds.add(id);
	const artist = track.artist?.trim() || undefined;
	const cover = track.cover
		? (normalizeMediaSource(track.cover) ?? undefined)
		: undefined;
	const duration =
		typeof track.duration === "number" &&
		Number.isFinite(track.duration) &&
		track.duration > 0
			? track.duration
			: undefined;

	return Object.freeze({ id, title, source, artist, cover, duration });
}

export function clampMusicVolume(value: number, fallback = 0.7): number {
	if (!Number.isFinite(value)) return fallback;
	return Math.min(1, Math.max(0, value));
}

/** 琛ラ綈 meting 閰嶇疆鐨勯粯璁ゅ€硷紙濡?preload 榛樿 "none"锛夛紝璁?ResolvedMusicOptions 鑷寘鍚€?*/
function resolveMetingConfig(
	meting: MetingMusicConfig | undefined,
): MetingMusicConfig | undefined {
	if (!meting) return meting;
	return Object.freeze({ ...meting, preload: meting.preload ?? "none" });
}

export function resolveMusicOptions(
	config: MusicConfig,
): ResolvedMusicOptions | null {
	if (!config.enable) return null;

	const provider: MusicProvider = config.provider ?? "local";

	if (provider === "meting") {
		const id = config.meting?.id?.trim();
		if (!id) return null;
		return Object.freeze({
			provider: "meting",
			playlist: Object.freeze([]),
			meting: resolveMetingConfig(config.meting),
			defaultVolume: clampMusicVolume(config.defaultVolume),
			defaultMode: config.defaultMode,
		});
	}

	let rawTracks: readonly TrackDescriptor[] = [];
	if (provider === "local" || provider === "mixed") {
		rawTracks = config.tracks ?? musicTracks;
	} else if (provider === "custom") {
		rawTracks = config.tracks ?? [];
	}

	const usedIds = new Set<string>();
	const playlist = rawTracks
		.map((track) => normalizeTrack(track, usedIds))
		.filter((track): track is TrackDescriptor => track !== null);

	if (provider === "mixed") {
		const metingId = config.meting?.id?.trim();
		if (playlist.length === 0 && !metingId) return null;
		return Object.freeze({
			provider: "mixed",
			playlist: Object.freeze(playlist),
			meting: resolveMetingConfig(config.meting),
			defaultVolume: clampMusicVolume(config.defaultVolume),
			defaultMode: config.defaultMode,
		});
	}

	if (playlist.length === 0) return null;

	return Object.freeze({
		provider,
		playlist: Object.freeze(playlist),
		defaultVolume: clampMusicVolume(config.defaultVolume),
		defaultMode: config.defaultMode,
	});
}


