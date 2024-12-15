from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional, List

from app.services.gemini_service import GeminiService

router = APIRouter(prefix="/api/docs", tags=["documentation"])
gemini_service = GeminiService()

class CodeAnalysisRequest(BaseModel):
    code: str
    language: Optional[str] = "python"

class DocumentationRequest(BaseModel):
    title: str
    content: Dict[str, Any]
    template_type: str = "technical"

class DiagramRequest(BaseModel):
    description: str
    diagram_type: str = "flowchart"

@router.post("/analyze-code")
async def analyze_code(request: CodeAnalysisRequest):
    return await gemini_service.analyze_code(request.code)

@router.post("/create-documentation")
async def create_documentation(request: DocumentationRequest):
    return await gemini_service.create_documentation(
        request.template_type,
        {"title": request.title, **request.content}
    )

@router.post("/generate-diagram")
async def generate_diagram(request: DiagramRequest):
    return await gemini_service.generate_mermaid_diagram(request.description)