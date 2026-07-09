"""
Translator service: detects language and translates text to English.
Uses langdetect for detection and deep-translator for translation.
"""

from langdetect import detect
from deep_translator import GoogleTranslator


def translate_to_english(text: str) -> tuple[str, str]:
    """
    Detect the language of the input text and translate it to English if needed.

    Args:
        text: The input text to translate.

    Returns:
        A tuple of (translated_text, detected_language_code).
        If the text is already in English or an error occurs, returns (original_text, 'en').
    """
    try:
        detected_lang = detect(text)

        if detected_lang == "en":
            return text, "en"

        translated = GoogleTranslator(source=detected_lang, target="en").translate(text)
        return translated, detected_lang

    except Exception:
        return text, "en"
