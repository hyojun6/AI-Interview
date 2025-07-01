# AI Interview Practice Backend

FastAPI backend for the AI Interview Practice application using Google's Gemini AI.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up Google Cloud credentials:
   - Create a service account in Google Cloud Console
   - Download the JSON key file
   - Update the path in `main.py` to point to your credentials file
   - Or set the environment variable: `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/key.json"`

3. Update the project configuration in `main.py`:
   - Set your Google Cloud project ID
   - Set the appropriate location/region

## Running the Server

```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `POST /api/generate-questions` - Generate interview questions
- `POST /api/evaluate-answer` - Evaluate user answers
- `POST /api/get-results` - Get comprehensive results
- `GET /api/health` - Health check

## Environment Variables

You can set these environment variables:
- `GOOGLE_APPLICATION_CREDENTIALS` - Path to your service account key file
- `GOOGLE_CLOUD_PROJECT` - Your Google Cloud project ID
- `GOOGLE_CLOUD_LOCATION` - Your preferred location (e.g., us-east4)