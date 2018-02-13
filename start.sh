#!/bin/bash

export PORT=5205

cd  ~/www/memory
./bin/memory stop || true
./bin/memory start

