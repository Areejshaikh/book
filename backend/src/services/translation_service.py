import hashlib
from datetime import datetime, timedelta
from typing import Optional
from backend.src.database import SessionLocal
from backend.src.models.translation_cache import TranslationCache


class TranslationService:
    def __init__(self, cache_duration_hours: int = 24):
        self.db = SessionLocal()
        self.cache_duration = timedelta(hours=cache_duration_hours)

    def translate_content(self, content: str, target_language: str = "ur") -> str:
        """
        Translate content to the target language with caching
        """
        try:
            # Generate hash of source content to use as cache key
            content_hash = hashlib.sha256(f"{content}:{target_language}".encode()).hexdigest()
            
            # Check if translation is already cached
            cached_translation = self._get_cached_translation(content_hash, target_language)
            
            if cached_translation and cached_translation.expires_at > datetime.utcnow():
                # Return cached translation if it's still valid
                return cached_translation.translated_content
            
            # If not cached or expired, perform translation
            translated_content = self._perform_translation(content, target_language)
            
            # Cache the new translation
            self._cache_translation(content_hash, content, target_language, translated_content)
            
            return translated_content
        finally:
            self.db.close()

    def _get_cached_translation(self, content_hash: str, target_language: str) -> Optional[TranslationCache]:
        """
        Retrieve cached translation if it exists
        """
        translation = self.db.query(TranslationCache).filter(
            TranslationCache.source_content_hash == content_hash,
            TranslationCache.target_language == target_language
        ).first()
        
        return translation

    def _cache_translation(self, content_hash: str, source_content: str, target_language: str, translated_content: str):
        """
        Store translation in cache
        """
        # Check if a cache entry already exists and update it, or create a new one
        existing_cache = self.db.query(TranslationCache).filter(
            TranslationCache.source_content_hash == content_hash,
            TranslationCache.target_language == target_language
        ).first()
        
        if existing_cache:
            # Update existing cache entry
            existing_cache.translated_content = translated_content
            existing_cache.created_at = datetime.utcnow()
            existing_cache.expires_at = datetime.utcnow() + self.cache_duration
        else:
            # Create new cache entry
            cache_entry = TranslationCache(
                source_content_hash=content_hash,
                source_language="en",  # Assuming English source
                target_language=target_language,
                translated_content=translated_content,
                expires_at=datetime.utcnow() + self.cache_duration
            )
            self.db.add(cache_entry)
        
        self.db.commit()

    def _perform_translation(self, content: str, target_language: str) -> str:
        """
        Perform the actual translation (placeholder implementation)
        In a real implementation, this would use a translation service like Google Translate API,
        or a library like transformers for Urdu translation
        """
        try:
            # Placeholder implementation - in reality this would call a translation API
            if target_language.lower() == "ur":
                # This is a placeholder. In reality, you would use a proper Urdu translation service/API
                # For now, we'll just return the original content with a note
                return f"[TRANSLATION PLACEHOLDER] Original: {content}"
            else:
                return content  # Return original if target language is not supported
        except Exception as e:
            print(f"Translation service error: {e}")
            # Fallback behavior as required by T060
            return self._fallback_translation(content, target_language)

    def _fallback_translation(self, content: str, target_language: str) -> str:
        """
        Fallback translation when primary service is unavailable
        """
        # Return the original content with a note that translation is unavailable
        return f"[TRANSLATION UNAVAILABLE] Original: {content}"