"""
Gemini AI service: recommends relevant benchmarks for a given task.
Uses Google's Gemini 1.5 Flash model with conservative generation settings.
"""

import ast
import os
from pathlib import Path

import google.generativeai as genai

# Lazy-initialized model
_model = None


def _get_model():
    """Lazy-initialize the Gemini model using GEMINI_KEY env var."""
    global _model
    if _model is None:
        api_key = os.getenv("GEMINI_KEY")
        if not api_key:
            raise ValueError("GEMINI_KEY environment variable is not set")

        genai.configure(api_key=api_key)

        generation_config = {
            "temperature": 0,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 50,
        }

        _model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config,
        )
    return _model


def _load_prompt_templates() -> tuple[str, str]:
    """Load the benchmark selection prompt and benchmark list from files."""
    prompts_dir = Path(__file__).parent.parent / "prompts"

    benchmark_select_path = prompts_dir / "benchmark_select.txt"
    benchmark_list_path = prompts_dir / "benchmark_list.txt"

    with open(benchmark_select_path, "r") as f:
        benchmark_select = f.read()

    with open(benchmark_list_path, "r") as f:
        benchmark_list = f.read()

    return benchmark_select, benchmark_list


def get_recommended_benchmarks(task: str) -> list[str]:
    """
    Get recommended benchmarks for a given task using Gemini AI.
    Falls back to a keyword-based heuristic if GEMINI_KEY is not set or if generation fails.

    Args:
        task: The task description to find relevant benchmarks for.

    Returns:
        A list of benchmark names.
    """
    api_key = os.getenv("GEMINI_KEY")
    
    if api_key:
        try:
            model = _get_model()
            benchmark_select_template, benchmark_list = _load_prompt_templates()

            # Format the prompt with benchmark list and user input
            prompt = benchmark_select_template.format(
                benchmarks=benchmark_list,
                input=task,
            )

            response = model.generate_content(prompt)
            response_text = response.text.strip()

            # Parse the response as a Python list
            benchmarks = ast.literal_eval(response_text)

            if isinstance(benchmarks, list) and len(benchmarks) > 0:
                return benchmarks
        except Exception:
            pass

    # Keyword Heuristics Fallback (if no API key or API call failed)
    task_lower = task.lower()
    recommendations = []

    if any(k in task_lower for k in ["math", "geometry", "calculus", "calculate", "equation", "number", "physics", "arithmetic", "formula"]):
        recommendations.append("MATH Lvl 5")
    if any(k in task_lower for k in ["code", "program", "law", "medicine", "doctor", "expert", "technical", "engineering", "science", "biology"]):
        recommendations.append("MMLU-PRO")
    if any(k in task_lower for k in ["translate", "language", "multilingual", "spanish", "french", "german", "chinese", "translation"]):
        recommendations.append("MUSR")
    if any(k in task_lower for k in ["creative", "reasoning", "logic", "puzzle", "complex", "think", "explain"]):
        recommendations.append("BBH")
    if any(k in task_lower for k in ["qa", "question", "answer", "chatbot", "search", "retrieve", "information", "query"]):
        recommendations.append("GPQA")
    if any(k in task_lower for k in ["follow", "instruction", "structure", "format", "constraint", "causality", "deduce"]):
        recommendations.append("IFEval")

    if not recommendations:
        # Default to some standard general benchmarks
        recommendations = ["GPQA", "IFEval"]

    return recommendations

