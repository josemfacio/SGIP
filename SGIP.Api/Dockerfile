FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["SGIP.Api/SGIP.Api.csproj", "SGIP.Api/"]
COPY ["SGIP.Application/SGIP.Application.csproj", "SGIP.Application/"]
COPY ["SGIP.Domain/SGIP.Domain.csproj", "SGIP.Domain/"]
COPY ["SGIP.Infrastructure/SGIP.Infrastructure.csproj", "SGIP.Infrastructure/"]
RUN dotnet restore "SGIP.Api/SGIP.Api.csproj"

COPY . .
RUN dotnet publish "SGIP.Api/SGIP.Api.csproj" \
    --configuration Release \
    --output /app/publish \
    --no-restore \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080
COPY --from=build /app/publish .
USER $APP_UID
ENTRYPOINT ["dotnet", "SGIP.Api.dll"]

