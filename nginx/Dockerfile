# Use the official NGINX image as the base image
FROM nginx:alpine

# Copy the NGINX configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the NGINX port
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
