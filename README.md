# Dataspecer

This repository was forked from the main Dataspecer repository to implement changes for the [Data specification navigator](https://github.com/Kwantigon/DataSpecificationNavigator) project.

## Implemented feature

Each package now has a "Ask in navigator" button in its dropdown menu, which redirects the user to the Data specification navigator with the correct parameters in the URL.

## Installation

Clone the repository
```bash
git clone https://github.com/Kwantigon/dataspecer.git
```
```
cd dataspecer
```

Build the image with the correct URL to the Data specification navigator.
```
docker build --build-arg VITE_DATASPEC_NAVIGATOR_URL="http://localhost:8080" -t dataspecer .
```

Make sure the `VITE_DATASPEC_NAVIGATOR_URL` is a valid data specification navigator URL.

Run the built image.
```bash
docker run -p 3000:80 dataspecer:latest
```
