# Teletrace Docs

Here you will find the source code and configurations for Teletrace's documentation, the docs site is generated using [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).

## Running locally

To run the docs side locally, first make sure you have python 3 installed, then from the `website` directory:

```bash
# create a virtualenv for the mkdocs dependencies
python -m venv venv
source venv/bin/activate

# install all dependencies
pip install -r requirements.txt

# run the docs
mkdocs serve
```

Open <http://localhost:8000> in your browser.
