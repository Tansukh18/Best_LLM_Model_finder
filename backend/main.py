"""
Perfect LLM Model Finder - FastAPI Backend

Helps users find the best open-source LLM for their use case by leveraging
Gemini AI for benchmark selection and HuggingFace leaderboard data.
"""

import os
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from services.translator import translate_to_english
from services.data_loader import load_data
from services.gemini_service import get_recommended_benchmarks

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Perfect LLM Model Finder API",
    description="Find the best open-source LLM for your use case",
    version="1.0.0",
)

# CORS middleware - allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Pydantic Models ----------


class FindModelRequest(BaseModel):
    task: str
    model_size: float = Field(default=15, description="Maximum model size in billions of parameters")


class ModelInfo(BaseModel):
    model_name: str
    full_name: str
    params_b: Optional[float] = None
    average_score: Optional[float] = None
    architecture: Optional[str] = None
    license: Optional[str] = None
    benchmark_scores: dict = {}


class FindModelResponse(BaseModel):
    overall_best: Optional[ModelInfo] = None
    size_filtered_best: Optional[ModelInfo] = None
    recommended_benchmarks: list[str] = []
    detected_language: str = "en"
    was_translated: bool = False


# ---------- Helper Functions ----------


def _extract_model_info(row, benchmarks: list[str]) -> ModelInfo:
    """Extract model information from a DataFrame row."""
    # Get model name (short name from full path)
    full_name = str(row.get("fullname", row.get("model_name_for_query", "")))
    model_name = full_name.split("/")[-1] if "/" in full_name else full_name

    # Collect benchmark scores
    benchmark_scores = {}
    for bm in benchmarks:
        if bm in row.index:
            score = row[bm]
            if score is not None and str(score) != "nan":
                benchmark_scores[bm] = round(float(score), 4)

    return ModelInfo(
        model_name=model_name,
        full_name=full_name,
        params_b=round(float(row.get("#Params (B)", 0)), 2) if row.get("#Params (B)") is not None else None,
        average_score=round(float(row.get("Average ⬆️", 0)), 4) if row.get("Average ⬆️") is not None else None,
        architecture=str(row.get("Architecture", "")) if row.get("Architecture") is not None else None,
        license=str(row.get("Hub License", "")) if row.get("Hub License") is not None else None,
        benchmark_scores=benchmark_scores,
    )


def _sort_by_benchmarks(df, benchmarks: list[str]):
    """Sort DataFrame by the average of the given benchmark columns."""
    valid_benchmarks = [bm for bm in benchmarks if bm in df.columns]

    if not valid_benchmarks:
        # Fall back to Average ⬆️ if no valid benchmarks
        if "Average ⬆️" in df.columns:
            return df.sort_values(by="Average ⬆️", ascending=False)
        return df

    # Calculate mean of benchmark scores for sorting
    df = df.copy()
    df["_benchmark_avg"] = df[valid_benchmarks].mean(axis=1)
    df = df.sort_values(by="_benchmark_avg", ascending=False)
    df = df.drop(columns=["_benchmark_avg"])
    return df


# ---------- Endpoints ----------


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "Perfect LLM Model Finder API is running"}


@app.post("/api/find-model", response_model=FindModelResponse)
async def find_model(request: FindModelRequest):
    """
    Find the best LLM model for a given task.

    1. Translates the task to English if needed.
    2. Loads leaderboard data (with caching).
    3. Gets recommended benchmarks from Gemini AI.
    4. Sorts models by benchmark performance.
    5. Returns overall best + size-filtered best.
    """
    try:
        # Step 1: Translate task if needed
        translated_task, detected_lang = translate_to_english(request.task)
        was_translated = detected_lang != "en"

        # Step 2: Load leaderboard data
        df = load_data()

        if df.empty:
            raise HTTPException(status_code=503, detail="Unable to load leaderboard data")

        # Step 3: Get recommended benchmarks from Gemini
        recommended_benchmarks = get_recommended_benchmarks(translated_task)

        # Step 4: Sort by recommended benchmarks
        sorted_df = _sort_by_benchmarks(df, recommended_benchmarks)

        # Step 5: Get overall best model
        overall_best = None
        if not sorted_df.empty:
            overall_best = _extract_model_info(sorted_df.iloc[0], recommended_benchmarks)

        # Step 6: Get size-filtered best model
        size_filtered_best = None
        if "#Params (B)" in sorted_df.columns:
            size_filtered = sorted_df[sorted_df["#Params (B)"] <= request.model_size]
            if not size_filtered.empty:
                size_filtered_best = _extract_model_info(size_filtered.iloc[0], recommended_benchmarks)

        return FindModelResponse(
            overall_best=overall_best,
            size_filtered_best=size_filtered_best,
            recommended_benchmarks=recommended_benchmarks,
            detected_language=detected_lang,
            was_translated=was_translated,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


class FeedbackRequest(BaseModel):
    session_id: str
    vote: int
    comment: Optional[str] = None


@app.post("/api/feedback")
async def save_feedback(request: FeedbackRequest):
    """Save feedback to a local CSV file."""
    try:
        import csv
        filepath = os.path.join(os.path.dirname(__file__), "feedback_data.csv")
        file_exists = os.path.exists(filepath)
        
        with open(filepath, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(["session_id", "vote", "comment"])
            writer.writerow([request.session_id, request.vote, request.comment])
        
        print(f"Feedback received: session_id={request.session_id}, vote={request.vote}, comment={request.comment}")
        return {"status": "success", "message": "Feedback submitted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save feedback: {str(e)}")

