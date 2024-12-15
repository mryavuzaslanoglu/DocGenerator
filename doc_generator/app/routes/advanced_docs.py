from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from ..services.doc_generator import DocGeneratorService
from ..services.gemini_service import GeminiService

router = APIRouter(prefix="/api/advanced", tags=["advanced documentation"])

doc_service = DocGeneratorService()
gemini_service = GeminiService()

class TemplateRequest(BaseModel):
    template_type: str
    section: str
    context: Dict[str, Any]

class WorkflowRequest(BaseModel):
    workflow_name: str
    steps: List[str]
    participants: List[str]
    description: str

@router.get("/templates")
async def list_templates():
    """Mevcut tüm şablonları listele"""
    return {
        "templates": doc_service.list_templates(),
        "descriptions": {
            "technical": "Teknik dokümantasyon için kapsamlı şablon",
            "api": "API dokümantasyonu için özel şablon",
            "user_guide": "Son kullanıcı kılavuzu şablonu",
            "workflow": "İş akışı dokümantasyonu şablonu"
        }
    }

@router.get("/templates/{template_type}/sections")
async def get_template_sections(template_type: str):
    """Belirli bir şablonun bölümlerini getir"""
    try:
        sections = doc_service.get_template_sections(template_type)
        return {"sections": sections}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/generate-section")
async def generate_section(request: TemplateRequest):
    """Şablon bölümü için içerik oluştur"""
    try:
        content = await doc_service.generate_section_content(
            request.template_type,
            request.section,
            request.context,
            gemini_service
        )
        return {"content": content}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/workflow-diagram")
async def create_workflow_diagram(request: WorkflowRequest):
    """İş akışı diyagramı oluştur"""
    diagram_description = f"""
    İş Akışı: {request.workflow_name}
    Açıklama: {request.description}
    Adımlar: {', '.join(request.steps)}
    Katılımcılar: {', '.join(request.participants)}
    """
    
    try:
        diagram = await gemini_service.generate_mermaid_diagram(diagram_description)
        return diagram
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))