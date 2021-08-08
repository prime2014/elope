FROM postgres:12

ENV POSTGRES_PASSWORD belindat2014

ENV POSTGRES_DB watchmen

COPY ./utils/postgres/mydb.sql /docker-entrypoint-initdb.d/
