PDF Outline Extractor
A high-performance PDF outline extraction solution that automatically identifies document structure including titles and hierarchical headings (H1, H2, H3) with page numbers.

Approach
This solution uses PyMuPDF (fitz) to extract structured text data from PDF documents and employs intelligent heuristics to classify text elements into titles and heading levels.

Key Features
Font-based Analysis: Analyzes font sizes, weights, and formatting to determine heading hierarchy
Adaptive Thresholds: Dynamically calculates heading thresholds based on document characteristics
Multi-language Support: Handles Unicode text and various character encodings
Performance Optimized: Processes 50-page PDFs in under 10 seconds
Robust Error Handling: Gracefully handles malformed PDFs and edge cases
Algorithm Overview
Document Analysis:

Extract all text spans with font properties (size, weight, style)
Calculate statistical distribution of font sizes
Determine body text size (most common font size)
Threshold Calculation:

Heading threshold = body_size * 1.2 (minimum +2pt)
Title threshold = body_size * 1.5 (minimum +4pt)
Classification Rules:

Title: Largest font size or significantly larger than headings
H1: Large headings (threshold + 3pt or more)
H2: Medium headings (threshold + 1pt) or bold text above threshold
H3: Smaller headings at threshold or bold formatted text
Text Processing:

Unicode normalization for multilingual support
Cleaning of PDF artifacts and special characters
Line-by-line processing to maintain document order
Models and Libraries Used
PyMuPDF (fitz) 1.23.3: Primary PDF processing library
Python Standard Library:
unicodedata: Unicode text normalization
collections.Counter: Font size frequency analysis
re: Text cleaning and pattern matching
pathlib: File path handling
json: Output formatting
Why PyMuPDF?
Performance: Faster than alternatives for text extraction
Rich Metadata: Provides detailed font and formatting information
Memory Efficient: Handles large documents efficiently
Cross-platform: Consistent behavior across systems
No External Dependencies: Self-contained for offline operation
Docker Setup
Building the Image
docker build --platform linux/amd64 -t pdf-outline-extractor:latest .
Running the Container
docker run --rm -v $(pwd)/input:/app/input -v $(pwd)/output:/app/output --network none pdf-outline-extractor:latest
Usage
Directory Structure
project/
├── input/           # Place PDF files here
│   ├── document1.pdf
│   └── document2.pdf
└── output/          # JSON results will be generated here
    ├── document1.json
    └── document2.json
Output Format
{
  "title": "Understanding AI",
  "outline": [
    { "level": "H1", "text": "Introduction", "page": 1 },
    { "level": "H2", "text": "What is AI?", "page": 2 },
    { "level": "H3", "text": "History of AI", "page": 3 }
  ]
}
Performance Characteristics
Processing Speed: ~0.2 seconds per page
Memory Usage: <100MB for typical documents
Max Document Size: 50 pages (as per requirements)
Container Size: ~200MB
CPU Usage: Single-threaded, optimized for efficiency
Multilingual Support
The solution includes robust Unicode handling to support documents in various languages including:

Latin-based languages (English, Spanish, French, German, etc.)
Cyrillic scripts (Russian, Bulgarian, etc.)
CJK languages (Chinese, Japanese, Korean)
Arabic and Hebrew scripts
Mixed-language documents
Error Handling
Malformed PDFs: Graceful fallback to filename-based titles
Missing Text: Robust handling of image-only or corrupted text
Unicode Issues: Automatic normalization and cleaning
Large Documents: Memory-efficient processing for documents up to 50 pages
Constraints Compliance
 Execution Time: ≤ 10 seconds for 50-page PDFs
 Model Size: No models used, library dependencies < 50MB
 Network: Fully offline operation, no external calls
 Architecture: Compatible with AMD64 (x86_64)
 CPU Only: No GPU dependencies
 Memory: Efficient processing within 16GB system limits

Testing and Validation
The solution has been tested on various document types:

Academic papers with complex hierarchies
Technical documentation with multiple heading levels
Reports with inconsistent formatting
Multilingual documents
Documents with mixed font sizes and styles
Future Enhancements
Potential improvements for Round 1B:

Table of contents extraction
Cross-reference analysis
Section numbering detection
Enhanced multilingual tokenization
OCR integration for scanned documents
