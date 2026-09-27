import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

import requests

load_dotenv()

SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_RECENTLY_PLAYED_URL = (
    "https://api.spotify.com/v1/me/player/recently-played"
)
OUTPUT_FILE = Path("public/data/spotify-now.json")

def get_spotify_access_token(
    client_id: str,
    client_secret: str,
    refresh_token: str,
) -> str:
    """
    Troca o refresh token por um access token temporário.
    """
    response = requests.post(
        SPOTIFY_TOKEN_URL,
        data={
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
        },
        auth=(client_id, client_secret),
        timeout=30,
    )

    if not response.ok:
        print(
            "Erro ao renovar o token do Spotify.",
            file=sys.stderr,
        )
        print(
            f"Status HTTP: {response.status_code}",
            file=sys.stderr,
        )
        print(
            response.text,
            file=sys.stderr,
        )

        response.raise_for_status()

    token_data = response.json()
    access_token = token_data.get("access_token")

    if not access_token:
        raise RuntimeError(
            "A resposta do Spotify não contém access_token."
        )

    return access_token


def get_recent_tracks(access_token: str) -> list[dict]:
    """
    Consulta as dez músicas reproduzidas mais recentemente.
    """
    response = requests.get(
        SPOTIFY_RECENTLY_PLAYED_URL,
        headers={
            "Authorization": f"Bearer {access_token}",
        },
        params={
            "limit": 10,
        },
        timeout=30,
    )

    if not response.ok:
        print(
            "Erro ao consultar o histórico do Spotify.",
            file=sys.stderr,
        )
        print(
            f"Status HTTP: {response.status_code}",
            file=sys.stderr,
        )
        print(
            response.text,
            file=sys.stderr,
        )

        response.raise_for_status()

    data = response.json()
    items = data.get("items", [])

    return items


def format_track_data(history_item: dict) -> dict:
    """
    Transforma a resposta grande do Spotify em um JSON pequeno
    contendo apenas o que será usado pelo site.
    """
    track = history_item["track"]

    artists = [
        artist["name"]
        for artist in track.get("artists", [])
    ]

    album_images = track.get("album", {}).get("images", [])

    album_image = (
        album_images[0]["url"]
        if album_images
        else None
    )

    return {
        "available": True,
        "track": track["name"],
        "artist": ", ".join(artists),
        "album": track.get("album", {}).get("name"),
        "albumImage": album_image,
        "spotifyUri": track["uri"],
        "spotifyUrl": track.get(
            "external_urls",
            {},
        ).get("spotify"),
        "playedAt": history_item.get("played_at"),
        "updatedAt": history_item.get("played_at"),
    }


def save_json(data: dict) -> None:
    """
    Salva os dados dentro da pasta public/data.
    """
    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with OUTPUT_FILE.open(
        "w",
        encoding="utf-8",
    ) as json_file:
        json.dump(
            data,
            json_file,
            ensure_ascii=False,
            indent=2,
        )

        json_file.write("\n")


def main() -> None:
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
    refresh_token = os.getenv("SPOTIFY_REFRESH_TOKEN")

    print("Obtendo access token do Spotify...")

    access_token = get_spotify_access_token(
        client_id=client_id,
        client_secret=client_secret,
        refresh_token=refresh_token,
    )

    print("Consultando a última música reproduzida...")

    history_items = get_recent_tracks(access_token)

    if not history_items:
        output_data = {
            "available": False,
            "tracks": [],
            "message": "Nenhuma música recente encontrada.",
        }

        save_json(output_data)

        print("Nenhuma música recente encontrada.")
        return

    tracks = [format_track_data(item) for item in history_items]
    output_data = {
        "available": True,
        "tracks": tracks,
    }

    save_json(output_data)

    print(
        "Arquivo atualizado: "
        f"{tracks[0]['track']} - {tracks[0]['artist']}"
    )


if __name__ == "__main__":
    main()
