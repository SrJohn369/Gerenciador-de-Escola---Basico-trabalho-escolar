FROM python:3.12.0

WORKDIR /home/workStation

COPY ./requirements.txt .

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD [ "python3", "manage.py", "runserver", "0.0.0.0:8000" ]