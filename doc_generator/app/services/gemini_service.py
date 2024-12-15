from typing import Dict, Any
import google.generativeai as genai
from fastapi import HTTPException

class GeminiService:
    def __init__(self, model_name: str = 'gemini-pro'):
        self.model = genai.GenerativeModel(model_name)

    async def generate_content(self, prompt: str) -> str:
        """Generate content using Gemini model based on the given prompt"""
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Content generation error: {str(e)}")

    async def analyze_code(self, code: str) -> Dict[str, Any]:
        prompt = f"""
        Lütfen bu kodu detaylı olarak analiz edin ve aşağıdaki formatta yanıt verin:
        1. Kodun amacı ve genel açıklaması
        2. Kullanılan önemli kütüphaneler
        3. Ana fonksiyonlar ve sınıfların açıklaması
        4. Örnek kullanım
        5. İyileştirme önerileri

        Kod:
        {code}
        """
        
        try:
            response = self.model.generate_content(prompt)
            return {"analysis": response.text}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Kod analizi hatası: {str(e)}")

    async def create_documentation(self, template_type: str, content: Dict[str, Any]) -> Dict[str, Any]:
        template_prompts = {
            "technical": """
            Teknik dokümantasyon oluştur:
            Başlık: {title}
            İçerik: {content}
            Bölümler: Genel Bakış, Kurulum, Kullanım, API Referansı, Örnekler
            """,
            "api": """
            API dokümantasyonu oluştur:
            API Adı: {title}
            Endpoint'ler: {endpoints}
            Açıklama: {description}
            Formatlar: Örnek istekler, yanıtlar ve hata kodları
            """
        }

        try:
            prompt = template_prompts[template_type].format(**content)
            response = self.model.generate_content(prompt)
            return {"documentation": response.text}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Dokümantasyon oluşturma hatası: {str(e)}")

    async def generate_mermaid_diagram(self, description: str) -> Dict[str, str]:
        prompt = f"""
        Bu açıklamaya göre bir Mermaid.js iş akışı diyagramı oluşturun.
        Diyagram sözdizimini başında ve sonunda ``` işaretleri olmadan döndürün.
        
        Açıklama:
        {description}
        """
        
        try:
            response = self.model.generate_content(prompt)
            return {"diagram": response.text}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Diyagram oluşturma hatası: {str(e)}")