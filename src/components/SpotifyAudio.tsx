import { useEffect, useRef, useState } from "react";

type SpotifyTrack = {
  track: string;
  artist: string;
  album?: string;
  albumImage?: string | null;
  spotifyUri: string;
  spotifyUrl?: string;
  playedAt?: string;
};

type SpotifyData = {
  available: boolean;
  tracks?: SpotifyTrack[];
  spotifyUri?: string;
  track?: string;
  artist?: string;
  album?: string;
  albumImage?: string | null;
  spotifyUrl?: string;
};

type SpotifyController = {
  play: () => void;
  pause: () => void;
  loadUri: (uri: string) => void;
};

type SpotifyIframeApi = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width: string; height: number },
    callback: (controller: SpotifyController) => void,
  ) => void;
};

declare global {
  interface Window {
    SpotifyIframeAPI?: SpotifyIframeApi;
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
  }
}

const spotifyIframeApiUrl = "https://open.spotify.com/embed/iframe-api/v1";

function SpotifyAudio() {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerElementRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const loadedTrackUriRef = useRef<string | null>(null);
  const selectedTrack = tracks[selectedTrackIndex];

  useEffect(() => {
    if (!panelVisible) return;

    function hidePanelOutside(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setPanelVisible(false);
      }
    }

    document.addEventListener("pointerdown", hidePanelOutside);
    return () => document.removeEventListener("pointerdown", hidePanelOutside);
  }, [panelVisible]);

  useEffect(() => {
    let isMounted = true;

    function loadTrack() {
      fetch(
        `${import.meta.env.BASE_URL}data/spotify-now.json?v=${Date.now()}`,
        {
          cache: "no-store",
        },
      )
        .then((response) => {
          if (!response.ok) throw new Error("Spotify data unavailable");
          return response.json() as Promise<SpotifyData>;
        })
        .then((data) => {
          if (!isMounted) return;
          const recentTracks = data.tracks?.length
            ? data.tracks
            : data.available && data.spotifyUri
              ? [data as SpotifyTrack]
              : [];
          if (!recentTracks.length) {
            setError("Nenhuma música recente disponível.");
            return;
          }
          setTracks(recentTracks);
          setError(null);
        })
        .catch(() => {
          if (isMounted) {
            setError("Não foi possível carregar a última música.");
          }
        });
    }

    loadTrack();
    const interval = window.setInterval(loadTrack, 60_000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!selectedTrack?.spotifyUri || !playerElementRef.current) return;
    const spotifyUri = selectedTrack.spotifyUri;

    const createPlayer = (api: SpotifyIframeApi) => {
      if (!playerElementRef.current || controllerRef.current) return;

      api.createController(
        playerElementRef.current,
        { uri: spotifyUri, width: "100%", height: 152 },
        (controller) => {
          controllerRef.current = controller;
          loadedTrackUriRef.current = spotifyUri;
          setPlayerReady(true);
          setError(null);
        },
      );
    };

    if (window.SpotifyIframeAPI) {
      createPlayer(window.SpotifyIframeAPI);
      return;
    }

    window.onSpotifyIframeApiReady = (api) => {
      window.SpotifyIframeAPI = api;
      createPlayer(api);
    };

    if (!document.querySelector(`script[src="${spotifyIframeApiUrl}"]`)) {
      const script = document.createElement("script");
      script.src = spotifyIframeApiUrl;
      script.async = true;
      script.onerror = () =>
        setError("Não foi possível carregar o player do Spotify.");
      document.body.appendChild(script);
    }
  }, [selectedTrack?.spotifyUri]);

  useEffect(() => {
    const uri = selectedTrack?.spotifyUri;
    const controller = controllerRef.current;
    if (
      !playerReady ||
      !uri ||
      !controller ||
      loadedTrackUriRef.current === uri
    ) {
      return;
    }

    controller.pause();
    controller.loadUri(uri);
    loadedTrackUriRef.current = uri;
    if (audioEnabled) controller.play();
  }, [selectedTrack?.spotifyUri, playerReady, audioEnabled]);

  function toggleAudio() {
    const controller = controllerRef.current;
    if (!controller) return;

    if (audioEnabled) controller.pause();
    else controller.play();

    setAudioEnabled(!audioEnabled);
    setError(null);
  }

  function selectTrack(index: number) {
    if (index >= 0 && index < tracks.length) setSelectedTrackIndex(index);
  }

  return (
    <div
      ref={containerRef}
      className="spotify-audio"
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setPanelVisible(true);
      }}
      onPointerDown={(event) => {
        if (event.pointerType === "touch") setPanelVisible(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") setPanelVisible(false);
      }}
    >
      <button
        className="audio-button"
        type="button"
        aria-pressed={audioEnabled}
        title={audioEnabled ? "Pausar áudio" : "Reproduzir áudio"}
        disabled={!playerReady}
        onClick={toggleAudio}
      >
        Áudio: {audioEnabled ? "ON" : "OFF"}
      </button>

      <div
        className={`spotify-player-panel${panelVisible ? " open" : ""}`}
      >
        <div className="spotify-panel-heading">
          <strong>ÚLTIMAS MÚSICAS</strong>
        </div>

        {selectedTrack && (
          <div className="spotify-track-info">
            {selectedTrack.albumImage && (
              <img
                src={selectedTrack.albumImage}
                alt={`Capa do álbum ${selectedTrack.album}`}
              />
            )}
            <div>
              <span>
                MÚSICA {selectedTrackIndex + 1} DE {tracks.length}
              </span>
              <strong>{selectedTrack.track}</strong>
              <small>{selectedTrack.artist}</small>
            </div>
          </div>
        )}

        {tracks.length > 1 && (
          <div className="spotify-track-navigation">
            <button
              type="button"
              disabled={selectedTrackIndex === 0}
              onClick={() => selectTrack(selectedTrackIndex - 1)}
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={selectedTrackIndex === tracks.length - 1}
              onClick={() => selectTrack(selectedTrackIndex + 1)}
            >
              Próxima
            </button>
          </div>
        )}

        <ol className="spotify-track-list">
          {tracks.map((item, index) => (
            <li key={`${item.spotifyUri}-${item.playedAt ?? index}`}>
              <button
                className={index === selectedTrackIndex ? "selected" : ""}
                type="button"
                aria-current={index === selectedTrackIndex ? "true" : undefined}
                onClick={() => selectTrack(index)}
              >
                <strong>{item.track}</strong>
                <span>{item.artist}</span>
              </button>
            </li>
          ))}
        </ol>

        <div ref={playerElementRef} className="spotify-embed" />
        {error && (
          <p className="spotify-error" role="status">
            {error}
          </p>
        )}
        {selectedTrack?.spotifyUrl && (
          <a href={selectedTrack.spotifyUrl} target="_blank" rel="noreferrer">
            Abrir no Spotify
          </a>
        )}
      </div>
    </div>
  );
}

export default SpotifyAudio;
