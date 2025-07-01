import os
import json
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import vertexai
from vertexai.preview.generative_models import GenerativeModel
import re
from sqlalchemy import create_engine, text
from sqlalchemy.pool import QueuePool
from sqlalchemy.exc import SQLAlchemyError
import uuid

DATABASE_CONN = "mysql+mysqlconnector://root:interview@127.0.0.1:3309/interview"
engine = create_engine(DATABASE_CONN, poolclass=QueuePool,pool_size=10, max_overflow=0)

# Initialize Vertex AI
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/yanghyojun/Downloads/fa-interview-464510-b314020b9d83.json"
vertexai.init(
    project="fa-interview-464510",
    location="us-east4",
)

app = FastAPI(title="AI Interview Practice API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini model
model = GenerativeModel("gemini-2.0-flash-001")

# Pydantic models
class InterviewConfig(BaseModel):
    field: str
    difficulty: str
    questionCount: int

class Question(BaseModel):
    id: str
    question: str
    context: str | None = None

class EvaluationRequest(BaseModel):
    question: str
    answer: str
    field: str
    difficulty: str

class Answer(BaseModel):
    questionId: str
    answer: str
    feedback: str = None
    score: float = None

class ResultsRequest(BaseModel):
    session_id: str
    answers: List[Answer]
    config: InterviewConfig

# Helper functions
def get_field_context(field: str) -> str:
    contexts = {
        "technology": "소프트웨어 개발, 프로그래밍, 시스템 설계, 기술적 문제 해결",
        "business": "비즈니스 전략, 경영, 리더십, 조직 관리 능력",
        "general": "행동 면접 질문, 소프트 스킬, 일반적인 직무 역량",
        "data-science": "데이터 분석, 머신러닝, 통계, 데이터 기반 의사결정"
    }
    return contexts.get(field, "general professional skills")

def get_difficulty_level(difficulty: str) -> str:
    levels = {
        "beginner": "초급, 기본 개념과 기초 지식",
        "intermediate": "중급, 실무 경험과 실용적 응용",
        "advanced": "고급, 고난도 상황, 리더십과 전략적 사고"
    }
    return levels.get(difficulty, "intermediate level")

def extract_json_from_codeblock(text: str) -> str:
    """
    Gemini 응답에서 ```json ... ``` 코드블록 부분만 추출하는 함수
    """
    pattern = r"```json\s*(\[\s*[\s\S]*?\s*\])\s*```"
    match = re.search(pattern, text, re.MULTILINE)
    if match:
        return match.group(1)
    else:
        # 코드블록이 없으면 원문 반환
        return text

# API endpoints
@app.post("/api/generate-questions")
async def generate_questions(config: InterviewConfig):
    try:
        field_context = get_field_context(config.field)
        difficulty_level = get_difficulty_level(config.difficulty)
        
        prompt = f"""
        {config.questionCount}개의 {config.field} 분야 인터뷰 질문을 {config.difficulty} 수준에 맞게 생성해주세요.
        배경 설명: {field_context}
        난이도: {difficulty_level}
        요구사항:
        질문은 {config.difficulty} 수준에 적합해야 합니다.
        {field_context}에 집중해주세요.
        가능하다면 기술적인 질문과 행동면접 질문을 혼합해서 포함해주세요.
        각 질문은 명확하고 구체적이어야 합니다.
        필요할 경우 적절한 배경 설명(컨텍스트)을 제공해주세요.
        응답은 JSON 배열 형태로, 다음 속성을 포함하는 객체들로 구성해주세요:
        - id: 고유 식별자 (String)
        - question: 인터뷰 질문 (String)
        - context: 선택적 배경 설명 (String 또는 null)
        출력 예시:
            [
                {{
                    "id": "1",
                    "question": "당신이 수행했던 가장 어려운 프로젝트에 대해 이야기해 주세요.",
                    "context": "기술적 난관과 문제 해결 방법에 집중해주세요."
                }}
            ]
        """
        
        response = model.generate_content(prompt)
        print("Gemini response raw:", response)  # 👈 Gemini 응답 전체 출력
        
        # Parse the JSON response
        try:
            json_text = extract_json_from_codeblock(response.text)
            questions_data = json.loads(json_text)
            questions = [Question(**q) for q in questions_data]
            return {"questions": questions}
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            fallback_questions = [
                Question(
                    id=str(i+1),
                    question=f"Sample {config.field} question {i+1} for {config.difficulty} level",
                    context=f"This is a {config.difficulty} level question about {field_context}"
                )
                for i in range(config.questionCount)
            ]
            return {"questions": fallback_questions}
    
    except Exception as e:
        print("Error in generate_questions:", e)  # 👈 이 줄 추가
        raise HTTPException(status_code=500, detail=f"Error generating questions: {str(e)}")

@app.post("/api/evaluate-answer")
async def evaluate_answer(evaluation_request: EvaluationRequest):
    try:
        field_context = get_field_context(evaluation_request.field)
        difficulty_level = get_difficulty_level(evaluation_request.difficulty)

        prompt = f"""
        다음 인터뷰 결과를 바탕으로 종합적인 평가 요약을 작성해 주세요.
        
        분야: {results_request.config.field}
        난이도: {results_request.config.difficulty}
        총 질문 수: {results_request.config.questionCount}
        평균 점수: {average_score:.1f}
        
        답변 요약:
        {answers_summary}
        
        JSON 형식으로 다음 내용을 포함해 주세요:
        1. totalQuestions: 질문 총 수
        2. averageScore: 평균 점수
        3. feedback: 전반적인 평가 요약
        4. strengths: 3~5가지 주요 강점
        5. improvements: 3~5가지 개선 사항
        
        형식 예시:
        {{
            "totalQuestions": {results_request.config.questionCount},
            "averageScore": {average_score:.1f},
            "feedback": "전체적으로 훌륭한 성과를 보였습니다...",
            "strengths": ["명확한 의사소통", "관련 사례 제시", "전문적인 태도"],
            "improvements": ["구체적 세부사항 보완", "답변 구조 개선", "결론 강화"]
        }}
        """

        response = model.generate_content(prompt)

        try:
            json_text = extract_json_from_codeblock(response.text)
            feedback_data = json.loads(json_text)

            score = feedback_data.get("score", 75)
            feedback = feedback_data.get("feedback", "평가 피드백이 없습니다.")

        except json.JSONDecodeError:
            score = 75
            feedback = "Your answer shows understanding of the topic. Consider providing more specific examples."

        # 👉 DB 저장
        try:
            with engine.begin() as conn:
                insert_query = text("""
                    INSERT INTO TBL_evaluations (field, level, question, answer, feedback, score, session_id)
                    VALUES (:field, :level, :question, :answer, :feedback, :score, :session_id)
                """)
                conn.execute(insert_query, {
                    "field": evaluation_request.field,
                    "level": evaluation_request.difficulty,
                    "question": evaluation_request.question,
                    "answer": evaluation_request.answer,
                    "feedback": feedback,
                    "score": score,
                    "session_id": str(uuid.uuid4())  # 세션 ID가 없다면 임의 생성 (또는 클라이언트에서 넘기도록 수정)
                })
        except SQLAlchemyError as db_err:
            print("❌ DB insert error:", db_err)

        return {
            "score": score,
            "feedback": feedback
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating answer: {str(e)}")

@app.post("/api/get-results")
async def get_results(results_request: ResultsRequest):
    try:
        # Calculate average score
        scores = [answer.score for answer in results_request.answers if answer.score is not None]
        average_score = sum(scores) / len(scores) if scores else 0
        
        # Generate comprehensive feedback
        answers_summary = "\n".join([
            f"Q: {answer.questionId} - Score: {answer.score} - Answer: {answer.answer[:100]}..."
            for answer in results_request.answers
        ])
        
        prompt = f"""
        다음 인터뷰 결과를 바탕으로 종합적인 평가 요약을 작성해 주세요.
        
        분야: {results_request.config.field}
        난이도: {results_request.config.difficulty}
        총 질문 수: {results_request.config.questionCount}
        평균 점수: {average_score:.1f}
        
        답변 요약:
        {answers_summary}
        
        JSON 형식으로 다음 내용을 포함해 주세요:
        1. totalQuestions: 질문 총 수
        2. averageScore: 평균 점수
        3. feedback: 전반적인 평가 요약
        4. strengths: 3~5가지 주요 강점
        5. improvements: 3~5가지 개선 사항
        
        형식 예시:
        {{
            "totalQuestions": {results_request.config.questionCount},
            "averageScore": {average_score:.1f},
            "feedback": "전체적으로 훌륭한 성과를 보였습니다...",
            "strengths": ["명확한 의사소통", "관련 사례 제시", "전문적인 태도"],
            "improvements": ["구체적 세부사항 보완", "답변 구조 개선", "결론 강화"]
        }}
        """
        
        response = model.generate_content(prompt)
        
        try:
            json_text = extract_json_from_codeblock(response.text)
            result_data = json.loads(json_text)
            result = [Question(**q) for q in result_data]
            return result
        except json.JSONDecodeError:
            # Fallback results
            return {
                "totalQuestions": results_request.config.questionCount,
                "averageScore": average_score,
                "feedback": f"You completed {results_request.config.questionCount} questions with an average score of {average_score:.1f}%",
                "strengths": ["Good communication", "Relevant examples", "Professional demeanor"],
                "improvements": ["More specific details", "Better structure", "Stronger conclusions"]
            }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating results: {str(e)}")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "AI Interview Practice API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)