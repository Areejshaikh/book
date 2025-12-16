# Embedding Pipeline for Docusaurus URLs

This project implements an embedding pipeline that crawls Docusaurus website URLs, extracts and cleans text content, chunks it into 500-1000 token segments, generates embeddings using Cohere multilingual-v3 model, and stores them in Qdrant Cloud with metadata.

## Prerequisites

- Python 3.11+
- Pip package manager
- Cohere API key
- Qdrant Cloud account and API key

## Setup

1. Clone the repository
2. Navigate to the backend directory: `cd backend`
3. Create a virtual environment: `python -m venv venv`
4. Activate the virtual environment:
   - On Linux/Mac: `source venv/bin/activate`
   - On Windows: `venv\Scripts\activate`
5. Install dependencies: `pip install -r requirements.txt`
6. Create a `.env` file based on `.env.example` and add your API keys

## Usage

### Running the Main Pipeline

To run the complete pipeline:
```bash
python -m src.embedding_pipeline.main
```

### Running the Example Script

To run the example:
```bash
python examples/basic_usage.py
```

### Running Tests

To run the test suite:
```bash
pytest tests/
```

### Testing Retrieval

To test retrieval functionality:
```bash
python test_retrieval.py
```

## Architecture

The pipeline follows these steps:
1. `url_fetcher.py` - Fetches all URLs to process
2. `text_cleaner.py` - Extracts clean text from each URL
3. `chunker.py` - Breaks text into 500-1000 token segments
4. `embedder.py` - Generates embeddings using Cohere
5. `vector_store.py` - Stores embeddings in Qdrant with metadata

## Configuration

- URL list: Defined in environment variable `SOURCE_URLS` in your `.env` file
- Chunk size: Configured in `chunker.py` (500-1000 token range)
- Qdrant collection: Named `rag_embeddings` by default
- Logging: Set to INFO level by default

### Environment Variables

Create a `.env` file with the following variables:
```
COHERE_API_KEY=your_cohere_api_key_here
QDRANT_API_KEY=your_qdrant_api_key_here
QDRANT_URL=your_qdrant_cluster_url_here
SOURCE_URLS=https://areejshaikh.github.io/book/,https://areejshaikh.github.io/book/docs/intro
```

## Project Structure

```
backend/
├── src/
│   └── embedding_pipeline/
│       ├── __init__.py
│       ├── main.py
│       ├── config.py
│       ├── url_fetcher.py
│       ├── text_cleaner.py
│       ├── chunker.py
│       ├── embedder.py
│       ├── vector_store.py
│       ├── models.py
│       ├── logging_config.py
│       └── utils.py
├── tests/
│   └── test_embedding_pipeline.py
├── examples/
│   └── basic_usage.py
├── requirements.txt
├── .env.example
├── README.md
├── test_pipeline.py
└── test_retrieval.py
```

## Testing

The project includes unit tests and integration tests:

1. Run all tests: `pytest tests/`
2. Run specific test file: `python -m pytest tests/test_embedding_pipeline.py -v`
3. Test pipeline functionality: `python test_pipeline.py`
4. Test retrieval functionality: `python test_retrieval.py`

## API and Models

The system uses several data models defined in `models.py`:
- `DocumentChunk`: Represents a segment of content extracted from a URL
- `EmbeddingVector`: Numerical representation of text content
- `URLProcessingRecord`: Record of processing status for each URL

## Troubleshooting

- If getting API errors: Verify your API keys in `.env`
- If URLs aren't loading: Check if the site structure has changed
- If embeddings aren't storing: Verify Qdrant connection details
- Check the `logs/` directory for detailed execution logs