from typing import Dict, Any, List
from pydantic import BaseModel

class DocumentationTemplate(BaseModel):
    name: str
    sections: List[str]
    prompts: Dict[str, str]

class DocGeneratorService:
    def __init__(self):
        self.templates = {
            "technical": DocumentationTemplate(
                name="Technical Documentation",
                sections=[
                    "Overview",
                    "Installation",
                    "Usage",
                    "API Reference",
                    "Examples",
                    "Troubleshooting"
                ],
                prompts={
                    "overview": "Provide a comprehensive overview of {project_name} including its main features and use cases.",
                    "installation": "Detail the step-by-step installation process for {project_name}.",
                    "usage": "Explain how to use {project_name} with code examples and common scenarios.",
                }
            ),
            "api": DocumentationTemplate(
                name="API Documentation",
                sections=[
                    "Introduction",
                    "Authentication",
                    "Endpoints",
                    "Request/Response Examples",
                    "Error Codes",
                    "Rate Limits"
                ],
                prompts={
                    "introduction": "Create an introduction for the {api_name} API including its purpose and key features.",
                    "authentication": "Explain the authentication process for {api_name} API.",
                    "endpoints": "Document the endpoint {endpoint_name} with its parameters, responses, and examples.",
                }
            ),
            "user_guide": DocumentationTemplate(
                name="User Guide",
                sections=[
                    "Getting Started",
                    "Features",
                    "Tutorials",
                    "FAQ",
                    "Tips and Tricks"
                ],
                prompts={
                    "getting_started": "Create a beginner-friendly getting started guide for {product_name}.",
                    "features": "Detail the key features of {product_name} with examples of how to use them.",
                    "tutorials": "Create a step-by-step tutorial for {feature_name}.",
                }
            ),
            "workflow": DocumentationTemplate(
                name="Workflow Documentation",
                sections=[
                    "Process Overview",
                    "Steps",
                    "Roles and Responsibilities",
                    "Diagrams",
                    "Checklists"
                ],
                prompts={
                    "process": "Document the workflow process for {workflow_name}.",
                    "steps": "Break down the steps involved in {workflow_name}.",
                    "roles": "Define the roles and responsibilities in {workflow_name}.",
                }
            )
        }

    def get_template(self, template_type: str) -> DocumentationTemplate:
        if template_type not in self.templates:
            raise ValueError(f"Template type {template_type} not found")
        return self.templates[template_type]

    def list_templates(self) -> List[str]:
        return list(self.templates.keys())

    def get_template_sections(self, template_type: str) -> List[str]:
        return self.get_template(template_type).sections

    async def generate_section_content(self, 
                                    template_type: str, 
                                    section: str, 
                                    context: Dict[str, Any],
                                    gemini_service) -> str:
        template = self.get_template(template_type)
        if section not in template.prompts:
            raise ValueError(f"Section {section} not found in template {template_type}")
        
        prompt = template.prompts[section].format(**context)
        response = await gemini_service.generate_content(prompt)
        return response