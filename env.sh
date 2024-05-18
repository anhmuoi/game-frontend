#!/bin/bash

if [[ "${env}" = "Production" ]]; then
	cp .env.production.js env.js
elif [[ "${env}" = "Staging" ]]; then
	cp .env.staging.js env.js
else
	cp .env.development.js env.js
fi