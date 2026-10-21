"use client";

import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { step } from "@/lib/carousel";
import { formatTime } from "@/lib/time";

const tracks = site.tracks;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Turntable player. Clicking the record toggles playback; the tonearm swings onto the record while playing.
 * Nothing plays until the visitor asks; failed loads say so instead of failing silently.
 */
export function Player() {
  const audio = useRef<HTMLAudioElement>(null);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [failed, setFailed] = useState(false);
  const resume = useRef(false);
  const track = tracks[i];

  const play = () => {
    const a = audio.current;
    if (!a) return;
    a.volume = volume;
    a.play().then(() => { setPlaying(true); setFailed(false); }, () => { setFailed(true); setPlaying(false); });
  };
  const pause = () => { audio.current?.pause(); setPlaying(false); };
  const toggle = () => (playing ? pause() : play());
  const go = (d: number) => {
    resume.current = playing;
    setI((n) => step(n, d, tracks.length));
    setFailed(false);
    setTime(0);
    setDuration(0);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: only when the track changes
  useEffect(() => {
    if (resume.current) play();
  }, [i]);

  const pct = duration ? (time / duration) * 100 : 0;
  return (
    <div className="deck card" data-playing={playing}>
      <div className="deck-stage">
        <button type="button" className="deck-record" onClick={toggle} aria-label={playing ? "Pause record" : "Play record"}>
          <span className="deck-label" aria-hidden="true">{pad(i + 1)}</span>
        </button>
        <span className="deck-arm" aria-hidden="true"><i /></span>
        <span className="deck-cue" aria-hidden="true">CLICK VINYL</span>
      </div>
      <div className="deck-info">
        <div>
          <p className="eyebrow deck-now">NOW PLAYING · {pad(i + 1)} / {pad(tracks.length)}</p>
          <p className="deck-title">{track.title}</p>
          <p className="deck-artist">{track.artist}</p>
        </div>
        <div className="deck-ctl">
          <button type="button" onClick={() => go(-1)} aria-label="Previous track"><SkipBack size={15} aria-hidden="true" /></button>
          <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}</button>
          <button type="button" onClick={() => go(1)} aria-label="Next track"><SkipForward size={15} aria-hidden="true" /></button>
          <button type="button" onClick={() => setMuted((m) => !m)} aria-pressed={muted} aria-label="Mute">{muted ? <VolumeX size={15} aria-hidden="true" /> : <Volume2 size={15} aria-hidden="true" />}</button>
          <input
            className="range deck-vol" type="range" aria-label="Volume" min={0} max={1} step={0.05} value={muted ? 0 : volume}
            style={{ "--fill": `${(muted ? 0 : volume) * 100}%` } as React.CSSProperties}
            onChange={(e) => { const v = Number(e.target.value); setVolume(v); setMuted(v === 0); if (audio.current) audio.current.volume = v; }}
          />
        </div>
      </div>
      <div className="deck-seek mono">
        <span>{formatTime(time)}</span>
        <input
          className="range" type="range" aria-label="Seek" min={0} max={duration || 0} step={1} value={Math.min(time, duration || 0)} disabled={!duration}
          style={{ "--fill": `${pct}%` } as React.CSSProperties}
          onChange={(e) => { const t = Number(e.target.value); if (audio.current) audio.current.currentTime = t; setTime(t); }}
        />
        <span>{formatTime(duration)}</span>
      </div>
      <p role="status" className="deck-status">{failed ? "This track couldn't load. Try the next one." : ""}</p>
      <audio
        ref={audio} src={track.src} preload="metadata" muted={muted}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => { resume.current = true; go(1); }}
        onError={() => { setFailed(true); setPlaying(false); }}
      />
    </div>
  );
}
