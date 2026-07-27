# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets from Stage 1 to Nginx default static folder
COPY --from=build /app/dist /usr/share/nginx/html

# Use a custom config with SPA history fallback - without this, refreshing
# on a client-side route (e.g. /auctions/5) 404s because nginx looks for a
# literal file at that path instead of serving index.html.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]