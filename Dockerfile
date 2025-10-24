
FROM python:3.11-slim


WORKDIR /app


COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY backend.py .
COPY templates/ ./templates/
COPY static/ ./static/


EXPOSE 5005


CMD ["python", "backend.py"]
