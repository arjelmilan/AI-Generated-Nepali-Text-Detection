#!/bin/bash
source ~/anaconda3/etc/profile.d/conda.sh
conda activate ai
uvicorn main:app --reload --port 8000
