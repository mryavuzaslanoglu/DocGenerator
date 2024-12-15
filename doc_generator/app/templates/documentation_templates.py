class DocumentationTemplates:
    @staticmethod
    def get_technical_doc_template():
        return {
            "title": "",
            "description": "",
            "sections": [
                "Genel Bakış",
                "Kurulum",
                "Kullanım",
                "API Referansı",
                "Örnekler"
            ]
        }
    
    @staticmethod
    def get_api_doc_template():
        return {
            "title": "",
            "description": "",
            "endpoints": [],
            "authentication": "",
            "examples": []
        }