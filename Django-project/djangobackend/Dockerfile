# 1. Base image
FROM python:3.11-slim

# 2. Prevent Python from writing .pyc files and buffer outputs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Set working directory
WORKDIR /app

# 4. Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# 5. Copy project code
COPY . /app/

# 6. Expose port and run server
EXPOSE 8000
CMD ["gunicorn", "djangobackend.wsgi:application", "--bind", "0.0.0.0:8000"]