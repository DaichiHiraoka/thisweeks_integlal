import { h } from 'preact';
import { useEffect } from 'preact/hooks';

export default function PlayerIsland() {
  const params = new URLSearchParams(location.search);
  let sessionId = params.get('session');
  if (!sessionId) {
    sessionId = localStorage.getItem('session_id') || crypto.randomUUID();
    localStorage.setItem('session_id', sessionId);
  }
  const videoId = params.get('video') || 'demo';

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    let player: any;
    let probTimer: any;
    let logTimer: any;
    const sent = new Set<number>();
    (window as any).onYouTubeIframeAPIReady = () => {
      player = new (window as any).YT.Player('yt-player', {
        videoId,
        events: {
          onStateChange: (e: any) => {
            if (e.data === (window as any).YT.PlayerState.PLAYING) {
              probTimer = setInterval(async () => {
                const t = Math.floor(player.getCurrentTime());
                if (sent.has(t)) return;
                sent.add(t);
                await fetch('/api/problems', {
                  method: 'POST',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({
                    session_id: sessionId,
                    question_tex: 'auto',
                    answer_tex: 'auto',
                    video_id: videoId,
                    t_sec: t,
                    source: 'auto',
                  }),
                });
              }, 3000);
              logTimer = setInterval(async () => {
                const percent = Math.floor(
                  (player.getCurrentTime() / player.getDuration()) * 100
                );
                await fetch('/api/watchlog', {
                  method: 'PUT',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({
                    session_id: sessionId!,
                    video_id: videoId,
                    watched_percent: percent,
                  }),
                });
              }, 10000);
            } else {
              clearInterval(probTimer);
              clearInterval(logTimer);
            }
          },
        },
      });
    };
    return () => {
      clearInterval(probTimer);
      clearInterval(logTimer);
      (window as any).onYouTubeIframeAPIReady = undefined;
    };
  }, []);

  return <div id="yt-player"></div>;
}
