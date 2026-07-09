"""
Data loader service: loads LLM leaderboard data with 2-hour TTL caching.
Tries GCS bucket first, falls back to HuggingFace dataset.
"""

import os
import time
import pandas as pd
from datasets import load_dataset

# Module-level cache
_cached_data: pd.DataFrame | None = None
_cache_timestamp: float = 0.0
_CACHE_TTL = 2 * 60 * 60  # 2 hours in seconds


def _load_from_gcs() -> pd.DataFrame | None:
    """Attempt to load data from a Google Cloud Storage bucket."""
    bucket_name = os.getenv("BUCKET_NAME")
    if not bucket_name:
        return None

    try:
        from google.cloud import storage

        client = storage.Client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob("leaderboard_data.csv")

        if not blob.exists():
            return None

        content = blob.download_as_text()
        from io import StringIO

        df = pd.read_csv(StringIO(content))
        return df
    except Exception:
        return None


def _load_from_huggingface() -> pd.DataFrame:
    """Load data from the HuggingFace open-llm-leaderboard dataset."""
    dataset = load_dataset("open-llm-leaderboard/contents", split="train")
    df = pd.DataFrame(dataset)
    return df


def _filter_and_sort(df: pd.DataFrame) -> pd.DataFrame:
    """Filter for official, available, non-flagged models and sort by average score."""
    # Apply filters if columns exist
    if "official" in df.columns:
        df = df[df["official"] == True]  # noqa: E712
    if "available_on_hub" in df.columns:
        df = df[df["available_on_hub"] == True]  # noqa: E712
    if "flagged" in df.columns:
        df = df[df["flagged"] == False]  # noqa: E712

    # Sort by average score descending
    if "Average ⬆️" in df.columns:
        df = df.sort_values(by="Average ⬆️", ascending=False)

    df = df.reset_index(drop=True)
    return df


def load_data() -> pd.DataFrame:
    """
    Load LLM leaderboard data with caching (2-hour TTL).
    Tries GCS first, falls back to HuggingFace.

    Returns:
        A pandas DataFrame with filtered and sorted leaderboard data.
    """
    global _cached_data, _cache_timestamp

    current_time = time.time()

    # Return cached data if still valid
    if _cached_data is not None and (current_time - _cache_timestamp) < _CACHE_TTL:
        return _cached_data

    # Try loading from GCS first
    df = _load_from_gcs()

    # Fall back to HuggingFace
    if df is None:
        df = _load_from_huggingface()

    # Filter and sort
    df = _filter_and_sort(df)

    # Update cache
    _cached_data = df
    _cache_timestamp = current_time

    return df
