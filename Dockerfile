FROM node:14.17.3-alpine as builder

WORKDIR /usr/src/app

#env 
ARG REACT_APP_TITLE=PhuQuocPhotos-Admin
ARG REACT_APP_ENVIROMENT=production
ARG REACT_APP_BASE_URL=https://api.phuquocphoto.com/api/v1
ARG REACT_APP_IDENTITY_API_NAME=pqphotos
ARG PORT=8000

ENV REACT_APP_TITLE=PhuQuocPhotos-Admin
ENV REACT_APP_ENVIROMENT=production
ENV REACT_APP_BASE_URL=https://api.phuquocphoto.com/api/v1
ENV REACT_APP_IDENTITY_API_NAME=pqphotos
ENV PORT=8000

# Copying source files
COPY . .

# Installing yarn package & Building app
RUN yarn install && \
    yarn global add env-cmd && \
    env-cmd -f .env.production yarn build

FROM node:14.17.3-alpine

# Create app directory
WORKDIR /usr/src/app

# copy from the builder
COPY --from=builder /usr/src/app/ .

RUN ls -la

EXPOSE 8000

# Start the app
CMD npm run start