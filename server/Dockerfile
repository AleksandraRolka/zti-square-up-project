FROM openjdk:17-jdk-alpine
ARG JAR_FILE=out/artifacts/server_jar/*.jar
COPY ${JAR_FILE} server.jar
ENTRYPOINT ["java","-jar","/server.jar"]