import os
from typing import List, Dict
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.http import models
from qdrant_client.http.models import PointStruct
import logging

from backend.src.config.settings import settings


class RAGService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        # Initialize sentence transformer model for embeddings
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

        # Initialize Qdrant client
        self.qdrant_client = QdrantClient(
            url=settings.QDRANT_URL or "localhost",
            port=settings.QDRANT_PORT or 6333,
            api_key=settings.QDRANT_API_KEY
        )

        # Initialize the collection for textbook content if it doesn't exist
        self.collection_name = "textbook_content"
        self._init_collection()

    def _init_collection(self):
        """Initialize the Qdrant collection for textbook content"""
        try:
            # Check if collection exists
            self.qdrant_client.get_collection(self.collection_name)
            self.logger.info(f"Collection {self.collection_name} already exists")
        except:
            # Create collection if it doesn't exist
            self.qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(
                    size=384,  # Size of the embedding vectors from all-MiniLM-L6-v2
                    distance=models.Distance.COSINE
                )
            )
            self.logger.info(f"Created collection {self.collection_name}")

    def retrieve_context(self, query: str, top_k: int = 5) -> str:
        """
        Retrieve relevant textbook content based on the user query
        """
        try:
            # Generate embedding for the query
            query_embedding = self.embedding_model.encode([query])[0].tolist()

            # Search for similar content in Qdrant
            search_result = self.qdrant_client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                limit=top_k
            )

            # Extract the content from search results
            context_parts = []
            for result in search_result:
                context_parts.append(result.payload.get("content", ""))

            # Combine the top results as context
            context = " ".join(context_parts)

            self.logger.info(f"Retrieved context for query: {query[:50]}...")
            return context
        except Exception as e:
            self.logger.error(f"Error retrieving context for query '{query}': {str(e)}")
            # Fallback to a generic response
            return "This is a fallback response. The system is currently retrieving textbook content."

    def generate_response(self, query: str, context: str) -> str:
        """
        Generate a response based on the query and retrieved context
        """
        try:
            # In a real implementation, this would use an LLM like OpenAI GPT
            # For now, we'll create a mock implementation that combines the context with the query
            if not context or context.startswith("This is a fallback"):
                return f"Based on the textbook content, I can help answer your question: '{query}'. However, I couldn't find specific content to answer this question in detail right now. Please check other chapters or topics in the Physical AI & Humanoid Robotics textbook."

            response = f"Based on the textbook content, here's what I found about '{query}': {context[:500]}..."
            return response
        except Exception as e:
            self.logger.error(f"Error generating response for query '{query}': {str(e)}")
            return f"I encountered an issue while generating a response for your query: '{query}'. Please try asking in a different way or check other parts of the textbook."

    def add_textbook_content(self, content_id: str, content: str, metadata: Dict = None):
        """
        Add textbook content to the Qdrant collection for retrieval
        """
        try:
            # Generate embedding for the content
            embedding = self.embedding_model.encode([content])[0].tolist()

            # Prepare point for Qdrant
            point = PointStruct(
                id=content_id,
                vector=embedding,
                payload={
                    "content": content,
                    "metadata": metadata or {}
                }
            )

            # Store in Qdrant
            self.qdrant_client.upsert(
                collection_name=self.collection_name,
                points=[point]
            )

            self.logger.info(f"Added textbook content with ID: {content_id}")
        except Exception as e:
            self.logger.error(f"Error adding textbook content with ID '{content_id}': {str(e)}")

    def batch_add_textbook_content(self, contents: List[Dict]):
        """
        Add multiple textbook content pieces at once
        """
        try:
            points = []
            for item in contents:
                content_id = item["id"]
                content = item["content"]
                metadata = item.get("metadata", {})

                # Generate embedding for the content
                embedding = self.embedding_model.encode([content])[0].tolist()

                # Prepare point for Qdrant
                point = PointStruct(
                    id=content_id,
                    vector=embedding,
                    payload={
                        "content": content,
                        "metadata": metadata
                    }
                )

                points.append(point)

            # Store in Qdrant
            self.qdrant_client.upsert(
                collection_name=self.collection_name,
                points=points
            )

            self.logger.info(f"Added {len(contents)} textbook content items")
        except Exception as e:
            self.logger.error(f"Error adding batch of textbook content: {str(e)}")


def load_textbook_content_from_docs():
    """
    Load textbook content from the markdown files in the frontend/docs directory
    This function would typically run during application startup to populate the RAG database
    """
    import os
    import re
    from pathlib import Path

    # This is a simplified version - in practice you'd have more sophisticated parsing
    docs_dir = Path(__file__).parent.parent.parent.parent / "frontend" / "docs" / "chapters"
    rag_service = RAGService()

    if not docs_dir.exists():
        print(f"Docs directory does not exist: {docs_dir}")
        return

    content_list = []
    chapter_files = [f for f in docs_dir.glob("*.md") if f.name != "_category_.json"]

    for file_path in chapter_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

                # Extract title from markdown content
                title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
                title = title_match.group(1) if title_match else file_path.stem

                # Create a content entry
                content_entry = {
                    "id": file_path.stem,
                    "content": f"Chapter: {title}\n\n{content}",
                    "metadata": {
                        "title": title,
                        "chapter": file_path.stem,
                        "source": "textbook"
                    }
                }

                content_list.append(content_entry)
        except Exception as e:
            print(f"Error reading file {file_path}: {str(e)}")

    if content_list:
        rag_service.batch_add_textbook_content(content_list)
        print(f"Loaded {len(content_list)} chapters into the RAG system")
    else:
        print("No content was loaded from docs")